<script setup lang="ts">
/**
 * "Alles zusammen". Auto-imported as `<LessonTogether :stage="1" />`.
 *
 * Four slides (PRE-0241 and its three sub-slides) where functions, `for` and
 * `if`/`else` finally work in one program, on two small real cases:
 *
 *   1. a rule as a function: `if`/`else` decides passed or failed
 *   2. a loop hands every result of a list to that function
 *   3. an `if` inside the loop counts the passes: 2 of 3
 *   4. a second case, a password check: `if` for the length, then a loop with
 *      an `if` inside that returns as soon as it finds a digit
 *
 * Stages 2 and 3 are one scene: the list and its results stay where stage 2
 * left them, and stage 3 runs the loop over them again with a counter. Beats
 * are computed here and handed to CSS as `--t`. Words come from
 * `functions.together.*` in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3 | 4

interface Stage {
  headline: string
  note: string
  tally: string
  file: string
  code: string
  focus: number[]
  output: string[]
}

const props = defineProps<{ stage: StageNumber }>()
const { t, tm } = useI18n()

const stages = computed(() => tm<Stage[]>('functions.together.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const w = computed(() => tm<Record<
  'fn' | 'pass' | 'fail' | 'list' | 'count' | 'of' | 'check' | 'chars' | 'tooShort' | 'noDigit' | 'found',
  string
>>('functions.together.words'))
const passwords = computed(() => tm<string[]>('functions.together.passwords'))

const LIMIT = 50
const CALLS = [72, 45]
const RESULTS = [72, 45, 90]
const passes = (points: number) => points >= LIMIT

/* 1: one call per row */
const callAt = (k: number) => 0.7 + k * 2.2
/* 2: the loop, one item at a time */
const loopAt = (k: number) => 0.8 + k * 1.2
/* 3: the loop again, with the counter */
const countAt = (k: number) => 0.9 + k * 1.0
/** The counter's value after each item, and when it changes. */
const counterSteps = computed(() => {
  const steps: Array<{ value: number, from: number, until: number }> = []
  let value = 0
  let from = 0
  RESULTS.forEach((points, k) => {
    if (!passes(points)) return
    steps.push({ value, from, until: countAt(k) + 0.35 })
    value++
    from = countAt(k) + 0.35
  })
  steps.push({ value, from, until: 999 })
  return steps
})
const COUNT_DONE = countAt(RESULTS.length - 1) + 1.0

/* 4: one password per row; each character takes a beat */
const PW_ROW = [0.6, 2.2, 5.6]
const CHAR = 0.2
const firstDigit = (word: string) => [...word].findIndex(ch => /\d/.test(ch))
const pwEnd = (row: number) => {
  const word = passwords.value[row] ?? ''
  if (word.length < 8) return PW_ROW[row]! + 0.6
  const hit = firstDigit(word)
  return PW_ROW[row]! + 0.6 + (hit === -1 ? word.length : hit + 1) * CHAR
}

const outputDelays = computed(() => {
  switch (props.stage) {
    case 1: return CALLS.map((_, k) => callAt(k) + 1.6)
    case 2: return RESULTS.map((_, k) => loopAt(k) + 0.5)
    case 3: return [COUNT_DONE]
    case 4: return passwords.value.map((_, row) => pwEnd(row) + 0.3)
    default: return undefined
  }
})
</script>

