<template>
  <main class="game-page">
    <header class="topbar">
      <RouterLink to="/home" class="brand">
        <span class="brand-icon">H</span>
        <span>Hermes</span>
      </RouterLink>

      <RouterLink to="/home" class="back-link">
        Voltar
      </RouterLink>
    </header>
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

      <section class="game-card">

      <h2>{{ currentQuestion.question }}</h2>

      <div v-if="currentQuestion.options">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          @click="answer(currentQuestion.id, index)"
          :disabled="answered"
          :class="{
            correct: answered && result?.correct && selectedAnswer === index,
            incorrect: answered && result && !result.correct && selectedAnswer === index
          }"
        >
          {{ String.fromCharCode(65 + index) + ')' }} {{ option }}
        </button>
      </div>

      <div v-else>
        <button
          @click="answer(currentQuestion.id, true)"
          :disabled="answered"
          :class="{
            correct: answered && result?.correct && selectedAnswer === true,
            incorrect: answered && result && !result.correct && selectedAnswer === true
          }"
        >
          Verdadeiro
        </button>

        <button
          @click="answer(currentQuestion.id, false)"
          :disabled="answered"
          :class="{
            correct: answered && result?.correct && selectedAnswer === false,
            incorrect: answered && result && !result.correct && selectedAnswer === false
          }"
        >
          Falso
        </button>
      </div>

      </section>

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

const selectedAnswer = ref<unknown>(null);

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
  answerValue: unknown
) {
  if (answered.value || !attempt.value) {
    return;
  }

  errorMessage.value = "";
  selectedAnswer.value = answerValue;

  try {
    result.value = await answerQuestion(
      attempt.value.attemptId,
      questionId,
      answerValue
    );

    answered.value = true;
    score.value = result.value.score;
    answeredCount.value++;
  } catch (error) {
    selectedAnswer.value = null;
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

<style scoped>
.game-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f3f0eb;
  color: #302d29;
}

.topbar {
  min-height: 76px;
  padding: 16px 7%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid #ded8cf;
  background: #fff;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #51463d;
  font-size: 20px;
  font-weight: 700;
}

.brand-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #51463d;
  color: white;
  font-size: 21px;
  font-weight: 700;
}

.back-link {
  color: #51463d;
  font-size: 14px;
  font-weight: 600;
}

.back-link:hover {
  text-decoration: underline;
}

.game-content {
  width: min(100% - 40px, 760px);
  margin: 0 auto;
  padding: 48px 0 64px;
  flex: 1;
}

.page-heading {
  margin-bottom: 28px;
}

.eyebrow {
  color: #77716a;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.page-heading h1 {
  margin: 6px 0;
  font-size: clamp(30px, 5vw, 38px);
  font-weight: 700;
  letter-spacing: -1px;
}

.page-heading p {
  color: #77716a;
  font-size: 15px;
}

.game-card {
  border: 1px solid #ded8cf;
  border-radius: 16px;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 25px;
  margin-bottom: 20px;
}

.game-card button {
  padding: 12px 18px;
  border: 2px solid #ded8cf;
  border-radius: 10px;
  background-color: #f3f0eb;
  color: #302d29;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.game-card button:hover:not(:disabled) {
  background-color: #e5ded4;
}

.game-card button.correct {
  background-color: #d1fae0;
  border-color: #22a05a;
  color: #166534;
}

.game-card button.incorrect {
  background-color: #fee2e2;
  border-color: #dc2626;
  color: #991b1b;
}

.game-card button:disabled {
  cursor: default;
}

</style>