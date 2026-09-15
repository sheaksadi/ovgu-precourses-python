<script setup lang="ts">
/**
 * while lesson: "Solange …". Auto-imported as `<LessonWhileLoop :stage="1" />`.
 *
 * Five slides (PRE-0084 and its four sub-slides):
 *
 *   1. Momo eats until she is full — nobody knows how many bites
 *   2. `while bauch < 12:` checks the lever before every bite; at 12 it flips off
 *   3. forget to change `bauch` and the loop never ends: Bello chases his tail
 *   4. `while True` with `break`: a guessing game that stops at the right number
 *   5. `continue` skips the rotten fish and walks on
 *
 * Each scene is kept for one extra stage so it can clear away as the next one
 * arrives, which keeps every cut on the previous stage's last frame. Beats are
 * timed in the script and handed to CSS as `--t`. Words come from
 * `loops.while.*` in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3 | 4 | 5

interface Stage {
  headline: string
  note: string
  tally: string
  code: string
  variant?: 'python' | 'pseudo'
  focus: number[]
  output: string[]
  outputFrom: number
}

const props = defineProps<{ stage: StageNumber }>()
const { t, tm } = useI18n()

const stages = computed(() => tm<Stage[]>('loops.while.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const names = computed(() => tm<Record<'belly' | 'hungry', string>>('loops.while.names'))
const menu = computed(() => tm<string[]>('loops.while.menu'))
const rotten = computed(() => t('loops.while.rotten'))

/* ─── Stage 2: three bites, then the check fails ─── */
const BITE = 4
const FULL = 12
const biteAt = (k: number) => 0.9 + k * 1.1
const checks = computed(() => [0, 1, 2, 3].map(k => ({
  k,
  belly: k * BITE,
  yes: k * BITE < FULL,
  t: biteAt(k),
})))

/* ─── Stage 3: a counter that runs away ─── */
const RUNAWAY = ['1', '2', '3', '5', '9', '20', '64', '250', '999', '∞']
const RUNAWAY_AT = [0.6, 1.0, 1.35, 1.65, 1.9, 2.1, 2.3, 2.45, 2.6, 2.75]

/* ─── Stage 4: three guesses ─── */
const SECRET = 7
const GUESSES = [3, 9, 7]
const guessAt = (k: number) => 0.8 + k * 1.2

/* ─── Stage 5: four fish, one rotten ─── */
const fishColors = ['sky', 'text-muted', 'mint', 'lavender']
const walkAt = (i: number) => 0.7 + i * 1.0

const outputDelays = computed(() => {
  switch (props.stage) {
    case 2: return [biteAt(0) + 0.75, biteAt(1) + 0.75, biteAt(2) + 0.75, biteAt(3) + 0.7]
    case 3: return [0.7, 1.05, 1.4, 1.75, 2.1, 2.6]
    case 4: return [0.9, 1.3, 2.1, 2.5, 3.3, 3.7]
    case 5: return [walkAt(0) + 0.35, walkAt(2) + 0.35, walkAt(3) + 0.35]
    default: return []
  }
})

const show = (...list: number[]) => list.includes(props.stage)
</script>

