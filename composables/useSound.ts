/**
 * The room's sound layer: four cues, all synthesised.
 *
 *   const sound = useSound()
 *   sound.move(true)   // the deck moved on
 *   sound.land()       // something the room asked for arrived
 *   sound.note()       // a notification came up
 *   sound.press()      // a person pressed something on this screen
 *
 * Ported from the same layer as the portfolio site, kept to one palette. There
 * are no audio files: every cue is a dulled sine with a few milliseconds of
 * filtered noise on the attack, so it costs nothing to ship and cannot be late.
 *
 * What holds:
 *
 *   one pitch family, `ROOT` and its neighbours. Direction is carried by the
 *   filter — going forward is a little brighter than going back — never by an
 *   interval, because a cue that transposes itself is a melody
 *
 *   one movement, one cue, played as it starts
 *
 *   nothing reaches 80ms, and nothing repeats faster than `GAP_MS`
 *
 * Only the projector makes a sound. Thirty phones answering a slide change at
 * once is a rattle, not feedback, and the room has one set of speakers — the
 * ones on the machine driving the big screen. `m` mutes and unmutes it there,
 * and the choice is remembered per device.
 *
 * Browsers refuse to start an AudioContext before a real gesture, so the
 * context is created lazily and resumed on the first pointer or key event. The
 * first cue after a reload may therefore be silent; the rest are not.
 */
import { computed } from 'vue'
import { useState } from '#app'
import { storageKey, useDeckRole } from '~/composables/useDeckRole'

/** Master volume. Every cue's own gain is a fraction of this. */
const MASTER = 0.3

/** The one pitch everything is built from. Low and dull rather than digital. */
const ROOT = 500

/** The shortest gap between two cues, so a held arrow key does not rattle. */
const GAP_MS = 55

/** Length of the noise the transient half of a cue is excited with. */
const NOISE_SEC = 1

/**
 * The palette: a tone with a hint of edge on the attack. One of the five the
 * portfolio compares; this deck does not need the other four.
 */
const RECIPE = { tone: 0.95, sub: 0.35, noise: 0.16, attack: 0.002, hold: 0.9, bright: 1.1, q: 2.5 }

let ctx: AudioContext | undefined
let master: GainNode | undefined
let noiseBuf: AudioBuffer | undefined
let lastCue = 0
let wired = false

interface Cue {
  /** the pitched half */
  freq: number
  gain: number
  dur: number
  cutoff: number
  /** the noisy half */
  centre: number
  noise: number
  burst: number
  hp?: number
  /** the weight underneath */
  sub?: { freq: number, gain: number, dur: number }
}

function ensure(): AudioContext | undefined {
  if (ctx) return ctx
  const AC: typeof AudioContext | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return undefined
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = MASTER
  master.connect(ctx.destination)
  return ctx
}

function resume() {
  const c = ensure()
  if (c && c.state === 'suspended') void c.resume()
}

/** White noise, built the first time a cue asks for its transient. */
function ensureNoise(c: AudioContext) {
  if (noiseBuf) return noiseBuf
  const len = Math.floor(c.sampleRate * NOISE_SEC)
  noiseBuf = c.createBuffer(1, len, c.sampleRate)
  const data = noiseBuf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  return noiseBuf
}

/**
 * One pitched voice: a sine, dulled, gone exponentially.
 *
 * The lowpass is doing more than it looks. A bare sine has nothing to filter,
 * but the envelope's own attack puts a click's worth of energy across the whole
 * spectrum, and this is what takes the edge off it.
 */
function tone(freq: number, gain: number, dur: number, cutoff: number, attack: number) {
  const c = ensure()
  if (!c || !master || gain <= 0) return
  const t0 = c.currentTime

  const osc = c.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = freq

  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = cutoff

  const g = c.createGain()
  if (attack > 0) {
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.linearRampToValueAtTime(gain, t0 + attack)
  } else {
    g.gain.setValueAtTime(gain, t0)
  }
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + dur)

  osc.connect(lp).connect(g).connect(master)
  osc.start(t0)
  osc.stop(t0 + attack + dur + 0.02)
}

