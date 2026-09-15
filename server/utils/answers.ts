/**
 * Judges a typed answer against the expected one.
 *
 * Numbers compare as numbers, so `18.0`, `18` and the German `18,0` are the same,
 * and a wrong number says whether it is too high or too low. Text ignores case
 * and extra spaces.
 */
export type Answer = number | string
export type Verdict = 'correct' | 'high' | 'low' | 'wrong'

const normalText = (text: string) => text.trim().replace(/\s+/g, ' ').toLowerCase()

export function judgeAnswer(given: string, expected: Answer): Verdict {
  const text = given.trim()
  if (typeof expected === 'number') {
    const value = Number(text.replace(',', '.'))
    if (!text || !Number.isFinite(value)) return 'wrong'
    if (Math.abs(value - expected) < 1e-6) return 'correct'
    return value > expected ? 'high' : 'low'
  }
  return normalText(text) === normalText(expected) ? 'correct' : 'wrong'
}