<template>
  <LessonShell
    :eyebrow="t('loops.while.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :variant="current.variant ?? 'python'"
    :file="t('loops.while.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    :output-label="t('loops.while.output')"
    :no-output="t('loops.while.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- ═══ 1–3: Momo eats ═══ -->
      <div v-if="show(1, 2, 3, 4)" class="eat">
        <div class="bowl">
          <ArtSprite
            v-for="k in 3"
            :key="k"
            name="fish"
            :color="['sky', 'coral', 'mint'][k - 1]"
            accent="text"
            :size="96"
            class="bowl-fish"
            :style="{ '--k': k - 1, '--t': `${biteAt(k - 1) + 0.25}s` }"
          />
          <span class="bowl-dish"></span>
        </div>

        <div class="eater">
          <ArtSprite name="cat" color="coral" accent="rose" :size="96" class="eater-art" />
          <span class="question"><span class="text-trim">?</span></span>
        </div>

        <!-- The belly meter -->
        <div class="meter">
          <span class="meter-name"><span class="text-trim">{{ stage === 1 ? names.hungry : names.belly }}</span></span>
          <div class="meter-tube">
            <span
              v-for="k in 3"
              :key="k"
              class="meter-fill"
              :style="{ '--k': k - 1, '--t': `${biteAt(k - 1) + 0.7}s` }"
            ></span>
            <span class="meter-line"><span class="text-trim">{{ FULL }}</span></span>
          </div>
        </div>

        <!-- The condition, checked before every bite -->
        <div class="condition">
          <div class="lever">
            <ArtSprite name="lever" state="on" color="mint" accent="text" :size="96" class="lever-art lever-on" />
            <ArtSprite name="lever" state="off" color="coral" accent="text" :size="96" class="lever-art lever-off" />
          </div>
          <span class="check-stack">
            <span v-if="stage === 1" class="check is-pseudo"><span class="text-trim">{{ t('loops.while.pseudoCheck') }}</span></span>
            <template v-else>
              <span
                v-for="check in checks"
                :key="check.k"
                class="check"
                :class="check.yes ? 'is-yes' : 'is-no'"
                :style="{ '--t': `${check.t}s`, '--u': `${checks[check.k + 1]?.t ?? 999}s` }"
              >
                <code>{{ stage === 3 ? 0 : check.belly }} &lt; {{ FULL }}</code>
                <b><span class="text-trim">{{ stage === 3 || check.yes ? '✓' : '✗' }}</span></b>
              </span>
            </template>
          </span>
        </div>

        <span class="full"><span class="text-trim">{{ t('loops.while.full') }}</span></span>
      </div>

      <!-- ═══ 3: never ending ═══ -->
      <div v-if="show(3, 4)" class="runaway">
        <div class="bello">
          <ArtSprite name="dog" color="sun" accent="text" :size="96" class="bello-art" />
        </div>
        <span class="counter">
          <span class="counter-label">{{ t('loops.while.pass') }}</span>
          <span class="counter-stack">
            <span
              v-for="(value, k) in RUNAWAY"
              :key="k"
              class="counter-value"
              :style="{ '--t': `${RUNAWAY_AT[k]}s`, '--u': `${RUNAWAY_AT[k + 1] ?? 999}s` }"
            >{{ value }}</span>
          </span>
        </span>
        <span class="stop">
          <span class="stop-square"></span>
          <span class="text-trim">{{ t('loops.while.stop') }}</span>
        </span>
      </div>

      <!-- ═══ 4: guess until right ═══ -->
      <div v-if="show(4, 5)" class="guess">
        <div class="loop-ring">
          <Icon name="lucide:repeat" class="ring-icon" />
          <code class="ring-code">while True</code>
        </div>
        <div class="cards">
          <div
            v-for="(value, k) in GUESSES"
            :key="k"
            class="card"
            :class="value === SECRET ? 'is-right' : 'is-wrong'"
            :style="{ '--t': `${guessAt(k)}s` }"
          >
            <span class="card-number"><span class="text-trim">{{ value }}</span></span>
            <span class="card-verdict"><span class="text-trim">{{ value === SECRET ? t('loops.while.right') : t('loops.while.again') }}</span></span>
          </div>
        </div>
        <div class="exit">
          <ArtSprite name="flag" color="mint" accent="text" :size="96" class="exit-flag" />
          <code class="exit-code">break</code>
        </div>
      </div>

      <!-- ═══ 5: skip the rotten one ═══ -->
      <div v-if="show(5)" class="skip">
        <div class="tray"></div>
        <div
          v-for="(dish, i) in menu"
          :key="i"
          class="dish"
          :class="{ 'is-rotten': dish === rotten }"
          :style="{ '--i': i, '--t': `${walkAt(i)}s` }"
        >
          <ArtSprite name="fish" :color="fishColors[i]" accent="text" :size="96" class="dish-fish" />
          <span v-if="dish === rotten" class="stink"><span class="text-trim">~</span></span>
          <span class="dish-name"><span class="text-trim">{{ dish }}</span></span>
          <span class="dish-mark"><span class="text-trim">{{ dish === rotten ? 'continue' : '✓' }}</span></span>
        </div>
        <div class="walker">
          <ArtSprite name="cat-stand" color="coral" accent="rose" :size="96" class="walker-art" />
        </div>
      </div>
    </div>
  </LessonShell>
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
}
.eat,
.runaway,
.guess,
.skip {
  position: absolute;
  inset: 0;
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

/* ═══ Eat ══════════════════════════════════════════════════════════════ */
.bowl {
  position: absolute;
  left: 6%;
  top: 30vh;
  width: 24%;
  height: 12vh;
}
.bowl-dish {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 6vh;
  border-radius: 0 0 999px 999px;
  background: var(--sky);
  border: 3px solid var(--text);
}
.bowl-fish {
  position: absolute;
  bottom: 4vh;
  left: calc(4% + var(--k) * 28%);
  width: 40%;
  height: 6vh;
}

.eater {
  position: absolute;
  left: 30%;
  top: 22vh;
  width: 18vh;
  height: 18vh;
}
.eater-art {
  width: 100%;
  height: 100%;
}
.question {
  position: absolute;
  top: -1vh;
  right: 0;
  display: grid;
  place-items: center;
  width: 4.4vh;
  height: 4.4vh;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.9rem, 2.6vh, 1.7rem);
  font-weight: 900;
  color: var(--text);
  opacity: 0;
}

