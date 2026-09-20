<script setup lang="ts">
/**
 * One sorting algorithm, big: the whole slide, twenty values, no code panel.
 * Auto-imported as `<LessonSortingRun algo="bubble" />`.
 *
 * Every algorithm of the detour gets one of these right after its lesson slide,
 * because five bars next to a code panel show what the rule is and twenty bars
 * across a projector show what the rule *costs*. All five runs start from the
 * same twenty numbers, so the comparison counters at the end can be read against
 * each other — which is the honest version of the "how much work" slide.
 *
 * Merge and quick sort only ever appear here, with no lesson slide and no code
 * of their own: they are the two the room should have *seen* once, not written.
 * So they carry their rule in three steps in the corner, and the run marks the
 * stretch they are working on — plus the pivot, for quick sort.
 *
 * The run is the real algorithm from `utils/sorting.ts`, played frame by frame,
 * and the projector puts a note under every frame: the value being looked at,
 * pitched by how tall it is, louder when it moves. Enter replays it. Reduced
 * motion lands on the sorted row, in silence.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useDemos } from '~/composables/useDemos'
import { useSound } from '~/composables/useSound'
import { useWebSocket } from '~/composables/useWebSocket'
import { sortFrames, type SortName } from '~/utils/sorting'

const props = defineProps<{ algo: SortName }>()
const { t, tm } = useI18n()

/** The same twenty numbers for all five runs, so the counters compare. */
const VALUES = [
  62, 14, 87, 33, 5, 71, 26, 94, 48, 9,
  57, 80, 21, 66, 38, 12, 75, 43, 29, 53,
]
const TALLEST = 100
const N = VALUES.length

const info = computed(() => tm<{ name: string, rule: string, steps?: string[] }>(`sorting.big.${props.algo}`))
/** Only the two without a lesson slide carry their rule as steps in the corner. */
const steps = computed(() => info.value.steps ?? [])

const frames = computed(() => sortFrames(VALUES, props.algo))
const index = ref(0)
const now = computed(() => frames.value[Math.min(index.value, frames.value.length - 1)]!)
const finished = computed(() => index.value >= frames.value.length - 1)
const progress = computed(() => (index.value / Math.max(frames.value.length - 1, 1)) * 100)

/** Where each value stands in this frame, by id. */
const places = computed(() => {
  const spots: number[] = []
  now.value.order.forEach((id, place) => { spots[id] = place })
  return spots
})

/**
 * How fast a run plays, per algorithm. The three that walk the whole row take
 * thousands of frames and want video speed; merge and quick are done in a few
 * hundred, so at the same speed they would be over before the room looks up.
 */
const SPEED: Record<SortName, number> = {
  bubble: 55,
  selection: 55,
  insertion: 55,
  merge: 110,
  quick: 110,
}
const speed = computed(() => SPEED[props.algo])

let timer: ReturnType<typeof setTimeout> | null = null
const stop = () => { if (timer) clearTimeout(timer); timer = null }

const step = () => {
  if (index.value >= frames.value.length - 1) return
  timer = setTimeout(() => {
    index.value++
    step()
  }, speed.value)
}

const play = () => {
  stop()
  if (import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    index.value = frames.value.length - 1
    return
  }
  index.value = 0
  step()
}

/** How long this run takes, so a replay can hold the room for that long. */
const demos = useDemos()
const ws = useWebSocket()
const runsFor = () => frames.value.length * speed.value + 1200

/** Asked for by a person: the whole room watches it again, from the top. */
const replay = () => {
  const ms = runsFor()
  demos.hold(ms)
  ws.sendDemoReplay(ms)
}

/**
 * The frame, heard. A comparison is the value being looked at, a swap the value
 * that just moved, and the last frame is the room's "that arrived" cue. Silent
 * everywhere but the projector, and silent there when it is muted.
 */
const sound = useSound()
watch(index, (at) => {
  const frame = frames.value[at]
  if (!frame) return
  if (at >= frames.value.length - 1) {
    sound.land()
    return
  }
  const place = (frame.swap || frame.b < 0) ? frame.a : frame.b
  const id = place >= 0 ? frame.order[place] : undefined
  if (id === undefined) return
  sound.step(VALUES[id]! / TALLEST, frame.swap)
})

const onKey = (event: KeyboardEvent) => {
  if (event.key !== 'Enter') return
  if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) return
  replay()
}

