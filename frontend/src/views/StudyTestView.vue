<template>
  <main>
    <h1>Teste de estudo</h1>

    <button @click="start" :disabled="loading">
      {{ loading ? "Iniciando..." : "Iniciar tentativa" }}
    </button>

    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>

    <div v-if="attempt">
      <p>Caminho: {{ attempt.path }}</p>
      <p>Nível: {{ attempt.level }}</p>
      <p>Pontuação: {{ attempt.score }}</p>

      <hr />

      <div
        v-for="question in attempt.questions"
        :key="question.id"
      >
        <h2>{{ question.question }}</h2>

        <div v-if="question.options">
          <button
            v-for="(option, index) in question.options"
            :key="index"
            @click="answer(question.id, index)"
            :disabled="answered"
          >
            {{ index }} - {{ option }}
          </button>
        </div>

        <div v-else>
          <button
            @click="answer(question.id, true)"
            :disabled="answered"
          >
            Verdadeiro
          </button>

          <button
            @click="answer(question.id, false)"
            :disabled="answered"
          >
            Falso
          </button>
        </div>
      </div>

      <p v-if="result">
        Resultado: {{ result.correct ? "Acertou!" : "Errou!" }}
      </p>

      <p v-if="result">
        Pontos recebidos: {{ result.points }}
      </p>

      <p v-if="result">
        Pontuação total: {{ result.score }}
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  startAttempt,
  answerQuestion
} from "../services/api";

const attempt = ref<any>(null);
const result = ref<any>(null);
const loading = ref(false);
const answered = ref(false);
const errorMessage = ref("");

async function start() {
  loading.value = true;
  errorMessage.value = "";
  result.value = null;
  answered.value = false;

  try {
    attempt.value = await startAttempt("phishing", 1, 1);
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

async function answer(questionId: string, selectedAnswer: unknown) {
  errorMessage.value = "";

  try {
    result.value = await answerQuestion(
      attempt.value.attemptId,
      questionId,
      selectedAnswer
    );

    answered.value = true;
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Erro ao responder questão.";
    }
  }
}
</script>