import { createError, defineEventHandler, getHeader, getQuery } from 'h3'
import { isAdminPassword } from '../../../utils/admin'
import { deckDb } from '../../utils/db'

/** What the database holds right now, for the presenter's button to name. */
export default defineEventHandler((event) => {
  if (!isAdminPassword(getHeader(event, 'x-deck-admin') || getQuery(event).password)) {
    throw createError({ statusCode: 401, statusMessage: 'Wrong password' })
  }
  return { file: deckDb.file, counts: deckDb.counts() }
})
