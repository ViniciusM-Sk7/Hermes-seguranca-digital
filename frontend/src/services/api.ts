import type {
  StudyAttempt,
  AnswerResult,
  AttemptDetails
} from "../types/study";

const API_URL = "/api";

export function getImageUrl(image: string): string {
  return `${API_URL.replace(/\/api$/, "")}${image}`;
}

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro na comunicação com a API.");
  }

  return data;
}

export async function startAttempt(
  path: string,
  level: number,
  amount: number
): Promise<StudyAttempt> {
  return apiRequest(`/attempts/${path}/${level}/start`, {
    method: "POST",
    body: JSON.stringify({
      amount
    })
  });
}

export async function answerQuestion(
  attemptId: string,
  questionId: string,
  answer: unknown
): Promise<AnswerResult> {
  return apiRequest(`/attempts/${attemptId}/answer`, {
    method: "POST",
    body: JSON.stringify({
      questionId,
      answer
    })
  });
}

export async function getAttempt(
  attemptId: string
): Promise<AttemptDetails> {
  return apiRequest(`/attempts/${attemptId}`);
}