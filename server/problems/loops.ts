import { randomInt } from '../utils/seeded'
import { defineProblem } from './types'

/**
 * Loops round (slide 18).
 *
 * loops-steps: Bello's step counter, one number per day.
 *   Part 1: how many days did he pass 10000? (loop, if, counter)
 *   Part 2: the longest run of such days in a row, which forces a counter that
 *           goes back to zero — the first problem where the order matters.
 *
 * loops-fish: Momo's catch of the day, 60 fish sizes in cm.
 *   Part 1: how many fish are at least 20 cm? (loop, if, counter)
 *   Part 2: her belly holds 300 cm of fish. She eats them in order and stops
 *           before the first one that no longer fits. How many does she eat?
 *           (loop, running sum, break)
 */
export const loopsSteps = defineProblem<number[]>({
  id: 'loops-steps',
  parts: 2,
  generate: rng => Array.from({ length: 40 }, () => randomInt(rng, 2000, 18000)),
  format: (steps, locale) => `${locale === 'de' ? 'schritte' : 'steps'} = [${steps.join(', ')}]`,
  solve: (steps, part) => {
    if (part === 1) return steps.filter(day => day >= 10000).length
    let best = 0
    let run = 0
    for (const day of steps) {
      run = day >= 10000 ? run + 1 : 0
      if (run > best) best = run
    }
    return best
  },
})

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
