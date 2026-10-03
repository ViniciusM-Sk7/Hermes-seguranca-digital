<template>
  <main>
    <h1>Perfil</h1>

    <p v-if="loading">Carregando...</p>

    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>

    <div v-if="userId">
      <p>Usuário autenticado.</p>
      <p>ID: {{ userId }}</p>
    </div>
    <button @click="logout"> Sair </button>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const userId = ref("");
const loading = ref(true);
const errorMessage = ref("");

async function loadProfile() {
  const token = localStorage.getItem("token");

  if (!token) {
    errorMessage.value = "Usuário não autenticado.";
    loading.value = false;
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:3000/api/users/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorMessage.value = data.message || "Erro ao carregar perfil.";
      return;
    }

    userId.value = data.userId;
  } catch (error) {
    console.error(error);
    errorMessage.value = "Não foi possível conectar ao servidor.";
  } finally {
    loading.value = false;
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

onMounted(loadProfile);
</script>