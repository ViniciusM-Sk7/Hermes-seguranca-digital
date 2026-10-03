export interface Question {
  id: string;
  level: number;
  type: string;
  question: string;

  options?: string[];

  correctAnswer?: number | boolean | string;

  correctAnswers?: number[];

  correctOrder?: number[];

  points?: number;

  image?: string;

  imageAlt?: string;
}