import { createError, defineEventHandler, getHeader, readBody } from 'h3'
import { slides } from '../../slides.config'
import { acceptControllerEvent } from '../utils/controllerGate'
import { wsManager } from '../utils/wsManager'

let sequence = 0

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string, slideId?: string, action?: string }>(event)

  const isDashboardCommand = body?.name === 'goto_dashboard'
  const slide = slides.find(entry => entry.id === body?.slideId)
  const isSlideAction = body?.name === 'slide_action' && slide?.presenterAction?.command === body.action
  if (!isDashboardCommand && !isSlideAction) {
    throw createError({ statusCode: 400, statusMessage: 'Unknown command' })
  }
  if (!acceptControllerEvent(getHeader(event, 'x-deck-controller') || 'anonymous')) {
    return { type: 'command', name: body.name, dropped: true }
  }

  const command = { type: 'command', name: body.name, slideId: body.slideId, action: body.action, sequence: ++sequence }
  wsManager.broadcast(command)
  return command
})
