/**
 * Course text in German or English.
 *
 *   const { t, tm, locale, setLocale } = useI18n()
 *   t('title.scan')                         // a string
 *   t('follow.startsAt', { label: '2.1' })  // with {placeholders}
 *   tm<string[]>('intro.questions')         // anything else: arrays, objects
 *
 * The language is a per-device choice, like the view mode, kept in the
 * `deck-lang` cookie so the server renders the right words and the page never
 * flashes the other language. Three ways to set it:
 *
 *   - a link: `?lang=en`, `?lang=de`, or just `?en` / `?de`, on any page and on
 *     every navigation (`plugins/i18n-link.ts`),
 *   - the `l` key on a screen,
 *   - the DE | EN pill on touch devices, or the buttons on `/join`.
 *
 * A missing key falls back to German, then to the key itself, so a gap shows
 * up on the slide instead of breaking it.
 */
import { computed } from 'vue'
import { useCookie, useState } from '#app'
import de from '~/locales/de'
import en from '~/locales/en'

export type Locale = 'de' | 'en'

export const LOCALES: Locale[] = ['de', 'en']
export const DEFAULT_LOCALE: Locale = 'de'

const MESSAGES: Record<Locale, unknown> = { de, en }

export const isLocale = (value: unknown): value is Locale => value === 'de' || value === 'en'

/** The language a link asks for: `?lang=en`, or a bare `?en`. */
export function localeFromQuery(query: Record<string, unknown>): Locale | undefined {
  const raw = Array.isArray(query.lang) ? query.lang[0] : query.lang
  if (isLocale(raw)) return raw
  return LOCALES.find(code => code in query)
}

function lookup(tree: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>(
    (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
    tree,
  )
}

export function useI18n() {
  const cookie = useCookie<Locale | undefined>('deck-lang', {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  })

  const locale = useState<Locale>('deck-locale', () => (isLocale(cookie.value) ? cookie.value : DEFAULT_LOCALE))

  const setLocale = (next: Locale) => {
    locale.value = next
    cookie.value = next
  }

  const toggleLocale = () => setLocale(locale.value === 'de' ? 'en' : 'de')

  const tm = <T = unknown>(path: string): T =>
    (lookup(MESSAGES[locale.value], path) ?? lookup(MESSAGES[DEFAULT_LOCALE], path)) as T

  const t = (path: string, vars?: Record<string, string | number>): string => {
    const raw = tm<unknown>(path)
    if (typeof raw !== 'string') return path
    return vars ? raw.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match)) : raw
  }

  return {
    locale: computed(() => locale.value),
    locales: LOCALES,
    setLocale,
    toggleLocale,
    t,
    tm,
  }
}
