<script setup lang="ts">
/**
 * If/else lesson scene: "Kommt Momo ins Haus?". Auto-imported as
 * `<LessonDoorProblem :stage="1" />`.
 *
 * One scene, four stages, one slide per stage (PRE-0034 and its three
 * sub-slides). The presenter steps through it with plain "next", so every
 * screen in the room stays in sync without any step protocol.
 *
 *   1. Problem      — Momo stands at her door. Does she have the key?
 *   2. Lösen        — the scene splits into both cases and plays them out.
 *   3. Aufschreiben — the cases move up and the pseudo-code arrives.
 *   4. Python       — the pictures clear, the pseudo-code moves to the top and
 *                     the Python version lands below it.
 *
 * Each stage opens on the previous stage's last frame, so the cut between
 * slides is invisible. The step row only shows the steps reached so far. All
 * motion is CSS with `animation-fill-mode: both`, so reduced motion lands
 * straight on the final frame. Hovering a word in the code lights up its part
 * of the picture, and hovering a lane lights up its keyword.
 *
 * Every word on screen comes from `door.*` in `locales/`.
 */
import { computed, onMounted } from 'vue'
import { useCodeLink } from '~/composables/useCodeLink'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{ stage: 1 | 2 | 3 | 4 }>()

const link = useCodeLink()
const { t, tm } = useI18n()
onMounted(() => link.clear())

/** Steps reached so far: the row grows by one step per stage. */
const steps = computed(() => tm<string[]>('door.steps').slice(0, props.stage))
const code = computed(() => t('door.pseudo'))
const python = computed(() => t('door.python'))

/** The pseudo-code word for each part of the picture, in the current language. */
const words = computed(() => tm<Record<'momo' | 'key' | 'house' | 'door', string>>('door.words'))
const lit = (key: string) => link.isActive(key)
const litWord = (part: 'momo' | 'key' | 'house' | 'door') => lit(`word:${words.value[part]}`)
</script>

<template>
  <div class="door-lesson relative w-full h-full overflow-hidden" :class="`stage-${stage}`" @click.self="link.clear()">
    <header class="lesson-head">
      <ol class="steps">
        <li
          v-for="(label, index) in steps"
          :key="index"
          class="step"
          :class="{
            'step-done': index + 1 < stage,
            'step-now': index + 1 === stage,
            'step-new': index + 1 === stage && stage > 1,
          }"
        >
          <span class="step-dot">{{ index + 1 }}</span>
          <span class="step-label">{{ label }}</span>
        </li>
      </ol>
      <h2 class="lesson-title">{{ t('door.title') }}</h2>
    </header>

    <div class="lanes">
      <!-- Case 1: with the key -->
      <section
        class="lane lane-yes"
        :class="{ 'lane-lit': lit('branch') }"
        @mouseenter="link.hover('branch')"
        @mouseleave="link.unhover()"
      >
        <div class="lane-label">
          <span class="chip">
            <span class="chip-face chip-q">{{ t('door.question') }}</span>
            <span class="chip-face chip-case">{{ t('door.case1') }}</span>
            <span class="chip-face chip-code">if</span>
          </span>
          <span class="cond">
            <span class="cond-face cond-q">{{ t('door.hasKey') }}</span>
            <span class="cond-face cond-a">{{ t('door.withKey') }}</span>
          </span>
        </div>

        <div class="track">
          <span class="road"></span>
          <div class="home" :class="{ 'is-lit': litWord('house') }">
            <ArtSprite name="house" color="sky" accent="coral" :size="96" class="sprite-fill" />
            <span class="door-light"></span>
            <span class="door-mark" :class="{ 'is-lit': litWord('door') }"></span>
          </div>
          <div class="walker walker-yes" :class="{ 'is-lit': litWord('momo') }">
            <div class="bob">
              <ArtSprite name="cat-stand" color="coral" accent="rose" :size="96" class="sprite-fill" />
            </div>
            <div class="carried-key" :class="{ 'is-lit': litWord('key') }">
              <ArtSprite name="key" color="sun" accent="text" :size="48" class="sprite-fill" />
            </div>
            <span class="key-question">?</span>
          </div>
          <span class="outcome outcome-yes">{{ t('door.goesIn') }}</span>
        </div>
      </section>

      <!-- Case 2: without the key -->
      <section
        class="lane lane-no"
        :class="{ 'lane-lit': lit('otherwise') }"
        @mouseenter="link.hover('otherwise')"
        @mouseleave="link.unhover()"
      >
        <div class="lane-label">
          <span class="chip">
            <span class="chip-face chip-case">{{ t('door.case2') }}</span>
            <span class="chip-face chip-code">else</span>
          </span>
          <span class="cond">
            <span class="cond-face cond-a">{{ t('door.withoutKey') }}</span>
          </span>
        </div>

        <div class="track">
          <span class="road"></span>
          <div class="home" :class="{ 'is-lit': litWord('house') }">
            <ArtSprite name="house" color="sky" accent="coral" :size="96" class="sprite-fill" />
            <span class="door-mark" :class="{ 'is-lit': litWord('door') }"></span>
          </div>
          <div class="walker walker-no" :class="{ 'is-lit': litWord('momo') }">
            <div class="bob">
              <ArtSprite name="cat-stand" color="coral" accent="rose" :size="96" class="sprite-fill" />
            </div>
          </div>
          <div class="sleeper" :class="{ 'is-lit': litWord('momo') }">
            <ArtSprite name="cat-sleep" color="coral" accent="rose" :size="96" class="sprite-fill" />
          </div>
          <span class="outcome outcome-no">{{ t('door.sleeps') }}</span>
        </div>
      </section>
    </div>

    <p class="prompt">
      {{ t('door.prompt') }}
      <strong>{{ t('door.ask') }}</strong>
    </p>

    <div class="code-dock">
      <CodePanel :code="code" variant="pseudo" filename="momo.txt" />
    </div>

    <div class="to-python" aria-hidden="true">
      <span class="to-python-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 4 V19 M6 13 L12 19 L18 13" />
        </svg>
      </span>
      <span class="to-python-label">{{ t('door.toPython') }}</span>
    </div>

    <div class="python-dock">
      <CodePanel :code="python" variant="python" filename="momo.py" size="lg" />
    </div>
  </div>
