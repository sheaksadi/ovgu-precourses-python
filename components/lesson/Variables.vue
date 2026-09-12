<script setup lang="ts">
/**
 * Variables lesson. Auto-imported as `<LessonVariables :stage="1" />`.
 *
 * One scene over eight slides (PRE-0040 and its seven sub-slides), each adding
 * one idea:
 *
 *   1. a variable is a box with a name     5. calculating with variables
 *   2. using the name gives the value      6. putting variables into text
 *   3. a new value replaces the old one    7. input() gives text, int() a number
 *   4. every value has a type              8. good names
 *
 * Boxes on the left (the cast's box is a variable), code and output on the
 * right, the takeaway underneath. Each stage opens on the previous stage's last
 * frame and animates only what changed; reduced motion lands on the last frame.
 *
 * Every word on screen comes from `vars.*` in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type TypeName = 'str' | 'int' | 'float' | 'bool'

interface Stage {
  headline: string
  note: string
  code: string
  focus: number[]
  output: string[]
  outputFrom: number
}

interface Rule {
  name: string
  ok: boolean | null
  why: string
}

const props = defineProps<{ stage: StageNumber }>()
const { t, tm } = useI18n()

const stages = computed(() => tm<Stage[]>('vars.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const rules = computed(() => tm<Rule[]>('vars.rules'))

const scene = computed(() => {
  if (props.stage <= 3) return 'hello'
  if (props.stage <= 6) return 'types'
  return props.stage === 7 ? 'convert' : 'names'
})

const TYPE_COLOR: Record<TypeName, string> = { str: 'coral', int: 'sky', float: 'mint', bool: 'lavender' }

const typeBoxes: Array<{ key: 'name' | 'age' | 'weight' | 'hungry', type: TypeName, value: string }> = [
  { key: 'name', type: 'str', value: '"Momo"' },
  { key: 'age', type: 'int', value: '' },
  { key: 'weight', type: 'float', value: '4.5' },
  { key: 'hungry', type: 'bool', value: 'True' },
]

/** Split `backtick` spans out of a sentence, so they render as code. */
const segments = (text: string) => text.split('`').map((part, index) => ({ part, code: index % 2 === 1 }))
</script>

