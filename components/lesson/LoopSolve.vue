<script setup lang="ts">
/**
 * "Schleifen lösen unsere Probleme". Auto-imported as `<LessonLoopSolve :stage="1" />`.
 *
 * The six fish from the lists-and-if lesson, solved with one walk each
 * (PRE-0076 and its three sub-slides):
 *
 *   1. the longest fish: `laengster` only changes when a longer fish comes by
 *   2. counting: `anzahl` ticks at every fish longer than 14
 *   3. filtering: those fish drop into a new basket `grosse`
 *   4. the if/elif chain next to the loop: the chain grows, the loop stays
 *
 * Six stops, 0.7 s apart. Times for everything that changes at a stop are
 * computed here and handed to CSS as `--t` (appear) and `--u` (disappear), so
 * the stacks of values never need per-index rules. Each stage opens on the last
 * frame of the one before. Words come from `loops.solve.*` in `locales/`.
 */
import { computed } from 'vue'
import { useCodeLink } from '~/composables/useCodeLink'
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
const link = useCodeLink()

const stages = computed(() => tm<Stage[]>('loops.solve.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const names = computed(() => tm<Record<'item' | 'list' | 'longest' | 'count' | 'big', string>>('loops.solve.names'))

const VALUES = [12, 30, 8, 21, 15, 18]
const COLORS = ['sky', 'coral', 'mint', 'lavender', 'sun', 'rose']
const LIMIT = 14
const STEP = 0.7
const CHAIN_LINES = [70, 46, 82, 50, 88, 46, 84, 50, 60, 90, 40]
const LOOP_LINES = [64, 52, 58, 70, 40]

/** Momo reaches the first fish: after fading in on stage 1, after walking back on 2 and 3. */
const start = computed(() => (props.stage === 1 ? 0.6 : 1))
const at = (i: number) => start.value + i * STEP

const big = VALUES.map((value, i) => ({ value, i })).filter(fish => fish.value > LIMIT)

/** Stage 1 compares with the longest so far, stages 2 and 3 with the limit. */
const verdicts = computed(() => {
  if (props.stage !== 1) return VALUES.map(value => value > LIMIT)
  let longest = VALUES[0]!
  return VALUES.map((value) => {
    const longer = value > longest
    if (longer) longest = value
    return longer
  })
})

/** CSS times for a stack: each value shows at its time and hides at the next one's. */
const timed = (times: number[]) => times.map((time, k) => ({ '--t': `${time}s`, '--u': `${times[k + 1] ?? 999}s` }))

const stopTimes = computed(() => VALUES.map((_, i) => at(i)))
const keepTimes = computed(() => timed([0.3, at(1) + 0.35]))
const countTimes = computed(() => timed([0.3, ...big.map(fish => at(fish.i) + 0.35)]))

const outputDelays = computed(() => [props.stage === 4 ? 0.6 : at(VALUES.length - 1) + 0.9])

const lit = (word: string) => link.isActive(`word:${word}`)
const phase = (active: number) => (props.stage === active ? 'is-running' : 'is-static')
</script>

<template>
  <LessonShell
    :eyebrow="t('loops.solve.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :file="t('loops.solve.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    :output-label="t('loops.solve.output')"
    :no-output="t('loops.solve.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`" :style="{ '--d': `${start}s` }">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- The basket -->
      <div class="basket" :class="{ 'is-lit': lit(names.list) }">
        <span class="basket-name"><span class="text-trim">{{ names.list }}</span></span>
      </div>
      <div
        v-for="(value, i) in VALUES"
        :key="i"
        class="slot"
        :class="{ 'is-big': value > LIMIT }"
        :style="{ '--i': i, '--t': `${stopTimes[i]}s` }"
      >
        <div class="slot-art">
          <ArtSprite name="fish" :color="COLORS[i]" accent="text" :size="96" class="slot-fish" />
          <span class="slot-value"><span class="text-trim">{{ value }}</span></span>
          <span class="slot-badge"><span class="text-trim">✓</span></span>
        </div>
      </div>

      <!-- Momo, carrying the loop variable and the verdict at each fish -->
      <div class="walker">
        <span class="carry" :class="{ 'is-lit': lit(names.item) }">
          <span>{{ names.item }} =</span>
          <span class="stack" :class="stage < 4 ? 'is-running' : 'is-static'">
            <span
              v-for="(value, i) in VALUES"
              :key="i"
              class="timed carry-value"
              :style="{ '--t': `${stopTimes[i]}s`, '--u': `${stopTimes[i + 1] ?? 999}s` }"
            >{{ value }}</span>
          </span>
          <span class="stack" :class="stage < 4 ? 'is-running' : 'is-static'">
            <span
              v-for="(yes, i) in verdicts"
              :key="`${stage}-${i}`"
              class="timed verdict"
              :class="yes ? 'is-yes' : 'is-no'"
              :style="{ '--t': `${stopTimes[i]! + 0.2}s`, '--u': `${stopTimes[i + 1] ?? 999}s` }"
            ><span class="text-trim">{{ yes ? '✓' : '✗' }}</span></span>
          </span>
        </span>
        <ArtSprite name="cat-stand" color="coral" accent="rose" :size="96" class="walker-art" />
      </div>

      <!-- 1: the longest so far -->
      <div v-if="stage <= 2" class="result keep" :class="[phase(1), { 'is-lit': lit(names.longest) }]">
        <div class="result-art">
          <ArtSprite name="box" color="coral" accent="text-muted" :size="96" class="result-box" />
          <span class="stack result-stack">
            <span v-for="(value, k) in [12, 30]" :key="k" class="timed result-value" :style="keepTimes[k]">{{ value }}</span>
          </span>
        </div>
        <span class="result-name"><span class="text-trim">{{ names.longest }}</span></span>
      </div>

      <!-- 2: counting -->
      <div v-if="stage === 2 || stage === 3" class="result count" :class="[phase(2), { 'is-lit': lit(names.count) }]">
        <div class="result-art">
          <ArtSprite name="box" color="mint" accent="text-muted" :size="96" class="result-box" />
          <span class="stack result-stack">
            <span v-for="(time, k) in countTimes" :key="k" class="timed result-value" :style="time">{{ k }}</span>
          </span>
        </div>
        <span class="result-name"><span class="text-trim">{{ names.count }}</span></span>
      </div>

      <!-- 3: a new basket for the big ones -->
      <div v-if="stage >= 3" class="big" :class="[phase(3), { 'is-lit': lit(names.big) }]">
        <span class="big-name"><span class="text-trim">{{ names.big }}</span></span>
        <span
          v-for="(fish, k) in big"
          :key="k"
          class="big-cell"
          :style="{ '--t': `${at(fish.i) + 0.35}s` }"
        >
          <ArtSprite name="fish" :color="COLORS[fish.i]" accent="text" :size="96" class="big-fish" />
          <span class="big-value"><span class="text-trim">{{ fish.value }}</span></span>
        </span>
      </div>

      <!-- 4: the chain next to the loop -->
      <div v-if="stage === 4" class="versus">
        <article class="card card-chain">
          <span class="card-title"><code>if / elif</code></span>
          <span class="card-lines">
            <i v-for="(width, k) in CHAIN_LINES" :key="k" :style="{ width: `${width}%`, '--k': k }"></i>
          </span>
          <span class="card-tally"><span class="text-trim">{{ t('loops.solve.chainTally') }}</span></span>
          <span class="card-cross"><span class="text-trim">✗</span></span>
        </article>
        <article class="card card-loop">
          <span class="card-title"><code>for</code></span>
          <span class="card-lines">
            <i v-for="(width, k) in LOOP_LINES" :key="k" :style="{ width: `${width}%`, '--k': k }"></i>
          </span>
          <span class="card-tally"><span class="text-trim">{{ t('loops.solve.loopTally') }}</span></span>
        </article>
      </div>
    </div>
  </LessonShell>
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
}

.tally {
  position: absolute;
  top: 1.6vh;
  left: 50%;
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

.is-lit {
  outline: 3px solid var(--lavender);
  outline-offset: 0.5vh;
}

/* ─── Values that change in place ────────────────────────────────────── */
.stack {
  display: inline-grid;
}
.timed {
  grid-area: 1 / 1;
  text-align: center;
  opacity: 0;
}
.is-running > .timed,
.is-running .timed {
  animation:
    swap-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both,
    vanish 0.1s ease var(--u) forwards;
}
.is-static .timed:last-child {
  opacity: 1;
}

/* ─── Basket ─────────────────────────────────────────────────────────── */
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
.basket-name {
  position: absolute;
  top: -3.6vh;
  left: 2%;
  padding: calc(0.3vh + 0.3em) 1.1vh;
  border-radius: 999px;
  background: var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  font-weight: 800;
  color: var(--bg);
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
  transform: translate(-50%, -50%);
  padding: calc(0.35vh + 0.3em) 0.8vh;
  border-radius: 0.8vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.65vh, 1.1rem);
  font-weight: 800;
  color: var(--text);
}
.slot-badge {
  position: absolute;
  top: -1.4vh;
  right: 0;
  display: grid;
  place-items: center;
  width: 2.8vh;
  height: 2.8vh;
  border-radius: 999px;
  background: var(--mint);
  border: 2px solid var(--text);
  font-size: clamp(0.55rem, 1.4vh, 0.9rem);
  font-weight: 900;
  color: #FFFFFF;
  opacity: 0;
}

/* ─── Walker ─────────────────────────────────────────────────────────── */
.walker {
  position: absolute;
  top: 27vh;
  left: 15%;
  width: 9vh;
  height: 9vh;
  translate: -50% 0;
  opacity: 0;
}
.walker-art {
  width: 100%;
  height: 100%;
}

.carry {
  position: absolute;
  bottom: calc(100% + 0.2vh);
  left: 50%;
  translate: -50% 0;
  display: flex;
  align-items: center;
  gap: 0.6vh;
  padding: 0.5vh;
  padding-left: 1.1vh;
  border-radius: 999px;
  background: var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
  transition: outline-color 0.2s ease;
}
.carry-value {
  min-width: 2.4em;
  padding: 0.25vh 0.7vh;
  border-radius: 999px;
  background: var(--sun);
  color: var(--text);
}
.verdict {
  display: grid;
  place-items: center;
  width: 2.6vh;
  height: 2.6vh;
  border-radius: 999px;
  font-size: clamp(0.55rem, 1.35vh, 0.9rem);
  font-weight: 900;
  color: #FFFFFF;
}
.verdict.is-yes {
  background: var(--mint);
}
.verdict.is-no {
  background: var(--coral);
}

/* ─── Result boxes ───────────────────────────────────────────────────── */
.result {
  position: absolute;
  top: 36vh;
  left: 88%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6vh;
  translate: -50% 0;
  border-radius: 1.2vh;
}
.result-art {
  position: relative;
  width: 9vh;
  height: 9vh;
}
.result-box {
  width: 100%;
  height: 100%;
}
.result-stack {
  position: absolute;
  left: 50%;
  top: 64%;
  translate: -50% -50%;
}
.result-value {
  padding: calc(0.35vh + 0.3em) 0.9vh;
  border-radius: 0.9vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.65rem, 1.9vh, 1.25rem);
  font-weight: 800;
  color: var(--text);
}
.result-name {
  padding: calc(0.3vh + 0.3em) 1vh;
  border-radius: 999px;
  background: var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.55rem, 1.4vh, 0.95rem);
  font-weight: 800;
  color: var(--bg);
}

