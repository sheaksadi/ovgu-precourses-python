import { createError, defineEventHandler, getRouterParam } from 'h3'
import { PROBLEMS, inputFor } from '../../../problems'
import { audienceIdOf, localeOf } from '../../../utils/audience'
import { problemRoom } from '../../../utils/problemRoom'

/** This device's puzzle input, and what it has solved so far. */
export default defineEventHandler((event) => {
  const problem = PROBLEMS[getRouterParam(event, 'id') ?? '']
  if (!problem) throw createError({ statusCode: 404, statusMessage: 'Unknown problem' })
  const audienceId = audienceIdOf(event)
  if (!audienceId) throw createError({ statusCode: 400, statusMessage: 'Open /join first' })

  problemRoom.markOpened(problem.id)
  return {
    id: problem.id,
    parts: problem.parts,
    input: problem.format(inputFor(problem, audienceId), localeOf(event)),
    solved: problemRoom.solvedParts(problem.id, audienceId),
    cooldownMs: problemRoom.cooldownLeft(problem.id, audienceId),
  }
})
