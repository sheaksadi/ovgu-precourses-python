<script setup lang="ts">
/**
 * A solution, played line by line. Auto-imported as `<ProblemsSolutionWalk walk="loops-fish" :stage="2" />`.
 *
 * The code fills the left like an editor; a stage zooms it to the lines that
 * matter (a slow camera move) and traces them: the running line lights up,
 * variables change in the card on the right, a condition shows what it came to,
 * and output appears. The last stage zooms back out.
 *
 * Staged over sub-slides like the lessons: each stage opens on the state the
 * earlier stages left, then plays its own steps. Enter plays the stage again;
 * reduced motion shows its end at once. The walk itself is data in
 * `utils/walks.ts`, headlines and notes are `walks.<id>` in `locales/`.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { WALKS, type WalkStep } from '~/utils/walks'
import { needsSpaceBefore, tokenizeCode, type CodeToken } from '~/utils/codeTokens'
import { codeInk } from '~/utils/codeTheme'

const props = defineProps<{ walk: string, stage: number }>()
const { t, tm, locale } = useI18n()

const walk = computed(() => WALKS[props.walk]!)
const names = computed(() => walk.value.names[locale.value])
const lines = computed(() => tokenizeCode(walk.value.code(names.value)))
const total = computed(() => walk.value.stages.length)
const text = computed(() => tm<Array<{ headline: string, note: string }>>(`walks.${props.walk}.stages`)[props.stage - 1]!)

/* ─── State ──────────────────────────────────────────────────────────── */
interface TraceState {
  line: number | null
  vars: Record<string, string | number>
  check: { text: string, result: boolean } | null
  output: string[]
}

const empty = (): TraceState => ({ line: null, vars: {}, check: null, output: [] })

const apply = (state: TraceState, step: WalkStep): TraceState => ({
  line: step.line,
  vars: { ...state.vars, ...step.set },
  check: step.check ? { text: step.check, result: !!step.result } : null,
  output: step.out ? [...state.output, step.out] : state.output,
})

/** Where the trace stands after the first `count` stages, at rest. */
const settled = (count: number): TraceState => {
  const state = walk.value.stages.slice(0, count).flatMap(stage => stage.steps ?? []).reduce(apply, empty())
  return { ...state, line: null, check: null }
}

const zoomOf = (stage: number) => walk.value.stages[stage - 1]?.zoom ?? null

const state = ref<TraceState>(settled(props.stage - 1))
const zoom = ref<[number, number] | null>(zoomOf(props.stage - 1))

let timers: ReturnType<typeof setTimeout>[] = []
const later = (ms: number, run: () => void) => { timers.push(setTimeout(run, ms)) }
const stop = () => {
  timers.forEach(clearTimeout)
  timers = []
}

const play = () => {
  stop()
  const steps = walk.value.stages[props.stage - 1]?.steps ?? []

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    zoom.value = zoomOf(props.stage)
    state.value = settled(props.stage)
    return
  }

  state.value = settled(props.stage - 1)
  zoom.value = zoomOf(props.stage - 1)

  // First the camera, then the code runs.
  later(450, () => { zoom.value = zoomOf(props.stage) })
  let at = steps.length ? 1800 : 0
  for (const step of steps) {
    later(at, () => { state.value = apply(state.value, step) })
    at += step.check ? 1250 : 900
  }
  if (steps.length) later(at + 400, () => { state.value = { ...state.value, line: null, check: null } })
}

const onKey = (event: KeyboardEvent) => {
  if (event.key !== 'Enter') return
  if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) return
  event.preventDefault()
  play()
}

onMounted(() => {
  play()
  window.addEventListener('keydown', onKey)
})
watch(locale, () => play())
onBeforeUnmount(() => {
  stop()
  window.removeEventListener('keydown', onKey)
})

/* ─── Camera ─────────────────────────────────────────────────────────── */
/** Line height in vh; the whole solution fits the panel at scale 1. */
const LINE_VH = 3.1

