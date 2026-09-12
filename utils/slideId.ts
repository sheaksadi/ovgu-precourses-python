/**
 * Stable slide identifiers.
 *
 * A slide id looks like `PRE-0001`: a three letter deck prefix, a hyphen, then a
 * zero padded counter. The counter is allocated once per slide and never reused,
 * so deleting a slide leaves a permanent gap. Numbers past 9999 simply grow to
 * five or more digits (`PRE-10000`), which keeps sorting and parsing intact.
 */

export const SLIDE_ID_PATTERN = /^([A-Z]{3})-(\d{4,})$/
export const SLIDE_ID_PAD = 4

/** Build an id from a prefix and a counter value. */
export function formatSlideId(prefix: string, n: number): string {
  if (!/^[A-Z]{3}$/.test(prefix)) {
    throw new Error(`Slide id prefix must be exactly three uppercase letters, got "${prefix}"`)
  }
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`Slide id number must be a positive integer, got "${n}"`)
  }
  return `${prefix}-${String(n).padStart(SLIDE_ID_PAD, '0')}`
}

/** Split an id back into its prefix and counter value, or null when malformed. */
export function parseSlideId(id: string): { prefix: string, number: number } | null {
  const match = SLIDE_ID_PATTERN.exec(id)
  if (!match) return null
  return { prefix: match[1], number: Number(match[2]) }
}

export function isSlideId(id: string): boolean {
  return SLIDE_ID_PATTERN.test(id)
}

/** Every slide page lives in `pages/slides/`, so every slide route starts here. */
export const SLIDES_ROUTE_PREFIX = '/slides/'

/** Route that belongs to an id: `PRE-0001` -> `/slides/pre-0001` (page `pages/slides/pre-0001.vue`). */
export function slideIdToRoute(id: string): string {
  return `${SLIDES_ROUTE_PREFIX}${id.toLowerCase()}`
}

/** Inverse of `slideIdToRoute`. Returns null for routes that are not slides. */
export function routeToSlideId(path: string): string | null {
  const clean = path.replace(/\/+$/, '')
  if (!clean.startsWith(SLIDES_ROUTE_PREFIX)) return null
  const id = clean.slice(SLIDES_ROUTE_PREFIX.length).toUpperCase()
  return isSlideId(id) ? id : null
}
