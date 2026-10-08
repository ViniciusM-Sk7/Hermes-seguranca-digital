<template>
  <main>
    <h1>Perfil</h1>

    <p v-if="loading">Carregando...</p>

    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>

    <div v-if="userId">
      <p>Usuário: {{ userName }}</p>
      <p>E-mail: {{ userEmail }}</p>
      <p>Pontos totais: {{ userPoints }}</p>
    </div>
    <button @click="logout"> Sair </button>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { apiRequest } from "../services/api";

const router = useRouter();

const userId = ref("");
const userName = ref("");
const userEmail = ref("");
const userPoints = ref(0);
const loading = ref(true);
const errorMessage = ref("");

async function loadProfile() {
  try {
    const data = await apiRequest("/users/profile");

    userId.value = data.user.id;
    userName.value = data.user.name;
    userEmail.value = data.user.email;
    userPoints.value = data.user.points;
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

function logout() {
  localStorage.removeItem("token");
  router.push("/login");
}

onMounted(loadProfile);
</script>