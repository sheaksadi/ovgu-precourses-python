<script setup lang="ts">
/**
 * "Funktionen kombinieren". Auto-imported as `<LessonFunctionsCombine :stage="1" />`.
 *
 * The physics half of the functions block (PRE-0106 and its two sub-slides),
 * and the place where functions stop being single formulas:
 *
 *   1. speed = distance / time — Momo and Bello race the same 100 m
 *   2. a call inside a call: `durchschnitt(beschleunigung(…), beschleunigung(…))`
 *      collapses from the inside out, which is the order Python works in
 *   3. stopping distance: two small functions, a third that only adds them, and
 *      a loop that prints the table — doubling the speed more than triples it
 *
 * Scenes stay one extra stage to clear away. Beats are computed here and handed
 * to CSS as `--t`. Words come from `functions.combine.*` in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3

interface Stage {
  headline: string
  note: string
  tally: string
  code: string
  focus: number[]
  output: string[]
  outputFrom: number
}

const props = defineProps<{ stage: StageNumber }>()
const { t, tm } = useI18n()

const stages = computed(() => tm<Stage[]>('functions.combine.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const n = computed(() => tm<Record<'track' | 'speed' | 'accel' | 'mean', string>>('functions.combine.names'))
const w = computed(() => tm<Record<'inner' | 'outer' | 'reaction' | 'braking' | 'total', string>>('functions.combine.words'))

/* 1: race */
const RACE_START = 0.8

/* 2: the two inner calls, and when each one collapses into its value */
const INNER = [
  { call: '100, 20', value: '0.25' },
  { call: '100, 10', value: '1.0' },
]
const innerAt = (k: number) => 1.8 + k * 1.2

/* 3: the rule of thumb, to scale — the longest stop sets the width */
const STOPS = [
  { speed: 30, reaction: 9, braking: 9 },
  { speed: 50, reaction: 15, braking: 25 },
  { speed: 100, reaction: 30, braking: 100 },
]
const LONGEST = 130
const stopAt = (k: number) => 0.9 + k * 1.1

const outputDelays = computed(() => {
  switch (props.stage) {
    case 1: return [RACE_START + 2.6, RACE_START + 2.9]
    case 2: return [5.2]
    case 3: return STOPS.map((_, k) => stopAt(k) + 0.9)
    default: return undefined
  }
})

const phase = (own: number) => (props.stage === own ? 'is-active' : props.stage === own + 1 ? 'is-leaving' : '')
const shown = (own: number) => props.stage === own || props.stage === own + 1
</script>

