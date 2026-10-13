<template>
  <main class="login-page">
    <header class="login-header">
      <RouterLink to="/" class="brand">
        <span class="brand-icon">S</span>
        <span>Segurança Digital</span>
      </RouterLink>
    </header>

    <section class="login-container">
      <div class="login-card">
        <span class="eyebrow">BEM-VINDO DE VOLTA</span>
        <h1>Entre na sua conta</h1>
        <p class="subtitle">
          Continue aprendendo a navegar com mais segurança.
        </p>

        <form @submit.prevent="login">
          <div class="form-group">
            <label for="email">E-mail</label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Senha</label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <p v-if="errorMessage" class="error-message" role="alert">
            {{ errorMessage }}
          </p>

          <button type="submit" class="login-button" :disabled="loading">
            {{ loading ? "Entrando..." : "Entrar na conta" }}
            <span v-if="!loading">→</span>
          </button>
        </form>

        <p class="register-prompt">
          Ainda não tem uma conta?
          <RouterLink to="/register">Cadastre-se</RouterLink>
        </p>
      </div>

      <p class="login-footer">
        Conhecimento é uma forma de proteção.
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { apiRequest } from "../services/api";

const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

async function login() {
  errorMessage.value = "";
  loading.value = true;

  try {
    const data = await apiRequest("/users/login", {
      method: "POST",
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    localStorage.setItem("token", data.token);

    await router.push("/home");
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Não foi possível conectar ao servidor.";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f3f0eb;
  color: #302d29;
}

.login-header {
  width: 100%;
  padding: 26px 7%;
  border-bottom: 1px solid #ded8cf;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #51463d;
  color: #ffffff;
  font-size: 18px;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 87px);
  padding: 48px 20px;
}

.login-card {
  width: 100%;
  max-width: 440px;
  padding: 42px;
  border: 1px solid #ded8cf;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 30px rgb(48 45 41 / 4%);
}

.eyebrow {
  color: #77716a;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

h1 {
  margin-top: 12px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.8px;
  line-height: 1.3;
}

.subtitle {
  margin-top: 10px;
  color: #77716a;
  font-size: 14px;
  line-height: 1.7;
}

form {
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin-top: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 13px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 13px 14px;
  border: 1px solid #ded8cf;
  border-radius: 8px;
  outline: none;
  background: #ffffff;
  color: #302d29;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input::placeholder {
  color: #aaa39b;
}

input:focus {
  border-color: #51463d;
  box-shadow: 0 0 0 3px rgb(81 70 61 / 10%);
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-radius: 8px;
  background: #51463d;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s;
}

.login-button:hover:not(:disabled) {
  background: #40372f;
}

.login-button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.error-message {
  padding: 11px 12px;
  border: 1px solid #e5b9b4;
  border-radius: 8px;
  background: #fbefed;
  color: #9a352c;
  font-size: 13px;
}

.register-prompt {
  margin-top: 28px;
  color: #77716a;
  text-align: center;
  font-size: 13px;
}

.register-prompt a {
  color: #51463d;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.login-footer {
  margin-top: 28px;
  color: #77716a;
  text-align: center;
  font-size: 12px;
}

@media (max-width: 480px) {
  .login-header {
    padding: 20px;
  }

  .login-card {
    padding: 28px 22px;
  }

  h1 {
    font-size: 25px;
  }
}
</style>