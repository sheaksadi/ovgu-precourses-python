<script setup lang="ts">
/**
 * Modules: "Ein Regal voller Bücher". Auto-imported as `<LessonModules :stage="1" />`.
 *
 * Three slides (PRE-0124 and its two sub-slides):
 *
 *   1. `import math`: the math book comes off the shelf, `math.sqrt` and `math.pi`
 *   2. `import random`: the random book picks an animal and rolls a die
 *   3. `from math import sqrt` fetches one tool; `import statistics as st` gives
 *      a book a short name
 *   4. a text file read whole, with `with open(...)`
 *   5. the same file walked line by line, and what `strip()` takes off
 *
 * The shelf carries all five slides. The last two take one more book off it —
 * the one about files — and what comes out of that one is not a list of
 * functions but the file itself, so the page opens where the book did. Words
 * come from `modules.*` in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useLineClock, type LineStep } from '~/composables/useLineClock'

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

const stages = computed(() => tm<Stage[]>('modules.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const animals = computed(() => tm<string[]>('modules.animals'))
const fileWords = computed(() => tm<Record<'whole' | 'line' | 'strip' | 'text', string>>('modules.fileWords'))

/** 4–5: the file on the table, and when each of its lines is read. */
const FILE_LINES = ['Momo', 'Bello', 'Hoppel']
const lineAt = (k: number) => 1.6 + k * 0.9

const BOOKS = computed(() => [
  { name: 'math', color: 'sky' },
  { name: 'random', color: 'coral' },
  { name: 'statistics', color: 'mint' },
  { name: 'datetime', color: 'sun' },
  { name: 'json', color: 'lavender' },
  // The last book is the one the file slides open; `open` needs no import,
  // which is the point the slide makes out loud.
  { name: t('modules.fileBook'), color: 'rose' },
])
const FILE_BOOK = 5

/** The book taken off the shelf on each stage. */
const TAKEN: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: FILE_BOOK, 5: FILE_BOOK }
/** Stages 1–3 open a book of functions; 4–5 open the file instead. */
const onShelf = computed(() => props.stage <= 3)

const TOOLS: Record<number, Array<{ name: string, result: string }>> = {
  1: [{ name: 'sqrt(16)', result: '4.0' }, { name: 'pi', result: '3.14159…' }],
  2: [{ name: 'choice(…)', result: '"Bello"' }, { name: 'randint(1, 6)', result: '4' }],
  3: [{ name: 'sqrt(25)', result: '5.0' }, { name: 'st.mean(…)', result: '5' }],
}

const outputDelays = computed(() => {
  if (props.stage === 4) return FILE_LINES.map(() => 2.6)
  if (props.stage === 5) return FILE_LINES.map((_, k) => lineAt(k) + 0.5)
  return props.stage === 3 ? [1.7, 2.7] : [1.6, 2.5]
})

/** The loop over the lines: the `for` lights again on every pass. */
const SCHEDULE: Record<number, LineStep[]> = {
  4: [{ at: 0.4, line: 1 }, { at: 1.3, line: 2 }, { at: 2.4, line: 4 }],
  5: [
    { at: 0.4, line: 1 },
    ...FILE_LINES.flatMap((_, k) => [
      { at: lineAt(k) - 0.4, line: 2 },
      { at: lineAt(k) + 0.1, line: 3 },
    ]),
  ],
}
const line = useLineClock(() => SCHEDULE[props.stage] ?? [], () => props.stage)
</script>