const camera = computed(() => {
  const range = zoom.value
  if (!range) return { transform: 'translateY(0) scale(1)' }
  const [first, last] = range
  const scale = Math.min(1.75, lines.value.length / (last - first + 4))
  return { transform: `scale(${scale}) translateY(${-(first - 1.6) * LINE_VH}vh)` }
})

const inView = (index: number) => !zoom.value || (index + 1 >= zoom.value[0] && index + 1 <= zoom.value[1])

/* ─── Display ────────────────────────────────────────────────────────── */
const shownVars = computed(() => walk.value.vars
  .filter(key => key in state.value.vars)
  .map(key => ({ key, name: names.value[key] ?? key, value: state.value.vars[key]! })))

const ink = (token: CodeToken) => codeInk('python', token)
const segments = (line: string) => line.split('`').map((part, index) => ({ part, code: index % 2 === 1 }))
</script>

<template>
  <div class="walk relative w-full h-full overflow-hidden">
    <header class="walk-head">
      <div class="walk-progress">
        <span class="walk-eyebrow">{{ t(`walks.${props.walk}.eyebrow`) }}</span>
        <span class="walk-dots" aria-hidden="true">
          <span v-for="n in total" :key="n" class="walk-dot" :class="{ 'is-done': n < stage, 'is-now': n === stage }"></span>
        </span>
        <span class="walk-count">{{ stage }} / {{ total }}</span>
      </div>
      <h2 :key="`${stage}-${locale}`" class="walk-headline" :class="{ 'is-later': stage > 1 }">
        <template v-for="(bit, index) in segments(text.headline)" :key="index">
          <code v-if="bit.code" class="inline-code">{{ bit.part }}</code>
          <template v-else>{{ bit.part }}</template>
        </template>
      </h2>
    </header>

    <!-- The code, with the camera -->
    <section class="walk-code" aria-hidden="true">
      <div class="walk-lines" :style="camera">
        <div
          v-for="(line, index) in lines"
          :key="line.key"
          class="walk-line"
          :class="{ 'is-lit': state.line === index + 1, 'is-out': !inView(index) }"
        >
          <span class="walk-gutter">{{ index + 1 }}</span>
          <span class="walk-text" :style="{ paddingLeft: `${line.indent * 2.4}ch` }">
            <span
              v-for="(token, position) in line.tokens"
              :key="token.key"
              :class="{ 'is-comment': token.kind === 'comment' }"
              :style="{ color: ink(token), fontWeight: token.kind === 'keyword' ? 800 : 500 }"
            >{{ (needsSpaceBefore(line.tokens[position - 1], token) ? ' ' : '') + token.text }}</span>
          </span>
        </div>
      </div>
    </section>

    <!-- What the code knows -->
    <aside class="walk-side">
      <div class="walk-card">
        <span class="walk-label">{{ t('walks.labels.vars') }}</span>
        <div v-if="shownVars.length" class="walk-vars">
          <div v-for="variable in shownVars" :key="variable.key" class="walk-var">
            <code class="walk-var-name">{{ variable.name }}</code>
            <span class="walk-var-box">
              <code :key="`${variable.key}-${variable.value}`" class="walk-var-value">{{ variable.value }}</code>
            </span>
          </div>
        </div>
        <span v-else class="walk-empty">–</span>
      </div>

      <div class="walk-check-slot">
        <Transition name="check" mode="out-in">
          <div v-if="state.check" :key="state.check.text" class="walk-check" :class="state.check.result ? 'is-true' : 'is-false'">
            <code>{{ state.check.text }}</code>
            <span class="walk-check-arrow">→</span>
            <code class="walk-check-result">{{ state.check.result ? 'True' : 'False' }}</code>
          </div>
        </Transition>
      </div>

      <div class="walk-card">
        <span class="walk-label">{{ t('walks.labels.output') }}</span>
        <div v-if="state.output.length" class="walk-output">
          <code v-for="(line, index) in state.output" :key="`${index}-${line}`" class="walk-out-line">{{ line }}</code>
        </div>
        <span v-else class="walk-empty">{{ t('walks.labels.noOutput') }}</span>
      </div>
    </aside>

    <p :key="`note-${stage}-${locale}`" class="walk-note" :class="{ 'is-later': stage > 1 }">
      <span class="walk-rail" aria-hidden="true"></span>
      <span class="walk-note-text">
        <template v-for="(bit, index) in segments(text.note)" :key="index">
          <code v-if="bit.code" class="inline-code">{{ bit.part }}</code>
          <template v-else>{{ bit.part }}</template>
        </template>
      </span>
    </p>
  </div>
