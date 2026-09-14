let lastClient = ''
let busyUntil = 0

/** First controller event wins; overlapping taps from another controller are dropped. */
export const acceptControllerEvent = (clientId: string) => {
  const now = Date.now()
  if (now < busyUntil && clientId !== lastClient) return false
  lastClient = clientId
  busyUntil = now + 100
  return true
}
