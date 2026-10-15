#!/usr/bin/env node
/**
 * Renders the deck to a video, cut to music: `video/shots.mjs` says which slide
 * shows on which bar, this plays them in headless Chromium one frame at a time
 * and hands the frames to ffmpeg with the song underneath.
 *
 *   npm run dev                      # the deck must be running
 *   npm run render:video             # full quality: 2560×1440, 60 fps
 *   npm run render:video -- --preview          # 1280×720, 30 fps, much faster
 *   npm run render:video -- --from 40 --to 60  # only that stretch, in seconds
 *   npm run render:gifs                        # every GIF in `video/gifs.mjs`
 *   npm run render:video -- --config video/gifs.mjs --gif cat   # one of them
 *
 * A config with `gifs` has no song: each GIF is its own short shot list in
 * seconds, rendered to a lossless intermediate and then to a GIF with a palette
 * of its own (`palettegen` / `paletteuse`), which suits the deck's flat colours.
 *
 * Frames are taken on a virtual clock (`video/clock.js`), so the result is as
 * smooth as the slides are, however slow the machine is, and every cut lands
 * exactly on its beat. Chromium is started and stopped by this script.
 *
 * Environment: DECK_URL (default http://localhost:3000), CHROMIUM (default
 * `chromium`), FFMPEG (default `ffmpeg`).
 */
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.env.DECK_URL || 'http://localhost:3000'
const CHROMIUM = process.env.CHROMIUM || 'chromium'
const FFMPEG = process.env.FFMPEG || 'ffmpeg'
const PORT = 9333

const args = process.argv.slice(2)
const flag = name => args.includes(`--${name}`)
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : fallback
}

const { default: config } = await import(resolve(ROOT, option('config', 'video/shots.mjs')))
const gifName = option('gif', null)
if (gifName && !config.gifs?.[gifName]) throw new Error(`render-video — no GIF called ${gifName} (${Object.keys(config.gifs ?? {}).join(', ')})`)
const video = gifName
  ? { ...config, ...config.gifs[gifName], output: `${config.outputDir}/${gifName}.gif`, previewOutput: `${config.outputDir}/${gifName}-preview.gif` }
  : config
const gif = !!gifName
const preview = flag('preview')
const fps = preview ? 30 : video.fps
const scale = preview ? 1 : video.scale
const beat = 60 / video.bpm
const timeOf = shot => shot.at ?? video.firstBeat + shot.bar * video.beatsPerBar * beat
const shots = video.shots.map(shot => ({ ...shot, t: timeOf(shot) })).sort((a, b) => a.t - b.t)
const length = Number(option('length', video.length ?? 0)) || timeOf({ bar: video.endBar })
const from = Number(option('from', 0))
const to = Math.min(Number(option('to', length)), length)
const out = resolve(ROOT, option('out', preview ? video.previewOutput : video.output))
mkdirSync(dirname(out), { recursive: true })

const wait = ms => new Promise(r => setTimeout(r, ms))
const log = (...m) => { if (process.env.DEBUG) console.error('render-video —', ...m) }

// ---------------------------------------------------------------- Chromium

const profile = join(ROOT, 'video/.profile')
rmSync(profile, { recursive: true, force: true })
const chrome = spawn(CHROMIUM, [
  '--headless=new', '--no-sandbox', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--hide-scrollbars', '--mute-audio', '--force-color-profile=srgb', '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', 'about:blank',
], { stdio: 'ignore' })
const cleanup = () => { try { chrome.kill('SIGKILL') } catch { /* gone */ } }
process.on('exit', cleanup)
process.on('SIGINT', () => process.exit(130))

let target
for (let i = 0; i < 50 && !target; i++) {
  await wait(200)
  target = await fetch(`http://localhost:${PORT}/json/new?about:blank`, { method: 'PUT' }).then(r => r.json()).catch(() => null)
}
if (!target) throw new Error(`render-video — Chromium did not start (${CHROMIUM})`)

