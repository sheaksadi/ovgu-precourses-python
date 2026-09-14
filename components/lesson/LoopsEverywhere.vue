<script setup lang="ts">
/**
 * "Schleifen überall": loops beyond lists. Auto-imported as `<LessonLoopsEverywhere :stage="1" />`.
 *
 * Five small scenes, one per slide (PRE-0090 and its four sub-slides):
 *
 *   1. letters: `for buchstabe in "Momo":` — the cursor walks the word
 *   2. nested: a 3 × 4 grid of tiles fills row by row
 *   3. patterns: a triangle of stars grows one line per pass
 *   4. simulation: savings with 10 % interest, one bar per year
 *   5. chance: roll a die until it shows a six
 *
 * Every scene stays one extra stage so it can clear away while the next one
 * arrives. Beats are computed here and handed to CSS as `--t`. Words come from
 * `loops.everywhere.*` in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

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

const stages = computed(() => tm<Stage[]>('loops.everywhere.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const names = computed(() => tm<Record<'letter' | 'row' | 'col' | 'money', string>>('loops.everywhere.names'))

/* 1: letters */
const WORD = 'Momo'
const letterAt = (k: number) => 0.7 + k * 0.8

/* 2: grid */
const ROWS = 3
const COLS = 4
const tileAt = (r: number, c: number) => 0.6 + (r * COLS + c) * 0.22 + r * 0.35
const tiles = Array.from({ length: ROWS * COLS }, (_, n) => ({ r: Math.floor(n / COLS), c: n % COLS }))

/* 3: stars */
const starRowAt = (i: number) => 0.6 + (i - 1) * 0.55

/* 4: savings */
const years = [1, 2, 3, 4, 5].map(year => ({ year, money: Math.round(100 * 1.1 ** year) }))
const yearAt = (y: number) => 0.7 + (y - 1) * 0.7