<template>
  <LessonShell
    :eyebrow="t('modules.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :file="t('modules.file')"
    :focus="line ? [line] : current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    :output-label="t('modules.output')"
    :no-output="t('modules.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- The shelf, on every stage: a different book leaves it each time -->
      <div class="shelf">
        <span
          v-for="(book, k) in BOOKS"
          :key="book.name"
          class="spine"
          :class="{ 'is-taken': k === TAKEN[stage], 'was-taken': stage > 1 && k === TAKEN[(stage - 1) as StageNumber] }"
          :style="{ '--k': k, background: `var(--${book.color})` }"
        >
          <code class="spine-label">{{ book.name }}</code>
          <code v-if="stage === 3 && k === 2" class="alias">st</code>
        </span>
        <span class="plank"></span>
      </div>

      <!-- The open book with its tools -->
      <div v-if="onShelf" :key="stage" class="open-book" :style="{ '--c': `var(--${BOOKS[TAKEN[stage]]!.color})` }">
        <code class="book-title">import {{ BOOKS[TAKEN[stage]]!.name }}</code>
        <div v-for="(tool, k) in TOOLS[stage]" :key="tool.name" class="tool" :style="{ '--t': `${1.2 + k * 0.9}s` }">
          <code class="tool-name">{{ tool.name }}</code>
          <code class="tool-result">{{ tool.result }}</code>
        </div>
      </div>

      <!-- 2: random picks -->
      <div v-if="stage === 2" class="picks">
        <code v-for="(animal, k) in animals" :key="animal" class="pick" :class="{ 'is-chosen': k === 1 }" :style="{ '--k': k }">{{ animal }}</code>
      </div>

      <!-- 3: one tool fetched on its own -->
      <code v-if="stage === 3" class="fetched">from math import sqrt</code>

      <!-- 4–5: what the file book opens on is the file itself -->
      <div v-if="stage >= 4" class="paper" :style="{ '--c': `var(--${BOOKS[FILE_BOOK]!.color})` }">
        <code class="paper-name">{{ t('modules.fileName') }}</code>
        <div
          v-for="(text, k) in FILE_LINES"
          :key="text"
          class="paper-line"
          :class="{ 'is-read': stage === 5 }"
          :style="{ '--t': `${stage === 5 ? lineAt(k) : 0.8}s` }"
        >
          <code class="paper-text">{{ text }}</code>
          <code class="paper-break">\n</code>
        </div>
      </div>

      <!-- 4: the whole text, in one variable -->
      <div v-if="stage === 4" class="whole">
        <code class="whole-name">{{ fileWords.text }}</code>
        <code class="whole-value">{{ FILE_LINES.join('\\n') }}</code>
        <span class="whole-tag">{{ fileWords.whole }}</span>
      </div>

      <!-- 5: one line at a time, with the break cut off -->
      <div v-if="stage === 5" class="walk">
        <span class="walk-tag">{{ fileWords.line }}</span>
        <code
          v-for="(text, k) in FILE_LINES"
          :key="text"
          class="walk-line"
          :style="{ '--t': `${lineAt(k) + 0.3}s` }"
        >{{ text }}</code>
        <span class="walk-strip">{{ fileWords.strip }}</span>
      </div>
    </div>
  </LessonShell>
</template>

<style scoped>
.scene {
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

/* ─── Shelf ──────────────────────────────────────────────────────────── */
.shelf {
  position: absolute;
  top: 7vh;
  left: 6%;
  width: 30%;
  height: 36vh;
  display: flex;
  align-items: flex-end;
  gap: 4%;
  padding: 0 5%;
}
.plank {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1vh;
  height: 1.6vh;
  border-radius: 0.6vh;
  background: var(--text);
}
.spine {
  position: relative;
  flex: 1;
  height: calc(26vh + var(--k) * -1.6vh);
  border-radius: 0.8vh 0.8vh 0 0;
  border: 2px solid var(--text);
  border-bottom: none;
}
.spine-label {
  position: absolute;
  left: 50%;
  bottom: 1.2vh;
  translate: -50% 0;
  writing-mode: vertical-rl;
  rotate: 180deg;
  font-size: clamp(0.5rem, 1.4vh, 0.9rem);
  font-weight: 800;
  color: var(--text);
}
.alias {
  position: absolute;
  top: -3.6vh;
  left: 50%;
  translate: -50% 0;
  padding: calc(0.2vh + 0.3em) 0.7vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 800;
  color: var(--bg);
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 2.2s both;
}
.spine.was-taken {
  animation: shelve 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.spine.is-taken {
  animation: unshelve 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
}

/* ─── Open book ──────────────────────────────────────────────────────── */
.open-book {
  position: absolute;
  top: 7vh;
  left: 42%;
  right: 5%;
  display: flex;
  flex-direction: column;
  gap: 1.4vh;
  padding: 1.8vh;
  border-radius: 1.8vh;
  background: var(--bg);
  border: 3px solid var(--text);
  border-left: 1.2vh solid var(--c);
  animation: open 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.7s both;
}
.book-title {
  font-size: clamp(0.65rem, 1.9vh, 1.25rem);
  font-weight: 800;
  color: var(--text);
}
.tool {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1vh;
  padding: 0.9vh 0.9vh 0.9vh 1.2vh;
  border-radius: 1vh;
  background: var(--bg-off);
  opacity: 0;
  animation: rise 0.35s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.tool-name {
  font-size: clamp(0.55rem, 1.6vh, 1.05rem);
  font-weight: 700;
  white-space: nowrap;
  color: var(--text);
}
.tool-result {
  padding: 0.3vh 0.9vh;
  border-radius: 999px;
  background: var(--mint);
  font-size: clamp(0.55rem, 1.55vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: #FFFFFF;
  opacity: 0;
  animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--t) + 0.35s) both;
}

/* ─── 2: picks ───────────────────────────────────────────────────────── */
.picks {
  position: absolute;
  left: 42%;
  right: 5%;
  bottom: 4vh;
  display: flex;
  justify-content: space-between;
  gap: 2%;
}
.pick {
  flex: 1;
  padding: 1vh 0;
  border-radius: 1vh;
  background: var(--bg);
  border: 2px solid var(--border);
  font-size: clamp(0.55rem, 1.6vh, 1.05rem);
  font-weight: 800;
  text-align: center;
  color: var(--text);
  animation: shuffle 1.2s steps(1) 1s both;
  animation-delay: calc(1s + var(--k) * 0.1s);
}
.pick.is-chosen {
  animation:
    shuffle 1.2s steps(1) 1.1s both,
    chosen 0.4s ease 2.3s both;
}

/* ─── 3: one tool ────────────────────────────────────────────────────── */
.fetched {
  position: absolute;
  left: 42%;
  bottom: 4vh;
  padding: calc(0.4vh + 0.3em) 1.2vh;
  border-radius: 999px;
  background: var(--sky);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  white-space: nowrap;
  color: #FFFFFF;
  opacity: 0;
  animation: fly-out 0.6s cubic-bezier(0.22, 1, 0.36, 1) 1.2s both;
}

/* ─── 4–5: the file ──────────────────────────────────────────────────── */
/* The file opens where a book opens, and is bound in the same colour. */
.paper {
  position: absolute;
  top: 7vh;
  left: 42%;
  right: 5%;
  border-left: 1.2vh solid var(--c);
  display: flex;
  flex-direction: column;
  gap: 0.7vh;
  padding: 1.6vh 1.4vh;
  border-radius: 1.2vh;
  background: var(--bg);
  border: 3px solid var(--text);
  animation: open 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.7s both;
}
.paper-name {
  margin-bottom: 0.4vh;
  font-size: clamp(0.45rem, 1.25vh, 0.8rem);
  font-weight: 800;
  color: var(--text-muted);
}
.paper-line {
  display: flex;
  align-items: baseline;
  gap: 0.4vh;
  padding: 0.4vh 0.7vh;
  border-radius: 0.6vh;
  background: var(--bg-off);
}
/* On stage 5 the line lights as the loop reaches it. */
.paper-line.is-read {
  animation: read 0.5s ease var(--t) both;
}
.paper-text {
  font-size: clamp(0.55rem, 1.6vh, 1rem);
  font-weight: 800;
  color: var(--text);
}
.paper-break {
  font-size: clamp(0.42rem, 1.15vh, 0.72rem);
  font-weight: 800;
  color: var(--text-muted);
}

.whole {
  position: absolute;
  top: 30vh;
  left: 42%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.6vh;
  padding: 1.4vh 1.6vh;
  border-radius: 1.2vh;
  background: color-mix(in srgb, var(--sky) 18%, var(--bg));
  border: 3px solid var(--sky);
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) 1.6s both;
}
.whole-name {
  font-size: clamp(0.5rem, 1.4vh, 0.9rem);
  font-weight: 800;
  color: var(--sky);
}
.whole-value {
  font-size: clamp(0.55rem, 1.6vh, 1rem);
  font-weight: 800;
  white-space: pre;
  color: var(--text);
}
.whole-tag {
  padding: calc(0.2vh + 0.3em) 0.8vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.4rem, 1.1vh, 0.68rem);
  font-weight: 800;
  color: var(--bg);
}

