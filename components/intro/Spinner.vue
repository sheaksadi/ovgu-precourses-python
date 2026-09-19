<script setup lang="ts">
/**
 * Icebreaker question reel. Auto-imported as `<IntroSpinner />`.
 *
 * A slot-machine reel rather than a wheel, because the questions are whole
 * sentences and a wheel slice cannot hold one. The reel eases out over about
 * four seconds, overshoots a hair and settles.
 *
 * The room spins together. Whoever's turn it is taps Spin on their own
 * follow-along device; the server draws the question from one shuffle bag for
 * the whole room (`server/utils/spinRoom.ts`), so no question comes up twice
 * until every one has been asked, and every screen plays the same spin. The
 * presenter view and the remote spin for someone without a phone.
 *
 * Who sees what:
 *   - a follow-along device: the Spin button, Enter, and a tappable reel
 *   - the projector (`?screen=projector`, set by the start page) and the peek
 *     frames in the presenter view: no buttons at all; who is spinning, who
 *     spun, and who spun before. Sound is toggled with the `m` key there, and a
 *     spin raises a notification like any other room event.
 *
 * Sound is synthesised with Web Audio, nothing is downloaded: a tick each time
 * a card passes the window, brighter while the reel races and softer as it
 * slows, then a two-note chime on landing. A mute button remembers its setting.
 * Reduced motion lands at once.
 *
 * Questions and labels come from `intro.*` in `locales/`.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useDeckRole } from '~/composables/useDeckRole'
import { useWebSocket } from '~/composables/useWebSocket'
import { useSpins, type SpinRecord } from '~/composables/useSpins'
import { avatarFor } from '~/utils/cuteNames'
import type { SpriteName } from '~/utils/sprites'

const { t, tm } = useI18n()
const { isViewer, isPeek, isProjector } = useDeckRole()
const ws = useWebSocket()
const spins = useSpins()

/** Only a follow-along device spins; the projector and the presenter's previews watch. */
const canSpin = computed(() => isViewer.value && !isPeek.value && !isProjector.value)

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
/** The spin the reel shows or plays. */
const shown = ref<SpinRecord | null>(null)

const DURATION = 4200
const LOOPS = 3
const OVERSHOOT = 0.18
const MUTE_KEY = 'deck-spinner-muted'

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

/** Browsers only start audio after a tap or key, so every screen primes on its first one. */
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
/**
 * Who spun is news, not a label: it holds while the room reads the toast, then
 * clears so the line says again that the next person may spin. The question
 * itself stays on the reel — that is what the group is talking about.
 */
const CREDIT_MS = 6000
const credited = ref(true)
let creditTimer: ReturnType<typeof setTimeout> | undefined

const holdCredit = () => {
  credited.value = true
  clearTimeout(creditTimer)
  creditTimer = setTimeout(() => { credited.value = false }, CREDIT_MS)
}

const land = () => {
  velocity.value = 0
  phase.value = 'landed'
  chime()
  holdCredit()
}