</template>

<style scoped>
.door-lesson {
  background: var(--bg);
}

/* ─── Header ─────────────────────────────────────────────────────────── */
.lesson-head {
  position: absolute;
  top: 7vh;
  left: 6vw;
  right: 6vw;
}

.steps {
  display: flex;
  gap: 2.2vw;
  margin: 0 0 1.8vh;
  padding: 0;
  list-style: none;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.7vw;
  font-size: clamp(0.65rem, 1.35vh, 0.9rem);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.step-dot {
  display: grid;
  place-items: center;
  width: 2.8vh;
  height: 2.8vh;
  border-radius: 999px;
  border: 2px solid var(--border);
  letter-spacing: 0;
}

.step-done {
  color: var(--text-dim);
}
.step-done .step-dot {
  border-color: var(--text-dim);
}

.step-now {
  color: var(--text);
}
.step-now .step-dot {
  background: var(--text);
  border-color: var(--text);
  color: var(--bg);
}

/* The step this stage adds slides in beside the ones already reached. */
.step-new {
  animation: step-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
}

.lesson-title {
  font-size: clamp(1.8rem, 6vh, 4.2rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--text);
}

/* ─── Lanes ──────────────────────────────────────────────────────────── */
.lanes {
  position: absolute;
  top: 25vh;
  left: 6vw;
  right: 6vw;
  display: flex;
  flex-direction: column;
  gap: 2.4vh;
  transform-origin: top center;
}

.lane {
  display: grid;
  grid-template-columns: 24vh 1fr;
  align-items: center;
  gap: 2vw;
  padding: 1.6vh 2vw;
  border-radius: 2.2vh;
  background: var(--bg-off);
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}
.lane-lit {
  border-color: var(--lavender);
}

.lane-label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1vh;
}

/* Faces stack in one grid cell, so a label can change without reflowing. */
.chip,
.cond {
  display: inline-grid;
}
.chip-face,
.cond-face {
  grid-area: 1 / 1;
}

.chip-face {
  justify-self: start;
  padding: 0.5vh 1.2vh;
  border-radius: 999px;
  font-size: clamp(0.65rem, 1.4vh, 0.95rem);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  color: #FFFFFF;
}
.chip-q {
  background: var(--text);
}
.lane-yes .chip-case {
  background: var(--mint);
}
.lane-no .chip-case {
  background: var(--coral);
}
.chip-code {
  background: var(--lavender);
  font-size: clamp(0.8rem, 1.8vh, 1.2rem);
  letter-spacing: 0;
  text-transform: none;
}

