/**
 * The cat the room is looking at (PRE-0135).
 *
 * A student taps "new cat" on their own device; the server asks The Cat API and
 * broadcasts the picture, so the projector and every phone show the same cat and
 * the same output. The server fetches, not the devices: the room's laptop has
 * the internet, the phones often do not.
 *
 * A short lock keeps twenty taps from turning into twenty requests. If the
 * request fails, the last cat stays on screen and the slide says it is offline.
 * Forgotten with the room.
 */
const CAT_API = 'https://api.thecatapi.com/v1/images/search'

/** Taps inside this window share one cat, so the API sees one request. */
const LOCK_MS = 1200

export interface RoomCat {
  id: string
  url: string
  /** Who asked for it; null for the presenter view or the remote. */
  by: string | null
  at: number
  /** How many cats the room has seen. */
  count: number
}

export interface CatEvent extends RoomCat {
  type: 'cat'
  failed: boolean
}

let current: RoomCat | null = null
let count = 0
let lockedUntil = 0

const event = (failed: boolean, by: string | null): CatEvent => ({
  type: 'cat',
  id: current?.id ?? '',
  url: current?.url ?? '',
  by,
  at: Date.now(),
  count,
  failed,
})

export const catRoom = {
  /** Fetch the next cat for the room. Null while the lock holds. */
  next: async (by: { name: string } | null): Promise<CatEvent | null> => {
    const now = Date.now()
    if (now < lockedUntil) return null
    lockedUntil = now + LOCK_MS

    try {
      const response = await fetch(CAT_API, { signal: AbortSignal.timeout(5000) })
      const [cat] = await response.json() as Array<{ id: string, url: string }>
      if (!cat?.url) throw new Error('empty')
      count++
      current = { id: cat.id, url: cat.url, by: by?.name ?? null, at: Date.now(), count }
      return event(false, by?.name ?? null)
    } catch {
      // The last cat stays; the slide says the request did not get through.
      return event(true, by?.name ?? null)
    }
  },

  /** True while the lock holds, so a request already on its way is not doubled. */
  busy: () => Date.now() < lockedUntil,

  /** The first cat, when the room reaches the slide. Null if one is already up. */
  ensure: async () => (current ? null : catRoom.next(null)),

  state: () => ({ type: 'cat_state' as const, cat: current, count }),

  reset: () => {
    current = null
    count = 0
    lockedUntil = 0
  },
}
