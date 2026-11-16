export default defineNuxtConfig({
  css: ['~/assets/styles/main.less'],
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'Материалы',
    },
  },
})
