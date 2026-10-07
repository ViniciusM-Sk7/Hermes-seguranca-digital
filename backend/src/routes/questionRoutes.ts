import { Router } from "express";

import { getQuestionsByPath } from "../data/questionData";
import { Question } from "../types/question";

const router = Router();

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

router.get("/:path/:level", (req, res) => {
  const path = String(req.params.path);
  const level = Number(req.params.level);
  const amount = Number(req.query.amount);

  if (!Number.isInteger(level) || level < 1) {
    return res.status(400).json({
      message: "Nível inválido."
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

  /*
   * Se amount não for informado, retornamos apenas
   * a quantidade disponível no nível.
   */
  if (amount === undefined || Number.isNaN(amount)) {
    return res.status(200).json({
      path,
      level,
      availableQuestions: levelQuestions.length
    });
  }

  if (!Number.isInteger(amount) || amount < 1) {
    return res.status(400).json({
      message: "A quantidade de questões deve ser um número inteiro maior que zero."
    });
  }

  if (amount > levelQuestions.length) {
    return res.status(400).json({
      message: `O nível possui apenas ${levelQuestions.length} questões disponíveis.`
    });
  }

  const selectedQuestions = shuffle(levelQuestions)
    .slice(0, amount)
    .map((question: Question) => {
      const {
        correctAnswer,
        correctAnswers,
        correctOrder,
        ...publicQuestion
      } = question;

      return publicQuestion;
    });

  return res.status(200).json({
    path,
    level,
    amount: selectedQuestions.length,
    questions: selectedQuestions
  });
});

export default router;