/** The room asked: play, but do not ask the room back. */
const onRoomReplay = () => play()

onMounted(() => {
  play()
  window.addEventListener('keydown', onKey)
  window.addEventListener('deck:demo-replay', onRoomReplay)
})
watch(() => props.algo, () => play())
onBeforeUnmount(() => {
  stop()
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('deck:demo-replay', onRoomReplay)
})

const roleOf = (id: number) => {
  const place = places.value[id]!
  const frame = now.value
  if (place < frame.left || place >= N - frame.right) return 'done'
  if (frame.fixed.includes(place)) return 'done'
  if (place === frame.pivot) return 'pivot'
  if (place === frame.a || place === frame.b) return frame.swap ? 'swap' : 'compare'
  // Merge and quick sort work on one stretch at a time; the rest waits.
  if (frame.lo >= 0 && (place < frame.lo || place > frame.hi)) return 'waiting'
  return 'idle'
}
</script>

<template>
  <div class="run" :class="[`is-${algo}`, { 'is-finished': finished }]">
    <header class="run-head">
      <div class="run-title">
        <span class="run-eyebrow">{{ t('sorting.big.eyebrow') }}</span>
        <h2 class="run-name">{{ info.name }}</h2>
        <p class="run-rule">{{ info.rule }}</p>
      </div>

      <div class="run-side">
        <div class="run-counts">
          <span class="count">
            <span class="count-value">{{ now.compares }}</span>
            <span class="count-label">{{ t('sorting.compares') }}</span>
          </span>
          <span class="count">
            <span class="count-value">{{ now.swaps }}</span>
            <span class="count-label">{{ t('sorting.big.swaps') }}</span>
          </span>
          <span class="count is-quiet">
            <span class="count-value">{{ N }}</span>
            <span class="count-label">{{ t('sorting.big.values') }}</span>
          </span>
        </div>

        <!-- The two without a lesson slide say their rule here, in three steps. -->
        <aside v-if="steps.length" class="idea">
          <span class="idea-label">{{ t('sorting.big.idea') }}</span>
          <ol class="idea-steps">
            <li v-for="(line, at) in steps" :key="at">{{ line }}</li>
          </ol>
        </aside>
      </div>
    </header>

    <div class="run-bars">
      <!-- The stretch merge or quick sort is working on right now. -->
      <span
        v-if="now.lo >= 0"
        class="stretch"
        :style="{ '--lo': now.lo, '--span': now.hi - now.lo + 1, '--n': N }"
      ></span>

      <span
        v-for="(v, id) in VALUES"
        :key="id"
        class="bar"
        :class="`is-${roleOf(id)}`"
        :style="{ '--i': places[id], '--h': v / TALLEST, '--n': N }"
      >
        <span class="bar-body"></span>
        <span class="bar-value">{{ v }}</span>
      </span>
    </div>

    <footer class="run-foot">
      <span v-if="algo === 'quick'" class="run-legend">
        <span class="legend-dot"></span>{{ t('sorting.big.pivot') }}
      </span>
      <div class="run-progress" :style="{ '--p': `${progress}%` }"></div>
      <span class="run-hint">{{ finished ? t('sorting.big.done') : t('sorting.big.running') }}</span>
    </footer>
  </div>
</template>

<style scoped>
.run {
  position: relative;
  width: 100%;
  height: 100%;
  /*
   * How long a bar takes to reach its new place. It has to be shorter than the
   * frame, or a run smears: merge sort moves the whole rest of a stretch one
   * place along with every value it writes, and those slides have to be over
   * before the next one starts.
   */
  --move: 0.18s;
  padding: 6vh 5vw 7vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.run.is-merge {
  --move: 0.09s;
}

.run-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2vw;
}
.run-eyebrow {
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.run-name {
  margin-top: 0.6vh;
  font-size: clamp(1.5rem, 5vh, 3.2rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--text);
}
.run-rule {
  margin-top: 1vh;
  max-width: 52ch;
  font-size: clamp(0.65rem, 1.8vh, 1.1rem);
  line-height: 1.4;
  color: var(--text-dim);
}

.run-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1.4vh;
}
.run-counts {
  display: flex;
  gap: 1.2vw;
}

