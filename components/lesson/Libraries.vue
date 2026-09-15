<script setup lang="ts">
/**
 * Libraries for AI and ML: "Werkzeuge für Daten". Auto-imported as `<LessonLibraries :stage="1" />`.
 *
 * Five slides (PRE-0127 and its four sub-slides):
 *
 *   1. pip install: the packages download in PyCharm's terminal
 *   2. NumPy: a list needs a loop, an array doubles every value at once
 *   3. pandas: a table of animals, filtered by age
 *   4. matplotlib: a bar chart draws itself in its own window
 *   5. an outlook on machine learning: a model learns y = 2 · x from four points
 *
 * Scenes stay one extra stage to clear away. Words come from `libraries.*` in
 * `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3 | 4 | 5

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

const stages = computed(() => tm<Stage[]>('libraries.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const labels = computed(() => tm<Record<'loop' | 'array' | 'age' | 'chartTitle' | 'learned', string>>('libraries.labels'))

const PACKAGES = ['numpy', 'pandas', 'matplotlib']
const WEIGHTS = [12, 30, 8, 21]
const ANIMALS = [
  { name: 'Momo', age: 3 },
  { name: 'Bello', age: 5 },
  { name: 'Hoppel', age: 2 },
]
const POINTS = [[1, 2], [2, 4], [3, 6], [4, 8]]

/** Chart coordinates for the ML scene: x 0–6 → 10–95, y 0–12 → 55–5. */
const px = (x: number) => 10 + (x / 6) * 85
const py = (y: number) => 55 - (y / 12) * 50

const outputDelays = computed(() => {
  switch (props.stage) {
    case 1: return [3.6]
    case 2: return [2.6, 3.2]
    case 3: return [2.4, 2.6, 2.8]
    case 4: return [3.0]
    case 5: return [3.4]
    default: return undefined
  }
})

const phase = (own: number) => (props.stage === own ? 'is-active' : props.stage === own + 1 ? 'is-leaving' : '')
const shown = (own: number) => props.stage === own || props.stage === own + 1
</script>

