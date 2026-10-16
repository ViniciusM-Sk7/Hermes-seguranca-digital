
<template>
  <main class="profile-page">
    <header class="topbar">
      <RouterLink to="/home" class="brand">
        <span class="brand-icon">H</span>
        <span>Hermes</span>
      </RouterLink>

      <RouterLink to="/home" class="back-link">
        Voltar
      </RouterLink>
    </header>

    <section class="profile-content">
      <div class="page-heading">
        <span class="eyebrow">SUA CONTA</span>
        <h1>Meu perfil</h1>
        <p>Consulte suas informações e acompanhe seus resultados.</p>
      </div>

      <p v-if="loading" class="status-message">
        Carregando suas informações...
      </p>

      <div v-else-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
        <button class="secondary-button" @click="loadProfile">
          Tentar novamente
        </button>
      </div>

      <template v-else-if="userId">
        <section class="user-card">
          <div class="avatar">
            {{ userName.charAt(0).toUpperCase() || "U" }}
          </div>

          <div class="user-info">
            <h2>{{ userName }}</h2>
            <p>{{ userEmail }}</p>
          </div>
        </section>

        <section class="stats-grid">
          <article class="stat-card">
            <div class="stat-icon">★</div>
            <p class="stat-label">Pontos acumulados</p>
            <strong class="stat-value">{{ userPoints }}</strong>
            <span class="stat-description">
              Pontos conquistados nas atividades
            </span>
          </article>

          <article class="stat-card">
            <div class="stat-icon">✓</div>
            <p class="stat-label">Etapas concluídas</p>
            <strong class="stat-value">
              {{ completedStages }}
            </strong>
            <span class="stat-description">
              Finalizadas
            </span>
          </article>
        </section>

        <section class="account-section">
          <h2>Informações da conta</h2>

          <div class="info-row">
            <span>Nome</span>
            <strong>{{ userName }}</strong>
          </div>

          <div class="info-row">
            <span>E-mail</span>
            <strong>{{ userEmail }}</strong>
          </div>
        </section>

        <section class="actions-section">
          <button class="logout-button" @click="logout">
            Sair da conta
          </button>
        </section>
      </template>
    </section>

    <footer class="profile-footer">
      Hermes · Aprenda a navegar com mais segurança.
    </footer>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { apiRequest } from "../services/api";

const router = useRouter();

const userId = ref("");
const userName = ref("");
const userEmail = ref("");
const userPoints = ref(0);
const loading = ref(true);
const errorMessage = ref("");

const completedStages = ref(0);

async function loadProfile() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const data = await apiRequest("/users/profile");

    userId.value = data.user.id;
    userName.value = data.user.name;
    userEmail.value = data.user.email;
    userPoints.value = data.user.points;


    const progress = data.user.progress;

    completedStages.value =
      Math.max(0, (progress?.senhas ?? 1) - 1) +
      Math.max(0, (progress?.phishing ?? 1) - 1) +
      Math.max(0, (progress?.golpesDigitais ?? 1) - 1);

  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value =
        "Não foi possível conectar ao servidor.";
    }
  } finally {
    loading.value = false;
  }
}

function logout() {
  localStorage.removeItem("token");
  router.push("/");
}

onMounted(loadProfile);
</script>

<style scoped>
.profile-page {
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

.profile-content {
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

.user-card,
.stat-card,
.account-section {
  border: 1px solid #ded8cf;
  border-radius: 16px;
  background: #fff;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 25px;
  margin-bottom: 20px;
}

.avatar {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #e8e1d8;
  color: #51463d;
  font-size: 27px;
  font-weight: 700;
}

.user-info h2 {
  overflow-wrap: anywhere;
  font-size: 21px;
  font-weight: 700;
}

.user-info p {
  overflow-wrap: anywhere;
  color: #77716a;
  font-size: 14px;
}

.account-label {
  display: inline-block;
  margin-top: 8px;
  padding: 4px 9px;
  border-radius: 6px;
  background: #f3f0eb;
  color: #51463d;
  font-size: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  padding: 22px;
}

.stat-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  margin-bottom: 15px;
  border-radius: 10px;
  background: #e8e1d8;
  color: #51463d;
  font-size: 21px;
}

.stat-label {
  color: #77716a;
  font-size: 13px;
}

.stat-value {
  display: block;
  margin: 3px 0;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.3;
}

.stat-description {
  color: #77716a;
  font-size: 12px;
}

.account-section {
  padding: 24px;
}

.account-section h2 {
  margin-bottom: 12px;
  font-size: 17px;
  font-weight: 700;
}

.info-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid #eee9e3;
  font-size: 14px;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row span {
  color: #77716a;
}

.info-row strong {
  max-width: 65%;
  overflow-wrap: anywhere;
  text-align: right;
  font-weight: 600;
}

.actions-section {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.primary-button,
.secondary-button,
.logout-button {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 11px 17px;
  border: 1px solid #51463d;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.primary-button {
  background: #51463d;
  color: #fff;
}

.primary-button:hover {
  background: #40372f;
}

.logout-button,
.secondary-button {
  background: #fff;
  color: #51463d;
}

.logout-button:hover,
.secondary-button:hover {
  background: #e8e1d8;
}

.status-message {
  padding: 24px 0;
  color: #77716a;
}

.error-message {
  padding: 22px;
  border: 1px solid #d8b7ae;
  border-radius: 12px;
  background: #fff;
  color: #8a3528;
}

.secondary-button {
  margin-top: 14px;
}

.profile-footer {
  padding: 22px;
  border-top: 1px solid #ded8cf;
  color: #77716a;
  text-align: center;
  font-size: 12px;
}

@media (max-width: 520px) {
  .topbar {
    padding: 14px 20px;
  }

  .profile-content {
    width: calc(100% - 32px);
    padding-top: 32px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .user-card {
    padding: 20px;
  }

  .actions-section {
    flex-direction: column;
  }

  .primary-button,
  .logout-button {
    width: 100%;
  }
}
</style>
