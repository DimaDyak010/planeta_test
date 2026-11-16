export default defineNuxtConfig({
  devtools: { enabled: false },
  components: false,
  imports: {
    scan: false,
  },
  nitro: {
    imports: {
      // Keep built-in imports while skipping project files such as server/utils.
      dirsScanOptions: { fileFilter: () => false },
    },
  },
  runtimeConfig: {
    materialsAlias: '',
  },
  css: ['~/assets/styles/main.less'],
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'Материалы',
      link: [
        {
          rel: 'preload',
          href: '/fonts/SourceSans3-VariableFont_wght.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: '/fonts/FuturaPT-Book.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: '/fonts/FuturaPT-Medium.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
      ],
    },
  },
})
