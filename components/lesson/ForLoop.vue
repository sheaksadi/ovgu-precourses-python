<script setup lang="ts">
/**
 * for-loop lesson: "Jeden Fisch anschauen". Auto-imported as `<LessonForLoop :stage="1" />`.
 *
 * One scene over five slides (PRE-0071 and its four sub-slides), continuing the
 * walk that closed the lists-and-if lesson:
 *
 *   1. printing every fish takes five nearly identical lines
 *   2. Momo walks the basket; at each fish the box `fisch` gets its value
 *   3. the same walk, now as `for fisch in fische:`
 *   4. indented runs every pass, not indented runs once afterwards
 *   5. collecting on the way: `gesamt` grows 0 → 12 → 42 → 50 → 71 → 86
 *
 * The walk has five stops, 0.8 s apart, starting at `--d`. Everything that
 * happens at a stop — the ring, the box value, the pass counter, the output line —
 * is timed from that one rhythm. Every word comes from `loops.for.*` in `locales/`.
 */
import { computed } from 'vue'
import { useCodeLink } from '~/composables/useCodeLink'
import { useI18n } from '~/composables/useI18n'
import { useLineClock, type LineStep } from '~/composables/useLineClock'

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
const link = useCodeLink()

const stages = computed(() => tm<Stage[]>('loops.for.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const names = computed(() => tm<{ item: string, list: string, total: string }>('loops.for.names'))

const VALUES = [12, 30, 8, 21, 15]
const COLORS = ['sky', 'coral', 'mint', 'lavender', 'sun']
const SUMS = VALUES.reduce<number[]>((sums, value) => [...sums, sums[sums.length - 1]! + value], [0])
const STEP = 0.8

const walking = computed(() => props.stage === 2 || props.stage === 3 || props.stage === 5)
/** When Momo reaches the first fish: after fading in on stage 2, after walking back on 3 and 5. */
const start = computed(() => (props.stage === 2 ? 0.6 : 1))

const outputDelays = computed(() => {
  if (props.stage === 1) return VALUES.map((_, i) => 0.55 + i * 0.5)
  if (props.stage === 2 || props.stage === 3) return VALUES.map((_, i) => start.value + 0.15 + i * STEP)
  if (props.stage === 5) return [start.value + VALUES.length * STEP + 0.3]
  return [0, 0, 0, 0, 0, 0.9]
})

/**
 * The code panel walks with Momo: the `for` lights when she reaches a fish, the
 * body while that pass runs, and the line after the loop once she is done.
 */
const at = (i: number) => start.value + i * STEP
const schedule = computed<LineStep[]>(() => {
  const steps: LineStep[] = []
  const last = VALUES.length - 1
  switch (props.stage) {
    case 1:
      VALUES.forEach((_, i) => steps.push({ at: 0.55 + i * 0.5, line: i + 2 }))
      break
    case 2:
      VALUES.forEach((_, i) => {
        steps.push({ at: at(i), line: 1 }, { at: at(i) + 0.25, line: 2 })
      })
      break
    case 3:
      VALUES.forEach((_, i) => {
        steps.push({ at: at(i), line: 2 }, { at: at(i) + 0.25, line: 3 })
      })
      break
    case 4:
      VALUES.forEach((_, i) => {
        steps.push({ at: at(i), line: 2 }, { at: at(i) + 0.25, line: 3 })
      })
      steps.push({ at: at(last) + 0.9, line: 4 })
      break
    case 5:
      VALUES.forEach((_, i) => {
        steps.push({ at: at(i), line: 3 }, { at: at(i) + 0.25, line: 4 })
      })
      steps.push({ at: at(last) + 0.9, line: 5 })
      break
  }
  return steps
})
const line = useLineClock(() => schedule.value, () => props.stage)

const lit = (word: string) => link.isActive(`word:${word}`)
</script>

<template>
  <LessonShell
    :eyebrow="t('loops.for.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :variant="current.variant ?? 'python'"
    :file="t('loops.for.file')"
    :focus="line ? [line] : current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    :output-label="t('loops.for.output')"
    :no-output="t('loops.for.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`" :style="{ '--d': `${start}s` }">
      <!-- Pass counter, or a summary when nobody walks -->
      <span v-if="walking" class="tally">
        <span class="text-trim">{{ t('loops.for.pass') }}</span>
        <span class="stack">
          <span v-for="(_, i) in VALUES" :key="i" class="stack-item pass" :style="{ '--i': i }">{{ i + 1 }} / {{ VALUES.length }}</span>
        </span>
      </span>
      <span v-else :key="stage" class="tally is-static"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- The basket -->
      <div class="basket" :class="{ 'is-lit': lit(names.list) }">
        <span class="basket-name"><span class="text-trim">{{ names.list }}</span></span>
      </div>
      <div v-for="(value, i) in VALUES" :key="i" class="slot" :style="{ '--i': i }">
        <div class="slot-art">
          <ArtSprite name="fish" :color="COLORS[i]" accent="text" :size="96" class="slot-fish" />
          <span class="slot-value"><span class="text-trim">{{ value }}</span></span>
        </div>
      </div>

      <!-- Momo walking, carrying the loop variable -->
      <div class="walker">
        <span class="carry" :class="{ 'is-lit': lit(names.item) }">
          <span class="carry-name">{{ names.item }} =</span>
          <span class="stack">
            <span v-for="(value, i) in VALUES" :key="i" class="stack-item carry-value" :style="{ '--i': i }">{{ value }}</span>
          </span>
        </span>
        <ArtSprite name="cat-stand" color="coral" accent="rose" :size="96" class="walker-art" />
      </div>

      <!-- 4: after the loop -->
      <div class="finish">
        <ArtSprite name="flag" color="mint" accent="text" :size="96" class="finish-art" />
        <span class="finish-label"><span class="text-trim">{{ t('loops.for.done') }}</span></span>
      </div>
      <div class="times">
        <span class="time time-loop"><code>print({{ names.item }})</code><b><span class="text-trim">5×</span></b></span>
        <span class="time time-after"><code>print("{{ t('loops.for.done') }}")</code><b><span class="text-trim">1×</span></b></span>
      </div>

      <!-- 5: the running total -->
      <div class="total" :class="{ 'is-lit': lit(names.total) }">
        <div class="total-art">
          <ArtSprite name="box" color="sky" accent="text-muted" :size="96" class="total-box" />
          <span class="stack total-stack">
            <span v-for="(sum, j) in SUMS" :key="j" class="stack-item total-value" :style="{ '--j': j }">{{ sum }}</span>
          </span>
        </div>
        <span class="total-name"><span class="text-trim">{{ names.total }}</span></span>
      </div>
      <span v-for="(value, i) in VALUES" :key="`fly-${i}`" class="fly" :style="{ '--i': i }">+{{ value }}</span>

      <!-- Momo's comment -->
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

/* Values that change in place share one grid cell. */
.stack {
  display: inline-grid;
}
.stack-item {
  grid-area: 1 / 1;
  text-align: center;
  opacity: 0;
}

.tally {
  position: absolute;
  top: 1.6vh;
  left: 50%;
  translate: -50% 0;
  display: flex;
  align-items: center;
  gap: 0.8vh;
  padding: calc(0.4vh + 0.3em) 1.3vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
}
.tally.is-static {
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}
.pass {
  min-width: 4.4em;
  font-family: var(--font-code);
  color: var(--sun);
}

/* ─── Basket ─────────────────────────────────────────────────────────── */
.basket {
  position: absolute;
  top: 7vh;
  left: 13.5%;
  width: 71%;
  height: 12.5vh;
  border-radius: 2vh;
  background: color-mix(in srgb, var(--sun) 45%, var(--bg));
  border: 3px solid var(--text);
  transition: outline-color 0.2s ease;
}
.basket-name {
  position: absolute;
  top: -3.6vh;
  left: 3%;
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
  left: calc(15% + var(--i) * 14%);
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
  font-size: clamp(0.65rem, 1.75vh, 1.2rem);
  font-weight: 800;
  color: var(--text);
}

.is-lit {
  outline: 3px solid var(--lavender);
  outline-offset: 0.5vh;
}

/* ─── Walker ─────────────────────────────────────────────────────────── */
.walker {
  position: absolute;
  top: 25.5vh;
  left: 21%;
  width: 9.5vh;
  height: 9.5vh;
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
  gap: 0.7vh;
  padding: 0.5vh 0.5vh 0.5vh 1.1vh;
  border-radius: 999px;
  background: var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.55vh, 1.05rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
}
.carry-value {
  min-width: 2.4em;
  padding: 0.25vh 0.7vh;
  border-radius: 999px;
  background: var(--sun);
  color: var(--text);
}

/* ─── 4: after the loop ──────────────────────────────────────────────── */
.finish {
  position: absolute;
  top: 23vh;
  left: 84%;
  width: 8vh;
  opacity: 0;
}
.finish-art {
  width: 8vh;
  height: 8vh;
}
.finish-label {
  position: absolute;
  top: 100%;
  left: 50%;
  translate: -50% 0;
  padding: calc(0.3vh + 0.3em) 1vh;
  border-radius: 999px;
  background: var(--mint);
  font-size: clamp(0.55rem, 1.4vh, 0.95rem);
  font-weight: 800;
  color: #FFFFFF;
}

/* The counts sit under the basket on the left, clear of the walk and Momo. */
.times {
  position: absolute;
  top: 23vh;
  left: 5%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1vh;
}
.time {
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 0.6vh 0.7vh 0.6vh 1.2vh;
  border-radius: 1vh;
  background: var(--bg);
  border: 2px solid var(--border);
  opacity: 0;
}
.time code {
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  font-weight: 700;
  color: var(--text);
}
.time b {
  padding: calc(0.3vh + 0.3em) 0.9vh;
  border-radius: 999px;
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  font-weight: 900;
  color: #FFFFFF;
}
.time-loop b {
  background: var(--lavender);
}
.time-after b {
  background: var(--mint);
}

/* ─── 5: the running total ───────────────────────────────────────────── */
.total {
  position: absolute;
  top: 36vh;
  left: 86%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8vh;
  translate: -50% 0;
  opacity: 0;
}
.total-art {
  position: relative;
  width: 9vh;
  height: 9vh;
  border-radius: 1.4vh;
}
.total-box {
  width: 100%;
  height: 100%;
}
.total-stack {
  position: absolute;
  left: 50%;
  top: 64%;
  translate: -50% -50%;
}
.total-value {
  padding: calc(0.4vh + 0.3em) 1vh;
  border-radius: 1vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.7rem, 2.1vh, 1.4rem);
  font-weight: 800;
  color: var(--text);
}
.total-name {
  padding: calc(0.35vh + 0.3em) 1.2vh;
  border-radius: 999px;
  background: var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.55vh, 1.05rem);
  font-weight: 800;
  color: var(--bg);
}

