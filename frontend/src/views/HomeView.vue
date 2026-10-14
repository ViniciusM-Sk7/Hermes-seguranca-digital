<template>
  <main class="home-page">
    <header class="topbar">
      <a class="brand" href="/">
        <span class="brand-icon">H</span>
        <span>Hermes</span>
      </a>

      <div class="topbar-actions">
        <span class="topbar-label">Aprenda no seu ritmo</span>

        <RouterLink to="/profile" class="header-link">
          Meu perfil
        </RouterLink>

        <button class="logout-button" @click="logout">
          Sair
        </button>
      </div>
    </header>

    <section class="welcome">
      <span class="eyebrow">APRENDIZADO DIGITAL</span>
      <h1>Mais segurança para<br />sua vida digital.</h1>
      <p>
        Aprenda a reconhecer riscos e adote hábitos mais seguros
        na internet, um passo de cada vez.
      </p>
    </section>

    <section class="paths-section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">SEU APRENDIZADO</span>
          <h2>Escolha um caminho</h2>
        </div>
        <span class="path-count">03 caminhos</span>
      </div>

      <div class="paths-grid">
        <button
          v-for="(path, index) in paths"
          :key="path.id"
          class="path-card"
          :class="{ selected: selectedPath === path.id }"
          @click="selectPath(path.id)"
        >
          <span class="path-icon">
            {{ ["◇", "↗", "⌕"][index] }}
          </span>

          <span class="path-card-content">
            <span class="path-title">{{ path.name }}</span>
            <span class="path-description">
              {{
                [
                  "Crie e mantenha senhas mais seguras.",
                  "Aprenda a identificar mensagens suspeitas.",
                  "Reconheça tentativas comuns de fraude."
                ][index]
              }}
            </span>
          </span>

          <span class="path-arrow">
            {{ selectedPath === path.id ? "✓" : "→" }}
          </span>
        </button>
      </div>
    </section>

    <section v-if="selectedPath" class="selection-section">
      <span class="eyebrow">PRÓXIMA ETAPA</span>
      <h2>Escolha seu nível</h2>
      <p>Selecione o nível que deseja estudar.</p>

      <div class="choice-list">
        <button
          v-for="level in levels"
          :key="level"
          class="choice-button"
          :class="{ selected: selectedLevel === level }"
          @click="selectLevel(level)"
        >
          <span class="choice-number">0{{ level }}</span>
          <span>Nível {{ level }}</span>
          <span class="choice-arrow">
            {{ selectedLevel === level ? "✓" : "→" }}
          </span>
        </button>
      </div>
    </section>

    <section v-if="selectedLevel" class="selection-section amount-section">
      <span class="eyebrow">PRONTO PARA COMEÇAR?</span>
      <h2>Hora de praticar</h2>
      <p>Responda às questões do caminho escolhido.</p>

      <div class="choice-list">
        <button
          v-for="amount in availableAmounts"
          :key="amount"
          class="start-button"
          @click="startStudy(amount)"
        >
          Começar atividade
          <span>{{ amount }} questões&nbsp; →</span>
        </button>
      </div>
    </section>

    <footer class="home-footer">
      <span>Conhecimento é uma forma de proteção.</span>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();

const selectedPath = ref("");
const selectedLevel = ref<number | null>(null);

const paths = [
  {
    id: "senhas",
    name: "Senhas"
  },
  {
    id: "phishing",
    name: "Phishing"
  },
  {
    id: "golpes-digitais",
    name: "Golpes Digitais"
  }
];

const levels = [1, 2, 3];

const availableAmounts = computed(() => {
  if (!selectedPath.value || selectedLevel.value === null) {
    return [];
  }

  return [5];
});

function selectPath(path: string) {
  selectedPath.value = path;
  selectedLevel.value = null;
}

function selectLevel(level: number) {
  selectedLevel.value = level;
}

function startStudy(amount: number) {
  if (!selectedPath.value || selectedLevel.value === null) {
    return;
  }

  router.push({
    path: "/study-test",
    query: {
      path: selectedPath.value,
      level: String(selectedLevel.value),
      amount: String(amount)
    }
  });
}

function logout() {
  localStorage.removeItem("token");
  router.push("/");
}
</script>

<style>

.home-page .topbar-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
}

.home-page .header-link {
  padding: 9px 14px;
  border: 1px solid #ded8cf;
  border-radius: 8px;
  background: #ffffff;
  color: #51463d;
  font-size: 13px;
  transition: background 0.2s;
}

.home-page .header-link:hover {
  background: #e8e1d8;
}

.home-page .logout-button {
  padding: 9px 14px;
  border: 1px solid #51463d;
  border-radius: 8px;
  background: #b52714;
  color: #ffffff;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.home-page .logout-button:hover {
  background: #de2710;
}

@media (max-width: 600px) {
  .home-page .topbar {
    align-items: flex-start;
  }

  .home-page .topbar-actions {
    flex-wrap: wrap;
    gap: 8px;
  }

  .home-page .topbar-label {
    display: none;
  }
}

</style>