/* 5: dice */
const ROLLS = [3, 1, 5, 6]
const rollAt = (k: number) => 0.8 + k * 1.0
const PIPS: Record<number, number[]> = {
  1: [4],
  3: [0, 4, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
}

const outputDelays = computed(() => {
  switch (props.stage) {
    case 1: return [...WORD].map((_, k) => letterAt(k) + 0.25)
    case 2: return [0, 1, 2].map(r => tileAt(r, COLS - 1) + 0.25)
    case 3: return [1, 2, 3, 4, 5].map(i => starRowAt(i) + 0.3)
    case 4: return years.map(y => yearAt(y.year) + 0.35)
    case 5: return ROLLS.map((_, k) => rollAt(k) + 0.6)
    default: return []
  }
})

/** A scene is active on its own stage and leaving on the next one. */
const phase = (own: number) => (props.stage === own ? 'is-active' : props.stage === own + 1 ? 'is-leaving' : '')
const shown = (own: number) => props.stage === own || props.stage === own + 1
</script>

<template>
  <LessonShell
    :eyebrow="t('loops.everywhere.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :file="t('loops.everywhere.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    :stack-output="stage === 3"
    :output-label="t('loops.everywhere.output')"
    :no-output="t('loops.everywhere.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- ═══ 1: letters ═══ -->
      <div v-if="shown(1)" class="part letters" :class="phase(1)">
        <div class="word">
          <span v-for="(letter, k) in WORD" :key="k" class="tile" :style="{ '--t': `${letterAt(k)}s` }">
            <span class="text-trim">{{ letter }}</span>
          </span>
        </div>
        <div class="letter-box">
          <div class="letter-art">
            <ArtSprite name="box" color="lavender" accent="text-muted" :size="96" class="fill" />
            <span class="stack letter-stack">
              <span
                v-for="(letter, k) in WORD"
                :key="k"
                class="timed letter-value"
                :style="{ '--t': `${letterAt(k) + 0.1}s`, '--u': `${k < WORD.length - 1 ? letterAt(k + 1) + 0.1 : 999}s` }"
              >"{{ letter }}"</span>
            </span>
          </div>
          <span class="name-tag"><span class="text-trim">{{ names.letter }}</span></span>
        </div>
      </div>

      <!-- ═══ 2: nested ═══ -->
      <div v-if="shown(2)" class="part nested" :class="phase(2)">
        <div class="grid">
          <span
            v-for="tile in tiles"
            :key="`${tile.r}-${tile.c}`"
            class="cell"
            :style="{ '--t': `${tileAt(tile.r, tile.c)}s`, '--r': tile.r }"
          ></span>
        </div>
        <div class="counters">
          <span class="counter">
            <span>{{ names.row }} =</span>
            <span class="stack">
              <span
                v-for="r in ROWS"
                :key="r"
                class="timed counter-value is-row"
                :style="{ '--t': `${tileAt(r - 1, 0) - 0.05}s`, '--u': `${r < ROWS ? tileAt(r, 0) - 0.05 : 999}s` }"
              >{{ r - 1 }}</span>
            </span>
          </span>
          <span class="counter">
            <span>{{ names.col }} =</span>
            <span class="stack">
              <span
                v-for="(tile, n) in tiles"
                :key="n"
                class="timed counter-value is-col"
                :style="{ '--t': `${tileAt(tile.r, tile.c)}s`, '--u': `${n < tiles.length - 1 ? tileAt(tiles[n + 1]!.r, tiles[n + 1]!.c) : 999}s` }"
              >{{ tile.c }}</span>
            </span>
          </span>
        </div>
      </div>

      <!-- ═══ 3: stars ═══ -->
      <div v-if="shown(3)" class="part stars" :class="phase(3)">
        <div v-for="i in 5" :key="i" class="star-row">
          <span
            v-for="s in i"
            :key="s"
            class="star"
            :style="{ '--t': `${starRowAt(i) + (s - 1) * 0.06}s` }"
          >★</span>
          <code class="star-code" :style="{ '--t': `${starRowAt(i)}s` }">"*" * {{ i }}</code>
        </div>
      </div>

      <!-- ═══ 4: savings ═══ -->
      <div v-if="shown(4)" class="part savings" :class="phase(4)">
        <span class="money-tag"><span class="text-trim">{{ names.money }} = 100</span></span>
        <div class="chart">
          <div v-for="y in years" :key="y.year" class="column" :style="{ '--t': `${yearAt(y.year)}s`, '--h': y.money / years[4]!.money }">
            <span class="column-value"><span class="text-trim">{{ y.money }}</span></span>
            <span class="column-bar"></span>
            <span class="column-year"><span class="text-trim">{{ y.year }}</span></span>
          </div>
        </div>
      </div>

      <!-- ═══ 5: dice ═══ -->
      <div v-if="stage === 5" class="part dice is-active">
        <div class="die-slot">
          <div
            v-for="(roll, k) in ROLLS"
            :key="k"
            class="die"
            :class="{ 'is-six': roll === 6 }"
            :style="{ '--t': `${rollAt(k)}s`, '--u': `${k < ROLLS.length - 1 ? rollAt(k + 1) : 999}s` }"
          >
            <span v-for="p in 9" :key="p" class="pip" :class="{ 'is-on': PIPS[roll]!.includes(p - 1) }"></span>
          </div>
        </div>
        <div class="history">
          <span
            v-for="(roll, k) in ROLLS"
            :key="k"
            class="roll"
            :class="{ 'is-six': roll === 6 }"
            :style="{ '--t': `${rollAt(k) + 0.5}s` }"
          ><span class="text-trim">{{ roll }}</span></span>
        </div>
        <div class="six">
          <ArtSprite name="cat-peek" color="coral" accent="sun" :size="96" class="six-cat" />
          <span class="six-label"><span class="text-trim">{{ t('loops.everywhere.six') }}</span></span>
        </div>
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

.fill {
  width: 100%;
  height: 100%;
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

/* A scene clears as the next one arrives, from its finished frame. */
.is-leaving {
  animation: vanish 0.3s ease both;
}

/* Values that change in place share one cell. */
.stack {
  display: inline-grid;
}
.timed {
  grid-area: 1 / 1;
  text-align: center;
  opacity: 0;
}
.is-active .timed {
  animation:
    swap-in 0.2s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both,
    vanish 0.08s ease var(--u) forwards;
}
.is-leaving .timed:last-child {
  opacity: 1;
}

.name-tag {
  padding: calc(0.3vh + 0.3em) 1.1vh;
  border-radius: 999px;
  background: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.55rem, 1.45vh, 0.95rem);
  font-weight: 800;
  color: var(--bg);
}

/* ═══ 1: letters ═══════════════════════════════════════════════════════ */
.word {
  position: absolute;
  top: 10vh;
  left: 50%;
  display: flex;
  gap: 1.6vh;
  translate: -50% 0;
}
.tile {
  display: grid;
  place-items: center;
  width: 9vh;
  height: 10vh;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 3px solid var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(1.4rem, 5.4vh, 3.6rem);
  font-weight: 900;
  color: var(--text);
}
.is-active .tile {
  animation: cursor 0.7s ease var(--t) both;
}

.letter-box {
  position: absolute;
  top: 27vh;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8vh;
  translate: -50% 0;
}
.letter-art {
  position: relative;
  width: 12vh;
  height: 12vh;
}
.letter-stack {
  position: absolute;
  left: 50%;
  top: 64%;
  translate: -50% -50%;
}
.letter-value {
  padding: calc(0.35vh + 0.3em) 1vh;
  border-radius: 0.9vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.7rem, 2vh, 1.35rem);
  font-weight: 800;
  color: var(--text);
}

/* ═══ 2: nested ════════════════════════════════════════════════════════ */
.grid {
  position: absolute;
  top: 9vh;
  left: 50%;
  display: grid;
  grid-template-columns: repeat(4, 7vh);
  gap: 1.2vh;
  translate: -50% 0;
}
.cell {
  width: 7vh;
  height: 7vh;
  border-radius: 1.2vh;
  background: var(--border);
}
.is-active .cell {
  animation: tile-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) var(--t) both;
}
.is-active .cell,
.is-leaving .cell {
  background: color-mix(in srgb, var(--sky) calc(55% + var(--r) * 20%), var(--bg));
  border: 2px solid var(--text);
}