<template>
  <div class="vars relative w-full h-full overflow-hidden" :class="`stage-${stage}`">
    <!-- Header -->
    <header class="vars-head">
      <div class="vars-progress">
        <span class="vars-eyebrow">{{ t('vars.title') }}</span>
        <span class="vars-dots" aria-hidden="true">
          <span
            v-for="n in stages.length"
            :key="n"
            class="vars-dot"
            :class="{ 'is-done': n < stage, 'is-now': n === stage }"
          ></span>
        </span>
        <span class="vars-count">{{ stage }} / {{ stages.length }}</span>
      </div>
      <h2 class="vars-headline">
        <template v-for="(bit, index) in segments(current.headline)" :key="index">
          <code v-if="bit.code" class="inline-code">{{ bit.part }}</code>
          <template v-else>{{ bit.part }}</template>
        </template>
      </h2>
    </header>

    <!-- Scene -->
    <section class="vars-scene" aria-hidden="true">
      <!-- 1–3: one box -->
      <div v-if="scene === 'hello'" class="scene scene-hello">
        <div class="vbox vbox-big">
          <div class="vbox-art">
            <ArtSprite name="box" color="coral" accent="text-muted" :size="96" class="sprite-fill" />
            <span class="vbox-value value-hello"><span class="text-trim">{{ t('vars.values.hello') }}</span></span>
            <span class="vbox-value value-momo"><span class="text-trim">{{ t('vars.values.momo') }}</span></span>
          </div>
          <span class="vbox-label"><span class="text-trim">{{ t('vars.names.greeting') }}</span></span>
        </div>
      </div>

      <!-- 4–6: four boxes, one per type -->
      <div v-else-if="scene === 'types'" class="scene scene-types">
        <div class="type-row">
          <div v-for="box in typeBoxes" :key="box.key" class="vbox" :class="`vb-${box.key}`">
            <span class="vbox-type" :style="{ background: `var(--${TYPE_COLOR[box.type]})` }">
              <span class="text-trim type-code">{{ box.type }}</span>
              <span class="text-trim type-label">{{ t(`vars.types.${box.type}`) }}</span>
            </span>
            <div class="vbox-art">
              <ArtSprite name="box" :color="TYPE_COLOR[box.type]" accent="text-muted" :size="96" class="sprite-fill" />
              <template v-if="box.key === 'age'">
                <span class="vbox-value age-3"><span class="text-trim">3</span></span>
                <span class="vbox-value age-4"><span class="text-trim">4</span></span>
                <span class="vbox-value age-5"><span class="text-trim">5</span></span>
                <span class="plus-one plus-a"><span class="text-trim">+1</span></span>
                <span class="plus-one plus-b"><span class="text-trim">+1</span></span>
              </template>
              <span v-else class="vbox-value"><span class="text-trim">{{ box.value }}</span></span>
            </div>
            <span class="vbox-label"><span class="text-trim">{{ t(`vars.names.${box.key}`) }}</span></span>
          </div>
        </div>

        <p v-if="stage === 6" class="sentence">
          <span class="sentence-chip" style="background: var(--coral);">Momo</span>{{ t('vars.sentence.middle') }}<span class="sentence-chip" style="background: var(--sky);">5</span>{{ t('vars.sentence.after') }}
        </p>
      </div>

      <!-- 7: text in, number out -->
      <div v-else-if="scene === 'convert'" class="scene scene-convert">
        <div class="convert-row">
          <div class="vbox">
            <span class="vbox-type" style="background: var(--coral);">
              <span class="text-trim type-code">str</span>
              <span class="text-trim type-label">{{ t('vars.types.str') }}</span>
            </span>
            <div class="vbox-art">
              <ArtSprite name="box" color="coral" accent="text-muted" :size="96" class="sprite-fill" />
              <span class="vbox-value"><span class="text-trim">"5"</span></span>
            </div>
            <span class="vbox-label"><span class="text-trim">{{ t('vars.names.input') }}</span></span>
          </div>

          <div class="convert-arrow">
            <span class="convert-fn"><span class="text-trim">int()</span></span>
            <svg viewBox="0 0 48 16" fill="none" stroke="var(--text)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 8 H44 M36 2 L44 8 L36 14" />
            </svg>
          </div>

          <div class="vbox convert-result">
            <span class="vbox-type" style="background: var(--sky);">
              <span class="text-trim type-code">int</span>
              <span class="text-trim type-label">{{ t('vars.types.int') }}</span>
            </span>
            <div class="vbox-art">
              <ArtSprite name="box" color="sky" accent="text-muted" :size="96" class="sprite-fill" />
              <span class="vbox-value"><span class="text-trim">5</span></span>
            </div>
            <span class="vbox-label"><span class="text-trim">{{ t('vars.names.age') }}</span></span>
          </div>
        </div>

        <div class="convert-checks">
          <div class="check is-bad">
            <code class="check-code">{{ t('vars.convert.wrong') }}</code>
            <span class="check-result"><span class="text-trim">✗ {{ t('vars.convert.wrongResult') }}</span></span>
          </div>
          <div class="check is-good">
            <code class="check-code">{{ t('vars.convert.right') }}</code>
            <span class="check-result"><span class="text-trim">✓ {{ t('vars.convert.rightResult') }}</span></span>
          </div>
        </div>
      </div>

      <!-- 8: names -->
      <ul v-else class="scene scene-names">
        <li
          v-for="rule in rules"
          :key="rule.name"
          class="name-rule"
          :class="rule.ok === true ? 'is-ok' : rule.ok === false ? 'is-bad' : 'is-warn'"
        >
          <span class="name-mark"><span class="text-trim">{{ rule.ok === true ? '✓' : rule.ok === false ? '✗' : '!' }}</span></span>
          <span class="name-text">
            <code class="name-code">{{ rule.name }}</code>
            <span class="name-why">{{ rule.why }}</span>
          </span>
        </li>
      </ul>
    </section>

    <!-- Code and output -->
    <section class="vars-code">
      <CodePanel :code="current.code" variant="python" :filename="t('vars.file')" :focus="current.focus" />

      <div class="vars-output">
        <span class="output-label">{{ t('vars.output') }}</span>
        <template v-if="current.output.length">
          <span
            v-for="(line, index) in current.output"
            :key="`${stage}-${index}`"
            class="out-line"
            :class="{ 'is-new': index >= current.outputFrom }"
          >{{ line }}</span>
        </template>
        <span v-else class="out-empty">{{ t('vars.noOutput') }}</span>
      </div>
    </section>

    <!-- Takeaway -->
    <p class="vars-note">
      <span class="note-rail" aria-hidden="true"></span>
      <span class="note-text">
        <template v-for="(bit, index) in segments(current.note)" :key="index">
          <code v-if="bit.code" class="inline-code">{{ bit.part }}</code>
          <template v-else>{{ bit.part }}</template>
        </template>
      </span>
    </p>
  </div>
