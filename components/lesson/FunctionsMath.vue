<script setup lang="ts">
/**
 * "Funktionen für Mathe und Physik". Auto-imported as `<LessonFunctionsMath :stage="1" />`.
 *
 * Four slides (PRE-0104 and its three sub-slides), each a formula from school
 * written once as a function and called several times:
 *
 *   1. circle area: the circle grows with r, the area follows
 *   2. Celsius to Fahrenheit: one thermometer, two scales
 *   3. speed = distance / time: Momo and Bello race the same 100 m
 *   4. functions calling functions: kinetic energy uses square, and the call
 *      stack grows and shrinks
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

/* 1: circles */
const RADII = [1, 2, 3]
const AREAS = ['3.14', '12.57', '28.27']
const circleAt = (k: number) => 0.8 + k * 1.3

/* 2: thermometer — tube spans −10 °C to 110 °C */
const TEMPS = [
  { c: 0, f: '32.0' },
  { c: 37, f: '98.6' },
  { c: 100, f: '212.0' },
]
const tempAt = (k: number) => 0.8 + k * 1.4
const level = (c: number) => (c + 10) / 120

/* 3: race */
const RACE_START = 0.8

const outputDelays = computed(() => {
  switch (props.stage) {
    case 1: return RADII.map((_, k) => circleAt(k) + 0.6)
    case 2: return TEMPS.map((_, k) => tempAt(k) + 0.7)
    case 3: return [RACE_START + 2.6, RACE_START + 2.9]
    case 4: return [4.7]
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

      <!-- ═══ 2: thermometer ═══ -->
      <div v-if="shown(2)" class="part thermo" :class="phase(2)">
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

      <!-- ═══ 3: race ═══ -->
      <div v-if="shown(3)" class="part race" :class="phase(3)">
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

      <!-- ═══ 4: call stack ═══ -->
      <div v-if="stage === 4" class="part stack-scene is-active">
        <code class="stack-title">{{ n.stack }}</code>
        <div class="frame frame-energy">
          <code class="frame-call">{{ n.energy }}(4, 3)</code>
          <span class="frame-body">
            <code class="frame-step step-wait">0.5 * 4 * {{ n.square }}(3)</code>
            <code class="frame-step step-fill">0.5 * 4 * 9</code>
            <code class="frame-step step-return">return 18.0</code>
          </span>
        </div>
        <div class="frame frame-square">
          <code class="frame-call">{{ n.square }}(3)</code>
          <code class="frame-step step-square">return 9</code>
        </div>
        <span class="back back-9"><span class="text-trim">9</span></span>
        <span class="result"><span class="text-trim">18.0</span></span>
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

/* ═══ 2: thermometer ═══════════════════════════════════════════════════ */
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

/* ═══ 3: race ══════════════════════════════════════════════════════════ */
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

/* ═══ 4: call stack ════════════════════════════════════════════════════ */
.stack-title {
  position: absolute;
  top: 7vh;
  left: 8%;
  padding: calc(0.25vh + 0.3em) 1vh;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--border);
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 800;
  color: var(--text-dim);
}
.frame {
  position: absolute;
  left: 8%;
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 0.8vh;
  padding: 1.2vh 1.4vh;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 3px solid var(--text);
  opacity: 0;
}
.frame-energy {
  top: 29vh;
  border-color: var(--lavender);
  animation: push 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both;
}
.frame-square {
  top: 15vh;
  left: 14%;
  border-color: var(--sky);
  animation:
    push 0.45s cubic-bezier(0.22, 1, 0.36, 1) 1.6s both,
    pop-off 0.45s ease-in 3s forwards;
}
.frame-call {
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  color: var(--text);
}
.frame-body {
  display: inline-grid;
}
.frame-step {
  grid-area: 1 / 1;
  justify-self: start;
  padding: calc(0.2vh + 0.3em) 0.8vh;
  border-radius: 0.7vh;
  background: var(--bg-off);
  font-size: clamp(0.55rem, 1.5vh, 1rem);
  font-weight: 700;
  white-space: nowrap;
  color: var(--text-dim);
}
.step-wait {
  animation:
    appear 0.25s ease 0.9s both,
    vanish 0.15s ease 3.2s forwards;
}
.step-fill {
  opacity: 0;
  animation:
    swap-in 0.25s ease 3.25s both,
    vanish 0.15s ease 3.85s forwards;
}
.step-return {
  opacity: 0;
  background: var(--lavender);
  color: #FFFFFF;
  animation: swap-in 0.25s ease 3.9s both;
}
.step-square {
  opacity: 0;
  background: var(--sky);
  color: #FFFFFF;
  animation: swap-in 0.25s ease 2.3s both;
}
.back {
  position: absolute;
  top: 22vh;
  left: 44%;
  display: grid;
  place-items: center;
  width: 4.4vh;
  height: 4.4vh;
  border-radius: 999px;
  background: var(--sun);
  border: 3px solid var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 900;
  color: var(--text);
  opacity: 0;
  animation: fall 0.6s cubic-bezier(0.55, 0, 0.45, 1) 2.7s both;
}
.result {
  position: absolute;
  top: 31vh;
  left: 84%;
  display: grid;
  place-items: center;
  min-width: 7vh;
  height: 5vh;
  padding: 0 1.2vh;
  border-radius: 999px;
  background: var(--mint);
  border: 3px solid var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.7rem, 2vh, 1.3rem);
  font-weight: 900;
  color: var(--text);
  translate: -50% 0;
  opacity: 0;
  animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 4.5s both;
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
/* The mercury rises to 0 °C, then 37 °C, then 100 °C. */
@keyframes temps {
  0% { height: 0; }
  10% { height: calc(var(--l0) * 100%); }
  33% { height: calc(var(--l0) * 100%); }
  43% { height: calc(var(--l1) * 100%); }
  67% { height: calc(var(--l1) * 100%); }
  77%, 100% { height: calc(var(--l2) * 100%); }
}
@keyframes race {
  from { left: 10%; }
  to { left: 86%; }
}
@keyframes bob {
  from { transform: translateY(0); }
  to { transform: translateY(-0.8vh); }
}
@keyframes push {
  from { opacity: 0; transform: translateY(-4vh); }
  to { opacity: 1; transform: none; }
}
@keyframes pop-off {
  from { opacity: 1; transform: none; }
  to { opacity: 0; transform: translateY(-4vh); }
}
@keyframes fall {
  0% { opacity: 0; transform: scale(0.5); }
  25% { opacity: 1; transform: none; }
  85% { opacity: 1; transform: translateY(8vh); }
  100% { opacity: 0; transform: translateY(9vh) scale(0.6); }
}
</style>
