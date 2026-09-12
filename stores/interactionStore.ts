import { defineStore } from 'pinia'

export interface InteractionProgress {
  /** The viewer has touched the interaction on this slide. */
  started: boolean
  /** 1 based current step. */
  step: number
  total: number
  completed: boolean
  /** The viewer left the interaction unfinished to follow the presenter. */
  skipped: boolean
  /** Whatever the component wants to remember, such as a chosen answer. */
  value?: unknown
}

const STORAGE_KEY = 'deck_interaction_progress'

function emptyProgress(total = 1): InteractionProgress {
  return { started: false, step: 1, total, completed: false, skipped: false }
}

/**
 * Interaction progress for this device only.
 *
 * Nothing here is sent to the server or to other viewers; the presenter view
 * receives counts of how many devices are mid-interaction, never answers.
 */
export const useInteractionStore = defineStore('interaction', {
  state: () => ({
    progress: {} as Record<string, InteractionProgress>,
    /** Slide the viewer is being asked to leave, while the guard modal is open. */
    guard: null as { fromSlideId: string, toSlideId: string, fromFollow: boolean } | null
  }),
  getters: {
    /** An interaction that was started and is neither completed nor skipped. */
    pendingOn: (state) => (slideId: string) => {
      const entry = state.progress[slideId]
      return !!entry && entry.started && !entry.completed && !entry.skipped
    },
    /** True when the interaction on this slide is done or deliberately skipped. */
    isComplete: (state) => (slideId: string) => {
      const entry = state.progress[slideId]
      return !!entry && (entry.completed || entry.skipped)
    },
    pendingCount: (state) =>
      Object.values(state.progress).filter(p => p.started && !p.completed && !p.skipped).length
  },
  actions: {
    ensure(slideId: string, total = 1): InteractionProgress {
      const existing = this.progress[slideId]
      if (existing) {
        if (total > existing.total) existing.total = total
        return existing
      }
      this.progress[slideId] = emptyProgress(total)
      return this.progress[slideId]
    },
    markStarted(slideId: string, total = 1) {
      const entry = this.ensure(slideId, total)
      entry.started = true
      entry.skipped = false
      this.persist()
    },
    setStep(slideId: string, step: number) {
      const entry = this.ensure(slideId)
      entry.started = true
      // Touching the interaction again takes it back off the skipped list, so
      // the guard protects it on the next move.
      entry.skipped = false
      entry.step = Math.min(Math.max(1, step), entry.total)
      if (entry.step >= entry.total) entry.completed = true
      this.persist()
    },
    /** Remember an answer or any other per-slide value for this device. */
    setValue(slideId: string, value: unknown) {
      const entry = this.ensure(slideId)
      entry.value = value
      this.persist()
    },
    complete(slideId: string) {
      const entry = this.ensure(slideId)
      entry.started = true
      entry.completed = true
      entry.step = entry.total
      this.persist()
    },
    skip(slideId: string) {
      const entry = this.ensure(slideId)
      entry.skipped = true
      this.persist()
    },
    reset(slideId: string) {
      const total = this.progress[slideId]?.total ?? 1
      this.progress[slideId] = emptyProgress(total)
      this.persist()
    },
    openGuard(fromSlideId: string, toSlideId: string, fromFollow: boolean) {
      this.guard = { fromSlideId, toSlideId, fromFollow }
    },
    closeGuard() {
      this.guard = null
    },
    load() {
      if (!import.meta.client) return
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) this.progress = JSON.parse(raw)
      } catch {
        // Blocked or corrupt storage just means the deck starts fresh.
      }
    },
    persist() {
      if (!import.meta.client) return
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress))
      } catch {
        // Progress stays in memory for this session.
      }
    }
  }
})
