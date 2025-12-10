<template>
  <section class="about" id="about" ref="sectionRef">
    <div class="container">
      <div class="content" :class="{ visible: isVisible }">
        <span class="section-label anim-item" :style="{ '--delay': '0s' }">{{ $t('about.title') }}</span>

        <h2 class="section-title anim-item" :style="{ '--delay': '0.1s' }">
          Vier het leven,<br />
          <em>vier de liefde</em>
        </h2>

        <div class="divider anim-item" :style="{ '--delay': '0.2s' }">
          <span></span>
        </div>

        <p class="section-text anim-item" :style="{ '--delay': '0.3s' }">{{ $t('about.intro') }}</p>

        <p class="section-text anim-item" :style="{ '--delay': '0.4s' }">{{ $t('about.text') }}</p>

        <p class="section-text highlight anim-item" :style="{ '--delay': '0.5s' }">{{ $t('about.about_petra') }}</p>

        <p class="section-text anim-item" :style="{ '--delay': '0.6s' }">{{ $t('about.entertainment') }}</p>

        <div class="contribution-box anim-item" :style="{ '--delay': '0.7s' }">
          <h3 class="contribution-title">{{ $t('about.contribution_title') }}</h3>
          <p class="contribution-text">{{ $t('about.contribution_text') }}</p>
          <a :href="tikkieUrl" target="_blank" rel="noopener noreferrer" class="tikkie-button">
            {{ $t('about.tikkie_button') }}
          </a>
          <p class="gift-note">{{ $t('about.gift_note') }}</p>
        </div>

        <p class="section-text closing anim-item" :style="{ '--delay': '0.8s' }">{{ $t('about.closing') }}</p>
      </div>
    </div>

    <!-- Decorative hippie flowers -->
    <div class="deco-flower flower-1" :class="{ visible: isVisible }">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="12" fill="#F4A261"/>
        <g fill="#E76F51">
          <ellipse cx="50" cy="20" rx="12" ry="18" />
          <ellipse cx="50" cy="80" rx="12" ry="18" />
          <ellipse cx="20" cy="50" rx="18" ry="12" />
          <ellipse cx="80" cy="50" rx="18" ry="12" />
          <ellipse cx="28" cy="28" rx="12" ry="18" transform="rotate(-45 28 28)" />
          <ellipse cx="72" cy="28" rx="12" ry="18" transform="rotate(45 72 28)" />
          <ellipse cx="28" cy="72" rx="12" ry="18" transform="rotate(45 28 72)" />
          <ellipse cx="72" cy="72" rx="12" ry="18" transform="rotate(-45 72 72)" />
        </g>
      </svg>
    </div>
    <div class="deco-flower flower-2" :class="{ visible: isVisible }">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="10" fill="#E9C46A"/>
        <g fill="#2A9D8F">
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
    <div class="deco-flower flower-3" :class="{ visible: isVisible }">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="8" fill="#F4A261"/>
        <g fill="#E9C46A">
          <ellipse cx="50" cy="25" rx="8" ry="14" />
          <ellipse cx="50" cy="75" rx="8" ry="14" />
          <ellipse cx="25" cy="50" rx="14" ry="8" />
          <ellipse cx="75" cy="50" rx="14" ry="8" />
        </g>
      </svg>
    </div>

    <!-- Peace symbol -->
    <div class="deco-peace" :class="{ visible: isVisible }">
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3">
        <circle cx="50" cy="50" r="45" />
        <line x1="50" y1="5" x2="50" y2="95" />
        <line x1="50" y1="50" x2="20" y2="80" />
        <line x1="50" y1="50" x2="80" y2="80" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)

// TODO: Replace with actual Tikkie URL when available
const tikkieUrl = ref('https://tikkie.me/pay/il4bjth88oken3clr9ok')

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    },
    { threshold: 0.2 }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }

  onUnmounted(() => observer.disconnect())
})
</script>

<style scoped>
.about {
  position: relative;
  padding: var(--section-padding) 2rem;
  background: linear-gradient(180deg, #FDF6E9 0%, #FFF9F0 50%, #F5EDE0 100%);
  overflow: hidden;
}

/* Subtle bohemian pattern overlay */
.about::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(233, 196, 106, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(42, 157, 143, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 60% 20%, rgba(231, 111, 81, 0.08) 0%, transparent 40%);
  pointer-events: none;
}

.container {
  position: relative;
  max-width: 720px;
  margin: 0 auto;
  z-index: 1;
}

.content {
  text-align: center;
}

.content.visible .anim-item {
  opacity: 1;
  transform: translateY(0);
}

.anim-item {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay);
}

