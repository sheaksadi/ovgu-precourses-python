/**
 * Debug mode: a switcher for trying the deck out.
 *
 *   const { enabled, toggle } = useDebug()
 *
 * Turned on from the start page and remembered per device, so it survives every
 * navigation while testing and is off for everyone else. While it is on,
 * `components/deck/DebugBar.vue` floats above the deck: jump between the views
 * of the same slide, move the room, and see what this screen thinks it is.
 *
 * It is a tool for the person building the deck, never part of a talk.
 */
import { computed } from 'vue'
import { useState } from '#app'
import { storageKey } from '~/composables/useDeckRole'

export interface DebugSpot {
  x: number
  y: number
}

const KEY = () => storageKey('debug')
const SPOT_KEY = () => storageKey('debug-spot')

const read = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
const write = (key: string, value: string) => {
  try { localStorage.setItem(key, value) } catch { /* blocked storage: this visit only */ }
}

export function useDebug() {
  const enabled = useState<boolean>('deck-debug', () => false)
  /** Where the bar sits, in pixels from the top left. */
  const spot = useState<DebugSpot>('deck-debug-spot', () => ({ x: 16, y: 16 }))
  const loaded = useState<boolean>('deck-debug-loaded', () => false)

  /** Read what this device remembers. After mount, so the server render matches. */
  const adopt = () => {
    if (loaded.value || import.meta.server) return
    loaded.value = true
    enabled.value = read(KEY()) === '1'
    const stored = read(SPOT_KEY())
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') spot.value = parsed
      } catch { /* a broken value just means the default corner */ }
    }
  }

  const set = (on: boolean) => {
    enabled.value = on
    write(KEY(), on ? '1' : '0')
  }

  const toggle = () => set(!enabled.value)

  const moveTo = (next: DebugSpot) => {
    spot.value = next
    write(SPOT_KEY(), JSON.stringify(next))
  }

  return {
    enabled: computed(() => enabled.value),
    spot: computed(() => spot.value),
    adopt,
    set,
    toggle,
    moveTo,
  }
}