.fly {
  position: absolute;
  top: 20vh;
  left: calc(21% + var(--i) * 14%);
  padding: calc(0.3vh + 0.3em) 0.8vh;
  border-radius: 999px;
  background: var(--sky);
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  font-weight: 800;
  color: #FFFFFF;
  translate: -50% 0;
  opacity: 0;
}

/* ─── Momo ───────────────────────────────────────────────────────────── */
.momo {
  position: absolute;
  left: 4%;
  bottom: 0;
  height: 11vh;
}
.momo-art {
  width: 11vh;
  height: 11vh;
}
.bubble {
  position: absolute;
  left: 12.5vh;
  top: 1vh;
  padding: 1.1vh 1.6vh;
  border-radius: 1.6vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.75rem, 2vh, 1.4rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
  transform-origin: 0% 100%;
  animation: pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
}
.bubble::after {
  content: '';
  position: absolute;
  left: -0.75vh;
  bottom: 1.4vh;
  width: 1.2vh;
  height: 1.2vh;
  background: var(--bg);
  border-left: 2px solid var(--text);
  border-bottom: 2px solid var(--text);
  transform: rotate(45deg);
}

/* ═══ Stages ═══════════════════════════════════════════════════════════ */

/* 1: five prints read five slots, one after another. */
.stage-1 .slot-art {
  animation: ring 0.8s ease both;
  animation-delay: calc(0.45s + var(--i) * 0.5s);
}
.stage-1 .bubble {
  animation-delay: 3s;
}