<template>
  <LessonShell
    :eyebrow="t('functions.together.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :file="current.file"
    :focus="current.focus"
    :output="current.output"
    :output-from="0"
    :output-delays="outputDelays"
    dense
    :output-label="t('functions.together.output')"
    :no-output="t('functions.together.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- ═══ 1: the rule, called twice ═══ -->
      <div v-if="stage === 1" class="calls">
        <div
          v-for="(points, k) in CALLS"
          :key="k"
          class="call"
          :class="passes(points) ? 'is-pass' : 'is-fail'"
          :style="{ '--t': `${callAt(k)}s` }"
        >
          <code class="call-in">{{ w.fn }}({{ points }})</code>
          <span class="arrow">→</span>
          <code class="call-test">{{ points }} &gt;= {{ LIMIT }}</code>
          <span class="arrow">→</span>
          <code class="call-bool">{{ passes(points) ? 'True' : 'False' }}</code>
          <span class="arrow">→</span>
          <span class="call-out">{{ passes(points) ? w.pass : w.fail }}</span>
        </div>
      </div>

      <!-- ═══ 2–3: the loop over a list, then counting ═══ -->
      <div v-else-if="stage === 2 || stage === 3" class="loop">
        <div class="list">
          <code class="list-name">{{ w.list }}</code>
          <span class="cells">
            <code
              v-for="(points, k) in RESULTS"
              :key="k"
              class="cell"
              :style="{ '--t': `${stage === 2 ? loopAt(k) : countAt(k)}s` }"
            >{{ points }}</code>
          </span>
        </div>

        <ol class="rows">
          <li
            v-for="(points, k) in RESULTS"
            :key="k"
            class="row"
            :class="[passes(points) ? 'is-pass' : 'is-fail', { 'is-counted': stage === 3 && passes(points) }]"
            :style="{ '--t': `${stage === 2 ? loopAt(k) + 0.35 : countAt(k)}s` }"
          >
            <code class="row-in">{{ w.fn }}({{ points }})</code>
            <span class="arrow">→</span>
            <span class="row-out">{{ passes(points) ? w.pass : w.fail }}</span>
            <span v-if="stage === 3" class="row-plus">{{ passes(points) ? '+1' : '' }}</span>
          </li>
        </ol>

        <div v-if="stage === 3" class="counter">
          <code class="counter-name">{{ w.count }}</code>
          <span class="counter-stack">
            <span
              v-for="step in counterSteps"
              :key="step.value"
              class="counter-value"
              :style="{ '--from': `${step.from}s`, '--until': `${step.until}s` }"
            >{{ step.value }}</span>
          </span>
          <span class="counter-total" :style="{ '--t': `${COUNT_DONE}s` }">
            {{ counterSteps[counterSteps.length - 1]!.value }} {{ w.of }} {{ RESULTS.length }}
          </span>
        </div>
      </div>

      <!-- ═══ 4: a second case, the password check ═══ -->
      <div v-else class="passwords">
        <div
          v-for="(word, row) in passwords"
          :key="row"
          class="pw"
          :class="{
            'is-short': word.length < 8,
            'is-safe': word.length >= 8 && firstDigit(word) !== -1,
          }"
          :style="{ '--t': `${PW_ROW[row]}s`, '--end': `${pwEnd(row)}s` }"
        >
          <code class="pw-call">{{ w.check }}("{{ word }}")</code>
          <span class="pw-len">{{ word.length }} {{ w.chars }}</span>
          <span class="pw-chars">
            <code
              v-for="(ch, i) in [...word]"
              :key="i"
              class="pw-char"
              :class="{
                'is-digit': /\d/.test(ch),
                'is-skipped': word.length < 8 || (firstDigit(word) !== -1 && i > firstDigit(word)),
              }"
              :style="{ '--c': `${PW_ROW[row]! + 0.6 + i * CHAR}s` }"
            >{{ ch }}</code>
          </span>
          <span class="pw-result">
            <code>{{ word.length >= 8 && firstDigit(word) !== -1 ? 'True' : 'False' }}</code>
            {{ word.length < 8 ? w.tooShort : firstDigit(word) === -1 ? w.noDigit : w.found }}
          </span>
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
  justify-content: center;
  padding: 7vh 5% 3vh;
}
code {
  font-family: var(--font-code);
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

.arrow {
  font-weight: 800;
  color: var(--text-muted);
}

/* ─── 1: the rule ────────────────────────────────────────────────────── */
.calls {
  display: flex;
  flex-direction: column;
  gap: 3vh;
}
.call {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.1vh;
  padding: 1.8vh 2vh;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 3px solid var(--border);
  font-size: clamp(0.6rem, 1.8vh, 1.15rem);
  font-weight: 800;
  animation: swap-in 0.4s ease var(--t) both;
}
.call > * {
  animation: appear 0.3s ease both;
}
.call > :nth-child(2) { animation-delay: calc(var(--t) + 0.4s); }
.call > :nth-child(3) { animation-delay: calc(var(--t) + 0.5s); }
.call > :nth-child(4) { animation-delay: calc(var(--t) + 0.9s); }
.call > :nth-child(5) { animation-delay: calc(var(--t) + 1.0s); }
.call > :nth-child(6) { animation-delay: calc(var(--t) + 1.3s); }
.call > :nth-child(7) { animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--t) + 1.4s) both; }
.call-test {
  padding: 0.4vh 0.9vh;
  border-radius: 0.8vh;
  background: var(--bg-off);
}
.call-bool {
  color: var(--text-dim);
}
.call-out,
.row-out {
  padding: calc(0.25vh + 0.25em) 1.1vh;
  border-radius: 999px;
  white-space: nowrap;
}
.is-pass .call-out,
.is-pass .row-out {
  background: var(--mint);
  color: var(--text);
}
.is-fail .call-out,
.is-fail .row-out {
  background: color-mix(in srgb, var(--coral) 22%, var(--bg));
  color: var(--text);
}

