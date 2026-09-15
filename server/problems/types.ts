import type { Answer } from '../utils/answers'
import type { Rng } from '../utils/seeded'

export type Part = 1 | 2
export type ProblemLocale = 'de' | 'en'

/**
 * An Advent of Code style problem: every device gets its own input, and only
 * the answer is checked, never the program.
 *
 * The story, the example and the Part 2 twist live in `locales/` under
 * `problems.<id>`; this file holds what must stay on the server, above all the
 * solver, so the answer never reaches the client bundle.
 */
export interface Problem<Data = unknown> {
  id: string
  /** 1, or 2 when a second part opens on the same input once Part 1 is solved. */
  parts: Part
  /** The device's input, from its seeded random generator. */
  generate: (rng: Rng) => Data
  /** The input as the student copies it: a Python line early in the course, plain text later. */
  format: (data: Data, locale: ProblemLocale) => string
  solve: (data: Data, part: Part) => Answer
}

export const defineProblem = <Data>(problem: Problem<Data>): Problem<Data> => problem