</template>

<style scoped>
.vars {
  background: var(--bg);
}

/* ─── Header ─────────────────────────────────────────────────────────── */
.vars-head {
  position: absolute;
  top: 7vh;
  left: 6vw;
  right: 6vw;
}

.vars-progress {
  display: flex;
  align-items: center;
  gap: 1.4vh;
  margin-bottom: 1.8vh;
}

.vars-eyebrow,
.vars-count {
  font-size: clamp(0.65rem, 1.35vh, 0.9rem);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.vars-dots {
  display: flex;
  align-items: center;
  gap: 0.6vh;
}

.vars-dot {
  width: 1vh;
  height: 1vh;
  border-radius: 999px;
  background: var(--border);
}
.vars-dot.is-done {
  background: var(--text-dim);
}
.vars-dot.is-now {
  width: 2.8vh;
  background: var(--text);
}

.vars-headline {
  font-size: clamp(1.6rem, 5.2vh, 3.8rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--text);
}

.inline-code {
  padding: 0 0.2em;
  border-radius: 0.25em;
  background: var(--bg-off);
  color: var(--lavender);
}

/* ─── Scene card ─────────────────────────────────────────────────────── */
.vars-scene {
  position: absolute;
  top: 24vh;
  left: 6vw;
  width: 44vw;
  height: 50vh;
  overflow: hidden;
  border-radius: 2.4vh;
  background: var(--bg-off);
}

.scene {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sprite-fill {
  width: 100%;
  height: 100%;
}

/* A box: optional type badge, the box itself with its value, the name tag. */
.vbox {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2vh;
}

.vbox-art {
  position: relative;
  width: 13vh;
  aspect-ratio: 1;
  border-radius: 1.6vh;
}

.vbox-value {
  position: absolute;
  left: 50%;
  top: 64%;
  transform: translate(-50%, -50%);
  padding: calc(0.5vh + 0.3em) 1vh;
  border-radius: 1vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.75rem, 1.9vh, 1.3rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
}

.vbox-label {
  padding: calc(0.4vh + 0.3em) 1.2vh;
  border-radius: 999px;
  background: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.7rem, 1.7vh, 1.15rem);
  font-weight: 800;
  color: var(--bg);
}

.vbox-type {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5vh;
  padding: 0.8vh 1.1vh;
  border-radius: 1vh;
  color: #FFFFFF;
}
.type-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.7rem, 1.6vh, 1.1rem);
  font-weight: 900;
}
.type-label {
  font-size: clamp(0.55rem, 1.2vh, 0.85rem);
  font-weight: 700;
  white-space: nowrap;
}

/* ─── 1–3: one box ───────────────────────────────────────────────────── */
.scene-hello {
  display: grid;
  place-items: center;
}
.vbox-big .vbox-art {
  width: 26vh;
}
.vbox-big .vbox-value {
  font-size: clamp(0.9rem, 2.4vh, 1.7rem);
}
.value-momo {
  opacity: 0;
}

/* ─── 4–6: types ─────────────────────────────────────────────────────── */
.type-row {
  position: absolute;
  top: 7vh;
  left: 2vw;
  right: 2vw;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1vw;
}

.age-4,
.age-5 {
  opacity: 0;
}

.plus-one {
  position: absolute;
  top: -1.4vh;
  right: -1vh;
  padding: calc(0.3vh + 0.3em) 0.9vh;
  border-radius: 999px;
  background: var(--mint);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.7rem, 1.6vh, 1.1rem);
  font-weight: 900;
  color: #FFFFFF;
  opacity: 0;
}

