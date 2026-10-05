import { Router } from "express";
import questionsData from "../data/questions/senhas.json";
import { Question } from "../types/question";
import { checkAnswer } from "../services/questionService";

const questions = questionsData as Question[];

const router = Router();

router.post("/senhas", (req, res) => {
  const { questionId, answer } = req.body;

  if (!questionId || answer === undefined) {
    return res.status(400).json({
      message: "questionId e answer são obrigatórios."
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

  return res.status(200).json({
    correct,
    points
  });
});

export default router;