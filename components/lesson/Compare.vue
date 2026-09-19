<script setup lang="ts">
/**
 * Comparing lesson: "Fragen, die Python mit Ja oder Nein beantwortet".
 * Auto-imported as `<LessonCompare :stage="1" />`.
 *
 * Sits between running your first file and the lists (PRE-0189 and its six
 * sub-slides). Momo's door already used `if`, but with a `True` we wrote down
 * ourselves; this is where a `True` is produced rather than assumed, and where
 * the rest of the control flow arrives:
 *
 *   1. a comparison is a question, and Python answers it
 *   2. the six of them, and `=` against `==`
 *   3. the question goes straight after the `if`
 *   4. `else` and `elif`: the first way that fits wins
 *   5. `not` turns the answer round
 *   6. `and` and `or`
 *   7. all of it in one small program
 *
 * Every stage keeps the same scale at the top — two values, the operator
 * between them, and the answer it tips to — so the thing being taught stays in
 * one place while the panel underneath changes. Words come from `compare.*`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7

interface Question {
  left: string
  op: string
  right: string
  answer: boolean
}

interface Stage {
  headline: string
  note: string
  code: string
  focus: number[]
  output: string[]
  outputFrom: number
  question: Question
}

interface Op {
  sign: string
  says: string
}

interface Path {
  keyword: string
  ask: string
  then: string
}

interface Combo {
  left: string
  right: string
  and: string
  or: string
}

const props = defineProps<{ stage: StageNumber }>()
const { t, tm } = useI18n()

const stages = computed(() => tm<Stage[]>('compare.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const ops = computed(() => tm<Op[]>('compare.ops'))
const paths = computed(() => tm<Path[]>('compare.paths'))
const combos = computed(() => tm<Combo[]>('compare.combos'))
const warn = computed(() => tm<{ one: string, two: string }>('compare.warn'))
const flip = computed(() => tm<{ from: string, to: string }>('compare.flip'))
const answers = computed(() => tm<{ yes: string, no: string }>('compare.answers'))

/** On the `elif` stage, the path that actually runs. */
const takenPath = 1

/** Output lands after the scale has tipped, so the two agree. */
const outputDelays = computed(() => current.value.output.map((_, i) => 1.4 + i * 0.4))
</script>

