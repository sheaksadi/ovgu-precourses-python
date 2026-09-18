<script setup lang="ts">
/**
 * Sorting lesson: "Ordnung, und was sie leichter macht". Auto-imported as
 * `<LessonSorting :stage="1" />`.
 *
 * A detour after the loops section, so nothing here is graded: Momo's five fish
 * stand as bars and the algorithm actually runs in front of the room
 * (PRE-0156 and its six sub-slides):
 *
 *   1. the same catch shuffled and sorted, and the three questions that get easy
 *   2. bubble sort as an idea: two neighbours, swap if the left one is bigger
 *   3. the same run as Python, next to the moving bars
 *   4. selection sort: take the smallest, put it in front
 *   5. insertion sort: slide each card left until it fits
 *   6. how much work that is, counted in comparisons, not in seconds
 *   7. `sorted()`, which does all of it in one line
 *
 * Every stage is a real run: `frames()` executes the algorithm and records the
 * array after each comparison and each swap, and the player walks those frames.
 * Bars are keyed by value id and placed by index, so a swap is one transition
 * rather than a re-render. Reduced motion lands on the last frame. Enter replays.
 * Words come from `sorting.*` in `locales/`.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7

interface Stage {
  headline: string
  note: string
  code: string
  focus: number[]
  output: string[]
  outputFrom: number
}

/** One moment of a run: where every value stands, and what is being looked at. */
interface Frame {
  order: number[]
  /** The two positions being compared, or -1. */
  a: number
  b: number
  /** True when this frame is the result of a swap. */
  swap: boolean
  /** How many positions are final, counted from the left and from the right. */
  left: number
  right: number
  compares: number
  pass: number
}

const props = defineProps<{ stage: StageNumber }>()
const { t, tm } = useI18n()

const stages = computed(() => tm<Stage[]>('sorting.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const marks = computed(() => tm<Record<string, string>>('sorting.marks'))
const work = computed(() => tm<{
  caption: string
  mine: string
  builtin: string
  sizes: string[]
  mineCounts: string[]
  builtinCounts: string[]
}>('sorting.work'))

/** Momo's catch, in the order it came out of the water. */
const VALUES = [31, 12, 47, 8, 23]
const TALLEST = 50
const N = VALUES.length

const value = (id: number) => VALUES[id]!
const ids = VALUES.map((_, i) => i)
const sortedIds = [...ids].sort((x, y) => value(x) - value(y))

const frame = (order: number[], rest: Partial<Frame> = {}): Frame => ({
  order: [...order],
  a: -1,
  b: -1,
  swap: false,
  left: 0,
  right: 0,
  compares: 0,
  pass: 0,
  ...rest,
})

/** Bubble sort, recorded: the largest value rises to the end of each pass. */
const bubbleFrames = (): Frame[] => {
  const arr = [...ids]
  const out: Frame[] = [frame(arr)]
  let compares = 0
  for (let i = 0; i < N - 1; i++) {
    for (let j = 0; j < N - 1 - i; j++) {
      compares++
      out.push(frame(arr, { a: j, b: j + 1, right: i, compares, pass: i + 1 }))
      if (value(arr[j]!) > value(arr[j + 1]!)) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1]!, arr[j]!]
        out.push(frame(arr, { a: j, b: j + 1, swap: true, right: i, compares, pass: i + 1 }))
      }
    }
  }
  out.push(frame(arr, { left: N, compares, pass: N - 1 }))
  return out
}

/** Selection sort: the finished part grows on the left. */
const selectionFrames = (): Frame[] => {
  const arr = [...ids]
  const out: Frame[] = [frame(arr)]
  let compares = 0
  for (let i = 0; i < N - 1; i++) {
    let min = i
    for (let j = i + 1; j < N; j++) {
      compares++
      out.push(frame(arr, { a: min, b: j, left: i, compares, pass: i + 1 }))
      if (value(arr[j]!) < value(arr[min]!)) min = j
    }
    if (min !== i) {
      ;[arr[i], arr[min]] = [arr[min]!, arr[i]!]
      out.push(frame(arr, { a: i, b: min, swap: true, left: i, compares, pass: i + 1 }))
    }
  }
  out.push(frame(arr, { left: N, compares, pass: N - 1 }))
  return out
}

