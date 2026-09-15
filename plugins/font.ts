/**
 * Applies the deck font on every page.
 *
 * Puts `data-font` on <html>, which swaps `--font-text` in `assets/css/main.css`,
 * reads `?font=comic` / `?font=mono` from links on every navigation, and loads
 * Comic Neue from Google Fonts only while Comic Sans is chosen, for machines
 * that do not have Comic Sans MS installed.
 */
import { computed } from 'vue'
import { defineNuxtPlugin, useHead, useRouter } from '#app'
import { fontFromQuery, useFont } from '~/composables/useFont'

const COMIC_NEUE = 'https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,400;0,700;1,400&display=swap'

export default defineNuxtPlugin(() => {
  const router = useRouter()
  const { font, setFont } = useFont()

  const apply = (query: Record<string, unknown>) => {
    const next = fontFromQuery(query)
    if (next) setFont(next)
  }

  apply(router.currentRoute.value.query)
  router.afterEach(to => apply(to.query))

  useHead({
    htmlAttrs: { 'data-font': computed(() => font.value) },
    link: computed(() => (font.value === 'comic'
      ? [{ key: 'deck-font-comic', rel: 'stylesheet', href: COMIC_NEUE }]
      : [])),
  })
})
