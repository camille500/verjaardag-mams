<template>
  <div class="memories-form">
    <!-- Success State -->
    <Transition name="success-reveal">
      <div v-if="currentStep === 'success'" class="success-container">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h3 class="success-title">{{ $t('memories.successTitle') }}</h3>
        <p class="success-text">{{ $t('memories.successMessage') }}</p>
        <button @click="resetForm" class="secondary-btn">
          {{ $t('memories.shareAnother') }}
        </button>
      </div>
    </Transition>

    <!-- Main Content Area -->
    <Transition name="step-fade" mode="out-in">
      <!-- Step 1: Choose Type -->
      <div v-if="currentStep === 'type'" :key="'type'" class="step-content">
        <p class="step-question">{{ $t('memories.whatToShare') }}</p>

        <div class="type-options">
          <button
            class="type-card"
            :class="{ selected: memoryType === 'photos' }"
            @click="selectType('photos')"
          >
            <div class="type-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
            <span class="type-title">{{ $t('memories.optionPhotos') }}</span>
            <span class="type-desc">{{ $t('memories.optionPhotosDesc') }}</span>
          </button>

          <button
            class="type-card"
            :class="{ selected: memoryType === 'text' }"
            @click="selectType('text')"
          >
            <div class="type-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <path d="M14 2v6h6"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <line x1="10" y1="9" x2="8" y2="9"/>
              </svg>
            </div>
            <span class="type-title">{{ $t('memories.optionText') }}</span>
            <span class="type-desc">{{ $t('memories.optionTextDesc') }}</span>
          </button>
        </div>
      </div>

      <!-- Step 2a: Photos -->
      <div v-else-if="currentStep === 'photos'" :key="'photos'" class="step-content">
        <button @click="currentStep = 'type'" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {{ $t('memories.backToStart') }}
        </button>

        <div class="user-badge">
          <span class="user-icon">{{ userName.charAt(0).toUpperCase() }}</span>
          <span class="user-name">{{ userName }}</span>
        </div>

        <!-- Photo Cards -->
        <TransitionGroup name="card" tag="div" class="photo-cards">
          <div v-for="(photo, index) in photos" :key="photo.id" class="photo-card">
            <div class="photo-preview">
              <img :src="photo.preview" :alt="photo.name" />
              <button @click="removePhoto(index)" class="remove-btn" :aria-label="$t('memories.remove')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <div v-if="photo.error" class="photo-error">{{ photo.error }}</div>
            </div>
            <div class="photo-story">
              <label :for="'story-' + index" class="field-label">
                {{ $t('memories.photoStoryLabel') }}
              </label>
              <textarea
                :id="'story-' + index"
                v-model="photo.story"
                :placeholder="$t('memories.photoStoryPlaceholder')"
                rows="3"
                class="textarea-input"
              ></textarea>
            </div>
          </div>
        </TransitionGroup>

        <!-- Add More Photos -->
        <div
          class="add-photo-zone"
          :class="{ dragging: isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            @change="handleFileSelect"
            @click.stop
            class="file-input"
          />
          <div class="add-photo-content">
            <svg class="add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span v-if="photos.length === 0">{{ $t('memories.addPhotos') }}</span>
            <span v-else>{{ $t('memories.addMorePhotos') }}</span>
            <span class="file-info">{{ $t('memories.fileInfo') }}</span>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          @click="submitMemory"
          class="primary-btn submit-btn"
          :disabled="isSubmitting || validPhotos.length === 0"
        >
          <span v-if="!isSubmitting">{{ $t('memories.submitButton') }}</span>
          <span v-else class="loading">
            <span class="spinner"></span>
            {{ $t('memories.submitting') }}
          </span>
        </button>

        <!-- Error Message -->
        <Transition name="fade">
          <div v-if="errorMessage" class="error-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
        </Transition>
      </div>

      <!-- Step 2b: Text Memory -->
      <div v-else-if="currentStep === 'text'" :key="'text'" class="step-content">
        <button @click="currentStep = 'type'" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {{ $t('memories.backToStart') }}
        </button>

        <div class="user-badge">
          <span class="user-icon">{{ userName.charAt(0).toUpperCase() }}</span>
          <span class="user-name">{{ userName }}</span>
        </div>

        <div class="text-memory-section">
          <label for="text-memory" class="field-label">
            {{ $t('memories.textMemoryLabel') }}
          </label>
          <textarea
            id="text-memory"
            v-model="textMemory"
            :placeholder="$t('memories.textMemoryPlaceholder')"
            rows="8"
            class="textarea-input large"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <button
          @click="submitMemory"
          class="primary-btn submit-btn"
          :disabled="isSubmitting || !textMemory.trim()"
        >
          <span v-if="!isSubmitting">{{ $t('memories.submitButton') }}</span>
          <span v-else class="loading">
            <span class="spinner"></span>
            {{ $t('memories.submitting') }}
          </span>
        </button>

        <!-- Error Message -->
        <Transition name="fade">
          <div v-if="errorMessage" class="error-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