<template>
  <LessonShell
    :eyebrow="t('libraries.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :file="t('libraries.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    :stack-output="stage === 3"
    dense
    :output-label="t('libraries.output')"
    :no-output="t('libraries.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- ═══ 1: pip install ═══ -->
      <div v-if="shown(1)" class="part install" :class="phase(1)">
        <div class="terminal">
          <span class="terminal-bar"><i></i><i></i><i></i><code>Terminal</code></span>
          <code class="prompt">$ <span class="typed">pip install numpy pandas matplotlib</span></code>
          <div v-for="(pkg, k) in PACKAGES" :key="pkg" class="download" :style="{ '--k': k }">
            <code class="pkg">{{ pkg }}</code>
            <span class="bar"><i></i></span>
          </div>
          <code class="done">Successfully installed numpy pandas matplotlib</code>
        </div>
      </div>

      <!-- ═══ 2: NumPy ═══ -->
      <div v-if="shown(2)" class="part numpy" :class="phase(2)">
        <div v-for="row in ['loop', 'array']" :key="row" class="row" :class="`row-${row}`">
          <code class="row-label">{{ row === 'loop' ? labels.loop : labels.array }}</code>
          <div class="cells">
            <span v-for="(w, k) in WEIGHTS" :key="k" class="cell" :style="{ '--k': k }">
              <code class="face before">{{ w }}</code>
              <code class="face after">{{ w * 2 }}</code>
            </span>
          </div>
        </div>
        <code class="mean">mean() → 17.75</code>
      </div>

      <!-- ═══ 3: pandas ═══ -->
      <div v-if="shown(3)" class="part pandas" :class="phase(3)">
        <code class="filter">tiere["{{ labels.age }}"] &gt; 2</code>
        <div class="table">
          <code class="th"></code>
          <code class="th">name</code>
          <code class="th">{{ labels.age }}</code>
          <code class="th"></code>
          <template v-for="(animal, k) in ANIMALS" :key="animal.name">
            <code class="td idx" :class="{ 'is-out': animal.age <= 2 }" :style="{ '--k': k }">{{ k }}</code>
            <code class="td" :class="{ 'is-out': animal.age <= 2 }" :style="{ '--k': k }">{{ animal.name }}</code>
            <code class="td num" :class="{ 'is-out': animal.age <= 2 }" :style="{ '--k': k }">{{ animal.age }}</code>
            <code class="td mark" :class="animal.age > 2 ? 'is-in' : 'is-out'" :style="{ '--k': k }">{{ animal.age > 2 ? '✓' : '✗' }}</code>
          </template>
        </div>
      </div>

      <!-- ═══ 4: matplotlib ═══ -->
      <div v-if="shown(4)" class="part chart" :class="phase(4)">
        <div class="figure">
          <span class="figure-bar"><code>Figure 1</code></span>
          <code class="chart-title">{{ labels.chartTitle }}</code>
          <div class="plot">
            <div v-for="(animal, k) in ANIMALS" :key="animal.name" class="plot-col" :style="{ '--k': k, '--h': animal.age / 5 }">
              <span class="plot-bar"></span>
              <code class="plot-label">{{ animal.name }}</code>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ 5: machine learning ═══ -->
      <div v-if="stage === 5" class="part ml is-active">
        <svg class="axes" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
          <path class="axis" d="M 10 55 H 96 M 10 55 V 3" />
          <path class="fit" :d="`M ${px(0.5)} ${py(1)} L ${px(5.6)} ${py(11.2)}`" />
          <path class="guide" :d="`M ${px(5)} 55 V ${py(10)} H 10`" />
        </svg>
        <!-- Points share the chart's box, so their percentages match the SVG. -->
        <div class="plot-area">
          <span
            v-for="(p, k) in POINTS"
            :key="k"
            class="dot"
            :style="{ left: `${px(p[0]!)}%`, top: `${py(p[1]!) / 60 * 100}%`, '--k': k }"
          ></span>
          <span class="dot predicted" :style="{ left: `${px(5)}%`, top: `${py(10) / 60 * 100}%` }"></span>
          <code class="predicted-label" :style="{ left: `${px(5)}%`, top: `${py(10) / 60 * 100}%` }">x = 5 → 10</code>
        </div>
        <code class="learned">{{ labels.learned }}</code>
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

.tally {
  position: absolute;
  top: 1.6vh;
  left: 50%;
  z-index: 3;
  translate: -50% 0;
  padding: calc(0.4vh + 0.3em) 1.3vh;
  border-radius: 999px;
  background: var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}

.is-leaving {
  animation: vanish 0.3s ease both;
}

/* ═══ 1: terminal ══════════════════════════════════════════════════════ */
.terminal {
  position: absolute;
  top: 7vh;
  left: 5%;
  right: 5%;
  bottom: 4vh;
  display: flex;
  flex-direction: column;
  gap: 1.6vh;
  padding: 0 2vh 2vh;
  overflow: hidden;
  border-radius: 1.6vh;
  background: var(--code-bg);
  border: 2px solid var(--text);
  color: var(--code-text);
}
.terminal-bar {
  display: flex;
  align-items: center;
  gap: 0.7vh;
  margin: 0 -2vh;
  padding: 1vh 1.6vh;
  background: #181825;
}
.terminal-bar i {
  width: 1.1vh;
  height: 1.1vh;
  border-radius: 999px;
  background: var(--coral);
}
.terminal-bar i:nth-child(2) { background: var(--sun); }
.terminal-bar i:nth-child(3) { background: var(--mint); }
.terminal-bar code {
  margin-left: 1vh;
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  font-weight: 700;
  color: #7F849C;
}
.prompt {
  font-size: clamp(0.55rem, 1.6vh, 1.05rem);
  white-space: nowrap;
}
.typed {
  display: inline-block;
  width: 0;
  overflow: hidden;
  vertical-align: bottom;
  white-space: nowrap;
}
.install.is-active .typed {
  animation: type 1.2s steps(36) 0.5s both;
}
.install.is-leaving .typed {
  width: 36ch;
}
.download {
  display: grid;
  grid-template-columns: 12ch 1fr;
  align-items: center;
  gap: 1.4vh;
  opacity: 0;
}
.pkg {
  font-size: clamp(0.5rem, 1.45vh, 0.95rem);
  color: #89B4FA;
}
.bar {
  height: 1vh;
  overflow: hidden;
  border-radius: 999px;
  background: #313244;
}
.bar i {
  display: block;
  height: 100%;
  background: var(--mint);
  transform-origin: left center;
  transform: scaleX(0);
}
.install.is-active .download {
  animation: appear 0.2s ease calc(1.9s + var(--k) * 0.5s) both;
}
.install.is-active .bar i {
  animation: grow-x 0.45s ease-out calc(1.95s + var(--k) * 0.5s) both;
}
.done {
  font-size: clamp(0.5rem, 1.45vh, 0.95rem);
  color: #A6E3A1;
  opacity: 0;
}
.install.is-active .done {
  animation: appear 0.3s ease 3.5s both;
}
.install.is-leaving .download,
.install.is-leaving .done {
  opacity: 1;
}
.install.is-leaving .bar i {
  transform: none;
}

/* ═══ 2: NumPy ═════════════════════════════════════════════════════════ */
.row {
  position: absolute;
  left: 6%;
  right: 6%;
  display: flex;
  flex-direction: column;
  gap: 1vh;
}
.row-loop {
  top: 8vh;
}
.row-array {
  top: 23vh;
}
.row-label {
  font-size: clamp(0.55rem, 1.5vh, 1rem);
  font-weight: 800;
  color: var(--text-dim);
}
.cells {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3%;
  padding: 1.2vh;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 3px solid var(--text);
}
.row-array .cells {
  border-color: var(--sky);
}
.cell {
  display: inline-grid;
  justify-items: center;
}
.face {
  grid-area: 1 / 1;
  padding: 0.8vh 0;
  font-size: clamp(0.7rem, 2.2vh, 1.45rem);
  font-weight: 900;
  color: var(--text);
}
.after {
  opacity: 0;
  color: var(--coral);
}
.numpy.is-active .row-loop .before {
  animation: vanish 0.15s ease calc(0.8s + var(--k) * 0.45s) both;
}
.numpy.is-active .row-loop .after {
  animation: swap-in 0.25s ease calc(0.9s + var(--k) * 0.45s) both;
}
.numpy.is-active .row-array .before {
  animation: vanish 0.15s ease 2.6s both;
}
.numpy.is-active .row-array .after {
  animation: swap-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 2.7s both;
}
.numpy.is-leaving .before {
  opacity: 0;
}
.numpy.is-leaving .after {
  opacity: 1;
}
.mean {
  position: absolute;
  left: 50%;
  bottom: 4vh;
  padding: calc(0.4vh + 0.3em) 1.2vh;
  border-radius: 999px;
  background: var(--mint);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  white-space: nowrap;
  color: #FFFFFF;
  translate: -50% 0;
  opacity: 0;
}
.numpy.is-active .mean {
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 3.3s both;
}
.numpy.is-leaving .mean {
  opacity: 1;
}

/* ═══ 3: pandas ════════════════════════════════════════════════════════ */
.filter {
  position: absolute;
  top: 6.5vh;
  left: 50%;
  padding: calc(0.4vh + 0.3em) 1.2vh;
  border-radius: 999px;
  background: var(--lavender);
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  font-weight: 800;
  white-space: nowrap;
  color: #FFFFFF;
  translate: -50% 0;
  opacity: 0;
}
.pandas.is-active .filter {
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 1s both;
}
.table {
  position: absolute;
  top: 13vh;
  left: 12%;
  right: 12%;
  display: grid;
  grid-template-columns: 3fr 6fr 5fr 2fr;
  border-radius: 1.4vh;
  overflow: hidden;
  background: var(--bg);
  border: 3px solid var(--text);
}
.th,
.td {
  padding: 1.2vh 1.4vh;
  font-size: clamp(0.6rem, 1.8vh, 1.2rem);
  font-weight: 800;
  color: var(--text);
  border-bottom: 1px solid var(--border);
}
.th {
  background: var(--bg-off);
  color: var(--text-dim);
}
.idx {
  color: var(--text-muted);
}
.num {
  text-align: right;
}
.mark {
  text-align: center;
  opacity: 0;
}
.mark.is-in {
  color: var(--mint);
}
.mark.is-out {
  color: var(--coral);
}
.pandas.is-active .mark {
  animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) calc(1.5s + var(--k) * 0.25s) both;
}
.pandas.is-active .td.is-out:not(.mark) {
  animation: strike 0.4s ease 2.3s both;
}
.pandas.is-leaving .mark {
  opacity: 1;
}
.pandas.is-leaving .td.is-out:not(.mark) {
  opacity: 0.3;
}

