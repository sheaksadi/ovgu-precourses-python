import { randomInt } from '../utils/seeded'
import { defineProblem } from './types'

/**
 * Data round (after the libraries lesson).
 *
 * data-temps: 30 daily temperatures in whole degrees.
 *   Part 1: how many days were warmer than the average? Two passes over the
 *           same list, which is where `sum` and `len` earn their keep.
 *   Part 2: the biggest jump from one day to the next, with `abs` so the
 *           direction does not matter.
 *
 * School maths, written as a program. Both parts are one line with NumPy, which
 * the problem text mentions for anyone who wants to try the library.
 */
export const dataTemps = defineProblem<number[]>({
  id: 'data-temps',
  parts: 2,
  generate: rng => Array.from({ length: 30 }, () => randomInt(rng, -5, 35)),
  format: (temps, locale) => `${locale === 'de' ? 'temperaturen' : 'temps'} = [${temps.join(', ')}]`,
  solve: (temps, part) => {
    if (part === 1) {
      const average = temps.reduce((sum, day) => sum + day, 0) / temps.length
      return temps.filter(day => day > average).length
    }
    return temps.slice(1).reduce((biggest, day, index) => Math.max(biggest, Math.abs(day - temps[index]!)), 0)
  },
})
