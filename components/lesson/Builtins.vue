<script setup lang="ts">
/**
 * "Python hat schon viel eingebaut". Auto-imported as `<LessonBuiltins :stage="1" />`.
 *
 * Five slides (PRE-0113 and its four sub-slides), each a handful of built-in
 * functions shown on things the course already has:
 *
 *   1. max, min, sum, len on the six fish — the loops we wrote, in one word
 *   2. sorted puts the fish in order; round and abs tidy numbers
 *   3. int, float, str convert, type tells what something is
 *   4. enumerate numbers a list, zip pairs two lists
 *   5. text methods: upper, split, join, replace
 *
 * Scenes stay one extra stage to clear away. Words come from `builtins.*` in
 * `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3 | 4 | 5 | 6

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

const stages = computed(() => tm<Stage[]>('builtins.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const pets = computed(() => tm<Array<{ name: string, food: string }>>('builtins.pets'))
const words = computed(() => tm<string[]>('builtins.words'))
const replacement = computed(() => t('builtins.replacement'))
/** 6: the same value, one station at a time. */
const chain = computed(() => tm<Array<{ value: string, step: string }>>('builtins.chain'))

/* 1–2: the fish */
const VALUES = [12, 30, 8, 21, 15, 18]
const COLORS = ['sky', 'coral', 'mint', 'lavender', 'sun', 'rose']
const ORDER = VALUES.map(v => [...VALUES].sort((a, b) => a - b).indexOf(v))
const TOOLS = [
  { name: 'max', result: '30', ring: [1] },
  { name: 'min', result: '8', ring: [2] },
  { name: 'sum', result: '104', ring: [0, 1, 2, 3, 4, 5] },
  { name: 'len', result: '6', ring: [0, 1, 2, 3, 4, 5] },
]
const toolAt = (k: number) => 0.8 + k * 0.9

/* 3: conversions */
const CONVERT = [
  { from: '"5"', fromText: true, fn: 'int', to: '5', type: 'int' },
  { from: '"2.5"', fromText: true, fn: 'float', to: '2.5', type: 'float' },
  { from: '42', fromText: false, fn: 'str', to: '"42"', type: 'str' },
]
const convertAt = (k: number) => 0.7 + k * 0.9

const outputDelays = computed(() => {
  switch (props.stage) {
    case 1: return TOOLS.map((_, k) => toolAt(k) + 0.4)
    case 2: return [1.4, 2.5, 3.5]
    case 3: return [3.3, 3.8]
    case 4: return [0.8, 1.2, 1.6, 3.0, 3.6]
    case 5: return [1.0, 2.0, 3.0, 3.9]
    case 6: return [2.0, 4.2]
    default: return undefined
  }
})

const phase = (own: number) => (props.stage === own ? 'is-active' : props.stage === own + 1 ? 'is-leaving' : '')
const shown = (own: number) => props.stage === own || props.stage === own + 1
</script>