<template>
  <LessonShell
    :eyebrow="t('compare.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :file="t('compare.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    :dense="stage >= 4"
    :output-label="t('compare.output')"
    :no-output="t('compare.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <!-- The question, and what it comes to. Every stage has one. -->
      <div class="ask" :class="current.question.answer ? 'is-yes' : 'is-no'">
        <span class="ask-side">{{ current.question.left }}</span>
        <span v-if="current.question.op" class="ask-op">{{ current.question.op }}</span>
        <span class="ask-side">{{ current.question.right }}</span>
        <span class="ask-arrow" aria-hidden="true">→</span>
        <span :key="`${stage}-${current.question.answer}`" class="ask-answer">
          {{ current.question.answer ? answers.yes : answers.no }}
        </span>
      </div>

      <!-- 2: the six of them, and the one that bites -->
      <div v-if="stage === 2 || stage === 7" class="ops" :class="{ 'is-quiet': stage === 7 }">
        <span class="panel-label">{{ t('compare.opsLabel') }}</span>
        <div class="ops-grid">
          <div v-for="(op, index) in ops" :key="op.sign" class="op" :style="{ '--t': `${0.5 + index * 0.07}s` }">
            <code class="op-sign">{{ op.sign }}</code>
            <span class="op-says">{{ op.says }}</span>
          </div>
        </div>
        <div v-if="stage === 2" class="warn">
          <span class="warn-line"><code>=</code>{{ warn.one.replace('=', '').trim() }}</span>
          <span class="warn-line is-loud"><code>==</code>{{ warn.two.replace('==', '').trim() }}</span>
        </div>
      </div>

      <!-- 3: the question feeding one branch -->
      <div v-else-if="stage === 3" class="branch">
        <div class="branch-row is-taken">
          <code class="branch-key">if</code>
          <span class="branch-ask">{{ current.question.left }} {{ current.question.op }} {{ current.question.right }}</span>
          <span class="branch-arrow" aria-hidden="true">→</span>
          <span class="branch-then">Willkommen!</span>
        </div>
      </div>

      <!-- 4: three ways, the first that fits -->
      <div v-else-if="stage === 4" class="branch">
        <span class="panel-label">{{ t('compare.pathsLabel') }}</span>
        <div
          v-for="(path, index) in paths"
          :key="path.keyword"
          class="branch-row"
          :class="{
            'is-taken': index === takenPath,
            'is-missed': index < takenPath,
            'is-skipped': index > takenPath,
          }"
          :style="{ '--t': `${0.5 + index * 0.25}s` }"
        >
          <code class="branch-key">{{ path.keyword }}</code>
          <span class="branch-ask">{{ path.ask || '—' }}</span>
          <span class="branch-arrow" aria-hidden="true">→</span>
          <span class="branch-then">{{ path.then }}</span>
        </div>
      </div>

      <!-- 5: the answer turning round -->
      <div v-else-if="stage === 5" class="flip">
        <span class="flip-face">{{ flip.from }}</span>
        <span class="flip-op"><code>not</code></span>
        <span class="flip-face is-after">{{ flip.to }}</span>
      </div>

      <!-- 6: the four cases, which beat any explanation -->
      <div v-else-if="stage === 6" class="combos">
        <span class="panel-label">{{ t('compare.combosLabel') }}</span>
        <div class="combo-grid">
          <span class="combo-head"></span>
          <span class="combo-head"></span>
          <span class="combo-head">and</span>
          <span class="combo-head">or</span>
          <template v-for="(combo, index) in combos" :key="index">
            <span class="combo-cell is-value" :style="{ '--t': `${0.5 + index * 0.1}s` }">{{ combo.left }}</span>
            <span class="combo-cell is-value" :style="{ '--t': `${0.5 + index * 0.1}s` }">{{ combo.right }}</span>
            <span class="combo-cell" :class="combo.and === 'True' ? 'is-yes' : 'is-no'" :style="{ '--t': `${0.55 + index * 0.1}s` }">{{ combo.and }}</span>
            <span class="combo-cell" :class="combo.or === 'True' ? 'is-yes' : 'is-no'" :style="{ '--t': `${0.6 + index * 0.1}s` }">{{ combo.or }}</span>
          </template>
        </div>
      </div>
    </div>
  </LessonShell>
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vh;
  padding: 2.5vh 4%;
}

