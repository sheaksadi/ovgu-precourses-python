#!/usr/bin/env node
/**
 * Checks the room's write rules over the WebSocket protocol.
 *
 * Start the app first (`npm run dev`, or `npm run build` then
 * `node .output/server/index.mjs`), then run `npm run check:sync`. The script
 * runs against the same HTTP and WebSocket protocol used by browsers.
 *
 * It asserts that:
 *   - a slide view cannot move the room,
 *   - direct WebSocket writes cannot move the room,
 *   - controller HTTP events move the room,
 *   - presence reports viewers, drift and interaction, and ignores peek frames,
 *   - the room forgets its position once the last client leaves.
 *
 * Counts are measured as deltas against whatever is already connected, so the
 * checks still hold while someone has the deck open in a browser.
 */
const BASE = process.env.DECK_URL || 'http://localhost:3000'
const WS_URL = `${BASE.replace(/^http/, 'ws')}/_ws`

const wait = (ms) => new Promise(r => setTimeout(r, ms))

/** What the server knows, straight from the horse's mouth. */
async function roomPeers() {
  try {
    const res = await fetch(`${BASE}/api/room-peers`)
    return res.ok ? await res.json() : null
  } catch {
    return null
  }
}

function open(role, { mode = 'stage' } = {}) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(WS_URL)
    const log = []
    ws.addEventListener('message', (e) => {
      if (e.data === 'pong') return
      try { log.push(JSON.parse(e.data)) } catch {}
    })
    ws.addEventListener('error', reject)
    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ type: 'hello', role, mode }))
      resolve({
        ws,
        log,
        send: (o) => ws.send(JSON.stringify(o)),
        close: () => ws.close()
      })
    })
  })
}

const last = (log, type) => [...log].reverse().find(m => m.type === type)

const results = []
const check = (name, pass, detail = '') =>
  results.push(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)

// Other people may have the deck open right now, so the counts below are read
// from the server and compared with each other rather than with fixed numbers.
const before = await roomPeers()
const othersConnected = before?.clients || 0

const viewer = await open('viewer', { mode: 'interactive' })
const control = await open('control')
const peek = await open('peek')
await wait(300)

// A slide view may never move the room.
viewer.send({ type: 'navigate', slideId: 'PRE-0007', isPresenting: true })
await wait(250)
check('viewer navigate rejected', last(viewer.log, 'state')?.slideId !== 'PRE-0007',
  `room on ${JSON.stringify(last(viewer.log, 'state')?.slideId)}`)

// WebSocket is broadcast-only, even for a controller role.
control.send({ type: 'navigate', slideId: 'PRE-0003' })
await wait(250)
check('direct WebSocket navigate rejected',
  last(viewer.log, 'state')?.slideId !== 'PRE-0003',
  `room on ${JSON.stringify(last(viewer.log, 'state')?.slideId)}`)

// Controller HTTP events move the room, and every screen hears about it.
await fetch(`${BASE}/api/navigate`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-deck-controller': 'check-control' },
  body: JSON.stringify({ slideId: 'PRE-0010', isPresenting: true })
})
await wait(250)
check('remote navigate accepted', last(control.log, 'state')?.slideId === 'PRE-0010',
  `remote sees ${JSON.stringify(last(control.log, 'state')?.slideId)}`)
check('viewer receives the room state', last(viewer.log, 'state')?.slideId === 'PRE-0010',
  `viewer sees ${JSON.stringify(last(viewer.log, 'state')?.slideId)}`)

// Presence: slide views count, the peek frame does not.
viewer.send({ type: 'presence', slideId: 'PRE-0010', detached: false, interacting: false })
peek.send({ type: 'presence', slideId: 'PRE-0001', detached: true, interacting: true })
await wait(250)
const server = await roomPeers()
// The audience is the subset of viewer-role clients that are showing a slide, so
// it never includes a peek frame, the landing page or the handout.
check('peek frames connect but are not audience',
  (server?.roles?.peek || 0) >= 1 &&
  (server?.summary?.viewers || 0) <= (server?.roles?.viewer || 0),
  `roles ${JSON.stringify(server?.roles)}, audience ${server?.summary?.viewers}`)
check('peek frame is not in the slide counts',
  server?.summary?.bySlide?.['PRE-0001'] === undefined,
  JSON.stringify(server?.summary?.bySlide))

viewer.send({ type: 'presence', slideId: 'PRE-0009', detached: true, interacting: true })
await wait(250)
const drifted = await roomPeers()
check('presence reports drift and interaction',
  (drifted?.summary?.detached || 0) >= 1 &&
  (drifted?.summary?.interacting || 0) >= 1 &&
  drifted?.summary?.bySlide?.['PRE-0009'] >= 1,
  JSON.stringify(drifted?.summary))

// The presenter view is the second controller.
const presenter = await open('presenter')
await wait(200)
await wait(100)
await fetch(`${BASE}/api/navigate`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-deck-controller': 'check-presenter' },
  body: JSON.stringify({ slideId: 'PRE-0011' })
})
await wait(250)
check('presenter navigate accepted', last(viewer.log, 'state')?.slideId === 'PRE-0011',
  `viewer sees ${JSON.stringify(last(viewer.log, 'state')?.slideId)}`)

// Everyone leaves: the room forgets where it was. The socket close event is not
// reliable here, so the server prunes on the heartbeat and this waits for it.
for (const peer of [viewer, control, peek, presenter]) peer.close()

if (othersConnected > 0) {
  results.push(`SKIP  room resets once every client is gone — ${othersConnected} other client(s) are connected, so the room is not empty`)
} else {
  let reset = false
  let seen = 'never checked'
  for (let attempt = 0; attempt < 14 && !reset; attempt++) {
    await wait(2000)
    const fresh = await open('viewer')
    await wait(400)
    seen = JSON.stringify(last(fresh.log, 'state')?.slideId)
    reset = last(fresh.log, 'state')?.slideId === ''
    fresh.close()
  }
  check('room resets once every client is gone', reset, `new client sees ${seen}`)
}

console.log(results.join('\n'))
process.exit(results.some(r => r.startsWith('FAIL')) ? 1 : 0)