/* ─── The idea, in the corner ────────────────────────────────────────── */
.idea {
  max-width: 34ch;
  padding: 1.2vh 1.6vh;
  border-radius: 1vh;
  background: var(--bg-off);
  border: 2px dashed var(--border);
  animation: idea-in 0.5s ease 0.2s both;
}
.idea-label {
  display: block;
  font-size: clamp(0.45rem, 1.15vh, 0.72rem);
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.idea-steps {
  margin: 0.8vh 0 0;
  padding-left: 2.2ch;
  list-style: decimal;
  font-size: clamp(0.55rem, 1.5vh, 0.95rem);
  line-height: 1.4;
  color: var(--text-dim);
}
.idea-steps li + li {
  margin-top: 0.4vh;
}

@keyframes idea-in {
  from { opacity: 0; translate: 0 -0.8vh; }
  to { opacity: 1; translate: 0 0; }
}
.count {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 7ch;
  padding: 1vh 1.2vh;
  border-radius: 1vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
}
.count.is-quiet {
  background: transparent;
  border-style: dashed;
}
.count-value {
  font-family: var(--font-code);
  font-size: clamp(0.9rem, 3vh, 2rem);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--text);
}
.count-label {
  font-size: clamp(0.45rem, 1.15vh, 0.72rem);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* ─── The bars ───────────────────────────────────────────────────────── */
.run-bars {
  position: relative;
  flex: 1;
  margin-top: 3vh;
  min-height: 0;
}
/* The stretch a divide-and-conquer run owns right now, behind its bars. */
.stretch {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(var(--lo) * (100% / var(--n)));
  width: calc(var(--span) * (100% / var(--n)));
  border-radius: 1vh;
  background: color-mix(in srgb, var(--sky) 10%, transparent);
  border: 2px dashed color-mix(in srgb, var(--sky) 55%, transparent);
  transition: left 0.18s ease, width 0.18s ease;
}

.bar {
  position: absolute;
  bottom: 0;
  /* Placed by index inside a row of N, so a swap is one transition. */
  left: calc(var(--i) * (100% / var(--n)));
  width: calc(100% / var(--n));
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.6vh;
  padding: 0 0.25vw;
  transition: left var(--move) cubic-bezier(0.22, 1, 0.36, 1);
}
.bar-body {
  width: 100%;
  height: calc(var(--h) * 100%);
  border-radius: 0.8vh 0.8vh 0.2vh 0.2vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
  transition: background 0.12s ease, border-color 0.12s ease;
}
.bar-value {
  font-family: var(--font-code);
  font-size: clamp(0.4rem, 1.2vh, 0.8rem);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}
.bar.is-compare .bar-body {
  background: color-mix(in srgb, var(--sun) 70%, var(--bg));
  border-color: var(--sun);
}
.bar.is-swap .bar-body {
  background: color-mix(in srgb, var(--coral) 45%, var(--bg));
  border-color: var(--coral);
}
.bar.is-done .bar-body {
  background: color-mix(in srgb, var(--mint) 35%, var(--bg));
  border-color: var(--mint);
}
.bar.is-pivot .bar-body {
  background: color-mix(in srgb, var(--sky) 55%, var(--bg));
  border-color: var(--sky);
}
/* Outside the stretch: still there, not being touched. */
.bar.is-waiting {
  opacity: 0.45;
}
.bar.is-compare .bar-value,
.bar.is-swap .bar-value,
.bar.is-done .bar-value,
.bar.is-pivot .bar-value {
  color: var(--text);
}

/* ─── Progress ───────────────────────────────────────────────────────── */
.run-foot {
  margin-top: 2.5vh;
  display: flex;
  align-items: center;
  gap: 1.2vh;
}
.run-legend {
  display: flex;
  align-items: center;
  gap: 0.6vh;
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.legend-dot {
  width: 1.2vh;
  height: 1.2vh;
  border-radius: 999px;
  background: var(--sky);
}

.run-progress {
  position: relative;
  flex: 1;
  height: 0.8vh;
  border-radius: 999px;
  background: var(--border);
  overflow: hidden;
}
.run-progress::after {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--p);
  border-radius: 999px;
  background: var(--coral);
  transition: width 0.12s linear;
}
.is-finished .run-progress::after {
  background: var(--mint);
}
.run-hint {
  min-width: 9ch;
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.is-finished .run-hint {
  color: var(--mint);
}

@media (prefers-reduced-motion: reduce) {
  .bar,
  .bar-body,
  .stretch,
  .run-progress::after {
    transition: none;
  }
  .idea {
    animation: none;
  }
}
</style>
