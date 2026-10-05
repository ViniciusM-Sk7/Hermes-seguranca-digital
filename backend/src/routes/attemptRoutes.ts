import { Router } from "express";
import { getQuestionsByPath } from "../data/questionData";
import { StudyAttempt } from "../models/StudyAttempt";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkAnswer } from "../services/questionService";

const router = Router();

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

router.post("/:path/:level/start", authMiddleware, async (req, res) => {
  try {
    const path = String(req.params.path);
    const level = Number(req.params.level);
    const amount = Number(req.body.amount);

    if (!Number.isInteger(level) || level < 1) {
      return res.status(400).json({
        message: "Nível inválido."
      });
    }

    if (!Number.isInteger(amount) || amount < 1) {
      return res.status(400).json({
        message: "A quantidade de questões deve ser um número inteiro maior que zero."
      });
    }

    const questions = getQuestionsByPath(path);

    if (!questions) {
    return res.status(404).json({
        message: "Caminho de estudo não encontrado."
    });
    }

    const levelQuestions = questions.filter(
      (question) => question.level === level
    );

    if (levelQuestions.length === 0) {
      return res.status(404).json({
        message: "Nenhuma questão encontrada para este nível."
      });
    }

    if (amount > levelQuestions.length) {
      return res.status(400).json({
        message: `O nível possui apenas ${levelQuestions.length} questões disponíveis.`
      });
    }

    const selectedQuestions = shuffle(levelQuestions).slice(0, amount);

    const questionIds = selectedQuestions.map(
      (question) => question.id
    );

    const attempt = await StudyAttempt.create({
      userId: req.user!.userId,
      path,
      level,
      questionIds,
      answeredQuestions: [],
      score: 0,
      completed: false
    });

    const publicQuestions = selectedQuestions.map((question) => {
      const {
        correctAnswer,
        correctAnswers,
        correctOrder,
        ...publicQuestion
      } = question;

      return publicQuestion;
    });

    return res.status(201).json({
      attemptId: attempt._id,
      path: attempt.path,
      level: attempt.level,
      amount: publicQuestions.length,
      score: attempt.score,
      completed: attempt.completed,
      questions: publicQuestions
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao iniciar tentativa."
    });
  }
});

router.post(
  "/:attemptId/answer",
  authMiddleware,
  async (req, res) => {
    try {
      const { attemptId } = req.params;
      const { questionId, answer } = req.body;

      if (!questionId || answer === undefined) {
        return res.status(400).json({
          message: "questionId e answer são obrigatórios."
        });
      }

      const attempt = await StudyAttempt.findOne({
        _id: attemptId,
        userId: req.user!.userId
      });

      if (!attempt) {
        return res.status(404).json({
          message: "Tentativa não encontrada."
        });
      }

      const questions = getQuestionsByPath(attempt.path);

    if (!questions) {
    return res.status(404).json({
        message: "Caminho de estudo não encontrado."
    });
    }

      if (attempt.completed) {
        return res.status(400).json({
          message: "Esta tentativa já foi concluída."
        });
      }

      if (!attempt.questionIds.includes(questionId)) {
        return res.status(400).json({
          message: "Esta questão não pertence a esta tentativa."
        });
      }

      const alreadyAnswered = attempt.answeredQuestions.some(
        (item) => item.questionId === questionId
      );

      if (alreadyAnswered) {
        return res.status(400).json({
          message: "Esta questão já foi respondida."
        });
      }

      const question = questions.find(
        (item) =>
          item.id === questionId &&
          item.level === attempt.level
      );

      if (!question) {
        return res.status(404).json({
          message: "Questão não encontrada."
        });
      }

      const correct = checkAnswer(question, answer);

      const points = correct ? question.points ?? 0 : 0;

      attempt.answeredQuestions.push({
        questionId,
        correct,
        points
      });

      attempt.score += points;

      if (
        attempt.answeredQuestions.length ===
        attempt.questionIds.length
      ) {
        attempt.completed = true;
      }

      await attempt.save();

      return res.status(200).json({
        correct,
        points,
        score: attempt.score,
        completed: attempt.completed
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro ao registrar resposta."
      });
    }
  }
);

router.get("/:attemptId", authMiddleware, async (req, res) => {
  try {
    const attemptId = String(req.params.attemptId);

    const attempt = await StudyAttempt.findOne({
      _id: attemptId,
      userId: req.user!.userId
    });

    if (!attempt) {
      return res.status(404).json({
        message: "Tentativa não encontrada."
      });
    }

    return res.status(200).json({
      attemptId: attempt._id,
      path: attempt.path,
      level: attempt.level,
      questionIds: attempt.questionIds,
      answeredQuestions: attempt.answeredQuestions,
      score: attempt.score,
      completed: attempt.completed,
      createdAt: attempt.createdAt,
      updatedAt: attempt.updatedAt
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao consultar tentativa."
    });
  }
});

export default router;