</template>

<style scoped>
.walk {
  background: var(--bg);
  color: var(--text);
}

/* ─── Header (as in the lessons) ─────────────────────────────────────── */
.walk-head {
  position: absolute;
  top: 7vh;
  left: 6vw;
  right: 6vw;
}
.walk-progress {
  display: flex;
  align-items: center;
  gap: 1.4vh;
  margin-bottom: 1.8vh;
}
.walk-eyebrow,
.walk-count,
.walk-label {
  font-size: clamp(0.65rem, 1.35vh, 0.9rem);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.walk-dots {
  display: flex;
  align-items: center;
  gap: 0.6vh;
}
.walk-dot {
  width: 1vh;
  height: 1vh;
  border-radius: 999px;
  background: var(--border);
  transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1), background 0.35s ease;
}
.walk-dot.is-done {
  background: var(--text-dim);
}
.walk-dot.is-now {
  width: 2.8vh;
  background: var(--text);
}
.walk-headline {
  font-size: clamp(1.6rem, 5.2vh, 3.8rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.03em;
}
.walk-headline.is-later,
.walk-note.is-later {
  animation: appear 0.4s ease both;
}
.inline-code {
  padding: 0 0.2em;
  border-radius: 0.25em;
  background: var(--bg-off);
  font-family: var(--font-code);
  color: var(--lavender);
}

/* ─── Code ───────────────────────────────────────────────────────────── */
.walk-code {
  position: absolute;
  top: 22vh;
  left: 6vw;
  width: 52vw;
  height: 62vh;
  overflow: hidden;
  border-radius: 2.4vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
}
.walk-lines {
  position: absolute;
  top: 1.6vh;
  left: 0;
  right: 0;
  transform-origin: 0 0;
  transition: transform 1.2s cubic-bezier(0.65, 0, 0.35, 1);
}
.walk-line {
  display: flex;
  align-items: center;
  height: 3.1vh;
  padding-right: 2vh;
  font-family: var(--font-code);
  font-size: clamp(0.65rem, 1.9vh, 1.4rem);
  white-space: pre;
  transition: opacity 0.5s ease, background 0.25s ease, box-shadow 0.25s ease;
}
.walk-line.is-out {
  opacity: 0.25;
}
.walk-line.is-lit {
  background: color-mix(in srgb, var(--sun) 45%, transparent);
  box-shadow: inset 0.5vh 0 0 var(--coral);
}
.walk-gutter {
  flex: none;
  width: 5ch;
  padding-right: 1.6ch;
  text-align: right;
  color: var(--text-muted);
  opacity: 0.6;
}
.is-comment {
  font-style: italic;
}

/* ─── Side ───────────────────────────────────────────────────────────── */
.walk-side {
  position: absolute;
  top: 22vh;
  left: 61vw;
  right: 6vw;
  display: flex;
  flex-direction: column;
  gap: 2vh;
}
.walk-card {
  display: flex;
  flex-direction: column;
  gap: 1.4vh;
  padding: 2vh 2.2vh;
  border-radius: 2vh;
  background: var(--bg);
  border: 2px solid var(--border);
}
.walk-vars {
  display: flex;
  flex-direction: column;
  gap: 1vh;
}
.walk-var {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.4vh;
}
.walk-var-name {
  font-family: var(--font-code);
  font-size: clamp(0.75rem, 2.2vh, 1.5rem);
  font-weight: 800;
}
.walk-var-box {
  min-width: 7vh;
  padding: 0.6vh 1.4vh;
  border-radius: 1vh;
  background: var(--bg-off);
  border: 2px solid var(--text);
  text-align: center;
}
.walk-var-value {
  display: inline-block;
  font-family: var(--font-code);
  font-size: clamp(0.8rem, 2.4vh, 1.7rem);
  font-weight: 900;
  animation: swap 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.walk-empty {
  font-size: clamp(0.7rem, 1.9vh, 1.2rem);
  color: var(--text-muted);
}

.walk-check-slot {
  min-height: 7vh;
}
.walk-check {
  display: flex;
  align-items: center;
  gap: 1.2vh;
  padding: 1.4vh 2vh;
  border-radius: 1.6vh;
  border: 2px solid var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.75rem, 2.2vh, 1.5rem);
  font-weight: 800;
}
.walk-check.is-true {
  background: color-mix(in srgb, var(--mint) 25%, var(--bg));
}
.walk-check.is-false {
  background: color-mix(in srgb, var(--coral) 18%, var(--bg));
}
.walk-check-arrow {
  color: var(--text-muted);
}
.walk-check-result {
  margin-left: auto;
  padding: 0.3vh 1vh;
  border-radius: 999px;
  background: var(--text);
  color: var(--bg);
}

.walk-output {
  display: flex;
  flex-direction: column;
  gap: 0.6vh;
}
.walk-out-line {
  font-family: var(--font-code);
  font-size: clamp(0.8rem, 2.4vh, 1.7rem);
  font-weight: 800;
  animation: appear 0.35s ease both;
}

/* ─── Note ───────────────────────────────────────────────────────────── */
.walk-note {
  position: absolute;
  left: 6vw;
  right: 6vw;
  bottom: 5vh;
  display: flex;
  gap: 2vh;
  min-height: 4vh;
}
.walk-rail {
  flex: none;
  width: 0.5vh;
  border-radius: 999px;
  background: var(--coral);
}
.walk-note-text {
  font-size: clamp(0.8rem, 2.1vh, 1.4rem);
  line-height: 1.5;
  color: var(--text-dim);
}

.check-enter-active {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.check-enter-from {
  opacity: 0;
  transform: translateY(0.8vh);
}
.check-leave-active {
  transition: opacity 0.15s ease;
}
.check-leave-to {
  opacity: 0;
}

/* ─── A phone held upright ───────────────────────────────────────────── */
/* See "A phone held upright" in AGENTS.md. The code and what it is doing to the
   variables stack, in that order, and the code box scrolls sideways rather than
   cutting a line off: this slide is read line by line. */
@media (orientation: portrait) and (max-width: 760px) {
  .walk {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 3.5rem 1rem 5rem;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .walk-head,
  .walk-code,
  .walk-side,
  .walk-note {
    position: static;
    inset: auto;
    width: auto;
  }

  .walk-progress {
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    margin-bottom: 0.9rem;
  }
  .walk-eyebrow,
  .walk-count,
  .walk-label {
    font-size: 0.72rem;
  }

  .walk-headline {
    font-size: clamp(1.5rem, 7vw, 2.2rem);
  }

  /* Relative, not static: the lines are placed against this box, and the
     camera that follows the running line moves them inside it. */
  /* Taller than it looks: the camera zooms in up to 1.75x, so a short box
     would show three lines of a solution that is read as a whole. */
  .walk-code {
    position: relative;
    height: 46vh;
    overflow-x: auto;
    overflow-y: hidden;
    border-radius: 1rem;
  }
  .walk-line {
    height: 2.6vh;
    font-size: 0.8rem;
  }

  .walk-side {
    gap: 1rem;
  }
  .walk-card {
    gap: 0.8rem;
    padding: 1rem;
    border-radius: 1rem;
  }
  .walk-var-name,
  .walk-check {
    font-size: 0.95rem;
  }
  .walk-var-value {
    font-size: 1rem;
  }
  .walk-check-slot {
    min-height: 3.2rem;
  }

  .walk-note {
    gap: 0.75rem;
    font-size: 0.95rem;
  }
}

@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes swap {
  from { opacity: 0; transform: translateY(-0.8vh); }
  to { opacity: 1; transform: none; }
}
</style>