/* ─── The big-fish basket ────────────────────────────────────────────── */
.big {
  position: absolute;
  top: 38.5vh;
  left: 16%;
  width: 60%;
  height: 9.5vh;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0 2%;
  border-radius: 1.6vh;
  background: color-mix(in srgb, var(--mint) 22%, var(--bg));
  border: 3px solid var(--text);
}
.big-name {
  position: absolute;
  top: -3.4vh;
  left: 3%;
  padding: calc(0.3vh + 0.3em) 1vh;
  border-radius: 999px;
  background: var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.55rem, 1.4vh, 0.95rem);
  font-weight: 800;
  color: var(--bg);
}
.big-cell {
  position: relative;
  opacity: 0;
}
.big-fish {
  position: absolute;
  top: 4%;
  left: 18%;
  width: 64%;
  height: 58%;
}
.big-value {
  position: absolute;
  left: 50%;
  top: 76%;
  translate: -50% -50%;
  padding: calc(0.3vh + 0.3em) 0.7vh;
  border-radius: 0.7vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.55rem, 1.5vh, 1rem);
  font-weight: 800;
  color: var(--text);
}
.big.is-static .big-cell {
  opacity: 1;
}

/* ─── 4: chain vs loop ───────────────────────────────────────────────── */
.versus {
  position: absolute;
  top: 22vh;
  left: 4%;
  right: 4%;
  bottom: 2.4vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4%;
}
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1vh;
  padding: 1.4vh 1.6vh;
  border-radius: 1.6vh;
  background: var(--bg);
  border: 2px solid var(--border);
}
.card-title code {
  font-family: var(--font-code);
  font-size: clamp(0.7rem, 1.9vh, 1.25rem);
  font-weight: 800;
  color: var(--lavender);
}
.card-lines {
  display: flex;
  flex-direction: column;
  gap: 0.55vh;
}
.card-lines i {
  display: block;
  height: 0.8vh;
  border-radius: 999px;
  background: var(--border);
}
.card-loop .card-lines i {
  height: 1.2vh;
  background: color-mix(in srgb, var(--mint) 70%, var(--bg));
}
.card-tally {
  margin-top: auto;
  font-size: clamp(0.55rem, 1.4vh, 0.95rem);
  font-weight: 800;
  color: var(--text-dim);
}
.card-cross {
  position: absolute;
  top: 1vh;
  right: 1vh;
  display: grid;
  place-items: center;
  width: 3.4vh;
  height: 3.4vh;
  border-radius: 999px;
  background: var(--coral);
  font-size: clamp(0.7rem, 1.8vh, 1.2rem);
  font-weight: 900;
  color: #FFFFFF;
  opacity: 0;
}