type Step = 'type' | 'photos' | 'text' | 'success'
type MemoryType = 'photos' | 'text' | null

interface PhotoItem {
  id: string
  file: File
  name: string
  preview: string
  story: string
  error?: string
}

const props = defineProps<{
  rsvpId: string
  userName: string
}>()

const { t } = useI18n()
const isDragging = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

// Flow state
const currentStep = ref<Step>('type')
const memoryType = ref<MemoryType>(null)
const photos = ref<PhotoItem[]>([])
const textMemory = ref('')

const MAX_FILES = 10
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

let photoIdCounter = 0

const validPhotos = computed(() => photos.value.filter(p => !p.error))

const selectType = (type: MemoryType) => {
  memoryType.value = type
  currentStep.value = type === 'photos' ? 'photos' : 'text'
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files) {
    addPhotos(Array.from(files))
  }
}

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files) {
    addPhotos(Array.from(input.files))
  }
  input.value = ''
}

const addPhotos = (files: File[]) => {
  const remainingSlots = MAX_FILES - photos.value.length

  files.slice(0, remainingSlots).forEach(file => {
    let error: string | undefined

    if (!ALLOWED_TYPES.includes(file.type)) {
      error = t('memories.errorType')
    } else if (file.size > MAX_SIZE) {
      error = t('memories.errorSize')
    }

    const preview = URL.createObjectURL(file)
    photos.value.push({
      id: `photo-${++photoIdCounter}`,
      file,
      name: file.name,
      preview,
      story: '',
      error
    })
  })
}

const removePhoto = (index: number) => {
  const photo = photos.value[index]
  URL.revokeObjectURL(photo.preview)
  photos.value.splice(index, 1)
}

const submitMemory = async () => {
  if (memoryType.value === 'photos' && validPhotos.value.length === 0) {
    errorMessage.value = t('memories.errorContent')
    return
  }

  if (memoryType.value === 'text' && !textMemory.value.trim()) {
    errorMessage.value = t('memories.errorContent')
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('uploaderName', props.userName)
    formData.append('rsvpId', props.rsvpId)
    formData.append('memoryType', memoryType.value || 'text')

    if (memoryType.value === 'photos') {
      validPhotos.value.forEach((photo, index) => {
        formData.append('files', photo.file)
        formData.append(`story_${index}`, photo.story || '')
      })
    } else {
      formData.append('textMemory', textMemory.value.trim())
    }

    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (response.success) {
      // Clean up
      photos.value.forEach(p => URL.revokeObjectURL(p.preview))
      currentStep.value = 'success'
    }
  } catch (error: unknown) {
    console.error('Submit failed:', error)
    const fetchError = error as { data?: { message?: string } }
    errorMessage.value = fetchError.data?.message || t('memories.errorUpload')
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  currentStep.value = 'type'
  memoryType.value = null
  photos.value = []
  textMemory.value = ''
  errorMessage.value = ''
}

onUnmounted(() => {
  photos.value.forEach(p => URL.revokeObjectURL(p.preview))
})
</script>

<style scoped>
.memories-form {
  max-width: 560px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

/* Step Content */
.step-content {
  opacity: 1;
  transform: translateY(0);
}

/* Back Link */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  margin-bottom: 1.5rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-500);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--accent);
}

.back-link svg {
  width: 18px;
  height: 18px;
}

/* User Badge */
.user-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 100px;
  margin-bottom: 1.5rem;
}

.user-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #C4956A 0%, #E9C46A 100%);
  border-radius: 50%;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
}

.user-name {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--gray-700);
}

/* Form Elements */
.field-label {
  display: block;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--gray-700);
  margin-bottom: 0.5rem;
}