/* ═══ 4: matplotlib ════════════════════════════════════════════════════ */
.figure {
  position: absolute;
  top: 6.5vh;
  left: 10%;
  right: 10%;
  bottom: 3vh;
  display: flex;
  flex-direction: column;
  border-radius: 1.4vh;
  overflow: hidden;
  background: #FFFFFF;
  border: 2px solid var(--text);
  animation: pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
}
.chart.is-leaving .figure {
  animation: none;
}
.figure-bar {
  padding: 0.8vh 1.4vh;
  background: var(--bg-off);
  border-bottom: 1px solid var(--border);
}
.figure-bar code {
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  font-weight: 700;
  color: var(--text-dim);
}
.chart-title {
  margin-top: 1.4vh;
  text-align: center;
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  color: var(--text);
}
.plot {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: end;
  gap: 8%;
  margin: 1.6vh 12% 4.4vh;
  border-left: 2px solid var(--text);
  border-bottom: 2px solid var(--text);
  padding: 0 6%;
}
.plot-col {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}
.plot-bar {
  width: 100%;
  height: calc(var(--h) * 90%);
  background: #1F77B4;
  transform-origin: bottom center;
}
.chart.is-active .plot-bar {
  animation: grow-y 0.6s cubic-bezier(0.22, 1, 0.36, 1) calc(1.2s + var(--k) * 0.35s) both;
}
.plot-label {
  position: absolute;
  top: calc(100% + 0.8vh);
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 700;
  color: var(--text);
}

