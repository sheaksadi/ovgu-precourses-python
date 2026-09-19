<script setup lang="ts">
/**
 * "Funktionen für Mathe und Physik". Auto-imported as `<LessonFunctionsMath :stage="1" />`.
 *
 * Four slides (PRE-0104 and its three sub-slides), each a formula from school
 * written once as a function:
 *
 *   1. circle area: the circle grows with r, the area follows
 *   2. the same function again, but with `PI` and `quadrat` — so the body reads
 *      like the formula on the board instead of like arithmetic
 *   3. Celsius to Fahrenheit: one thermometer, two scales
 *   4. comments: `c * 9 / 5 + 32` says nothing, so two `#` lines say it, and
 *      Python skips exactly those lines
 *
 * The physics half of this block continues in `FunctionsCombine.vue`.
 *
 * Scenes stay one extra stage to clear away. Beats are computed here and
 * handed to CSS as `--t`. Words come from `functions.math.*` in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3 | 4

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

const stages = computed(() => tm<Stage[]>('functions.math.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const n = computed(() => tm<Record<'square' | 'energy' | 'stack' | 'track', string>>('functions.math.names'))
const w = computed(() => tm<Record<'before' | 'after' | 'reads' | 'human' | 'skipped' | 'runs', string>>('functions.math.words'))

/* 1: circles */
const RADII = [1, 2, 3]
const AREAS = ['3.14', '12.57', '28.27']
const circleAt = (k: number) => 0.8 + k * 1.3

/* 3: thermometer — tube spans −10 °C to 110 °C */
const TEMPS = [
  { c: 0, f: '32.0' },
  { c: 37, f: '98.6' },
  { c: 100, f: '212.0' },
]
const tempAt = (k: number) => 0.8 + k * 1.4
const level = (c: number) => (c + 10) / 120

/**
 * 4: the lesson's own code, shortened to what fits the scene card. The real
 * comments are longer and live in the code panel; these carry the same point.
 */
const NOTE_LINES = computed(() => tm<{ text: string, note: boolean }[]>('functions.math.noteLines'))
/** The reader passes one line per beat, after they have all arrived. */
const readAt = (k: number) => 1.8 + k * 0.7

const outputDelays = computed(() => {
  switch (props.stage) {
    case 1: return RADII.map((_, k) => circleAt(k) + 0.6)
    case 2: return [4.4]
    case 3: return TEMPS.map((_, k) => tempAt(k) + 0.7)
    case 4: return [readAt(NOTE_LINES.value.length) + 0.4]
    default: return undefined
  }
})

const phase = (own: number) => (props.stage === own ? 'is-active' : props.stage === own + 1 ? 'is-leaving' : '')
const shown = (own: number) => props.stage === own || props.stage === own + 1
</script>

