/**
 * The cat the room is looking at, as this screen knows it.
 *
 *   const { current, count, waiting, failed } = useCats()
 *
 * Filled by `useWebSocket` from the server's `cat` and `cat_state` messages
 * (`server/utils/catRoom.ts`). Every screen shows the same picture, because the
 * server fetched it once and told the room.
 */
import { computed } from 'vue'
import { useState } from '#app'

export interface RoomCat {
  id: string
  url: string
  by: string | null
  at: number
  count: number
}

export function useCats() {
  const current = useState<RoomCat | null>('room-cat', () => null)
  const count = useState<number>('room-cat-count', () => 0)
  const failed = useState<boolean>('room-cat-failed', () => false)
  /** This device asked and is waiting for the room's answer. */
  const waiting = useState<boolean>('room-cat-waiting', () => false)
  /**
   * A request is on its way, for the whole room — the server says so as it
   * starts, so every screen can hold on the `requests.get` line while it runs.
   */
  const pending = useState<boolean>('room-cat-pending', () => false)
  /** Counts up on every answer, so a scene can replay even for the same cat. */
  const answers = useState<number>('room-cat-answers', () => 0)

  const apply = (payload: RoomCat & { failed?: boolean }) => {
    waiting.value = false
    pending.value = false
    answers.value++
    failed.value = !!payload.failed
    count.value = payload.count
    if (!payload.failed && payload.url) {
      current.value = { id: payload.id, url: payload.url, by: payload.by, at: payload.at, count: payload.count }
    }
  }

  const applyState = (state: { cat?: RoomCat | null, count?: number }) => {
    current.value = state.cat ?? null
    count.value = state.count ?? 0
    failed.value = false
    waiting.value = false
    pending.value = false
  }

  const markWaiting = () => { waiting.value = true }
  const clearWaiting = () => { waiting.value = false; pending.value = false }
  const markPending = () => { pending.value = true }

  return {
    current: computed(() => current.value),
    count: computed(() => count.value),
    failed: computed(() => failed.value),
    waiting: computed(() => waiting.value),
    pending: computed(() => pending.value),
    answers: computed(() => answers.value),
    apply,
    markPending,
    applyState,
    markWaiting,
    clearWaiting,
  }
}
