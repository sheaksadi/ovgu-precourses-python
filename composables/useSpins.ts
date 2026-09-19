/**
 * The room's icebreaker spins, as this screen has heard them.
 *
 *   const { latest, history, nameOf, isBusy } = useSpins()
 *
 * Filled by `useWebSocket` from the server's `spin` and `spin_state` messages
 * (`server/utils/spinRoom.ts`). The spinner plays each new spin; the presenter
 * view and the remote show the latest one as a line of text.
 */
import { computed } from 'vue'
import { useState } from '#app'
import { useI18n } from '~/composables/useI18n'
import { formatCuteName, parseCuteName } from '~/utils/cuteNames'

export interface SpinRecord {
  sequence: number
  question: number
  by: { audienceId: string, name: string } | null
  at: number
}

/** Matches `SPIN_MS` on the server: how long the reel rolls before it lands. */
export const SPIN_MS = 4600
const HISTORY = 12

const toRecord = (event: SpinRecord): SpinRecord => ({
  sequence: event.sequence,
  question: event.question,
  by: event.by ? { audienceId: String(event.by.audienceId), name: String(event.by.name) } : null,
  at: event.at,
})

export function useSpins() {
  const { t, tm, locale } = useI18n()
  const history = useState<SpinRecord[]>('deck-spins', () => [])
  /** Local clock time when the current spin has landed everywhere. */
  const busyUntil = useState<number>('deck-spin-busy', () => 0)

  /** A new spin from the room. False when this screen already has it. */
  const apply = (event: SpinRecord) => {
    if (history.value.some(record => record.sequence === event.sequence && record.at === event.at)) return false
    history.value = [toRecord(event), ...history.value].slice(0, HISTORY)
    busyUntil.value = Date.now() + SPIN_MS
    return true
  }

  const applyState = (state: { history?: SpinRecord[], spinningFor?: number }) => {
    history.value = (state.history ?? []).map(toRecord)
    busyUntil.value = Date.now() + (state.spinningFor ?? 0)
  }

  const isBusy = () => Date.now() < busyUntil.value

  /** Who spun, in this screen's language: a generated name is translated, a typed one kept. */
  const nameOf = (record: SpinRecord) => {
    if (!record.by) return t('intro.presenter')
    const parts = parseCuteName(record.by.name)
    return parts ? formatCuteName(parts, locale.value) : record.by.name
  }

  const questionOf = (record: SpinRecord) => tm<string[]>('intro.questions')[record.question] ?? ''

  const latest = computed(() => history.value[0] ?? null)

  /** "Mira · Cats or dogs?", or that the room is waiting. */
  const latestLine = computed(() => (latest.value ? `${nameOf(latest.value)} · ${questionOf(latest.value)}` : t('intro.waiting')))

  return {
    history: computed(() => history.value),
    latest,
    latestLine,
    apply,
    applyState,
    isBusy,
    nameOf,
    questionOf,
  }
}
