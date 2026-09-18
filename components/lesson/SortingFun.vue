<script setup lang="ts">
/**
 * The bad ideas, after the sorting detour. Auto-imported as
 * `<LessonSortingFun :stage="1" />` (PRE-0163 and its two sub-slides):
 *
 *   1. bogosort: shuffle, look, shuffle again — the try counter keeps climbing
 *   2. stalin sort: one pass, and everything out of order falls off the row
 *   3. sleep sort, miracle sort and quantum bogosort as three cards
 *
 * Same bars as `Sorting.vue`, same catch, so the joke lands against something
 * the room already recognises. Words come from `sorting.fun.*` in `locales/`.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3

interface Stage {
  headline: string
  note: string
  code: string
  focus: number[]
  output: string[]
  outputFrom: number
}

interface Card {
  name: string
  how: string
  verdict: string
}

const props = defineProps<{ stage: StageNumber }>()
const { t, tm } = useI18n()

const stages = computed(() => tm<Stage[]>('sorting.fun.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const cards = computed(() => tm<Card[]>('sorting.fun.cards'))

const VALUES = [31, 12, 47, 8, 23]
const TALLEST = 50
const N = VALUES.length
const value = (id: number) => VALUES[id]!
const ids = VALUES.map((_, i) => i)

/* ─── 1: bogosort, shuffling forever ─────────────────────────────────── */
/** Fixed shuffles, so the projector and every device see the same bad luck. */
const SHUFFLES: number[][] = [
  [0, 1, 2, 3, 4],
  [2, 0, 4, 1, 3],
  [4, 3, 0, 2, 1],
  [1, 4, 2, 0, 3],
  [3, 2, 1, 4, 0],
  [0, 4, 3, 1, 2],
  [2, 1, 0, 3, 4],
  [4, 0, 1, 2, 3],
]

/* ─── 2: stalin sort, one pass ───────────────────────────────────────── */
/** Walk once and drop anything smaller than the last value kept. */
const stalinSteps = computed(() => {
  const steps: { at: number, dropped: number[] }[] = []
  const dropped: number[] = []
  let best = value(ids[0]!)
  for (let i = 1; i < N; i++) {
    if (value(ids[i]!) < best) dropped.push(ids[i]!)
    else best = value(ids[i]!)
    steps.push({ at: i, dropped: [...dropped] })
  }
  return steps
})

const index = ref(0)
let timer: ReturnType<typeof setTimeout> | null = null
const stop = () => { if (timer) clearTimeout(timer); timer = null }

const lastIndex = computed(() => {
  if (props.stage === 1) return SHUFFLES.length - 1
  if (props.stage === 2) return stalinSteps.value.length - 1
  return cards.value.length - 1
})
const speed = computed(() => (props.stage === 1 ? 700 : props.stage === 2 ? 900 : 700))

const step = () => {
  if (index.value >= lastIndex.value) return
  timer = setTimeout(() => {
    index.value++
    step()
  }, speed.value)
}

const play = () => {
  stop()
  if (import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    index.value = lastIndex.value
    return
  }
  index.value = 0
  step()
}

const onKey = (event: KeyboardEvent) => {
  if (event.key !== 'Enter') return
  if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) return
  play()
}

onMounted(() => {
  play()
  window.addEventListener('keydown', onKey)
})
watch(() => props.stage, () => play())
onBeforeUnmount(() => {
  stop()
  window.removeEventListener('keydown', onKey)
})

/** Where each value stands right now, by id. */
const places = computed(() => {
  const order = props.stage === 1 ? SHUFFLES[index.value]! : ids
  const spots: number[] = []
  order.forEach((id, place) => { spots[id] = place })
  return spots
})

const dropped = computed(() => (props.stage === 2 ? stalinSteps.value[index.value]!.dropped : []))
const looking = computed(() => (props.stage === 2 ? stalinSteps.value[index.value]!.at : -1))
const kept = computed(() => ids.filter(id => !dropped.value.includes(id)))
const finished = computed(() => index.value >= lastIndex.value)
</script>

