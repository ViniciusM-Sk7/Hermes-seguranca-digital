<template>
  <main class="register-page">
    <header class="topbar">
      <RouterLink to="/" class="brand">
        <span class="brand-icon">H</span>
        <span>Hermes</span>
      </RouterLink>

      <RouterLink to="/" class="back-link">
        Voltar
      </RouterLink>
    </header>

    <section class="register-container">
      <div class="register-card">
        <span class="eyebrow">SEJA BEM-VINDO</span>
        <h1>Cadastre-se agora</h1>
        <p class="subtitle">
          Descubra como navegar com mais segurança.
        </p>

      <form @submit.prevent="register">
        <div class="form-group">
          <label for="name">Nome</label>
          <input
            id="name"
            v-model="name"
            type="text"
            autocomplete="name"
            placeholder="Insira seu nome"
            required
          />
        </div>

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
            autocomplete="new-password"
            placeholder="Digite uma senha"
            required
          />
        </div>

        <button type="submit" class="register-button" :disabled="loading">
          {{ loading ? "Criando..." : "Criar conta" }}
          <span v-if="!loading">→</span>
        </button>

        <p v-if="errorMessage">
          {{ errorMessage }}
        </p>
      </form>

      <p class="login-prompt">
          Já tem uma conta?
          <RouterLink to="/login">Entre aqui</RouterLink>
        </p>

      </div>
    </section>

    <footer class="footer">
        <p>{{ new Date().getFullYear() }} Hermes. Aprenda a navegar na internet com mais segurança.</p>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { apiRequest } from "../services/api";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

async function register() {
  errorMessage.value = "";
  loading.value = true;

  try {
    await apiRequest("/users", {
      method: "POST",
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value
      })
    });

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
      errorMessage.value = "Não foi possível criar a conta.";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: #f3f0eb;
  color: #302d29;
}

.topbar {
  min-height: 76px;
  padding: 16px 7%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ded8cf;
  background: #fff;
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

.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 87px);
  padding: 48px 20px;
}

.register-card {
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

.register-button {
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

.register-button:hover:not(:disabled) {
  background: #40372f;
}

.register-button:disabled {
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

.register-footer {
  margin-top: 28px;
  color: #77716a;
  text-align: center;
  font-size: 12px;
}

@media (max-width: 480px) {
  .register-header {
    padding: 20px;
  }

  .register-card {
    padding: 28px 22px;
  }

  h1 {
    font-size: 25px;
  }
}

.login-prompt {
  margin-top: 28px;
  color: #77716a;
  text-align: center;
  font-size: 13px;
}

.login-prompt a {
  color: #51463d;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
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

.back-link {
  color: #51463d;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}
</style>