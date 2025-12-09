<template>
  <section class="location" id="location" ref="sectionRef">
    <div class="container">
      <div class="header" :class="{ visible: isVisible }">
        <span class="section-label">{{ $t('location.title') }}</span>
        <h2 class="section-title">Waar & Wanneer</h2>
      </div>

      <div class="cards" :class="{ visible: isVisible }">
        <div class="card" :style="{ '--card-delay': '0s' }">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <h3>{{ $t('location.address') }}</h3>
          <p class="venue">{{ $t('location.venueName') }}</p>
          <p class="address">
            {{ $t('location.street') }}<br />
            {{ $t('location.city') }}
          </p>
        </div>

        <div class="card" :style="{ '--card-delay': '0.1s' }">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h3>{{ $t('location.byCar') }}</h3>
          <p>{{ $t('location.carInfo') }}</p>
        </div>

        <div class="card" :style="{ '--card-delay': '0.2s' }">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 11V4a1 1 0 0 1 1-1h3"/>
              <path d="M4 11H2l1.5-4.5"/>
              <path d="M4 11h16"/>
              <path d="M20 11v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7"/>
              <path d="M20 11l1.5-4.5L20 3h-3"/>
              <circle cx="7.5" cy="15.5" r="1.5"/>
              <circle cx="16.5" cy="15.5" r="1.5"/>
            </svg>
          </div>
          <h3>{{ $t('location.byTransit') }}</h3>
          <p>{{ $t('location.transitInfo') }}</p>
        </div>
      </div>

      <div class="map-wrapper" :class="{ visible: isVisible }">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2435.5876!2d4.8847!3d52.3876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c609c5f8b6c5a1%3A0x4e8f8f8f8f8f8f8f!2sGrote%20Bickersstraat%2074%2C%201013%20KS%20Amsterdam!5e0!3m2!1snl!2snl!4v1699999999999!5m2!1snl!2snl"
          width="100%"
          height="100%"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="De Walvis locatie"
        ></iframe>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement>()
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
    { threshold: 0.1 }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }

  onUnmounted(() => observer.disconnect())
})
</script>

<style scoped>
.location {
  padding: var(--section-padding) 2rem;
  background: var(--gray-50);
}

.container {
  max-width: 960px;
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
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 400;
  font-style: italic;
  color: var(--gray-900);
  margin: 0;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.cards .card {
  opacity: 0;
  transform: translateY(40px) scale(0.95);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--card-delay);
}

.cards.visible .card {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.card {
  position: relative;
  background: var(--white);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(184, 134, 11, 0.05) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
  border-color: var(--accent);
}

.card:hover::before {
  opacity: 1;
}

.card-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: var(--gray-50);
  border-radius: 50%;
  margin-bottom: 1.25rem;
  color: var(--accent);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-icon::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.card:hover .card-icon {
  background: rgba(184, 134, 11, 0.15);
  transform: scale(1.1) rotate(5deg);
}

.card:hover .card-icon::after {
  opacity: 0.5;
  transform: scale(1);
}

.card:hover .card-icon svg {
  animation: icon-bounce 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes icon-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.card h3 {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--gray-900);
  margin: 0 0 0.75rem;
}

.card p {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--gray-600);
  margin: 0;
}

.venue {
  font-weight: 600;
  color: var(--gray-800) !important;
  margin-bottom: 0.25rem !important;
}

.map-wrapper {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
  height: 320px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--white);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
}

.map-wrapper.visible {
  opacity: 1;
  transform: translateY(0);
}

.map-wrapper iframe {
  display: block;
}

@media (max-width: 900px) {
  .cards {
    grid-template-columns: 1fr 1fr;
  }

  .cards .card:last-child {
    grid-column: 1 / -1;
    max-width: 50%;
    justify-self: center;
  }
}

@media (max-width: 600px) {
  .location {
    padding: 4rem 1.5rem;
  }

  .cards {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  .cards .card:last-child {
    max-width: 100%;
  }

  .card {
    padding: 1.5rem;
  }

  .map-wrapper {
    height: 260px;
  }
}
</style>
