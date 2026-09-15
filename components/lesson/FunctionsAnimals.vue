<script setup lang="ts">
/**
 * "Tiere, die miteinander reden". Auto-imported as `<LessonFunctionsAnimals :stage="1" />`.
 *
 * Four slides (PRE-0108 and its three sub-slides):
 *
 *   1. an animal as data: a list with its name and how hungry it is
 *   2. `treffen(a, b)`: the parameters a and b point at whichever animal is passed
 *   3. `fressen(tier, menge)`: the function changes the animal's list itself
 *   4. small functions build bigger ones: `spielen` uses `treffen`, a loop runs
 *      three days
 *
 * Momo stays on the left and Bello on the right throughout, so each stage opens
 * on the last frame of the one before. Words come from `functions.animals.*`
 * in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3 | 4

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

const stages = computed(() => tm<Stage[]>('functions.animals.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const words = computed(() => tm<Record<'momoSays' | 'belloSays' | 'day' | 'plays' | 'meets', string>>('functions.animals.words'))

const PIPS = 5
/** Hunger before and after this stage. */
const hunger = computed(() => ({
  momo: props.stage < 3 ? [5, 5] : props.stage === 3 ? [5, 2] : [2, 2],
  bello: props.stage < 3 ? [2, 2] : props.stage === 3 ? [2, 0] : [0, 0],
}))

const callAt = (k: number) => 0.8 + k * 1.8
const eatAt = { momo: 0.8, bello: 2.4 }
const dayAt = (k: number) => 0.8 + k * 1.5

const outputDelays = computed(() => {
  switch (props.stage) {
    case 1: return [0.6, 0.9]
    case 2: return [callAt(0) + 0.5, callAt(1) + 0.5]
    case 3: return [eatAt.momo + 0.9, eatAt.bello + 0.9]
    case 4: return [0.9, 1.3, 1.7, 2.4]
    default: return undefined
  }
})

const pipGone = (who: 'momo' | 'bello', pip: number) => {
  const [before, after] = hunger.value[who]
  return pip >= after && pip < before
}
</script>

<template>
  <LessonShell
    :eyebrow="t('functions.animals.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :file="t('functions.animals.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    dense
    :output-label="t('functions.animals.output')"
    :no-output="t('functions.animals.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span v-if="stage !== 4" :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>
      <span v-else class="tally day">
        <span class="stack">
          <span
            v-for="k in 3"
            :key="k"
            class="day-value"
            :style="{ '--t': `${dayAt(k - 1)}s`, '--u': `${k < 3 ? dayAt(k) : 999}s` }"
          >{{ words.day }} {{ k }}</span>
        </span>
      </span>

      <div
        v-for="who in (['momo', 'bello'] as const)"
        :key="who"
        class="animal"
        :class="`animal-${who}`"
      >
        <span class="tag tag-a"><span class="text-trim">a</span></span>
        <span class="tag tag-b"><span class="text-trim">b</span></span>
        <span class="bubble"><span class="text-trim">{{ who === 'momo' ? words.momoSays : words.belloSays }}</span></span>

        <div class="body">
          <ArtSprite
            :name="who === 'momo' ? 'cat' : 'dog'"
            :color="who === 'momo' ? 'coral' : 'sun'"
            :accent="who === 'momo' ? 'rose' : 'text'"
            :size="96"
            class="art"
          />
        </div>

        <!-- The animal as a list -->
        <code class="data">
          [<b>"{{ who === 'momo' ? 'Momo' : 'Bello' }}"</b>,
          <span class="stack">
            <span class="hunger-value before">{{ hunger[who][0] }}</span>
            <span v-if="hunger[who][0] !== hunger[who][1]" class="hunger-value after">{{ hunger[who][1] }}</span>
          </span>]
        </code>
        <span class="pips" :style="{ '--t': `${eatAt[who]}s` }">
          <i
            v-for="pip in PIPS"
            :key="pip"
            :class="{ 'is-on': pip - 1 < hunger[who][0], 'is-gone': pipGone(who, pip - 1) }"
            :style="{ '--p': hunger[who][0] - pip }"
          ></i>
        </span>
      </div>

      <!-- 3: the bowl -->
      <div class="bowl">
        <ArtSprite name="fish" color="sky" accent="text" :size="96" class="bowl-fish" />
        <span class="bowl-dish"></span>
      </div>

      <!-- 4: who calls whom -->
      <code class="calls">spielen → treffen</code>
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
.stack {
  display: inline-grid;
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
.tally.day {
  animation: none;
}
.day-value {
  grid-area: 1 / 1;
  text-align: center;
  color: var(--sun);
  opacity: 0;
  animation:
    swap-in 0.25s ease var(--t) both,
    vanish 0.1s ease var(--u) forwards;
}

/* ─── Animals ────────────────────────────────────────────────────────── */
.animal {
  position: absolute;
  top: 13vh;
  width: 34%;
  display: flex;
  flex-direction: column;
  align-items: center;
  translate: -50% 0;
}
.animal-momo {
  left: 27%;
}
.animal-bello {
  left: 73%;
}
.body {
  width: 13vh;
  height: 13vh;
}
.art {
  width: 100%;
  height: 100%;
}

.data {
  margin-top: 1vh;
  padding: calc(0.35vh + 0.3em) 1vh;
  border-radius: 1vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
}
.data b {
  color: var(--coral);
}
.hunger-value {
  grid-area: 1 / 1;
  color: var(--sky);
}

.pips {
  display: flex;
  gap: 0.6vh;
  margin-top: 1vh;
}
.pips i {
  width: 1.8vh;
  height: 1.8vh;
  border-radius: 999px;
  background: var(--border);
}
.pips i.is-on {
  background: var(--coral);
}

.tag {
  position: absolute;
  top: -3.4vh;
  display: grid;
  place-items: center;
  width: 3.4vh;
  height: 3.4vh;
  border-radius: 999px;
  background: var(--lavender);
  border: 2px solid var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 900;
  color: #FFFFFF;
  opacity: 0;
}
.tag-b {
  background: var(--sky);
}
.bubble {
  position: absolute;
  top: 0;
  padding: 0.9vh 1.3vh;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
  opacity: 0;
}
/* Above the head, clear of the other animal. */
.animal .bubble {
  top: -8vh;
  left: 50%;
  translate: -50% 0;
}

.bowl {
  position: absolute;
  left: 50%;
  bottom: 3vh;
  width: 15vh;
  height: 9vh;
  translate: -50% 0;
  opacity: 0;
}
.bowl-fish {
  position: absolute;
  left: 20%;
  bottom: 3vh;
  width: 60%;
  height: 6vh;
}
.bowl-dish {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4.4vh;
  border-radius: 0 0 999px 999px;
  background: var(--sky);
  border: 3px solid var(--text);
}

.calls {
  position: absolute;
  left: 50%;
  bottom: 3vh;
  padding: calc(0.35vh + 0.3em) 1.2vh;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--lavender);
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
  translate: -50% 0;
  opacity: 0;
}

/* ═══ Stages ═══════════════════════════════════════════════════════════ */

/* 1: each animal's list writes itself under it. */
.stage-1 .data {
  animation: rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
}
.stage-1 .animal-bello .data {
  animation-delay: 0.7s;
}
.stage-1 .pips i.is-on {
  animation: pop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) calc(0.8s + var(--p) * -0.06s + 0.3s) both;
}

