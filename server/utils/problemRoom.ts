import type { Part } from '../problems/types'

/**
 * Who solved which problem, and when. Forgotten with the room.
 *
 * A round's clock starts when the room first reaches the problem's slide (or a
 * device first asks for its input), so times on the leaderboard mean "minutes
 * into the round", not "since the server started".
 */
export interface Standing {
  audienceId: string
  name: string
  /** Solve time per part, ms since epoch. */
  parts: Partial<Record<Part, number>>
  points: number
  lastAt: number
}

export interface SolveRecord {
  at: number
  /** 1 for the first device to solve this part. */
  rank: number
  first: boolean
  elapsedMs: number
}

/** A wrong answer locks the field this long, so guessing does not pay. */
export const WRONG_COOLDOWN_MS = 5000

interface Entry {
  name: string
  parts: Partial<Record<Part, number>>
}

const solves = new Map<string, Map<string, Entry>>()
const openedAt = new Map<string, number>()
const cooldowns = new Map<string, number>()

const key = (problemId: string, audienceId: string) => `${problemId}:${audienceId}`

export const problemRoom = {
  markOpened: (problemId: string) => {
    if (!openedAt.has(problemId)) openedAt.set(problemId, Date.now())
  },

  solvedParts: (problemId: string, audienceId: string) => ({ ...solves.get(problemId)?.get(audienceId)?.parts }),

  cooldownLeft: (problemId: string, audienceId: string) =>
    Math.max(0, (cooldowns.get(key(problemId, audienceId)) ?? 0) - Date.now()),

  startCooldown: (problemId: string, audienceId: string) => {
    cooldowns.set(key(problemId, audienceId), Date.now() + WRONG_COOLDOWN_MS)
  },

  /** Record a correct answer. Null when this device had already solved the part. */
  record: (problemId: string, who: { audienceId: string, name: string }, part: Part): SolveRecord | null => {
    let byDevice = solves.get(problemId)
    if (!byDevice) solves.set(problemId, byDevice = new Map())
    const entry = byDevice.get(who.audienceId) ?? { name: who.name, parts: {} }
    if (entry.parts[part]) return null

    const at = Date.now()
    entry.name = who.name
    entry.parts[part] = at
    byDevice.set(who.audienceId, entry)

    const rank = [...byDevice.values()].filter(other => other.parts[part] !== undefined).length
    problemRoom.markOpened(problemId)
    return { at, rank, first: rank === 1, elapsedMs: at - openedAt.get(problemId)! }
  },

  /** Most parts first, then whoever got there first. */
  standings: (problemId: string): Standing[] =>
    [...(solves.get(problemId) ?? new Map<string, Entry>()).entries()]
      .map(([audienceId, entry]) => {
        const times = Object.values(entry.parts) as number[]
        return { audienceId, name: entry.name, parts: { ...entry.parts }, points: times.length, lastAt: Math.max(...times) }
      })
      .sort((a, b) => b.points - a.points || a.lastAt - b.lastAt),

  state: () => {
    const ids = new Set([...openedAt.keys(), ...solves.keys()])
    return {
      type: 'problem_state' as const,
      problems: Object.fromEntries([...ids].map(id => [id, { openedAt: openedAt.get(id) ?? null, standings: problemRoom.standings(id) }])),
    }
  },

  reset: () => {
    solves.clear()
    openedAt.clear()
    cooldowns.clear()
  },
}
