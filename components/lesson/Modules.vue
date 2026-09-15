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
 *
 * The shelf stays; a different book leaves it on each stage. Words come from
 * `modules.*` in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3

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

const BOOKS = [
  { name: 'math', color: 'sky' },
  { name: 'random', color: 'coral' },
  { name: 'statistics', color: 'mint' },
  { name: 'datetime', color: 'sun' },
  { name: 'json', color: 'lavender' },
]
/** The book taken off the shelf on each stage. */
const TAKEN: Record<StageNumber, number> = { 1: 0, 2: 1, 3: 2 }

const TOOLS: Record<StageNumber, Array<{ name: string, result: string }>> = {
  1: [{ name: 'sqrt(16)', result: '4.0' }, { name: 'pi', result: '3.14159…' }],
  2: [{ name: 'choice(…)', result: '"Bello"' }, { name: 'randint(1, 6)', result: '4' }],
  3: [{ name: 'sqrt(25)', result: '5.0' }, { name: 'st.mean(…)', result: '5' }],
}

const outputDelays = computed(() => (props.stage === 3 ? [1.7, 2.7] : [1.6, 2.5]))
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
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    :output-label="t('modules.output')"
    :no-output="t('modules.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- The shelf -->
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
      <div :key="stage" class="open-book" :style="{ '--c': `var(--${BOOKS[TAKEN[stage]]!.color})` }">
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
