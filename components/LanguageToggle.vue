<template>
  <div class="language-toggle">
    <button
      v-for="locale in locales"
      :key="locale.code"
      :class="['lang-btn', { active: currentLocale === locale.code }]"
      @click="switchLocale(locale.code)"
    >
      {{ locale.code.toUpperCase() }}
    </button>
    <div class="toggle-indicator" :class="{ 'right': currentLocale === 'en' }"></div>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const currentLocale = computed(() => locale.value)

const switchLocale = (code: string) => {
  setLocale(code)
}
</script>

<style scoped>
.language-toggle {
  position: relative;
  display: flex;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 4px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.lang-btn {
  position: relative;
  z-index: 2;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: color var(--transition-base);
  border-radius: 6px;
}

.lang-btn:hover {
  color: rgba(255, 255, 255, 0.8);
}

.lang-btn.active {
  color: white;
}

.toggle-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: var(--accent);
  border-radius: 6px;
  transition: transform var(--transition-slow);
  z-index: 1;
}

.toggle-indicator.right {
  transform: translateX(100%);
}
</style>
