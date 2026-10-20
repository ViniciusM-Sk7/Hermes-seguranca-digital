
<template>
  <main class="landing-page">
    <header class="landing-header">
      <RouterLink to="/" class="brand">
        <span class="brand-icon">H</span>
        <span>Hermes</span>
      </RouterLink>

      <nav class="desktop-nav">
        <RouterLink to="/" class="nav-active">Página inicial</RouterLink>
        <a href="/about">Sobre</a>
        <a href="#contato">Contato</a>
      </nav>

      <RouterLink to="/login" class="login-link">
        Entrar
      </RouterLink>
    </header>

    <section class="hero">
      <span class="eyebrow">APRENDIZADO DIGITAL</span>

      <h1>Segurança digital<br />começa com conhecimento.</h1>

      <p>
        Aprenda a se proteger na internet de forma prática,
        interativa e no seu próprio ritmo.
      </p>

      <RouterLink to="/register" class="primary-button">
        Comece já <span>→</span>
      </RouterLink>

      <span class="hero-note">
        Aprenda. Pratique. Proteja-se.
      </span>
    </section>

    <section class="visual-section" aria-label="Temas de segurança digital">
      <div class="visual-card visual-password">
        <div class="visual-window">
          <span class="window-dot"></span>
          <span class="window-dot"></span>
          <span class="window-dot"></span>
        </div>
        <div class="visual-symbol">◇</div>
        <span class="visual-label">Proteja suas contas</span>
      </div>

      <div class="visual-card visual-phishing">
        <div class="visual-symbol">↗</div>
        <span class="visual-label">Reconheça ameaças</span>
        <div class="message-example">
          <span class="message-dot"></span>
          <span>Mensagem suspeita?</span>
        </div>
      </div>
    </section>

    <section id="sobre" class="topics-section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">APRENDA NA PRÁTICA</span>
          <h2>Conhecimento para o dia a dia.</h2>
          <p>
            Explore assuntos essenciais para usar a internet
            com mais segurança e confiança.
          </p>
        </div>
      </div>

      <div class="topics-grid">
        <article class="topic-card">
          <span class="topic-icon">◇</span>
          <h3>Senhas</h3>
          <p>
            Descubra como criar senhas fortes e proteger
            suas contas pessoais.
          </p>
          <RouterLink to="/home" class="topic-link">
            Explorar tema <span>→</span>
          </RouterLink>
        </article>

        <article class="topic-card">
          <span class="topic-icon">↗</span>
          <h3>Phishing</h3>
          <p>
            Aprenda a reconhecer mensagens, links e páginas
            criados para enganar.
          </p>
          <RouterLink to="/home" class="topic-link">
            Explorar tema <span>→</span>
          </RouterLink>
        </article>

        <article class="topic-card">
          <span class="topic-icon">⌕</span>
          <h3>Golpes digitais</h3>
          <p>
            Conheça tentativas comuns de fraude e aprenda
            a identificar sinais de alerta.
          </p>
          <RouterLink to="/home" class="topic-link">
            Explorar tema <span>→</span>
          </RouterLink>
        </article>
      </div>
    </section>

    <section class="how-section">
      <div class="how-intro">
        <span class="eyebrow">SIMPLES ASSIM</span>
        <h2>Aprender pode ser mais leve.</h2>
        <p>
          Avance passo a passo e pratique o que aprendeu
          com atividades interativas.
        </p>
        <RouterLink to="/home" class="secondary-button">
          Conhecer os estudos →
        </RouterLink>
      </div>

      <div class="steps">
        <article class="step">
          <span class="step-number">01</span>
          <div>
            <h3>Escolha um tema</h3>
            <p>Comece pelo assunto que deseja aprender.</p>
          </div>
        </article>

        <article class="step">
          <span class="step-number">02</span>
          <div>
            <h3>Avance pelos níveis</h3>
            <p>Aprenda gradualmente, no seu próprio ritmo.</p>
          </div>
        </article>

        <article class="step">
          <span class="step-number">03</span>
          <div>
            <h3>Pratique seus conhecimentos</h3>
            <p>Responda às questões e acompanhe sua pontuação.</p>
          </div>
        </article>
      </div>
    </section>

    <section class="closing-section">
      <span class="eyebrow">SUA JORNADA COMEÇA AQUI</span>
      <h2>Mais conhecimento.<br />Mais segurança.</h2>
      <p>Pequenas atitudes podem fazer a diferença na sua vida digital.</p>
      <RouterLink to="/home" class="primary-button">
        Começar a aprender <span>→</span>
      </RouterLink>
    </section>

    <footer id="contato" class="landing-footer">
      <RouterLink to="/" class="brand footer-brand">
        <span class="brand-icon">H</span>
        <span>Hermes</span>
      </RouterLink>

      <p>Conhecimento é uma forma de proteção.</p>

      <div class="footer-links">
        <RouterLink to="/about">Sobre o projeto</RouterLink>
        <RouterLink to="/login">Entrar</RouterLink>
        <RouterLink to="/register">Criar conta</RouterLink>
      </div>

      <span class="copyright">Hermes · Segurança Digital</span>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
