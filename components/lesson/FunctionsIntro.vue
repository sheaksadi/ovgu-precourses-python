<script setup lang="ts">
/**
 * Functions intro: "Zu viel Code". Auto-imported as `<LessonFunctionsIntro :stage="1" />`.
 *
 * Four slides (PRE-0095 and its three sub-slides):
 *
 *   1. the same two lines for Momo, Bello and Hoppel: the code gets copied
 *   2. a change has to go into every copy, and one copy gets forgotten
 *   3. the idea: write the recipe once in a book, then just call it three times
 *   4. Python: `def begruessen(tier, futter):` and three calls, each one
 *      carrying its values up into the book
 *
 * Each stage opens on the previous stage's last frame. Words come from
 * `functions.intro.*` in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import type { SpriteName } from '~/utils/sprites'

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

const stages = computed(() => tm<Stage[]>('functions.intro.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const animals = computed(() => tm<Array<{ name: string, food: string }>>('functions.intro.animals'))
const recipe = computed(() => t('functions.intro.recipe'))

const CAST: Array<{ sprite: SpriteName, color: string, accent: string }> = [
  { sprite: 'cat', color: 'coral', accent: 'rose' },
  { sprite: 'dog', color: 'sun', accent: 'text' },
  { sprite: 'bunny', color: 'lavender', accent: 'rose' },
]

const callAt = (k: number) => 0.9 + k * 1.2

const outputDelays = computed(() => (props.stage === 4 ? [callAt(0) + 0.6, callAt(0) + 0.8, callAt(1) + 0.6] : undefined))
</script>

<template>
  <LessonShell
    :eyebrow="t('functions.intro.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :variant="current.variant ?? 'python'"
    :file="t('functions.intro.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    dense
    :output-label="t('functions.intro.output')"
    :no-output="t('functions.intro.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- The recipe book -->
      <div class="book">
        <ArtSprite name="book" color="sky" accent="sun" :size="96" class="book-art" />
        <code class="book-label">{{ stage === 4 ? `def ${recipe}` : recipe }}</code>
      </div>

      <div v-for="(animal, k) in animals" :key="k" class="column" :style="{ '--k': k, '--t': `${callAt(k)}s` }">
        <ArtSprite :name="CAST[k]!.sprite" :color="CAST[k]!.color" :accent="CAST[k]!.accent" :size="96" class="animal" />
        <span class="animal-name"><span class="text-trim">{{ animal.name }}</span></span>

        <!-- A copy of the two lines -->
        <div class="copy" :class="{ 'is-forgotten': k === 2 }">
          <span class="copy-line"><i></i><i></i></span>
          <span class="copy-line"><i></i><i></i><i></i></span>
          <span class="copy-mark"><span class="text-trim">{{ k === 2 ? t('functions.intro.forgotten') : '✓' }}</span></span>
        </div>

        <!-- The call that replaces it -->
        <code class="call">{{ recipe }}(<b>{{ animal.name }}</b>, <b>{{ animal.food }}</b>)</code>
        <span class="ball">
          <ArtSprite name="ball" color="mint" accent="text" :size="48" class="ball-art" />
        </span>
      </div>
    </div>
  </LessonShell>
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
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
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}

/* ─── Book ───────────────────────────────────────────────────────────── */
.book {
  position: absolute;
  top: 5.5vh;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 1vh;
  translate: -50% 0;
  opacity: 0;
}
.book-art {
  width: 10vh;
  height: 10vh;
}
.book-label {
  padding: calc(0.35vh + 0.3em) 1.1vh;
  border-radius: 999px;
  background: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
}

/* ─── Columns ────────────────────────────────────────────────────────── */
.column {
  position: absolute;
  top: 17vh;
  left: calc(17% + var(--k) * 33%);
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  translate: -50% 0;
}
.animal {
  width: 10vh;
  height: 10vh;
}
.animal-name {
  margin-top: 0.4vh;
  padding: calc(0.25vh + 0.3em) 0.9vh;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.55rem, 1.4vh, 0.95rem);
  font-weight: 800;
  color: var(--text);
}

.copy {
  position: relative;
  margin-top: 2vh;
  width: 86%;
  display: flex;
  flex-direction: column;
  gap: 1vh;
  padding: 1.4vh 1.2vh;
  border-radius: 1.2vh;
  background: var(--bg);
  border: 2px solid var(--coral);
}
.copy-line {
  display: flex;
  gap: 0.6vh;
}
.copy-line i {
  height: 1.1vh;
  border-radius: 999px;
  background: color-mix(in srgb, var(--coral) 55%, var(--bg));
}
.copy-line i:nth-child(1) { width: 30%; }
.copy-line i:nth-child(2) { width: 45%; }
.copy-line i:nth-child(3) { width: 20%; }
.copy-mark {
  position: absolute;
  top: -1.6vh;
  right: -1vh;
  padding: calc(0.25vh + 0.3em) 0.8vh;
  border-radius: 999px;
  background: var(--mint);
  font-size: clamp(0.5rem, 1.3vh, 0.9rem);
  font-weight: 800;
  white-space: nowrap;
  color: #FFFFFF;
  opacity: 0;
}
.copy.is-forgotten .copy-mark {
  background: var(--coral);
}

