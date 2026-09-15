/**
 * Deck font, chosen per device like the language.
 *
 *   mono   JetBrains Mono, the default
 *   comic  Comic Sans (Comic Sans MS where installed, Comic Neue otherwise)
 *
 * The choice only swaps `--font-text`, the font everything you read uses. Code
 * keeps `--font-code`, so indentation and alignment never break. It lives in the
 * `deck-font` cookie so the server renders the right font straight away; the
 * start page has the picker, and `?font=comic` on a link sets it too
 * (`plugins/font.ts`).
 */
import { computed } from 'vue'
import { useCookie, useState } from '#app'

export type DeckFont = 'mono' | 'comic'

export const FONTS: Array<{ id: DeckFont, label: string, stack: string }> = [
  { id: 'mono', label: 'Mono', stack: "'JetBrains Mono', ui-monospace, monospace" },
  { id: 'comic', label: 'Comic Sans', stack: "'Comic Sans MS', 'Comic Neue', 'Chalkboard SE', cursive" },
]

export const isDeckFont = (value: unknown): value is DeckFont => value === 'mono' || value === 'comic'

/** The font a link asks for: `?font=comic`. */
export function fontFromQuery(query: Record<string, unknown>): DeckFont | undefined {
  const raw = Array.isArray(query.font) ? query.font[0] : query.font
  return isDeckFont(raw) ? raw : undefined
}

export function useFont() {
  const cookie = useCookie<DeckFont | undefined>('deck-font', {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  })

  const font = useState<DeckFont>('deck-font', () => (isDeckFont(cookie.value) ? cookie.value : 'mono'))

  const setFont = (next: DeckFont) => {
    font.value = next
    cookie.value = next
  }

  return {
    font: computed(() => font.value),
    fonts: FONTS,
    setFont,
  }
}
