#!/usr/bin/env node
/**
 * Drives the whole deck in headless Chromium and screenshots every surface.
 *
 * It opens the dashboard, the presenter view, the join page, a slide screen, the
 * phone remote and an audience device, then checks the behaviour that the
 * WebSocket tests cannot see: following, drifting, the sync button, the
 * interaction guard, and the audience counters.
 *
 * Prerequisites: the app is running, and Chromium is reachable. Usage:
 *
 *   npm run dev
 *   chromium --headless=new --no-sandbox --remote-debugging-port=9222 \
 *     --user-data-dir=/tmp/deck-profile about:blank &
 *   npm run check:deck
 *
 * Environment: DECK_URL (default http://localhost:3000),
 * CDP_URL (default http://localhost:9222), OUT_DIR (default ./deck-shots).
 */
import { writeFileSync, mkdirSync } from 'node:fs'

const BASE = process.env.DECK_URL || 'http://localhost:3000'
const CDP = process.env.CDP_URL || 'http://localhost:9222'
const OUT = process.env.OUT_DIR || 'deck-shots'
mkdirSync(OUT, { recursive: true })

const wait = (ms) => new Promise(r => setTimeout(r, ms))

async function browserWs() {
  const res = await fetch(`${CDP}/json/version`).catch(() => null)
  if (!res?.ok) {
    console.error(`check:deck — no Chromium on ${CDP}. See the header of this file for the launch command.`)
    process.exit(1)
  }
  return (await res.json()).webSocketDebuggerUrl
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url)
    let id = 0
    const pending = new Map()
    ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data)
      if (msg.id && pending.has(msg.id)) {
        const { resolve: done, reject: fail } = pending.get(msg.id)
        pending.delete(msg.id)
        msg.error ? fail(new Error(JSON.stringify(msg.error))) : done(msg.result)
      }
    })
    ws.addEventListener('error', reject)
    ws.addEventListener('open', () => resolve({
      send: (method, params = {}) => new Promise((done, fail) => {
        const msgId = ++id
        pending.set(msgId, { resolve: done, reject: fail })
        ws.send(JSON.stringify({ id: msgId, method, params }))
      })
    }))
  })
}

const pageWsUrl = (targetId) => `${CDP.replace(/^http/, 'ws')}/devtools/page/${targetId}`

async function openPage(browser, url, width = 1280, height = 800) {
  const { targetId } = await browser.send('Target.createTarget', { url })
  const page = await connect(pageWsUrl(targetId))
  await page.send('Page.enable')
  await page.send('Runtime.enable')
  await page.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
  return page
}

const evaluate = async (page, expression) => {
  const res = await page.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  return res.result?.value
}

const path = (page) => evaluate(page, 'location.pathname')

/** Wait until the page reaches a path, so a slow room cannot fail a check. */
async function waitForPath(page, expected, timeoutMs = 6000) {
  const deadline = Date.now() + timeoutMs
  let current = await path(page)
  while (current !== expected && Date.now() < deadline) {
    await wait(200)
    current = await path(page)
  }
  return current
}

/** Wait until a selector has text, for chrome that appears after a round trip. */
async function waitForText(page, selector, timeoutMs = 6000) {
  const deadline = Date.now() + timeoutMs
  let value = await text(page, selector)
  while (!value && Date.now() < deadline) {
    await wait(200)
    value = await text(page, selector)
  }
  return value
}

const text = (page, selector) =>
  evaluate(page, `document.querySelector(${JSON.stringify(selector)})?.innerText?.replace(/\\s+/g,' ').trim() ?? null`)

const clickText = (page, selector, label) => evaluate(page, `(() => {
  const el = [...document.querySelectorAll(${JSON.stringify(selector)})]
    .find(n => n.innerText.trim().toLowerCase().includes(${JSON.stringify(label.toLowerCase())}));
  if (!el) return 'not found';
  el.click();
  return 'clicked';
})()`)

const clickSelector = (page, selector) =>
  evaluate(page, `(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return 'not found'; el.click(); return 'clicked'; })()`)

