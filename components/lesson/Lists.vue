<script setup lang="ts">
/**
 * Lists lesson: "Momos Fische". Auto-imported as `<LessonLists :stage="1" />`.
 *
 * One scene over six slides (PRE-0059 and its five sub-slides):
 *
 *   1. five fish, five variables — and what about 100?
 *   2. the boxes gather into one basket with five slots
 *   3. Python: square brackets around the basket, commas between the slots
 *   4. every slot has a number, counting from 0
 *   5. one slot gets a new value; len() counts the slots
 *   6. append() stretches the basket and adds a slot at the end
 *
 * Each stage opens on the previous stage's last frame and animates only what
 * changed. Slots are placed with `--i` so one keyframe moves all of them.
 * Hovering the list's name in the code rings the basket.
 *
 * Every word on screen comes from `lists.*` in `locales/`.
 */
import { computed } from 'vue'
import { useCodeLink } from '~/composables/useCodeLink'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3 | 4 | 5 | 6

interface Stage {
  headline: string
  note: string
  bubble: string
  code: string
  variant?: 'python' | 'pseudo'
  focus: number[]
  output: string[]
  outputFrom: number
}

const props = defineProps<{ stage: StageNumber }>()
const { t, tm } = useI18n()
const link = useCodeLink()

const stages = computed(() => tm<Stage[]>('lists.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const listName = computed(() => t('lists.names.list'))
const itemName = computed(() => t('lists.names.item'))

const FISH_COLORS = ['sky', 'coral', 'mint', 'lavender', 'sun', 'rose']
const START = [12, 30, 8, 21, 15]
const CHANGED = { index: 2, value: 25 }
const APPENDED = 18

/** Slots on screen: five, and a sixth once `append` has run. */
const slots = computed(() => {
  const count = props.stage === 6 ? 6 : 5
  return Array.from({ length: count }, (_, i) => ({
    i,
    value: i === 5 ? APPENDED : START[i]!,
    changed: i === CHANGED.index,
  }))
})

const basketLit = computed(() => link.isActive(`word:${listName.value}`))
</script>

<template>
  <LessonShell
    :eyebrow="t('lists.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :variant="current.variant ?? 'python'"
    :file="t('lists.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-label="t('lists.output')"
    :no-output="t('lists.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <!-- The basket: a list -->
      <div class="basket" :class="{ 'is-lit': basketLit }">
        <span class="basket-name"><span class="text-trim">{{ listName }}</span></span>
        <span class="bracket bracket-open">[</span>
        <span class="bracket bracket-close">]</span>
        <span class="basket-len">
          <span :key="slots.length" class="len-value"><span class="text-trim">len = {{ slots.length }}</span></span>
        </span>
      </div>

      <!-- One slot per fish -->
      <div
        v-for="slot in slots"
        :key="slot.i"
        class="slot"
        :class="[`slot-${slot.i}`, { 'is-changed': slot.changed, 'is-last': slot.i === slots.length - 1 }]"
        :style="{ '--i': slot.i }"
      >
        <div class="slot-art">
          <ArtSprite name="box" color="coral" accent="text-muted" :size="96" class="slot-box" />
          <ArtSprite name="fish" :color="FISH_COLORS[slot.i]" accent="text" :size="96" class="slot-fish" />
          <template v-if="slot.changed">
            <span class="slot-value value-old"><span class="text-trim">{{ START[slot.i] }}</span></span>
            <span class="slot-value value-new"><span class="text-trim">{{ CHANGED.value }}</span></span>
          </template>
          <span v-else class="slot-value"><span class="text-trim">{{ slot.value }}</span></span>
        </div>
        <span class="slot-comma">,</span>
        <span class="slot-name"><span class="text-trim">{{ itemName }}_{{ slot.i + 1 }}</span></span>
        <span class="slot-index"><span class="text-trim">{{ slot.i }}</span></span>
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

/* ─── Basket ─────────────────────────────────────────────────────────── */
/* Slots sit at 15% + i × 14%, 12% wide; the basket wraps them with 1.5% to spare. */
.basket {
  position: absolute;
  top: 9vh;
  left: 13.5%;
  width: 71%;
  height: 15vh;
  border-radius: 2vh;
  background: color-mix(in srgb, var(--sun) 45%, var(--bg));
  border: 3px solid var(--text);
  opacity: 0;
  transition: outline-color 0.2s ease;
}
.basket.is-lit {
  outline: 3px solid var(--lavender);
  outline-offset: 0.6vh;
}

.basket-name {
  position: absolute;
  top: -4.6vh;
  left: 50%;
  translate: -50% 0;
  padding: calc(0.4vh + 0.3em) 1.4vh;
  border-radius: 999px;
  background: var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.75rem, 1.9vh, 1.25rem);
  font-weight: 800;
  color: var(--bg);
}

.bracket {
  position: absolute;
  top: 50%;
  font-family: var(--font-code);
  font-size: clamp(2.2rem, 11vh, 7rem);
  font-weight: 300;
  line-height: 1;
  color: var(--lavender);
  translate: 0 -54%;
  opacity: 0;
}
.bracket-open {
  left: -4.6vh;
}
.bracket-close {
  right: -4.6vh;
}

.basket-len {
  position: absolute;
  top: -4.6vh;
  right: 0;
  opacity: 0;
}
.len-value {
  display: block;
  padding: calc(0.4vh + 0.3em) 1.2vh;
  border-radius: 999px;
  background: var(--mint);
  font-family: var(--font-code);
  font-size: clamp(0.65rem, 1.6vh, 1.1rem);
  font-weight: 800;
  color: #FFFFFF;
  white-space: nowrap;
}

/* ─── Slots ──────────────────────────────────────────────────────────── */
.slot {
  position: absolute;
  top: 10.4vh;
  left: calc(15% + var(--i) * 14%);
  width: 12%;
}

.slot-art {
  position: relative;
  height: 9.5vh;
  border-radius: 1.2vh;
}

.slot-box,
.slot-fish {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.slot-box {
  opacity: 0;
}
/* Explicit size: the sprite's width and height attributes would win over `inset`. */
.slot-fish {
  top: 2%;
  left: 10%;
  width: 80%;
  height: 66%;
}

.slot-value {
  position: absolute;
  left: 50%;
  top: 72%;
  transform: translate(-50%, -50%);
  padding: calc(0.4vh + 0.3em) 0.9vh;
  border-radius: 0.9vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.7rem, 1.9vh, 1.3rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
}
.value-new {
  opacity: 0;
}

.slot-comma {
  position: absolute;
  top: 6.4vh;
  right: -1.6%;
  translate: 50% 0;
  font-family: var(--font-code);
  font-size: clamp(1rem, 3.4vh, 2.2rem);
  font-weight: 800;
  color: var(--lavender);
  opacity: 0;
}

.slot-name,
.slot-index {
  position: absolute;
  top: calc(9.5vh + 5vh);
  left: 50%;
  translate: -50% 0;
  padding: calc(0.35vh + 0.3em) 0.9vh;
  border-radius: 999px;
  font-family: var(--font-code);
  font-weight: 800;
  white-space: nowrap;
}
.slot-name {
  top: calc(9.5vh + 1.4vh);
  background: var(--text);
  font-size: clamp(0.55rem, 1.35vh, 0.95rem);
  color: var(--bg);
  opacity: 0;
}
.slot-index {
  min-width: 3.4vh;
  text-align: center;
  background: var(--lavender);
  font-size: clamp(0.65rem, 1.7vh, 1.15rem);
  color: #FFFFFF;
  opacity: 0;
}

/* ─── Momo ───────────────────────────────────────────────────────────── */
.momo {
  position: absolute;
  left: 4%;
  bottom: 0;
  width: 100%;
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
  animation: bubble-pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both;
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

/* 1: five separate boxes, spread out, each with its variable name. */
.stage-1 .slot {
  left: calc(3% + var(--i) * 19.5%);
  width: 15%;
}
.stage-1 .slot-box {
  opacity: 1;
}
.stage-1 .slot-fish {
  opacity: 0;
}
.stage-1 .slot-value {
  top: 64%;
}
.stage-1 .slot-name {
  opacity: 1;
}
.stage-1 .slot {
  animation: appear 0.35s ease both;
  animation-delay: calc(0.25s + var(--i) * 0.08s);
}

/* 2: the boxes gather, turn into fish, and the basket closes around them. */
.stage-2 .slot {
  animation: gather 0.7s cubic-bezier(0.65, 0, 0.35, 1) both;
  animation-delay: calc(0.2s + var(--i) * 0.05s);
}
.stage-2 .slot-box {
  animation: vanish 0.3s ease 0.55s both;
}
.stage-2 .slot-fish {
  animation: swim-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(0.75s + var(--i) * 0.07s);
}
.stage-2 .slot-value {
  animation: value-settle 0.7s cubic-bezier(0.65, 0, 0.35, 1) 0.2s both;
}
.stage-2 .slot-name {
  animation: vanish 0.25s ease 0.2s both;
}
.stage-2 .basket {
  animation: basket-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.95s both;
}

/* 3–6 open on the basket. */
.stage-3 .basket,
.stage-4 .basket,
.stage-5 .basket,
.stage-6 .basket {
  opacity: 1;
}

/* 3: brackets and commas write the list around the basket. */
.stage-3 .bracket-open {
  animation: bracket-in-left 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
}
.stage-3 .bracket-close {
  animation: bracket-in-right 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
}
.stage-3 .slot:not(.is-last) .slot-comma {
  animation: pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(0.7s + var(--i) * 0.12s);
}
.stage-4 .bracket,
.stage-5 .bracket,
.stage-6 .bracket,
.stage-4 .slot:not(.is-last) .slot-comma,
.stage-5 .slot:not(.is-last) .slot-comma,
.stage-6 .slot:not(.is-last) .slot-comma {
  opacity: 1;
}

/* 4: the slot numbers count in from 0; fische[0] and fische[3] ring. */
.stage-4 .slot-index {
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(0.3s + var(--i) * 0.1s);
}
.stage-4 .slot-0 .slot-art {
  animation: ring 0.9s ease 1.1s both;
}
.stage-4 .slot-3 .slot-art {
  animation: ring 0.9s ease 1.5s both;
}
.stage-5 .slot-index,
.stage-6 .slot-index {
  opacity: 1;
}

/* 5: slot 2 swaps its fish; len counts the slots. */
.stage-5 .is-changed .value-old {
  animation: lift-out 0.4s ease-in 0.4s both;
}
.stage-5 .is-changed .value-new {
  animation: drop 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.85s both;
}
.stage-5 .is-changed .slot-fish {
  animation: grow 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.85s both;
}
.stage-5 .basket-len {
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 1.5s both;
}
.stage-6 .is-changed .value-old {
  opacity: 0;
}
.stage-6 .is-changed .value-new {
  opacity: 1;
}
.stage-6 .is-changed .slot-fish {
  transform: scale(1.15);
}
.stage-6 .basket-len {
  opacity: 1;
}

/* 6: the basket stretches, the slots make room, a new fish drops in at the end. */
.stage-6 .basket {
  left: 6.5%;
  width: 85%;
  animation: stretch 0.6s cubic-bezier(0.65, 0, 0.35, 1) 0.2s both;
}
.stage-6 .slot {
  left: calc(8% + var(--i) * 14%);
  animation: make-room 0.6s cubic-bezier(0.65, 0, 0.35, 1) 0.2s both;
}
.stage-6 .slot-5 {
  animation: drop-slot 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both;
}
.stage-6 .slot-4 .slot-comma {
  animation: pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) 1.3s both;
}
.stage-6 .slot-5 .slot-index {
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 1.4s both;
}
.stage-6 .len-value {
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 1.6s both;
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
@keyframes gather {
  from { left: calc(3% + var(--i) * 19.5%); width: 15%; }
  to { left: calc(15% + var(--i) * 14%); width: 12%; }
}
@keyframes value-settle {
  from { top: 64%; }
  to { top: 72%; }
}
@keyframes swim-in {
  from { opacity: 0; transform: translateY(-2vh) scale(0.6) rotate(-12deg); }
  to { opacity: 1; transform: none; }
}
@keyframes basket-in {
  from { opacity: 0; transform: scaleY(0.6); }
  to { opacity: 1; transform: none; }
}
@keyframes bracket-in-left {
  from { opacity: 0; transform: translateX(-3vh); }
  to { opacity: 1; transform: none; }
}
@keyframes bracket-in-right {
  from { opacity: 0; transform: translateX(3vh); }
  to { opacity: 1; transform: none; }
}
@keyframes pop {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes bubble-pop {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes ring {
  0% { outline: 3px solid transparent; outline-offset: 0; }
  35% { outline: 3px solid var(--lavender); outline-offset: 0.6vh; }
  100% { outline: 3px solid transparent; outline-offset: 1.6vh; }
}
@keyframes drop {
  from { opacity: 0; transform: translate(-50%, -190%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
}
@keyframes lift-out {
  from { opacity: 1; transform: translate(-50%, -50%); }
  to { opacity: 0; transform: translate(-50%, -190%); }
}
@keyframes grow {
  from { transform: none; }
  to { transform: scale(1.15); }
}
@keyframes stretch {
  from { left: 13.5%; width: 71%; }
  to { left: 6.5%; width: 85%; }
}
@keyframes make-room {
  from { left: calc(15% + var(--i) * 14%); }
  to { left: calc(8% + var(--i) * 14%); }
}
@keyframes drop-slot {
  from { opacity: 0; transform: translateY(-9vh); }
  to { opacity: 1; transform: none; }
}
</style>
