import de from '../../locales/de'

/**
 * The icebreaker spinner, played by the room (PRE-0038).
 *
 * A follow-along device, the presenter view or the remote asks for a spin; the
 * server draws the question from one shuffle bag for the whole room, so no
 * question comes up twice until every one has been asked, and broadcasts it.
 * Every screen then plays the same spin. While one spin plays, the next request
 * is refused, so two people tapping at once cannot talk over each other.
 *
 * Forgotten with the room, when the last client leaves.
 */
export interface SpinBy {
  audienceId: string
  name: string
}

export interface SpinEvent {
  type: 'spin'
  sequence: number
  question: number
  /** Who spun; null for the presenter view or the remote. */
  by: SpinBy | null
  at: number
}

/** The reel runs about 4.2 s; a little more, so it has landed before the next one. */
export const SPIN_MS = 4600
const HISTORY = 12

const questionCount = () => de.intro.questions.length

let bag: number[] = []
let last = -1
let sequence = 0
let lockedUntil = 0
let history: SpinEvent[] = []

const shuffle = (count: number) => {
  const out = Array.from({ length: count }, (_, i) => i)
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

export const spinRoom = {
  /** Draw the next question, or null while a spin is still playing. */
  spin: (by: SpinBy | null): SpinEvent | null => {
    const now = Date.now()
    if (now < lockedUntil) return null
    lockedUntil = now + SPIN_MS

    if (!bag.length) {
      bag = shuffle(questionCount())
      // A fresh bag never opens with the question that just closed the last one.
      const end = bag.length - 1
      if (end > 0 && bag[end] === last) [bag[0], bag[end]] = [bag[end]!, bag[0]!]
    }
    last = bag.pop()!

    const event: SpinEvent = { type: 'spin', sequence: ++sequence, question: last, by, at: now }
    history = [event, ...history].slice(0, HISTORY)
    return event
  },

  /** For a screen that connects late: what was spun, and how long the current spin still plays. */
  state: () => ({ type: 'spin_state' as const, history, spinningFor: Math.max(0, lockedUntil - Date.now()) }),

  reset: () => {
    bag = []
    last = -1
    lockedUntil = 0
    history = []
  },
}
