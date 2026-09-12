/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        surface:    '#FFFFFF',
        'surface-off': '#F5F5F0',
        'surface-warm': '#FFF8F3',
        ink:        '#1A1A1A',
        'ink-dim':  '#6B6B6B',
        'ink-muted':'#B0B0B0',
        coral:      '#FF6B6B',
        mint:       '#4ECDC4',
        sky:        '#74B9FF',
        rose:       '#F78DA7',
        sun:        '#FFEAA7',
        lavender:   '#A29BFE',
        peach:      '#FAB1A0',
        sage:       '#B8E994',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
