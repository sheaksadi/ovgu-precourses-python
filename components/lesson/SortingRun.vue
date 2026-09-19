<script setup lang="ts">
/**
 * One sorting algorithm, big: the whole slide, twenty values, no code panel.
 * Auto-imported as `<LessonSortingRun algo="bubble" />`.
 *
 * Every algorithm of the detour gets one of these right after its lesson slide,
 * because five bars next to a code panel show what the rule is and twenty bars
 * across a projector show what the rule *costs*. All three runs start from the
 * same twenty numbers, so the comparison counters at the end can be read against
 * each other — which is the honest version of the "how much work" slide.
 *
 * The run is the real algorithm from `utils/sorting.ts`, played frame by frame.
 * Enter replays it. Reduced motion lands on the sorted row.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { sortFrames, type SortName } from '~/utils/sorting'

const props = defineProps<{ algo: SortName }>()
const { t, tm } = useI18n()

/** The same twenty numbers for all three runs, so the counters compare. */
const VALUES = [
  62, 14, 87, 33, 5, 71, 26, 94, 48, 9,
  57, 80, 21, 66, 38, 12, 75, 43, 29, 53,
]
const TALLEST = 100
const N = VALUES.length

const info = computed(() => tm<{ name: string, rule: string }>(`sorting.big.${props.algo}`))

const frames = computed(() => sortFrames(VALUES, props.algo))
const index = ref(0)
const now = computed(() => frames.value[Math.min(index.value, frames.value.length - 1)]!)
const finished = computed(() => index.value >= frames.value.length - 1)
const progress = computed(() => (index.value / Math.max(frames.value.length - 1, 1)) * 100)

/** Where each value stands in this frame, by id. */
const places = computed(() => {
  const spots: number[] = []
  now.value.order.forEach((id, place) => { spots[id] = place })
  return spots
})

const SPEED = 55

let timer: ReturnType<typeof setTimeout> | null = null
const stop = () => { if (timer) clearTimeout(timer); timer = null }

const step = () => {
  if (index.value >= frames.value.length - 1) return
  timer = setTimeout(() => {
    index.value++
    step()
  }, SPEED)
}

const play = () => {
  stop()
  if (import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    index.value = frames.value.length - 1
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
watch(() => props.algo, () => play())
onBeforeUnmount(() => {
  stop()
  window.removeEventListener('keydown', onKey)
})

const roleOf = (id: number) => {
  const place = places.value[id]!
  if (place < now.value.left || place >= N - now.value.right) return 'done'
  if (place === now.value.a || place === now.value.b) return now.value.swap ? 'swap' : 'compare'
  return 'idle'
}
</script>

<template>
  <div class="run" :class="[`is-${algo}`, { 'is-finished': finished }]">
    <header class="run-head">
      <div class="run-title">
        <span class="run-eyebrow">{{ t('sorting.big.eyebrow') }}</span>
        <h2 class="run-name">{{ info.name }}</h2>
        <p class="run-rule">{{ info.rule }}</p>
      </div>

      <div class="run-counts">
        <span class="count">
          <span class="count-value">{{ now.compares }}</span>
          <span class="count-label">{{ t('sorting.compares') }}</span>
        </span>
        <span class="count">
          <span class="count-value">{{ now.swaps }}</span>
          <span class="count-label">{{ t('sorting.big.swaps') }}</span>
        </span>
        <span class="count is-quiet">
          <span class="count-value">{{ N }}</span>
          <span class="count-label">{{ t('sorting.big.values') }}</span>
        </span>
      </div>
    </header>

    <div class="run-bars">
      <span
        v-for="(v, id) in VALUES"
        :key="id"
        class="bar"
        :class="`is-${roleOf(id)}`"
        :style="{ '--i': places[id], '--h': v / TALLEST, '--n': N }"
      >
        <span class="bar-body"></span>
        <span class="bar-value">{{ v }}</span>
      </span>
    </div>

    <footer class="run-foot">
      <div class="run-progress" :style="{ '--p': `${progress}%` }"></div>
      <span class="run-hint">{{ finished ? t('sorting.big.done') : t('sorting.big.running') }}</span>
    </footer>
  </div>
</template>

<style scoped>
.run {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 6vh 5vw 7vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.run-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2vw;
}
.run-eyebrow {
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.run-name {
  margin-top: 0.6vh;
  font-size: clamp(1.5rem, 5vh, 3.2rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--text);
}
.run-rule {
  margin-top: 1vh;
  max-width: 52ch;
  font-size: clamp(0.65rem, 1.8vh, 1.1rem);
  line-height: 1.4;
  color: var(--text-dim);
}

.run-counts {
  display: flex;
  gap: 1.2vw;
}
.count {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 7ch;
  padding: 1vh 1.2vh;
  border-radius: 1vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
}
.count.is-quiet {
  background: transparent;
  border-style: dashed;
}
.count-value {
  font-family: var(--font-code);
  font-size: clamp(0.9rem, 3vh, 2rem);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--text);
}
.count-label {
  font-size: clamp(0.45rem, 1.15vh, 0.72rem);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* ─── The bars ───────────────────────────────────────────────────────── */
.run-bars {
  position: relative;
  flex: 1;
  margin-top: 3vh;
  min-height: 0;
}
.bar {
  position: absolute;
  bottom: 0;
  /* Placed by index inside a row of N, so a swap is one transition. */
  left: calc(var(--i) * (100% / var(--n)));
  width: calc(100% / var(--n));
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.6vh;
  padding: 0 0.25vw;
  transition: left 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}
.bar-body {
  width: 100%;
  height: calc(var(--h) * 100%);
  border-radius: 0.8vh 0.8vh 0.2vh 0.2vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
  transition: background 0.12s ease, border-color 0.12s ease;
}
.bar-value {
  font-family: var(--font-code);
  font-size: clamp(0.4rem, 1.2vh, 0.8rem);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}
.bar.is-compare .bar-body {
  background: color-mix(in srgb, var(--sun) 70%, var(--bg));
  border-color: var(--sun);
}
.bar.is-swap .bar-body {
  background: color-mix(in srgb, var(--coral) 45%, var(--bg));
  border-color: var(--coral);
}
.bar.is-done .bar-body {
  background: color-mix(in srgb, var(--mint) 35%, var(--bg));
  border-color: var(--mint);
}
.bar.is-compare .bar-value,
.bar.is-swap .bar-value,
.bar.is-done .bar-value {
  color: var(--text);
}

/* ─── Progress ───────────────────────────────────────────────────────── */
.run-foot {
  margin-top: 2.5vh;
  display: flex;
  align-items: center;
  gap: 1.2vh;
}
.run-progress {
  position: relative;
  flex: 1;
  height: 0.8vh;
  border-radius: 999px;
  background: var(--border);
  overflow: hidden;
}
.run-progress::after {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--p);
  border-radius: 999px;
  background: var(--coral);
  transition: width 0.12s linear;
}
.is-finished .run-progress::after {
  background: var(--mint);
}
.run-hint {
  min-width: 9ch;
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.is-finished .run-hint {
  color: var(--mint);
}

@media (prefers-reduced-motion: reduce) {
  .bar,
  .bar-body,
  .run-progress::after {
    transition: none;
  }
}
</style>
