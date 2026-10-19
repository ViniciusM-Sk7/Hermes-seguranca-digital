<template>
  <div class="tutorial-overlay" @click.self="closeTutorial">
    <section
      class="tutorial-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
    >
      <header class="tutorial-header">
        <span class="tutorial-brand">
          <span class="brand-icon">H</span>
          Hermes
        </span>

        <button
          class="tutorial-skip"
          type="button"
          @click="closeTutorial"
        >
          Pular tutorial
        </button>
      </header>

      <div class="tutorial-progress" aria-label="Progresso do tutorial">
        <span
          v-for="(step, index) in steps"
          :key="step.title"
          class="progress-segment"
          :class="{ active: index <= currentStep }"
        />
      </div>

      <div class="tutorial-content">
        <div class="tutorial-illustration">
          <span>{{ currentTutorialStep.icon }}</span>
        </div>

        <span class="tutorial-step-label">
          ETAPA {{ currentStep + 1 }} DE {{ steps.length }}
        </span>

        <h2 id="tutorial-title">
          {{ currentTutorialStep.title }}
        </h2>

        <p class="tutorial-description">
          {{ currentTutorialStep.description }}
        </p>

        <ul class="tutorial-tips">
          <li
            v-for="tip in currentTutorialStep.tips"
            :key="tip"
          >
            <span class="tip-check">✓</span>
            <span>{{ tip }}</span>
          </li>
        </ul>
      </div>

      <footer class="tutorial-footer">
        <button
          v-if="currentStep > 0"
          class="previous-button"
          type="button"
          @click="previousStep"
        >
          Voltar
        </button>
        <span v-else class="footer-spacer" />

        <button
          class="next-button"
          type="button"
          @click="nextStep"
        >
          {{
            currentStep === steps.length - 1
              ? "Começar a aprender"
              : "Próxima etapa"
          }}
          <span aria-hidden="true">
            {{ currentStep === steps.length - 1 ? "✓" : "→" }}
          </span>
        </button>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const emit = defineEmits<{
  (event: "close"): void;
}>();

const currentStep = ref(0);

const steps = [
  {
    icon: "🛡️",
    title: "Bem-vindo ao Hermes!",
    description:
      "Aprenda a navegar pela internet com mais segurança, reconhecendo riscos e desenvolvendo hábitos digitais melhores.",
    tips: [
      "Aprenda no seu próprio ritmo.",
      "Descubra como se proteger de ameaças digitais."
    ]
  },
  {
    icon: "🧭",
    title: "Escolha seu caminho",
    description:
      "Você pode estudar diferentes assuntos relacionados à segurança digital.",
    tips: [
      "Senhas: proteja suas contas.",
      "Phishing: identifique mensagens suspeitas.",
      "Golpes Digitais: reconheça tentativas de fraude."
    ]
  },
  {
    icon: "🚀",
    title: "Avance pelos níveis",
    description:
      "Cada caminho possui três níveis. O Hermes seleciona automaticamente o nível correspondente ao seu progresso.",
    tips: [
      "Cada atividade possui cinco questões.",
      "Acerte pelo menos quatro para desbloquear o próximo nível."
    ]
  },
  {
    icon: "⭐",
    title: "Responda e ganhe pontos",
    description:
      "Coloque seus conhecimentos em prática e acumule pontos ao responder corretamente.",
    tips: [
      "Leia cada questão com atenção.",
      "Use o feedback para aprender com suas respostas."
    ]
  },
  {
    icon: "🏆",
    title: "Acompanhe sua evolução",
    description:
      "Seu perfil reúne informações importantes sobre seu desempenho na plataforma.",
    tips: [
      "Consulte seus pontos acumulados.",
      "Acompanhe seu progresso em cada caminho."
    ]
  }
];

const currentTutorialStep = computed(
  () => steps[currentStep.value] ?? steps[0]!
);

const isLastStep = computed(
  () => currentStep.value === steps.length - 1
);

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

function nextStep() {
  if (isLastStep.value) {
    closeTutorial();
    return;
  }

  currentStep.value++;
}

function closeTutorial() {
  emit("close");
}
</script>

<style scoped>
.tutorial-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgb(29 25 22 / 65%);
  backdrop-filter: blur(4px);
}

.tutorial-modal {
  width: 100%;
  max-width: 540px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  padding: 28px;
  border: 1px solid #e8e1d8;
  border-radius: 20px;
  background: #fffdf9;
  color: #332b25;
  box-shadow: 0 24px 80px rgb(0 0 0 / 20%);
}

.tutorial-header,
.tutorial-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.tutorial-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
}

.brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #51463d;
  color: white;
  font-weight: 700;
}

.tutorial-skip,
.previous-button {
  border: 0;
  background: transparent;
  color: #65584d;
  cursor: pointer;
  font-size: 14px;
}

.tutorial-skip:hover,
.previous-button:hover {
  color: #a43b24;
}

.tutorial-progress {
  display: flex;
  gap: 6px;
  margin-top: 26px;
}

.progress-segment {
  height: 5px;
  flex: 1;
  border-radius: 10px;
  background: #e8e1d8;
  transition: background 0.2s;
}

.progress-segment.active {
  background: #b45a3c;
}

.tutorial-content {
  padding: 28px 0 32px;
}

.tutorial-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  height: 76px;
  margin-bottom: 24px;
  border-radius: 20px;
  background: #f1e8dc;
  font-size: 36px;
}

.tutorial-step-label {
  color: #a15a3d;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.4px;
}

.tutorial-content h2 {
  margin: 10px 0 12px;
  font-size: clamp(24px, 5vw, 32px);
  line-height: 1.2;
}

.tutorial-description {
  margin: 0;
  color: #71665c;
  font-size: 15px;
  line-height: 1.7;
}

.tutorial-tips {
  display: grid;
  gap: 12px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

.tutorial-tips li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.5;
}

.tip-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #e5eee1;
  color: #3e6d3a;
  font-weight: 700;
}

.tutorial-footer {
  padding-top: 20px;
  border-top: 1px solid #e8e1d8;
}

.footer-spacer {
  flex: 1;
}

.next-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 44px;
  padding: 12px 18px;
  border: 0;
  border-radius: 9px;
  background: #51463d;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.next-button:hover {
  background: #756354;
}

button:focus-visible {
  outline: 3px solid #c27a5c;
  outline-offset: 3px;
}

@media (max-width: 480px) {
  .tutorial-modal {
    padding: 20px;
  }

  .tutorial-header {
    align-items: flex-start;
  }

  .tutorial-skip {
    padding: 8px 0;
  }

  .tutorial-content {
    padding: 24px 0;
  }

  .tutorial-footer {
    align-items: stretch;
  }

  .next-button {
    padding: 12px;
  }
}
</style>