<template>
  <LessonShell
    :eyebrow="t('builtins.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :file="t('builtins.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    dense
    :output-label="t('builtins.output')"
    :no-output="t('builtins.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- ═══ 1–2: the fish and the toolbox ═══ -->
      <div v-if="stage <= 3" class="part fish" :class="stage === 3 ? 'is-leaving' : 'is-active'">
        <div class="basket"></div>
        <div
          v-for="(value, i) in VALUES"
          :key="i"
          class="slot"
          :style="{ '--i': i, '--o': ORDER[i] }"
        >
          <div class="slot-art" :class="TOOLS.map((tool, k) => tool.ring.includes(i) ? `lit-${k}` : '')">
            <ArtSprite name="fish" :color="COLORS[i]" accent="text" :size="96" class="slot-fish" />
            <code class="slot-value">{{ value }}</code>
          </div>
        </div>

        <div v-if="stage === 1" class="tools">
          <code v-for="(tool, k) in TOOLS" :key="tool.name" class="tool" :style="{ '--t': `${toolAt(k)}s` }">
            {{ tool.name }}(…) <b>{{ tool.result }}</b>
          </code>
        </div>

        <div v-else class="tidy">
          <code class="tidy-chip chip-sorted">sorted(…) <b>↑</b></code>
          <code class="tidy-chip chip-round"><span>round(3.14<span class="drop">159</span>, 2)</span></code>
          <code class="tidy-chip chip-abs"><span>abs(<span class="drop">-</span>7)</span></code>
        </div>
      </div>

      <!-- ═══ 3: conversions ═══ -->
      <div v-if="shown(3)" class="part convert" :class="phase(3)">
        <div v-for="(row, k) in CONVERT" :key="row.fn" class="row" :style="{ '--k': k, '--t': `${convertAt(k)}s` }">
          <code class="value" :class="row.fromText ? 'is-str' : 'is-num'">{{ row.from }}</code>
          <span class="arrow">
            <code class="fn">{{ row.fn }}()</code>
            <svg viewBox="0 0 48 12" aria-hidden="true"><path d="M2 6 H44 M38 1 L44 6 L38 11" /></svg>
          </span>
          <code class="value result" :class="row.type === 'str' ? 'is-str' : 'is-num'">{{ row.to }}</code>
          <code class="type">{{ row.type }}</code>
        </div>
      </div>

      <!-- ═══ 4: enumerate and zip ═══ -->
      <div v-if="shown(4)" class="part pairs" :class="phase(4)">
        <div v-for="(pet, k) in pets" :key="pet.name" class="pair" :style="{ '--k': k }">
          <code class="index">{{ k }}</code>
          <code class="tile name">{{ pet.name }}</code>
          <span class="link"></span>
          <code class="tile food">{{ pet.food }}</code>
        </div>
        <code class="pair-label label-enumerate">enumerate</code>
        <code class="pair-label label-zip">zip</code>
      </div>

      <!-- ═══ 5: text methods ═══ -->
      <div v-if="stage === 5" class="part text is-active">
        <div class="sentence">
          <span v-for="(word, k) in words" :key="k" class="word" :class="{ 'is-last': k === words.length - 1 }" :style="{ '--k': k }">
            <span class="face lower">{{ word }}</span>
            <span class="face upper">{{ word.toUpperCase() }}</span>
            <span v-if="k === words.length - 1" class="face replaced">{{ replacement }}</span>
          </span>
        </div>
        <div class="methods">
          <code class="method" style="--t: 0.8s;">.upper()</code>
          <code class="method" style="--t: 1.8s;">.split()</code>
          <code class="method" style="--t: 2.8s;">"-".join(…) <b>a-b-c</b></code>
          <code class="method" style="--t: 3.6s;">.replace(…)</code>
        </div>
      </div>

      <!-- ═══ 6: one result into the next function ═══ -->
      <div v-if="stage === 6" class="part chain is-active">
        <span class="chain-label">{{ t('builtins.chainLabel') }}</span>
        <div v-for="(link, k) in chain" :key="k" class="link-row" :style="{ '--t': `${0.6 + k * 1.1}s` }">
          <code class="link-value" :class="{ 'is-last': k === chain.length - 1 }">{{ link.value }}</code>
          <span v-if="link.step" class="link-step">
            <span class="link-arrow"></span>
            <code class="link-fn">{{ link.step }}</code>
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

/* ═══ 1–2: fish ════════════════════════════════════════════════════════ */
.basket {
  position: absolute;
  top: 7vh;
  left: 7.5%;
  width: 85%;
  height: 12.5vh;
  border-radius: 2vh;
  background: color-mix(in srgb, var(--sun) 45%, var(--bg));
  border: 3px solid var(--text);
}
.slot {
  position: absolute;
  top: 8vh;
  left: calc(9% + var(--i) * 14%);
  width: 12%;
}
.slot-art {
  position: relative;
  height: 9.5vh;
  border-radius: 1.2vh;
}
/* Explicit size: the sprite's width and height attributes would win over `inset`. */
.slot-fish {
  position: absolute;
  top: 2%;
  left: 10%;
  width: 80%;
  height: 64%;
}
.slot-value {
  position: absolute;
  left: 50%;
  top: 76%;
  translate: -50% -50%;
  padding: calc(0.3vh + 0.3em) 0.8vh;
  border-radius: 0.8vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.6rem, 1.65vh, 1.1rem);
  font-weight: 800;
  color: var(--text);
}

