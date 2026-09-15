import { randomInt } from '../utils/seeded'
import { defineProblem } from './types'

/**
 * Loops round (after "Schleifen überall").
 *
 * loops-fish: Momo's catch of the day, 60 fish sizes in cm.
 *   Part 1: how many fish are at least 20 cm? (loop, if, counter)
 *   Part 2: her belly holds 300 cm of fish. She eats them in order and stops
 *           before the first one that no longer fits. How many does she eat?
 *           (loop, running sum, break)
 */
export const loopsFish = defineProblem<number[]>({
  id: 'loops-fish',
  parts: 2,
  generate: rng => Array.from({ length: 60 }, () => randomInt(rng, 3, 45)),
  format: (fish, locale) => `${locale === 'de' ? 'fische' : 'fish'} = [${fish.join(', ')}]`,
  solve: (fish, part) => {
    if (part === 1) return fish.filter(size => size >= 20).length
    let belly = 0
    let eaten = 0
    for (const size of fish) {
      if (belly + size > 300) break
      belly += size
      eaten++
    }
    return eaten
  },
})
