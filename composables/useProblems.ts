/**
 * Advent of Code style problems, as this screen sees them.
 *
 *   const { room, mine, load, submit } = useProblems()
 *
 * `room` is what everyone sees: per problem, when its round started and who
 * solved what (from the server's `problem_state` and `solve` messages, which
 * `useWebSocket` feeds in). `mine` is this device's own input and progress,
 * fetched from `/api/problems/:id/input`. `opened` lists the problems this device
 * has worked on, remembered per device, so the problem dock can bring them
 * back on any slide.
 *
 * The server holds the answers; see `server/problems/`.
 */
import { computed } from 'vue'
import { useState } from '#app'
import { useI18n } from '~/composables/useI18n'
import { useAudience } from '~/composables/useAudience'
import { storageKey } from '~/composables/useDeckRole'
import { isCodeTask } from '~/utils/codeTasks'

export type Part = 1 | 2
export type Verdict = 'correct' | 'high' | 'low' | 'wrong' | 'cooldown' | 'locked' | 'already' | 'empty'

export interface Standing {
  audienceId: string
  name: string
  parts: Partial<Record<Part, number>>
  points: number
  lastAt: number
}

export interface RoomProblem {
  openedAt: number | null
  standings: Standing[]
}

export interface MyProblem {
  input: string
  parts: Part
  solved: Partial<Record<Part, number>>
  /** Local clock time until which a wrong answer keeps the field locked. */
  cooldownUntil: number
  /** Language the input was fetched in; its variable names follow it. */
  locale: string
}

export interface AnswerResult {
  result: Verdict
  rank?: number
  first?: boolean
  cooldownMs?: number
  elapsedMs?: number
}

export interface SolveEvent {
  problemId: string
  part: Part
  audienceId: string
  name: string
  rank: number
  first: boolean
  at: number
  elapsedMs: number
  standings: Standing[]
}

const OPENED_KEY = () => storageKey('problems-opened')

export function useProblems() {
  const { locale } = useI18n()
  const audience = useAudience()
  const room = useState<Record<string, RoomProblem>>('problems-room', () => ({}))
  const mine = useState<Record<string, MyProblem>>('problems-mine', () => ({}))
  const opened = useState<string[]>('problems-opened', () => [])

  const restoreOpened = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(OPENED_KEY()) || '[]')
      if (Array.isArray(stored)) opened.value = [...new Set([...opened.value, ...stored.filter(id => typeof id === 'string')])]
    } catch { /* blocked storage: the dock only knows this visit */ }
  }

  const remember = (id: string) => {
    if (opened.value.includes(id)) return
    opened.value = [...opened.value, id]
    try { localStorage.setItem(OPENED_KEY(), JSON.stringify(opened.value)) } catch { /* see restoreOpened */ }
  }

  const load = async (id: string) => {
    // A code task has no puzzle input: the device only asks what it has solved.
    const data = isCodeTask(id)
      ? { input: '', ...await $fetch<{ parts: Part, solved: MyProblem['solved'], cooldownMs: number }>(`/api/tasks/${id}/state`) }
      : await $fetch<{ input: string, parts: Part, solved: MyProblem['solved'], cooldownMs: number }>(
        `/api/problems/${id}/input`,
        { query: { lang: locale.value } },
      )
    mine.value = {
      ...mine.value,
      [id]: { input: data.input, parts: data.parts, solved: data.solved, cooldownUntil: Date.now() + data.cooldownMs, locale: locale.value },
    }
    remember(id)
    return mine.value[id]!
  }

  const submit = async (id: string, part: Part, answer: string): Promise<AnswerResult> => {
    const result = await $fetch<AnswerResult>(`/api/problems/${id}/answer`, {
      method: 'POST',
      body: { part, answer, name: audience.name.value },
    })
    const current = mine.value[id]
    if (current) {
      const next: MyProblem = { ...current, solved: { ...current.solved } }
      if (result.result === 'correct' || result.result === 'already') next.solved[part] ??= Date.now()
      if (result.cooldownMs) next.cooldownUntil = Date.now() + result.cooldownMs
      mine.value = { ...mine.value, [id]: next }
    }
    return result
  }

  /** A code task passed its tests here; the room records it like a solved puzzle. */
  const submitCode = async (id: string, passed: number, total: number) => {
    const result = await $fetch<AnswerResult>(`/api/tasks/${id}/submit`, {
      method: 'POST',
      body: { passed, total, name: audience.name.value },
    })
    const current = mine.value[id]
    if (current && (result.result === 'correct' || result.result === 'already')) {
      mine.value = { ...mine.value, [id]: { ...current, solved: { ...current.solved, 1: current.solved[1] ?? Date.now() } } }
    }
    return result
  }

  const applyState = (state: { problems?: Record<string, RoomProblem> }) => {
    room.value = state.problems ?? {}
  }

  const applySolve = (event: SolveEvent) => {
    room.value = {
      ...room.value,
      [event.problemId]: { openedAt: room.value[event.problemId]?.openedAt ?? event.at - event.elapsedMs, standings: event.standings },
    }
    // Solved in another tab of this device: this one shows it too.
    const current = mine.value[event.problemId]
    if (event.audienceId === audience.id.value && current && !current.solved[event.part]) {
      mine.value = { ...mine.value, [event.problemId]: { ...current, solved: { ...current.solved, [event.part]: event.at } } }
    }
  }

  /** How many devices solved this part. */
  const solvedCount = (id: string, part: Part) => (room.value[id]?.standings ?? []).filter(entry => entry.parts[part]).length

  /** This device's place for a part, from the room's standings. */
  const rankOf = (id: string, part: Part) => {
    const solvers = (room.value[id]?.standings ?? [])
      .filter(entry => entry.parts[part])
      .sort((a, b) => a.parts[part]! - b.parts[part]!)
    const index = solvers.findIndex(entry => entry.audienceId === audience.id.value)
    return index >= 0 ? index + 1 : null
  }

  return {
    room: computed(() => room.value),
    mine: computed(() => mine.value),
    opened: computed(() => opened.value),
    load,
    submit,
    submitCode,
    applyState,
    applySolve,
    restoreOpened,
    solvedCount,
    rankOf,
  }
}
