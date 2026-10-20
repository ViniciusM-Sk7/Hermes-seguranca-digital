<template>
  <main class="about-page">
    <header class="topbar">
      <RouterLink to="/" class="brand">
        <span class="brand-icon">H</span>
        <span>Hermes</span>
      </RouterLink>

      <RouterLink to="/" class="back-link">
        Voltar
      </RouterLink>
    </header>

    <section class="about-content">
      <p class="eyebrow">SOBRE O PROJETO</p>

      <h1>Aprenda a navegar com mais segurança.</h1>

      <p class="description">
        O Hermes é uma plataforma de estudos gamificada que busca
        ensinar noções básicas de segurança na internet de maneira
        acessível, interativa e gratuita.
      </p>

      <section class="about-card">
        <h2>Nosso objetivo</h2>
        <p>
          Ajudar as pessoas a reconhecer ameaças digitais, identificar
          golpes e adotar boas práticas para utilizar a internet com
          mais segurança.
        </p>
      </section>

      <section class="about-card">
        <h2>Como funciona?</h2>
        <p>
          Por meio de trilhas de aprendizagem, questões e pontuação,
          os usuários podem aprender sobre senhas, phishing e golpes
          digitais enquanto acompanham seu progresso.
        </p>
      </section>
    </section>

    <footer class="footer">
      <p>
        {{ new Date().getFullYear() }} Hermes.
        Aprenda a navegar na internet com mais segurança.
      </p>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
.about-page {
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
  text-decoration: none;
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
}

.back-link {
  color: #51463d;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.about-content {
  width: min(100% - 40px, 800px);
  margin: 0 auto;
  padding: 56px 0;
  flex: 1;
}

.eyebrow {
  color: #77716a;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

h1 {
  max-width: 650px;
  margin: 12px 0 20px;
  font-size: clamp(30px, 5vw, 42px);
  line-height: 1.2;
}

.description {
  max-width: 700px;
  color: #625c55;
  font-size: 17px;
  line-height: 1.8;
  margin-bottom: 32px;
}

.about-card {
  margin-top: 20px;
  padding: 24px;
  border: 1px solid #ded8cf;
  border-radius: 14px;
  background: #fff;
}

.about-card h2 {
  margin-top: 0;
  color: #51463d;
  font-size: 21px;
}

.about-card p {
  margin-bottom: 0;
  color: #625c55;
  line-height: 1.8;
}

.footer {
  padding: 24px 7%;
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
  .about-content {
    padding: 36px 0;
  }

  .about-card {
    padding: 20px;
  }
}
</style>