/* 2, 3, 5: the walk. Each stop rings its fish and updates the counter and the box. */
.stage-2 .walker {
  opacity: 1;
  animation:
    appear 0.3s ease 0.2s both,
    walk5 4s cubic-bezier(0.45, 0, 0.55, 1) var(--d) both;
}
.stage-3 .walker,
.stage-5 .walker {
  opacity: 1;
  animation: rewalk5 4.9s cubic-bezier(0.45, 0, 0.55, 1) 0.1s both;
}
.stage-2 .walker-art,
.stage-3 .walker-art,
.stage-5 .walker-art {
  animation: bob 0.25s ease-in-out 0.2s 18 alternate;
}
.stage-2 .slot-art,
.stage-3 .slot-art,
.stage-5 .slot-art {
  animation: ring 0.75s ease both;
  animation-delay: calc(var(--d) + var(--i) * 0.8s);
}
.stage-2 .stack-item:not(.total-value),
.stage-3 .stack-item:not(.total-value),
.stage-5 .stack-item:not(.total-value) {
  animation:
    swap-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--d) + var(--i) * 0.8s) both,
    vanish 0.1s ease calc(var(--d) + (var(--i) + 1) * 0.8s) forwards;
}
.stage-2 .stack-item:last-child:not(.total-value),
.stage-3 .stack-item:last-child:not(.total-value),
.stage-5 .stack-item:last-child:not(.total-value) {
  animation: swap-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--d) + var(--i) * 0.8s) both;
}

