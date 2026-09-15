import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  // Listen on the local network, not just this laptop, so phones can open the
  // follow-along QR code and the remote. Anyone on the same Wi-Fi can view the
  // deck; only controller routes expose room-writing controls.
  devServer: { host: '0.0.0.0' },
  css: ['~/assets/css/main.css'],
  app: {
    // A slide that switches layout (the bare title slide into a chrome slide)
    // mounts without the page transition, so the layout gets the same entrance.
    // Stages of one scene share a layout and stay an invisible cut.
    layoutTransition: { name: 'slide-rise', mode: 'out-in' },
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
    // check:deck writes screenshots (and test browsers keep profiles) in deck-shots/;
    // watching them made the dev server reload the page every few seconds.
    server: {
      watch: { ignored: ['**/deck-shots/**'] },
    },
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
        'lucide:eye-off',
        // Start page view buttons, rendered from a list.
        'lucide:projector',
        'lucide:presentation',
        'lucide:layout-dashboard',
        'lucide:smartphone'
      ]
    }
  },
  nitro: {
    experimental: {
      websocket: true
    }
  }
})
