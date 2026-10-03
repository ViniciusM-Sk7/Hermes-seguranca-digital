<template>
  <main>
    <h1>Login</h1>

    <form @submit.prevent="login">
      <div>
        <label for="email">E-mail</label>
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          required
        />
      </div>

      <div>
        <label for="password">Senha</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Entrando..." : "Entrar" }}
      </button>

      <p v-if="errorMessage">
        {{ errorMessage }}
      </p>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

async function login() {
  errorMessage.value = "";
  loading.value = true;

  try {
    const response = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      errorMessage.value = data.message || "Erro ao realizar login.";
      return;
    }

    localStorage.setItem("token", data.token);

    await router.push("/");
  } catch (error) {
    console.error(error);
    errorMessage.value = "Não foi possível conectar ao servidor.";
  } finally {
    loading.value = false;
  }
}
</script>