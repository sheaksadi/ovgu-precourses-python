import { randomInt } from '../utils/seeded'
import { defineProblem } from './types'

/**
 * Built-ins round (slide 25).
 *
 * builtins-scores: a tournament table as two lists that belong together.
 *   Part 1: who scored the most? The answer is a name, so `zip` or an index
 *           loop has to carry the name along with the number.
 *   Part 2: the three best scores together, which is what `sorted` is for.
 *
 * The cast's names are the same in both languages, so the answer is too.
 */
const NAMES = [
  'Momo', 'Bello', 'Hoppel', 'Kiki', 'Flitzer', 'Nala', 'Rocky', 'Luna',
  'Pauli', 'Wanda', 'Fips', 'Mia', 'Karlo', 'Nuri', 'Sammy', 'Tilda',
]

interface Table {
  names: string[]
  points: number[]
}

export const builtinsScores = defineProblem<Table>({
  id: 'builtins-scores',
  parts: 2,
  generate: (rng) => {
    const pool = [...NAMES]
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j]!, pool[i]!]
    }
    const names = pool.slice(0, 12)
    const points = names.map(() => randomInt(rng, 10, 99))
    // One clear winner, so the answer is one name and not a discussion.
    const best = Math.max(...points)
    if (points.filter(score => score === best).length > 1) points[points.indexOf(best)] = Math.min(100, best + 1)
    return { names, points }
  },
  format: ({ names, points }, locale) => [
    `${locale === 'de' ? 'namen' : 'names'} = [${names.map(name => `"${name}"`).join(', ')}]`,
    `${locale === 'de' ? 'punkte' : 'points'} = [${points.join(', ')}]`,
  ].join('\n'),
  solve: ({ names, points }, part) => {
    if (part === 1) return names[points.indexOf(Math.max(...points))]!
    return [...points].sort((a, b) => b - a).slice(0, 3).reduce((sum, score) => sum + score, 0)
  },
})