.counters {
  position: absolute;
  top: 38vh;
  left: 50%;
  display: flex;
  gap: 1.6vh;
  translate: -50% 0;
}
.counter {
  display: flex;
  align-items: center;
  gap: 0.7vh;
  padding: 0.5vh 0.5vh 0.5vh 1.1vh;
  border-radius: 999px;
  background: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
}
.counter-value {
  min-width: 2.2em;
  padding: 0.25vh 0.7vh;
  border-radius: 999px;
  color: var(--text);
}
.counter-value.is-row {
  background: var(--sun);
}
.counter-value.is-col {
  background: var(--sky);
}

/* ═══ 3: stars ═════════════════════════════════════════════════════════ */
.stars {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.8vh;
  padding-left: 12%;
}
.star-row {
  display: flex;
  align-items: center;
  gap: 0.6vh;
  height: 5.6vh;
}
.star {
  font-size: clamp(1.1rem, 4.4vh, 3rem);
  line-height: 1;
  color: var(--sun);
  -webkit-text-stroke: 2px var(--text);
  opacity: 0;
}
.star-code {
  margin-left: 2vh;
  padding: calc(0.25vh + 0.3em) 0.9vh;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--border);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.55rem, 1.45vh, 0.95rem);
  font-weight: 700;
  color: var(--text-dim);
  opacity: 0;
}
.is-active .star {
  animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) var(--t) both;
}
.is-active .star-code {
  animation: appear 0.25s ease var(--t) both;
}
.is-leaving .star,
.is-leaving .star-code {
  opacity: 1;
}

