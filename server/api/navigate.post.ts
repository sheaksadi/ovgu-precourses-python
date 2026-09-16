import { createError, defineEventHandler, getHeader, readBody } from 'h3'
import { slides } from '../../slides.config'
import { acceptControllerEvent } from '../utils/controllerGate'
import { wsManager } from '../utils/wsManager'
import { problemRoom } from '../utils/problemRoom'
import { catRoom } from '../utils/catRoom'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ slideId?: string, isPresenting?: boolean }>(event)
  if (!body?.slideId || !slides.some(slide => slide.id === body.slideId && !slide.hidden)) {
    throw createError({ statusCode: 400, statusMessage: 'Unknown slide' })
  }
  if (!acceptControllerEvent(getHeader(event, 'x-deck-controller') || 'anonymous')) {
    return { type: 'state', ...wsManager.getState(), dropped: true }
  }

  wsManager.setState({
    slideId: body.slideId,
    isPresenting: body.isPresenting ?? wsManager.getState().isPresenting
  })
  // The round's clock starts when the room first reaches a problem slide.
  const reached = slides.find(entry => entry.id === body.slideId)
  if (reached?.problem) problemRoom.markOpened(reached.problem)

  // Reaching the live slide puts the first cat on screen without anyone tapping.
  if (reached?.presenterAction?.command === 'cat') {
    const cat = await catRoom.ensure()
    if (cat) wsManager.broadcast(cat)
  }

  const state = { type: 'state', ...wsManager.getState() }
  wsManager.broadcast(state)
  return state
})
