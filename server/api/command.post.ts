import { createError, defineEventHandler, getHeader, readBody } from 'h3'
import { slides } from '../../slides.config'
import { acceptControllerEvent } from '../utils/controllerGate'
import { wsManager } from '../utils/wsManager'
import { spinRoom } from '../utils/spinRoom'
import { catRoom } from '../utils/catRoom'
import { problemRoom } from '../utils/problemRoom'

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

  // The icebreaker spin is drawn here, so the whole room plays the same question.
  if (isSlideAction && body.action === 'spin') {
    const spin = spinRoom.spin(null)
    if (spin) wsManager.broadcast(spin)
    return spin ?? { type: 'spin_busy' }
  }

  // The live cat is fetched here too, so every screen shows the same one.
  if (isSlideAction && body.action === 'cat') {
    // The room traces the request line while it is out; say that it started.
    if (!catRoom.busy()) wsManager.broadcast({ type: 'cat_pending', by: null, at: Date.now() })
    const cat = await catRoom.next(null)
    if (cat) wsManager.broadcast(cat)
    return cat ?? { type: 'cat_busy' }
  }

  // Part 2 for everyone: the answer endpoint stops asking for Part 1 first, and
  // every device learns it from the room's problem state.
  if (isSlideAction && body.action === 'reveal' && slide?.problem) {
    problemRoom.toggleReveal(slide.problem)
    const state = problemRoom.state()
    wsManager.broadcast(state)
    return state
  }

  const command = { type: 'command', name: body.name, slideId: body.slideId, action: body.action, sequence: ++sequence }
  wsManager.broadcast(command)
  return command
})
