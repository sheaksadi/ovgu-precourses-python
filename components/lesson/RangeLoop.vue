<script setup lang="ts">
/**
 * range lesson: "Zählen ohne Liste". Auto-imported as `<LessonRangeLoop :stage="1" />`.
 *
 * Momo hops along five fence posts, one pass per post (PRE-0080 and its three
 * sub-slides):
 *
 *   1. five jumps, and we type the list [0, 1, 2, 3, 4] ourselves
 *   2. range(5) makes that list: 0 to 4, the 5 is not included
 *   3. range(2, 11, 2): the post numbers flip to 2, 4, 6, 8, 10
 *   4. range(1, 6) and i * 7: a bar grows over every post — the 7 times table
 *
 * The posts never move; only their numbers change, so each stage reads as the
 * same fence counted differently. Stops are 0.8 s apart and every beat is timed
 * from them (`--t`). Words come from `loops.range.*` in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3 | 4

interface Stage {
  headline: string
  note: string
  tally: string
  banner: string
  code: string
  focus: number[]
  output: string[]
  outputFrom: number
}

const props = defineProps<{ stage: StageNumber }>()
const { t, tm } = useI18n()

const stages = computed(() => tm<Stage[]>('loops.range.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const previous = computed(() => stages.value[Math.max(props.stage - 2, 0)]!)

const NUMBERS: Record<StageNumber, number[]> = {
  1: [0, 1, 2, 3, 4],
  2: [0, 1, 2, 3, 4],
  3: [2, 4, 6, 8, 10],
  4: [1, 2, 3, 4, 5],
}
const TIMES = 7
const STEP = 0.8

/** Momo reaches the first post: after fading in on stage 1, after sliding back on the others. */
const start = computed(() => (props.stage === 1 ? 0.6 : 1))
const at = (i: number) => start.value + i * STEP

const posts = computed(() => NUMBERS[props.stage].map((value, i) => ({
  i,
  value,
  before: NUMBERS[Math.max(props.stage - 1, 1) as StageNumber][i]!,
  product: value * TIMES,
})))

const outputDelays = computed(() => posts.value.map(post => at(post.i) + 0.15))
const bannerChanges = computed(() => props.stage > 1 && previous.value.banner !== current.value.banner)
</script>

