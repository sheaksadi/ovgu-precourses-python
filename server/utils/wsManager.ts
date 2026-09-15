import { spinRoom } from './spinRoom'
import { problemRoom } from './problemRoom'

export type PeerRole = 'control' | 'presenter' | 'viewer' | 'dashboard' | 'peek'

export interface PeerPresence {
  role: PeerRole
  mode: 'stage' | 'interactive'
  slideId: string
  detached: boolean
  interacting: boolean
  /** Viewers only: the device id and display name from `useAudience`. */
  audienceId: string
  name: string
}

export interface AudienceMember {
  audienceId: string
  name: string
  slideId: string
  detached: boolean
}

export interface PresenceSummary {
  viewers: number
  detached: number
  interacting: number
  bySlide: Record<string, number>
}

interface PeerEntry {
  /** The most recent peer object for this connection, used to publish. */
  peer: any
  presence: PeerPresence
  lastSeen: number
}

function emptyState() {
  return {
    /** Permanent slide id, e.g. `PRE-0001`. Empty until a controller navigates. */
    slideId: '',
    isPresenting: false
  }
}

let currentState = emptyState()

/** Everything the room remembers goes when it resets. */
function resetRoom() {
  currentState = emptyState()
  spinRoom.reset()
  problemRoom.reset()
}

/** Roles that may move the global slide position. */
const CONTROLLER_ROLES: PeerRole[] = ['control', 'presenter']

/** Roles that count as a screen in the room. A peek frame is not one. */
const AUDIENCE_ROLES: PeerRole[] = ['viewer']

/**
 * Live clients, keyed by `peer.id`.
 *
 * The id is the only stable handle on a connection: the peer object handed to
 * each event is a fresh wrapper, so keying by the object used to create one
 * ghost entry per message and made the counts, the audience numbers and the
 * close handler all disagree.
 *
 * Liveness comes from the heartbeat as well, since the close event is not
 * guaranteed to arrive.
 */
const peers = new Map<string, PeerEntry>()

const keyOf = (peer: any): string => String(peer?.id ?? peer)

function defaultPresence(): PeerPresence {
  return { role: 'viewer', mode: 'stage', slideId: '', detached: false, interacting: false, audienceId: '', name: '' }
}

/** Untrusted text from a client, trimmed to one short line. */
const cleanText = (value: unknown, max: number) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : ''

function entryFor(peer: any): PeerEntry {
  const key = keyOf(peer)
  let entry = peers.get(key)
  if (!entry) {
    entry = { peer, presence: defaultPresence(), lastSeen: Date.now() }
    peers.set(key, entry)
  } else {
    entry.peer = peer
  }
  return entry
}

export const wsManager = {
  /** Record that this peer is alive, on connect and on every message. */
  touch: (peer: any) => {
    entryFor(peer).lastSeen = Date.now()
  },

  getPeersCount: () => peers.size,

  /** Any live peer, for publishing to the room after a prune. */
  anyPeer: () => peers.values().next().value?.peer,

  getState: () => currentState,

  /** Send one server event to every live connection. */
  broadcast: (payload: unknown) => {
    const message = JSON.stringify(payload)
    for (const { peer } of peers.values()) peer.send(message)
  },

  setState: (state: { slideId?: string, isPresenting?: boolean }) => {
    currentState = { ...currentState, ...state }
  },

  /**
   * Forget where the room was. Called once the last client disconnects, so the
   * next session starts at the first slide instead of inheriting the old one.
   */
  resetState: () => {
    resetRoom()
  },

  /** Record what a peer says it is. The role decides whether it may write. */
  setPeerIdentity: (peer: any, role: PeerRole, mode: 'stage' | 'interactive', who?: { audienceId?: unknown, name?: unknown }) => {
    const entry = entryFor(peer)
    entry.presence.role = role
    entry.presence.mode = mode
    entry.presence.audienceId = role === 'viewer' ? cleanText(who?.audienceId, 40) : ''
    entry.presence.name = role === 'viewer' ? cleanText(who?.name, 24) : ''
    entry.lastSeen = Date.now()
  },

  setPeerPresence: (peer: any, update: { slideId?: string, detached?: boolean, interacting?: boolean }) => {
    const entry = entryFor(peer)
    if (update.slideId !== undefined) entry.presence.slideId = update.slideId
    if (update.detached !== undefined) entry.presence.detached = update.detached
    if (update.interacting !== undefined) entry.presence.interacting = update.interacting
    entry.lastSeen = Date.now()
  },

  removePeer: (peer: any) => {
    const existed = peers.delete(keyOf(peer))
    if (existed && peers.size === 0) resetRoom()
    return existed
  },

  /**
   * Drop clients that stopped sending heartbeats, and reset the room when the
   * last one goes. Returns the peers that were dropped, so the caller can close
   * their sockets and tell the room.
   */
  prune: (ttlMs: number) => {
    const now = Date.now()
    const dropped: any[] = []
    for (const [key, entry] of peers.entries()) {
      if (now - entry.lastSeen > ttlMs) {
        peers.delete(key)
        dropped.push(entry.peer)
      }
    }
    if (dropped.length && peers.size === 0) resetRoom()
    return dropped
  },

  /** The audience identity of a follow-along device, or null for any other peer. */
  getIdentity: (peer: any): { audienceId: string, name: string } | null => {
    const entry = peers.get(keyOf(peer))
    if (!entry || !AUDIENCE_ROLES.includes(entry.presence.role) || !entry.presence.audienceId) return null
    return { audienceId: entry.presence.audienceId, name: entry.presence.name }
  },

  /** True when this peer is allowed to move the global slide position. */
  canControl: (peer: any) => {
    const entry = peers.get(keyOf(peer))
    return !!entry && CONTROLLER_ROLES.includes(entry.presence.role)
  },

  /** How many live clients hold each role. */
  getRoleCounts: (): Record<PeerRole, number> => {
    const counts = { control: 0, presenter: 0, viewer: 0, dashboard: 0, peek: 0 }
    for (const { presence } of peers.values()) counts[presence.role]++
    return counts
  },

  /** Named audience devices showing a slide, one entry per device even with several tabs open. */
  getAudience: (): AudienceMember[] => {
    const members = new Map<string, AudienceMember>()
    for (const { presence } of peers.values()) {
      if (!AUDIENCE_ROLES.includes(presence.role) || !presence.audienceId || !presence.slideId) continue
      members.set(presence.audienceId, {
        audienceId: presence.audienceId,
        name: presence.name,
        slideId: presence.slideId,
        detached: presence.detached,
      })
    }
    return [...members.values()]
  },

  getPresenceSummary: (): PresenceSummary => {
    const summary: PresenceSummary = { viewers: 0, detached: 0, interacting: 0, bySlide: {} }
    for (const { presence } of peers.values()) {
      // Only a client that reports a slide is a screen in the room; the landing
      // page and the handout are viewers with nothing on screen.
      if (!AUDIENCE_ROLES.includes(presence.role) || !presence.slideId) continue
      summary.viewers++
      if (presence.detached) summary.detached++
      if (presence.interacting) summary.interacting++
      if (presence.slideId) {
        summary.bySlide[presence.slideId] = (summary.bySlide[presence.slideId] || 0) + 1
      }
    }
    return summary
  }
}
