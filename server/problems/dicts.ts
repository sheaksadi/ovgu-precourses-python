import { randomInt } from '../utils/seeded'
import { defineProblem } from './types'

/**
 * Dictionaries round (slide 27).
 *
 * dicts-shelter: the animal shelter's list, a name and an age per animal.
 *   Part 1: how old are they together? (loop over the values)
 *   Part 2: who is the oldest? (the values decide, the answer is a key)
 *
 * The oldest animal is always alone at the top, so Part 2 has one answer.
 */
const NAMES = [
  'Momo', 'Bello', 'Hoppel', 'Kiki', 'Flitzer', 'Nala', 'Rocky', 'Luna',
  'Pauli', 'Wanda', 'Fips', 'Mia', 'Karlo', 'Nuri', 'Sammy', 'Tilda',
]

export const dictsShelter = defineProblem<Array<[string, number]>>({
  id: 'dicts-shelter',
  parts: 2,
  generate: (rng) => {
    const pool = [...NAMES]
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j]!, pool[i]!]
    }
    const animals = pool.slice(0, 14).map(name => [name, randomInt(rng, 1, 15)] as [string, number])
    const oldest = Math.max(...animals.map(([, age]) => age))
    if (animals.filter(([, age]) => age === oldest).length > 1) {
      const index = animals.findIndex(([, age]) => age === oldest)
      animals[index]![1] = oldest + 1
    }
    return animals
  },
  format: (animals, locale) =>
    `${locale === 'de' ? 'tiere' : 'animals'} = {${animals.map(([name, age]) => `"${name}": ${age}`).join(', ')}}`,
  solve: (animals, part) => {
    if (part === 1) return animals.reduce((sum, [, age]) => sum + age, 0)
    return animals.reduce((oldest, animal) => (animal[1] > oldest[1] ? animal : oldest))[0]
  },
})
