import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { CODE_TASKS } from '../../../../utils/codeTasks'
import { audienceIdOf, audienceNameOf } from '../../../utils/audience'
import { problemRoom } from '../../../utils/problemRoom'
import { wsManager } from '../../../utils/wsManager'
import { deckDb } from '../../../utils/db'

/**
 * A code task passed its tests.
 *
 * The server cannot run Python, so it takes the device's word for it: the tests
 * ran in the student's own browser. This is a course, not an exam — the point is
 * that the room sees who got there, exactly like a solved puzzle.
 */
export default defineEventHandler(async (event) => {
  const task = CODE_TASKS[getRouterParam(event, 'id') ?? '']
  if (!task) throw createError({ statusCode: 404, statusMessage: 'Unknown task' })
  const audienceId = audienceIdOf(event)
  if (!audienceId) throw createError({ statusCode: 400, statusMessage: 'Open /join first' })

  const body = await readBody<{ passed?: number, total?: number, name?: unknown }>(event)
  const passed = Number(body?.passed ?? 0)
  const total = Number(body?.total ?? 0)
  if (!Number.isFinite(passed) || !Number.isFinite(total) || total <= 0 || passed < total) {
    return { result: 'failed' }
  }

  if (problemRoom.solvedParts(task.id, audienceId)[1]) return { result: 'already' }

  const name = audienceNameOf(event, body?.name)
  deckDb.recordAttempt({ problemId: task.id, audienceId, name, part: 1, given: `${passed}/${total}`, verdict: 'correct' })
  const record = problemRoom.record(task.id, { audienceId, name }, 1)
  if (!record) return { result: 'already' }

  wsManager.broadcast({
    type: 'solve',
    problemId: task.id,
    part: 1,
    audienceId,
    name,
    ...record,
    standings: problemRoom.standings(task.id),
  })
  return { result: 'correct', ...record }
})