<template>
  <LessonShell
    :eyebrow="t('functions.combine.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :file="t('functions.combine.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    dense
    :output-label="t('functions.combine.output')"
    :no-output="t('functions.combine.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- ═══ 1: race ═══ -->
      <div v-if="shown(1)" class="part race" :class="phase(1)">
        <span class="finish-line"></span>
        <code class="track-label">{{ n.track }}</code>
        <div v-for="lane in ['momo', 'bello']" :key="lane" class="lane" :class="`lane-${lane}`">
          <span class="lane-line"></span>
          <div class="runner">
            <ArtSprite
              :name="lane === 'momo' ? 'cat-stand' : 'dog'"
              :color="lane === 'momo' ? 'coral' : 'sun'"
              :accent="lane === 'momo' ? 'rose' : 'text'"
              :size="96"
              class="runner-art"
            />
          </div>
          <code class="lane-time">{{ lane === 'momo' ? '20 s' : '10 s' }}</code>
          <code class="lane-speed">{{ lane === 'momo' ? '5.0 m/s' : '10.0 m/s' }}</code>
        </div>
      </div>

      <!-- ═══ 2: from the inside out ═══ -->
      <div v-if="stage === 2" class="part unwrap is-active">
        <span class="step-label label-inner">{{ w.inner }}</span>

        <code class="expression">
          <span class="outer-name">{{ n.mean }}</span>(<span
            v-for="(inner, k) in INNER"
            :key="k"
            class="inner"
            :style="{ '--t': `${innerAt(k)}s` }"
          ><span v-if="k > 0" class="comma">, </span><span class="stack">
            <span class="inner-call"><span class="inner-name">{{ n.accel }}</span>({{ inner.call }})</span>
            <span class="inner-value">{{ inner.value }}</span>
          </span></span>)
        </code>

        <span class="step-label label-outer">{{ w.outer }}</span>
        <span class="arrow"></span>
        <code class="result">0.625</code>
      </div>

      <!-- ═══ 3: the stopping distance, to scale ═══ -->
      <div v-if="stage === 3" class="part stops is-active">
        <div class="legend">
          <span class="key key-reaction">{{ w.reaction }}</span>
          <span class="key key-braking">{{ w.braking }}</span>
        </div>

        <div
          v-for="(stop, k) in STOPS"
          :key="stop.speed"
          class="stop"
          :style="{ '--t': `${stopAt(k)}s` }"
        >
          <code class="stop-speed">{{ stop.speed }} km/h</code>
          <span class="stop-bar">
            <span class="seg seg-reaction" :style="{ '--w': `${(stop.reaction / LONGEST) * 100}%` }"></span>
            <span class="seg seg-braking" :style="{ '--w': `${(stop.braking / LONGEST) * 100}%` }"></span>
          </span>
          <code class="stop-total">{{ stop.reaction + stop.braking }} m</code>
        </div>
      </div>
    </div>
  </LessonShell>
</template>

<style scoped>
.scene,
.part {
  position: absolute;
  inset: 0;
}
code {
  font-family: var(--font-code);
}
.stack {
  display: inline-grid;
}

.tally {
  position: absolute;
  top: 1.6vh;
  left: 50%;
  z-index: 3;
  translate: -50% 0;
  padding: calc(0.4vh + 0.3em) 1.3vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}
.is-leaving {
  animation: vanish 0.3s ease both;
}

/* ═══ 1: race ══════════════════════════════════════════════════════════ */
.finish-line {
  position: absolute;
  top: 9vh;
  bottom: 8vh;
  left: 86%;
  width: 0.8vh;
  background: repeating-linear-gradient(to bottom, var(--text) 0 1vh, var(--bg) 1vh 2vh);
}
.track-label {
  position: absolute;
  top: 7vh;
  left: 47%;
  translate: -50% 0;
  padding: calc(0.25vh + 0.3em) 1vh;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 800;
  color: var(--text);
}
.lane {
  position: absolute;
  left: 0;
  right: 0;
  height: 13vh;
}
.lane-momo {
  top: 12vh;
}
.lane-bello {
  top: 27vh;
}
.lane-line {
  position: absolute;
  left: 6%;
  right: 10%;
  bottom: 1vh;
  height: 0.6vh;
  border-radius: 999px;
  background: var(--border);
}
.runner {
  position: absolute;
  bottom: 1.4vh;
  left: 10%;
  width: 9vh;
  height: 9vh;
  translate: -50% 0;
}
.runner-art {
  width: 100%;
  height: 100%;
}
.lane-time,
.lane-speed {
  position: absolute;
  top: 0.4vh;
  padding: calc(0.25vh + 0.3em) 0.9vh;
  border-radius: 999px;
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 800;
  white-space: nowrap;
}
.lane-time {
  left: 4%;
  background: var(--bg);
  border: 2px solid var(--border);
  color: var(--text-dim);
}
.lane-speed {
  right: 3%;
  background: var(--mint);
  color: #FFFFFF;
  opacity: 0;
}
.is-active .lane-momo .runner {
  animation: race 2.4s linear 0.8s both;
}
.is-active .lane-bello .runner {
  animation: race 1.2s linear 0.8s both;
}
.is-active .runner-art {
  animation: bob 0.2s ease-in-out 0.8s 12 alternate;
}
.is-active .lane-momo .lane-speed {
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 3.3s both;
}
.is-active .lane-bello .lane-speed {
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 2.1s both;
}
.is-leaving .runner {
  left: 86%;
}
.is-leaving .lane-speed {
  opacity: 1;
}

/* ═══ 2: from the inside out ═══════════════════════════════════════════
   Each inner call sits in a one-cell grid with its own value on top of it,
   so the collapse happens in place and the line never jumps. */
.unwrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 7vh 3% 2vh;
}
.step-label {
  padding: calc(0.25vh + 0.3em) 1vh;
  border-radius: 999px;
  background: var(--bg-off);
  border: 2px solid var(--border);
  font-size: clamp(0.45rem, 1.2vh, 0.78rem);
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-dim);
}
.label-inner {
  animation: swap-in 0.3s ease 1.4s both;
}
.label-outer {
  margin-top: 3vh;
  animation: swap-in 0.3s ease 4.2s both;
}
.expression {
  margin-top: 1.4vh;
  padding: 1.2vh 1.4vh;
  border-radius: 1.2vh;
  background: var(--bg);
  border: 3px solid var(--text);
  font-size: clamp(0.58rem, 1.7vh, 1.1rem);
  font-weight: 800;
  line-height: 1.6;
  color: var(--text);
  animation: swap-in 0.4s ease 0.5s both;
}
.outer-name {
  color: var(--lavender);
}
.inner-name {
  color: var(--sky);
}
.inner-call,
.inner-value {
  grid-area: 1 / 1;
  justify-self: center;
  align-self: center;
  white-space: nowrap;
}
.inner-call {
  padding: 0.2vh 0.5vh;
  border-radius: 0.6vh;
  animation:
    mark 0.4s ease var(--t) both,
    vanish 0.25s ease calc(var(--t) + 0.5s) forwards;
}
.inner-value {
  padding: 0.2vh 0.9vh;
  border-radius: 0.6vh;
  background: var(--sun);
  opacity: 0;
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--t) + 0.6s) both;
}
.arrow {
  width: 0.4vh;
  height: 3vh;
  margin-top: 0.8vh;
  border-radius: 999px;
  background: var(--border);
  animation: appear 0.3s ease 4.5s both;
}
.result {
  margin-top: 0.8vh;
  padding: 0.7vh 1.6vh;
  border-radius: 999px;
  background: var(--mint);
  border: 3px solid var(--text);
  font-size: clamp(0.8rem, 2.4vh, 1.5rem);
  font-weight: 900;
  color: var(--text);
  animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 4.7s both;
}