/** One transient: a burst of noise excites a resonance and is gone. */
function transient(centre: number, gain: number, dur: number, q: number, hp: number) {
  const c = ensure()
  if (!c || !master || gain <= 0) return
  const buf = ensureNoise(c)
  const t0 = c.currentTime

  const high = c.createBiquadFilter()
  high.type = 'highpass'
  high.frequency.value = hp

  const band = c.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = centre
  band.Q.value = q

  const g = c.createGain()
  // No attack: a transient that fades in is not a transient.
  g.gain.setValueAtTime(gain, t0)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)

  const src = c.createBufferSource()
  src.buffer = buf
  src.connect(high).connect(band).connect(g).connect(master)
  // From a random point, so repeated transients do not comb-filter.
  src.start(t0, Math.random() * (NOISE_SEC - 0.1), dur + 0.01)
}

export function useSound() {
  const { isProjector } = useDeckRole()
  const muted = useState<boolean>('deck-sound-muted', () => false)

  const audible = computed(() => isProjector.value && !muted.value)

  const setMuted = (next: boolean) => {
    muted.value = next
    try {
      localStorage.setItem(storageKey('sound'), next ? 'off' : 'on')
    } catch {
      // A device with blocked storage still works, it just forgets the choice.
    }
  }

  /** Mix one cue. Silent off the projector, muted, or inside the repeat gap. */
  function fire(cue: Cue, trim = 1) {
    if (import.meta.server || !audible.value) return
    const now = performance.now()
    if (now - lastCue < GAP_MS) return
    lastCue = now

    tone(cue.freq, cue.gain * RECIPE.tone * trim, cue.dur * RECIPE.hold, cue.cutoff * RECIPE.bright, RECIPE.attack)
    if (cue.sub) tone(cue.sub.freq, cue.sub.gain * RECIPE.sub * trim, cue.sub.dur, 600, Math.max(RECIPE.attack, 0.002))
    transient(cue.centre, cue.noise * RECIPE.noise * trim, cue.burst, RECIPE.q, cue.hp ?? 700)
  }

  /** The deck moves. Forward is the less dulled of the two directions. */
  const move = (forward = true) => fire({
    freq: ROOT,
    gain: 0.038,
    dur: 0.045,
    cutoff: forward ? 1400 : 1000,
    centre: forward ? 2600 : 2150,
    // The lower centre passes less through the same filters, so it starts higher.
    noise: forward ? 0.48 : 0.65,
    burst: 0.016,
    sub: { freq: forward ? 205 : 185, gain: 0.048, dur: 0.04 },
  })

  /** Something the room asked for arrived: a spin lands, a cat comes back. */
  const land = () => fire({
    freq: ROOT * 1.05,
    gain: 0.05,
    dur: 0.055,
    cutoff: 1300,
    centre: 2200,
    noise: 0.32,
    burst: 0.02,
    sub: { freq: 190, gain: 0.05, dur: 0.055 },
  })

  /** A notification came up. The quietest thing in the room. */
  const note = () => fire({
    freq: ROOT * 1.5,
    gain: 0.028,
    dur: 0.03,
    cutoff: 1900,
    centre: 3000,
    noise: 0.3,
    burst: 0.014,
  })

  /** Somebody pressed something on this screen. */
  const press = () => fire({
    freq: ROOT * 1.12,
    gain: 0.049,
    dur: 0.055,
    cutoff: 1600,
    centre: 2400,
    noise: 0.5,
    burst: 0.024,
    sub: { freq: 195, gain: 0.062, dur: 0.055 },
  })

  /**
   * Read the stored choice and arm the gesture that starts the audio. Runs once
   * per client, however many places call this composable.
   */
  function hydrate() {
    if (wired || import.meta.server) return
    wired = true
    try {
      muted.value = localStorage.getItem(storageKey('sound')) === 'off'
    } catch {
      muted.value = false
    }
    const unlock = () => resume()
    window.addEventListener('pointerdown', unlock, { once: true, passive: true })
    window.addEventListener('keydown', unlock, { once: true })
  }

  return {
    /** The screen that has the room's speakers, muted or not. */
    onProjector: isProjector,
    audible,
    muted: computed(() => muted.value),
    setMuted,
    hydrate,
    move,
    land,
    note,
    press,
  }
}
