import { wsManager } from '../utils/wsManager'
import type { PeerRole } from '../utils/wsManager'

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
    broadcastPresence(peer)
  },
  message(peer, message) {
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

        wsManager.setPeerIdentity(peer, claimed, data.mode === 'interactive' ? 'interactive' : 'stage')
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