<template>
  <LessonShell
    :eyebrow="t('functions.math.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :file="t('functions.math.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    dense
    :output-label="t('functions.math.output')"
    :no-output="t('functions.math.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- ═══ 1: circle area ═══ -->
      <div v-if="shown(1)" class="part circles" :class="phase(1)">
        <div class="circle-stage">
          <span
            v-for="(r, k) in RADII"
            :key="k"
            class="circle"
            :style="{ '--r': r, '--t': `${circleAt(k)}s`, '--u': `${k < RADII.length - 1 ? circleAt(k + 1) : 999}s` }"
          >
            <span class="radius"></span>
            <code class="radius-label">r = {{ r }}</code>
          </span>
        </div>
        <span class="area">
          <code class="area-label">A ≈</code>
          <span class="stack">
            <code
              v-for="(area, k) in AREAS"
              :key="k"
              class="area-value"
              :style="{ '--t': `${circleAt(k) + 0.5}s`, '--u': `${k < AREAS.length - 1 ? circleAt(k + 1) + 0.5 : 999}s` }"
            >{{ area }}</code>
          </span>
        </span>
      </div>

      <!-- ═══ 2: the same function, written to be read ═══ -->
      <div v-if="stage === 2" class="part rewrite is-active">
        <div class="formula">
          <code class="formula-flat">A =</code>
          <code class="formula-part is-pi">π</code>
          <code class="formula-flat">·</code>
          <code class="formula-part is-sq">r²</code>
        </div>

        <span class="line-label label-before">{{ w.before }}</span>
        <code class="old-line">
          <span class="is-pi-ink">3.14159</span> * <span class="is-sq-ink">r * r</span>
        </code>

        <div class="maps">
          <code class="map map-pi"><span class="map-from">3.14159</span> → <span class="map-to">PI</span></code>
          <code class="map map-sq"><span class="map-from">r * r</span> → <span class="map-to">{{ n.square }}(r)</span></code>
        </div>

        <span class="line-label label-after">{{ w.after }}</span>
        <code class="new-line">
          <span class="is-pi-ink">PI</span> * <span class="is-sq-ink">{{ n.square }}(r)</span>
        </code>
        <span class="reads">{{ w.reads }}</span>
      </div>

      <!-- ═══ 3: thermometer ═══ -->
      <div v-if="shown(3)" class="part thermo" :class="phase(3)">
        <div class="tube">
          <span class="fill" :style="{ '--l0': level(0), '--l1': level(37), '--l2': level(100) }"></span>
          <span v-for="(temp, k) in TEMPS" :key="k" class="tick" :style="{ '--l': level(temp.c) }">
            <code class="tick-c">{{ temp.c }} °C</code>
            <code class="tick-f">{{ temp.f }} °F</code>
          </span>
        </div>
        <span class="bulb"></span>
        <span class="convert">
          <span class="stack">
            <code
              v-for="(temp, k) in TEMPS"
              :key="k"
              class="convert-value"
              :style="{ '--t': `${tempAt(k) + 0.6}s`, '--u': `${k < TEMPS.length - 1 ? tempAt(k + 1) + 0.6 : 999}s` }"
            >{{ temp.c }} → {{ temp.f }}</code>
          </span>
        </span>
      </div>

      <!-- ═══ 4: what Python reads, and what it steps over ═══ -->
      <div v-if="stage === 4" class="part notes is-active">
        <div class="sheet">
          <span
            v-for="(line, k) in NOTE_LINES"
            :key="k"
            class="note-line"
            :class="line.note ? 'is-note' : 'is-code'"
            :style="{ '--t': `${0.4 + k * 0.15}s`, '--r': `${readAt(k)}s` }"
          >
            <code class="note-text">{{ line.text }}</code>
            <span class="note-tag">{{ line.note ? w.skipped : w.runs }}</span>
          </span>
        </div>
        <span class="hash">
          <code class="hash-mark">#</code>
          <span class="hash-says">{{ w.human }}</span>
        </span>
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

/* A value that replaces the one before it in the same place. */
.area-value,
.convert-value {
  grid-area: 1 / 1;
  opacity: 0;
}
.is-active .area-value,
.is-active .convert-value {
  animation:
    swap-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both,
    vanish 0.1s ease var(--u) forwards;
}
.is-leaving .area-value:last-child,
.is-leaving .convert-value:last-child {
  opacity: 1;
}

/* ═══ 1: circles ═══════════════════════════════════════════════════════ */
.circle-stage {
  position: absolute;
  top: 25vh;
  left: 50%;
  width: 0;
  height: 0;
}
.circle {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(var(--r) * 6.6vh);
  height: calc(var(--r) * 6.6vh);
  translate: -50% -50%;
  border-radius: 999px;
  background: color-mix(in srgb, var(--sky) 45%, var(--bg));
  border: 3px solid var(--text);
  opacity: 0;
}
.is-active .circle {
  animation:
    grow-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) var(--t) both,
    vanish 0.15s ease var(--u) forwards;
}
.is-leaving .circle:last-child {
  opacity: 1;
}
.radius {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 3px;
  background: var(--coral);
  translate: 0 -50%;
}
.radius-label {
  position: absolute;
  top: calc(50% - 3.6vh);
  left: 58%;
  padding: calc(0.2vh + 0.3em) 0.7vh;
  border-radius: 999px;
  background: var(--coral);
  font-size: clamp(0.5rem, 1.3vh, 0.9rem);
  font-weight: 800;
  white-space: nowrap;
  color: #FFFFFF;
}
.area {
  position: absolute;
  left: 50%;
  bottom: 2.6vh;
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 0.6vh 0.6vh 0.6vh 1.2vh;
  border-radius: 999px;
  background: var(--text);
  translate: -50% 0;
}
.area-label {
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  font-weight: 800;
  color: var(--bg);
}
.area-value {
  min-width: 4.5em;
  padding: 0.3vh 1vh;
  border-radius: 999px;
  background: var(--sun);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  text-align: center;
  color: var(--text);
}