.textarea-input {
  width: 100%;
  padding: 1rem 1.25rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--gray-900);
  background: var(--white);
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
}

.textarea-input.large {
  min-height: 200px;
}

.textarea-input::placeholder {
  color: var(--gray-400);
}

.textarea-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(184, 134, 11, 0.1);
}

/* Type Selection */
.step-question {
  font-family: var(--font-body);
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 1.25rem;
}

.type-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.type-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.75rem 1.25rem;
  background: var(--white);
  border: 2px solid var(--gray-200);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: center;
}

.type-card:hover {
  border-color: var(--gray-300);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.type-card.selected {
  border-color: var(--accent);
  background: rgba(184, 134, 11, 0.04);
  box-shadow: 0 0 0 4px rgba(184, 134, 11, 0.1);
}

.type-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  color: var(--accent);
}

.type-icon svg {
  width: 100%;
  height: 100%;
}

.type-title {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 0.25rem;
}

.type-desc {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--gray-500);
}

/* Photo Cards */
.photo-cards {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.photo-card {
  background: var(--white);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.photo-preview {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
}

.photo-card:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background: rgba(220, 38, 38, 0.9);
  transform: scale(1.1);
}

.remove-btn svg {
  width: 16px;
  height: 16px;
}

.photo-error {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  font-size: 0.875rem;
  text-align: center;
}

.photo-story {
  padding: 1.25rem;
}

/* Add Photo Zone */
.add-photo-zone {
  position: relative;
  padding: 2rem;
  background: var(--white);
  border: 2px dashed var(--gray-300);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  margin-bottom: 1.5rem;
}

.add-photo-zone:hover {
  border-color: var(--accent);
  background: rgba(184, 134, 11, 0.02);
}

.add-photo-zone.dragging {
  border-color: var(--accent);
  background: rgba(184, 134, 11, 0.05);
  transform: scale(1.01);
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.add-photo-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
  text-align: center;
}

.add-icon {
  width: 40px;
  height: 40px;
  color: var(--accent);
  margin-bottom: 0.25rem;
}

.add-photo-content span {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--gray-700);
}

.file-info {
  font-size: 0.8125rem !important;
  font-weight: 400 !important;
  color: var(--gray-400) !important;
}

/* Text Memory Section */
.text-memory-section {
  margin-bottom: 1.5rem;
}

/* Buttons */
.primary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem 2rem;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  color: var(--white);
  background: var(--gray-900);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.primary-btn:hover:not(:disabled) {
  background: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(184, 134, 11, 0.3);
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 2rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--accent);
  background: transparent;
  border: 2px solid var(--accent);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.secondary-btn:hover {
  background: var(--accent);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(184, 134, 11, 0.25);
}

.submit-btn {
  margin-top: 0.5rem;
}

.loading {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 1rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: #dc2626;
  background: rgba(220, 38, 38, 0.08);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 12px;
}

.error-message svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Success State */
.success-container {
  text-align: center;
  padding: 2rem;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #C4956A 0%, #E9C46A 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: icon-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
  box-shadow: 0 8px 32px rgba(196, 149, 106, 0.3);
}

@keyframes icon-pop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.success-icon svg {
  width: 40px;
  height: 40px;
  color: white;
  stroke-width: 3;
}

.success-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 400;
  font-style: italic;
  color: var(--gray-900);
  margin: 0 0 0.75rem;
}

.success-text {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--gray-600);
  margin: 0 0 2rem;
  line-height: 1.6;
}

/* Transitions */
.step-fade-enter-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.step-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  position: absolute;
  width: 100%;
}

.step-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.step-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.success-reveal-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.success-reveal-leave-active {
  transition: all 0.3s ease;
}

.success-reveal-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.success-reveal-leave-to {
  opacity: 0;
}

.card-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-leave-active {
  transition: all 0.3s ease;
}

.card-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.card-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.card-move {
  transition: transform 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile */
@media (max-width: 600px) {
  .memories-form {
    padding: 2rem 1.5rem;
  }

  .type-options {
    grid-template-columns: 1fr;
  }

  .type-card {
    flex-direction: row;
    padding: 1.25rem;
    text-align: left;
  }

  .type-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 0;
    margin-right: 1rem;
    flex-shrink: 0;
  }

  .type-card > :last-child {
    margin-left: auto;
  }

  .photo-card .remove-btn {
    opacity: 1;
  }
}
</style>
