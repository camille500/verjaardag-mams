<template>
  <section class="rsvp" id="rsvp" ref="sectionRef">
    <HippieConfetti ref="confettiRef" />
    <div class="container">
      <div class="header" :class="{ visible: isVisible }">
        <span class="section-label">{{ $t('rsvp.title') }}</span>
        <h2 class="section-title">{{ $t('rsvp.intro') }}</h2>
      </div>

      <form
        @submit.prevent="submitRsvp"
        class="form"
        :class="{ visible: isVisible }"
      >
        <div class="form-row">
          <div class="form-group">
            <label for="name">{{ $t('rsvp.name') }} <span class="required">*</span></label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              required
              :placeholder="$t('rsvp.namePlaceholder')"
            />
          </div>

          <div class="form-group">
            <label for="email">{{ $t('rsvp.email') }} <span class="required">*</span></label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              required
              :placeholder="$t('rsvp.emailPlaceholder')"
            />
          </div>
        </div>

        <div class="form-group">
          <label>{{ $t('rsvp.attending') }} <span class="required">*</span></label>
          <div class="radio-group">
            <label class="radio-option" :class="{ selected: form.attending === 'yes' }">
              <input type="radio" v-model="form.attending" value="yes" required />
              <span class="radio-label">{{ $t('rsvp.yes') }}</span>
            </label>
            <label class="radio-option" :class="{ selected: form.attending === 'no' }">
              <input type="radio" v-model="form.attending" value="no" />
              <span class="radio-label">{{ $t('rsvp.no') }}</span>
            </label>
          </div>
        </div>

        <Transition name="slide">
          <div v-if="form.attending === 'yes'" class="conditional-fields">
            <div class="form-row">
              <div class="form-group">
                <label for="guests">{{ $t('rsvp.guests') }} <span class="required">*</span></label>
                <select id="guests" v-model="form.guests" required>
                  <option value="1">1 {{ $t('rsvp.person', 1) }}</option>
                  <option value="2">2 {{ $t('rsvp.person', 2) }}</option>
                  <option value="3">3 {{ $t('rsvp.person', 2) }}</option>
                  <option value="4">4 {{ $t('rsvp.person', 2) }}</option>
                  <option value="5">5+ {{ $t('rsvp.person', 2) }}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="contribution">{{ $t('rsvp.contribution') }}</label>
                <input
                  type="text"
                  id="contribution"
                  v-model="form.contribution"
                  :placeholder="$t('rsvp.contributionPlaceholder')"
                />
              </div>
            </div>
          </div>
        </Transition>

        <div class="form-group">
          <label for="message">{{ $t('rsvp.message') }}</label>
          <textarea
            id="message"
            v-model="form.message"
            :placeholder="$t('rsvp.messagePlaceholder')"
            rows="4"
          ></textarea>
        </div>

        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <span v-if="!isSubmitting">{{ $t('rsvp.submit') }}</span>
          <span v-else class="loading">
            <span class="spinner"></span>
            {{ $t('rsvp.submitting') }}
          </span>
        </button>

        <Transition name="fade">
          <div v-if="submitSuccess" class="success-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            <span>{{ $t('rsvp.success') }}</span>
          </div>
        </Transition>

        <Transition name="fade">
          <div v-if="submitError" class="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span>{{ submitError }}</span>
          </div>
        </Transition>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement>()
const confettiRef = ref<{ trigger: () => void }>()
const isVisible = ref(false)

const form = reactive({
  name: '',
  email: '',
  attending: '',
  guests: '1',
  contribution: '',
  message: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const { locale } = useI18n()

const submitRsvp = async () => {
  isSubmitting.value = true
  submitError.value = ''

  try {
    const response = await $fetch('/api/rsvp', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        attending: form.attending,
        guests: form.guests,
        contribution: form.contribution,
        message: form.message,
        locale: locale.value
      }
    })

    if (response.success) {
      submitSuccess.value = true

      // Trigger confetti on successful submission if attending
      if (form.attending === 'yes') {
        confettiRef.value?.trigger()
      }

      Object.assign(form, {
        name: '',
        email: '',
        attending: '',
        guests: '1',
        contribution: '',
        message: ''
      })

      setTimeout(() => {
        submitSuccess.value = false
      }, 5000)
    }
  } catch (error: unknown) {
    console.error('RSVP submission failed:', error)
    const fetchError = error as { data?: { message?: string } }
    submitError.value = fetchError.data?.message || 'Er is iets misgegaan. Probeer het opnieuw.'
    setTimeout(() => {
      submitError.value = ''
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    },
    { threshold: 0.1 }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }

  onUnmounted(() => observer.disconnect())
})
</script>

<style scoped>
.rsvp {
  padding: var(--section-padding) 2rem;
  background: var(--white);
}

.container {
  max-width: 560px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.header.visible {
  opacity: 1;
  transform: translateY(0);
}

.section-label {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 400;
  font-style: italic;
  color: var(--gray-900);
  margin: 0;
}

.form {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
}

.form.visible {
  opacity: 1;
  transform: translateY(0);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-700);
  margin-bottom: 0.5rem;
}

.required {
  color: var(--accent);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--gray-900);
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--gray-400);
  transition: opacity 0.2s ease;
}

.form-group input:focus::placeholder,
.form-group textarea:focus::placeholder {
  opacity: 0.5;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  background: var(--white);
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(184, 134, 11, 0.1);
  transform: translateY(-2px);
}

.form-group input:not(:placeholder-shown),
.form-group textarea:not(:placeholder-shown) {
  border-color: var(--gray-300);
}

.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
  cursor: pointer;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.radio-option {
  flex: 1;
  position: relative;
  cursor: pointer;
}

.radio-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.radio-label {
  display: block;
  padding: 1rem;
  text-align: center;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--gray-600);
  background: var(--gray-50);
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.radio-label::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.radio-option:hover .radio-label {
  border-color: var(--gray-300);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.radio-option.selected .radio-label {
  color: var(--accent-dark);
  background: rgba(184, 134, 11, 0.08);
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(184, 134, 11, 0.15);
}

.radio-option.selected .radio-label::before {
  opacity: 1;
}

.conditional-fields {
  overflow: hidden;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.submit-btn {
  position: relative;
  width: 100%;
  padding: 1rem 2rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--white);
  background: var(--gray-900);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.submit-btn:hover:not(:disabled)::before {
  width: 300%;
  height: 300%;
}

.submit-btn:hover:not(:disabled) {
  background: var(--accent);
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(184, 134, 11, 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(184, 134, 11, 0.2);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
  padding: 1rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--success);
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
  padding: 1rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: #dc2626;
  background: rgba(220, 38, 38, 0.08);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .rsvp {
    padding: 4rem 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .radio-group {
    flex-direction: column;
  }
}
</style>