<template>
  <LessonShell
    :eyebrow="t('sorting.fun.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :file="t('sorting.fun.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :stack-output="stage === 3"
    :dense="stage === 1"
    :output-label="t('sorting.output')"
    :no-output="t('sorting.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <!-- 3: the ones not even worth animating -->
      <div v-if="stage === 3" class="cards">
        <div
          v-for="(card, i) in cards"
          :key="card.name"
          class="card"
          :class="{ 'is-open': i <= index }"
          :style="{ '--t': `${i * 0.12}s` }"
        >
          <span class="card-name">{{ card.name }}</span>
          <span class="card-how">{{ card.how }}</span>
          <span class="card-verdict">{{ card.verdict }}</span>
        </div>
      </div>

      <template v-else>
        <span v-if="stage === 1" class="chip is-count">{{ t('sorting.fun.tries') }} {{ index + 1 }}</span>
        <span v-else class="chip is-count">{{ kept.length }} {{ t('sorting.fun.left') }}</span>

        <div class="bars">
          <span
            v-for="id in ids"
            :key="id"
            class="bar"
            :class="{
              'is-dropped': dropped.includes(id),
              'is-kept': stage === 2 && !dropped.includes(id) && places[id] < looking,
              'is-looking': stage === 2 && places[id] === looking && !dropped.includes(id),
              'is-shuffling': stage === 1,
            }"
            :style="{ '--i': places[id], '--h': value(id) / TALLEST }"
          >
            <span class="bar-value">{{ value(id) }}</span>
            <span class="bar-body"></span>
            <span v-if="dropped.includes(id)" class="bar-tag">{{ t('sorting.fun.dropped') }}</span>
          </span>
        </div>

        <p v-if="stage === 1 && finished" class="footnote">{{ t('sorting.fun.average') }}</p>
      </template>
    </div>
  </LessonShell>
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
  --pitch: 17.5%;
  --x0: 12%;
}

.chip {
  position: absolute;
  z-index: 2;
  top: 2.5vh;
  left: 50%;
  translate: -50% 0;
  padding: calc(0.4vh + 0.25em) 1.3vh;
  border-radius: 999px;
  background: var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.55rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
}

/* ─── Bars ───────────────────────────────────────────────────────────── */
.bars {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 9vh;
  height: 30vh;
}
.bar {
  position: absolute;
  bottom: 0;
  left: calc(var(--x0) + var(--i) * var(--pitch));
  width: 12%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.6vh;
  translate: -50% 0;
  transition: left 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
}
.bar-body {
  width: 100%;
  height: calc(var(--h) * 24vh);
  border-radius: 1vh 1vh 0.4vh 0.4vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
  transition: background 0.25s ease, border-color 0.25s ease;
}
.bar-value {
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  color: var(--text-dim);
}
.bar.is-kept .bar-body {
  background: color-mix(in srgb, var(--mint) 28%, var(--bg));
  border-color: var(--mint);
}
.bar.is-looking .bar-body {
  background: color-mix(in srgb, var(--sun) 65%, var(--bg));
  border-color: var(--sun);
}
/* Dropped values stay on the slide, faded and labelled: the point is what is lost. */
.bar.is-dropped {
  opacity: 0.35;
}
.bar.is-dropped .bar-body {
  background: repeating-linear-gradient(
    45deg,
    var(--bg-off),
    var(--bg-off) 0.5vh,
    var(--bg) 0.5vh,
    var(--bg) 1vh
  );
  border-style: dashed;
  border-color: var(--text-muted);
  translate: 0 1.5vh;
}
.bar-tag {
  position: absolute;
  bottom: -3.2vh;
  padding: 0.3vh 0.8vh;
  border-radius: 0.5vh;
  background: var(--bg);
  border: 1px dashed var(--text-muted);
  font-size: clamp(0.45rem, 1.1vh, 0.7rem);
  font-weight: 700;
  white-space: nowrap;
  color: var(--text-muted);
}

.footnote {
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: 1.5vh;
  text-align: center;
  font-size: clamp(0.55rem, 1.5vh, 1rem);
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-dim);
  animation: fade-in 0.4s ease both;
}

/* ─── 3: three cards ─────────────────────────────────────────────────── */
.cards {
  position: absolute;
  inset: 6vh 6% 6vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.6vh;
}
.card {
  display: flex;
  flex-direction: column;
  gap: 0.4vh;
  padding: 1.4vh 1.6vh;
  border-radius: 1.2vh;
  background: var(--bg);
  border: 2px solid var(--border);
  opacity: 0;
  translate: 0 1vh;
  transition: opacity 0.4s ease, translate 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.4s ease;
}
.card.is-open {
  opacity: 1;
  translate: 0 0;
  border-color: var(--lavender);
}
.card-name {
  font-size: clamp(0.65rem, 1.8vh, 1.15rem);
  font-weight: 800;
  color: var(--text);
}
.card-how {
  font-size: clamp(0.55rem, 1.45vh, 0.95rem);
  line-height: 1.35;
  color: var(--text-dim);
}
.card-verdict {
  font-family: var(--font-code);
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  font-weight: 700;
  color: var(--lavender);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .bar,
  .card {
    transition: none;
  }
}
</style>
