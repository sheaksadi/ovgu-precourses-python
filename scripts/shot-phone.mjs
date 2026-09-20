#!/usr/bin/env node
/**
 * Screenshots slides at phone size, so a change can be looked at rather than
 * guessed at.
 *
 * Prerequisites: the app is running, and Chromium is reachable. Usage:
 *
 *   npm run dev
 *   chromium --headless=new --no-sandbox --remote-debugging-port=9222 \
 *     --user-data-dir=/tmp/deck-profile about:blank &
 *   npm run shot:phone -- <out-dir> /slides/pre-0041 /slides/pre-0042
 *
 * A slide id works in place of a route, so `pre-0041` and `PRE-0041` are the
 * same thing. One file per route, named after it.
 *
 * Environment: DECK_URL, CDP_URL, W and H (default 390 x 844, an iPhone held
 * upright), WAIT (ms to let a scene animate before the shot, default 2200).
 */
import { mkdirSync, writeFileSync } from 'node:fs'

const BASE = process.env.DECK_URL || 'http://localhost:3000'
const CDP = process.env.CDP_URL || 'http://localhost:9222'
const W = Number(process.env.W || 390)
const H = Number(process.env.H || 844)
const WAIT = Number(process.env.WAIT || 2200)

const [out, ...targets] = process.argv.slice(2)
if (!out || !targets.length) {
  console.error('usage: npm run shot:phone -- <out-dir> <route or slide id> [more…]')
  process.exit(1)
}

const routeOf = (value) => (value.startsWith('/') ? value : `/slides/${value.toLowerCase()}`)
const wait = ms => new Promise(r => setTimeout(r, ms))

const version = await fetch(`${CDP}/json/version`).catch(() => null)
if (!version?.ok) {
  console.error(`shot:phone — no Chromium on ${CDP}. See the header of this file for the launch command.`)
  process.exit(1)
}

mkdirSync(out, { recursive: true })

const target = await (await fetch(`${CDP}/json/new?about:blank`, { method: 'PUT' })).json()
const ws = new WebSocket(target.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message.result)
    pending.delete(message.id)
  }
})
await new Promise(resolve => ws.addEventListener('open', resolve))

const send = (method, params = {}) => new Promise((resolve) => {
  const n = ++id
  pending.set(n, resolve)
  ws.send(JSON.stringify({ id: n, method, params }))
})

await send('Page.enable')
await send('Runtime.enable')
// A hidden tab throttles its timers and never finishes a transition, so the
// scene would be caught halfway. These two make the tab behave as a live one.
await send('Emulation.setFocusEmulationEnabled', { enabled: true })
await send('Page.setWebLifecycleState', { state: 'active' })
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: true })

for (const value of targets) {
  const route = routeOf(value)
  await send('Page.navigate', { url: BASE + route })
  await wait(WAIT)
  const { data } = await send('Page.captureScreenshot', { format: 'png' })
  const file = `${out}/${route.split('/').pop()}.png`
  writeFileSync(file, Buffer.from(data, 'base64'))
  console.log(file)
}

await fetch(`${CDP}/json/close/${target.id}`)
ws.close()
