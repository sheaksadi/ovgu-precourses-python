<script setup lang="ts">
/**
 * Icebreaker question reel. Auto-imported as `<IntroSpinner />`.
 *
 * A slot-machine reel rather than a wheel, because the questions are whole
 * sentences and a wheel slice cannot hold one. Spinning draws from a shuffle
 * bag, so no question comes up twice until every one has been asked. The reel
 * eases out over about four seconds, overshoots a hair and settles.
 *
 * Sound is synthesised with Web Audio, nothing is downloaded: a tick each time
 * a card passes the window, brighter while the reel races and softer as it
 * slows, then a two-note chime on landing. A mute button remembers its setting.
 *
 * Click the reel, the button, or press Enter. Reduced motion lands at once.
 * Each screen spins on its own; nothing is sent to the room.
 *
 * Questions and labels come from `intro.*` in `locales/`.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t, tm } = useI18n()

const questions = computed(() => tm<string[]>('intro.questions'))
const count = computed(() => questions.value.length)

type Phase = 'idle' | 'spinning' | 'landed'

/** Reel slot → question index. Shuffled on the client, so SSR stays stable. */
const order = ref<number[]>([])
/** Reel position in rows. A whole number when the reel is at rest. */
const position = ref(0)
/** Rows per second, for the motion blur and the tick. */
const velocity = ref(0)
const phase = ref<Phase>('idle')
const muted = ref(false)

const DURATION = 4200
const LOOPS = 3
const OVERSHOOT = 0.18
const MUTE_KEY = 'deck-spinner-muted'

let bag: number[] = []
let lastQuestion = -1
let frame = 0

const mod = (value: number, n: number) => ((value % n) + n) % n
const range = (n: number) => Array.from({ length: n }, (_, i) => i)
const shuffle = (list: number[]) => {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

const easeOutQuart = (x: number) => 1 - (1 - x) ** 4
const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2

/* ─── Sound ──────────────────────────────────────────────────────────── */
let audio: AudioContext | null = null

const primeAudio = () => {
  if (muted.value) return
  try {
    audio ??= new (window.AudioContext || (window as any).webkitAudioContext)()
    if (audio.state === 'suspended') audio.resume()
  } catch {
    audio = null
  }
}

const blip = (frequency: number, peak: number, length: number, type: OscillatorType, delay = 0) => {
  if (muted.value || !audio) return
  const at = audio.currentTime + delay
  const oscillator = audio.createOscillator()
  const gain = audio.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, at)
  gain.gain.setValueAtTime(0.0001, at)
  gain.gain.exponentialRampToValueAtTime(peak, at + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length)
  oscillator.connect(gain).connect(audio.destination)
  oscillator.start(at)
  oscillator.stop(at + length + 0.02)
}

/** Bright and quick while the reel races, lower and softer as it slows. */
const tick = (speed: number) => {
  const pace = Math.min(1, speed / 40)
  blip(900 + pace * 700, 0.02 + pace * 0.025, 0.045, 'triangle')
}

/** Two soft notes a fifth apart. */
const chime = () => {
  blip(784, 0.06, 0.9, 'sine')
  blip(1175, 0.045, 1.1, 'sine', 0.09)
}

const toggleMute = () => {
  muted.value = !muted.value
  try { localStorage.setItem(MUTE_KEY, muted.value ? '1' : '0') } catch { /* private mode */ }
  if (!muted.value) primeAudio()
}

/* ─── Reel ───────────────────────────────────────────────────────────── */
const nextQuestion = () => {
  if (!bag.length) {
    bag = shuffle(range(count.value))
    // A fresh bag never opens with the question that just closed the last one.
    const last = bag.length - 1
    if (last > 0 && bag[last] === lastQuestion) [bag[0], bag[last]] = [bag[last]!, bag[0]!]
  }
  lastQuestion = bag.pop()!
  return lastQuestion
}

const land = () => {
  velocity.value = 0
  phase.value = 'landed'
  chime()
}