.meter {
  position: absolute;
  left: 66%;
  top: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8vh;
  translate: -50% 0;
}
.meter-name {
  padding: calc(0.3vh + 0.3em) 1vh;
  border-radius: 999px;
  background: var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.55rem, 1.4vh, 0.95rem);
  font-weight: 800;
  color: var(--bg);
}
.meter-tube {
  position: relative;
  width: 5.4vh;
  height: 30vh;
  overflow: visible;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 3px solid var(--text);
}
.meter-fill {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(var(--k) * 33.333%);
  height: 33.333%;
  background: var(--mint);
  transform-origin: bottom center;
  opacity: 0;
}
.meter-fill:first-child {
  border-radius: 0 0 1vh 1vh;
}
.meter-fill:nth-child(3) {
  border-radius: 1vh 1vh 0 0;
}
.meter-line {
  position: absolute;
  top: -0.2vh;
  left: calc(100% + 0.6vh);
  padding: calc(0.2vh + 0.3em) 0.7vh;
  border-radius: 999px;
  background: var(--coral);
  font-family: var(--font-code);
  font-size: clamp(0.5rem, 1.3vh, 0.9rem);
  font-weight: 800;
  color: #FFFFFF;
}

.condition {
  position: absolute;
  left: 86%;
  top: 11vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;
  translate: -50% 0;
}
.lever {
  position: relative;
  width: 10vh;
  height: 10vh;
}
.lever-art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.lever-off {
  opacity: 0;
}

.check-stack {
  display: inline-grid;
  justify-items: center;
}
.check {
  grid-area: 1 / 1;
  display: flex;
  align-items: center;
  gap: 0.7vh;
  padding: 0.5vh 0.5vh 0.5vh 1vh;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--border);
  white-space: nowrap;
  opacity: 0;
}
.check code {
  font-family: var(--font-code);
  font-size: clamp(0.55rem, 1.5vh, 1rem);
  font-weight: 800;
  color: var(--text);
}
.check b {
  display: grid;
  place-items: center;
  width: 2.4vh;
  height: 2.4vh;
  border-radius: 999px;
  font-size: clamp(0.5rem, 1.3vh, 0.9rem);
  color: #FFFFFF;
}
.check.is-yes b {
  background: var(--mint);
}
.check.is-no b {
  background: var(--coral);
}
.check.is-pseudo {
  padding: calc(0.4vh + 0.3em) 1.2vh;
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  font-weight: 800;
  opacity: 1;
}

