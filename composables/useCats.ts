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

  const apply = (payload: RoomCat & { failed?: boolean }) => {
    waiting.value = false
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
  }

  const markWaiting = () => { waiting.value = true }
  const clearWaiting = () => { waiting.value = false }

  return {
    current: computed(() => current.value),
    count: computed(() => count.value),
    failed: computed(() => failed.value),
    waiting: computed(() => waiting.value),
    apply,
    applyState,
    markWaiting,
    clearWaiting,
  }
}