/* 4: Momo stays at the last fish; the flag and the counts arrive. */
.stage-4 .walker {
  left: 77%;
  opacity: 1;
}
.stage-4 .carry-value:last-child {
  opacity: 1;
}
.stage-4 .finish {
  animation: pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s both;
}
.stage-4 .time-loop {
  animation: rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) 1.1s both;
}
.stage-4 .time-after {
  animation: rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) 1.4s both;
}

/* 5: the flag and counts clear, the total box arrives, each fish flies in. */
.stage-5 .finish,
.stage-5 .time {
  animation: vanish 0.3s ease both;
}
.stage-5 .total {
  animation: pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
}
.stage-5 .total-value {
  animation:
    bump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--d) + (var(--j) - 1) * 0.8s + 0.45s) both,
    vanish 0.1s ease calc(var(--d) + var(--j) * 0.8s + 0.45s) forwards;
}
.stage-5 .total-value:first-child {
  animation:
    appear 0.2s ease 0.5s both,
    vanish 0.1s ease calc(var(--d) + 0.45s) forwards;
}
.stage-5 .total-value:last-child {
  animation: bump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--d) + 4 * 0.8s + 0.45s) both;
}
.stage-5 .fly {
  animation: fly 0.45s cubic-bezier(0.55, 0, 0.45, 1) both;
  animation-delay: calc(var(--d) + var(--i) * 0.8s);
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
/* Hidden until it starts, so stacked values never show early. */
@keyframes bump {
  0% { opacity: 0; transform: scale(1.4); }
  30% { opacity: 1; }
  100% { opacity: 1; transform: scale(1); }
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
@keyframes walk5 {
  0%, 10% { left: 21%; }
  20%, 30% { left: 35%; }
  40%, 50% { left: 49%; }
  60%, 70% { left: 63%; }
  80%, 100% { left: 77%; }
}
/* Back to the first fish, then the same five stops, 0.8 s apart from 1 s on. */
@keyframes rewalk5 {
  0% { left: 77%; }
  14%, 26.5% { left: 21%; }
  34.7%, 42.9% { left: 35%; }
  51%, 59.2% { left: 49%; }
  67.3%, 75.5% { left: 63%; }
  83.7%, 100% { left: 77%; }
}
@keyframes fly {
  0% { opacity: 0; }
  15% { opacity: 1; }
  100% { opacity: 0; top: 39vh; left: 86%; }
}

/* ─── A phone held upright ───────────────────────────────────────────── */
@media (orientation: portrait) and (max-width: 760px) {
  /* `.shell` in front, not a bare :deep(), so this beats Shell's own rule of
     the same specificity instead of losing the tie on build order. */
  .shell :deep(.output-label) {
    font-size: clamp(0.75rem, 3vw, 0.85rem);
  }
  :deep(.code-tabbar .ml-auto span) {
    font-size: 0.72rem;
  }

  /* Momo's line was sized for a wide scene: at 12.5vh from the left it now
     runs past the right edge for anything longer than a couple of words. It
     wraps instead, and sits closer to Momo so the balloon still points at her. */
  .bubble {
    left: 9vh;
    max-width: 64vw;
    padding: 0.85vh 1.3vh;
    font-size: clamp(0.75rem, 3.6vw, 1rem);
    white-space: normal;
  }
}
</style>
