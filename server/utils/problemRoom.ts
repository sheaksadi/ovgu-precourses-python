import type { Part } from '../problems/types'
import { deckDb } from './db'

/**
 * Who solved which problem, and when.
 *
 * A round's clock starts when the room first reaches the problem's slide (or a
 * device first asks for its input), so times on the leaderboard mean "minutes
 * into the round", not "since the server started".
 *
 * These maps are the fast path, and `deckDb` is the copy that outlives the
 * process: every solve is written there as it happens, and read back here when
 * the server starts, so restarting mid-course does not empty the leaderboard.
 * The cooldown after a wrong answer is the one thing that is not kept — it is
 * five seconds long, and a restart takes longer than that.
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

/** Read the standings back out of the database, once, as the server starts. */
const hydrate = () => {
  for (const round of deckDb.rounds()) openedAt.set(round.problem_id, round.opened_at)
  for (const row of deckDb.solves()) {
    let byDevice = solves.get(row.problem_id)
    if (!byDevice) solves.set(row.problem_id, byDevice = new Map())
    const entry = byDevice.get(row.audience_id) ?? { name: row.name, parts: {} }
    entry.name = row.name
    entry.parts[row.part as Part] = row.at
    byDevice.set(row.audience_id, entry)
  }
}

hydrate()

export const problemRoom = {
  markOpened: (problemId: string) => {
    if (openedAt.has(problemId)) return
    const at = Date.now()
    openedAt.set(problemId, at)
    deckDb.openRound(problemId, at)
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
    const record = { at, rank, first: rank === 1, elapsedMs: at - openedAt.get(problemId)! }
    deckDb.seeDevice(who.audienceId, who.name)
    deckDb.recordSolve({ problemId, audienceId: who.audienceId, part, name: who.name, at, rank, elapsedMs: record.elapsedMs })
    return record
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

  /** Empty the room. `alsoStored` empties the database with it. */
  reset: (alsoStored = false) => {
    solves.clear()
    openedAt.clear()
    cooldowns.clear()
    if (alsoStored) deckDb.clear()
  },
}