/* ─── 2–3: the loop ──────────────────────────────────────────────────── */
.loop {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.4vh;
}
.list {
  display: flex;
  align-items: center;
  gap: 1.2vh;
}
.list-name {
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
}
.cells {
  display: flex;
  gap: 0.7vh;
}
.cell {
  min-width: 4.5ch;
  padding: 0.6vh 1vh;
  border-radius: 0.8vh;
  background: var(--bg);
  border: 2px solid var(--border);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  text-align: center;
  animation: visit 0.9s ease var(--t) both;
}
/* The item the loop is on right now. */
@keyframes visit {
  0% { border-color: var(--border); background: var(--bg); transform: none; }
  20%, 70% { border-color: var(--coral); background: color-mix(in srgb, var(--coral) 14%, var(--bg)); transform: translateY(-0.5vh); }
  100% { border-color: var(--border); background: var(--bg-off); transform: none; }
}

.rows {
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1vh;
}
.row {
  display: flex;
  align-items: center;
  gap: 1.1vh;
  padding: 0.9vh 1.6vh;
  border-radius: 1.2vh;
  background: var(--bg);
  border: 2px solid var(--border);
  font-size: clamp(0.56rem, 1.6vh, 1.05rem);
  font-weight: 800;
}
.stage-2 .row {
  animation: swap-in 0.35s ease var(--t) both;
}
.stage-3 .row {
  animation: recheck 0.8s ease var(--t) both;
}
@keyframes recheck {
  0% { border-color: var(--border); }
  25%, 70% { border-color: var(--text); }
  100% { border-color: var(--border); }
}
.row-in {
  flex: 1;
}
.row-plus {
  min-width: 3ch;
  font-family: var(--font-code);
  text-align: right;
  color: var(--text);
  animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--t) + 0.3s) both;
}
.row.is-counted {
  animation: recheck 0.8s ease var(--t) both, counted 0.4s ease calc(var(--t) + 0.3s) forwards;
}
@keyframes counted {
  to { background: color-mix(in srgb, var(--mint) 16%, var(--bg)); }
}

