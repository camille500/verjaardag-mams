<template>
  <section class="hero" id="hero">
    <div class="hero-background">
      <img src="/hero.jpeg" alt="" class="loaded" />
      <div class="hero-overlay"></div>
    </div>

    <LanguageToggle class="lang-toggle" />

    <!-- Floating decorative elements -->
    <div class="floating-elements">
      <div class="float-element flower" v-for="n in 5" :key="'flower-' + n" :style="getFloatStyle(n)">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="2.5"/>
          <ellipse cx="12" cy="5" rx="2.5" ry="4"/>
          <ellipse cx="12" cy="19" rx="2.5" ry="4"/>
          <ellipse cx="5" cy="12" rx="4" ry="2.5"/>
          <ellipse cx="19" cy="12" rx="4" ry="2.5"/>
        </svg>
      </div>
    </div>

    <div class="hero-content" :class="{ visible: contentVisible }">
      <div class="hero-inner">
        <h1 class="hero-title">{{ $t('hero.title') }}</h1>

        <p class="hero-eyebrow">{{ $t('hero.subtitle') }}</p>

        <div class="hero-name">
          <span class="name-line"></span>
          <h2>{{ $t('hero.name') }}</h2>
          <span class="name-line"></span>
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
const contentVisible = ref(false)
const ctaHover = ref(false)

const getFloatStyle = (n: number) => {
  const positions = [
    { left: '5%', top: '20%', size: '24px', delay: '0s', duration: '6s' },
    { left: '85%', top: '15%', size: '20px', delay: '1s', duration: '7s' },
    { left: '10%', top: '70%', size: '18px', delay: '2s', duration: '5s' },
    { left: '90%', top: '65%', size: '22px', delay: '0.5s', duration: '8s' },
    { left: '50%', top: '85%', size: '16px', delay: '1.5s', duration: '6s' },
  ]
  const pos = positions[n - 1]
  return {
    left: pos.left,
    top: pos.top,
    '--size': pos.size,
    '--delay': pos.delay,
    '--duration': pos.duration,
  }
}

const scrollToAbout = () => {
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  setTimeout(() => {
    contentVisible.value = true
  }, 100)
})
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
  object-position: center 10%;
  opacity: 0;
  transform: scale(1.1);
  transition: opacity 1.2s ease, transform 1.5s ease;
}

.hero-background img.loaded {
  opacity: 1;
  transform: scale(1);
}

/* Floating decorative elements */
.floating-elements {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.float-element {
  position: absolute;
  width: var(--size);
  height: var(--size);
  color: rgba(255, 255, 255, 0.15);
  animation: float var(--duration) ease-in-out var(--delay) infinite;
}

.float-element svg {
  width: 100%;
  height: 100%;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-15px) rotate(5deg);
  }
  50% {
    transform: translateY(-8px) rotate(-3deg);
  }
  75% {
    transform: translateY(-20px) rotate(3deg);
  }
}

/* Hero content animations */
.hero-content {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
}

.hero-content.visible {
  opacity: 1;
  transform: translateY(0);
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
  gap: 1.5rem;
  margin-top: 0.25rem;
}

.name-line {
  width: 60px;
  height: 1px;
  background: var(--accent);
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 100px;
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
  color: var(--gray-900);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 100px;
  transition: var(--transition-slow);
  overflow: hidden;
  animation: cta-pulse 3s ease-in-out infinite;
}

.cta-bg {
  position: absolute;
  inset: 0;
  background: var(--white);
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
  color: var(--white);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.hero-cta:hover .cta-bg {
  background: var(--accent);
  transform: scale(1.05);
}

.hero-cta:hover svg {
  transform: translateX(4px);
}

@keyframes cta-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(255, 255, 255, 0);
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