.cond-face {
  font-size: clamp(0.9rem, 2.3vh, 1.6rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
}

/* ─── Scene ──────────────────────────────────────────────────────────── */
.track {
  /* Where Momo stops: her nose at the door. */
  --walk-end: calc(97% - 18.5vh);
  position: relative;
  height: 19vh;
}

.road {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1.6vh;
  height: 1vh;
  border-radius: 999px;
  background: var(--border);
}

.sprite-fill {
  width: 100%;
  height: 100%;
}

.home {
  position: absolute;
  right: 3%;
  bottom: 2.1vh;
  width: 16vh;
  height: 16vh;
  border-radius: 1.2vh;
}

/* The door in the house sprite: x 28–38, y 39–54 on its 64 grid. */
.door-light,
.door-mark {
  position: absolute;
  left: 45%;
  top: 62%;
  width: 13.4%;
  height: 21.6%;
  border-radius: 1px;
}
.door-light {
  background: var(--sun);
  transform-origin: left center;
  transform: scaleX(0);
}

.walker {
  position: absolute;
  left: 2%;
  bottom: 2.1vh;
  width: 12vh;
  height: 12vh;
  z-index: 2;
  border-radius: 1.2vh;
}

.bob {
  width: 100%;
  height: 100%;
}

.carried-key {
  position: absolute;
  top: -3.6vh;
  right: 1.4vh;
  width: 5vh;
  height: 5vh;
  border-radius: 1vh;
  transform: rotate(-24deg);
}

.key-question {
  position: absolute;
  top: -5.4vh;
  right: -1.8vh;
  display: grid;
  place-items: center;
  width: 3.2vh;
  height: 3.2vh;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.7rem, 1.8vh, 1.2rem);
  font-weight: 900;
  color: var(--text);
}

.sleeper {
  position: absolute;
  left: calc(97% - 23vh);
  bottom: 1.2vh;
  width: 12vh;
  height: 12vh;
  z-index: 2;
  border-radius: 1.2vh;
  opacity: 0;
}

.outcome {
  position: absolute;
  top: 0.6vh;
  right: calc(3% + 17.5vh);
  padding: 0.6vh 1.3vh;
  border-radius: 999px;
  font-size: clamp(0.7rem, 1.6vh, 1.1rem);
  font-weight: 800;
  white-space: nowrap;
  color: #FFFFFF;
  opacity: 0;
}
.outcome-yes {
  background: var(--mint);
}
.outcome-no {
  background: var(--coral);
}

/* A word hovered in the code rings its part of the picture. */
.is-lit {
  outline: 2px solid var(--lavender);
  outline-offset: 0.5vh;
}

.prompt {
  position: absolute;
  top: 52vh;
  left: 6vw;
  max-width: 56vw;
  font-size: clamp(1rem, 2.6vh, 1.8rem);
  line-height: 1.55;
  color: var(--text-dim);
}
.prompt strong {
  display: block;
  margin-top: 1.4vh;
  font-weight: 800;
  color: var(--text);
}

/* Sits exactly under the lanes once they have shrunk to 72%. */
.code-dock {
  position: absolute;
  top: 60.5vh;
  left: calc(6vw + 88vw * 0.14);
  width: calc(88vw * 0.72);
}

/* ─── Stage 1: the question ──────────────────────────────────────────── */
.stage-1 .lane-no,
.stage-1 .code-dock {
  display: none;
}
.stage-1 .chip-case,
.stage-1 .chip-code,
.stage-1 .cond-a {
  opacity: 0;
}
.stage-1 .key-question {
  animation: pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both;
}

/* ─── Stage 2: play out both cases ───────────────────────────────────── */
.stage-2 .code-dock {
  display: none;
}
.stage-2 .chip-code {
  opacity: 0;
}
.stage-2 .chip-q,
.stage-2 .cond-q,
.stage-2 .key-question,
.stage-2 .prompt {
  animation: vanish 0.25s ease both;
  pointer-events: none;
}
.stage-2 .chip-case,
.stage-2 .cond-a {
  animation: appear 0.3s ease 0.2s both;
}
.stage-2 .lane-no {
  animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both;
}

/* Both cats set off together: same situation, one difference. */
.stage-2 .bob {
  animation: bob 0.25s ease-in-out 0.9s 6 alternate;
}
.stage-2 .walker-yes {
  animation:
    walk 1.5s cubic-bezier(0.45, 0, 0.4, 1) 0.9s both,
    into-door 0.45s ease-in 2.95s both;
}
.stage-2 .lane-yes .door-light {
  animation: door-open 0.45s cubic-bezier(0.22, 1, 0.36, 1) 2.45s both;
}
.stage-2 .outcome-yes {
  animation: pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 3.4s both;
}

.stage-2 .walker-no {
  animation:
    walk 1.5s cubic-bezier(0.45, 0, 0.4, 1) 0.9s both,
    bump 0.45s ease-in-out 2.45s both,
    vanish 0.3s ease 3s both;
}
.stage-2 .sleeper {
  animation: appear 0.45s ease 3.05s both;
}
.stage-2 .outcome-no {
  animation: pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 3.55s both;
}

