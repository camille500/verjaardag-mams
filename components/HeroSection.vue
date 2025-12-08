<template>
  <section class="hero" id="hero">
    <div class="hero-background">
      <img src="/hero.jpeg" alt="" class="loaded" />
      <div class="hero-overlay"></div>
    </div>

    <LanguageToggle class="lang-toggle" />

    <!-- Floating hippie decorative elements -->
    <div class="floating-elements">
      <!-- Colorful flowers -->
      <div class="float-element flower flower-1">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="10" fill="#F4A261"/>
          <g fill="#E76F51">
            <ellipse cx="50" cy="22" rx="10" ry="16" />
            <ellipse cx="50" cy="78" rx="10" ry="16" />
            <ellipse cx="22" cy="50" rx="16" ry="10" />
            <ellipse cx="78" cy="50" rx="16" ry="10" />
            <ellipse cx="30" cy="30" rx="10" ry="16" transform="rotate(-45 30 30)" />
            <ellipse cx="70" cy="30" rx="10" ry="16" transform="rotate(45 70 30)" />
            <ellipse cx="30" cy="70" rx="10" ry="16" transform="rotate(45 30 70)" />
            <ellipse cx="70" cy="70" rx="10" ry="16" transform="rotate(-45 70 70)" />
          </g>
        </svg>
      </div>
      <div class="float-element flower flower-2">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="8" fill="#E9C46A"/>
          <g fill="#2A9D8F">
            <ellipse cx="50" cy="25" rx="8" ry="14" />
            <ellipse cx="50" cy="75" rx="8" ry="14" />
            <ellipse cx="25" cy="50" rx="14" ry="8" />
            <ellipse cx="75" cy="50" rx="14" ry="8" />
          </g>
        </svg>
      </div>
      <div class="float-element flower flower-3">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="12" fill="#F4A261"/>
          <g fill="#E9C46A">
            <ellipse cx="50" cy="20" rx="12" ry="18" />
            <ellipse cx="50" cy="80" rx="12" ry="18" />
            <ellipse cx="20" cy="50" rx="18" ry="12" />
            <ellipse cx="80" cy="50" rx="18" ry="12" />
          </g>
        </svg>
      </div>
      <div class="float-element flower flower-4">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="8" fill="#2A9D8F"/>
          <g fill="#E76F51">
            <ellipse cx="50" cy="28" rx="8" ry="12" />
            <ellipse cx="50" cy="72" rx="8" ry="12" />
            <ellipse cx="28" cy="50" rx="12" ry="8" />
            <ellipse cx="72" cy="50" rx="12" ry="8" />
          </g>
        </svg>
      </div>
      <!-- Peace symbols -->
      <div class="float-element peace peace-1">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4">
          <circle cx="50" cy="50" r="45" />
          <line x1="50" y1="5" x2="50" y2="95" />
          <line x1="50" y1="50" x2="20" y2="80" />
          <line x1="50" y1="50" x2="80" y2="80" />
        </svg>
      </div>
      <div class="float-element peace peace-2">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4">
          <circle cx="50" cy="50" r="45" />
          <line x1="50" y1="5" x2="50" y2="95" />
          <line x1="50" y1="50" x2="20" y2="80" />
          <line x1="50" y1="50" x2="80" y2="80" />
        </svg>
      </div>
      <!-- Groovy stars -->
      <div class="float-element star star-1">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9"/>
        </svg>
      </div>
      <div class="float-element star star-2">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9"/>
        </svg>
      </div>
    </div>

    <div class="hero-content">
      <div class="hero-inner">
        <!-- Hippie badge -->
        <!-- <div class="hippie-badge"> -->
          <!-- <span class="badge-text">Peace & Love</span> -->
        <!-- </div> -->

        <h1 class="hero-title">{{ $t('hero.title') }}</h1>

        <p class="hero-eyebrow">{{ $t('hero.subtitle') }}</p>

        <div class="hero-name">
          <span class="name-flower">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="3" fill="#F4A261"/>
              <ellipse cx="12" cy="5" rx="3" ry="5" fill="#E76F51"/>
              <ellipse cx="12" cy="19" rx="3" ry="5" fill="#E76F51"/>
              <ellipse cx="5" cy="12" rx="5" ry="3" fill="#E76F51"/>
              <ellipse cx="19" cy="12" rx="5" ry="3" fill="#E76F51"/>
            </svg>
          </span>
          <h2>{{ $t('hero.name') }}</h2>
          <span class="name-flower">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="3" fill="#F4A261"/>
              <ellipse cx="12" cy="5" rx="3" ry="5" fill="#E76F51"/>
              <ellipse cx="12" cy="19" rx="3" ry="5" fill="#E76F51"/>
              <ellipse cx="5" cy="12" rx="5" ry="3" fill="#E76F51"/>
              <ellipse cx="19" cy="12" rx="5" ry="3" fill="#E76F51"/>
            </svg>
          </span>
        </div>

        <div class="hero-date">
          <div class="date-wrapper">
            <span class="date-number">{{ $t('hero.day') }}</span>
            <div class="date-details">
              <span class="date-month">{{ $t('hero.month') }}</span>
              <span class="date-year">{{ $t('hero.year') }}</span>
            </div>
          </div>
        </div>

        <a href="#rsvp" class="hero-cta" @mouseenter="ctaHover = true" @mouseleave="ctaHover = false">
          <span class="cta-bg"></span>
          <span class="cta-text">{{ $t('rsvp.title') }}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>

    <button class="scroll-indicator" @click="scrollToAbout" aria-label="Scroll down">
      <span class="scroll-text">Scroll</span>
      <div class="scroll-arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </button>
  </section>
