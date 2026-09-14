<script setup lang="ts">
/**
 * "Listen und if" — why lists need loops. Auto-imported as `<LessonListsPain :stage="1" />`.
 *
 * One scene over five slides (PRE-0065 and its four sub-slides):
 *
 *   1. which fish is the longest? We see it at once: bars grow, a crown lands
 *   2. with if/elif it works for three fish: the comparisons tick in
 *   3. six fish: the basket grows and the comparison grid fills 30 cells
 *   4. a hundred fish: the grid turns into a field of 9 900 dots — "So nicht!"
 *   5. the idea: Momo walks the basket once and remembers the longest so far
 *
 * The walk in stage 5 is the loop the next section builds. Each stage opens on
 * the previous stage's last frame. Every word comes from `pain.*` in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3 | 4 | 5

interface Stage {
  headline: string
  note: string
  bubble: string
  tally: string
  code: string
  variant?: 'python' | 'pseudo'
  focus: number[]
  output: string[]
  outputFrom: number
}

const props = defineProps<{ stage: StageNumber }>()
const { t, tm } = useI18n()

const stages = computed(() => tm<Stage[]>('pain.stages'))
const current = computed(() => stages.value[props.stage - 1]!)

const VALUES = [12, 30, 8, 21, 15, 18]
const COLORS = ['sky', 'coral', 'mint', 'lavender', 'sun', 'rose']
const LONGEST = 30

const slots = computed(() => VALUES.slice(0, props.stage <= 2 ? 3 : 6).map((value, i) => ({ i, value })))

/** Slot layout: x of the first slot, pitch and width, all in % of the scene. */
const layout = computed(() => props.stage <= 2
  ? { '--x0': '20%', '--p': '22%', '--w': '16%' }
  : { '--x0': '9%', '--p': '14%', '--w': '12%' })

/** Comparison grid: every pair of different fish. */
const cells = computed(() => {
  const out: Array<{ key: string, diagonal: boolean, order: number }> = []
  let order = 0
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const diagonal = row === col
      out.push({ key: `${row}-${col}`, diagonal, order: diagonal ? 0 : order++ })
    }
  }
  return out
})
</script>

<template>
  <LessonShell
    :eyebrow="t('pain.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :variant="current.variant ?? 'python'"
    :file="t('pain.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-label="t('pain.output')"
    :no-output="t('pain.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`" :style="layout">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- Basket and fish -->
      <div class="basket"></div>
      <div
        v-for="slot in slots"
        :key="slot.i"
        class="slot"
        :class="[`slot-${slot.i}`, { 'is-new': slot.i >= 3, 'is-best': slot.value === LONGEST }]"
        :style="{ '--i': slot.i, '--v': slot.value }"
      >
        <div class="slot-art">
          <ArtSprite name="fish" :color="COLORS[slot.i]" accent="text" :size="96" class="slot-fish" />
          <span class="slot-value"><span class="text-trim">{{ slot.value }}</span></span>
          <span v-if="slot.value === LONGEST" class="crown"><span class="text-trim">★</span></span>
        </div>
        <span class="slot-bar" :style="{ background: `var(--${COLORS[slot.i]})` }"></span>
      </div>

      <!-- 2: the if/elif comparisons -->
      <div class="checks">
        <span class="check check-0">
          <code>fische[0] &gt; fische[1]</code><span class="mark is-no"><span class="text-trim">✗</span></span>
        </span>
        <span class="check check-1">
          <code>fische[1] &gt; fische[0]</code><span class="mark is-yes"><span class="text-trim">✓</span></span>
        </span>
        <span class="check check-2">
          <code>fische[1] &gt; fische[2]</code><span class="mark is-yes"><span class="text-trim">✓</span></span>
        </span>
      </div>

      <!-- 3: every pair of six fish -->
      <div class="grid">
        <span
          v-for="cell in cells"
          :key="cell.key"
          class="cell"
          :class="{ 'is-diagonal': cell.diagonal }"
          :style="{ '--k': cell.order }"
        ></span>
      </div>

      <!-- 4: a hundred fish -->
      <div class="field"></div>
      <span class="stamp"><span class="text-trim">{{ t('pain.stamp') }}</span></span>

      <!-- 5: one walk along the basket -->
      <div class="walker">
        <span class="best">
          <span class="best-label">{{ t('pain.longest') }} =</span>
          <span class="best-values">
            <span class="best-a">12</span>
            <span class="best-b">30</span>
          </span>
        </span>
        <ArtSprite name="cat-stand" color="coral" accent="rose" :size="96" class="walker-art" />
      </div>

      <!-- Momo -->
      <div class="momo">
        <ArtSprite name="cat-peek" color="coral" accent="sun" :size="96" class="momo-art" />
        <span :key="stage" class="bubble">{{ current.bubble }}</span>
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
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}

/* ─── Basket ─────────────────────────────────────────────────────────── */
.basket {
  position: absolute;
  top: 6.4vh;
  left: calc(var(--x0) - 1.5%);
  width: calc(var(--p) * 2 + var(--w) + 3%);
  height: 12.5vh;
  border-radius: 2vh;
  background: color-mix(in srgb, var(--sun) 45%, var(--bg));
  border: 3px solid var(--text);
}
.stage-3 .basket,
.stage-4 .basket,
.stage-5 .basket {
  width: calc(var(--p) * 5 + var(--w) + 3%);
}

