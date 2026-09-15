/**
 * Notifications: small cards in the top-right corner of every screen.
 *
 *   const { push } = useToasts()
 *   push({ title: 'Mira solved Part 1', body: 'Loops · 2nd', tone: 'mint', name: 'Mira' })
 *
 * One stack per screen (`components/deck/ToastStack.vue`, mounted in `app.vue`),
 * newest on top, at most `TOAST_LIMIT` at once; each holds `TOAST_HOLD` ms and
 * leaves, or goes at a click. `name` draws that person's avatar, `icon` a Lucide
 * icon for room messages. Tones: mint = solved, sun = first place, sky = room
 * news, coral = something went wrong. The style guide slide "Notifications"
 * shows all of them.
 */
import { computed } from 'vue'
import { useState } from '#app'

export type ToastTone = 'mint' | 'sun' | 'sky' | 'coral' | 'lavender'

export interface ToastInput {
  title: string
  body?: string
  tone?: ToastTone
  /** A person's name: the toast shows their avatar. */
  name?: string
  /** A Lucide icon, for toasts about the room rather than a person. Add runtime names to `nuxt.config.ts`. */
  icon?: string
  duration?: number
}

export interface Toast extends ToastInput {
  id: number
  tone: ToastTone
  duration: number
}

export const TOAST_LIMIT = 4
export const TOAST_HOLD = 4000

const timers = new Map<number, ReturnType<typeof setTimeout>>()
let nextId = 1

export function useToasts() {
  const toasts = useState<Toast[]>('deck-toasts', () => [])

  const dismiss = (id: number) => {
    clearTimeout(timers.get(id))
    timers.delete(id)
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }

  const push = (input: ToastInput) => {
    if (import.meta.server) return -1
    const toast: Toast = { ...input, id: nextId++, tone: input.tone ?? 'mint', duration: input.duration ?? TOAST_HOLD }
    toasts.value = [toast, ...toasts.value]
    for (const old of toasts.value.slice(TOAST_LIMIT)) dismiss(old.id)
    timers.set(toast.id, setTimeout(() => dismiss(toast.id), toast.duration))
    return toast.id
  }

  return { toasts: computed(() => toasts.value), push, dismiss }
}