/* ═══ Stages ═══════════════════════════════════════════════════════════ */

/* The walk: fade in on stage 1, walk back and again on 2 and 3; every stop rings its fish. */
.stage-1 .walker {
  opacity: 1;
  animation:
    appear 0.3s ease 0.2s both,
    walk6 4.2s cubic-bezier(0.45, 0, 0.55, 1) var(--d) both;
}
.stage-2 .walker,
.stage-3 .walker {
  opacity: 1;
  animation: rewalk6 4.6s cubic-bezier(0.45, 0, 0.55, 1) 0.1s both;
}
.stage-1 .walker-art,
.stage-2 .walker-art,
.stage-3 .walker-art {
  animation: bob 0.25s ease-in-out 0.2s 18 alternate;
}
.stage-1 .slot-art,
.stage-2 .slot-art,
.stage-3 .slot-art {
  animation: ring 0.7s ease var(--t) both;
}
.stage-4 .walker {
  left: 85%;
  animation: vanish 0.3s ease both;
}

/* 1: the longest-so-far box arrives with the first fish. */
.stage-1 .keep {
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}
.stage-2 .keep {
  animation: vanish 0.3s ease both;
}

/* 2: big fish get a tick and the counter follows; the others step back. */
.stage-2 .count {
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
}
.stage-2 .is-big .slot-badge {
  animation: pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--t) + 0.2s) both;
}
.stage-2 .slot:not(.is-big) {
  animation: dim 0.3s ease calc(var(--t) + 0.2s) both;
}
.stage-3 .is-big .slot-badge {
  opacity: 1;
}
.stage-3 .slot:not(.is-big) {
  opacity: 0.4;
}
.stage-3 .count {
  animation: vanish 0.3s ease both;
}