.tools {
  position: absolute;
  top: 26vh;
  left: 8%;
  right: 8%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6vh 4%;
}
.tool,
.tidy-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1vh;
  padding: 1vh 1vh 1vh 1.4vh;
  border-radius: 1.2vh;
  background: var(--bg);
  border: 2px solid var(--lavender);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
  opacity: 0;
}
.tool b,
.tidy-chip b {
  padding: 0.3vh 1vh;
  border-radius: 999px;
  background: var(--mint);
  color: #FFFFFF;
}
.stage-1 .tool {
  animation: rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
/* lit-N, not ring-N: Tailwind owns the ring-* class names. */
.stage-1 .lit-0 { animation: ring 0.8s ease 1s both; }
.stage-1 .lit-1 { animation: ring 0.8s ease 1.9s both; }
.stage-1 .slot-art.lit-2.lit-3 { animation: ring 0.8s ease 2.8s both, ring 0.8s ease 3.7s both; }

.tidy {
  position: absolute;
  top: 26vh;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.4vh;
  translate: -50% 0;
}
/* Digits that fall off also give their room back. */
.drop {
  display: inline-block;
  max-width: 4ch;
  vertical-align: bottom;
}
.stage-2 .slot {
  animation: reorder 0.8s cubic-bezier(0.65, 0, 0.35, 1) 0.6s both;
}
.stage-3 .slot {
  left: calc(9% + var(--o) * 14%);
}
.stage-2 .chip-sorted {
  animation: rise 0.35s cubic-bezier(0.22, 1, 0.36, 1) 1.1s both;
}
.stage-2 .chip-round {
  animation: rise 0.35s cubic-bezier(0.22, 1, 0.36, 1) 2.1s both;
}
.stage-2 .chip-round .drop {
  animation: fall-off 0.45s ease-in 2.5s both;
}
.stage-2 .chip-abs {
  animation: rise 0.35s cubic-bezier(0.22, 1, 0.36, 1) 3.1s both;
}
.stage-2 .chip-abs .drop {
  animation: fall-off 0.45s ease-in 3.5s both;
}
.stage-3 .tidy-chip {
  opacity: 1;
}
.stage-3 .drop {
  max-width: 0;
  opacity: 0;
}

/* ═══ 3: conversions ═══════════════════════════════════════════════════ */
.row {
  position: absolute;
  top: calc(9vh + var(--k) * 12vh);
  left: 6%;
  right: 6%;
  display: grid;
  grid-template-columns: 1fr auto 1fr auto;
  align-items: center;
  gap: 2%;
  opacity: 0;
}
.value {
  justify-self: center;
  padding: 1vh 1.6vh;
  border-radius: 1.2vh;
  border: 3px solid var(--text);
  font-size: clamp(0.8rem, 2.4vh, 1.6rem);
  font-weight: 900;
  color: var(--text);
}
.value.is-str {
  background: color-mix(in srgb, var(--coral) 25%, var(--bg));
}
.value.is-num {
  background: color-mix(in srgb, var(--sky) 30%, var(--bg));
}
.arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4vh;
}
.arrow svg {
  width: 7vh;
  height: 1.8vh;
  fill: none;
  stroke: var(--text);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.fn {
  padding: calc(0.25vh + 0.3em) 0.9vh;
  border-radius: 999px;
  background: var(--lavender);
  font-size: clamp(0.55rem, 1.5vh, 1rem);
  font-weight: 800;
  color: #FFFFFF;
}
.type {
  padding: calc(0.25vh + 0.3em) 0.9vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 800;
  color: var(--bg);
}
.convert.is-active .row {
  animation: rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.convert.is-active .result {
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--t) + 0.35s) both;
}
.convert.is-leaving .row {
  opacity: 1;
}

/* ═══ 4: enumerate and zip ═════════════════════════════════════════════ */
.pair {
  position: absolute;
  top: 9vh;
  left: calc(20% + var(--k) * 30%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;
  translate: -50% 0;
}
.tile {
  padding: 1.2vh 1.6vh;
  border-radius: 1.2vh;
  border: 3px solid var(--text);
  font-size: clamp(0.65rem, 2vh, 1.35rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
}
.name {
  background: color-mix(in srgb, var(--coral) 25%, var(--bg));
  opacity: 0;
}
.food {
  background: color-mix(in srgb, var(--mint) 30%, var(--bg));
  opacity: 0;
}
.index {
  display: grid;
  place-items: center;
  width: 3.6vh;
  height: 3.6vh;
  border-radius: 999px;
  background: var(--lavender);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 900;
  color: #FFFFFF;
  opacity: 0;
}
.link {
  width: 0;
  height: 7vh;
  border-left: 3px dashed var(--text-muted);
  transform-origin: top center;
  opacity: 0;
}
.pair-label {
  position: absolute;
  left: 50%;
  translate: -50% 0;
  padding: calc(0.25vh + 0.3em) 0.9vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 800;
  color: var(--bg);
  opacity: 0;
}
.label-enumerate {
  top: 5.4vh;
}
.label-zip {
  top: 21.5vh;
  z-index: 1;
}
.pairs.is-active .name {
  animation: rise 0.35s ease calc(0.3s + var(--k) * 0.12s) both;
}
.pairs.is-active .index {
  animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) calc(0.7s + var(--k) * 0.4s) both;
}
.pairs.is-active .label-enumerate {
  animation: appear 0.3s ease 0.6s both;
}
.pairs.is-active .food {
  animation: rise 0.35s ease calc(2.3s + var(--k) * 0.12s) both;
}
.pairs.is-active .link {
  animation: draw 0.35s ease calc(2.7s + var(--k) * 0.3s) both;
}
.pairs.is-active .label-zip {
  animation: appear 0.3s ease 2.5s both;
}
.pairs.is-leaving .name,
.pairs.is-leaving .food,
.pairs.is-leaving .index,
.pairs.is-leaving .link,
.pairs.is-leaving .pair-label {
  opacity: 1;
}

/* ═══ 5: text methods ══════════════════════════════════════════════════ */
.sentence {
  position: absolute;
  top: 10vh;
  left: 50%;
  display: flex;
  translate: -50% 0;
}
.word {
  display: inline-grid;
  padding: 1.2vh 0.9vh;
  background: var(--bg);
  border-block: 3px solid var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.8rem, 2.6vh, 1.7rem);
  font-weight: 800;
  white-space: pre;
  color: var(--text);
}
.word:first-child {
  border-left: 3px solid var(--text);
  border-radius: 1.2vh 0 0 1.2vh;
}
.word.is-last {
  border-right: 3px solid var(--text);
  border-radius: 0 1.2vh 1.2vh 0;
}
.face {
  grid-area: 1 / 1;
  text-align: center;
}
.upper,
.replaced {
  opacity: 0;
}
.methods {
  position: absolute;
  top: 24vh;
  left: 50%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.4vh 3vh;
  translate: -50% 0;
}
.method {
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 0.9vh 1.2vh;
  border-radius: 1.1vh;
  background: var(--bg);
  border: 2px solid var(--lavender);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
  opacity: 0;
  animation: rise 0.35s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.method b {
  padding: 0.2vh 0.9vh;
  border-radius: 999px;
  background: var(--mint);
  color: #FFFFFF;
}
.text .lower {
  animation:
    vanish 0.2s ease 1s forwards,
    appear 0.2s ease 1.7s forwards;
}
.text .word.is-last .lower {
  animation:
    vanish 0.2s ease 1s forwards,
    appear 0.2s ease 1.7s forwards,
    vanish 0.2s ease 3.9s forwards;
}
.text .upper {
  animation:
    appear 0.2s ease 1s forwards,
    vanish 0.2s ease 1.7s forwards;
}
.text .replaced {
  animation: flip-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) 4s both;
  color: var(--coral);
}
/* split: the words pull apart into separate tiles. */
.text .word {
  animation: split 0.45s cubic-bezier(0.22, 1, 0.36, 1) 2s both;
}

