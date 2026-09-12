import { defineEventHandler, getRequestIP, createError } from 'h3'
import { getRoomKey, isControlOpen, isLoopbackAddress } from '../utils/roomKey'

/**
 * Hands the room key to the machine running the deck.
 *
 * Only loopback callers get it, so the dashboard and the presenter view can
 * build the remote's QR code while another device on the network cannot ask for
 * the key directly.
 */
export default defineEventHandler((event) => {
  const ip = getRequestIP(event, { xForwardedFor: false })

  if (!isLoopbackAddress(ip)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'The room key is only available on the machine running the presentation.'
    })
  }

  return { key: getRoomKey(), open: isControlOpen() }
})
