<script setup lang="ts">
/**
 * What else a list can do, after `append` (PRE-0196 and PRE-0197).
 * Auto-imported as `<LessonListOps :stage="1" />`.
 *
 *   1. taking out: `pop()`, `pop(0)` and `remove(x)`
 *   2. putting in: `insert(i, x)`, then the whole set on one card
 *
 * The list runs in front of the room rather than being described: each call
 * plays in turn, the box that leaves floats off and fades, the boxes that
 * shift slide to their new places, and the code panel lights the line that is
 * running. Boxes are keyed by value id, so a shift is one transition instead of
 * a re-render — the point of `pop(0)` is precisely that everything moves.
 *
 * Words come from `listops.*` in `locales/`; the calls themselves are Python
 * and stay as they are.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useDemos } from '~/composables/useDemos'
import { useWebSocket } from '~/composables/useWebSocket'

type StageNumber = 1 | 2

interface Stage {
  headline: string
  note: string
  code: string
  focus: number[]
  output: string[]
  outputFrom: number
}

interface Summary {
  call: string
  says: string
}

/** One value in the basket, with an id that survives every shift. */
interface Box {
  id: number
  value: number
}

/** One moment of the run: the list as it stands, and what is happening to it. */
interface Step {
  boxes: Box[]
  /** Id of the box leaving on this step, or entering it. */
  out?: number
  in?: number
  /** Line of the code panel this step is running. */
  line: number
  hold: number
}

const props = defineProps<{ stage: StageNumber }>()
const { t, tm } = useI18n()

const stages = computed(() => tm<Stage[]>('listops.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const summary = computed(() => tm<Summary[]>('listops.summary'))

const COLOURS = ['sky', 'coral', 'mint', 'lavender', 'sun', 'rose']

/**
 * The run, written out. Ids are handed out once and never reused, so a box
 * keeps its colour and its identity while its index changes underneath it.
 */
const run = computed<Step[]>(() => {
  if (props.stage === 1) {
    const b = [12, 30, 8, 21, 15].map((value, id) => ({ id, value }))
    return [
      { boxes: b, line: 1, hold: 1.1 },
      { boxes: b, out: 4, line: 3, hold: 1.2 },
      { boxes: b.slice(0, 4), line: 4, hold: 1.2 },
      { boxes: b.slice(0, 4), out: 0, line: 6, hold: 1.2 },
      { boxes: b.slice(1, 4), line: 7, hold: 1.2 },
      { boxes: b.slice(1, 4), out: 2, line: 9, hold: 1.2 },
      { boxes: [b[1]!, b[3]!], line: 10, hold: 1.4 },
    ]
  }
  const start = [{ id: 0, value: 30 }, { id: 1, value: 21 }]
  const inserted = { id: 2, value: 40 }
  const appended = { id: 3, value: 9 }
  const three = [start[0]!, inserted, start[1]!]
  return [
    { boxes: start, line: 1, hold: 1.1 },
    { boxes: three, in: inserted.id, line: 3, hold: 1.5 },
    { boxes: three, line: 4, hold: 1.2 },
    { boxes: [...three, appended], in: appended.id, line: 6, hold: 1.5 },
    { boxes: [...three, appended], line: 7, hold: 1.4 },
  ]
})

const index = ref(0)
const now = computed(() => run.value[Math.min(index.value, run.value.length - 1)]!)
const finished = computed(() => index.value >= run.value.length - 1)

let timer: ReturnType<typeof setTimeout> | null = null
const stop = () => { if (timer) clearTimeout(timer); timer = null }

const step = () => {
  if (index.value >= run.value.length - 1) return
  timer = setTimeout(() => {
    index.value++
    step()
  }, now.value.hold * 1000)
}

const play = () => {
  stop()
  if (import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    index.value = run.value.length - 1
    return
  }
  index.value = 0
  step()
}

/** A replay asked for by a person plays for the whole room. */
const demos = useDemos()
const ws = useWebSocket()
const runsFor = () => run.value.reduce((sum, one) => sum + one.hold, 0) * 1000 + 600

const replay = () => {
  const ms = runsFor()
  demos.hold(ms)
  ws.sendDemoReplay(ms)
}

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
watch(() => props.stage, () => play())
onBeforeUnmount(() => {
  stop()
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('deck:demo-replay', onRoomReplay)
})

/** Output lines land as their `print` runs, so the panel keeps up with the boxes. */
const outputDelays = computed(() => {
  const times: number[] = []
  let clock = 0
  run.value.forEach((one) => {
    if (one.line === 4 || one.line === 7 || one.line === 10) times.push(clock + 0.2)
    clock += one.hold
  })
  return times.slice(0, current.value.output.length)
})
</script>

<template>
  <LessonShell
    :eyebrow="t('listops.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :file="t('listops.file')"
    :focus="now.line ? [now.line] : current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    stack-output
    dense
    :output-label="t('listops.output')"
    :no-output="t('listops.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span class="len">{{ t('listops.lenLabel') }} = {{ now.boxes.length }}</span>

      <!-- The basket, mid-operation -->
      <div class="rail">
        <TransitionGroup name="box">
          <span
            v-for="(box, at) in now.boxes"
            :key="box.id"
            class="box"
            :class="{
              'is-out': box.id === now.out,
              'is-in': box.id === now.in,
            }"
            :style="{ '--i': at, '--accent': `var(--${COLOURS[box.id % COLOURS.length]})` }"
          >
            <span class="box-value">{{ box.value }}</span>
            <span class="box-index">{{ at }}</span>
            <span v-if="box.id === now.out" class="box-tag is-gone">{{ t('listops.gone') }}</span>
            <span v-else-if="box.id === now.in" class="box-tag is-added">{{ t('listops.added') }}</span>
          </span>
        </TransitionGroup>
      </div>

      <!-- 2: everything a list can do, on one card -->
      <div v-if="stage === 2" class="summary" :class="{ 'is-shown': finished }">
        <span class="summary-label">{{ t('listops.summaryLabel') }}</span>
        <div v-for="(item, at) in summary" :key="item.call" class="summary-row" :style="{ '--t': `${at * 0.07}s` }">
          <code class="summary-call">{{ item.call }}</code>
          <span class="summary-says">{{ item.says }}</span>
        </div>
      </div>
    </div>
  </LessonShell>
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3vh 5%;
}

