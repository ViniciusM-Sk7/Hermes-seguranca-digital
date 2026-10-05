import senhasData from "./questions/senhas.json";
import phishingData from "./questions/phishing.json";
import golpesDigitaisData from "./questions/golpes-digitais.json";

import { Question } from "../types/question";

const questionData: Record<string, Question[]> = {
  senhas: senhasData as Question[],
  phishing: phishingData as Question[],
  "golpes-digitais": golpesDigitaisData as Question[]
};

export function getQuestionsByPath(path: string): Question[] | null {
  return questionData[path] ?? null;
}