const spin = () => {
  if (phase.value === 'spinning' || !order.value.length) return
  const n = count.value
  const slot = order.value.indexOf(nextQuestion())
  const start = position.value
  const from = Math.round(start)
  const end = from + LOOPS * n + mod(slot - mod(from, n), n)

  primeAudio()
  phase.value = 'spinning'

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    position.value = end
    land()
    return
  }

  const began = performance.now()
  let lastRow = from
  let lastTick = 0
  let previous = { at: began, p: start }

  const step = (now: number) => {
    const x = Math.min(1, (now - began) / DURATION)
    const p = x < 0.86
      ? start + (end + OVERSHOOT - start) * easeOutQuart(x / 0.86)
      : end + OVERSHOOT - OVERSHOOT * easeInOutSine((x - 0.86) / 0.14)

    velocity.value = Math.abs(p - previous.p) / (Math.max(1, now - previous.at) / 1000)
    previous = { at: now, p }
    position.value = p

    const row = Math.round(p)
    if (row !== lastRow) {
      lastRow = row
      // Ticks closer than 42ms blur into a buzz, so the fastest part skips some.
      if (now - lastTick > 42) {
        lastTick = now
        tick(velocity.value)
      }
    }

    if (x < 1) {
      frame = requestAnimationFrame(step)
    } else {
      position.value = end
      land()
    }
  }

  frame = requestAnimationFrame(step)
}

const current = computed(() => (order.value.length ? order.value[mod(Math.round(position.value), count.value)]! : -1))

/** Five rows around the window: enough to fill it at any position. */
const rows = computed(() => {
  const n = count.value
  if (!n || !order.value.length) return []
  const base = Math.round(position.value)
  return [-2, -1, 0, 1, 2].map((offset) => {
    const slot = base + offset
    return { slot, question: order.value[mod(slot, n)]!, offset: slot - position.value }
  })
})

const rowText = (row: { question: number, offset: number }) => {
  if (phase.value !== 'idle') return questions.value[row.question]
  // Before the first spin, nothing is given away.
  return Math.abs(row.offset) < 0.5 ? t('intro.ready') : '· · ·'
}

const rowStyle = (offset: number) => {
  const distance = Math.min(Math.abs(offset), 2.2)
  return {
    transform: `translateY(${offset * 100}%) scale(${1 - distance * 0.07})`,
    opacity: String(Math.max(0, 1 - distance * 0.55)),
  }
}

const blur = computed(() => `blur(${Math.min(5, velocity.value * 0.09).toFixed(2)}px)`)

const bubble = computed(() => t(`intro.momo.${phase.value}`))

const onKey = (event: KeyboardEvent) => {
  if (event.key !== 'Enter') return
  if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) return
  event.preventDefault()
  spin()
}

onMounted(() => {
  order.value = shuffle(range(count.value))
  try { muted.value = localStorage.getItem(MUTE_KEY) === '1' } catch { /* private mode */ }
  window.addEventListener('keydown', onKey)
})

// Both dictionaries hold the same number of questions; reshuffle if that ever changes.
watch(count, (n) => {
  if (order.value.length !== n) order.value = shuffle(range(n))
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('keydown', onKey)
  audio?.close().catch(() => {})
})
</script>

<template>
  <div class="spinner">
    <div class="spinner-momo" aria-hidden="true">
      <span :key="phase" class="spinner-bubble" :class="{ 'is-first': phase === 'idle' }">{{ bubble }}</span>
      <ArtSprite name="cat-peek" color="coral" accent="sun" :size="96" class="w-full h-full" />
    </div>

    <button type="button" class="reel" :class="`is-${phase}`" :aria-label="t('intro.spin')" @click="spin">
      <span class="reel-frame" aria-hidden="true"></span>
      <span class="reel-rows" :style="{ filter: blur }" aria-hidden="true">
        <span
          v-for="row in rows"
          :key="row.slot"
          class="reel-row"
          :class="{ 'is-center': Math.abs(row.offset) < 0.5 }"
          :style="rowStyle(row.offset)"
        >
          {{ rowText(row) }}
        </span>
      </span>
    </button>

    <p class="sr-only" aria-live="polite">{{ phase === 'landed' && current >= 0 ? questions[current] : '' }}</p>

    <div class="spinner-controls">
      <button type="button" class="spin-button" :disabled="phase === 'spinning'" @click="spin">
        <Icon name="lucide:refresh-cw" class="spin-icon" :class="{ 'is-spinning': phase === 'spinning' }" />
        {{ phase === 'landed' ? t('intro.spinAgain') : t('intro.spin') }}
      </button>
      <span class="spin-hint">{{ t('intro.hint') }}</span>
      <button
        type="button"
        class="sound-button"
        :aria-pressed="!muted"
        :aria-label="muted ? t('intro.soundOff') : t('intro.soundOn')"
        :title="muted ? t('intro.soundOff') : t('intro.soundOn')"
        @click="toggleMute"
      >
        <Icon v-if="muted" name="lucide:volume-x" />
        <Icon v-else name="lucide:volume-2" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.spinner {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2.4vh;
}