/* Decorative hippie flowers */
.deco-flower {
  position: absolute;
  opacity: 0;
  transform: scale(0.5);
  transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.deco-flower.visible {
  opacity: 0.7;
  transform: scale(1);
}

.deco-flower svg {
  width: 100%;
  height: 100%;
}

.flower-1 {
  right: 3%;
  top: 10%;
  width: 100px;
  height: 100px;
  transition-delay: 0.3s;
}

.flower-1.visible {
  animation: float-flower 6s ease-in-out infinite;
}

.flower-2 {
  left: 5%;
  top: 40%;
  width: 70px;
  height: 70px;
  transition-delay: 0.5s;
}

.flower-2.visible {
  animation: float-flower 8s ease-in-out infinite reverse;
}

.flower-3 {
  right: 8%;
  bottom: 15%;
  width: 55px;
  height: 55px;
  transition-delay: 0.7s;
}

.flower-3.visible {
  animation: float-flower 7s ease-in-out infinite;
}

/* Peace symbol */
.deco-peace {
  position: absolute;
  left: 3%;
  bottom: 20%;
  width: 60px;
  height: 60px;
  color: #2A9D8F;
  opacity: 0;
  transform: rotate(-20deg) scale(0.5);
  transition: all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.8s;
}

.deco-peace.visible {
  opacity: 0.25;
  transform: rotate(0deg) scale(1);
}

@keyframes float-flower {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

.section-label {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #E76F51;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1.5rem;
  border: 2px solid #E76F51;
  border-radius: 30px;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 400;
  line-height: 1.2;
  color: #264653;
  margin: 0 0 2rem;
}

.section-title em {
  font-style: italic;
  color: #2A9D8F;
}

.divider {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.divider span {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #E76F51, #F4A261);
  border-radius: 2px;
}

/* Decorative dots in divider */
.divider::before,
.divider::after {
  content: '';
  width: 8px;
  height: 8px;
  background: #E9C46A;
  border-radius: 50%;
}

.section-text {
  font-family: var(--font-body);
  font-size: 1.125rem;
  line-height: 1.9;
  color: #5a6c7d;
  margin: 0 0 1.5rem;
}

.section-text.highlight {
  color: #264653;
  font-weight: 500;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, rgba(233, 196, 106, 0.2) 0%, rgba(244, 162, 97, 0.15) 100%);
  border-radius: 20px;
  border: none;
  position: relative;
}

.section-text.highlight::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: linear-gradient(180deg, #E76F51, #F4A261);
  border-radius: 2px;
}

.section-text.closing {
  font-style: italic;
  margin-top: 1.5rem;
  color: #2A9D8F;
  font-size: 1.2rem;
}

/* Contribution box - bohemian style */
.contribution-box {
  background: linear-gradient(135deg, #fff 0%, #FFFBF5 100%);
  border-radius: 24px;
  padding: 2.5rem;
  margin: 2.5rem 0;
  box-shadow:
    0 4px 20px rgba(231, 111, 81, 0.1),
    0 8px 40px rgba(42, 157, 143, 0.08);
  border: 2px solid rgba(233, 196, 106, 0.3);
  position: relative;
  overflow: hidden;
}

/* Decorative corner flourish */
.contribution-box::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(233, 196, 106, 0.3) 0%, transparent 70%);
  border-radius: 50%;
}

.contribution-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 500;
  color: #264653;
  margin: 0 0 1rem;
}

.contribution-text {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.7;
  color: #5a6c7d;
  margin: 0 0 1.5rem;
}

.tikkie-button {
  display: inline-block;
  background: linear-gradient(135deg, #E76F51 0%, #F4A261 100%);
  color: white;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 15px rgba(231, 111, 81, 0.3);
}

.tikkie-button:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(231, 111, 81, 0.4);
}

.gift-note {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: #2A9D8F;
  margin: 1.25rem 0 0;
  font-style: italic;
}

@media (max-width: 768px) {
  .about {
    padding: 4rem 1.5rem;
  }

  .section-text {
    font-size: 1rem;
    line-height: 1.7;
  }

  .deco-flower {
    opacity: 0.5 !important;
  }

  .flower-1 {
    width: 60px;
    height: 60px;
    right: 2%;
  }

  .flower-2 {
    width: 45px;
    height: 45px;
  }

  .flower-3 {
    width: 35px;
    height: 35px;
  }

  .deco-peace {
    width: 40px;
    height: 40px;
  }

  .contribution-box {
    padding: 1.5rem;
  }
}
</style>