/* ─── The question ───────────────────────────────────────────────────── */
.ask {
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 1.2vh 1.8vh;
  border-radius: 1.2vh;
  background: var(--bg);
  border: 2px solid var(--border);
  font-family: var(--font-code);
  font-size: clamp(0.72rem, 2.1vh, 1.35rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
  transition: border-color 0.4s ease;
}
.ask.is-yes { border-color: var(--mint); }
.ask.is-no { border-color: var(--coral); }

.ask-op {
  padding: 0 0.6vh;
  color: var(--sky);
}
.ask-arrow {
  color: var(--text-muted);
  font-weight: 400;
}
.ask-answer {
  padding: 0.3vh 1vh;
  border-radius: 0.7vh;
  animation: pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both;
}
.is-yes .ask-answer {
  background: color-mix(in srgb, var(--mint) 30%, var(--bg));
  color: var(--text);
}
.is-no .ask-answer {
  background: color-mix(in srgb, var(--coral) 28%, var(--bg));
  color: var(--text);
}

.panel-label {
  display: block;
  margin-bottom: 0.8vh;
  font-size: clamp(0.42rem, 1.1vh, 0.7rem);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* ─── 2 and 7: the operators ─────────────────────────────────────────── */
.ops {
  width: 100%;
}
.ops.is-quiet {
  opacity: 0.5;
}
.ops-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8vh;
}
.op {
  display: flex;
  align-items: baseline;
  gap: 0.8vh;
  padding: 0.8vh 1vh;
  border-radius: 0.9vh;
  background: var(--bg);
  border: 2px solid var(--border);
  animation: rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.op-sign {
  flex: none;
  min-width: 2.5ch;
  font-family: var(--font-code);
  font-size: clamp(0.7rem, 2vh, 1.2rem);
  font-weight: 800;
  color: var(--sky);
}
.op-says {
  font-size: clamp(0.48rem, 1.3vh, 0.85rem);
  color: var(--text-dim);
}

.warn {
  display: flex;
  flex-direction: column;
  gap: 0.3vh;
  margin-top: 1.2vh;
  padding: 1vh 1.2vh;
  border-radius: 0.9vh;
  background: color-mix(in srgb, var(--sun) 25%, var(--bg));
  border: 2px solid var(--sun);
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) 1s both;
}
.warn-line {
  display: flex;
  align-items: baseline;
  gap: 0.8vh;
  font-size: clamp(0.5rem, 1.35vh, 0.88rem);
  color: var(--text-dim);
}
.warn-line code {
  min-width: 3ch;
  font-family: var(--font-code);
  font-weight: 800;
  color: var(--text);
}
.warn-line.is-loud {
  font-weight: 700;
  color: var(--text);
}

/* ─── 3 and 4: the ways ──────────────────────────────────────────────── */
.branch {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8vh;
}
.branch-row {
  display: grid;
  grid-template-columns: 4.5ch 1fr auto auto;
  align-items: center;
  gap: 1vh;
  padding: 0.9vh 1.2vh;
  border-radius: 0.9vh;
  background: var(--bg);
  border: 2px solid var(--border);
  font-family: var(--font-code);
  font-size: clamp(0.52rem, 1.45vh, 0.95rem);
  color: var(--text-dim);
  animation: rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) var(--t, 0.5s) both;
}
.branch-key {
  font-weight: 800;
  color: var(--lavender);
}
.branch-ask {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.branch-arrow {
  color: var(--text-muted);
}
.branch-then {
  font-weight: 700;
  color: var(--text);
}
/* The way Python actually takes. */
.branch-row.is-taken {
  background: color-mix(in srgb, var(--mint) 14%, var(--bg));
  border-color: var(--mint);
  color: var(--text);
}
/* Asked, answered no. */
.branch-row.is-missed {
  border-style: dashed;
  border-color: var(--coral);
  opacity: 0.75;
}
/* Never even asked. */
.branch-row.is-skipped {
  opacity: 0.4;
}

/* ─── 5: turning it round ────────────────────────────────────────────── */
.flip {
  display: flex;
  align-items: center;
  gap: 1.6vh;
  font-family: var(--font-code);
  font-size: clamp(0.8rem, 2.4vh, 1.5rem);
  font-weight: 800;
}
.flip-face {
  padding: 0.7vh 1.4vh;
  border-radius: 0.9vh;
  background: color-mix(in srgb, var(--mint) 25%, var(--bg));
  border: 2px solid var(--mint);
  color: var(--text);
  animation: rise 0.4s ease 0.4s both;
}
.flip-face.is-after {
  background: color-mix(in srgb, var(--coral) 25%, var(--bg));
  border-color: var(--coral);
  animation: pop 0.45s cubic-bezier(0.22, 1, 0.36, 1) 1.1s both;
}
.flip-op code {
  padding: 0.4vh 1vh;
  border-radius: 999px;
  background: var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.7vh, 1.05rem);
  color: var(--bg);
}

/* ─── 6: the four cases ──────────────────────────────────────────────── */
.combos {
  width: 100%;
  max-width: 34rem;
}
.combo-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5vh;
}
.combo-head {
  padding-bottom: 0.3vh;
  text-align: center;
  font-family: var(--font-code);
  font-size: clamp(0.48rem, 1.3vh, 0.85rem);
  font-weight: 800;
  color: var(--text-muted);
}
.combo-cell {
  padding: 0.6vh;
  border-radius: 0.6vh;
  text-align: center;
  font-family: var(--font-code);
  font-size: clamp(0.48rem, 1.35vh, 0.88rem);
  font-weight: 700;
  animation: rise 0.35s ease var(--t) both;
}
.combo-cell.is-value {
  background: var(--bg-off);
  color: var(--text-dim);
}
.combo-cell.is-yes {
  background: color-mix(in srgb, var(--mint) 25%, var(--bg));
  color: var(--text);
}
.combo-cell.is-no {
  background: color-mix(in srgb, var(--coral) 20%, var(--bg));
  color: var(--text);
}

@keyframes rise {
  from { opacity: 0; translate: 0 1vh; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes pop {
  from { opacity: 0; scale: 0.85; }
  to { opacity: 1; scale: 1; }
}
</style>