.walk {
  position: absolute;
  top: 29vh;
  left: 42%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7vh;
}
.walk-tag,
.walk-strip {
  padding: calc(0.2vh + 0.3em) 0.9vh;
  border-radius: 999px;
  font-size: clamp(0.42rem, 1.15vh, 0.72rem);
  font-weight: 800;
}
.walk-tag {
  background: var(--text);
  color: var(--bg);
  animation: appear 0.3s ease 1.2s both;
}
.walk-strip {
  margin-top: 0.8vh;
  background: var(--sun);
  color: var(--text);
  animation: appear 0.3s ease 4.4s both;
}
.walk-line {
  padding: 0.5vh 1.1vh;
  border-radius: 0.8vh;
  background: var(--bg);
  border: 2px solid var(--mint);
  font-size: clamp(0.55rem, 1.6vh, 1rem);
  font-weight: 800;
  color: var(--text);
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) var(--t) both;
}

@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes read {
  from { background: var(--bg-off); }
  to { background: color-mix(in srgb, var(--mint) 30%, var(--bg)); }
}

/* ─── Keyframes ──────────────────────────────────────────────────────── */
@keyframes pop {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes rise {
  from { opacity: 0; transform: translateY(1.4vh); }
  to { opacity: 1; transform: none; }
}
@keyframes unshelve {
  from { transform: none; }
  to { transform: translateY(-3vh) rotate(-6deg); }
}
@keyframes shelve {
  from { transform: translateY(-3vh) rotate(-6deg); }
  to { transform: none; }
}
@keyframes open {
  from { opacity: 0; transform: translateX(-6vh) scale(0.9); }
  to { opacity: 1; transform: none; }
}
@keyframes shuffle {
  0%, 50% { border-color: var(--border); }
  25%, 75% { border-color: var(--coral); }
  100% { border-color: var(--border); }
}
@keyframes chosen {
  from { background: var(--bg); transform: none; }
  to { background: color-mix(in srgb, var(--coral) 30%, var(--bg)); border-color: var(--coral); transform: translateY(-1vh); }
}
@keyframes fly-out {
  from { opacity: 0; transform: translate(-8vh, -12vh) scale(0.6); }
  to { opacity: 1; transform: none; }
}
</style>
