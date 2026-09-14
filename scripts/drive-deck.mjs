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

const viewer = await openPage(browser, `${BASE}/pre-0001`, 1280, 720)
const control = await openPage(browser, `${BASE}/control`, 430, 860)
await wait(3000)

await clickText(control, 'button', 'Resume Presentation')
await wait(600)
await clickSelector(control, 'button[aria-label="Open menu"]')
await wait(400)
await clickText(control, 'button', 'Restart Presentation')
check('remote resets the room', (await waitForPath(viewer, '/pre-0001')) === '/pre-0001',
  `viewer at ${await path(viewer)}`)

await clickText(control, 'button', 'Next')
check('viewer follows the remote', (await waitForPath(viewer, '/pre-0002')) === '/pre-0002',
  `viewer at ${await path(viewer)}`)
await shot(viewer, '04-viewer-following', 1280, 720)
await shot(control, '05-remote', 430, 860)

// --- The slide screen drifts on its own, the room stays put -------------
await pressKey(viewer, 'ArrowRight', 'ArrowRight', 39)
check('viewer key moves only itself', (await waitForPath(viewer, '/pre-0003')) === '/pre-0003',
  `viewer at ${await path(viewer)}`)
check('room stayed put', (await text(control, 'header span.truncate')) === 'About the Tech',
  `remote shows ${JSON.stringify(await text(control, 'header span.truncate'))}`)

const pill = await waitForText(viewer, 'button[aria-label^="Sync"]')
check('sync pill appears when off-sync', !!pill, JSON.stringify(pill))
await shot(viewer, '06-viewer-off-sync', 1280, 720)

// The `s` key is the same as tapping the pill.
await pressKey(viewer, 's', 'KeyS', 83)
check('the s key rejoins the room', (await waitForPath(viewer, '/pre-0002')) === '/pre-0002',
  `viewer at ${await path(viewer)}`)

// --- The room moves to the interactive slide ----------------------------
await clickSelector(control, 'button[aria-label="Open menu"]')
await wait(500)
await clickText(control, 'button', 'Try It Yourself')
check('remote can jump to a slide', (await waitForPath(viewer, '/pre-0009')) === '/pre-0009',
  `viewer at ${await path(viewer)}`)

// --- An audience device, in interactive mode ----------------------------
const audience = await openPage(browser, `${BASE}/join?mode=interactive`, 430, 900)
await wait(3000)
await clickText(audience, 'button', 'Join the deck')
check('join lands on the room slide', (await waitForPath(audience, '/pre-0009')) === '/pre-0009',
  `device at ${await path(audience)}`)
check('interactive chrome is on', (await text(audience, 'button[aria-label="Next slide on this device"]')) !== null)
await shot(audience, '07-interactive', 430, 900)

await clickText(audience, 'button', 'Start')
await wait(700)
check('interaction reports its step',
  !!(await evaluate(audience, `document.body.innerText.match(/step \\d+ \\/ \\d+/)?.[0] ?? null`)),
  JSON.stringify(await evaluate(audience, `document.body.innerText.match(/step \\d+ \\/ \\d+/)?.[0] ?? null`)))
await shot(audience, '08-interaction-started', 430, 900)

// --- The presenter moves on: the guard must ask -------------------------
await clickText(control, 'button', 'Next')
await waitForText(audience, '#interaction-guard-title')
check('guard modal asks before leaving',
  (await text(audience, '#interaction-guard-title')) === 'Move on to the next interaction?',
  JSON.stringify(await text(audience, '#interaction-guard-title')))
check('guard focuses the safe choice',
  (await evaluate(audience, 'document.activeElement?.innerText?.trim() ?? null')) === 'Stay here',
  JSON.stringify(await evaluate(audience, 'document.activeElement?.innerText?.trim() ?? null')))
await shot(audience, '09-guard-modal', 430, 900)

await clickText(audience, 'button', 'Stay here')
await wait(1000)
check('stay here keeps the slide', (await path(audience)) === '/pre-0009', `device at ${await path(audience)}`)
check('stay here leaves the sync pill', !!(await text(audience, 'button[aria-label^="Sync"]')))
await shot(audience, '10-stayed-off-sync', 430, 900)

// --- Its own tap asks as well, and skipping goes through ----------------
await clickSelector(audience, 'button[aria-label="Next slide on this device"]')
await wait(900)
check('own tap asks as well', !!(await text(audience, '#interaction-guard-title')))
await clickText(audience, 'button', 'Skip now')
await waitForPath(audience, '/pre-0008')
check('skip now moves on', (await path(audience)) !== '/pre-0009', `device at ${await path(audience)}`)

// --- The presenter's previews track the room ----------------------------
// They are same-origin frames, so the check can read where each one sits.
const framePath = (title) => evaluate(presenter, `(() => {
  const f = document.querySelector('iframe[title=${JSON.stringify(title)}]');
  try { return f?.contentWindow?.location?.pathname ?? null } catch { return 'cross-origin' }
})()`)
await wait(1200)
const livePath = await framePath('Live slide')
check('live preview shows the room slide', livePath === (await path(viewer)) || livePath === '/pre-0008',
  `preview at ${livePath}, room at ${await path(viewer)}`)

// --- The presenter view sees the room -----------------------------------
await wait(800)
const counters = await evaluate(presenter, `[...document.querySelectorAll('aside dd')].map(d => d.innerText).join(' / ')`)
check('presenter view reports the audience', /\d/.test(counters || ''),
  `following / off-sync / working = ${counters}`)
await shot(presenter, '11-presenter-live', 1600, 1000)
await shot(dashboard, '12-dashboard-live', 1440, 1500)

// --- The handout renders every slide ------------------------------------
const print = await openPage(browser, `${BASE}/print`, 1100, 1400)
// The handout boots one preview per slide, so give it room to settle.
await wait(9000)
check('handout lists every slide',
  (await evaluate(print, 'document.querySelectorAll("section").length')) >= 9,
  `${await evaluate(print, 'document.querySelectorAll("section").length')} section(s)`)
await shot(print, '13-handout', 1100, 1600)

console.log(results.join('\n'))
console.log(`\nscreenshots in ${OUT}`)
process.exit(results.some(r => r.startsWith('FAIL')) ? 1 : 0)
