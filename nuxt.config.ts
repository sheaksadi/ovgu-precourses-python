import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap',
        },
      ],
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
    '@pinia/nuxt', "@nuxt/icon"
  ],
  icon: {
    /*
     * Ship the icons inside the client bundle: nothing is fetched at runtime and
     * the server never has to require the icon package, which is missing from a
     * standalone build. The deck therefore renders its icons offline.
     */
    serverBundle: false,
    clientBundle: {
      scan: true,
      // Names built at runtime cannot be scanned, so list them.
      icons: [
        'lucide:play',
        'lucide:pause',
        'lucide:x',
        'lucide:menu',
        'lucide:eye',
        'lucide:eye-off'
      ]
    }
  },
  routeRules: {
    '/design': { redirect: '/design/system' },
  },
  nitro: {
    experimental: {
      websocket: true
    }
  }
})