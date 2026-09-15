import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { PROBLEMS, inputFor } from '../../../problems'
import type { Part } from '../../../problems/types'
import { judgeAnswer } from '../../../utils/answers'
import { audienceIdOf, audienceNameOf } from '../../../utils/audience'
import { WRONG_COOLDOWN_MS, problemRoom } from '../../../utils/problemRoom'
import { wsManager } from '../../../utils/wsManager'

/**
 * Check one answer.
 *
 * Results: `correct` (with rank), `high` / `low` / `wrong` (field locked for a
 * moment), `cooldown` (still locked), `locked` (Part 2 before Part 1),
 * `already` (solved before), `empty`. A correct answer is broadcast to the room
 * as `solve`, with the problem's new standings.
 */
export default defineEventHandler(async (event) => {
  const problem = PROBLEMS[getRouterParam(event, 'id') ?? '']
  if (!problem) throw createError({ statusCode: 404, statusMessage: 'Unknown problem' })
  const audienceId = audienceIdOf(event)
  if (!audienceId) throw createError({ statusCode: 400, statusMessage: 'Open /join first' })

  const body = await readBody<{ part?: number, answer?: unknown, name?: unknown }>(event)
  const part = body?.part === 2 ? 2 : body?.part === 1 ? 1 : null
  if (!part || part > problem.parts) throw createError({ statusCode: 400, statusMessage: 'Unknown part' })

  const solved = problemRoom.solvedParts(problem.id, audienceId)
  if (solved[part]) return { result: 'already' }
  if (part === 2 && !solved[1]) return { result: 'locked' }

  const cooldownMs = problemRoom.cooldownLeft(problem.id, audienceId)
  if (cooldownMs > 0) return { result: 'cooldown', cooldownMs }

  const answer = String(body?.answer ?? '').slice(0, 200)
  if (!answer.trim()) return { result: 'empty' }

  const verdict = judgeAnswer(answer, problem.solve(inputFor(problem, audienceId), part as Part))
  if (verdict !== 'correct') {
    problemRoom.startCooldown(problem.id, audienceId)
    return { result: verdict, cooldownMs: WRONG_COOLDOWN_MS }
  }

  const name = audienceNameOf(event, body?.name)
  const record = problemRoom.record(problem.id, { audienceId, name }, part as Part)
  if (!record) return { result: 'already' }

  wsManager.broadcast({
    type: 'solve',
    problemId: problem.id,
    part,
    audienceId,
    name,
    ...record,
    standings: problemRoom.standings(problem.id),
  })
  return { result: 'correct', ...record }
})