<template>
  <LessonShell
    :eyebrow="t('loops.range.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :file="t('loops.range.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    :output-label="t('loops.range.output')"
    :no-output="t('loops.range.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`" :style="{ '--d': `${start}s` }">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- What the loop walks over -->
      <span class="banner" :class="{ 'is-changing': bannerChanges }">
        <span v-if="bannerChanges" class="banner-face banner-old">{{ previous.banner }}</span>
        <span class="banner-face banner-new">{{ current.banner }}</span>
      </span>

      <!-- 4: the times table as bars -->
      <template v-if="stage === 4">
        <span
          v-for="post in posts"
          :key="`bar-${post.i}`"
          class="bar"
          :style="{ '--i': post.i, '--h': post.product / (TIMES * 5), '--t': `${at(post.i) + 0.1}s` }"
        >
          <span class="bar-value"><span class="text-trim">{{ post.product }}</span></span>
        </span>
      </template>

      <!-- The fence -->
      <span class="ground"></span>
      <div
        v-for="post in posts"
        :key="post.i"
        class="post"
        :class="{ 'is-changing': post.before !== post.value && stage > 1 }"
        :style="{ '--i': post.i, '--t': `${at(post.i)}s` }"
      >
        <span class="post-label">
          <span v-if="post.before !== post.value && stage > 1" class="label-face label-old">{{ post.before }}</span>
          <span class="label-face label-new">{{ post.value }}</span>
        </span>
        <span class="post-wood"></span>
      </div>

      <!-- 2–3: the stop value range never reaches -->
      <div v-if="stage === 2 || stage === 3" class="ghost">
        <span class="ghost-label"><span class="text-trim">5</span></span>
        <span class="ghost-wood"></span>
        <span class="ghost-note"><span class="text-trim">✗ {{ t('loops.range.notIncluded') }}</span></span>
      </div>

      <!-- Momo -->
      <div class="walker">
        <div class="hop">
          <ArtSprite name="cat-stand" color="coral" accent="rose" :size="96" class="walker-art" />
        </div>
      </div>
    </div>
  </LessonShell>
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
  /* Post centres: 10% + i × 17%, leaving room for the ghost post at 93%. */
  --x0: 10%;
  --pitch: 17%;
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

/* ─── Banner ─────────────────────────────────────────────────────────── */
.banner {
  position: absolute;
  top: 6.5vh;
  left: 50%;
  translate: -50% 0;
  display: inline-grid;
  justify-items: center;
}
.banner-face {
  grid-area: 1 / 1;
  padding: 0.9vh 1.8vh;
  border-radius: 1.2vh;
  background: var(--bg);
  border: 2px solid var(--lavender);
  font-family: var(--font-code);
  font-size: clamp(0.85rem, 2.6vh, 1.8rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
}
.banner.is-changing .banner-old {
  animation: flip-out 0.3s ease-in 0.2s both;
}
.banner.is-changing .banner-new {
  animation: flip-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
}

/* ─── Fence ──────────────────────────────────────────────────────────── */
.ground {
  position: absolute;
  left: 3%;
  right: 3%;
  top: 43vh;
  height: 0.8vh;
  border-radius: 999px;
  background: var(--border);
}

.post {
  position: absolute;
  top: 29vh;
  left: calc(var(--x0) + var(--i) * var(--pitch));
  width: 5vh;
  height: 14.4vh;
  translate: -50% 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8vh;
}
.post-label {
  display: inline-grid;
  justify-items: center;
  border-radius: 999px;
}
.label-face {
  grid-area: 1 / 1;
  min-width: 4vh;
  padding: calc(0.4vh + 0.3em) 0.9vh;
  border-radius: 999px;
  background: var(--lavender);
  font-family: var(--font-code);
  font-size: clamp(0.65rem, 1.8vh, 1.2rem);
  font-weight: 800;
  text-align: center;
  color: #FFFFFF;
}
.post-wood {
  flex: 1;
  width: 2.2vh;
  border-radius: 0.8vh 0.8vh 0 0;
  background: var(--sun);
  border: 2px solid var(--text);
  border-bottom: none;
}

.post.is-changing .label-old {
  animation: flip-out 0.25s ease-in both;
  animation-delay: calc(0.25s + var(--i) * 0.08s);
}
.post.is-changing .label-new {
  animation: flip-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(0.45s + var(--i) * 0.08s);
}

.ghost {
  position: absolute;
  top: 29vh;
  left: 93%;
  width: 5vh;
  height: 14.4vh;
  translate: -50% 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8vh;
  opacity: 0;
}
.ghost-label {
  min-width: 4vh;
  padding: calc(0.4vh + 0.3em) 0.9vh;
  border-radius: 999px;
  border: 2px dashed var(--text-muted);
  font-family: var(--font-code);
  font-size: clamp(0.65rem, 1.8vh, 1.2rem);
  font-weight: 800;
  text-align: center;
  color: var(--text-muted);
}
.ghost-wood {
  flex: 1;
  width: 2.2vh;
  border-radius: 0.8vh 0.8vh 0 0;
  border: 2px dashed var(--text-muted);
  border-bottom: none;
}
.ghost-note {
  position: absolute;
  top: -4.4vh;
  right: -1vh;
  padding: calc(0.3vh + 0.3em) 0.9vh;
  border-radius: 999px;
  background: var(--coral);
  font-size: clamp(0.5rem, 1.3vh, 0.9rem);
  font-weight: 800;
  white-space: nowrap;
  color: #FFFFFF;
}

/* ─── Bars (4) ───────────────────────────────────────────────────────── */
.bar {
  position: absolute;
  bottom: calc(100% - 27vh);
  left: calc(var(--x0) + var(--i) * var(--pitch));
  width: 7%;
  height: calc(var(--h) * 14vh);
  translate: -50% 0;
  border-radius: 0.8vh 0.8vh 0 0;
  background: color-mix(in srgb, var(--mint) 75%, var(--bg));
  border: 2px solid var(--text);
  transform-origin: bottom center;
  animation: grow-bar 0.45s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.bar-value {
  position: absolute;
  bottom: calc(100% + 0.5vh);
  left: 50%;
  translate: -50% 0;
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.6vh, 1.1rem);
  font-weight: 800;
  color: var(--text);
  animation: pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--t) + 0.3s) both;
}