.full {
  position: absolute;
  left: 39%;
  top: 15vh;
  padding: calc(0.5vh + 0.3em) 1.4vh;
  border-radius: 999px;
  background: var(--mint);
  font-size: clamp(0.7rem, 1.9vh, 1.3rem);
  font-weight: 900;
  color: #FFFFFF;
  translate: -50% 0;
  opacity: 0;
}

/* ═══ Runaway ══════════════════════════════════════════════════════════ */
.bello {
  position: absolute;
  left: 10%;
  top: 8vh;
  width: 13vh;
  height: 13vh;
}
.bello-art {
  width: 100%;
  height: 100%;
}
.counter {
  position: absolute;
  left: 12%;
  top: 23vh;
  display: flex;
  align-items: center;
  gap: 0.8vh;
  padding: 0.5vh 0.5vh 0.5vh 1.1vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.55rem, 1.45vh, 0.95rem);
  font-weight: 800;
  color: var(--bg);
}
.counter-stack {
  display: inline-grid;
}
.counter-value {
  grid-area: 1 / 1;
  min-width: 3.4em;
  padding: 0.25vh 0.8vh;
  border-radius: 999px;
  background: var(--coral);
  font-family: var(--font-code);
  text-align: center;
  color: #FFFFFF;
  opacity: 0;
}
.stop {
  position: absolute;
  left: 50%;
  bottom: 2.4vh;
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 1vh 1.6vh;
  border-radius: 1.2vh;
  background: var(--bg);
  border: 2px solid var(--coral);
  font-size: clamp(0.65rem, 1.7vh, 1.15rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
  translate: -50% 0;
  opacity: 0;
}
.stop-square {
  width: 2vh;
  height: 2vh;
  border-radius: 0.4vh;
  background: var(--coral);
}

/* ═══ Guess ════════════════════════════════════════════════════════════ */
.loop-ring {
  position: absolute;
  left: 50%;
  top: 7vh;
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 0.8vh 1.6vh;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--lavender);
  translate: -50% 0;
  opacity: 0;
}
.ring-icon {
  font-size: 2.6vh;
  color: var(--lavender);
}
.ring-code {
  font-family: var(--font-code);
  font-size: clamp(0.7rem, 2vh, 1.35rem);
  font-weight: 800;
  color: var(--text);
}

.cards {
  position: absolute;
  left: 6%;
  right: 22%;
  top: 17vh;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4%;
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.4vh;
  padding: 2.4vh 1vh;
  border-radius: 1.8vh;
  background: var(--bg);
  border: 3px solid var(--border);
  opacity: 0;
}
.card-number {
  font-family: var(--font-code);
  font-size: clamp(1.6rem, 7vh, 4.4rem);
  font-weight: 900;
  line-height: 1;
  color: var(--text);
}
.card-verdict {
  padding: calc(0.3vh + 0.3em) 1vh;
  border-radius: 999px;
  font-size: clamp(0.55rem, 1.45vh, 0.95rem);
  font-weight: 800;
  white-space: nowrap;
  color: #FFFFFF;
  opacity: 0;
}
.card.is-wrong .card-verdict {
  background: var(--coral);
}
.card.is-right .card-verdict {
  background: var(--mint);
}

.exit {
  position: absolute;
  right: 5%;
  top: 19vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6vh;
  opacity: 0;
}
.exit-flag {
  width: 11vh;
  height: 11vh;
}
.exit-code {
  padding: calc(0.3vh + 0.3em) 1.1vh;
  border-radius: 999px;
  background: var(--mint);
  font-family: var(--font-code);
  font-size: clamp(0.65rem, 1.8vh, 1.2rem);
  font-weight: 800;
  color: #FFFFFF;
}

