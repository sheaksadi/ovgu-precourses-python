/**
 * The page's clock, taken over so a recording can step it one frame at a time.
 *
 * Injected before any of the deck's own scripts by `scripts/render-video.mjs`.
 * Until `__clock.manual()` is called the page runs in real time; after that time
 * only moves when the renderer calls `__clock.tick(ms)`, so every frame of the
 * video is exactly `1000 / fps` ms after the one before, however long the
 * screenshot in between took. Nothing stutters, and a 2× shot is simply a tick
 * twice as long.
 *
 * What it steers:
 *
 *   - `Date.now`, `new Date()` and `performance.now`
 *   - `setTimeout`, `setInterval`, `requestAnimationFrame` and their cancels
 *   - every CSS animation, CSS transition and Web Animation on the page: each
 *     is paused and seeked to the virtual time since it first appeared, and
 *     finished properly once it has run out, so `animationend` and
 *     `transitionend` still fire and Vue's `<Transition>` still completes
 *
 * It also keeps every WebSocket the page opens, so the renderer can play a room
 * event (a spin, a cat) into the page without a real device asking for it.
 */
(() => {
  if (window.__clock) return

  const realSetTimeout = window.setTimeout.bind(window)
  const realClearTimeout = window.clearTimeout.bind(window)
  const realRaf = window.requestAnimationFrame.bind(window)
  const realPerfNow = performance.now.bind(performance)
  const RealDate = Date

  const perfBase = realPerfNow()
  const dateBase = RealDate.now()
  /** Virtual milliseconds since the page started. */
  let vt = 0
  let manual = false

  performance.now = () => perfBase + vt
  const now = () => dateBase + vt

  class VirtualDate extends RealDate {
    constructor(...args) {
      if (args.length === 0) super(now())
      else super(...args)
    }
    static now() { return now() }
  }
  window.Date = VirtualDate

  // Timers, ordered by when they are due, then by when they were set.
  let nextId = 1
  let seq = 0
  const timers = new Map()
  const addTimer = (fn, ms, args, repeat) => {
    const id = nextId++
    const delay = Math.max(0, Number(ms) || 0)
    timers.set(id, { fn, args, at: vt + delay, seq: seq++, every: repeat ? Math.max(1, delay) : 0 })
    return id
  }
  window.setTimeout = (fn, ms, ...args) => addTimer(fn, ms, args, false)
  window.setInterval = (fn, ms, ...args) => addTimer(fn, ms, args, true)
  window.clearTimeout = (id) => { timers.delete(id) }
  window.clearInterval = (id) => { timers.delete(id) }

  let frames = new Map()
  window.requestAnimationFrame = (fn) => { const id = nextId++; frames.set(id, fn); return id }
  window.cancelAnimationFrame = (id) => { frames.delete(id) }

  const call = (fn, args) => {
    try {
      if (typeof fn === 'function') fn(...args)
      else (0, eval)(String(fn))
    } catch (error) {
      console.error(error)
    }
  }

  /** Let promises, Vue's nextTick and pending renders settle between timers. */
  const channel = new MessageChannel()
  let wake = null
  channel.port1.onmessage = () => { const w = wake; wake = null; w?.() }
  const settle = () => new Promise((resolve) => { wake = resolve; channel.port2.postMessage(0) })

  // Animations: the time each one first appeared, on the virtual clock.
  const started = new WeakMap()
  const done = new WeakSet()

  const seekAnimations = () => {
    for (const anim of document.getAnimations()) {
      if (done.has(anim)) continue
      if (anim.playState === 'finished' && started.has(anim)) { done.add(anim); continue }
      if (!started.has(anim)) {
        const current = Number(anim.currentTime) || 0
        started.set(anim, vt - current / (anim.playbackRate || 1))
      }
      const at = (vt - started.get(anim)) * (anim.playbackRate || 1)
      const end = anim.effect?.getComputedTiming().endTime
      if (Number.isFinite(end) && at >= end) {
        try { anim.finish() } catch { /* already gone */ }
        done.add(anim)
        continue
      }
      if (anim.playState !== 'paused') anim.pause()
      anim.currentTime = Math.max(0, at)
    }
  }

  const runFrames = () => {
    const due = frames
    frames = new Map()
    for (const fn of due.values()) call(fn, [perfBase + vt])
  }

  /** Move the clock on by `ms`, firing everything that falls inside it, in order. */
  const advance = async (ms) => {
    const target = vt + ms
    for (;;) {
      let next = null
      for (const [id, timer] of timers) {
        if (timer.at > target) continue
        if (!next || timer.at < next[1].at || (timer.at === next[1].at && timer.seq < next[1].seq)) next = [id, timer]
      }
      if (!next) break
      const [id, timer] = next
      vt = Math.max(vt, timer.at)
      if (timer.every) { timer.at += timer.every; timer.seq = seq++ }
      else timers.delete(id)
      call(timer.fn, timer.args)
      await settle()
    }
    vt = target
    runFrames()
    await settle()
    runFrames()
    await settle()
  }

  // Real time until the renderer takes over.
  let last = realPerfNow()
  const realLoop = async () => {
    if (manual) return
    const t = realPerfNow()
    await advance(t - last)
    last = t
    realRaf(realLoop)
  }
  realRaf(realLoop)
  // A hidden page gets no frames; keep its timers moving anyway.
  const fallback = () => { if (manual) return; realSetTimeout(fallback, 50) }
  realSetTimeout(fallback, 50)

  // WebSockets the page opens, so a room event can be played into it.
  const sockets = []
  const RealWebSocket = window.WebSocket
  window.WebSocket = class extends RealWebSocket {
    constructor(...args) {
      super(...args)
      sockets.push(this)
    }
  }

  window.__clock = {
    now: () => vt,
    manual: () => {
      manual = true
      for (const anim of document.getAnimations()) {
        started.set(anim, vt - (Number(anim.currentTime) || 0) / (anim.playbackRate || 1))
      }
      seekAnimations()
    },
    /** One frame: advance, then put every animation where it belongs. */
    tick: async (ms) => {
      await advance(ms)
      seekAnimations()
      await settle()
      // A timer may have started new animations; place those too.
      seekAnimations()
    },
    /** Play a server message into the page, as if the room had sent it. */
    receive: (message) => {
      const data = JSON.stringify(typeof message === 'function' ? message(now()) : message)
      for (const socket of sockets) {
        if (socket.readyState !== RealWebSocket.OPEN) continue
        socket.dispatchEvent(new MessageEvent('message', { data }))
      }
    },
    sockets: () => sockets.filter(s => s.readyState === RealWebSocket.OPEN).length,
  }
  void realClearTimeout
})()