.counter {
  display: flex;
  align-items: center;
  gap: 1.4vh;
  padding: 1.2vh 2vh;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 3px solid var(--text);
  animation: swap-in 0.4s ease 0.4s both;
}
.counter-name {
  font-size: clamp(0.58rem, 1.7vh, 1.1rem);
  font-weight: 800;
  color: var(--text-dim);
}
.counter-stack {
  display: inline-grid;
  min-width: 2ch;
}
.counter-value {
  grid-area: 1 / 1;
  justify-self: center;
  font-family: var(--font-code);
  font-size: clamp(1rem, 3.4vh, 2.2rem);
  font-weight: 900;
  opacity: 0;
  animation:
    swap-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) var(--from) both,
    vanish 0.15s ease var(--until) forwards;
}
.counter-total {
  padding: calc(0.3vh + 0.25em) 1.2vh;
  border-radius: 999px;
  background: var(--mint);
  font-size: clamp(0.56rem, 1.6vh, 1.05rem);
  font-weight: 800;
  white-space: nowrap;
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) var(--t) both;
}

/* ─── 4: the password check ──────────────────────────────────────────── */
.passwords {
  display: flex;
  flex-direction: column;
  gap: 1.3vh;
  margin-top: 2vh;
}
.pw {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "call len"
    "chars chars"
    "result result";
  gap: 0.6vh 1.2vh;
  padding: 1vh 1.6vh;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 3px solid var(--border);
  animation: swap-in 0.4s ease var(--t) both;
}
.pw-call {
  grid-area: call;
  font-size: clamp(0.56rem, 1.65vh, 1.05rem);
  font-weight: 800;
}
.pw-len {
  grid-area: len;
  padding: calc(0.2vh + 0.2em) 1vh;
  border-radius: 999px;
  background: var(--bg-off);
  font-size: clamp(0.48rem, 1.3vh, 0.85rem);
  font-weight: 800;
  color: var(--text-dim);
  animation: pop 0.3s ease calc(var(--t) + 0.3s) both;
}
.pw.is-short .pw-len {
  background: color-mix(in srgb, var(--coral) 22%, var(--bg));
  color: var(--text);
}
.pw-chars {
  grid-area: chars;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4vh;
}
.pw-char {
  display: grid;
  place-items: center;
  width: 2.5vh;
  height: 2.8vh;
  border-radius: 0.6vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
  font-size: clamp(0.5rem, 1.5vh, 0.95rem);
  font-weight: 800;
  animation: scan 0.3s ease var(--c) both;
}
/* The loop reads one character after another. */
@keyframes scan {
  0% { border-color: var(--border); }
  50% { border-color: var(--coral); transform: translateY(-0.4vh); }
  100% { border-color: var(--text-muted); transform: none; }
}
.pw-char.is-digit {
  animation: scan-hit 0.35s ease var(--c) both;
}
@keyframes scan-hit {
  0% { border-color: var(--border); }
  100% { border-color: var(--mint); background: var(--mint); }
}
/* Never read: too short, or after `return` already left the loop. */
.pw-char.is-skipped {
  animation: fade-skip 0.3s ease var(--end) both;
}
@keyframes fade-skip {
  to { opacity: 0.35; }
}
.pw-result {
  grid-area: result;
  display: flex;
  align-items: center;
  gap: 1vh;
  font-size: clamp(0.5rem, 1.45vh, 0.9rem);
  font-weight: 800;
  color: var(--text-dim);
  animation: swap-in 0.35s ease var(--end) both;
}
.pw-result code {
  padding: calc(0.2vh + 0.2em) 1vh;
  border-radius: 999px;
  background: color-mix(in srgb, var(--coral) 22%, var(--bg));
  color: var(--text);
}
.pw.is-safe .pw-result code {
  background: var(--mint);
}

@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes vanish {
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

/* ─── A phone held upright ───────────────────────────────────────────── */
@media (orientation: portrait) and (max-width: 760px) {
  .scene {
    position: relative;
    padding: 3rem 0 1rem;
  }
  .call,
  .row,
  .pw-call {
    font-size: 0.85rem;
  }
  .cell,
  .list-name,
  .counter-name,
  .counter-total {
    font-size: 0.85rem;
  }
  .pw-len,
  .pw-result {
    font-size: 0.75rem;
  }
  .pw-char {
    width: 1.5rem;
    height: 1.7rem;
    font-size: 0.8rem;
  }
}
</style>
