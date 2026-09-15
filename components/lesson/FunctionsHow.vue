<script setup lang="ts">
/**
 * "Wie Funktionen arbeiten". Auto-imported as `<LessonFunctionsHow :stage="1" />`.
 *
 * Five slides (PRE-0099 and its four sub-slides):
 *
 *   1. a call jumps into the function, runs it, and comes back
 *   2. a parameter: a ball carries the value into the machine, `x` holds it
 *   3. return: the result rolls out of the chute into a box outside
 *   4. print shows, return hands back — one machine leaves its box empty (None)
 *   5. several parameters and a default value that fills in by itself
 *
 * A function is drawn as a machine: funnel on top for the arguments, a screen
 * for what it prints, a chute for what it returns. Scenes stay one extra stage
 * to clear away. Beats are computed here and handed to CSS as `--t`. Words come
 * from `functions.how.*` in `locales/`.
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

const stages = computed(() => tm<Stage[]>('functions.how.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const n = computed(() => tm<Record<'hello' | 'double' | 'result' | 'show' | 'give' | 'feed' | 'animal' | 'food' | 'start' | 'end' | 'hi' | 'gets', string>>('functions.how.names'))
const pets = computed(() => tm<Array<{ animal: string, food?: string }>>('functions.how.pets'))
const defaultFood = computed(() => t('functions.how.defaultFood'))

/* 2 */
const doubleAt = (k: number) => 0.8 + k * 1.8
const DOUBLES = [4, 10]
/* 5 */
const feedAt = (k: number) => 0.8 + k * 2.2

const outputDelays = computed(() => {
  switch (props.stage) {
    case 1: return [0.8, 2.4, 3.8]
    case 2: return DOUBLES.map((_, k) => doubleAt(k) + 1.0)
    case 3: return [3.3]
    case 4: return [1.5, 4.0]
    case 5: return [feedAt(0) + 1.1, feedAt(1) + 1.1]
    default: return undefined
  }
})

const phase = (own: number) => (props.stage === own ? 'is-active' : props.stage === own + 1 ? 'is-leaving' : '')
const shown = (own: number) => props.stage === own || props.stage === own + 1
</script>

