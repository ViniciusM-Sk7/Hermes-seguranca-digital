import { Router } from "express";
import { getQuestionsByPath } from "../data/questionData";
import { StudyAttempt } from "../models/StudyAttempt";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkAnswer } from "../services/questionService";
import { User } from "../models/User";

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

      let selectedQuestions;

    if (level === 1) {
      const levelQuestions = questions.filter(
        (question) => question.level === 1
      );

      if (levelQuestions.length < 5) {
        return res.status(400).json({
          message: "O nível 1 precisa ter pelo menos 5 questões."
        });
      }

      selectedQuestions = shuffle(levelQuestions).slice(0, 5);
    }

    if (level === 2) {
      const level2Questions = questions.filter(
        (question) => question.level === 2
      );

      const level1Questions = questions.filter(
        (question) => question.level === 1
      );

      if (level2Questions.length < 3 || level1Questions.length < 2) {
        return res.status(400).json({
          message: "Não há questões suficientes para montar o nível 2."
        });
      }

      const newQuestions = shuffle(level2Questions).slice(0, 3);
      const previousQuestions = shuffle(level1Questions).slice(0, 2);

      selectedQuestions = [
        ...newQuestions,
        ...previousQuestions
      ];
    }

    if (level === 3) {
      const level3Questions = questions.filter(
        (question) => question.level === 3
      );

      const level2Questions = questions.filter(
        (question) => question.level === 2
      );

      const previousQuestions = questions.filter(
        (question) => question.level === 1 || question.level === 2
      );

      if (
        level3Questions.length < 3 ||
        level2Questions.length < 1 ||
        previousQuestions.length < 2
      ) {
        return res.status(400).json({
          message: "Não há questões suficientes para montar o nível 3."
        });
      }

      const newQuestions = shuffle(level3Questions).slice(0, 3);

      const level2Question = shuffle(level2Questions)[0];

      const remainingPreviousQuestions = previousQuestions.filter(
        (question) => question.id !== level2Question.id
      );

      const anyPreviousQuestion =
        shuffle(remainingPreviousQuestions)[0];

      selectedQuestions = [
        ...newQuestions,
        level2Question,
        anyPreviousQuestion
      ];
    }

    if (!selectedQuestions || selectedQuestions.length !== 5) {
      return res.status(400).json({
        message: "Não foi possível montar a atividade."
      });
    }

    selectedQuestions = shuffle(selectedQuestions);

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
        (item) => item.id === questionId
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

      if (points > 0) {
        await User.findByIdAndUpdate(
          req.user!.userId,
          {
            $inc: {
              points
            }
          }
        );
      }

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