const ws = new WebSocket(target.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data)
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id) }
}
await new Promise(r => { ws.onopen = r })
const send = (method, params = {}) => new Promise((done, fail) => {
  const i = ++id
  pending.set(i, msg => msg.error ? fail(new Error(`${method}: ${msg.error.message}`)) : done(msg.result))
  ws.send(JSON.stringify({ id: i, method, params }))
})
const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails) throw new Error(`render-video — page: ${r.exceptionDetails.exception?.description ?? r.exceptionDetails.text}`)
  return r.result?.value
}

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setFocusEmulationEnabled', { enabled: true })
await send('Emulation.setDeviceMetricsOverride', { width: video.width, height: video.height, deviceScaleFactor: scale, mobile: false })
await send('Page.addScriptToEvaluateOnNewDocument', { source: readFileSync(join(ROOT, 'video/clock.js'), 'utf8') })
// Nothing that belongs to a live room: no pointer dots, no hints, no cursor.
await send('Page.addScriptToEvaluateOnNewDocument', { source: `
  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style')
    style.textContent = ${JSON.stringify(video.css ?? '')} + '\\n* { cursor: none !important; caret-color: transparent; }'
    document.head.appendChild(style)
  })` })

// The room's cat is real: fetched once here, so the video shows a real picture.
let cat = null
if (shots.some(s => s.cat)) {
  cat = video.pinnedCat ?? await fetch('https://api.thecatapi.com/v1/images/search?mime_types=jpg,png').then(r => r.json()).then(([c]) => c).catch(() => null)
  if (!cat) console.warn('render-video — no cat from thecatapi.com; the live slide will say it is offline')
}

const first = shots.findLast(s => s.t <= from) ?? shots[0]
const query = `peek=1&mode=stage&lang=${video.lang}`
log('opening', first.slide)
await send('Page.navigate', { url: `${BASE}/slides/${first.slide.toLowerCase()}?${query}` })
await ready()
log('loaded')
await evaluate('document.fonts.ready.then(() => true)')
log('fonts ready')
await wait(800)

// ---------------------------------------------------------------- actions

const go = slide => evaluate(`window.postMessage({ type: 'deck:peek', slideId: ${JSON.stringify(slide)} }, location.origin)`)

const key = async (name) => {
  const code = { Enter: 13, ArrowRight: 39, ArrowLeft: 37, ' ': 32 }[name] ?? name.toUpperCase().charCodeAt(0)
  for (const type of ['keyDown', 'keyUp']) {
    await send('Input.dispatchKeyEvent', { type, key: name, windowsVirtualKeyCode: code, code: name.length === 1 ? `Key${name.toUpperCase()}` : name })
  }
}

