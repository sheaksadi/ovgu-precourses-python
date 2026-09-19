import { wsManager } from '../utils/wsManager'
import type { PeerRole } from '../utils/wsManager'
import { spinRoom } from '../utils/spinRoom'
import { problemRoom } from '../utils/problemRoom'
import { catRoom } from '../utils/catRoom'

/** Taps inside this window share one replay, so a scene cannot be restarted mid-run. */
const DEMO_LOCK_MS = 1200
let demoLockedUntil = 0

/** Pointer ids per connection, keyed by `peer.id` for the same reason. */
const peerClientIds = new Map<string, Set<string>>()

const keyOf = (peer: any): string => String(peer?.id ?? peer)

const KNOWN_ROLES: PeerRole[] = ['control', 'presenter', 'viewer', 'dashboard', 'peek']

/** A client that misses this many milliseconds of heartbeats has gone. */
const PEER_TTL = 15000

/**
 * Drop clients that stopped sending heartbeats.
 *
 * The socket's close event cannot be relied on here, so the heartbeat is what
 * decides who is still in the room. Without this, ghost clients stayed in the
 * connected count and in the audience numbers for the rest of the session.
 */
setInterval(() => {
  const dropped = wsManager.prune(PEER_TTL)
  if (!dropped.length) return

  for (const peer of dropped) {
    peerClientIds.delete(keyOf(peer))
    try { peer.close() } catch { /* already gone */ }
  }

  const survivor = wsManager.anyPeer()
  if (!survivor) return
  survivor.publish('presentation', JSON.stringify({ type: 'clients_count', count: wsManager.getPeersCount() }))
  survivor.send(JSON.stringify({ type: 'clients_count', count: wsManager.getPeersCount() }))
  survivor.publish('presentation', JSON.stringify({ type: 'presence_summary', ...wsManager.getPresenceSummary() }))
  survivor.send(JSON.stringify({ type: 'presence_summary', ...wsManager.getPresenceSummary() }))
}, 5000)

function broadcastPresence(peer: any) {
  const msg = JSON.stringify({ type: 'presence_summary', ...wsManager.getPresenceSummary() })
  peer.publish('presentation', msg)
  peer.send(msg)
}

export default defineWebSocketHandler({
  open(peer) {
    wsManager.touch(peer)
    peer.subscribe('presentation')

    const countMsg = JSON.stringify({ type: 'clients_count', count: wsManager.getPeersCount() })
    peer.publish('presentation', countMsg)
    peer.send(countMsg)

    peer.send(JSON.stringify({ type: 'state', ...wsManager.getState() }))
    peer.send(JSON.stringify(spinRoom.state()))
    peer.send(JSON.stringify(problemRoom.state()))
    peer.send(JSON.stringify(catRoom.state()))
    broadcastPresence(peer)
  },
  async message(peer, message) {
    wsManager.touch(peer) // Refresh liveness on ANY message
    try {
      const text = message.text()
      if (text === 'ping') {
        peer.send('pong')
        return
      }

      const data = JSON.parse(text)

      if (data.type === 'hello') {
        const claimed: PeerRole = KNOWN_ROLES.includes(data.role) ? data.role : 'viewer'

        wsManager.setPeerIdentity(peer, claimed, data.mode === 'interactive' ? 'interactive' : 'stage', {
          audienceId: data.audienceId,
          name: data.name
        })
        peer.send(JSON.stringify({
          type: 'role',
          role: claimed,
          claimed,
          authorised: true
        }))
        broadcastPresence(peer)
      }
      else if (data.type === 'navigate') {
        // Room writes use POST /api/navigate. WebSocket is broadcast-only.
        peer.send(JSON.stringify({ type: 'state', ...wsManager.getState() }))
      }
      else if (data.type === 'presence') {
        wsManager.setPeerPresence(peer, {
          slideId: data.slideId,
          detached: !!data.detached,
          interacting: !!data.interacting
        })
        broadcastPresence(peer)
      }
      else if (data.type === 'sync_request') {
        peer.send(JSON.stringify({ type: 'state', ...wsManager.getState() }))
        peer.send(JSON.stringify({ type: 'presence_summary', ...wsManager.getPresenceSummary() }))
        peer.send(JSON.stringify(spinRoom.state()))
        peer.send(JSON.stringify(problemRoom.state()))
        peer.send(JSON.stringify(catRoom.state()))
      }
      else if (data.type === 'spin') {
        // A follow-along device asks for the icebreaker spin. Only named audience
        // devices may; the presenter view and the remote use POST /api/command.
        const who = wsManager.getIdentity(peer)
        if (!who) return
        const spin = spinRoom.spin(who)
        if (spin) wsManager.broadcast(spin)
        else peer.send(JSON.stringify({ type: 'spin_busy' }))
      }
      else if (data.type === 'cat') {
        // A follow-along device asks the room for a new cat; the server fetches it.
        const who = wsManager.getIdentity(peer)
        if (!who) return
        // Tell the room the request is on its way, so every screen can hold on
        // the `requests.get` line for exactly as long as the request takes.
        if (!catRoom.busy()) wsManager.broadcast({ type: 'cat_pending', by: who.name, at: Date.now() })
        const cat = await catRoom.next(who)
        if (cat) wsManager.broadcast(cat)
        else peer.send(JSON.stringify({ type: 'cat_busy' }))
      }
      else if (data.type === 'demo') {
        // Somebody asked a demo to play again. It plays again everywhere: the
        // projector is the screen the room is watching, and a replay that only
        // runs on the phone that tapped it is no use to anyone.
        //
        // Thirty phones tapping at once is one replay, not thirty: requests
        // inside the lock are dropped here, the same way the spin works.
        const now = Date.now()
        if (now < demoLockedUntil) return
        const forMs = Math.min(Math.max(Number(data.forMs) || 0, 0), 60_000)
        demoLockedUntil = now + DEMO_LOCK_MS
        wsManager.broadcast({ type: 'demo', at: now, forMs })
      }
      else if (data.type === 'command') {
        // Room commands use POST /api/command. WebSocket is broadcast-only.
        return
      }
      else if (data.type === 'pointer') {
        if (!peerClientIds.has(keyOf(peer))) peerClientIds.set(keyOf(peer), new Set())
        peerClientIds.get(keyOf(peer))!.add(data.clientId)
        peer.publish('presentation', text)
      }
    } catch (e) {
      console.error('WS parse error', e)
    }
  },
  close(peer) {
    // This event is not guaranteed to arrive; the prune loop above is the
    // authority. When it does arrive, react immediately.
    const ids = peerClientIds.get(keyOf(peer))
    if (ids) {
      for (const id of ids) {
        peer.publish('presentation', JSON.stringify({ type: 'pointer', clientId: id, active: false, x: 0, y: 0, color: '' }))
      }
      peerClientIds.delete(keyOf(peer))
    }

    // Removing the last peer also resets the room, so the next session starts
    // at the first slide instead of resuming wherever this one stopped.
    wsManager.removePeer(peer)

    peer.publish('presentation', JSON.stringify({ type: 'clients_count', count: wsManager.getPeersCount() }))
    peer.publish('presentation', JSON.stringify({ type: 'presence_summary', ...wsManager.getPresenceSummary() }))
  },
  error(peer, error) {
    if (error?.message?.includes('ECONNRESET') || error?.message?.includes('socket hang up')) return
    console.error('WS error:', error)
  }
})
