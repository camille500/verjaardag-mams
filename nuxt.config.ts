// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/i18n'],

  runtimeConfig: {
    // Server-side only (not exposed to client)
    // Credentials are automatically provided by AWS Amplify via IAM role
    awsRegion: process.env.REGION || 'eu-central-1',
    dynamodbTableName: process.env.DYNAMODB_TABLE_NAME || 'party-rsvps',
    sesFromEmail: process.env.SES_FROM_EMAIL || 'noreply@example.com'
  },

  i18n: {
    locales: [
      { code: 'nl', name: 'Nederlands', file: 'nl.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'nl',
    langDir: 'locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: false
  },

  app: {
    head: {
      title: 'Uitnodiging Verjaardag',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Quicksand:wght@300;400;500;600&display=swap' }
      ]
    }
  }
})