const click = selector => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return false; el.click(); return true })()`)

let spins = 0
const run = async (shot) => {
  if (shot.slide) { lastSlide = shot.slide; await go(shot.slide) }
  // Let the router swap the page before anything is asked of it.
  if (shot.slide) await window_tick(0)
  if (shot.click) {
    if (!(await click(shot.click))) console.warn(`render-video — nothing to click at ${shot.click} on ${shot.slide}`)
  }
  if (shot.key) await key(shot.key)
  if (shot.spin !== undefined) {
    spins++
    await evaluate(`window.__clock.receive(at => ({ type: 'spin', sequence: ${1000 + spins}, question: ${shot.spin}, by: ${JSON.stringify(video.spinBy ?? null)}, at }))`)
  }
  if (shot.cat) {
    await evaluate(`window.__clock.receive({ type: 'cat_pending', by: ${JSON.stringify(video.catBy ?? null)}, at: Date.now() })`)
    if (cat) pendingCat = { at: shot.t + (shot.catAfter ?? 0.6) }
  }
}
let pendingCat = null
let lastSlide = null
async function ready() {
  for (let i = 0; i < 100; i++) {
    await wait(200)
    if (await evaluate(`document.readyState === 'complete' && !!document.querySelector('#__nuxt') && window.__clock?.sockets() > 0`).catch(() => false)) return
  }
}
/**
 * One frame on the page's clock. If the page reloaded underneath (a dev server
 * does that when it optimises a dependency), pick the slide up again and go on.
 */
const window_tick = async (ms) => {
  try {
    return await evaluate(`window.__clock.tick(${ms})`)
  } catch (error) {
    if (!/collected|context|destroyed|__clock/i.test(String(error))) throw error
    console.warn(`\nrender-video — the page reloaded; picking ${lastSlide} up again`)
    await ready()
    await wait(500)
    await evaluate('window.__clock.manual()')
    if (lastSlide) await go(lastSlide)
    return evaluate('window.__clock.tick(0)')
  }
}

// ---------------------------------------------------------------- ffmpeg

const fadeOut = video.fadeOut ?? 0
const total = to - from
const vf = [
  from === 0 && video.fadeIn ? `fade=t=in:st=0:d=${video.fadeIn}` : null,
  to === length && fadeOut ? `fade=t=out:st=${(total - fadeOut).toFixed(3)}:d=${fadeOut}` : null,
  gif ? null : 'format=yuv420p',
].filter(Boolean).join(',')
const af = [
  to === length && fadeOut ? `afade=t=out:st=${(total - fadeOut).toFixed(3)}:d=${fadeOut}` : null,
].filter(Boolean).join(',')
const music = video.music ? resolve(ROOT, video.music.replace(/^~(?=\/)/, homedir())) : null
if (music && !existsSync(music)) throw new Error(`render-video — music not found: ${music}`)

// A GIF goes through a near-lossless intermediate first, so its palette is
// built from clean frames rather than from JPEG noise.
const intermediate = gif ? out.replace(/\.gif$/, '.frames.mp4') : out
const ff = spawn(FFMPEG, [
  '-y', '-loglevel', process.env.DEBUG ? 'info' : 'error',
  '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
  ...(music ? ['-ss', String(from), '-t', String(total), '-i', music, '-map', '0:v', '-map', '1:a'] : []),
  ...(vf ? ['-vf', vf] : []),
  ...(music && af ? ['-af', af] : []),
  ...(gif
    ? ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '8', '-pix_fmt', 'yuv444p']
    : ['-c:v', 'libx264', '-preset', preview ? 'veryfast' : 'slow', '-crf', preview ? '23' : '16']),
  '-r', String(fps),
  ...(music ? ['-c:a', 'aac', '-b:a', '256k', '-shortest'] : []),
  '-movflags', '+faststart', intermediate,
], { stdio: ['pipe', 'inherit', 'inherit'] })
const ffDone = new Promise((done, fail) => ff.on('close', code => code === 0 ? done() : fail(new Error(`ffmpeg exited ${code}`))))

const write = buf => new Promise(r => { if (ff.stdin.write(buf)) r(); else ff.stdin.once('drain', r) })

// ---------------------------------------------------------------- render

await evaluate('window.__clock.manual()')
log('clock is manual')
const frameCount = Math.round(total * fps)
const startedAt = Date.now()
let index = shots.indexOf(first)
await run(first)
index++
let speed = first.speed ?? 1

for (let f = 0; f < frameCount; f++) {
  const t = from + f / fps
  while (index < shots.length && shots[index].t <= t + 1e-6) {
    const shot = shots[index++]
    await run(shot)
    if (shot.slide || shot.speed !== undefined) speed = shot.speed ?? 1
  }
  if (pendingCat && t >= pendingCat.at) {
    const c = cat
    await evaluate(`window.__clock.receive(at => ({ type: 'cat', id: ${JSON.stringify(c.id)}, url: ${JSON.stringify(c.url)}, by: ${JSON.stringify(video.catBy ?? null)}, at, count: 1, failed: false }))`)
    pendingCat = null
  }
  await window_tick(f === 0 ? 0 : (1000 / fps) * speed)
  // A picture still on its way from the network holds the clock, not the video.
  for (let i = 0; i < 50 && !(await evaluate('[...document.images].every(i => i.complete)')); i++) await wait(100)
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: preview ? 85 : 95, optimizeForSpeed: true })
  await write(Buffer.from(shot.data, 'base64'))

  if (f % fps === 0) {
    const done = (f + 1) / frameCount
    const eta = ((Date.now() - startedAt) / done - (Date.now() - startedAt)) / 1000
    process.stdout.write(`\rrender-video — ${t.toFixed(1)}s / ${to.toFixed(1)}s  (${(done * 100).toFixed(0)}%, ~${Math.round(eta / 60)} min left)   `)
  }
}

ff.stdin.end()
await ffDone

if (gif) {
  const width = preview ? Math.min(video.gifWidth, 800) : video.gifWidth
  const toGif = spawn(FFMPEG, [
    '-y', '-loglevel', 'error', '-i', intermediate,
    '-vf', `scale=${width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=256:stats_mode=full[p];[b][p]paletteuse=dither=sierra2_4a:diff_mode=rectangle`,
    '-loop', '0', out,
  ], { stdio: 'inherit' })
  await new Promise((done, fail) => toGif.on('close', code => code === 0 ? done() : fail(new Error(`ffmpeg (gif) exited ${code}`))))
  rmSync(intermediate, { force: true })
}
console.log(`\nrender-video — wrote ${out}`)
cleanup()
rmSync(profile, { recursive: true, force: true })
process.exit(0)
