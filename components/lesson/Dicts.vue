<script setup lang="ts">
/**
 * Dictionaries: "Tiere mit Eigenschaften". Auto-imported as `<LessonDicts :stage="1" />`.
 *
 * Four slides (PRE-0119 and its three sub-slides):
 *
 *   1. Momo as a list: which position was the age again? Numbers don't say.
 *   2. the idea: the slots get names instead of numbers
 *   3. Python: curly braces, keys and values; look a value up, change it
 *   4. a list of dictionaries, walked with a loop
 *
 * The card keeps its four cells from stage 1 to 3: only the labels under them
 * change, from positions to names to keys. Words come from `dicts.*` in
 * `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3 | 4

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

const stages = computed(() => tm<Stage[]>('dicts.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const keys = computed(() => tm<string[]>('dicts.keys'))
const values = computed(() => tm<string[]>('dicts.values'))
const shelter = computed(() => tm<Array<{ name: string, food: string }>>('dicts.shelter'))

/** The age cell: index 1. */
const AGE = 1
const cardAt = (k: number) => 0.8 + k * 1.6

const outputDelays = computed(() => {
  switch (props.stage) {
    case 1: return [1.1, 1.8]
    case 3: return [1.3, 2.6]
    case 4: return [cardAt(0) + 0.8, cardAt(1) + 0.8]
    default: return undefined
  }
})
</script>

<template>
  <LessonShell
    :eyebrow="t('dicts.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :variant="current.variant ?? 'python'"
    :file="t('dicts.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    dense
    :output-label="t('dicts.output')"
    :no-output="t('dicts.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- ═══ 1–3: one animal ═══ -->
      <div v-if="stage <= 4" class="part single" :class="{ 'is-leaving': stage === 4 }">
        <ArtSprite name="cat" color="coral" accent="rose" :size="96" class="momo" />
        <div class="card">
          <span class="brace brace-open">{{ stage === 1 ? '[' : '{' }}</span>
          <span class="brace brace-close">{{ stage === 1 ? ']' : '}' }}</span>
          <div v-for="(value, k) in values" :key="k" class="cell" :class="{ 'is-age': k === AGE }" :style="{ '--k': k }">
            <span class="value">
              <code class="value-face value-now">{{ value }}</code>
              <code v-if="k === AGE" class="value-face value-new">4</code>
            </span>
            <span class="label">
              <code class="label-face label-index">{{ k }}</code>
              <code class="label-face label-key">{{ stage === 2 ? keys[k] : `"${keys[k]}"` }}</code>
            </span>
            <span v-if="k === 1 || k === 3" class="question"><span class="text-trim">?</span></span>
          </div>
        </div>
      </div>

      <!-- ═══ 4: a list of dictionaries ═══ -->
      <div v-if="stage === 4" class="part shelter">
        <div
          v-for="(animal, k) in shelter"
          :key="animal.name"
          class="mini"
          :style="{ '--k': k, '--t': `${cardAt(k)}s` }"
        >
          <ArtSprite :name="k === 0 ? 'cat' : 'dog'" :color="k === 0 ? 'coral' : 'sun'" :accent="k === 0 ? 'rose' : 'text'" :size="96" class="mini-art" />
          <code class="mini-dict">
            {<span class="mini-pair"><b>"{{ keys[0] }}"</b>: "{{ animal.name }}"</span>,
            <span class="mini-pair"><b>"{{ keys[2] }}"</b>: "{{ animal.food }}"</span>}
          </code>
        </div>
        <code class="loop-label">for tier in tiere</code>
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
  font-family: 'JetBrains Mono', monospace;
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
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}

.is-leaving {
  animation: vanish 0.3s ease both;
}

/* ─── The card ───────────────────────────────────────────────────────── */
.momo {
  position: absolute;
  top: 6vh;
  left: 50%;
  width: 10vh;
  height: 10vh;
  translate: -50% 0;
}
.card {
  position: absolute;
  top: 18vh;
  left: 9%;
  right: 9%;
  height: 14vh;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2%;
  padding: 1.6vh 2%;
  border-radius: 2vh;
  background: color-mix(in srgb, var(--sun) 40%, var(--bg));
  border: 3px solid var(--text);
}
.brace {
  position: absolute;
  top: 50%;
  translate: 0 -54%;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(2rem, 10vh, 6.4rem);
  font-weight: 300;
  line-height: 1;
  color: var(--lavender);
}
.brace-open {
  left: -4.4vh;
}
.brace-close {
  right: -4.4vh;
}

.cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.value {
  display: inline-grid;
}
.value-face {
  grid-area: 1 / 1;
  justify-self: center;
  padding: 0.9vh 1vh;
  border-radius: 1vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.6rem, 1.9vh, 1.25rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
}
.value-new {
  opacity: 0;
}
.label {
  position: absolute;
  top: calc(100% + 2.2vh);
  display: inline-grid;
}
.label-face {
  grid-area: 1 / 1;
  justify-self: center;
  padding: calc(0.3vh + 0.3em) 0.9vh;
  border-radius: 999px;
  font-size: clamp(0.55rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
}
.label-index {
  min-width: 3.4vh;
  text-align: center;
  background: var(--lavender);
  color: #FFFFFF;
}
.label-key {
  background: var(--text);
  color: var(--bg);
  opacity: 0;
}
.question {
  position: absolute;
  top: -2.6vh;
  display: grid;
  place-items: center;
  width: 3.8vh;
  height: 3.8vh;
  border-radius: 999px;
  background: var(--coral);
  border: 2px solid var(--text);
  font-size: clamp(0.7rem, 2vh, 1.3rem);
  font-weight: 900;
  color: #FFFFFF;
  opacity: 0;
}

/* ═══ Stages ═══════════════════════════════════════════════════════════ */

/* 1: momo[1] and momo[3] are asked for — and the numbers say nothing. */
.stage-1 .cell:nth-child(4) .value-face,
.stage-1 .cell:nth-child(6) .value-face {
  animation: ring 0.8s ease both;
}
.stage-1 .cell:nth-child(4) .value-face { animation-delay: 0.9s; }
.stage-1 .cell:nth-child(6) .value-face { animation-delay: 1.6s; }
.stage-1 .question {
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) calc(2.2s + var(--k) * 0.1s) both;
}

/* 2: the positions flip over into names. */
.stage-2 .label-index {
  animation: flip-out 0.25s ease-in calc(0.5s + var(--k) * 0.15s) both;
}
.stage-2 .label-key {
  animation: flip-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) calc(0.75s + var(--k) * 0.15s) both;
}
.stage-2 .brace {
  opacity: 0;
}

/* 3: the braces write the dictionary; alter is read, then changed to 4. */
.stage-3 .label-index {
  opacity: 0;
}
.stage-3 .label-key {
  opacity: 1;
  animation: quote 0.3s ease 0.3s both;
}
.stage-3 .brace-open {
  animation: brace-left 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
}
.stage-3 .brace-close {
  animation: brace-right 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
}
.stage-3 .is-age .label-key {
  animation: ring 0.8s ease 1s both;
}
.stage-3 .is-age .value-now {
  animation: lift-out 0.35s ease-in 2s both;
}
.stage-3 .is-age .value-new {
  animation: drop-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) 2.3s both;
}

/* 4: the card clears; two small dictionaries in a list, read one after the other. */
.stage-4 .label-index,
.stage-4 .value-new {
  opacity: 0;
}
.stage-4 .label-key {
  opacity: 1;
}
.stage-4 .is-age .value-now {
  opacity: 0;
}
.stage-4 .is-age .value-new {
  opacity: 1;
}

.shelter .mini {
  position: absolute;
  top: calc(8vh + var(--k) * 16vh);
  left: 8%;
  right: 8%;
  display: flex;
  align-items: center;
  gap: 2vh;
  padding: 1.4vh 1.8vh;
  border-radius: 1.8vh;
  background: var(--bg);
  border: 3px solid var(--text);
  opacity: 0;
  animation:
    rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) calc(0.35s + var(--k) * 0.15s) both,
    read 0.9s ease var(--t) both;
}
.mini-art {
  flex: none;
  width: 8vh;
  height: 8vh;
}
.mini-dict {
  font-size: clamp(0.55rem, 1.6vh, 1.05rem);
  font-weight: 700;
  line-height: 1.6;
  color: var(--text);
}
.mini-pair {
  white-space: nowrap;
}
.mini-dict b {
  color: var(--coral);
}
.loop-label {
  position: absolute;
  left: 50%;
  bottom: 3vh;
  padding: calc(0.35vh + 0.3em) 1.2vh;
  border-radius: 999px;
  background: var(--lavender);
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  font-weight: 800;
  white-space: nowrap;
  color: #FFFFFF;
  translate: -50% 0;
  opacity: 0;
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.7s both;
}

/* ─── Keyframes ──────────────────────────────────────────────────────── */
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
@keyframes flip-out {
  from { opacity: 1; transform: none; }
  to { opacity: 0; transform: rotateX(80deg); }
}
@keyframes flip-in {
  from { opacity: 0; transform: rotateX(-80deg); }
  to { opacity: 1; transform: none; }
}
@keyframes quote {
  0% { transform: none; }
  50% { transform: scale(1.12); }
  100% { transform: none; }
}
@keyframes brace-left {
  from { opacity: 0; transform: translateX(-3vh); }
  to { opacity: 1; transform: none; }
}
@keyframes brace-right {
  from { opacity: 0; transform: translateX(3vh); }
  to { opacity: 1; transform: none; }
}
@keyframes ring {
  0% { box-shadow: 0 0 0 0 transparent; }
  35% { box-shadow: 0 0 0 0.6vh color-mix(in srgb, var(--lavender) 55%, transparent); }
  100% { box-shadow: 0 0 0 1.2vh transparent; }
}
@keyframes lift-out {
  from { opacity: 1; transform: none; }
  to { opacity: 0; transform: translateY(-3vh); }
}
@keyframes drop-in {
  from { opacity: 0; transform: translateY(-3vh); }
  to { opacity: 1; transform: none; }
}
@keyframes read {
  0% { border-color: var(--text); }
  30% { border-color: var(--lavender); box-shadow: 0 0 0 0.6vh color-mix(in srgb, var(--lavender) 35%, transparent); }
  100% { border-color: var(--text); box-shadow: none; }
}
</style>