/* ─── Stage 3: write it down ─────────────────────────────────────────── */
/* Stages 3 and 4 both open on the finished scene. */
.stage-3 .chip-q,
.stage-3 .cond-q,
.stage-3 .key-question,
.stage-4 .chip-q,
.stage-4 .cond-q,
.stage-4 .key-question {
  opacity: 0;
}
.stage-3 .prompt,
.stage-4 .prompt {
  display: none;
}
.stage-3 .walker,
.stage-4 .walker {
  left: var(--walk-end);
}
.stage-3 .walker-yes,
.stage-4 .walker-yes {
  opacity: 0;
  transform: translateX(3vh) scale(0.35);
}
.stage-3 .walker-no,
.stage-4 .walker-no {
  opacity: 0;
}
.stage-3 .sleeper,
.stage-3 .outcome,
.stage-4 .sleeper,
.stage-4 .outcome {
  opacity: 1;
}
.stage-3 .lane-yes .door-light,
.stage-4 .lane-yes .door-light {
  transform: scaleX(1);
}

.stage-3 .lanes {
  animation: lift 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both;
}
.stage-3 .chip-case {
  animation: vanish 0.25s ease 0.5s both;
}
.stage-3 .chip-code {
  animation: appear 0.3s ease 0.7s both;
}
.stage-3 .code-dock {
  animation: rise-far 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
}

/* ─── Stage 4: pseudo-code becomes Python ────────────────────────────── */
.to-python,
.python-dock {
  display: none;
}

/*
 * The pseudo-code card ends at 25.5vh and is about 193px tall (four lines of
 * 16px code plus its tab bar), so the arrow and the Python card stack under it
 * in px, not vh: that keeps the gap right on 16:9 and on 4:3 alike.
 */
.to-python {
  position: absolute;
  top: calc(25.5vh + 193px + 1.2vh);
  left: 50%;
  translate: -50% 0;
  align-items: center;
  gap: 1.1vh;
}
.to-python-arrow {
  display: grid;
  place-items: center;
  width: 4.6vh;
  height: 4.6vh;
  border-radius: 999px;
  background: var(--text);
  color: var(--bg);
}
.to-python-arrow svg {
  width: 2.6vh;
  height: 2.6vh;
}
.to-python-label {
  font-size: clamp(0.65rem, 1.4vh, 0.95rem);
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* A little wider than the pseudo-code card, and a size up. */
.python-dock {
  position: absolute;
  top: calc(25.5vh + 193px + 7vh);
  left: calc(6vw + 88vw * 0.08);
  width: calc(88vw * 0.84);
}

/* Opens on stage 3's last frame, then clears the pictures away. */
.stage-4 .chip-case {
  opacity: 0;
}
.stage-4 .lanes {
  pointer-events: none;
  animation: lanes-out 0.45s cubic-bezier(0.4, 0, 1, 1) both;
}
.stage-4 .code-dock {
  animation: dock-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
}
.stage-4 .to-python {
  display: flex;
  animation: pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.75s both;
}
.stage-4 .python-dock {
  display: block;
  animation: rise-far 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both;
}

/* ─── Keyframes ──────────────────────────────────────────────────────── */
@keyframes lanes-out {
  from { opacity: 1; transform: translateY(-2vh) scale(0.72); }
  to { opacity: 0; transform: translateY(-8vh) scale(0.72); }
}
@keyframes dock-up {
  from { transform: none; }
  to { transform: translateY(-35vh); }
}
@keyframes rise {
  from { opacity: 0; transform: translateY(2.5vh); }
  to { opacity: 1; transform: none; }
}
@keyframes rise-far {
  from { opacity: 0; transform: translateY(8vh); }
  to { opacity: 1; transform: none; }
}
@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes vanish {
  from { opacity: 1; }
  to { opacity: 0; }
}
@keyframes pop {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes step-in {
  from { opacity: 0; transform: translateX(-1.4vw); }
  to { opacity: 1; transform: none; }
}
@keyframes walk {
  from { left: 2%; }
  to { left: var(--walk-end); }
}
@keyframes bob {
  from { transform: translateY(0); }
  to { transform: translateY(-0.9vh); }
}
@keyframes into-door {
  from { opacity: 1; transform: none; }
  to { opacity: 0; transform: translateX(3vh) scale(0.35); }
}
@keyframes door-open {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes bump {
  0%, 100% { transform: none; }
  20% { transform: translateX(1.2vh); }
  40% { transform: translateX(-0.6vh); }
  60% { transform: translateX(0.8vh); }
  80% { transform: translateX(-0.3vh); }
}
@keyframes lift {
  from { transform: none; }
  to { transform: translateY(-2vh) scale(0.72); }
}
</style>