.sentence {
  position: absolute;
  left: 2vw;
  right: 2vw;
  bottom: 3.5vh;
  padding: 1.8vh 2vh;
  border-radius: 1.6vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.95rem, 2.5vh, 1.7rem);
  font-weight: 800;
  text-align: center;
  color: var(--text);
}
.sentence-chip {
  display: inline-block;
  padding: 0 0.4em;
  border-radius: 0.35em;
  color: #FFFFFF;
}

/* ─── 7: convert ─────────────────────────────────────────────────────── */
.convert-row {
  position: absolute;
  top: 4vh;
  left: 2vw;
  right: 2vw;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2vw;
}

.convert-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8vh;
}
.convert-arrow svg {
  width: 7vh;
  height: 2.4vh;
}
.convert-fn {
  padding: calc(0.4vh + 0.3em) 1vh;
  border-radius: 999px;
  background: var(--lavender);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.75rem, 1.8vh, 1.2rem);
  font-weight: 800;
  color: #FFFFFF;
}

.convert-checks {
  position: absolute;
  left: 2vw;
  right: 2vw;
  bottom: 3vh;
  display: grid;
  gap: 1.2vh;
}

.check {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1vw;
  padding: 1.1vh 1.6vh;
  border-radius: 1.2vh;
  background: var(--bg);
}
.check-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.8rem, 2vh, 1.35rem);
  font-weight: 700;
  color: var(--text);
}
.check-result {
  padding: calc(0.3vh + 0.3em) 1vh;
  border-radius: 999px;
  font-size: clamp(0.7rem, 1.6vh, 1.1rem);
  font-weight: 800;
  color: #FFFFFF;
  white-space: nowrap;
}
.is-bad .check-result {
  background: var(--coral);
}
.is-good .check-result {
  background: var(--mint);
}

/* ─── 8: names ───────────────────────────────────────────────────────── */
.scene-names {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-content: center;
  gap: 2.2vh 1.6vw;
  padding: 3vh 2vw;
}

.name-rule {
  display: flex;
  align-items: center;
  gap: 1vw;
  min-width: 0;
}

.name-mark {
  display: grid;
  place-items: center;
  flex: none;
  width: 4.2vh;
  height: 4.2vh;
  border-radius: 999px;
  font-size: clamp(0.8rem, 2vh, 1.3rem);
  font-weight: 900;
  color: #FFFFFF;
}
.is-ok .name-mark {
  background: var(--mint);
}
.is-bad .name-mark {
  background: var(--coral);
}
.is-warn .name-mark {
  background: var(--sun);
  color: var(--text);
}

.name-text {
  display: flex;
  flex-direction: column;
  gap: 0.3vh;
  min-width: 0;
}
.name-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.85rem, 2.2vh, 1.5rem);
  font-weight: 800;
  color: var(--text);
}
.is-bad .name-code {
  text-decoration: line-through;
  text-decoration-color: var(--coral);
}
.name-why {
  font-size: clamp(0.65rem, 1.5vh, 1rem);
  font-weight: 600;
  color: var(--text-dim);
}

/* ─── Code and output ────────────────────────────────────────────────── */
.vars-code {
  position: absolute;
  top: 24vh;
  left: 54vw;
  width: 40vw;
}

.vars-output {
  display: flex;
  flex-direction: column;
  gap: 0.8vh;
  margin-top: 1.8vh;
  padding: 1.4vh 2vh;
  border-radius: 2vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
}

.output-label {
  font-size: clamp(0.6rem, 1.3vh, 0.85rem);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.out-line {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.85rem, 2vh, 1.35rem);
  color: var(--text);
  white-space: pre;
}

.out-empty {
  font-size: clamp(0.8rem, 1.8vh, 1.2rem);
  font-style: italic;
  color: var(--text-muted);
}

/* On a 4:3 projector the longest line (the input() prompt) needs more room than the picture. */
@media (max-aspect-ratio: 3/2) {
  .vars-scene {
    width: 38vw;
  }
  .vars-code {
    left: 47vw;
    width: 47vw;
  }
  /* Four boxes share less width, so they shrink a little. */
  .type-row .vbox-art {
    width: 11vh;
  }
}

