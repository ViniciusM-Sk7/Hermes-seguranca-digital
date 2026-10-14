<template>
  <main>
    <h1>Teste de estudo</h1>

    <button
      v-if="!attempt"
      @click="start"
      :disabled="loading"
    >
      {{ loading ? "Iniciando..." : "Iniciar tentativa" }}
    </button>

    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>

    <div v-if="attempt && currentQuestion && !finished">
      <p>Caminho: {{ attempt.path }}</p>
      <p>Nível: {{ attempt.level }}</p>
      <p>
        Questão {{ currentIndex + 1 }} de {{ attempt.questions.length }}
      </p>
      <p>Pontuação: {{ score }}</p>

      <hr />

      <h2>{{ currentQuestion.question }}</h2>

      <div v-if="currentQuestion.options">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          @click="answer(currentQuestion.id, index)"
          :disabled="answered"
        >
          {{ String.fromCharCode(65 + index)+ ')' }} {{ option }}
        </button>
      </div>

      <div v-else>
        <button
          @click="answer(currentQuestion.id, true)"
          :disabled="answered"
        >
          Verdadeiro
        </button>

        <button
          @click="answer(currentQuestion.id, false)"
          :disabled="answered"
        >
          Falso
        </button>
      </div>

      <div v-if="result">
        <hr />

        <p>
          Resultado:
          {{ result.correct ? "Acertou!" : "Errou!" }}
        </p>

        <p>
          Pontos recebidos: {{ result.points }}
        </p>

        <p>
          Pontuação total: {{ result.score }}
        </p>

        <button @click="nextQuestion">
          {{ result.completed ? "Finalizar" : "Próxima questão" }}
        </button>
      </div>
    </div>

    <div v-if="finished">
      <h2>Tentativa concluída!</h2>

      <p>
        Pontuação final: {{ finalScore }}
      </p>

      <p>
        Questões respondidas: {{ answeredCount }}
      </p>

      <button @click="reset">
        Nova tentativa
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref } from "vue";

import {
  startAttempt,
  answerQuestion,
  getAttempt
} from "../services/api";

import type {
  StudyAttempt,
  AnswerResult
} from "../types/study";

const attempt = ref<StudyAttempt | null>(null);
const result = ref<AnswerResult | null>(null);
const route = useRoute();

const loading = ref(false);
const answered = ref(false);
const errorMessage = ref("");

const currentIndex = ref(0);
const score = ref(0);
const finished = ref(false);

const finalScore = ref(0);
const answeredCount = ref(0);

const currentQuestion = computed(() => {
  if (!attempt.value) {
    return null;
  }

  return attempt.value.questions[currentIndex.value];
});

async function start() {
  loading.value = true;
  errorMessage.value = "";

  attempt.value = null;
  result.value = null;
  answered.value = false;
  currentIndex.value = 0;
  score.value = 0;
  finished.value = false;
  finalScore.value = 0;
  answeredCount.value = 0;

  try {
    const path = String(route.query.path);
    const level = Number(route.query.level);
    const amount = Number(route.query.amount);

    attempt.value = await startAttempt(path, level, amount);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Erro ao iniciar tentativa.";
    }
  } finally {
    loading.value = false;
  }
}

async function answer(
  questionId: string,
  selectedAnswer: unknown
) {
  errorMessage.value = "";

  try {
      if (!attempt.value) {
      return;
    }

    result.value = await answerQuestion(
      attempt.value.attemptId,
      questionId,
      selectedAnswer
    );

    answered.value = true;
    score.value = result.value.score;
    answeredCount.value++;

  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Erro ao responder questão.";
    }
  }
}

async function nextQuestion() {
  if (result.value?.completed) {
    try {
        if (!attempt.value) {
        return;
      }

      const data = await getAttempt(
        attempt.value.attemptId
      );

      finalScore.value = data.score;
      answeredCount.value = data.answeredQuestions.length;
      finished.value = true;
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        errorMessage.value = error.message;
      } else {
        errorMessage.value = "Erro ao consultar tentativa.";
      }
    }

    return;
  }

  currentIndex.value++;
  result.value = null;
  answered.value = false;
}

function reset() {
  attempt.value = null;
  result.value = null;
  answered.value = false;
  currentIndex.value = 0;
  score.value = 0;
  finished.value = false;
  finalScore.value = 0;
  answeredCount.value = 0;
  errorMessage.value = "";
}
</script>