/** Insertion sort, as the adjacent slides it really is. */
const insertionFrames = (): Frame[] => {
  const arr = [...ids]
  const out: Frame[] = [frame(arr)]
  let compares = 0
  for (let i = 1; i < N; i++) {
    let j = i
    while (j > 0 && value(arr[j - 1]!) > value(arr[j]!)) {
      compares++
      out.push(frame(arr, { a: j - 1, b: j, left: i, compares, pass: i }))
      ;[arr[j - 1], arr[j]] = [arr[j]!, arr[j - 1]!]
      out.push(frame(arr, { a: j - 1, b: j, swap: true, left: i, compares, pass: i }))
      j--
    }
    if (j > 0) {
      compares++
      out.push(frame(arr, { a: j - 1, b: j, left: i + 1, compares, pass: i }))
    }
  }
  out.push(frame(arr, { left: N, compares, pass: N - 1 }))
  return out
}

/** The whole run of this stage, and how fast it plays. */
const run = computed<{ frames: Frame[], speed: number }>(() => {
  switch (props.stage) {
    case 1: return { frames: [frame(ids), frame(sortedIds, { left: N })], speed: 1500 }
    case 2: return { frames: bubbleFrames(), speed: 620 }
    case 3: return { frames: bubbleFrames(), speed: 380 }
    case 4: return { frames: selectionFrames(), speed: 380 }
    case 5: return { frames: insertionFrames(), speed: 380 }
    case 7: return { frames: [frame(ids), frame(sortedIds, { left: N })], speed: 900 }
    default: return { frames: [frame(sortedIds, { left: N })], speed: 0 }
  }
})

const index = ref(0)
const now = computed(() => run.value.frames[Math.min(index.value, run.value.frames.length - 1)]!)
/** Where each value stands in this frame, by id. */
const places = computed(() => {
  const spots: number[] = []
  now.value.order.forEach((id, place) => { spots[id] = place })
  return spots
})
const finished = computed(() => index.value >= run.value.frames.length - 1)

let timer: ReturnType<typeof setTimeout> | null = null
const stop = () => { if (timer) clearTimeout(timer); timer = null }

const step = () => {
  if (index.value >= run.value.frames.length - 1) return
  timer = setTimeout(() => {
    index.value++
    step()
  }, run.value.speed)
}

const play = () => {
  stop()
  if (import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    index.value = run.value.frames.length - 1
    return
  }
  index.value = 0
  step()
}

const onKey = (event: KeyboardEvent) => {
  if (event.key !== 'Enter') return
  if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) return
  play()
}

onMounted(() => {
  play()
  window.addEventListener('keydown', onKey)
})
watch(() => props.stage, () => play())
onBeforeUnmount(() => {
  stop()
  window.removeEventListener('keydown', onKey)
})

/** A bar's role in this frame, which is all the colour it needs. */
const roleOf = (id: number) => {
  const place = places.value[id]!
  if (place < now.value.left || place >= N - now.value.right) return 'done'
  if (place === now.value.a || place === now.value.b) return now.value.swap ? 'swap' : 'compare'
  return 'idle'
}
</script>

