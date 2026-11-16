export default defineNuxtConfig({
  devtools: { enabled: false },
  components: false,
  imports: {
    scan: false,
  },
  nitro: {
    imports: {
      dirsScanOptions: { fileFilter: () => false },
    },
  },
  runtimeConfig: {
    materialsAlias: '',
  },
  routeRules: {
    '/materials/new': { ssr: false },
  },
  css: ['~/assets/styles/main.less'],
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'Материалы',
      titleTemplate: '%s | Моя Планета',
      meta: [
        { name: 'description', content: 'Материалы телеканала «Моя Планета».' },
        { property: 'og:site_name', content: 'Моя Планета' },
        { property: 'og:locale', content: 'ru_RU' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
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
