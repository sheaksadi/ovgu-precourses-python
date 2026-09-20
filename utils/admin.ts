/**
 * The word that opens the presenter's half of the deck.
 *
 * It is here in the source on purpose. Nothing behind it is a secret worth
 * protecting — the presenter view, the control panel and the remote all show
 * the same slides the room is already looking at. What it stops is a student
 * wandering into the remote and moving the talk for forty other people.
 *
 * Treat it as a door handle, not a lock: never put anything behind it that
 * would actually hurt if a student typed it in.
 */
export const ADMIN_PASSWORD = '1337'

/** Query parameter that unlocks a page straight away, for the test scripts. */
export const ADMIN_QUERY = 'admin'

/** Where the unlocked flag is kept on a device. */
export const ADMIN_STORAGE_KEY = 'deck-admin'

export const isAdminPassword = (value: unknown) => String(value ?? '').trim() === ADMIN_PASSWORD