/* ═══ Skip ═════════════════════════════════════════════════════════════ */
.tray {
  position: absolute;
  left: 6%;
  right: 6%;
  top: 8vh;
  height: 16vh;
  border-radius: 2vh;
  background: color-mix(in srgb, var(--sun) 45%, var(--bg));
  border: 3px solid var(--text);
  animation: appear 0.3s ease both;
}
.dish {
  position: absolute;
  top: 9.5vh;
  left: calc(18% + var(--i) * 21%);
  width: 16%;
  height: 13vh;
  translate: -50% 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: rise 0.35s cubic-bezier(0.22, 1, 0.36, 1) calc(0.1s + var(--i) * 0.07s) both;
}
/* Explicit size: the sprite's width and height attributes would win over `inset`. */
.dish-fish {
  width: 100%;
  height: 7vh;
}
.dish.is-rotten .dish-fish {
  filter: grayscale(1);
  opacity: 0.7;
}
.stink {
  position: absolute;
  top: -1.4vh;
  left: 50%;
  translate: -50% 0;
  font-size: clamp(0.9rem, 2.6vh, 1.7rem);
  font-weight: 900;
  color: var(--text-muted);
  animation: stink 1.2s ease-in-out infinite;
}
.dish-name {
  margin-top: 0.6vh;
  padding: calc(0.3vh + 0.3em) 0.8vh;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
}
.dish-mark {
  position: absolute;
  top: calc(100% + 3vh);
  padding: calc(0.3vh + 0.3em) 0.9vh;
  border-radius: 999px;
  background: var(--mint);
  font-family: var(--font-code);
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 800;
  white-space: nowrap;
  color: #FFFFFF;
  opacity: 0;
}
.dish.is-rotten .dish-mark {
  background: var(--coral);
}

.walker {
  position: absolute;
  top: 33vh;
  left: 18%;
  width: 10vh;
  height: 10vh;
  translate: -50% 0;
  opacity: 0;
}
.walker-art {
  width: 100%;
  height: 100%;
}

/* ═══ Stages ═══════════════════════════════════════════════════════════ */

/* 1: the question: how many bites? */
.stage-1 .question {
  animation: pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.8s both;
}
.stage-1 .eater-art {
  animation: bob 0.5s ease-in-out 1.2s 4 alternate;
}

/* 2: check, bite, fill — three times; the fourth check fails and the lever flips. */
.stage-2 .check {
  animation:
    swap-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both,
    vanish 0.1s ease var(--u) forwards;
}
.stage-2 .bowl-fish {
  animation: eaten 0.5s cubic-bezier(0.55, 0, 0.45, 1) var(--t) both;
}
.stage-2 .meter-fill {
  animation: fill 0.4s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.stage-2 .eater-art {
  animation: chomp 0.3s ease 1.25s 3;
  animation-delay: 1.35s;
}
.stage-2 .lever-on {
  animation: vanish 0.2s ease 4.4s both;
}
.stage-2 .lever-off {
  animation: appear 0.2s ease 4.4s both;
}
.stage-2 .full {
  animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 4.8s both;
}

/* 3: same scene, the belly stays empty, the check always passes, Bello spins. */
.stage-3 .bowl-fish,
.stage-4 .bowl-fish {
  opacity: 0;
}
.stage-3 .meter-fill {
  opacity: 1;
  animation: vanish 0.3s ease 0.2s both;
}
.stage-3 .lever-off {
  opacity: 1;
  animation: vanish 0.2s ease 0.3s both;
}
.stage-3 .full {
  opacity: 1;
  animation: vanish 0.25s ease both;
}
.stage-3 .check {
  animation:
    swap-in 0.2s ease calc(0.6s + var(--k, 0) * 0s) both;
}
.stage-3 .check:not(:first-child) {
  display: none;
}
.stage-3 .eat {
  animation: dim 0.4s ease 0.5s both;
}
.stage-3 .bello {
  animation: appear 0.3s ease 0.3s both;
}
.stage-3 .bello-art {
  animation: spin 0.9s linear 0.4s infinite;
}
.stage-3 .counter {
  animation: pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
}
.stage-3 .counter-value {
  animation:
    appear 0.05s linear var(--t) both,
    vanish 0.05s linear var(--u) forwards;
}
.stage-3 .counter-value:last-child {
  animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) var(--t) both;
}
.stage-3 .stop {
  animation:
    rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) 3s both,
    pulse 1.2s ease-in-out 3.4s infinite;
}
.runaway {
  pointer-events: none;
}
.stage-3 .eat .eater,
.stage-3 .eat .bowl {
  visibility: visible;
}