/* 2: treffen(momo, bello), then treffen(bello, momo): a and b follow the arguments. */
.stage-2 .animal-momo {
  animation: step-in-right 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
}
.stage-2 .animal-bello {
  animation: step-in-left 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
}
.stage-2 .animal-momo .tag-a,
.stage-2 .animal-bello .tag-b {
  left: 30%;
  animation:
    pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s both,
    vanish 0.2s ease 2.5s forwards;
}
.stage-2 .animal-bello .tag-a,
.stage-2 .animal-momo .tag-b {
  left: 30%;
  animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 2.6s both;
}
.stage-2 .animal-momo .bubble {
  animation:
    pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) 1.2s both,
    vanish 0.2s ease 2.5s forwards;
}
.stage-2 .animal-bello .bubble {
  animation: pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) 3s both;
}
.stage-3 .animal-momo,
.stage-4 .animal-momo {
  translate: calc(-50% + 2vw) 0;
}
.stage-3 .animal-bello,
.stage-4 .animal-bello {
  translate: calc(-50% - 2vw) 0;
}

/* 3: the bowl arrives; each meal takes pips away and rewrites the number in the list. */
.stage-3 .bowl {
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
}
.stage-3 .pips i.is-gone {
  animation: eaten 0.3s ease-in both;
  animation-delay: calc(var(--t) + 0.3s + (var(--p) + 1) * 0.15s);
}
.stage-3 .hunger-value.before {
  animation: vanish 0.15s ease both;
}
.stage-3 .animal-momo .hunger-value.before { animation-delay: 1.5s; }
.stage-3 .animal-bello .hunger-value.before { animation-delay: 3.1s; }
.stage-3 .hunger-value.after {
  opacity: 0;
  animation: swap-in 0.25s ease both;
}
.stage-3 .animal-momo .hunger-value.after { animation-delay: 1.6s; }
.stage-3 .animal-bello .hunger-value.after { animation-delay: 3.2s; }
.stage-3 .animal-momo .body { animation: chomp 0.25s ease 1s 3; }
.stage-3 .animal-bello .body { animation: chomp 0.25s ease 2.6s 2; }

/* 4: the bowl clears; three days of meeting and playing. */
.stage-4 .bowl {
  opacity: 1;
  animation: vanish 0.3s ease both;
}
.stage-4 .animal-momo .body {
  animation: play-right 1.5s ease-in-out 0.8s 3;
}
.stage-4 .animal-bello .body {
  animation: play-left 1.5s ease-in-out 0.8s 3;
}
.stage-4 .calls {
  animation: rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) 1s both;
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
@keyframes swap-in {
  from { opacity: 0; transform: translateY(-0.8vh); }
  to { opacity: 1; transform: none; }
}
@keyframes step-in-right {
  from { translate: -50% 0; }
  to { translate: calc(-50% + 2vw) 0; }
}
@keyframes step-in-left {
  from { translate: -50% 0; }
  to { translate: calc(-50% - 2vw) 0; }
}
@keyframes eaten {
  from { background: var(--coral); transform: none; }
  50% { transform: scale(0.5); }
  to { background: var(--border); transform: none; }
}
@keyframes chomp {
  0%, 100% { transform: none; }
  50% { transform: scale(1.06) rotate(-4deg); }
}
@keyframes play-right {
  0%, 100% { transform: none; }
  40% { transform: translateX(3vw) translateY(-2vh) rotate(8deg); }
  60% { transform: translateX(3vw); }
}
@keyframes play-left {
  0%, 100% { transform: none; }
  40% { transform: translateX(-3vw) translateY(-2vh) rotate(-8deg); }
  60% { transform: translateX(-3vw); }
}
</style>