.slot {
  position: absolute;
  top: 7.4vh;
  left: calc(var(--x0) + var(--i) * var(--p));
  width: var(--w);
}

.slot-art {
  position: relative;
  height: 9vh;
  border-radius: 1.2vh;
}
/* Explicit size: the sprite's width and height attributes would win over `inset`. */
.slot-fish {
  position: absolute;
  top: 4%;
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
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.65rem, 1.7vh, 1.15rem);
  font-weight: 800;
  color: var(--text);
}

.crown {
  position: absolute;
  top: -1.8vh;
  right: 4%;
  display: grid;
  place-items: center;
  width: 3.4vh;
  height: 3.4vh;
  border-radius: 999px;
  background: var(--sun);
  border: 2px solid var(--text);
  font-size: clamp(0.7rem, 1.8vh, 1.2rem);
  color: var(--text);
}

/* The length of each fish as a bar, scaled to the longest. */
.slot-bar {
  position: absolute;
  top: calc(9vh + 3.4vh);
  left: 0;
  width: calc(var(--v) / 30 * 100%);
  height: 1.1vh;
  border-radius: 999px;
  transform-origin: left center;
}

/* ─── Comparisons (2) ────────────────────────────────────────────────── */
.checks {
  position: absolute;
  top: 22vh;
  right: 5%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1vh;
  opacity: 0;
}
.check {
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 0.7vh 0.8vh 0.7vh 1.2vh;
  border-radius: 1vh;
  background: var(--bg);
  border: 2px solid var(--border);
}
.check code {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  font-weight: 700;
  color: var(--text);
}
.mark {
  display: grid;
  place-items: center;
  width: 2.8vh;
  height: 2.8vh;
  border-radius: 999px;
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  font-weight: 900;
  color: #FFFFFF;
}
.mark.is-yes {
  background: var(--mint);
}
.mark.is-no {
  background: var(--coral);
}

/* ─── Grid (3) and field (4) ─────────────────────────────────────────── */
.grid {
  position: absolute;
  top: 24vh;
  right: 6%;
  display: grid;
  grid-template-columns: repeat(6, 2.6vh);
  gap: 0.5vh;
  opacity: 0;
}
.cell {
  width: 2.6vh;
  height: 2.6vh;
  border-radius: 0.6vh;
  background: var(--mint);
}
.cell.is-diagonal {
  background: transparent;
  border: 2px dashed var(--border);
}

.field {
  position: absolute;
  top: 24vh;
  right: 4%;
  width: 21vh;
  height: 18.5vh;
  border-radius: 1vh;
  background: radial-gradient(circle, var(--coral) 38%, transparent 44%) 0 0 / 0.62vh 0.62vh;
  opacity: 0;
}

.stamp {
  position: absolute;
  top: 29vh;
  right: 7%;
  padding: 1.2vh 2vh;
  border-radius: 1.2vh;
  background: var(--bg);
  border: 4px solid var(--coral);
  font-size: clamp(1rem, 3.4vh, 2.4rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--coral);
  rotate: -8deg;
  opacity: 0;
}

/* ─── Walker (5) ─────────────────────────────────────────────────────── */
.walker {
  position: absolute;
  top: 30vh;
  left: 15%;
  width: 10vh;
  height: 10vh;
  translate: -50% 0;
  opacity: 0;
}
.walker-art {
  width: 100%;
  height: 100%;
}

.best {
  position: absolute;
  bottom: calc(100% + 0.4vh);
  left: 50%;
  translate: -50% 0;
  display: flex;
  align-items: center;
  gap: 0.8vh;
  padding: 0.6vh 0.6vh 0.6vh 1.2vh;
  border-radius: 999px;
  background: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
}
.best-values {
  display: inline-grid;
}
.best-a,
.best-b {
  grid-area: 1 / 1;
  padding: 0.3vh 0.8vh;
  border-radius: 999px;
  background: var(--sun);
  color: var(--text);
  text-align: center;
}

/* ─── Momo ───────────────────────────────────────────────────────────── */
.momo {
  position: absolute;
  left: 4%;
  bottom: 0;
  height: 12vh;
}
.momo-art {
  width: 12vh;
  height: 12vh;
}
.bubble {
  position: absolute;
  left: 14vh;
  top: 1.4vh;
  padding: 1.2vh 1.8vh;
  border-radius: 1.6vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.8rem, 2.1vh, 1.45rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
  transform-origin: 0% 100%;
  animation: pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both;
}
.bubble::after {
  content: '';
  position: absolute;
  left: -0.75vh;
  bottom: 1.6vh;
  width: 1.2vh;
  height: 1.2vh;
  background: var(--bg);
  border-left: 2px solid var(--text);
  border-bottom: 2px solid var(--text);
  transform: rotate(45deg);
}

/* ═══ Stages ═══════════════════════════════════════════════════════════ */

