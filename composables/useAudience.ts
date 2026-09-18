/**
 * Who this follow-along device is: a stable id and a display name.
 *
 *   const { id, name, custom, setName } = useAudience()
 *
 * Both live in cookies, like the language, so the server renders the right name
 * and a reload keeps it. A device that never typed a name gets a generated cute
 * one on first use (`utils/cuteNames.ts`); `custom` says whether the person
 * typed it. The id is not a secret or a login: it only tells the room that two
 * connections are the same phone.
 *
 * The WebSocket sends both in its hello, so the room can say who solved what.
 */
import { computed } from 'vue'
import { useCookie, useState } from '#app'
import { useRoute } from 'vue-router'
import { useI18n } from '~/composables/useI18n'
import { cleanName, formatCuteName, parseCuteName, rollCuteName } from '~/utils/cuteNames'

const COOKIE = { maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' as const, path: '/' }

// Not crypto.randomUUID: it is missing on plain http, which is how phones reach
// the deck on the local network.
const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

export function useAudience() {
  const { locale } = useI18n()
  const route = useRoute()
  const idCookie = useCookie<string | undefined>('deck-audience', COOKIE)
  const nameCookie = useCookie<string | undefined>('deck-name', COOKIE)
  const customCookie = useCookie<string | undefined>('deck-name-custom', COOKIE)

  /**
   * `?as=Lea` makes this view a different person than the cookies say, without
   * touching them. Identity lives in cookies, so every frame of the lab page
   * would otherwise be the same student; this is how one machine can act as a
   * whole room. Nothing else uses it.
   */
  const pretend = cleanName(typeof route.query.as === 'string' ? route.query.as : '')

  const id = useState<string>('deck-audience-id', () => {
    if (pretend) return `as-${pretend.toLowerCase().replace(/[^\w-]+/g, '-').slice(0, 24)}`
    if (typeof idCookie.value === 'string' && /^[\w-]{6,40}$/.test(idCookie.value)) return idCookie.value
    const next = makeId()
    idCookie.value = next
    return next
  })

  const custom = useState<boolean>('deck-audience-custom', () => (pretend ? true : String(customCookie.value) === '1'))

  const name = useState<string>('deck-audience-name', () => {
    if (pretend) return pretend
    const stored = cleanName(nameCookie.value)
    if (stored) return stored
    const next = formatCuteName(rollCuteName(), locale.value)
    nameCookie.value = next
    return next
  })

  /** Save a name. `typed: false` marks a generated one, which follows the language. */
  const setName = (raw: string, typed = true) => {
    const next = cleanName(raw)
    if (!next) return false
    name.value = next
    custom.value = typed
    // A pretend view never writes the cookies: the real device keeps its name.
    if (pretend) return true
    nameCookie.value = next
    customCookie.value = typed ? '1' : undefined
    return true
  }

  /** The name to show: a generated one in the current language, a typed one as typed. */
  const shownName = computed(() => {
    if (custom.value) return name.value
    const parts = parseCuteName(name.value)
    return parts ? formatCuteName(parts, locale.value) : name.value
  })

  return {
    id: computed(() => id.value),
    name: shownName,
    custom: computed(() => custom.value),
    setName,
  }
}
