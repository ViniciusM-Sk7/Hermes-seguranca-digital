import { Question } from "../types/question";

export function checkAnswer(
  question: Question,
  answer: unknown
): boolean {
  switch (question.type) {
    case "multiple-choice":
    case "true-false":
    case "fill_blank":
      return answer === question.correctAnswer;

    case "multiple-select":
      if (!Array.isArray(answer)) {
        return false;
      }

      const correctAnswers = question.correctAnswers ?? [];

      return (
        answer.length === correctAnswers.length &&
        answer.every((value: number) =>
          correctAnswers.includes(value)
        )
      );

    case "ordering":
      if (!Array.isArray(answer)) {
        return false;
      }

      const correctOrder = question.correctOrder ?? [];

      return (
        answer.length === correctOrder.length &&
        answer.every(
          (value: number, index: number) =>
            value === correctOrder[index]
        )
      );

    default:
      return false;
  }
}