/* ═══ 4: savings ═══════════════════════════════════════════════════════ */
.money-tag {
  position: absolute;
  top: 7vh;
  left: 8%;
  padding: calc(0.4vh + 0.3em) 1.2vh;
  border-radius: 999px;
  background: var(--sun);
  border: 2px solid var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  font-weight: 800;
  color: var(--text);
}
.chart {
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: 5vh;
  height: 30vh;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: end;
  gap: 4%;
  border-bottom: 3px solid var(--text);
}
.column {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}
.column-bar {
  width: 70%;
  height: calc(var(--h) * 24vh);
  border-radius: 1vh 1vh 0 0;
  background: var(--mint);
  border: 2px solid var(--text);
  border-bottom: none;
  transform-origin: bottom center;
  transform: scaleY(0);
}
.column-value {
  margin-bottom: 0.6vh;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  font-weight: 800;
  color: var(--text);
  opacity: 0;
}
.column-year {
  position: absolute;
  top: calc(100% + 0.8vh);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.55rem, 1.45vh, 0.95rem);
  font-weight: 700;
  color: var(--text-muted);
}
.is-active .column-bar {
  animation: grow 0.5s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.is-active .column-value {
  animation: pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--t) + 0.35s) both;
}
.is-leaving .column-bar {
  transform: none;
}
.is-leaving .column-value {
  opacity: 1;
}

/* ═══ 5: dice ══════════════════════════════════════════════════════════ */
.die-slot {
  position: absolute;
  top: 8vh;
  left: 50%;
  width: 16vh;
  height: 16vh;
  translate: -50% 0;
}
.die {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  padding: 2vh;
  border-radius: 2.4vh;
  background: var(--bg);
  border: 3px solid var(--text);
  opacity: 0;
  animation:
    tumble 0.5s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both,
    vanish 0.1s ease var(--u) forwards;
}
.die.is-six {
  border-color: var(--mint);
  box-shadow: 0 0 0 0.6vh color-mix(in srgb, var(--mint) 30%, transparent);
}
.pip {
  place-self: center;
  width: 2.4vh;
  height: 2.4vh;
  border-radius: 999px;
}
.pip.is-on {
  background: var(--text);
}

.history {
  position: absolute;
  top: 29vh;
  left: 50%;
  display: flex;
  gap: 1.2vh;
  translate: -50% 0;
}
.roll {
  display: grid;
  place-items: center;
  width: 5vh;
  height: 5vh;
  border-radius: 1vh;
  background: var(--bg);
  border: 2px solid var(--border);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.8rem, 2.3vh, 1.5rem);
  font-weight: 800;
  color: var(--text);
  opacity: 0;
  animation: pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.roll.is-six {
  background: var(--mint);
  border-color: var(--text);
  color: #FFFFFF;
}

.six {
  position: absolute;
  right: 8%;
  bottom: 2vh;
  display: flex;
  align-items: center;
  gap: 1vh;
  opacity: 0;
  animation: rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) 4.5s both;
}
.six-cat {
  width: 10vh;
  height: 10vh;
}
.six-label {
  padding: calc(0.5vh + 0.3em) 1.4vh;
  border-radius: 999px;
  background: var(--mint);
  font-size: clamp(0.7rem, 1.9vh, 1.3rem);
  font-weight: 900;
  color: #FFFFFF;
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
  from { opacity: 0; transform: scale(0.4); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes rise {
  from { opacity: 0; transform: translateY(1.6vh); }
  to { opacity: 1; transform: none; }
}
@keyframes swap-in {
  from { opacity: 0; transform: translateY(-0.8vh); }
  to { opacity: 1; transform: none; }
}
@keyframes cursor {
  0% { background: var(--bg); transform: none; }
  30% { background: var(--sun); transform: translateY(-1vh); }
  100% { background: var(--bg); transform: none; }
}
@keyframes tile-in {
  from { opacity: 0; transform: scale(0.3); }
  to { opacity: 1; transform: none; }
}
@keyframes grow {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}
@keyframes tumble {
  from { opacity: 0; transform: rotate(-200deg) scale(0.5); }
  to { opacity: 1; transform: none; }
}
</style>