/* ═══ 6: the chain ═════════════════════════════════════════════════════
   The same value on its way down: each row is what it is at that point,
   with the function that turns it into the next row beside the arrow. */
.chain {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 7vh 4% 2vh;
}
.chain-label {
  margin-bottom: 1.6vh;
  padding: calc(0.25vh + 0.3em) 1vh;
  border-radius: 999px;
  background: var(--bg-off);
  border: 2px solid var(--border);
  font-size: clamp(0.42rem, 1.15vh, 0.72rem);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-dim);
  animation: appear 0.3s ease 0.3s both;
}
.link-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.link-value {
  padding: 0.6vh 1.2vh;
  border-radius: 0.9vh;
  background: var(--bg);
  border: 2px solid var(--border);
  font-size: clamp(0.52rem, 1.5vh, 0.95rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
}
.link-value.is-last {
  background: var(--mint);
  border-color: var(--text);
  border-width: 3px;
}
/* The arrow stays on the centre line, the function name sits beside it. */
.link-step {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 0.4vh 0;
}
.link-arrow {
  width: 0.35vh;
  height: 3vh;
  border-radius: 999px;
  background: var(--sky);
}
.link-fn {
  position: absolute;
  top: 50%;
  left: calc(50% + 1.2vh);
  translate: 0 -50%;
  padding: 0.25vh 0.8vh;
  border-radius: 999px;
  background: color-mix(in srgb, var(--sky) 25%, var(--bg));
  font-size: clamp(0.46rem, 1.3vh, 0.82rem);
  font-weight: 800;
  white-space: nowrap;
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
@keyframes rise {
  from { opacity: 0; transform: translateY(1.4vh); }
  to { opacity: 1; transform: none; }
}
@keyframes flip-in {
  from { opacity: 0; transform: rotateX(80deg); }
  to { opacity: 1; transform: none; }
}
@keyframes ring {
  0% { outline: 3px solid transparent; outline-offset: 0; }
  35% { outline: 3px solid var(--lavender); outline-offset: 0.5vh; }
  100% { outline: 3px solid transparent; outline-offset: 1.4vh; }
}
@keyframes reorder {
  from { left: calc(9% + var(--i) * 14%); }
  to { left: calc(9% + var(--o) * 14%); }
}
@keyframes fall-off {
  0% { opacity: 1; transform: none; max-width: 4ch; }
  70% { opacity: 0; transform: translateY(3vh) rotate(20deg); max-width: 4ch; }
  100% { opacity: 0; transform: translateY(3vh); max-width: 0; }
}
@keyframes draw {
  from { opacity: 1; transform: scaleY(0); }
  to { opacity: 1; transform: none; }
}
@keyframes split {
  from { margin-inline: 0; border-radius: 0; }
  to { margin-inline: 0.8vh; border-radius: 1.2vh; border-left: 3px solid var(--text); border-right: 3px solid var(--text); }
}
</style>
