import { randomBytes } from 'node:crypto'

/**
 * Per-boot key that authorises the two controller surfaces.
 *
 * The key is minted when the server starts and is served only to loopback
 * requests, which is the machine running the deck: the dashboard and the
 * presenter view. A phone never fetches it; it receives the key inside the QR
 * code the dashboard renders. Restarting the server invalidates old links.
 *
 * Set `DECK_OPEN_CONTROL=1` to run without the key, for example on a laptop
 * with no other device on the network.
 */
const roomKey = randomBytes(6).toString('base64url')

export const isControlOpen = () => process.env.DECK_OPEN_CONTROL === '1'

export const getRoomKey = () => roomKey

/** True when this key may drive the room. */
export const isValidRoomKey = (key: unknown) => isControlOpen() || key === roomKey

/** Loopback callers are the presenter's own machine. */
export const isLoopbackAddress = (address: string | undefined) => {
  if (!address) return false
  const clean = address.replace(/^::ffff:/, '')
  return clean === '127.0.0.1' || clean === '::1' || clean === 'localhost'
}
