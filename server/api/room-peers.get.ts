import { defineEventHandler, getRequestHeaders, getRequestIP, createError } from 'h3'
import { wsManager } from '../utils/wsManager'

const isLoopbackAddress = (address: string | undefined) => {
  const clean = address?.replace(/^::ffff:/, '')
  return clean === '127.0.0.1' || clean === '::1' || clean === 'localhost'
}

/**
 * What the server currently believes about the room.
 *
 * Loopback only, so it is a debugging and testing aid for
 * the machine running the deck rather than something the audience can read. It
 * reports counts and roles, never who anyone is or what they answered.
 */
export default defineEventHandler((event) => {
  const ip = getRequestIP(event, { xForwardedFor: false })
  const host = getRequestHeaders(event).host || ''
  const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1')

  if (!isLoopbackAddress(ip) && !isLocalhost) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Room diagnostics are only available on the machine running the presentation.'
    })
  }

  return {
    state: wsManager.getState(),
    clients: wsManager.getPeersCount(),
    roles: wsManager.getRoleCounts(),
    summary: wsManager.getPresenceSummary()
  }
})