</template>

<script setup lang="ts">
const ctaHover = ref(false)

const scrollToAbout = () => {
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 3rem;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 27.5%;
  opacity: 0;
  transform: scale(1.1);
  transition: opacity 1.2s ease, transform 1.5s ease;
}

.hero-background img.loaded {
  opacity: 1;
  transform: scale(1);
}

/* Floating hippie decorative elements */
.floating-elements {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.float-element {
  position: absolute;
  opacity: 0.6;
}

.float-element svg {
  width: 100%;
  height: 100%;
}

/* Colorful flowers */
.flower-1 {
  left: 5%;
  top: 15%;
  width: 60px;
  height: 60px;
  animation: float-flower 7s ease-in-out infinite;
}

.flower-2 {
  right: 8%;
  top: 20%;
  width: 45px;
  height: 45px;
  animation: float-flower 8s ease-in-out 1s infinite reverse;
}

.flower-3 {
  left: 8%;
  bottom: 25%;
  width: 50px;
  height: 50px;
  animation: float-flower 6s ease-in-out 0.5s infinite;
}

.flower-4 {
  right: 5%;
  bottom: 30%;
  width: 40px;
  height: 40px;
  animation: float-flower 9s ease-in-out 1.5s infinite reverse;
}

/* Peace symbols */
.peace {
  color: rgba(233, 196, 106, 0.4);
}

.peace-1 {
  left: 15%;
  top: 35%;
  width: 35px;
  height: 35px;
  animation: float-peace 10s ease-in-out infinite;
}

.peace-2 {
  right: 12%;
  bottom: 45%;
  width: 28px;
  height: 28px;
  animation: float-peace 12s ease-in-out 2s infinite reverse;
}

/* Groovy stars */
.star {
  color: rgba(244, 162, 97, 0.5);
}

.star-1 {
  left: 20%;
  bottom: 15%;
  width: 20px;
  height: 20px;
  animation: twinkle 4s ease-in-out infinite;
}

.star-2 {
  right: 18%;
  top: 40%;
  width: 16px;
  height: 16px;
  animation: twinkle 5s ease-in-out 1s infinite;
}

@keyframes float-flower {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(8deg);
  }
  50% {
    transform: translateY(-10px) rotate(-5deg);
  }
  75% {
    transform: translateY(-25px) rotate(5deg);
  }
}

