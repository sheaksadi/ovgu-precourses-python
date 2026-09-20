#!/usr/bin/env node
/**
 * Walks the whole deck at phone size and reports what does not fit.
 *
 * Half the room follows the slides on their own phone, so a slide that only
 * works on a projector only works for half the room. For each slide this
 * measures, inside the slide itself:
 *
 *   out     pixels an element sticks out past the left or right edge
 *           (decorations marked `aria-hidden` are allowed to bleed)
 *   under   pixels the content runs past the bottom
 *   tiny    pieces of text drawn below 11px, which is where reading stops
 *
 * Neither `out` nor `under` is counted when something on the way up can scroll
 * that way: a lesson that stacks into one scrolling column is fine, and so is a
 * long code line inside a panel that scrolls sideways. A fixed slide that simply
 * cuts its takeaway off is not.
 *
 * Prerequisites: the app is running, and Chromium is reachable. Usage:
 *
 *   npm run dev
 *   chromium --headless=new --no-sandbox --remote-debugging-port=9222 \
 *     --user-data-dir=/tmp/deck-profile about:blank &
 *   npm run check:phone                 # every slide
 *   npm run check:phone -- pre-0041 …   # only these
 *
 * Environment: DECK_URL, CDP_URL, W and H (default 390 x 844), WAIT, and
 * OUT_JSON to write the full table somewhere.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.env.DECK_URL || 'http://localhost:3000'
const CDP = process.env.CDP_URL || 'http://localhost:9222'
const W = Number(process.env.W || 390)
const H = Number(process.env.H || 844)
const WAIT = Number(process.env.WAIT || 1200)

/** Slide ids in presentation order, read from the source of truth. */
const config = readFileSync(join(root, 'slides.config.ts'), 'utf8')
const body = config.split('// <slides:start>')[1].split('// <slides:end>')[0]
const entries = [...body.matchAll(/\{[\s\S]*?\n {2}\},/g)].map(m => m[0])
const pick = (text, key) => {
  const match = text.match(new RegExp(`${key}: (['"\`])((?:(?!\\1).)*)\\1`))
  return match ? match[2] : undefined
}

const slides = entries.map(entry => ({
  id: pick(entry, 'id'),
  parent: pick(entry, 'parent'),
  route: pick(entry, 'route') || `/slides/${pick(entry, 'id').toLowerCase()}`,
  hidden: /hidden: true/.test(entry),
})).filter(slide => !slide.hidden)

// Page labels, the numbers the deck itself draws.
const mainNumbers = new Map()
const subCounters = new Map()
for (const slide of slides) if (!slide.parent) mainNumbers.set(slide.id, mainNumbers.size + 1)
for (const slide of slides) {
  if (!slide.parent) { slide.label = String(mainNumbers.get(slide.id)); continue }
  const n = (subCounters.get(slide.parent) || 0) + 1
  subCounters.set(slide.parent, n)
  slide.label = `${mainNumbers.get(slide.parent)}.${n}`
}

const only = process.argv.slice(2).map(value => value.toLowerCase().replace('/slides/', ''))
const wanted = only.length ? slides.filter(s => only.includes(s.id.toLowerCase())) : slides

const version = await fetch(`${CDP}/json/version`).catch(() => null)
if (!version?.ok) {
  console.error(`check:phone — no Chromium on ${CDP}. See the header of this file for the launch command.`)
  process.exit(1)
}

const wait = ms => new Promise(r => setTimeout(r, ms))
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
/**
 * One slide that never answers must not take the sweep with it: a page busy in
 * a loop, or a tab that died, simply reports as not measured.
 */
const EVAL_TIMEOUT = 8000
const evaluate = async (expression) => {
  const answer = await Promise.race([
    send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }),
    wait(EVAL_TIMEOUT).then(() => null),
  ])
  return answer?.result?.value
}

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setFocusEmulationEnabled', { enabled: true })
await send('Page.setWebLifecycleState', { state: 'active' })
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: true })

const MEASURE = `(() => {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const slide = document.querySelector('main') || document.body
  const scrolls = (el, axis) => {
    const over = axis === 'x' ? 'overflowX' : 'overflowY'
    for (let node = el; node && node !== document.body; node = node.parentElement) {
      const style = getComputedStyle(node)
      const room = axis === 'x'
        ? node.scrollWidth > node.clientWidth + 2
        : node.scrollHeight > node.clientHeight + 2
      if (/auto|scroll/.test(style[over]) && room) return true
    }
    return false
  }
  const out = { out: 0, under: 0, tiny: 0, worst: '', lowest: '' }
  for (const el of slide.querySelectorAll('*')) {
    // The chrome the layouts draw on top is not the slide's business.
    if (el.closest('.sync-pill, .replay, .dock, .lang-pill, [data-debug-bar]')) continue
    // Nor is a decoration that is meant to bleed off the edge: a wash behind
    // the words, a dot field. They are hidden from a reader by definition.
    if (el.closest('[aria-hidden="true"]')) continue
    const box = el.getBoundingClientRect()
    if (box.width < 1 || box.height < 1) continue
    const past = Math.max(0, Math.round(box.right - vw), Math.round(-box.left))
    if (past > out.out && !scrolls(el, 'x')) {
      out.out = past
      out.worst = (typeof el.className === 'string' ? el.className : el.tagName).slice(0, 44)
    }
    const below = Math.round(box.bottom - vh)
    if (below > out.under && !scrolls(el, 'y')) {
      out.under = below
      out.lowest = (typeof el.className === 'string' ? el.className : el.tagName).slice(0, 44)
    }
    // 10.95, not 11: a clamp that lands exactly on the floor rounds to 10.999.
    if (!el.children.length && el.textContent.trim() && parseFloat(getComputedStyle(el).fontSize) < 10.95) out.tiny++
  }
  return JSON.stringify(out)
})()`

const rows = []
let bad = 0
for (const slide of wanted) {
  await send('Page.navigate', { url: BASE + slide.route })
  await wait(WAIT)
  let measured = { out: -1, under: -1, tiny: -1, worst: 'not measured', lowest: '' }
  try {
    const raw = await evaluate(MEASURE)
    if (raw) measured = JSON.parse(raw)
  }
  catch { /* left as not measured */ }
  const row = { ...slide, ...measured }
  rows.push(row)
  const wrong = row.out > 4 || row.under > 4 || row.tiny > 0
  if (wrong) {
    bad++
    console.log(
      `FAIL  ${row.label.padEnd(6)} ${row.id}  out:${String(row.out).padStart(4)}`
      + `  under:${String(row.under).padStart(4)}  tiny:${String(row.tiny).padStart(3)}`
      + `  ${row.worst || row.lowest}`,
    )
  }
}

if (process.env.OUT_JSON) writeFileSync(process.env.OUT_JSON, JSON.stringify(rows, null, 2))

console.log(`\ncheck:phone — ${rows.length - bad}/${rows.length} slides fit ${W}x${H}`)
await fetch(`${CDP}/json/close/${target.id}`)
ws.close()
process.exit(bad ? 1 : 0)
