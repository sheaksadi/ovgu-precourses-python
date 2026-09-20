import { createError, defineEventHandler, getHeader, readBody } from 'h3'
import { isAdminPassword } from '../../../utils/admin'
import { deckDb } from '../../utils/db'
import { problemRoom } from '../../utils/problemRoom'
import { wsManager } from '../../utils/wsManager'

/**
 * Empty the room's database, for a dry run before the real room arrives.
 *
 * Testing the puzzles from a phone leaves a leaderboard full of the presenter,
 * and there is no way to take a solve back once it is in. This is that way.
 * It clears the live standings with the file, then tells every screen, so the
 * leaderboards on the wall go empty at the same moment.
 *
 * `clear` is the only thing it does. The password is the one from
 * `utils/admin.ts`, sent as `x-deck-admin` or in the body.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{ action?: string, password?: string }>(event).catch(() => null)
  if (!isAdminPassword(getHeader(event, 'x-deck-admin') || body?.password)) {
    throw createError({ statusCode: 401, statusMessage: 'Wrong password' })
  }
  if (body?.action !== 'clear') throw createError({ statusCode: 400, statusMessage: 'Unknown action' })

  problemRoom.reset(true)
  wsManager.broadcast(problemRoom.state())
  return { cleared: true, counts: deckDb.counts() }
})
