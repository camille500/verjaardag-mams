<template>
  <main class="memories-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-large"></div>
      <p>{{ $t('memoriesPage.loading') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <h1>{{ $t('memoriesPage.errorTitle') }}</h1>
      <p>{{ $t('memoriesPage.errorText') }}</p>
      <NuxtLink to="/" class="back-home-btn">{{ $t('memoriesPage.backHome') }}</NuxtLink>
    </div>

    <!-- Main Content -->
    <div v-else class="content-container">
      <!-- Header -->
      <header class="page-header">
        <NuxtLink to="/" class="logo-link">
          <span class="logo-text">Petra's 60e</span>
        </NuxtLink>
      </header>

      <!-- Welcome Section -->
      <section class="welcome-section">
        <div class="welcome-content">
          <span class="welcome-label">{{ $t('memoriesPage.welcomeLabel') }}</span>
          <h1 class="welcome-title">{{ $t('memoriesPage.welcomeTitle', { name: rsvpData?.name }) }}</h1>
          <p class="welcome-text">{{ $t('memoriesPage.welcomeText') }}</p>
        </div>
      </section>

      <!-- Memories Form Section -->
      <section class="form-section">
        <MemoriesForm :rsvp-id="rsvpId" :user-name="rsvpData?.name || ''" />
      </section>

      <!-- Footer -->
      <footer class="page-footer">
        <p>{{ $t('footer.text') }}</p>
        <NuxtLink to="/" class="footer-link">{{ $t('memoriesPage.backToInvite') }}</NuxtLink>
      </footer>
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()

const rsvpId = computed(() => route.params.id as string)
const loading = ref(true)
const error = ref(false)
const rsvpData = ref<{ name: string; attending: string } | null>(null)

useHead({
  title: t('memoriesPage.pageTitle'),
  htmlAttrs: {
    lang: 'nl'
  }
})

onMounted(async () => {
  try {
    const response = await $fetch(`/api/rsvp/${rsvpId.value}`)
    if (response.success && response.rsvp) {
      rsvpData.value = {
        name: response.rsvp.name,
        attending: response.rsvp.attending
      }
    } else {
      error.value = true
    }
  } catch (e) {
    console.error('Failed to fetch RSVP:', e)
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.memories-page {
  min-height: 100vh;
  background: var(--gray-50);
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1.5rem;
}

.spinner-large {
  width: 48px;
  height: 48px;
  border: 3px solid var(--gray-200);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-container p {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--gray-500);
}

/* Error State */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
}

.error-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  color: var(--gray-400);
}

.error-icon svg {
  width: 100%;
  height: 100%;
}

.error-container h1 {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 400;
  font-style: italic;
  color: var(--gray-900);
  margin: 0 0 0.75rem;
}

.error-container p {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--gray-600);
  margin: 0 0 2rem;
  max-width: 400px;
}

.back-home-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.875rem 2rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: white;
  background: var(--gray-900);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.back-home-btn:hover {
  background: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(184, 134, 11, 0.25);
}

/* Content Container */
.content-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.page-header {
  padding: 1.5rem 2rem;
  background: var(--white);
  border-bottom: 1px solid var(--gray-100);
}

.logo-link {
  text-decoration: none;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-style: italic;
  color: var(--accent);
}

/* Welcome Section */
.welcome-section {
  background: linear-gradient(135deg, #C4956A 0%, #D4A574 50%, #E9C46A 100%);
  padding: 4rem 2rem;
  text-align: center;
}

.welcome-content {
  max-width: 600px;
  margin: 0 auto;
}

.welcome-label {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 1rem;
}

.welcome-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 400;
  font-style: italic;
  color: white;
  margin: 0 0 1rem;
}

.welcome-text {
  font-family: var(--font-body);
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.7;
  margin: 0;
}

/* Form Section */
.form-section {
  flex: 1;
  padding: 0;
}

/* Footer */
.page-footer {
  padding: 3rem 2rem;
  background: var(--gray-900);
  text-align: center;
}

.page-footer p {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 1rem;
}

.footer-link {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #E9C46A;
}

@media (max-width: 600px) {
  .welcome-section {
    padding: 3rem 1.5rem;
  }
}
</style>