async function pressKey(page, key, code, vk) {
  await page.send('Page.bringToFront')
  await evaluate(page, 'window.focus(); document.body.focus();')
  for (const type of ['keyDown', 'keyUp']) {
    await page.send('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk })
  }
}

async function shot(page, name, width, height) {
  await page.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
  await wait(500)
  const { data } = await page.send('Page.captureScreenshot', { format: 'png' })
  writeFileSync(`${OUT}/${name}.png`, Buffer.from(data, 'base64'))
}

const results = []
const check = (name, pass, detail = '') =>
  results.push(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)

const browser = await connect(await browserWs())

// The deck this drives: the first slides in order, and the loops round, which is
// where a device has something of its own to keep.
const FIRST = { route: '/slides/pre-0033' }
const SECOND = { route: '/slides/pre-0038', title: 'Vorstellungsrunde' }
const DRIFTED = { route: '/slides/pre-0034' }
const PUZZLE = { route: '/slides/pre-0137', title: 'Rätsel: Momos Fang' }
const BOARD = { route: '/slides/pre-0138' }

// --- Surfaces -----------------------------------------------------------
const dashboard = await openPage(browser, `${BASE}/dashboard`, 1440, 1400)
const presenter = await openPage(browser, `${BASE}/presenter`, 1600, 1000)
const join = await openPage(browser, `${BASE}/join`, 480, 820)
await wait(3000)
await shot(dashboard, '01-dashboard', 1440, 1500)
await shot(presenter, '02-presenter', 1600, 1000)
await shot(join, '03-join', 480, 820)

// --- The remote drives the room, a slide screen follows -----------------
const reset = await openPage(browser, `${BASE}/`, 800, 600)
await wait(1200)
await evaluate(reset, 'localStorage.clear()')

const viewer = await openPage(browser, `${BASE}${FIRST.route}`, 1280, 720)
const control = await openPage(browser, `${BASE}/control`, 430, 860)
await wait(3000)

await clickSelector(control, 'button[aria-label="Open menu"]')
await wait(400)
await clickText(control, 'button', 'Restart Presentation')
check('remote resets the room', (await waitForPath(viewer, FIRST.route)) === FIRST.route,
  `viewer at ${await path(viewer)}`)

await clickText(control, 'button', 'Next')
check('viewer follows the remote', (await waitForPath(viewer, SECOND.route)) === SECOND.route,
  `viewer at ${await path(viewer)}`)
await shot(viewer, '04-viewer-following', 1280, 720)
await shot(control, '05-remote', 430, 860)

// --- The slide screen drifts on its own, the room stays put -------------
await pressKey(viewer, 'ArrowRight', 'ArrowRight', 39)
check('viewer key moves only itself', (await waitForPath(viewer, DRIFTED.route)) === DRIFTED.route,
  `viewer at ${await path(viewer)}`)
check('room stayed put', (await text(control, 'header span.truncate')) === SECOND.title,
  `remote shows ${JSON.stringify(await text(control, 'header span.truncate'))}`)

const pill = await waitForText(viewer, 'button[aria-label^="Sync"]')
check('sync pill appears when off-sync', !!pill, JSON.stringify(pill))
await shot(viewer, '06-viewer-off-sync', 1280, 720)

// The `s` key is the same as tapping the pill.
await pressKey(viewer, 's', 'KeyS', 83)
check('the s key rejoins the room', (await waitForPath(viewer, SECOND.route)) === SECOND.route,
  `viewer at ${await path(viewer)}`)

// --- The room jumps to the puzzle slide ---------------------------------
await clickSelector(control, 'button[aria-label="Open menu"]')
await wait(500)
await clickText(control, 'button', PUZZLE.title)
check('remote can jump to a slide', (await waitForPath(viewer, PUZZLE.route)) === PUZZLE.route,
  `viewer at ${await path(viewer)}`)

// --- An audience device joins and gets its own puzzle -------------------
const audience = await openPage(browser, `${BASE}/join`, 430, 900)
await wait(3000)
await evaluate(audience, `(() => {
  const field = document.querySelector('#follow-name')
  if (!field) return 'no field'
  field.value = 'Check Phone'
  field.dispatchEvent(new Event('input', { bubbles: true }))
  return 'typed'
})()`)
await clickText(audience, '.follow-language', 'Deutsch')
check('join lands on the room slide', (await waitForPath(audience, PUZZLE.route)) === PUZZLE.route,
  `device at ${await path(audience)}`)

const puzzleInput = await waitForText(audience, '.ws-input')
check('the device gets its own puzzle input', !!puzzleInput && puzzleInput.includes('['),
  JSON.stringify(puzzleInput?.slice(0, 40)))
check('no dock on the puzzle slide itself', (await evaluate(audience, '!!document.querySelector(".dock")')) === false)
await shot(audience, '07-puzzle-workspace', 430, 900)

// --- The room moves on; the device keeps its puzzle ---------------------
await clickText(control, 'button', 'Next')
check('the device follows to the leaderboard', (await waitForPath(audience, BOARD.route)) === BOARD.route,
  `device at ${await path(audience)}`)
const dock = await waitForText(audience, '.dock')
check('the dock offers the puzzle on any other slide', !!dock, JSON.stringify(dock))

await clickSelector(audience, '.dock')
const sheetTitle = await waitForText(audience, '.sheet .ws-title')
check('the dock opens the workspace again', !!sheetTitle, JSON.stringify(sheetTitle))
await shot(audience, '08-puzzle-dock', 430, 900)
await clickSelector(audience, '.sheet-close')
await wait(500)

// --- The presenter's previews track the room ----------------------------
// They are same-origin frames, so the check can read where each one sits.
const framePath = (title) => evaluate(presenter, `(() => {
  const f = document.querySelector('iframe[title=${JSON.stringify(title)}]');
  try { return f?.contentWindow?.location?.pathname ?? null } catch { return 'cross-origin' }
})()`)
await wait(1500)
const livePath = await framePath('Live slide')
check('live preview shows the room slide', livePath === (await path(viewer)),
  `preview at ${livePath}, room at ${await path(viewer)}`)

// --- The presenter view sees the room -----------------------------------
await wait(800)
const counters = await evaluate(presenter, `[...document.querySelectorAll('aside dd')].map(d => d.innerText).join(' / ')`)
check('presenter view reports the audience', /\d/.test(counters || ''),
  `following / off-sync / working = ${counters}`)
await shot(presenter, '09-presenter-live', 1600, 1000)
await shot(dashboard, '10-dashboard-live', 1440, 1500)

// --- The handout renders every slide ------------------------------------
const print = await openPage(browser, `${BASE}/print`, 1100, 1400)
// The handout boots one preview per slide, so give it room to settle.
await wait(12000)
const sections = await evaluate(print, 'document.querySelectorAll("section").length')
check('handout lists every slide', sections >= 50, `${sections} section(s)`)
await shot(print, '11-handout', 1100, 1600)

console.log(results.join('\n'))
console.log(`\nscreenshots in ${OUT}`)
process.exit(results.some(r => r.startsWith('FAIL')) ? 1 : 0)