/* ═══ 5: machine learning ══════════════════════════════════════════════ */
.axes {
  position: absolute;
  top: 7vh;
  left: 6%;
  width: 88%;
  height: 34vh;
  overflow: visible;
}
.axis {
  fill: none;
  stroke: var(--text);
  stroke-width: 0.5;
}
.fit {
  fill: none;
  stroke: var(--coral);
  stroke-width: 0.8;
  stroke-linecap: round;
  stroke-dasharray: 120;
  stroke-dashoffset: 120;
  animation: draw 1s cubic-bezier(0.45, 0, 0.55, 1) 1.6s both;
}
.guide {
  fill: none;
  stroke: var(--text-muted);
  stroke-width: 0.35;
  stroke-dasharray: 1.2 1.2;
  opacity: 0;
  animation: appear 0.3s ease 2.8s both;
}
.plot-area {
  position: absolute;
  top: 7vh;
  left: 6%;
  width: 88%;
  height: 34vh;
}
.dot {
  position: absolute;
  z-index: 2;
  width: 2.4vh;
  height: 2.4vh;
  border-radius: 999px;
  background: var(--sky);
  border: 2px solid var(--text);
  translate: -50% -50%;
  opacity: 0;
  animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) calc(0.5s + var(--k) * 0.25s) both;
}
.dot.predicted {
  width: 3vh;
  height: 3vh;
  background: var(--sun);
  animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 3s both;
}
.predicted-label {
  position: absolute;
  z-index: 2;
  padding: calc(0.3vh + 0.3em) 0.9vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.5rem, 1.4vh, 0.95rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
  translate: -100% -170%;
  opacity: 0;
  animation: pop 0.35s ease 3.3s both;
}
.learned {
  position: absolute;
  left: 50%;
  bottom: 2.4vh;
  padding: calc(0.4vh + 0.3em) 1.2vh;
  border-radius: 999px;
  background: var(--mint);
  font-size: clamp(0.55rem, 1.6vh, 1.05rem);
  font-weight: 800;
  white-space: nowrap;
  color: #FFFFFF;
  translate: -50% 0;
  opacity: 0;
  animation: rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) 3.8s both;
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
@keyframes rise {
  from { opacity: 0; transform: translateY(1.4vh); }
  to { opacity: 1; transform: none; }
}
@keyframes swap-in {
  from { opacity: 0; transform: translateY(-0.8vh); }
  to { opacity: 1; transform: none; }
}
@keyframes type {
  from { width: 0; }
  to { width: 36ch; }
}
@keyframes grow-x {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes grow-y {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}
@keyframes strike {
  from { opacity: 1; }
  to { opacity: 0.3; }
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}
</style>
