<template>
  <footer class="footer" ref="footerRef">
    <div class="container" :class="{ visible: isVisible }">
      <p class="message anim-item" :style="{ '--delay': '0s' }">{{ $t('footer.text') }}</p>
      <div class="divider anim-item" :style="{ '--delay': '0.15s' }">
        <span></span>
      </div>
      <p class="date anim-item" :style="{ '--delay': '0.25s' }">2025</p>

      <!-- Decorative elements -->
      <div class="deco-hearts">
        <span v-for="n in 3" :key="n" class="heart" :style="{ '--i': n }">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const footerRef = ref<HTMLElement>()
const isVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    },
    { threshold: 0.3 }
  )

  if (footerRef.value) {
    observer.observe(footerRef.value)
  }

  onUnmounted(() => observer.disconnect())
})
</script>

<style scoped>
.footer {
  position: relative;
  padding: 4rem 2rem;
  background: var(--gray-900);
  text-align: center;
  overflow: hidden;
}

.container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  z-index: 1;
}

.anim-item {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay);
}

.container.visible .anim-item {
  opacity: 1;
  transform: translateY(0);
}

.message {
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 400;
  font-style: italic;
  color: var(--white);
  margin: 0;
  line-height: 1.4;
}

.divider {
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
}

.divider span {
  width: 40px;
  height: 1px;
  background: var(--accent);
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
}

.container.visible .divider span {
  width: 60px;
}

.date {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--gray-500);
  margin: 0;
}

/* Decorative hearts */
.deco-hearts {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.heart {
  position: absolute;
  width: 16px;
  height: 16px;
  color: var(--accent);
  opacity: 0.15;
  animation: float-heart 8s ease-in-out infinite;
  animation-delay: calc(var(--i) * 1.5s);
}

.heart:nth-child(1) {
  left: 10%;
  top: 30%;
}

.heart:nth-child(2) {
  left: 85%;
  top: 20%;
  width: 12px;
  height: 12px;
}

.heart:nth-child(3) {
  left: 75%;
  top: 60%;
  width: 14px;
  height: 14px;
}

.heart svg {
  width: 100%;
  height: 100%;
}

@keyframes float-heart {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-8px) rotate(5deg);
  }
  50% {
    transform: translateY(-4px) rotate(-3deg);
  }
  75% {
    transform: translateY(-12px) rotate(3deg);
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 3rem 1.5rem;
  }

  .deco-hearts {
    display: none;
  }
}
</style>