/* Centred under the animal; long calls wrap after the comma instead of running into the next column. */
.call {
  position: absolute;
  top: calc(10vh + 5vh);
  left: 50%;
  translate: -50% 0;
  width: max-content;
  max-width: 100%;
  text-align: center;
  margin-top: 2vh;
  padding: calc(0.35vh + 0.3em) 0.9vh;
  border-radius: 1vh;
  background: var(--bg);
  border: 2px solid var(--sky);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.5rem, 1.3vh, 0.9rem);
  font-weight: 700;
  white-space: normal;
  color: var(--text);
  opacity: 0;
}
.call b {
  color: var(--coral);
}

.ball {
  position: absolute;
  top: 16vh;
  width: 3.4vh;
  height: 3.4vh;
  opacity: 0;
}
.ball-art {
  width: 100%;
  height: 100%;
}

/* ═══ Stages ═══════════════════════════════════════════════════════════ */

/* 1: the first copy appears, then it is duplicated to the right. */
.stage-1 .copy {
  animation: copy-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) calc(0.4s + var(--k) * 0.6s) both;
}

/* 2: two copies get the change, the third is missed. */
.stage-2 .copy:not(.is-forgotten) .copy-line:last-child i {
  animation: rewrite 0.5s ease calc(0.5s + var(--k) * 0.7s) both;
}
.stage-2 .copy-mark {
  animation: pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) calc(0.9s + var(--k) * 0.7s) both;
}
.stage-2 .copy.is-forgotten {
  animation: shake 0.45s ease 2.5s both;
}
.stage-3 .copy:not(.is-forgotten) .copy-line:last-child i {
  background: color-mix(in srgb, var(--mint) 65%, var(--bg));
}
.stage-3 .copy-mark {
  opacity: 1;
  animation: vanish 0.2s ease both;
}

/* 3: every copy flies into the book; a call takes its place. */
.stage-3 .book {
  animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
}
.stage-3 .copy {
  animation: into-book 0.6s cubic-bezier(0.55, 0, 0.45, 1) calc(0.6s + var(--k) * 0.2s) both;
}
.stage-3 .call {
  animation: rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) calc(1.5s + var(--k) * 0.25s) both;
}

/* 4: the book is a def; each call sends its values up into it, one after another. */
.stage-4 .book {
  opacity: 1;
}
.stage-4 .copy {
  opacity: 0;
}
.stage-4 .call {
  opacity: 1;
  animation: glow 0.8s ease var(--t) both;
}
.stage-4 .ball {
  animation: to-book 0.6s cubic-bezier(0.45, 0, 0.55, 1) calc(var(--t) + 0.1s) both;
}
.stage-4 .book-art {
  animation: bump 0.35s ease calc(0.9s + 0.6s) both, bump 0.35s ease calc(2.1s + 0.6s) both, bump 0.35s ease calc(3.3s + 0.6s) both;
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
@keyframes copy-in {
  from { opacity: 0; transform: translateX(-6vh) scale(0.85); }
  to { opacity: 1; transform: none; }
}
@keyframes rewrite {
  0% { background: color-mix(in srgb, var(--coral) 55%, var(--bg)); }
  40% { background: var(--sun); }
  100% { background: color-mix(in srgb, var(--mint) 65%, var(--bg)); }
}
@keyframes shake {
  0%, 100% { transform: none; }
  20% { transform: translateX(-1vh); }
  40% { transform: translateX(1vh); }
  60% { transform: translateX(-0.6vh); }
  80% { transform: translateX(0.6vh); }
}
@keyframes into-book {
  from { opacity: 1; transform: none; }
  to { opacity: 0; transform: translate(calc((1 - var(--k)) * 16vw), -18vh) scale(0.2); }
}
@keyframes glow {
  0% { box-shadow: 0 0 0 0 transparent; }
  30% { box-shadow: 0 0 0 0.6vh color-mix(in srgb, var(--sky) 45%, transparent); }
  100% { box-shadow: 0 0 0 0 transparent; }
}
@keyframes to-book {
  0% { opacity: 0; transform: none; }
  15% { opacity: 1; }
  100% { opacity: 0; transform: translate(calc((1 - var(--k)) * 14vw), -12vh) scale(0.6); }
}
@keyframes bump {
  0%, 100% { transform: none; }
  50% { transform: scale(1.15) rotate(-6deg); }
}
</style>
