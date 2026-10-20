<template>
  <main class="home-page">
    <header class="topbar">
      <a class="brand" href="/home">
        <span class="brand-icon">H</span>
        <span>Hermes</span>
      </a>

      <div class="topbar-actions">
        <span class="topbar-label">Aprenda no seu ritmo</span>

        <button class="tutorial-link" @click="openTutorial">
          Ver tutorial
        </button>

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
          :disabled="loading"
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
      <span class="eyebrow">SUA PRÓXIMA ETAPA</span>

      <h2>
        {{ selectedPathName }}
      </h2>

      <p v-if="loading">
        Consultando seu progresso...
      </p>

      <template v-else-if="!error">
        <p v-if="currentLevel < 3">
          Você está no nível {{ currentLevel }}.
          Continue aprendendo para desbloquear o próximo nível.
        </p>

        <p v-else>
          Você chegou ao último nível deste caminho!
          Você pode refazer a atividade para praticar.
        </p>

        <button
          class="start-button"
          :disabled="loading"
          @click="startStudy"
        >
          <span>
            {{ currentLevel === 3 ? "Refazer nível 3" : "Começar atividade" }}
          </span>
          <span>5 questões&nbsp; →</span>
        </button>
      </template>

      <p v-if="error" class="error-message">
        {{ error }}
      </p>
    </section>

    <footer class="home-footer">
      <span>Conhecimento é uma forma de proteção.</span>
    </footer>

    <WelcomeTutorial
        v-if="showTutorial"
        @close="closeTutorial"
      />
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { apiRequest } from "../services/api";
import WelcomeTutorial from "../components/WelcomeTutorial.vue";

type PathId = "senhas" | "phishing" | "golpes-digitais";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  points: number;
  progress: {
    senhas: number;
    phishing: number;
    golpesDigitais: number;
  };
}

const router = useRouter();

const selectedPath = ref<PathId | "">("");
const currentLevel = ref(1);
const loading = ref(false);
const error = ref("");

const paths: { id: PathId; name: string }[] = [
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

const selectedPathName = computed(() => {
  return paths.find((path) => path.id === selectedPath.value)?.name ?? "";
});

async function selectPath(path: PathId) {
  selectedPath.value = path;
  loading.value = true;
  error.value = "";

  try {
    const response = await apiRequest("/users/profile");
    const profile = response.user as UserProfile;

    const progressKey: Record<PathId, keyof UserProfile["progress"]> = {
      senhas: "senhas",
      phishing: "phishing",
      "golpes-digitais": "golpesDigitais"
    };

    const level = profile.progress?.[progressKey[path]] ?? 1;

    currentLevel.value = Math.min(3, Math.max(1, level));
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : "Não foi possível consultar seu progresso.";
  } finally {
    loading.value = false;
  }
}

function startStudy() {
  if (!selectedPath.value || loading.value || error.value) {
    return;
  }

  router.push({
    path: "/study-test",
    query: {
      path: selectedPath.value,
      level: String(currentLevel.value),
      amount: "5"
    }
  });
}

function logout() {
  localStorage.removeItem("token");
  router.push("/");
}

const showTutorial = ref(false);

const TUTORIAL_STORAGE_KEY = "hermes-tutorial-seen";

onMounted(() => {
  if (localStorage.getItem(TUTORIAL_STORAGE_KEY) !== "true") {
    showTutorial.value = true;
  }
});

function openTutorial() {
  showTutorial.value = true;
}

function closeTutorial() {
  localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
  showTutorial.value = false;
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

.home-page .tutorial-link {
  padding: 10px 16px;
  border: 1px solid #51463d;
  border-radius: 8px;
  background: #0f7522;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 5px rgb(48 45 41 / 12%);
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}

.home-page .tutorial-link:hover {
  background: #1d982b;
  box-shadow: 0 4px 9px rgb(48 45 41 / 18%);
  transform: translateY(-1px);
}

.home-page .tutorial-link:focus-visible {
  outline: 3px solid #b8ada1;
  outline-offset: 3px;
}
</style>