<template>
  <LessonShell
    :eyebrow="t('functions.how.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :file="t('functions.how.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    dense
    :output-label="t('functions.how.output')"
    :no-output="t('functions.how.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- ═══ 1: the call jumps ═══ -->
      <div v-if="shown(1)" class="part jump" :class="phase(1)">
        <div class="track">
          <code class="line line-1"><b>1</b> print("{{ n.start }}")</code>
          <code class="line line-2"><b>2</b> {{ n.hello }}()</code>
          <code class="line line-3"><b>4</b> print("{{ n.end }}")</code>
        </div>
        <div class="def-card">
          <ArtSprite name="book" color="sky" accent="sun" :size="96" class="def-book" />
          <code class="def-head">def {{ n.hello }}():</code>
          <code class="line line-body"><b>3</b> print("{{ n.hi }}")</code>
        </div>
        <svg class="jump-arrows" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <!-- In % of the scene: from the right edge of hallo() to line 3 and back again. -->
          <path class="arrow-there" d="M 41 45.5 C 52 45.5, 51 37, 62 37" />
          <path class="arrow-back" d="M 62 41 C 51 41, 52 49.5, 41 49.5" />
        </svg>
        <span class="runner"></span>
      </div>

      <!-- ═══ 2–3: one machine ═══ -->
      <div v-if="stage >= 2 && stage <= 4" class="part single" :class="stage === 4 ? 'is-leaving' : 'is-active'">
        <div class="machine">
          <span class="funnel"></span>
          <code class="machine-name">{{ n.double }}(x)</code>
          <span class="inside">
            <template v-if="stage === 2">
              <code
                v-for="(value, k) in DOUBLES"
                :key="k"
                class="param"
                :style="{ '--t': `${doubleAt(k) + 0.6}s`, '--u': `${k === 0 ? doubleAt(1) + 0.6 : 999}s` }"
              >x = {{ value }}</code>
            </template>
            <code v-else class="param" style="--t: 1.4s; --u: 999s;">x = 4</code>
          </span>
          <span class="chute"></span>
        </div>

        <!-- what it prints -->
        <div v-if="stage === 2" class="screen">
          <span class="screen-label">print</span>
          <span class="stack">
            <span
              v-for="(value, k) in DOUBLES"
              :key="k"
              class="screen-value"
              :style="{ '--t': `${doubleAt(k) + 1.0}s`, '--u': `${k === 0 ? doubleAt(1) + 1.0 : 999}s` }"
            >{{ value * 2 }}</span>
          </span>
        </div>

        <!-- the arguments -->
        <template v-if="stage === 2">
          <span v-for="(value, k) in DOUBLES" :key="k" class="ball ball-in" :style="{ '--t': `${doubleAt(k)}s` }">
            <span class="text-trim">{{ value }}</span>
          </span>
        </template>
        <template v-else>
          <span class="ball ball-in" style="--t: 0.8s;"><span class="text-trim">4</span></span>
          <span class="ball ball-out" style="--t: 1.8s;"><span class="text-trim">8</span></span>
          <div class="result-box">
            <div class="result-art">
              <ArtSprite name="box" color="mint" accent="text-muted" :size="96" class="fill" />
              <code class="result-value" style="--t: 2.4s;">8</code>
            </div>
            <code class="result-name">{{ n.result }}</code>
          </div>
          <code class="plus" style="--t: 2.9s;">{{ n.result }} + 1 → 9</code>
        </template>
      </div>

      <!-- ═══ 4: print vs return ═══ -->
      <div v-if="shown(4)" class="part versus" :class="phase(4)">
        <div v-for="side in ['show', 'give']" :key="side" class="side" :class="`side-${side}`">
          <div class="mini">
            <span class="funnel"></span>
            <code class="machine-name">{{ side === 'show' ? n.show : n.give }}(x)</code>
            <code class="mini-body">{{ side === 'show' ? 'print(x * 2)' : 'return x * 2' }}</code>
            <span class="chute"></span>
          </div>
          <span class="ball ball-in"><span class="text-trim">4</span></span>
          <span v-if="side === 'show'" class="mini-screen"><span class="text-trim">8</span></span>
          <span v-else class="ball ball-out"><span class="text-trim">8</span></span>
          <div class="mini-box">
            <div class="mini-art">
              <ArtSprite name="box" :color="side === 'show' ? 'text-muted' : 'mint'" accent="text-muted" :size="96" class="fill" />
              <code class="mini-value" :class="{ 'is-none': side === 'show' }">{{ side === 'show' ? 'None' : '8' }}</code>
            </div>
            <code class="result-name">{{ side === 'show' ? 'a' : 'b' }}</code>
          </div>
        </div>
      </div>

      <!-- ═══ 5: several parameters, a default ═══ -->
      <div v-if="stage === 5" class="part feed is-active">
        <div class="wide">
          <span class="funnel funnel-a"></span>
          <span class="funnel funnel-b"></span>
          <code class="slot-name slot-a">{{ n.animal }}</code>
          <code class="slot-name slot-b">{{ n.food }}="{{ defaultFood }}"</code>
          <code class="machine-name">{{ n.feed }}({{ n.animal }}, {{ n.food }})</code>
        </div>
        <template v-for="(pet, k) in pets" :key="k">
          <span class="ball ball-a" :style="{ '--t': `${feedAt(k)}s` }"><span class="text-trim">{{ pet.animal }}</span></span>
          <span v-if="pet.food" class="ball ball-b" :style="{ '--t': `${feedAt(k) + 0.15}s` }"><span class="text-trim">{{ pet.food }}</span></span>
          <span v-else class="ball ball-b is-default" :style="{ '--t': `${feedAt(k) + 0.4}s` }"><span class="text-trim">{{ defaultFood }}</span></span>
        </template>
        <div class="feed-screen">
          <span class="screen-label">print</span>
          <span class="stack">
            <span
              v-for="(pet, k) in pets"
              :key="k"
              class="screen-value"
              :style="{ '--t': `${feedAt(k) + 1.1}s`, '--u': `${k === 0 ? feedAt(1) + 1.1 : 999}s` }"
            >{{ pet.animal }} {{ n.gets }} {{ pet.food ?? defaultFood }}</span>
          </span>
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
.fill {
  width: 100%;
  height: 100%;
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

code {
  font-family: var(--font-code);
}

.stack {
  display: inline-grid;
}

/* ═══ 1: jump ══════════════════════════════════════════════════════════ */
.track {
  position: absolute;
  top: 12vh;
  left: 5%;
  width: 36%;
  display: flex;
  flex-direction: column;
  gap: 4.5vh;
}
.line {
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 1vh 1.2vh;
  border-radius: 1vh;
  background: var(--bg);
  border: 2px solid var(--border);
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  font-weight: 700;
  white-space: nowrap;
  color: var(--text);
}
.line b {
  display: grid;
  place-items: center;
  width: 2.4vh;
  height: 2.4vh;
  border-radius: 999px;
  background: var(--lavender);
  font-size: clamp(0.5rem, 1.25vh, 0.85rem);
  color: #FFFFFF;
}
.def-card {
  position: absolute;
  top: 12vh;
  left: 58%;
  width: 37%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1vh;
  padding: 1.4vh;
  border-radius: 1.6vh;
  background: color-mix(in srgb, var(--sky) 18%, var(--bg));
  border: 2px solid var(--sky);
}
.def-book {
  position: absolute;
  top: -4vh;
  right: -1vh;
  width: 7vh;
  height: 7vh;
}
.def-head {
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  font-weight: 800;
  color: var(--sky);
}
.line-body {
  margin-left: 2vh;
}
.jump-arrows {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: var(--coral);
  stroke-width: 0.6;
  stroke-linecap: round;
  stroke-dasharray: 2 2;
  pointer-events: none;
}
.jump-arrows path {
  opacity: 0;
}
.runner {
  position: absolute;
  top: 14vh;
  left: 3%;
  width: 2.4vh;
  height: 2.4vh;
  border-radius: 999px;
  background: var(--coral);
  border: 2px solid var(--text);
  opacity: 0;
}
.jump.is-active .runner {
  animation: run 3.6s cubic-bezier(0.45, 0, 0.55, 1) 0.4s both;
}
.jump.is-active .arrow-there {
  animation: appear 0.3s ease 1.6s both;
}
.jump.is-active .arrow-back {
  animation: appear 0.3s ease 2.8s both;
}
.jump.is-active .line-1 { animation: lit 0.6s ease 0.6s both; }
.jump.is-active .line-2 { animation: lit 0.6s ease 1.4s both; }
.jump.is-active .line-body { animation: lit 0.6s ease 2.2s both; }
.jump.is-active .line-3 { animation: lit 0.6s ease 3.6s both; }
.jump.is-leaving .arrow-there,
.jump.is-leaving .arrow-back {
  opacity: 1;
}

/* ═══ 2–3: machine ═════════════════════════════════════════════════════ */
.machine {
  position: absolute;
  top: 16vh;
  left: 50%;
  width: 40%;
  height: 15vh;
  translate: -50% 0;
  border-radius: 2vh;
  background: var(--lavender);
  border: 3px solid var(--text);
}
.funnel {
  position: absolute;
  top: -5vh;
  left: 50%;
  width: 9vh;
  height: 5vh;
  translate: -50% 0;
  background: color-mix(in srgb, var(--lavender) 55%, var(--bg));
  border: 3px solid var(--text);
  border-bottom: none;
  clip-path: polygon(0 0, 100% 0, 68% 100%, 32% 100%);
}
.machine-name {
  position: absolute;
  top: 1.4vh;
  left: 50%;
  translate: -50% 0;
  padding: calc(0.3vh + 0.3em) 1vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.55rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
}
.inside {
  position: absolute;
  left: 50%;
  bottom: 2vh;
  display: inline-grid;
  translate: -50% 0;
}
.param {
  grid-area: 1 / 1;
  padding: calc(0.3vh + 0.3em) 1vh;
  border-radius: 0.8vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
  opacity: 0;
  animation:
    swap-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both,
    vanish 0.1s ease var(--u) forwards;
}
.chute {
  position: absolute;
  right: -4vh;
  bottom: 1.4vh;
  width: 4vh;
  height: 4vh;
  border-radius: 0 1vh 1vh 0;
  background: color-mix(in srgb, var(--lavender) 55%, var(--bg));
  border: 3px solid var(--text);
  border-left: none;
  opacity: 0;
}
.stage-3 .chute,
.stage-4 .chute,
.side .chute {
  opacity: 1;
}

.ball {
  position: absolute;
  z-index: 2;
  display: grid;
  place-items: center;
  min-width: 5vh;
  height: 5vh;
  padding: 0 1vh;
  border-radius: 999px;
  background: var(--mint);
  border: 3px solid var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 900;
  white-space: nowrap;
  color: var(--text);
  opacity: 0;
}
.single .ball-in {
  top: 4vh;
  left: 50%;
  translate: -50% 0;
  animation: drop-in 0.7s cubic-bezier(0.55, 0, 0.45, 1) var(--t) both;
}
.single .ball-out {
  top: 26.5vh;
  left: 72%;
  background: var(--sun);
  animation: roll-out 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.stage-4 .single .ball {
  display: none;
}

.screen {
  position: absolute;
  top: 36vh;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 0.6vh 0.6vh 0.6vh 1.2vh;
  border-radius: 1.2vh;
  background: var(--text);
  translate: -50% 0;
}
.screen-label {
  font-family: var(--font-code);
  font-size: clamp(0.55rem, 1.4vh, 0.95rem);
  font-weight: 800;
  color: var(--text-muted);
}
.screen-value {
  grid-area: 1 / 1;
  padding: 0.4vh 1vh;
  border-radius: 0.8vh;
  background: var(--bg);
  font-family: var(--font-code);
  font-size: clamp(0.65rem, 1.9vh, 1.25rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
  opacity: 0;
  animation:
    swap-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both,
    vanish 0.1s ease var(--u) forwards;
}

.result-box {
  position: absolute;
  top: 33vh;
  left: 82%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6vh;
  translate: -50% 0;
  opacity: 0;
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
}
.result-art,
.mini-art {
  position: relative;
  width: 9vh;
  height: 9vh;
}
.result-value,
.mini-value {
  position: absolute;
  left: 50%;
  top: 64%;
  translate: -50% -50%;
  padding: calc(0.3vh + 0.3em) 0.9vh;
  border-radius: 0.8vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  color: var(--text);
  opacity: 0;
}
.result-value {
  animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) var(--t) both;
}
.result-name {
  padding: calc(0.25vh + 0.3em) 0.9vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.55rem, 1.4vh, 0.95rem);
  font-weight: 800;
  color: var(--bg);
}
.plus {
  position: absolute;
  top: 38vh;
  left: 40%;
  padding: calc(0.35vh + 0.3em) 1.1vh;
  border-radius: 999px;
  background: var(--sky);
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  font-weight: 800;
  white-space: nowrap;
  color: #FFFFFF;
  translate: -50% 0;
  opacity: 0;
  animation: rise 0.35s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}

/* ═══ 4: print vs return ═══════════════════════════════════════════════ */
.side {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
}
.side-show {
  left: 0;
  --t: 0.7s;
}
.side-give {
  left: 50%;
  --t: 2.4s;
}
.mini {
  position: absolute;
  top: 16vh;
  left: 46%;
  width: 62%;
  height: 13vh;
  translate: -50% 0;
  border-radius: 1.6vh;
  background: var(--lavender);
  border: 3px solid var(--text);
}
.mini .funnel {
  top: -4.4vh;
  width: 7vh;
  height: 4.4vh;
}
.mini .machine-name {
  top: 1vh;
}
.mini-body {
  position: absolute;
  left: 50%;
  bottom: 1.4vh;
  translate: -50% 0;
  padding: calc(0.25vh + 0.3em) 0.8vh;
  border-radius: 0.7vh;
  background: var(--bg);
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 700;
  white-space: nowrap;
  color: var(--text);
}
.mini .chute {
  right: -3.4vh;
  width: 3.4vh;
  height: 3.4vh;
}
.side .ball-in {
  top: 5vh;
  left: 46%;
  min-width: 4.4vh;
  height: 4.4vh;
  translate: -50% 0;
}
.side .ball-out {
  top: 24vh;
  left: 70%;
  min-width: 4.4vh;
  height: 4.4vh;
  background: var(--sun);
}
.mini-screen {
  position: absolute;
  top: 31.5vh;
  left: 12%;
  padding: 0.6vh 1.2vh;
  border-radius: 1vh;
  background: var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.65rem, 1.9vh, 1.25rem);
  font-weight: 800;
  color: var(--bg);
  opacity: 0;
}
.mini-box {
  position: absolute;
  top: 33vh;
  left: 64%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5vh;
  translate: -50% 0;
}
.mini-value.is-none {
  border-color: var(--text-muted);
  color: var(--text-muted);
}
.versus.is-active .ball-in {
  animation: drop-in 0.7s cubic-bezier(0.55, 0, 0.45, 1) var(--t) both;
}
.versus.is-active .mini-screen {
  animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--t) + 0.8s) both;
}
.versus.is-active .ball-out {
  animation: roll-down 0.7s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--t) + 0.8s) both;
}
.versus.is-active .mini-value {
  animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--t) + 1.3s) both;
}
.versus.is-active .side-show .mini-box {
  animation: shake 0.4s ease calc(var(--t) + 1.3s) both;
}
.versus.is-leaving .mini-screen,
.versus.is-leaving .mini-value {
  opacity: 1;
}

