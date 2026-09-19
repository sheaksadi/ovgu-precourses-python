<script setup lang="ts">
/**
 * "Drei Katzen, viele Zahlen" (PRE-0202), one slide, auto-imported as
 * `<LessonDictsPain />`.
 *
 * The problem the dictionaries section then solves, stated first. Three cats,
 * four facts each, all of it in lists — so every fact is a number, the numbers
 * mean nothing by themselves, and asking "how old is Luna?" means counting
 * cells. The scene counts them: 0, 1 … and lands on the answer, then asks for
 * position 3 and leaves the question hanging.
 *
 * Words come from `dictsPain.*` in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t, tm } = useI18n()

interface Cat {
  name: string
  colour: string
  cells: string[]
}

const lesson = computed(() => tm<{
  headline: string
  note: string
  tally: string
  code: string
  focus: number[]
  output: string[]
  outputLabel: string
  noOutput: string
  cats: Cat[]
  ask: string
  answer: string
  puzzled: string
  countLabel: string
}>('dictsPain'))

/** The cat the scene counts across, and the cell it lands on. */
const ASKED = 1
const LANDS = 1
/** The second question, left open: what does position 3 hold again? */
const PUZZLED_CAT = 2
const PUZZLED_CELL = 3

const countAt = (cell: number) => 1.6 + cell * 0.55
const LANDED_AT = countAt(LANDS) + 0.5
const PUZZLED_AT = LANDED_AT + 1.6
</script>

<template>
  <LessonShell
    :eyebrow="t('dictsPain.title')"
    :stage="1"
    :stages="1"
    :headline="lesson.headline"
    :note="lesson.note"
    :code="lesson.code"
    :file="t('dictsPain.file')"
    :focus="lesson.focus"
    :output="lesson.output"
    :output-from="0"
    :output-delays="[LANDED_AT + 0.3, PUZZLED_AT + 0.4]"
    dense
    :output-label="lesson.outputLabel"
    :no-output="lesson.noOutput"
  >
    <div class="scene">
      <span class="tally"><span class="text-trim">{{ lesson.tally }}</span></span>

      <div class="cats">
        <div
          v-for="(cat, c) in lesson.cats"
          :key="cat.name"
          class="cat"
          :class="{ 'is-asked': c === ASKED }"
          :style="{ '--accent': `var(--${cat.colour})`, '--t': `${0.3 + c * 0.15}s` }"
        >
          <div class="cat-head">
            <ArtSprite name="cat-stand" :color="cat.colour" accent="text" :size="96" class="cat-art" />
            <code class="cat-name">{{ cat.name }}</code>
          </div>
          <div class="cells">
            <code
              v-for="(cell, i) in cat.cells"
              :key="i"
              class="cell"
              :class="{
                'is-counted': c === ASKED && i <= LANDS,
                'is-landed': c === ASKED && i === LANDS,
                'is-puzzled': c === PUZZLED_CAT && i === PUZZLED_CELL,
              }"
              :style="{ '--t': c === PUZZLED_CAT && i === PUZZLED_CELL ? `${PUZZLED_AT}s` : `${countAt(i)}s` }"
            >{{ cell }}</code>
          </div>
        </div>
      </div>

      <!-- The counting, and where it ends up -->
      <div class="asks">
        <span class="ask">{{ lesson.ask }}</span>
        <span class="answer" :style="{ '--t': `${LANDED_AT}s` }">{{ lesson.answer }}</span>
        <span class="puzzled" :style="{ '--t': `${PUZZLED_AT - 0.3}s` }">{{ lesson.puzzled }}</span>
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
  justify-content: center;
  gap: 2.5vh;
  padding: 7vh 3% 2vh;
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

/* ─── The three cats, each a row of four unlabelled cells ────────────── */
.cats {
  display: flex;
  flex-direction: column;
  gap: 1.4vh;
  width: 100%;
}
.cat {
  display: flex;
  align-items: center;
  gap: 1.2vh;
  padding: 0.9vh 1.2vh;
  border-radius: 1.2vh;
  background: var(--bg);
  border: 2px solid var(--border);
  animation: swap-in 0.35s ease var(--t) both;
}
.cat.is-asked {
  border-color: var(--accent);
}
.cat-head {
  display: flex;
  align-items: center;
  gap: 0.6vh;
  min-width: 11ch;
}
.cat-art {
  width: 4.4vh;
  height: 4.4vh;
}
.cat-name {
  font-size: clamp(0.52rem, 1.5vh, 0.95rem);
  font-weight: 800;
  color: var(--text);
}
.cells {
  display: flex;
  flex: 1;
  gap: 0.6vh;
}
.cell {
  flex: 1;
  padding: 0.5vh 0.4vh;
  border-radius: 0.7vh;
  background: var(--bg-off);
  border: 2px solid transparent;
  font-size: clamp(0.46rem, 1.35vh, 0.85rem);
  font-weight: 800;
  text-align: center;
  white-space: nowrap;
  color: var(--text-dim);
}
/* Counting across: each cell ticks as the finger passes it. */
.cell.is-counted {
  animation: tick 0.3s ease var(--t) both;
}
.cell.is-landed {
  animation: land 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) var(--t) both;
}
.cell.is-puzzled {
  animation: puzzle 0.4s ease var(--t) both;
}

/* ─── The questions ──────────────────────────────────────────────────── */
.asks {
  display: flex;
  align-items: center;
  gap: 1vh;
  flex-wrap: wrap;
  justify-content: center;
}
.ask,
.answer,
.puzzled {
  padding: calc(0.35vh + 0.3em) 1.1vh;
  border-radius: 999px;
  font-size: clamp(0.5rem, 1.4vh, 0.9rem);
  font-weight: 800;
  white-space: nowrap;
}
.ask {
  background: var(--bg);
  border: 2px solid var(--text);
  color: var(--text);
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 1.1s both;
}
.answer {
  background: var(--mint);
  color: var(--text);
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) var(--t) both;
}
.puzzled {
  background: var(--coral);
  color: #FFFFFF;
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) var(--t) both;
}

@keyframes pop {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes swap-in {
  from { opacity: 0; transform: translateY(-0.8vh); }
  to { opacity: 1; transform: none; }
}
@keyframes tick {
  from { background: var(--bg-off); }
  to { background: color-mix(in srgb, var(--accent) 22%, var(--bg)); border-color: var(--accent); }
}
@keyframes land {
  0% { transform: none; }
  50% { transform: translateY(-0.8vh) scale(1.08); }
  100% { transform: none; background: var(--accent); border-color: var(--text); color: var(--bg); }
}
@keyframes puzzle {
  from { border-color: transparent; }
  to { border-color: var(--coral); background: color-mix(in srgb, var(--coral) 18%, var(--bg)); }
}
</style>