/* ─── Momo and her bubble ────────────────────────────────────────────── */
.spinner-momo {
  position: absolute;
  top: -9.4vh;
  right: 4vh;
  width: 10.5vh;
  height: 10.5vh;
  z-index: 3;
  pointer-events: none;
}

.spinner-bubble {
  position: absolute;
  bottom: calc(100% - 0.4vh);
  right: 30%;
  padding: 0.7vh 1.3vh;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.7rem, 1.55vh, 1.05rem);
  font-weight: 800;
  line-height: 1.2;
  color: var(--text);
  white-space: nowrap;
  transform-origin: 85% 120%;
  animation: bubble-pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}
/* The first bubble waits for the slide to land; later ones answer the click at once. */
.spinner-bubble.is-first {
  animation-delay: 0.45s;
}
.spinner-bubble::after {
  content: '';
  position: absolute;
  right: 1.4vh;
  bottom: calc(-0.6vh - 1px);
  width: 1.1vh;
  height: 1.1vh;
  background: var(--bg);
  border-right: 2px solid var(--text);
  border-bottom: 2px solid var(--text);
  transform: rotate(45deg);
}

/* ─── Reel ───────────────────────────────────────────────────────────── */
.reel {
  position: relative;
  display: block;
  width: 100%;
  height: 42vh;
  overflow: hidden;
  border-radius: 2.6vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
  cursor: pointer;
}

/* Rows fade out towards the top and bottom edges. */
.reel::before,
.reel::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 12vh;
  z-index: 2;
  pointer-events: none;
}
.reel::before {
  top: 0;
  background: linear-gradient(var(--bg-off), transparent);
}
.reel::after {
  bottom: 0;
  background: linear-gradient(transparent, var(--bg-off));
}

.reel-frame {
  position: absolute;
  left: 2.2vh;
  right: 2.2vh;
  top: 50%;
  height: 14vh;
  translate: 0 -50%;
  border-radius: 1.8vh;
  background: var(--bg);
  border: 2px solid var(--text);
  z-index: 1;
  transition: border-color 0.3s ease;
}
.reel.is-landed .reel-frame {
  border-color: var(--coral);
  animation: frame-land 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.reel-rows {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.reel-row {
  position: absolute;
  left: 5vh;
  right: 5vh;
  top: 50%;
  height: 14vh;
  margin-top: -7vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: clamp(1rem, 2.9vh, 2.1rem);
  font-weight: 700;
  line-height: 1.25;
  color: var(--text-dim);
  will-change: transform;
}
.reel-row.is-center {
  font-weight: 800;
  color: var(--text);
}

/* ─── Controls ───────────────────────────────────────────────────────── */
.spinner-controls {
  display: flex;
  align-items: center;
  gap: 1.6vh;
}

.spin-button {
  display: inline-flex;
  align-items: center;
  gap: 1vh;
  padding: 1.2vh 2.4vh;
  border-radius: 1.4vh;
  background: var(--coral);
  border: 2px solid var(--coral);
  font-size: clamp(0.85rem, 2vh, 1.35rem);
  font-weight: 800;
  color: #FFFFFF;
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.spin-button:disabled {
  opacity: 0.5;
  cursor: default;
}

.spin-icon.is-spinning {
  animation: turn 0.6s linear infinite;
}

.spin-hint {
  font-size: clamp(0.7rem, 1.5vh, 1rem);
  font-weight: 600;
  color: var(--text-muted);
}

.sound-button {
  margin-left: auto;
  display: grid;
  place-items: center;
  width: 5vh;
  height: 5vh;
  border-radius: 999px;
  border: 2px solid var(--border);
  font-size: clamp(0.9rem, 2.2vh, 1.4rem);
  color: var(--text-dim);
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}
.sound-button:hover {
  border-color: var(--text);
  color: var(--text);
}

@keyframes bubble-pop {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes frame-land {
  0% { transform: scale(1); }
  45% { transform: scale(1.025); }
  100% { transform: scale(1); }
}
@keyframes turn {
  to { transform: rotate(360deg); }
}
</style>