/* ═══ 5: several parameters ════════════════════════════════════════════ */
.wide {
  position: absolute;
  top: 17vh;
  left: 50%;
  width: 70%;
  height: 13vh;
  translate: -50% 0;
  border-radius: 2vh;
  background: var(--lavender);
  border: 3px solid var(--text);
  animation: pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}
.wide .funnel-a {
  left: 28%;
}
.wide .funnel-b {
  left: 72%;
}
.wide .machine-name {
  top: auto;
  bottom: 1.6vh;
}
.slot-name {
  position: absolute;
  top: 1.2vh;
  translate: -50% 0;
  padding: calc(0.25vh + 0.3em) 0.8vh;
  border-radius: 0.7vh;
  background: var(--bg);
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
}
.slot-a {
  left: 28%;
}
.slot-b {
  left: 72%;
}
.feed .ball {
  top: 5vh;
  translate: -50% 0;
  animation:
    drop-in 0.7s cubic-bezier(0.55, 0, 0.45, 1) var(--t) both;
}
.feed .ball-a {
  left: 32.5%;
}
.feed .ball-b {
  left: 67.5%;
  background: var(--sun);
}
.feed .ball-b.is-default {
  background: var(--bg);
  border-style: dashed;
  color: var(--text-dim);
}
.feed-screen {
  position: absolute;
  top: 37vh;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 0.6vh 0.6vh 0.6vh 1.2vh;
  border-radius: 1.2vh;
  background: var(--text);
  translate: -50% 0;
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
@keyframes lit {
  0% { border-color: var(--border); }
  30% { border-color: var(--coral); box-shadow: 0 0 0 0.5vh color-mix(in srgb, var(--coral) 30%, transparent); }
  100% { border-color: var(--border); box-shadow: none; }
}
/* The ball falls into the funnel and disappears inside the machine. */
@keyframes drop-in {
  0% { opacity: 0; transform: translateY(-2vh); }
  20% { opacity: 1; transform: none; }
  75% { opacity: 1; transform: translateY(9vh) scale(0.85); }
  100% { opacity: 0; transform: translateY(12vh) scale(0.5); }
}
/* Out of the chute and down into the box, where the box takes over the value. */
@keyframes roll-out {
  0% { opacity: 0; transform: translate(-4vh, -3vh) scale(0.5); }
  30% { opacity: 1; transform: translate(0, -2vh); }
  85% { opacity: 1; transform: translate(4vh, 5vh); }
  100% { opacity: 0; transform: translate(4vh, 6vh) scale(0.6); }
}
@keyframes roll-down {
  0% { opacity: 0; transform: translate(0, -2vh) scale(0.5); }
  30% { opacity: 1; transform: none; }
  85% { opacity: 1; transform: translate(-3vh, 7vh); }
  100% { opacity: 0; transform: translate(-3vh, 8vh) scale(0.6); }
}
@keyframes shake {
  0%, 100% { transform: none; }
  25% { transform: translateX(-0.8vh); }
  75% { transform: translateX(0.8vh); }
}
/* Line 1, line 2, across into the function, back to line 2, down to line 3. */
@keyframes run {
  0% { opacity: 0; top: 13.4vh; left: 3%; }
  8% { opacity: 1; top: 13.4vh; left: 3%; }
  25% { top: 21.6vh; left: 3%; }
  45% { top: 21vh; left: 58%; }
  62% { top: 21vh; left: 58%; }
  80% { top: 21.6vh; left: 3%; }
  100% { opacity: 1; top: 30vh; left: 3%; }
}
</style>