/* ═══ 3: stopping distance ═════════════════════════════════════════════ */
.stops {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2.4vh;
  padding: 8vh 5% 4vh;
}
.legend {
  display: flex;
  gap: 1vh;
  animation: appear 0.3s ease 0.4s both;
}
.key {
  padding: calc(0.2vh + 0.3em) 0.9vh;
  border-radius: 999px;
  font-size: clamp(0.42rem, 1.15vh, 0.72rem);
  font-weight: 800;
  color: var(--text);
}
.key-reaction {
  background: color-mix(in srgb, var(--coral) 45%, var(--bg));
}
.key-braking {
  background: color-mix(in srgb, var(--sky) 45%, var(--bg));
}
.stop {
  display: flex;
  align-items: center;
  gap: 1.2vh;
  animation: swap-in 0.35s ease var(--t) both;
}
.stop-speed {
  flex: none;
  min-width: 7ch;
  font-size: clamp(0.5rem, 1.4vh, 0.9rem);
  font-weight: 800;
  color: var(--text-dim);
}
.stop-bar {
  position: relative;
  flex: 1;
  display: flex;
  height: 3.2vh;
  border-radius: 0.6vh;
  background: var(--bg-off);
  overflow: hidden;
}
.seg {
  width: 0;
  height: 100%;
  animation: grow-bar 0.7s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--t) + 0.2s) both;
}
.seg-reaction {
  background: var(--coral);
}
.seg-braking {
  background: var(--sky);
}
.stop-total {
  flex: none;
  min-width: 5ch;
  text-align: right;
  font-size: clamp(0.55rem, 1.55vh, 1rem);
  font-weight: 900;
  color: var(--text);
  animation: appear 0.3s ease calc(var(--t) + 0.8s) both;
}

/* ─── Keyframes ──────────────────────────────────────────────────────── */
@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes vanish {
  from { opacity: 1; }
  to { opacity: 0; }
}
@keyframes pop {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes swap-in {
  from { opacity: 0; transform: translateY(-0.8vh); }
  to { opacity: 1; transform: none; }
}
@keyframes mark {
  from { background: transparent; }
  to { background: color-mix(in srgb, var(--sky) 25%, var(--bg)); }
}
@keyframes grow-bar {
  from { width: 0; }
  to { width: var(--w); }
}
@keyframes race {
  from { left: 10%; }
  to { left: 86%; }
}
@keyframes bob {
  from { transform: translateY(0); }
  to { transform: translateY(-0.8vh); }
}
</style>