@keyframes float-peace {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(15deg);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2) rotate(180deg);
  }
}

/* Hero content animations */
.hero-content {
  animation: content-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

@keyframes content-reveal {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Title animation */
.hero-title {
  opacity: 0;
  transform: translateY(20px);
  animation: title-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
}

@keyframes title-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.2) 35%,
    rgba(0, 0, 0, 0.5) 55%,
    rgba(0, 0, 0, 0.75) 100%
  );
}

.lang-toggle {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 100;
}

.hero-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 800px;
  padding: 2rem;
  text-align: center;
}

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

/* Hippie badge */
.hippie-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, rgba(231, 111, 81, 0.9) 0%, rgba(244, 162, 97, 0.9) 100%);
  border-radius: 30px;
  margin-bottom: 0.5rem;
  animation: badge-glow 3s ease-in-out infinite;
}

.badge-text {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: white;
}

@keyframes badge-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(231, 111, 81, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(244, 162, 97, 0.6);
  }
}

.hero-eyebrow {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  margin: 0.5rem 0 0;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 400;
  color: var(--white);
  line-height: 1;
  margin: 0;
  letter-spacing: -0.02em;
}

.hero-name {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.25rem;
}

.name-flower {
  width: 32px;
  height: 32px;
  animation: spin-slow 8s linear infinite;
}

.name-flower svg {
  width: 100%;
  height: 100%;
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.hero-name h2 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 400;
  font-style: italic;
  color: var(--white);
  margin: 0;
  letter-spacing: 0.05em;
}

.hero-date {
  margin-top: 1.5rem;
}

.date-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 2.5rem;
  background: linear-gradient(135deg, rgba(231, 111, 81, 0.2) 0%, rgba(233, 196, 106, 0.2) 50%, rgba(42, 157, 143, 0.2) 100%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid rgba(233, 196, 106, 0.4);
  border-radius: 100px;
  box-shadow: 0 0 30px rgba(231, 111, 81, 0.2);
}

.date-number {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 400;
  color: var(--white);
  line-height: 1;
}

.date-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
}

.date-month {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--white);
}

.date-year {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.hero-cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 1rem 2rem;
  background: transparent;
  color: white;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 100px;
  transition: var(--transition-slow);
  overflow: hidden;
  animation: cta-pulse-hippie 3s ease-in-out infinite;
}

.cta-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #E76F51 0%, #F4A261 100%);
  border-radius: 100px;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
}

.cta-text {
  position: relative;
  z-index: 1;
}

.hero-cta svg {
  position: relative;
  z-index: 1;
  transition: transform var(--transition-base);
}

.hero-cta:hover {
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(231, 111, 81, 0.4);
}

.hero-cta:hover .cta-bg {
  background: linear-gradient(135deg, #2A9D8F 0%, #264653 100%);
  transform: scale(1.05);
}

.hero-cta:hover svg {
  transform: translateX(4px);
}

@keyframes cta-pulse-hippie {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(231, 111, 81, 0.5);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(231, 111, 81, 0);
  }
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  transition: color var(--transition-base);
}

.scroll-indicator:hover {
  color: var(--white);
}

.scroll-text {
  font-family: var(--font-body);
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.scroll-arrow {
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

@media (max-width: 768px) {
  .hero {
    padding-bottom: 2rem;
  }

  .hero-content {
    padding: 1.5rem;
  }

  .name-line {
    width: 40px;
  }

  .hero-name {
    gap: 1rem;
  }

  .date-wrapper {
    padding: 1rem 1.75rem;
  }

  .date-number {
    font-size: 2.5rem;
  }

  .hero-cta {
    padding: 0.875rem 1.75rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-arrow {
    animation: none;
  }
}
</style>
