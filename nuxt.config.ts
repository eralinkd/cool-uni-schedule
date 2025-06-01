// https://nuxt.com/docs/api/configuration/nuxt-config
// @eslint-disable-next-line
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/ui',
    'notivue/nuxt',
    '@pinia/nuxt'
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css',
    'notivue/notifications.css',
    'notivue/animations.css'],
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL
    }
  },
  compatibilityDate: '2025-05-15'
})
