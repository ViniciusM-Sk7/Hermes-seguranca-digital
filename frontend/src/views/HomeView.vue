```vue
<template>
  <main>
    <h1>Segurança Digital</h1>

    <h2>Escolha um caminho</h2>

    <div>
      <button
        v-for="path in paths"
        :key="path.id"
        @click="selectPath(path.id)"
      >
        {{ path.name }}
      </button>
    </div>

    <div v-if="selectedPath">
      <h2>Escolha o nível</h2>

      <button
        v-for="level in levels"
        :key="level"
        @click="selectLevel(level)"
      >
        Nível {{ level }}
      </button>
    </div>

    <div v-if="selectedLevel">
      <h2>Quantidade de questões</h2>

      <button
        v-for="amount in availableAmounts"
        :key="amount"
        @click="startStudy(amount)"
      >
        {{ amount }} {{ amount === 1 ? "questão" : "questões" }}
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

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

  return [1, 2];
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
</script>
```