.landing-page {
  --bg: #f3f0eb;
  --card: #ffffff;
  --brown: #51463d;
  --text: #302d29;
  --muted: #77716a;
  --border: #ded8cf;
  --soft: #e8e1d8;

  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: var(--bg);
  color: var(--text);
}

.landing-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 22px 7%;
  border-bottom: 1px solid var(--border);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  font-size: 17px;
  font-weight: 600;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 9px;
  background: var(--brown);
  color: white;
  font-weight: 600;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 30px;
}

.desktop-nav a,
.login-link {
  color: var(--muted);
  font-size: 13px;
  transition: color 0.2s;
}

.desktop-nav a:hover,
.desktop-nav .nav-active,
.login-link:hover {
  color: var(--brown);
}

.login-link {
  padding: 9px 20px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: var(--card);
  color: var(--text);
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 94px 24px 48px;
  text-align: center;
}

.eyebrow {
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.7px;
}

.hero h1 {
  margin-top: 20px;
  font-size: clamp(38px, 5.5vw, 62px);
  font-weight: 600;
  letter-spacing: -2.3px;
  line-height: 1.12;
}

.hero > p {
  max-width: 510px;
  margin-top: 20px;
  color: var(--muted);
  font-size: 16px;
  line-height: 1.8;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  margin-top: 28px;
  padding: 14px 19px;
  border: 1px solid var(--brown);
  border-radius: 8px;
  background: var(--brown);
  color: white;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s, transform 0.2s;
}

.primary-button:hover {
  transform: translateY(-1px);
  background: #40372f;
}

.hero-note {
  margin-top: 17px;
  color: var(--muted);
  font-size: 12px;
}

.visual-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  width: min(900px, 86%);
  margin: 10px auto 100px;
}

.visual-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 245px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--card);
}

.visual-password {
  background: linear-gradient(145deg, #fff 40%, #e8e1d8);
}

.visual-phishing {
  background: linear-gradient(145deg, #e8e1d8, #fff 75%);
}

.visual-window {
  position: absolute;
  top: 0;
  display: flex;
  gap: 6px;
  width: 100%;
  padding: 13px;
  border-bottom: 1px solid var(--border);
  background: rgb(255 255 255 / 70%);
}

.window-dot,
.message-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #b8ada1;
}

.visual-symbol {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 92px;
  height: 92px;
  border: 1px solid #ded8cf;
  border-radius: 24px;
  background: rgb(255 255 255 / 75%);
  color: var(--brown);
  font-size: 54px;
}

.visual-label {
  margin-top: 17px;
  color: var(--brown);
  font-size: 13px;
  font-weight: 600;
}

.message-example {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: white;
  color: var(--muted);
  font-size: 11px;
}

.message-dot {
  background: #9b7765;
}

.topics-section {
  padding: 76px 7% 88px;
  background: #fff;
}

.section-heading {
  max-width: 640px;
  margin-bottom: 35px;
}

.section-heading h2,
.how-intro h2 {
  margin-top: 12px;
  font-size: clamp(27px, 3.5vw, 36px);
  font-weight: 600;
  letter-spacing: -1px;
  line-height: 1.25;
}

.section-heading p,
.how-intro > p {
  margin-top: 12px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.8;
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.topic-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 25px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: #fff;
  transition: border-color 0.2s, transform 0.2s;
}

.topic-card:hover {
  transform: translateY(-2px);
  border-color: #b8ada1;
}

.topic-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--soft);
  color: var(--brown);
  font-size: 23px;
}

