<template>
  <div class="app">
    <NuxtPage />
  </div>
</template>

<style>
/* Modern Slick Design System */
:root {
  /* Primary palette - Elegant neutrals with accent */
  --white: #ffffff;
  --gray-50: #fafafa;
  --gray-100: #f5f5f5;
  --gray-200: #e5e5e5;
  --gray-300: #d4d4d4;
  --gray-400: #a3a3a3;
  --gray-500: #737373;
  --gray-600: #525252;
  --gray-700: #404040;
  --gray-800: #262626;
  --gray-900: #171717;
  --black: #0a0a0a;

  /* Accent colors */
  --accent: #b8860b;
  --accent-light: #daa520;
  --accent-dark: #8b6914;

  /* Semantic colors */
  --success: #10b981;
  --error: #ef4444;

  /* Typography */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Spacing */
  --section-padding: clamp(5rem, 12vw, 10rem);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms cubic-bezier(0.16, 1, 0.3, 1);

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 24px 60px rgba(0, 0, 0, 0.16);
}

/* Global reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  color: var(--gray-800);
  background: var(--white);
  overflow-x: hidden;
}

.app {
  min-height: 100vh;
}

/* Selection styling */
::selection {
  background: var(--accent);
  color: var(--white);
}

/* Focus styles */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Smooth image loading */
img {
  max-width: 100%;
  height: auto;
}
</style>
