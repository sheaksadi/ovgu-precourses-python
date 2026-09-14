import { createError, defineEventHandler, getHeader, readBody } from 'h3'
import { slides } from '../../slides.config'
import { acceptControllerEvent } from '../utils/controllerGate'
import { wsManager } from '../utils/wsManager'

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
  const state = { type: 'state', ...wsManager.getState() }
  wsManager.broadcast(state)
  return state
})