<template>
  <LessonShell
    :eyebrow="t('sorting.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :variant="stage === 2 ? 'pseudo' : 'python'"
    :file="t('sorting.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :dense="stage === 3 || stage === 5"
    :output-label="t('sorting.output')"
    :no-output="t('sorting.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span class="detour">{{ t('sorting.detour') }}</span>

      <!-- 6: the work itself, counted in comparisons -->
      <div v-if="stage === 6" class="work">
        <span class="work-caption">{{ work.caption }}</span>
        <div v-for="(size, i) in work.sizes" :key="size" class="work-row" :style="{ '--t': `${0.3 + i * 0.35}s` }">
          <span class="work-size">{{ size }}</span>
          <span class="work-bars">
            <span class="work-bar is-mine" :style="{ '--w': [0.12, 0.42, 1][i] }">
              <span class="work-count">{{ work.mineCounts[i] }}</span>
            </span>
            <span class="work-bar is-builtin" :style="{ '--w': [0.03, 0.06, 0.12][i] }">
              <span class="work-count">{{ work.builtinCounts[i] }}</span>
            </span>
          </span>
        </div>
        <div class="work-legend">
          <span class="legend-item"><span class="legend-dot is-mine"></span>{{ work.mine }}</span>
          <span class="legend-item"><span class="legend-dot is-builtin"></span>{{ work.builtin }}</span>
        </div>
      </div>

      <!-- 1–5, 7: the catch as bars, mid-run -->
      <template v-else>
        <span v-if="stage > 1 && stage < 6" class="chips">
          <span class="chip">{{ t('sorting.pass') }} {{ now.pass }}</span>
          <span class="chip is-count">{{ t('sorting.compares') }}: {{ now.compares }}</span>
        </span>

        <span v-if="stage === 1 || stage === 7" class="state" :class="{ 'is-sorted': finished }">
          {{ finished ? t('sorting.sorted') : t('sorting.unsorted') }}
        </span>

        <div class="bars">
          <span
            v-for="id in ids"
            :key="id"
            class="bar"
            :class="`is-${roleOf(id)}`"
            :style="{ '--i': places[id], '--h': value(id) / TALLEST }"
          >
            <span class="bar-value">{{ value(id) }}</span>
            <span class="bar-body"></span>
          </span>
        </div>

        <!-- 1: what the order is good for -->
        <div v-if="stage === 1 && finished" class="marks">
          <span class="mark is-shortest">{{ marks.shortest }}</span>
          <span class="mark is-middle">{{ marks.middle }}</span>
          <span class="mark is-longest">{{ marks.longest }}</span>
        </div>

        <span v-if="stage === 7 && finished" class="stamp">{{ t('sorting.oneLine') }}</span>
      </template>
    </div>
  </LessonShell>
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
  --pitch: 17.5%;
  --x0: 12%;
}

.detour {
  position: absolute;
  top: 1.6vh;
  left: 50%;
  translate: -50% 0;
  padding: calc(0.35vh + 0.25em) 1.2vh;
  border-radius: 999px;
  background: var(--bg-off);
  border: 1px solid var(--border);
  font-size: clamp(0.5rem, 1.25vh, 0.8rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--text-muted);
  animation: fade-in 0.4s ease 0.1s both;
}

/* ─── Chips ──────────────────────────────────────────────────────────── */
.chips {
  position: absolute;
  z-index: 2;
  top: 6.5vh;
  left: 50%;
  translate: -50% 0;
  display: flex;
  gap: 0.8vh;
}
.chip {
  padding: calc(0.4vh + 0.25em) 1.2vh;
  border-radius: 999px;
  background: var(--bg-off);
  border: 1px solid var(--border);
  font-family: var(--font-code);
  font-size: clamp(0.55rem, 1.4vh, 0.95rem);
  font-weight: 700;
  white-space: nowrap;
  color: var(--text-dim);
}
.chip.is-count {
  background: var(--text);
  border-color: var(--text);
  color: var(--bg);
}

.state {
  position: absolute;
  z-index: 2;
  top: 6.5vh;
  left: 50%;
  translate: -50% 0;
  padding: calc(0.4vh + 0.25em) 1.4vh;
  border-radius: 999px;
  background: var(--bg-off);
  border: 2px solid var(--border);
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text-dim);
  transition: background 0.4s ease, border-color 0.4s ease, color 0.4s ease;
}
.state.is-sorted {
  background: color-mix(in srgb, var(--mint) 22%, var(--bg));
  border-color: var(--mint);
  color: var(--text);
}

/* ─── Bars ───────────────────────────────────────────────────────────── */
.bars {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 8vh;
  height: 30vh;
}
.bar {
  position: absolute;
  bottom: 0;
  /* Placed by index, so a swap is one transition instead of a re-render. */
  left: calc(var(--x0) + var(--i) * var(--pitch));
  width: 12%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.6vh;
  translate: -50% 0;
  transition: left 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}