/* ─── Takeaway ───────────────────────────────────────────────────────── */
.vars-note {
  position: absolute;
  top: 78vh;
  left: 6vw;
  right: 6vw;
  display: flex;
  gap: 1.4vw;
  font-size: clamp(0.9rem, 2.3vh, 1.6rem);
  line-height: 1.5;
  color: var(--text-dim);
}
.note-rail {
  flex: none;
  width: 0.6vh;
  border-radius: 999px;
  background: var(--coral);
}

/* ─── What changes on each stage ─────────────────────────────────────── */
/* Headline and takeaway answer the press; stage 1 has only the slide entrance. */
.vars-headline,
.note-text {
  animation: appear 0.35s ease both;
}
.stage-1 .vars-headline,
.stage-1 .note-text {
  animation: none;
}

.out-line.is-new {
  animation: appear 0.3s ease 0.45s both;
}

/* 1: the value drops into the box. */
.stage-1 .value-hello {
  animation: drop 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both;
}

/* 2: reading the box rings it once. */
.stage-2 .vbox-big .vbox-art {
  animation: ring 0.9s ease 0.25s both;
}

/* 3: the old value lifts out, the new one drops in. */
.stage-3 .value-hello {
  animation: lift-out 0.4s ease-in 0.35s both;
}
.stage-3 .value-momo {
  animation: drop 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.8s both;
}

/* 4, 7, 8: a new picture. */
.stage-4 .scene-types,
.stage-7 .scene-convert,
.stage-8 .scene-names {
  animation: appear 0.4s ease both;
}

/* 5: everything else steps back, the age counts up twice. */
.stage-5 .vbox:not(.vb-age) {
  animation: dim 0.35s ease 0.15s both;
}
.stage-5 .age-3 {
  animation: lift-out 0.35s ease-in 0.6s both;
}
.stage-5 .age-4 {
  animation:
    drop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.75s both,
    lift-out 0.35s ease-in 1.55s forwards;
}
.stage-5 .age-5 {
  animation: drop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 1.7s both;
}
.stage-5 .plus-a {
  animation: plus 0.8s ease 0.55s both;
}
.stage-5 .plus-b {
  animation: plus 0.8s ease 1.5s both;
}

/* 6: name and age come back and light up; the sentence is built from them. */
.stage-6 .age-3,
.stage-6 .age-4 {
  opacity: 0;
}
.stage-6 .age-5 {
  opacity: 1;
}
.stage-6 .vb-weight,
.stage-6 .vb-hungry {
  opacity: 0.35;
}
.stage-6 .vb-name {
  animation: undim 0.35s ease 0.1s both;
}
/* Lit by their name tag and value, not a ring, so neighbours never overlap. */
.stage-6 .vb-name .vbox-label,
.stage-6 .vb-age .vbox-label {
  background: var(--lavender);
}
.stage-6 .vb-name .vbox-value,
.stage-6 .vb-age .vbox-value {
  border-color: var(--lavender);
  box-shadow: 0 0 0 2px var(--lavender);
}
.stage-6 .sentence {
  animation: appear 0.4s ease 0.4s both;
}

/* 7: the conversion lands after the text box. */
.stage-7 .convert-arrow,
.stage-7 .convert-result,
.stage-7 .convert-checks {
  animation: appear 0.4s ease 0.6s both;
}

@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes drop {
  from { opacity: 0; transform: translate(-50%, -160%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
}
@keyframes lift-out {
  from { opacity: 1; transform: translate(-50%, -50%); }
  to { opacity: 0; transform: translate(-50%, -170%); }
}
@keyframes ring {
  0% { outline: 3px solid transparent; outline-offset: 0; }
  35% { outline: 3px solid var(--lavender); outline-offset: 0.8vh; }
  100% { outline: 3px solid transparent; outline-offset: 1.8vh; }
}
@keyframes dim {
  from { opacity: 1; }
  to { opacity: 0.35; }
}
@keyframes undim {
  from { opacity: 0.35; }
  to { opacity: 1; }
}
@keyframes plus {
  0% { opacity: 0; transform: translateY(0) scale(0.6); }
  25% { opacity: 1; transform: translateY(-0.4vh) scale(1); }
  70% { opacity: 1; transform: translateY(-1.4vh) scale(1); }
  100% { opacity: 0; transform: translateY(-2.4vh) scale(1); }
}
</style>
