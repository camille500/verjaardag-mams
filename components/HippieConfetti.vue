<template>
  <div class="confetti-container" :class="{ active: isActive }">
    <div
      v-for="(particle, index) in particles"
      :key="index"
      class="particle"
      :class="particle.type"
      :style="particle.style"
    >
      <component :is="particle.icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Particle {
  type: string
  icon: any
  style: Record<string, string>
}

const props = defineProps<{
  trigger?: boolean
}>()

const isActive = ref(false)
const particles = ref<Particle[]>([])

// SVG Icons as components
const FlowerIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="3"/>
      <ellipse cx="12" cy="5" rx="3" ry="4"/>
      <ellipse cx="12" cy="19" rx="3" ry="4"/>
      <ellipse cx="5" cy="12" rx="4" ry="3"/>
      <ellipse cx="19" cy="12" rx="4" ry="3"/>
      <ellipse cx="7" cy="7" rx="3" ry="3" transform="rotate(-45 7 7)"/>
      <ellipse cx="17" cy="7" rx="3" ry="3" transform="rotate(45 17 7)"/>
      <ellipse cx="7" cy="17" rx="3" ry="3" transform="rotate(45 7 17)"/>
      <ellipse cx="17" cy="17" rx="3" ry="3" transform="rotate(-45 17 17)"/>
    </svg>
  `
}

const HeartIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  `
}

const StarIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  `
}

const DaisyIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="2.5"/>
      <ellipse cx="12" cy="4" rx="2" ry="3.5"/>
      <ellipse cx="12" cy="20" rx="2" ry="3.5"/>
      <ellipse cx="4" cy="12" rx="3.5" ry="2"/>
      <ellipse cx="20" cy="12" rx="3.5" ry="2"/>
      <ellipse cx="6.3" cy="6.3" rx="2" ry="3" transform="rotate(-45 6.3 6.3)"/>
      <ellipse cx="17.7" cy="6.3" rx="2" ry="3" transform="rotate(45 17.7 6.3)"/>
      <ellipse cx="6.3" cy="17.7" rx="2" ry="3" transform="rotate(45 6.3 17.7)"/>
      <ellipse cx="17.7" cy="17.7" rx="2" ry="3" transform="rotate(-45 17.7 17.7)"/>
    </svg>
  `
}

const SunIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  `
}

const LeafIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
    </svg>
  `
}

const icons = [FlowerIcon, HeartIcon, StarIcon, DaisyIcon, SunIcon, LeafIcon]
const types = ['flower', 'heart', 'star', 'daisy', 'sun', 'leaf']
const colors = [
  '#FF6B6B', // coral red
  '#FFE66D', // sunny yellow
  '#4ECDC4', // turquoise
  '#FF8C42', // orange
  '#A855F7', // purple
  '#F472B6', // pink
  '#34D399', // green
  '#60A5FA', // blue
]

const generateParticles = () => {
  const newParticles: Particle[] = []
  const count = 60

  for (let i = 0; i < count; i++) {
    const typeIndex = Math.floor(Math.random() * types.length)
    const colorIndex = Math.floor(Math.random() * colors.length)
    const size = 12 + Math.random() * 20
    const startX = Math.random() * 100
    const drift = (Math.random() - 0.5) * 40
    const delay = Math.random() * 0.8
    const duration = 2.5 + Math.random() * 2
    const rotation = Math.random() * 720 - 360

    newParticles.push({
      type: types[typeIndex],
      icon: icons[typeIndex],
      style: {
        '--size': `${size}px`,
        '--color': colors[colorIndex],
        '--start-x': `${startX}vw`,
        '--drift': `${drift}vw`,
        '--delay': `${delay}s`,
        '--duration': `${duration}s`,
        '--rotation': `${rotation}deg`,
        '--opacity': `${0.7 + Math.random() * 0.3}`,
      }
    })
  }

  particles.value = newParticles
}