.bar-body {
  width: 100%;
  height: calc(var(--h) * 24vh);
  border-radius: 1vh 1vh 0.4vh 0.4vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
  transition: background 0.2s ease, border-color 0.2s ease, translate 0.2s ease;
}
.bar-value {
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  color: var(--text-dim);
  transition: color 0.2s ease;
}
.bar.is-compare .bar-body {
  background: color-mix(in srgb, var(--sun) 65%, var(--bg));
  border-color: var(--sun);
}
.bar.is-compare .bar-value {
  color: var(--text);
}
.bar.is-swap .bar-body {
  background: color-mix(in srgb, var(--coral) 30%, var(--bg));
  border-color: var(--coral);
  translate: 0 -0.8vh;
}
.bar.is-swap .bar-value {
  color: var(--coral);
}
.bar.is-done .bar-body {
  background: color-mix(in srgb, var(--mint) 28%, var(--bg));
  border-color: var(--mint);
}
.bar.is-done .bar-value {
  color: var(--text);
}

/* ─── 1: what sorting buys you ───────────────────────────────────────── */
.marks {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1.5vh;
  height: 5.5vh;
}
.mark {
  position: absolute;
  bottom: 0;
  padding: calc(0.35vh + 0.2em) 1vh;
  border-radius: 0.8vh;
  background: var(--bg);
  border: 2px dashed var(--sky);
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  font-weight: 700;
  white-space: nowrap;
  color: var(--text-dim);
  translate: -50% 0;
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.mark.is-shortest { left: 12%; animation-delay: 0.2s; }
.mark.is-middle { left: 47%; animation-delay: 0.4s; }
.mark.is-longest { left: 82%; animation-delay: 0.6s; }

.stamp {
  position: absolute;
  bottom: 2vh;
  left: 50%;
  translate: -50% 0;
  padding: calc(0.5vh + 0.3em) 1.8vh;
  border-radius: 999px;
  background: var(--mint);
  font-size: clamp(0.65rem, 1.8vh, 1.15rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
  animation: pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ─── 6: comparisons, not seconds ────────────────────────────────────── */
.work {
  position: absolute;
  inset: 9vh 6% 8vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.6vh;
}
.work-caption {
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.work-row {
  display: grid;
  grid-template-columns: 9ch 1fr;
  align-items: center;
  gap: 1.2vh;
  animation: fade-in 0.4s ease var(--t) both;
}
.work-size {
  font-family: var(--font-code);
  font-size: clamp(0.55rem, 1.4vh, 0.95rem);
  font-weight: 700;
  color: var(--text-dim);
}
.work-bars {
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
}
.work-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: calc(var(--w) * 100%);
  min-width: 6ch;
  height: 3vh;
  padding-right: 0.8vh;
  border-radius: 0.5vh;
  font-family: var(--font-code);
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  font-weight: 800;
  color: var(--text);
  animation: grow 0.5s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
  transform-origin: left center;
}
.work-bar.is-mine {
  background: color-mix(in srgb, var(--coral) 35%, var(--bg));
  border: 2px solid var(--coral);
}
.work-bar.is-builtin {
  background: color-mix(in srgb, var(--mint) 35%, var(--bg));
  border: 2px solid var(--mint);
}
.work-legend {
  display: flex;
  gap: 1.6vh;
  margin-top: 0.8vh;
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  font-weight: 700;
  color: var(--text-dim);
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5vh;
}
.legend-dot {
  width: 1.2vh;
  height: 1.2vh;
  border-radius: 999px;
}
.legend-dot.is-mine { background: var(--coral); }
.legend-dot.is-builtin { background: var(--mint); }

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes rise {
  from { opacity: 0; translate: -50% 1vh; }
  to { opacity: 1; translate: -50% 0; }
}
@keyframes pop {
  from { opacity: 0; scale: 0.8; }
  to { opacity: 1; scale: 1; }
}
@keyframes grow {
  from { scale: 0 1; }
  to { scale: 1 1; }
}

@media (prefers-reduced-motion: reduce) {
  .bar,
  .bar-body {
    transition: none;
  }
}
</style>
