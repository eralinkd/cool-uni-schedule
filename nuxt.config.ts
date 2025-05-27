// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/ui',
    '@prisma/nuxt'
  ],
  devtools: { enabled: true },
  compatibilityDate: '2025-05-15'
})