/* 4: everything clears; three guesses, the right one breaks out. */
.stage-4 .eat,
.stage-4 .runaway {
  animation: vanish 0.3s ease both;
}
.stage-4 .counter,
.stage-4 .bello {
  opacity: 1;
}
.stage-4 .counter-value:last-child {
  opacity: 1;
}
.stage-4 .loop-ring {
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both;
}
.stage-4 .ring-icon {
  animation: spin 1.2s linear 0.4s 3;
}
.stage-4 .card {
  animation: flip-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.stage-4 .card-verdict {
  animation: pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--t) + 0.45s) both;
}
.stage-4 .card.is-wrong {
  animation:
    flip-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both,
    shake 0.4s ease calc(var(--t) + 0.45s) both;
}
.stage-4 .card.is-right {
  animation:
    flip-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both,
    right 0.5s ease calc(var(--t) + 0.45s) both;
}
.stage-4 .exit {
  animation: pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 3.9s both;
}

/* 5: the guessing clears; Momo walks the tray, eats three, skips the rotten one. */
.stage-5 .guess {
  animation: vanish 0.3s ease both;
}
.stage-5 .loop-ring,
.stage-5 .card,
.stage-5 .card-verdict,
.stage-5 .exit {
  opacity: 1;
}
.stage-5 .card.is-right {
  border-color: var(--mint);
}
.stage-5 .walker {
  opacity: 1;
  animation:
    appear 0.3s ease 0.3s both,
    walk4 3s cubic-bezier(0.45, 0, 0.55, 1) 0.7s both;
}
.stage-5 .walker-art {
  animation: bob 0.25s ease-in-out 0.3s 14 alternate;
}
.stage-5 .dish-mark {
  animation: pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--t) + 0.25s) both;
}
.stage-5 .dish:not(.is-rotten) .dish-fish {
  animation: nibble 0.45s ease calc(var(--t) + 0.15s) both;
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
  to { opacity: 0.35; }
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
@keyframes flip-in {
  from { opacity: 0; transform: rotateY(80deg) scale(0.9); }
  to { opacity: 1; transform: none; }
}
@keyframes bob {
  from { transform: translateY(0); }
  to { transform: translateY(-0.7vh); }
}
@keyframes chomp {
  0%, 100% { transform: none; }
  50% { transform: scale(1.06) rotate(-3deg); }
}
/* The fish hops from the bowl into Momo and is gone. */
@keyframes eaten {
  0% { opacity: 1; transform: none; }
  60% { opacity: 1; transform: translate(10vh, -8vh) scale(0.8) rotate(-20deg); }
  100% { opacity: 0; transform: translate(14vh, -6vh) scale(0.3); }
}
@keyframes fill {
  from { opacity: 1; transform: scaleY(0); }
  to { opacity: 1; transform: scaleY(1); }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--coral) 40%, transparent); }
  50% { box-shadow: 0 0 0 1vh transparent; }
}
@keyframes shake {
  0%, 100% { transform: none; }
  25% { transform: translateX(-0.8vh); }
  75% { transform: translateX(0.8vh); }
}
@keyframes right {
  0% { border-color: var(--border); transform: none; }
  40% { border-color: var(--mint); transform: scale(1.06); }
  100% { border-color: var(--mint); transform: none; }
}
@keyframes stink {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(-0.8vh); opacity: 1; }
}
@keyframes nibble {
  0% { transform: none; }
  30% { transform: scale(1.1) rotate(8deg); }
  100% { transform: scale(0.85); opacity: 0.35; }
}
@keyframes walk4 {
  0%, 16.67% { left: 18%; }
  33.33%, 50% { left: 39%; }
  66.67%, 83.33% { left: 60%; }
  100% { left: 81%; }
}
</style>
