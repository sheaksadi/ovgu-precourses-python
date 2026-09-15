/**
 * Seeded randomness for puzzle inputs.
 *
 * Every device gets its own input for a problem, and the same one again after a
 * reload: the seed is the problem id plus the device id, so nothing needs to be
 * stored.
 */
export type Rng = () => number

/** A 32-bit hash of a string (cyrb53's mixing, lower half). */
export function hashSeed(text: string): number {
  let h1 = 0xDEADBEEF
  let h2 = 0x41C6CE57
  for (const char of text) {
    const code = char.codePointAt(0)!
    h1 = Math.imul(h1 ^ code, 2654435761)
    h2 = Math.imul(h2 ^ code, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  return h1 >>> 0
}

/** mulberry32: small, fast, and good enough for classroom puzzles. */
export function seededRng(seed: number): Rng {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6D2B79F5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Whole number from `min` to `max`, both included. */
export const randomInt = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1))

export const randomPick = <T>(rng: Rng, list: readonly T[]): T => list[Math.floor(rng() * list.length)]!