/* ═══ 2: the rewrite ═══════════════════════════════════════════════════
   The formula on top, the old line under it, the two swaps, the new line.
   Colour carries the mapping: π and PI coral, r² and quadrat(r) sky. */
.rewrite {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8vh 4% 2vh;
}
.formula {
  display: flex;
  align-items: baseline;
  gap: 0.8vh;
  animation: swap-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
}
.formula-flat,
.formula-part {
  font-size: clamp(1rem, 3.4vh, 2.2rem);
  font-weight: 800;
  color: var(--text);
}
.formula-part {
  padding: 0 0.6vh;
  border-radius: 0.6vh;
}
.formula-part.is-pi {
  background: color-mix(in srgb, var(--coral) 28%, var(--bg));
}
.formula-part.is-sq {
  background: color-mix(in srgb, var(--sky) 32%, var(--bg));
}

.line-label {
  margin-top: 2.4vh;
  font-size: clamp(0.42rem, 1.1vh, 0.7rem);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.label-before {
  animation: appear 0.3s ease 0.9s both;
}
.label-after {
  margin-top: 2.2vh;
  animation: appear 0.3s ease 3.6s both;
}

.old-line,
.new-line {
  margin-top: 0.6vh;
  padding: 0.7vh 1.2vh;
  border-radius: 0.9vh;
  font-weight: 800;
  white-space: nowrap;
}
.old-line {
  background: var(--bg-off);
  border: 2px dashed var(--border);
  font-size: clamp(0.62rem, 1.8vh, 1.15rem);
  color: var(--text-dim);
  animation: swap-in 0.35s ease 1s both;
}
.new-line {
  background: var(--bg);
  border: 3px solid var(--text);
  font-size: clamp(0.72rem, 2.1vh, 1.35rem);
  color: var(--text);
  animation: pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 3.7s both;
}
.is-pi-ink {
  color: var(--coral);
}
.is-sq-ink {
  color: var(--sky);
}
.old-line .is-pi-ink,
.old-line .is-sq-ink {
  opacity: 0.85;
}

.maps {
  margin-top: 1.6vh;
  display: flex;
  flex-direction: column;
  gap: 0.7vh;
}
.map {
  padding: 0.45vh 1vh;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--border);
  font-size: clamp(0.55rem, 1.5vh, 0.95rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
}
.map-from {
  color: var(--text-muted);
}
.map-pi {
  border-color: var(--coral);
  animation: swap-in 0.35s ease 1.9s both;
}
.map-pi .map-to {
  color: var(--coral);
}
.map-sq {
  border-color: var(--sky);
  animation: swap-in 0.35s ease 2.7s both;
}
.map-sq .map-to {
  color: var(--sky);
}

.reads {
  margin-top: 1.4vh;
  padding: calc(0.3vh + 0.3em) 1.1vh;
  border-radius: 999px;
  background: var(--mint);
  font-size: clamp(0.48rem, 1.3vh, 0.85rem);
  font-weight: 800;
  color: var(--text);
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 4.4s both;
}

/* ═══ 3: thermometer ═══════════════════════════════════════════════════ */
.tube {
  position: absolute;
  top: 7vh;
  left: 40%;
  width: 4.4vh;
  height: 30vh;
  translate: -50% 0;
  border-radius: 999px 999px 0 0;
  background: var(--bg);
  border: 3px solid var(--text);
  border-bottom: none;
}
.fill {
  position: absolute;
  left: 0.6vh;
  right: 0.6vh;
  bottom: 0;
  height: 0;
  border-radius: 999px 999px 0 0;
  background: var(--coral);
}
.is-active .fill {
  animation: temps 4.2s cubic-bezier(0.45, 0, 0.55, 1) 0.8s both;
}
.is-leaving .fill {
  height: calc(var(--l2) * 100%);
}
.tick {
  position: absolute;
  left: -1vh;
  right: -1vh;
  bottom: calc(var(--l) * 100%);
  height: 2px;
  background: var(--text);
}
.tick-c,
.tick-f {
  position: absolute;
  top: 50%;
  translate: 0 -50%;
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
}
.tick-c {
  right: calc(100% + 0.8vh);
}
.tick-f {
  left: calc(100% + 0.8vh);
  color: var(--sky);
}
.bulb {
  position: absolute;
  top: 35.5vh;
  left: 40%;
  width: 8vh;
  height: 8vh;
  translate: -50% 0;
  border-radius: 999px;
  background: var(--coral);
  border: 3px solid var(--text);
}
.convert {
  position: absolute;
  top: 20vh;
  left: 78%;
  translate: -50% 0;
  padding: 0.6vh;
  border-radius: 1.2vh;
  background: var(--text);
}
.convert-value {
  padding: 0.5vh 1.1vh;
  border-radius: 0.8vh;
  background: var(--bg);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  white-space: nowrap;
  text-align: center;
  color: var(--text);
}

/* ═══ 4: comments ══════════════════════════════════════════════════════
   The four lines arrive, then Python passes over them one per beat: the
   code lines light up, the `#` lines get stepped over and stay dim. */
.notes {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3vh;
  padding: 6vh 4% 2vh;
}
.sheet {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8vh;
  padding: 1.6vh 1.4vh;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 3px solid var(--text);
}
.note-line {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1vh;
  padding: 0.6vh 0.9vh;
  border-radius: 0.8vh;
  border: 2px solid transparent;
  animation: swap-in 0.3s ease var(--t) both;
}
.note-text {
  font-size: clamp(0.5rem, 1.45vh, 0.95rem);
  font-weight: 700;
  white-space: nowrap;
  color: var(--text);
}
.note-tag {
  flex: none;
  padding: calc(0.15vh + 0.25em) 0.7vh;
  border-radius: 999px;
  font-size: clamp(0.38rem, 1vh, 0.62rem);
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0;
  animation: appear 0.3s ease var(--r) both;
}
/* A line Python runs: it lights up as the reader reaches it. */
.is-code {
  animation:
    swap-in 0.3s ease var(--t) both,
    light 0.5s ease var(--r) both;
}
.is-code .note-tag {
  background: var(--mint);
  color: var(--text);
}
/* A note for people: it fades back as the reader steps over it. The fade sits
   on the text, not the row, so it cannot fight the row's own entrance. */
.is-note .note-text {
  color: var(--text-muted);
  animation: fade-back 0.5s ease var(--r) both;
}
.is-note .note-tag {
  background: var(--bg-off);
  border: 2px solid var(--border);
  color: var(--text-muted);
}

.hash {
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 0.7vh 1.3vh;
  border-radius: 999px;
  background: var(--sun);
  animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.9s both;
}
.hash-mark {
  font-size: clamp(0.8rem, 2.4vh, 1.5rem);
  font-weight: 900;
  color: var(--text);
}
.hash-says {
  font-size: clamp(0.5rem, 1.4vh, 0.9rem);
  font-weight: 800;
  color: var(--text);
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
@keyframes grow-in {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: none; }
}
@keyframes light {
  from { background: transparent; border-color: transparent; }
  to { background: color-mix(in srgb, var(--mint) 20%, var(--bg)); border-color: var(--mint); }
}
@keyframes fade-back {
  from { opacity: 1; }
  to { opacity: 0.45; }
}
/* The mercury rises to 0 °C, then 37 °C, then 100 °C. */
@keyframes temps {
  0% { height: 0; }
  10% { height: calc(var(--l0) * 100%); }
  33% { height: calc(var(--l0) * 100%); }
  43% { height: calc(var(--l1) * 100%); }
  67% { height: calc(var(--l1) * 100%); }
  77%, 100% { height: calc(var(--l2) * 100%); }
}
</style>
