export interface StudyQuestion {
  id: string;
  level: number;
  type: string;
  question: string;
  options?: string[];
  points?: number;
  image?: string;
  imageAlt?: string;
}

export interface StudyAttempt {
  attemptId: string;
  path: string;
  level: number;
  amount: number;
  score: number;
  completed: boolean;
  questions: StudyQuestion[];
}

export interface AnswerResult {
  correct: boolean;
  correctAnswer?: number | boolean;
  points: number;
  score: number;
  completed: boolean;
}

export interface AttemptDetails {
  attemptId: string;
  path: string;
  level: number;
  questionIds: string[];
  answeredQuestions: {
    questionId: string;
    correct: boolean;
    points: number;
  }[];
  score: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}