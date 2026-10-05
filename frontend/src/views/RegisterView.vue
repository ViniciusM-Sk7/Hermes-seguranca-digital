<template>
  <main>
    <h1>Cadastro</h1>

    <form @submit.prevent="register">
      <div>
        <label for="name">Nome</label>
        <input
          id="name"
          v-model="name"
          type="text"
          autocomplete="name"
          required
        />
      </div>

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
          autocomplete="new-password"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Criando..." : "Criar conta" }}
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

    await router.push("/login");
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