/* 3: the new basket arrives empty; big fish drop in as Momo passes them. */
.stage-3 .big {
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
}
.big.is-running .big-cell {
  animation: drop-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}

/* 4: the basket clears; the chain grows long and is crossed out, the loop stays short. */
.stage-4 .big {
  animation: vanish 0.3s ease both;
}
.stage-4 .is-big .slot-badge {
  animation: vanish 0.3s ease both;
}
.stage-4 .slot:not(.is-big) {
  animation: undim 0.3s ease both;
}
.stage-4 .card-chain {
  animation: rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
}
.stage-4 .card-chain .card-lines i {
  animation: grow-line 0.25s ease both;
  animation-delay: calc(0.5s + var(--k) * 0.07s);
}
.stage-4 .card-loop {
  animation:
    rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) 1.1s both,
    loop-win 0.6s ease 2.3s both;
}
.stage-4 .card-loop .card-lines i {
  animation: grow-line 0.25s ease both;
  animation-delay: calc(1.3s + var(--k) * 0.08s);
}
.stage-4 .card-chain {
  animation:
    rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both,
    chain-lose 0.5s ease 2.1s both;
}
.stage-4 .card-cross {
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 2.2s both;
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
@keyframes dim {
  from { opacity: 1; }
  to { opacity: 0.4; }
}
@keyframes undim {
  from { opacity: 0.4; }
  to { opacity: 1; }
}
@keyframes pop {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes rise {
  from { opacity: 0; transform: translateY(1.6vh); }
  to { opacity: 1; transform: none; }
}
@keyframes swap-in {
  from { opacity: 0; transform: translateY(-0.8vh); }
  to { opacity: 1; transform: none; }
}
@keyframes drop-in {
  from { opacity: 0; transform: translateY(-5vh); }
  to { opacity: 1; transform: none; }
}
@keyframes grow-line {
  from { transform: scaleX(0); transform-origin: left center; }
  to { transform: scaleX(1); transform-origin: left center; }
}
@keyframes chain-lose {
  to { opacity: 0.55; filter: grayscale(1); }
}
@keyframes loop-win {
  0% { box-shadow: 0 0 0 0 transparent; border-color: var(--border); }
  40% { box-shadow: 0 0 0 0.8vh color-mix(in srgb, var(--mint) 35%, transparent); border-color: var(--mint); }
  100% { box-shadow: 0 0 0 0.4vh color-mix(in srgb, var(--mint) 25%, transparent); border-color: var(--mint); }
}
@keyframes ring {
  0% { outline: 3px solid transparent; outline-offset: 0; }
  35% { outline: 3px solid var(--lavender); outline-offset: 0.5vh; }
  100% { outline: 3px solid transparent; outline-offset: 1.4vh; }
}
@keyframes bob {
  from { transform: translateY(0); }
  to { transform: translateY(-0.7vh); }
}
@keyframes walk6 {
  0%, 8.33% { left: 15%; }
  16.67%, 25% { left: 29%; }
  33.33%, 41.67% { left: 43%; }
  50%, 58.33% { left: 57%; }
  66.67%, 75% { left: 71%; }
  83.33%, 100% { left: 85%; }
}
/* Back to the first fish, then six stops 0.7 s apart from 1 s on. */
@keyframes rewalk6 {
  0% { left: 85%; }
  13.04%, 27.17% { left: 15%; }
  34.78%, 42.39% { left: 29%; }
  50%, 57.61% { left: 43%; }
  65.22%, 72.83% { left: 57%; }
  80.43%, 88.04% { left: 71%; }
  95.65%, 100% { left: 85%; }
}
</style>