/** Play a spin the room drew. A newer spin takes over from wherever the reel is. */
const play = (record: SpinRecord) => {
  if (!order.value.length) return
  cancelAnimationFrame(frame)
  shown.value = record

  const n = count.value
  const slot = order.value.indexOf(mod(record.question, n))
  const start = position.value
  const from = Math.round(start)
  const end = from + LOOPS * n + mod(slot - mod(from, n), n)

  phase.value = 'spinning'
  credited.value = true
  clearTimeout(creditTimer)

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

/* ─── Asking for a spin ──────────────────────────────────────────────── */
const busyNote = ref(false)
let busyTimer: ReturnType<typeof setTimeout> | undefined

const showBusy = () => {
  busyNote.value = true
  clearTimeout(busyTimer)
  busyTimer = setTimeout(() => { busyNote.value = false }, 2200)
}

const request = () => {
  if (!canSpin.value) return
  primeAudio()
  if (phase.value === 'spinning' || spins.isBusy()) {
    showBusy()
    return
  }
  ws.sendSpin()
}

/* ─── What the screen says ───────────────────────────────────────────── */
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

// A screen that cannot spin does not ask to be spun.
const bubble = computed(() => (!canSpin.value && phase.value === 'idle' ? t('intro.momo.screen') : t(`intro.momo.${phase.value}`)))

const shownName = computed(() => (shown.value ? spins.nameOf(shown.value) : ''))
const avatar = computed(() => (who.value ? avatarFor(shownName.value) : null))

const who = computed(() => {
  // Nothing spun yet, or the credit has had its moment: the reel says it is
  // ready, and the line goes quiet rather than claiming someone is still up.
  if (!shown.value || (phase.value !== 'spinning' && !credited.value)) return ''
  return phase.value === 'spinning'
    ? t('intro.spinningBy', { name: shownName.value })
    : t('intro.spunBy', { name: shownName.value })
})

/**
 * Who has spun already: each person once, most recent first. Spinning twice
 * does not put a name on the list twice — the list answers "whose turn has
 * been", not "how many spins were there".
 */
/**
 * Keyed by the shown name, not by the device: the list says who has had a turn,
 * and two phones that call themselves the same thing are one turn to the room.
 */
const whoOf = (record: SpinRecord) => spins.nameOf(record).trim().toLowerCase()

const earlier = computed(() => {
  const seen = new Set<string>()
  // While the credit under the reel names them, they are not "earlier" yet.
  if (credited.value && shown.value) seen.add(whoOf(shown.value))
  const out: SpinRecord[] = []
  for (const record of spins.history.value) {
    const who = whoOf(record)
    if (seen.has(who)) continue
    seen.add(who)
    out.push(record)
    if (out.length === 6) break
  }
  return out
})

/* ─── Events ─────────────────────────────────────────────────────────── */
const onKey = (event: KeyboardEvent) => {
  if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) return
  // `m` mutes on any screen, including the projector, which carries no button.
  if (event.key === 'm' || event.key === 'M') {
    event.preventDefault()
    toggleMute()
    return
  }
  if (!canSpin.value || event.key !== 'Enter') return
  event.preventDefault()
  request()
}

const onSpin = (event: Event) => play((event as CustomEvent<SpinRecord>).detail)

/** Opened after a spin: show where the room is, without replaying it. */
const adoptLatest = (latest: SpinRecord | null) => {
  if (!latest || shown.value || phase.value !== 'idle' || !order.value.length) return
  shown.value = latest
  position.value = order.value.indexOf(mod(latest.question, count.value))
  phase.value = 'landed'
  // Late arrivals join a room that has already read the credit.
  credited.value = spins.isBusy()
  if (credited.value) holdCredit()
}

// The room's state usually arrives just after mount. A live spin sets `shown`
// before this runs, so it is never skipped.
watch(() => spins.latest.value, adoptLatest)

onMounted(() => {
  order.value = shuffle(range(count.value))
  try { muted.value = localStorage.getItem(MUTE_KEY) === '1' } catch { /* private mode */ }
  adoptLatest(spins.latest.value)

  window.addEventListener('keydown', onKey)
  window.addEventListener('deck:spin', onSpin)
  window.addEventListener('deck:spin-busy', showBusy)
  window.addEventListener('pointerdown', primeAudio, { once: true })
  window.addEventListener('keydown', primeAudio, { once: true })
})

// Both dictionaries hold the same number of questions; reshuffle if that ever changes.
watch(count, (n) => {
  if (order.value.length !== n) order.value = shuffle(range(n))
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  clearTimeout(busyTimer)
  clearTimeout(creditTimer)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('deck:spin', onSpin)
  window.removeEventListener('deck:spin-busy', showBusy)
  window.removeEventListener('pointerdown', primeAudio)
  window.removeEventListener('keydown', primeAudio)
  audio?.close().catch(() => {})
})
</script>

