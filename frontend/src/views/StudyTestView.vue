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

      <div v-if="!attempt" class="start-container">
        <button
          class="start-button"
          @click="start"
          :disabled="loading"
        >
          {{ loading ? "Iniciando..." : "Iniciar tentativa" }}
        </button>

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>
      </div>

      <div v-if="attempt && currentQuestion && !finished" class="game-question">
      <h1>Teste de {{ attempt.path }}</h1>        
      <p>Nível: {{ attempt.level }}</p>
      <p>
        Questão {{ currentIndex + 1 }} / {{ attempt.questions.length }}
      </p>
      <p>Pontuação: {{ score }}</p>
      <hr />

      <section class="game-card">
        <div class="question-content">
          <h2>{{ currentQuestion.question }}</h2>
        </div>

        <div class="answers-content">
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

        </div>

      </section>

      <div v-if="result" class="result-card">

        <div
          class="result-header"
          :class="result.correct ? 'result-success' : 'result-error'"
        >
          <span class="result-icon">
            {{ result.correct ? '✓' : '✕' }}
          </span>

          <div>
            <h2>{{ result.correct ? "Muito bem!" : "Não foi dessa vez!" }}</h2>
            <p>
              {{ result.correct
                ? "Você acertou a questão."
                : "Continue estudando e tente novamente nas próximas questões."
              }}
            </p>
          </div>
        </div>

        <div class="result-stats">
          <div class="result-stat">
            <span class="stat-label">Pontos Ganhos</span>
            <strong>+{{ result.correct ? currentQuestion.points ?? 0 : 0}} pontos</strong>
          </div>
        </div>

        <button class="next-button" @click="nextQuestion">
          {{ result.completed ? "Ver resultado final" : "Próxima questão" }}
          <span aria-hidden="true">→</span>
        </button>

      </div>  

      </div>
      
      <div v-if="finished" class="game-card">
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

      <footer class="footer">
        <p>{{ new Date().getFullYear() }} Hermes. Aprenda a navegar na internet com mais segurança.</p>
      </footer>
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

  .footer {
    margin-top: auto;
    padding: 24px 7%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;

    border-top: 1px solid #ded8cf;
    background: #fff;
    color: #77716a;
    text-align: center;
    font-size: 13px;
  }

  .footer p {
    margin: 0;
  }

  @media (max-width: 600px) {
    .footer {
      padding: 20px;
    }
  }

  .game-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
    gap: 24px;

    padding: 30px;
    margin-bottom: 20px;

    border: 1px solid #ded8cf;
    border-radius: 16px;
    background: #fff;
    color: #302d29;
  }

  .question-content {
    display: flex;
    align-items: center;
    padding: 20px;
    background: #f3f0eb;
    border-radius: 12px;
    min-width: 0;
  }

  .question-content h2 {
    margin: 0;
    font-size: 24px;
    line-height: 1.5;
  }

  .answers-content {
    min-width: 0;
  }

  .answers-content > div {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .answers-content button {
    width: 100%;
    box-sizing: border-box;
    padding: 14px 16px;

    border: 2px solid #ded8cf;
    border-radius: 10px;

    background: #f3f0eb;
    color: #302d29;

    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s ease,
    border-color 0.2s ease;
  }

  .answers-content button:hover:not(:disabled) {
    background: #e5ded4;
  }

  .answers-content button.correct {
    background: #d1fae0;
    border-color: #22a05a;
    color: #166534;
  }

  .answers-content button.incorrect {
    background: #fee2e2;
    border-color: #dc2626;
    color: #991b1b;
  }

  .answers-content button:disabled {
    cursor: default;
  }

  @media (max-width: 600px) {
    .game-card {
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 16px;
    }

    .question-content {
      padding: 16px;
    }

    .question-content h2 {
      font-size: 20px;
    }
  }

  .game-question{
    background-color: #302d29;
    color: #fee2e2;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    padding: 32px 24px;
    box-sizing: border-box;
  }

  @media (max-width: 600px) {
    .game-card {
      grid-template-columns: 1fr;
      gap: 24px;
      padding: 20px;
    }
  }

  .result-card {
    margin: 24px 0;
    padding: 24px;
    border: 1px solid #ded8cf;
    border-radius: 16px;
    background: #fff;
    color: #302d29;
    box-shadow: 0 4px 12px rgba(48, 45, 41, 0.05);
  }

  .result-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px;
    border-radius: 12px;
  }

  .result-success {
    background: #e7f6eb;
    color: #21683a;
  }

  .result-error {
    background: #fcebea;
    color: #a52c2c;
  }

  .result-icon {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.8);
    font-size: 26px;
    font-weight: 700;
  }

  .result-header h2 {
    margin: 0 0 5px;
    font-size: 21px;
  }

  .result-header p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
  }

  .result-stats {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin: 20px 0;
  }

  .result-stat {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 18px;
    border: 1px solid #ded8cf;
    border-radius: 12px;
    background: #faf9f7;
  }

  .stat-label {
    color: #77716a;
    font-size: 13px;
  }

  .result-stat strong {
    font-size: 28px;
    color: #51463d;
  }

  .next-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    padding: 14px 20px;
    border: none;
    border-radius: 10px;
    background: #51463d;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .next-button:hover {
    background: #3d342d;
  }

  @media (max-width: 600px) {
    .result-card {
      padding: 16px;
    }

    .result-header {
      align-items: flex-start;
      padding: 14px;
    }

    .result-stats {
      gap: 10px;
    }

    .result-stat {
      padding: 12px;
    }

    .result-stat strong {
      font-size: 24px;
    }
  }

  .start-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 24px;
  }

  .start-button {
    padding: 16px 36px;
    border: none;
    border-radius: 12px;
    background: #2f6b4f;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }

  .start-button:hover:not(:disabled) {
    background: #24563e;
    transform: translateY(-2px);
  }

  .start-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error-message {
    color: #dc2626;
    text-align: center;
    margin: 0;
  }

  </style>