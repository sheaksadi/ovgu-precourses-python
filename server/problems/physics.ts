import { randomInt } from '../utils/seeded'
import { defineProblem } from './types'

/**
 * Maths and physics round (after "Funktionen für Mathe und Physik").
 *
 * physics-race: Bello's sprints, a distance in metres and a time in seconds for
 * every run, in two lists.
 *   Part 1: how many runs were faster than 5 m/s?
 *   Part 2: how many metres did he cover in those fast runs together?
 *
 * Both work without functions, with a `range(len(...))` loop and a division.
 * They get much easier to read with a helper the round suggests:
 * `tempo(strecke, zeit)`. No run lands exactly on 5 m/s, so the comparison is
 * never a matter of floating point luck.
 */
interface Sprints {
  distances: number[]
  times: number[]
}

const FAST = 5

export const physicsRace = defineProblem<Sprints>({
  id: 'physics-race',
  parts: 2,
  generate: (rng) => {
    const distances: number[] = []
    const times: number[] = []
    for (let run = 0; run < 30; run++) {
      const time = randomInt(rng, 8, 60)
      // Speeds from 2.8 to 9.2 m/s, never exactly the 5 m/s the question asks about.
      let distance = Math.round(time * (randomInt(rng, 28, 92) / 10))
      if (distance === time * FAST) distance += 1
      distances.push(distance)
      times.push(time)
    }
    return { distances, times }
  },
  format: ({ distances, times }, locale) => [
    `${locale === 'de' ? 'strecken' : 'distances'} = [${distances.join(', ')}]`,
    `${locale === 'de' ? 'zeiten' : 'times'} = [${times.join(', ')}]`,
  ].join('\n'),
  solve: ({ distances, times }, part) => {
    const fast = distances.filter((distance, index) => distance / times[index]! > FAST)
    return part === 1 ? fast.length : fast.reduce((sum, distance) => sum + distance, 0)
  },
})