.len {
  padding: 0.4vh 1.1vh;
  border-radius: 999px;
  background: var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.5rem, 1.4vh, 0.9rem);
  font-weight: 800;
  color: var(--bg);
}

/* ─── The list ───────────────────────────────────────────────────────── */
.rail {
  position: relative;
  width: 100%;
  height: 16vh;
  margin-top: 2.5vh;
}
.box {
  position: absolute;
  top: 0;
  /* Placed by index, so a shift is one transition rather than a re-render. */
  left: calc(var(--i) * 19%);
  width: 17%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5vh;
  padding: 1.2vh 0.5vh;
  border-radius: 1.1vh;
  background: color-mix(in srgb, var(--accent) 18%, var(--bg));
  border: 2px solid var(--accent);
  transition: left 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease, translate 0.35s ease;
}
.box-value {
  font-family: var(--font-code);
  font-size: clamp(0.8rem, 2.4vh, 1.5rem);
  font-weight: 800;
  color: var(--text);
}
.box-index {
  font-family: var(--font-code);
  font-size: clamp(0.42rem, 1.15vh, 0.72rem);
  font-weight: 700;
  color: var(--text-muted);
}
.box-tag {
  position: absolute;
  bottom: -2.6vh;
  padding: 0.25vh 0.7vh;
  border-radius: 999px;
  font-size: clamp(0.4rem, 1.1vh, 0.68rem);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}
.box-tag.is-gone {
  background: var(--coral);
  color: var(--bg);
}
.box-tag.is-added {
  background: var(--mint);
  color: var(--text);
}

/* The one on its way out: lifted and dimmed before it goes. */
.box.is-out {
  translate: 0 -1.4vh;
  border-style: dashed;
  opacity: 0.75;
}
.box.is-in {
  animation: land 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Leaving upwards, arriving from above: the list is a row, not a stack. */
.box-enter-from {
  opacity: 0;
  translate: 0 -2.5vh;
}
.box-leave-to {
  opacity: 0;
  translate: 0 -3vh;
}
.box-leave-active {
  transition: opacity 0.35s ease, translate 0.35s ease;
}

/* ─── 2: the whole set ───────────────────────────────────────────────── */
.summary {
  width: 100%;
  margin-top: auto;
  opacity: 0;
  transition: opacity 0.5s ease;
}
.summary.is-shown {
  opacity: 1;
}
.summary-label {
  display: block;
  margin-bottom: 0.8vh;
  font-size: clamp(0.42rem, 1.1vh, 0.7rem);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.summary-row {
  display: flex;
  align-items: baseline;
  gap: 1vh;
  padding: 0.35vh 0;
}
.summary-call {
  flex: none;
  min-width: 13ch;
  font-family: var(--font-code);
  font-size: clamp(0.52rem, 1.45vh, 0.95rem);
  font-weight: 800;
  color: var(--sky);
}
.summary-says {
  font-size: clamp(0.48rem, 1.35vh, 0.88rem);
  color: var(--text-dim);
}

@keyframes land {
  from { opacity: 0; translate: 0 -2.5vh; scale: 0.9; }
  to { opacity: 1; translate: 0 0; scale: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .box {
    transition: none;
  }
}

/* ─── A phone held upright ───────────────────────────────────────────── */
@media (orientation: portrait) and (max-width: 760px) {
  /* `.shell` in front, not a bare :deep(), so this beats Shell's own rule of
     the same specificity instead of losing the tie on build order. */
  .shell :deep(.output-label) {
    font-size: clamp(0.75rem, 3vw, 0.85rem);
  }
  :deep(.code-tabbar .ml-auto span) {
    font-size: 0.72rem;
  }

  /* The index under each box, its "gone"/"added" tag, and the summary label
     were all sized around 1.1vh, which drops well under 11px on a tall
     narrow screen. */
  .box-index {
    font-size: clamp(0.71rem, 2.6vw, 0.75rem);
  }
  .box-tag {
    font-size: clamp(0.71rem, 2.6vw, 0.72rem);
  }
  .summary-label {
    font-size: clamp(0.71rem, 2.6vw, 0.72rem);
  }
}
</style>