.topic-card h3 {
  margin-top: 20px;
  font-size: 17px;
  font-weight: 600;
}

.topic-card p {
  margin-top: 10px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}

.topic-link {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  margin-top: 23px;
  padding-top: 15px;
  border-top: 1px solid var(--border);
  color: var(--brown);
  font-size: 12px;
  font-weight: 600;
}

.how-section {
  display: grid;
  grid-template-columns: 0.9fr 1fr;
  gap: 80px;
  padding: 90px 10%;
}

.how-intro > p {
  max-width: 380px;
}

.secondary-button {
  display: inline-block;
  margin-top: 24px;
  color: var(--brown);
  font-size: 13px;
  font-weight: 600;
}

.steps {
  display: flex;
  flex-direction: column;
}

.step {
  display: flex;
  gap: 22px;
  padding: 20px 0;
  border-bottom: 1px solid var(--border);
}

.step:first-child {
  padding-top: 0;
}

.step-number {
  color: #9b8c7e;
  font-size: 13px;
  font-weight: 600;
}

.step h3 {
  font-size: 15px;
  font-weight: 600;
}

.step p {
  margin-top: 7px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.7;
}

.closing-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 72px 24px 80px;
  background: var(--soft);
  text-align: center;
}

.closing-section h2 {
  margin-top: 16px;
  font-size: clamp(32px, 4vw, 45px);
  font-weight: 600;
  letter-spacing: -1.4px;
  line-height: 1.2;
}

.closing-section > p {
  margin-top: 14px;
  color: var(--muted);
  font-size: 14px;
}

.closing-section .primary-button {
  margin-top: 25px;
}

.landing-footer {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 18px 30px;
  padding: 32px 7%;
  background: #fff;
}

.footer-brand {
  width: fit-content;
}

.landing-footer > p {
  color: var(--muted);
  font-size: 12px;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  grid-column: 1 / -1;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.footer-links a,
.copyright {
  color: var(--muted);
  font-size: 12px;
}

.footer-links a:hover {
  color: var(--brown);
}

.copyright {
  grid-column: 1 / -1;
}

@media (max-width: 760px) {
  .landing-header {
    flex-wrap: wrap;
    padding: 18px 5%;
  }

  .desktop-nav {
    order: 3;
    justify-content: center;
    gap: 20px;
    width: 100%;
    padding-top: 12px;
    border-top: 1px solid var(--border);
  }

  .hero {
    padding-top: 70px;
  }

  .visual-section {
    width: 90%;
    gap: 12px;
    margin-bottom: 65px;
  }

  .visual-card {
    min-height: 190px;
  }

  .visual-symbol {
    width: 65px;
    height: 65px;
    border-radius: 18px;
    font-size: 38px;
  }

  .topics-section {
    padding: 60px 5%;
  }

  .topics-grid {
    grid-template-columns: 1fr;
  }

  .topic-card {
    padding: 22px;
  }

  .how-section {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 65px 7%;
  }

  .landing-footer {
    grid-template-columns: 1fr;
    padding: 28px 5%;
  }

  .landing-footer > p {
    grid-row: 2;
  }

  .footer-links {
    grid-column: auto;
  }

  .copyright {
    grid-column: auto;
  }
}

@media (max-width: 420px) {
  .desktop-nav {
    gap: 14px;
  }

  .desktop-nav a {
    font-size: 11px;
  }

  .hero h1 {
    letter-spacing: -1.5px;
  }

  .visual-section {
    grid-template-columns: 1fr;
  }

  .visual-card {
    min-height: 175px;
  }

  .landing-footer > p {
    line-height: 1.6;
  }
}
</style>
