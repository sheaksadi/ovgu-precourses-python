import { defineStore } from 'pinia'

export interface PresenceSummary {
  /** Screens that render a slide, projector included. */
  viewers: number
  /** Viewers whose local slide differs from the global one. */
  detached: number
  /** Viewers with an unfinished interaction. */
  interacting: number
  /** Viewer count per slide id. */
  bySlide: Record<string, number>
  /** Named follow-along devices, for the presenter view. */
  members: Array<{ audienceId: string, name: string, slideId: string, detached: boolean }>
}

export const usePresentationStore = defineStore('presentation', {
  state: () => ({
    /** Slide the room is on. Written only from a server `state` message. */
    globalSlideId: '' as string,
    /** Slide this device renders. A viewer may move it without moving the room. */
    localSlideId: '' as string,
    /** A viewer follows the room until it navigates on its own. */
    following: true,
    /** Increments for every server state event, including explicit sync replies. */
    stateRevision: 0,
    isPresenting: false,
    showTeleprompter: false,
    connectedClients: 0,
    /** The presenter ended the session. Viewers say so instead of vanishing. */
    sessionEnded: false,
    /**
     * Opt-in: catch up with the room by itself once this device is no longer
     * busy with an interaction. Off by default, so drifting is deliberate.
     */
    autoFollow: false,
    presence: { viewers: 0, detached: 0, interacting: 0, bySlide: {}, members: [] } as PresenceSummary,
    pointers: {} as Record<string, { active: boolean, x: number, y: number, color: string }>
  }),
  getters: {
    /** Explicit local mode. It stays detached even if both slides happen to match. */
    detached: (state) => !state.following
  },
  actions: {
    /** The room moved. Following is decided by the caller, not here. */
    setGlobal(slideId: string) {
      this.globalSlideId = slideId
      this.stateRevision++
    },
    /** This device moved. */
    setLocal(slideId: string) {
      this.localSlideId = slideId
    },
    setFollowing(following: boolean) {
      this.following = following
    },
    setAutoFollow(autoFollow: boolean) {
      this.autoFollow = autoFollow
    },
    setSessionEnded(ended: boolean) {
      this.sessionEnded = ended
    },
    setPresence(summary: Partial<PresenceSummary>) {
      this.presence = { ...this.presence, ...summary }
    },
    setPointer(clientId: string, active: boolean, x: number, y: number, color: string) {
      if (!this.pointers[clientId]) {
        this.pointers[clientId] = { active, x, y, color }
      } else {
        this.pointers[clientId].active = active
        this.pointers[clientId].x = x
        this.pointers[clientId].y = y
        this.pointers[clientId].color = color
      }
    },
    togglePresenting() {
      this.isPresenting = !this.isPresenting
    },
    toggleTeleprompter() {
      this.showTeleprompter = !this.showTeleprompter
    },
    setConnectedClients(count: number) {
      this.connectedClients = count
    }
  }
})