const triggerConfetti = () => {
  generateParticles()
  isActive.value = true

  setTimeout(() => {
    isActive.value = false
  }, 5000)
}

watch(() => props.trigger, (newVal) => {
  if (newVal) {
    triggerConfetti()
  }
})

defineExpose({
  trigger: triggerConfetti
})
</script>

<style scoped>
.confetti-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.confetti-container.active {
  opacity: 1;
}

.particle {
  position: absolute;
  top: -50px;
  left: var(--start-x);
  width: var(--size);
  height: var(--size);
  color: var(--color);
  opacity: 0;
  animation: fall var(--duration) ease-out var(--delay) forwards;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.particle svg {
  width: 100%;
  height: 100%;
}

/* Type-specific animations */
.particle.flower {
  animation: fall var(--duration) ease-out var(--delay) forwards,
             spin var(--duration) linear var(--delay) infinite;
}

.particle.heart {
  animation: fall var(--duration) ease-out var(--delay) forwards,
             pulse-heart 0.5s ease-in-out infinite alternate;
}

.particle.star {
  animation: fall var(--duration) ease-out var(--delay) forwards,
             twinkle 0.3s ease-in-out infinite alternate;
}

.particle.daisy {
  animation: fall var(--duration) ease-out var(--delay) forwards,
             gentle-spin var(--duration) linear var(--delay) infinite;
}

.particle.sun {
  animation: fall var(--duration) ease-out var(--delay) forwards,
             glow 0.8s ease-in-out infinite alternate;
}

.particle.leaf {
  animation: fall-sway var(--duration) ease-out var(--delay) forwards;
}

@keyframes fall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(0);
    opacity: 0;
  }
  10% {
    opacity: var(--opacity);
    transform: translateY(10vh) translateX(calc(var(--drift) * 0.1)) rotate(calc(var(--rotation) * 0.1)) scale(1);
  }
  100% {
    transform: translateY(110vh) translateX(var(--drift)) rotate(var(--rotation)) scale(0.8);
    opacity: 0;
  }
}

@keyframes fall-sway {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(0);
    opacity: 0;
  }
  10% {
    opacity: var(--opacity);
    transform: translateY(10vh) translateX(calc(var(--drift) * 0.1)) scale(1);
  }
  25% {
    transform: translateY(27.5vh) translateX(calc(var(--drift) * 0.5 + 20px)) rotate(-15deg);
  }
  50% {
    transform: translateY(55vh) translateX(calc(var(--drift) * 0.7 - 15px)) rotate(10deg);
  }
  75% {
    transform: translateY(82.5vh) translateX(calc(var(--drift) * 0.9 + 10px)) rotate(-8deg);
  }
  100% {
    transform: translateY(110vh) translateX(var(--drift)) rotate(var(--rotation)) scale(0.8);
    opacity: 0;
  }
}

@keyframes spin {
  from {
    transform: translateY(0) rotate(0deg);
  }
  to {
    transform: translateY(0) rotate(360deg);
  }
}

@keyframes gentle-spin {
  from {
    transform: translateY(0) rotate(0deg);
  }
  to {
    transform: translateY(0) rotate(180deg);
  }
}

@keyframes pulse-heart {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.15);
  }
}

@keyframes twinkle {
  from {
    transform: scale(1);
    filter: brightness(1) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
  to {
    transform: scale(1.1);
    filter: brightness(1.3) drop-shadow(0 2px 8px var(--color));
  }
}

@keyframes glow {
  from {
    filter: brightness(1) drop-shadow(0 0 4px var(--color));
  }
  to {
    filter: brightness(1.2) drop-shadow(0 0 12px var(--color));
  }
}

@media (prefers-reduced-motion: reduce) {
  .particle {
    animation: fade-only var(--duration) ease-out var(--delay) forwards;
  }

  @keyframes fade-only {
    0% { opacity: 0; top: 0; }
    10% { opacity: var(--opacity); }
    100% { opacity: 0; top: 100vh; }
  }
}
</style>