/* ─── Walker ─────────────────────────────────────────────────────────── */
.walker {
  position: absolute;
  top: 34.6vh;
  left: calc(var(--x0) + 4 * var(--pitch));
  z-index: 2;
  width: 8.5vh;
  height: 8.5vh;
  translate: -50% 0;
}
.hop,
.walker-art {
  width: 100%;
  height: 100%;
}

/* ═══ Stages ═══════════════════════════════════════════════════════════ */

/* Stage 1 fades Momo in at the first post; the others slide her back from the last. */
.stage-1 .walker {
  animation:
    appear 0.3s ease 0.2s both,
    hop5 3.2s linear var(--d) both;
}
.stage-2 .walker,
.stage-3 .walker,
.stage-4 .walker {
  animation: rehop5 4.2s linear both;
}
.hop {
  animation: arc 0.8s ease-in-out var(--d) 4;
}
.post-label {
  animation: ring 0.7s ease var(--t) both;
}

.stage-2 .ghost {
  animation: rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both;
}
.stage-3 .ghost {
  opacity: 1;
  animation: vanish 0.3s ease both;
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
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes rise {
  from { opacity: 0; transform: translateY(1.4vh); }
  to { opacity: 1; transform: none; }
}
@keyframes flip-out {
  from { opacity: 1; transform: none; }
  to { opacity: 0; transform: translateY(-1vh) rotateX(70deg); }
}
@keyframes flip-in {
  from { opacity: 0; transform: translateY(1vh) rotateX(-70deg); }
  to { opacity: 1; transform: none; }
}
@keyframes grow-bar {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}
@keyframes ring {
  0% { box-shadow: 0 0 0 0 transparent; }
  35% { box-shadow: 0 0 0 0.6vh color-mix(in srgb, var(--lavender) 45%, transparent); }
  100% { box-shadow: 0 0 0 1.2vh transparent; }
}
/* Hold half a beat on the post, then jump in the other half. */
@keyframes arc {
  0%, 50% { transform: translateY(0); }
  75% { transform: translateY(-6vh); }
  100% { transform: translateY(0); }
}
@keyframes hop5 {
  0%, 12.5% { left: calc(var(--x0)); }
  25%, 37.5% { left: calc(var(--x0) + var(--pitch)); }
  50%, 62.5% { left: calc(var(--x0) + 2 * var(--pitch)); }
  75%, 87.5% { left: calc(var(--x0) + 3 * var(--pitch)); }
  100% { left: calc(var(--x0) + 4 * var(--pitch)); }
}
/* Slide back to the first post, then the same hops, arriving at 1 s + i × 0.8 s. */
@keyframes rehop5 {
  0% { left: calc(var(--x0) + 4 * var(--pitch)); }
  14.29%, 33.33% { left: calc(var(--x0)); }
  42.86%, 52.38% { left: calc(var(--x0) + var(--pitch)); }
  61.9%, 71.43% { left: calc(var(--x0) + 2 * var(--pitch)); }
  80.95%, 90.48% { left: calc(var(--x0) + 3 * var(--pitch)); }
  100% { left: calc(var(--x0) + 4 * var(--pitch)); }
}
</style>
