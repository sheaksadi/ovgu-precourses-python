import { defineEventHandler, getRequestIP, createError } from 'h3'
import { wsManager } from '../utils/wsManager'
import { isLoopbackAddress } from '../utils/roomKey'

/**
 * What the server currently believes about the room.
 *
 * Loopback only, like the room key, so it is a debugging and testing aid for
 * the machine running the deck rather than something the audience can read. It
 * reports counts and roles, never who anyone is or what they answered.
 */
export default defineEventHandler((event) => {
  const ip = getRequestIP(event, { xForwardedFor: false })

  if (!isLoopbackAddress(ip)) {
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
