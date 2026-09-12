/**
 * Course text in German or English.
 *
 *   const { t, tm, locale, setLocale } = useI18n()
 *   t('title.scan')                         // a string
 *   t('follow.startsAt', { label: '2.1' })  // with {placeholders}
 *   tm<string[]>('intro.questions')         // anything else: arrays, objects
 *
 * The language is a per-device choice, like the view mode. It comes from
 * `?lang=de|en` on first load, then from the `deck-lang` cookie, so the server
 * renders the right words and the page never flashes the other language. The
 * `l` key toggles it on a screen; touch devices get a small pill.
 *
 * A missing key falls back to German, then to the key itself, so a gap shows
 * up on the slide instead of breaking it.
 */
import { computed } from 'vue'
import { useCookie, useRoute, useState } from '#app'
import de from '~/locales/de'
import en from '~/locales/en'

export type Locale = 'de' | 'en'

export const LOCALES: Locale[] = ['de', 'en']
export const DEFAULT_LOCALE: Locale = 'de'

const MESSAGES: Record<Locale, unknown> = { de, en }

const isLocale = (value: unknown): value is Locale => value === 'de' || value === 'en'

function lookup(tree: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>(
    (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
    tree,
  )
}

export function useI18n() {
  const route = useRoute()
  const cookie = useCookie<Locale | undefined>('deck-lang', {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  })

  const locale = useState<Locale>('deck-locale', () => {
    const raw = Array.isArray(route.query.lang) ? route.query.lang[0] : route.query.lang
    if (isLocale(raw)) return raw
    return isLocale(cookie.value) ? cookie.value : DEFAULT_LOCALE
  })

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
