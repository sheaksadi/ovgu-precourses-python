import { randomInt } from '../utils/seeded'
import { defineProblem } from './types'

/**
 * Lists round (slide 11), the room's first puzzle.
 *
 * Loops come later in the deck, so this one is pure index arithmetic:
 *   Part 1: the first three prices together (index 0, 1, 2)
 *   Part 2: the last three together, which is where negative indexes earn
 *           their keep: the list is long enough that counting is no fun.
 *
 * Prices are in cents, so every answer is a whole number.
 */
export const listsBasket = defineProblem<number[]>({
  id: 'lists-basket',
  parts: 2,
  generate: rng => Array.from({ length: 25 }, () => randomInt(rng, 15, 400)),
  format: (prices, locale) => `${locale === 'de' ? 'preise' : 'prices'} = [${prices.join(', ')}]`,
  solve: (prices, part) => {
    const three = part === 1 ? prices.slice(0, 3) : prices.slice(-3)
    return three.reduce((sum, price) => sum + price, 0)
  },
})