<template>
  <div class="spinner" :class="{ 'is-screen': !canSpin }">
    <div class="spinner-momo" aria-hidden="true">
      <span :key="phase" class="spinner-bubble" :class="{ 'is-first': phase === 'idle' }">{{ bubble }}</span>
      <ArtSprite name="cat-peek" color="coral" accent="sun" :size="96" class="w-full h-full" />
    </div>

    <button
      type="button"
      class="reel"
      :class="`is-${phase}`"
      :tabindex="canSpin ? 0 : -1"
      :aria-disabled="!canSpin"
      :aria-label="t('intro.spin')"
      @click="request"
    >
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

    <p class="sr-only" aria-live="polite">{{ phase === 'landed' && current >= 0 ? `${shownName}: ${questions[current]}` : '' }}</p>

    <div class="spinner-controls">
      <button v-if="canSpin" type="button" class="spin-button" :disabled="phase === 'spinning'" @click="request">
        <Icon name="lucide:refresh-cw" class="spin-icon" :class="{ 'is-spinning': phase === 'spinning' }" />
        <span class="text-trim">{{ phase === 'landed' ? t('intro.spinAgain') : t('intro.spin') }}</span>
      </button>

      <p class="spin-who">
        <span v-if="avatar" class="spin-avatar" :class="{ 'has-sprite': avatar.sprite }" :style="{ '--badge': `var(--${avatar.color})`, '--badge-ink': avatar.ink }" aria-hidden="true">
          <ArtSprite v-if="avatar.sprite" :name="avatar.sprite as SpriteName" :color="avatar.color" accent="sun" :size="48" class="spin-avatar-art" />
          <span v-else class="text-trim">{{ avatar.initial }}</span>
        </span>
        <span class="spin-who-text">
          <span>{{ busyNote ? t('intro.busy') : who }}</span>
          <span v-if="canSpin && !busyNote && phase !== 'spinning'" class="spin-waiting">{{ t('intro.phoneHint') }}</span>
        </span>
      </p>

      <button
        v-if="canSpin"
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

    <p v-if="!canSpin && earlier.length" class="spin-history">
      <span class="spin-history-label">{{ t('intro.history') }}</span>
      <span v-for="record in earlier" :key="`${record.sequence}-${record.at}`" class="spin-chip">
        <span class="text-trim">{{ spins.nameOf(record) }}</span>
      </span>
    </p>
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
  padding: calc(0.7vh + 0.24em) 1.3vh;
  text-box: trim-both cap alphabetic;
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
.is-screen .reel {
  cursor: default;
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
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 1vh;
  padding: calc(1.2vh + 0.25em) 2.4vh;
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

/* Who spins, who spun. */
.spin-who {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 1.2vh;
}
.spin-avatar {
  flex: none;
  display: grid;
  place-items: center;
  width: 5vh;
  height: 5vh;
  border-radius: 999px;
  background: var(--badge);
  border: 2px solid var(--text);
  font-size: clamp(0.8rem, 2vh, 1.3rem);
  font-weight: 900;
  color: var(--badge-ink, #FFFFFF);
}
.spin-avatar.has-sprite {
  background: color-mix(in srgb, var(--badge) 22%, var(--bg));
}
.spin-avatar-art {
  width: 4vh;
  height: 4vh;
}
.spin-who-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4vh;
  font-size: clamp(0.85rem, 2vh, 1.35rem);
  font-weight: 800;
  line-height: 1.2;
  color: var(--text);
}
.spin-waiting {
  font-size: 0.72em;
  font-weight: 600;
  color: var(--text-muted);
}

.sound-button {
  flex: none;
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

/* ─── Who spun before ────────────────────────────────────────────────── */
.spin-history {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8vh;
}
.spin-history-label {
  margin-right: 0.4vh;
  font-size: clamp(0.6rem, 1.3vh, 0.9rem);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.spin-chip {
  padding: calc(0.5vh + 0.2em) 1.2vh;
  border-radius: 999px;
  background: var(--bg-off);
  border: 2px solid var(--border);
  font-size: clamp(0.65rem, 1.45vh, 0.95rem);
  font-weight: 700;
  color: var(--text-dim);
}

/* A phone held upright (see pre-0038.vue): a shorter reel, rows that fit the
   width, and a Spin button a thumb can hit. */
@media (orientation: portrait) and (max-width: 760px) {
  .reel {
    height: 30vh;
  }
  .reel-frame {
    left: 1.2vh;
    right: 1.2vh;
    height: 12vh;
  }
  .reel-row {
    left: 2.4vh;
    right: 2.4vh;
    height: 12vh;
    margin-top: -6vh;
    font-size: clamp(0.95rem, 4.4vw, 1.3rem);
  }
  .spinner-controls {
    flex-wrap: wrap;
  }
  /* Who spun sits right under the reel, the button below it. */
  .spin-who {
    order: -1;
    flex: 1 1 0;
  }
  .sound-button {
    order: -1;
  }
  .spin-button {
    flex: 1 1 100%;
    justify-content: center;
    padding: 1rem;
    font-size: 1.05rem;
  }
  .spin-who-text {
    font-size: 0.95rem;
  }
  .spin-avatar,
  .sound-button {
    width: 2.6rem;
    height: 2.6rem;
  }
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