/* 1: the bars measure each fish, the crown lands on the longest. */
.stage-1 .slot-bar {
  animation: grow-bar 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(0.4s + var(--i) * 0.18s);
}
.stage-1 .crown {
  animation: pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 1.3s both;
}
.stage-1 .bubble {
  animation-delay: 1.7s;
}

/* 2: the comparisons of the if/elif chain tick in. */
.stage-2 .checks {
  opacity: 1;
}
.stage-2 .check {
  animation: rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.stage-2 .check-0 { animation-delay: 0.4s; }
.stage-2 .check-1 { animation-delay: 1s; }
.stage-2 .check-2 { animation-delay: 1.5s; }
.stage-2 .mark {
  animation: pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.stage-2 .check-0 .mark { animation-delay: 0.75s; }
.stage-2 .check-1 .mark { animation-delay: 1.35s; }
.stage-2 .check-2 .mark { animation-delay: 1.85s; }
.stage-2 .is-best .slot-art {
  animation: ring 0.9s ease 2.1s both;
}

/* 3: the basket grows to six, and every pair gets a cell. */
.stage-3 .checks {
  animation: vanish 0.25s ease both;
}
.stage-3 .basket {
  animation: basket-grow 0.6s cubic-bezier(0.65, 0, 0.35, 1) 0.2s both;
}
.stage-3 .slot:not(.is-new) {
  animation: relayout 0.6s cubic-bezier(0.65, 0, 0.35, 1) 0.2s both;
}
.stage-3 .slot.is-new {
  animation: drop-slot 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(0.75s + (var(--i) - 3) * 0.15s);
}
.stage-3 .is-new .slot-bar {
  animation: grow-bar 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(1.1s + (var(--i) - 3) * 0.15s);
}
.stage-3 .grid {
  animation: appear 0.3s ease 1.2s both;
}
.stage-3 .cell:not(.is-diagonal) {
  animation: pop 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(1.4s + var(--k) * 0.05s);
}

/* 4: the grid turns into a field of dots, then the stamp. */
.stage-4 .grid {
  animation: vanish 0.3s ease both;
}
.stage-4 .field {
  opacity: 1;
  animation: reveal 1.2s cubic-bezier(0.45, 0, 0.55, 1) 0.3s both;
}
.stage-4 .stamp {
  animation: stamp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 1.7s both;
}

/* 5: the field clears; Momo walks the basket once. */
.stage-5 .field,
.stage-5 .stamp {
  animation: vanish 0.3s ease both;
}
.stage-5 .momo {
  animation: vanish 0.3s ease both;
}
.stage-5 .walker {
  animation:
    appear 0.3s ease 0.3s both,
    walk6 4.2s cubic-bezier(0.45, 0, 0.55, 1) 0.6s both;
}
.stage-5 .walker-art {
  animation: bob 0.25s ease-in-out 0.6s 16 alternate;
}
.stage-5 .slot-art {
  animation: ring 0.8s ease both;
  animation-delay: calc(0.75s + var(--i) * 0.714s);
}
.best-b {
  opacity: 0;
}
.stage-5 .best-a {
  animation: lift-out 0.3s ease-in 1.4s both;
}
.stage-5 .best-b {
  animation: drop-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) 1.55s both;
}
.stage-5 .tally {
  animation-delay: 4.9s;
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
  from { opacity: 0; transform: translateY(1.6vh); }
  to { opacity: 1; transform: none; }
}
@keyframes grow-bar {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes ring {
  0% { outline: 3px solid transparent; outline-offset: 0; }
  35% { outline: 3px solid var(--lavender); outline-offset: 0.5vh; }
  100% { outline: 3px solid transparent; outline-offset: 1.4vh; }
}
@keyframes basket-grow {
  from { left: calc(20% - 1.5%); width: calc(22% * 2 + 16% + 3%); }
  to { left: calc(9% - 1.5%); width: calc(14% * 5 + 12% + 3%); }
}
@keyframes relayout {
  from { left: calc(20% + var(--i) * 22%); width: 16%; }
  to { left: calc(9% + var(--i) * 14%); width: 12%; }
}
@keyframes drop-slot {
  from { opacity: 0; transform: translateY(-8vh); }
  to { opacity: 1; transform: none; }
}
@keyframes reveal {
  from { clip-path: inset(0 100% 100% 0); }
  to { clip-path: inset(0 0 0 0); }
}
@keyframes stamp {
  from { opacity: 0; transform: scale(1.8); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes walk6 {
  0%, 8% { left: 15%; }
  17%, 25% { left: 29%; }
  34%, 42% { left: 43%; }
  51%, 59% { left: 57%; }
  68%, 76% { left: 71%; }
  85%, 100% { left: 85%; }
}
@keyframes bob {
  from { transform: translateY(0); }
  to { transform: translateY(-0.7vh); }
}
@keyframes lift-out {
  from { opacity: 1; transform: none; }
  to { opacity: 0; transform: translateY(-2vh); }
}
@keyframes drop-in {
  from { opacity: 0; transform: translateY(-2vh); }
  to { opacity: 1; transform: none; }
}
</style>
