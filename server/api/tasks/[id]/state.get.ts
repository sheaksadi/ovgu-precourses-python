import { createError, defineEventHandler, getRouterParam } from 'h3'
import { CODE_TASKS } from '../../../../utils/codeTasks'
import { audienceIdOf } from '../../../utils/audience'
import { problemRoom } from '../../../utils/problemRoom'

/** What this device has done with a code task. The code itself never leaves the device. */
export default defineEventHandler((event) => {
  const task = CODE_TASKS[getRouterParam(event, 'id') ?? '']
  if (!task) throw createError({ statusCode: 404, statusMessage: 'Unknown task' })
  const audienceId = audienceIdOf(event)
  if (!audienceId) throw createError({ statusCode: 400, statusMessage: 'Open /join first' })

  problemRoom.markOpened(task.id)
  return { id: task.id, parts: 1, solved: problemRoom.solvedParts(task.id, audienceId), cooldownMs: 0 }
})
