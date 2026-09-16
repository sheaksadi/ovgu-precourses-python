import { hashSeed, seededRng } from '../utils/seeded'
import { listsBasket } from './lists'
import { loopsFish } from './loops'
import type { Problem } from './types'

/** Every puzzle the deck knows, by id. A slide points at one with `problem` in `slides.config.ts`. */
export const PROBLEMS: Record<string, Problem<any>> = Object.fromEntries(
  [listsBasket, loopsFish].map(problem => [problem.id, problem]),
)

/** The input this device gets for this problem. The same device always gets the same one. */
export const inputFor = <Data>(problem: Problem<Data>, audienceId: string): Data =>
  problem.generate(seededRng(hashSeed(`${problem.id}:${audienceId}`)))
