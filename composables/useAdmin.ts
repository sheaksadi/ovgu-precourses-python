/**
 * The presenter's half of the deck, behind one word.
 *
 *   const admin = useAdmin()
 *   admin.adopt()                 // read what this device remembers
 *   admin.unlock('1337')          // true when the word is right
 *
 * The start page shows the room two doors — the projector and follow along —
 * and keeps the presenter view, the control panel and the remote behind this.
 * The three pages ask for the same word themselves, so typing the URL is the
 * same door, not a way around it.
 *
 * This is not security, and `utils/admin.ts` says why. It stops a student
 * wandering into the remote and moving the talk for everybody else.
 *
 * `?admin=1337` on any of those pages unlocks without the form, which is how
 * the check scripts get in.
 */
import { computed } from 'vue'
import { useState } from '#app'
import { useRoute } from 'vue-router'
import { storageKey } from '~/composables/useDeckRole'
import { ADMIN_QUERY, ADMIN_STORAGE_KEY, isAdminPassword } from '~/utils/admin'

const KEY = () => storageKey(ADMIN_STORAGE_KEY)

const read = () => {
  try {
    return localStorage.getItem(KEY())
  }
  catch {
    return null
  }
}

const write = (value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(KEY())
    else localStorage.setItem(KEY(), value)
  }
  catch { /* blocked storage: this visit only */ }
}

export function useAdmin() {
  const unlocked = useState<boolean>('deck-admin', () => false)
  const loaded = useState<boolean>('deck-admin-loaded', () => false)
  const route = useRoute()

  /** Read the device, and take the query parameter if it carries the word. */
  const adopt = () => {
    if (import.meta.server) return
    const fromQuery = route.query[ADMIN_QUERY]
    if (isAdminPassword(Array.isArray(fromQuery) ? fromQuery[0] : fromQuery)) {
      unlocked.value = true
      loaded.value = true
      write('1')
      return
    }
    if (loaded.value) return
    loaded.value = true
    unlocked.value = read() === '1'
  }

  /** True when the word was right. The device remembers it afterwards. */
  const unlock = (value: string) => {
    if (!isAdminPassword(value)) return false
    unlocked.value = true
    loaded.value = true
    write('1')
    return true
  }

  const lock = () => {
    unlocked.value = false
    write(null)
  }

  return {
    unlocked: computed(() => unlocked.value),
    adopt,
    unlock,
    lock,
  }
}
