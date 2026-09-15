<script setup lang="ts">
/**
 * A problem on the projector. Auto-imported as `<ProblemsStage>`.
 *
 * The story large enough to read from the back row, its example, how to take
 * part, and the room's progress: how many solved each part and who got there
 * first. Part 2's story appears once the first person has solved Part 1, as in
 * Advent of Code. New solves also raise toasts (`useWebSocket`).
 *
 * Also what the presenter view's previews show. Text lives in `problems.*`.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useProblems } from '~/composables/useProblems'
import { localizeName } from '~/utils/cuteNames'

interface ProblemText {
  title: string
  story: string[]
  example: { input: string, answer: string, note?: string }
  part2?: { story: string[], example: { answer: string, note?: string } }
}

const props = defineProps<{ problem: string }>()
const { t, tm, locale } = useI18n()
const problems = useProblems()

const text = computed(() => tm<ProblemText>(`problems.${props.problem}`))
const room = computed(() => problems.room.value[props.problem])
const partOne = computed(() => problems.solvedCount(props.problem, 1))
const partTwo = computed(() => problems.solvedCount(props.problem, 2))
const showPartTwo = computed(() => !!text.value.part2 && partOne.value > 0)

const now = ref(Date.now())
let clock: ReturnType<typeof setInterval> | undefined
onMounted(() => { clock = setInterval(() => { now.value = Date.now() }, 1000) })
onBeforeUnmount(() => clearInterval(clock))

const clockTime = (ms: number) => {
  const seconds = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

const elapsed = computed(() => (room.value?.openedAt ? clockTime(now.value - room.value.openedAt) : '0:00'))

const leaders = computed(() => (room.value?.standings ?? []).slice(0, 5).map(entry => ({
  ...entry,
  shown: localizeName(entry.name, locale.value),
  time: room.value?.openedAt ? clockTime(entry.lastAt - room.value.openedAt) : '',
})))

const segments = (line: string) => line.split('`').map((part, index) => ({ part, code: index % 2 === 1 }))
</script>

<template>
  <div class="stage">
    <section class="stage-story">
      <p class="stage-eyebrow">{{ t('problems.eyebrow') }}</p>
      <h2 class="stage-title">{{ text.title }}</h2>
      <p v-for="(line, index) in text.story" :key="index" class="stage-line">
        <template v-for="(bit, i) in segments(line)" :key="i">
          <code v-if="bit.code">{{ bit.part }}</code>
          <template v-else>{{ bit.part }}</template>
        </template>
      </p>

      <div class="stage-example">
        <span class="stage-label">{{ t('problems.example') }}</span>
        <code class="stage-example-input">{{ text.example.input }}</code>
        <p class="stage-example-answer">
          <b>{{ text.example.answer }}</b>
          <template v-if="text.example.note">
            <span> – </span>
            <template v-for="(bit, i) in segments(text.example.note)" :key="i">
              <code v-if="bit.code">{{ bit.part }}</code>
              <template v-else>{{ bit.part }}</template>
            </template>
          </template>
        </p>
      </div>

      <Transition name="part-two">
        <div v-if="showPartTwo && text.part2" class="stage-part-two">
          <span class="stage-label">{{ t('problems.part', { n: 2 }) }}</span>
          <p v-for="(line, index) in text.part2.story" :key="index" class="stage-line">
            <template v-for="(bit, i) in segments(line)" :key="i">
              <code v-if="bit.code">{{ bit.part }}</code>
              <template v-else>{{ bit.part }}</template>
            </template>
          </p>
        </div>
      </Transition>
    </section>

    <aside class="stage-room">
      <ol class="stage-how">
        <li v-for="(step, index) in tm<string[]>('problems.howTo')" :key="index">
          <span class="stage-how-num"><span class="text-trim">{{ index + 1 }}</span></span>
          <span>{{ step }}</span>
        </li>
      </ol>

      <div class="stage-counts">
        <div class="stage-count">
          <span class="stage-count-value">{{ partOne }}</span>
          <span class="stage-label">{{ t('problems.part', { n: 1 }) }}</span>
        </div>
        <div v-if="text.part2" class="stage-count">
          <span class="stage-count-value">{{ partTwo }}</span>
          <span class="stage-label">{{ t('problems.part', { n: 2 }) }}</span>
        </div>
        <div class="stage-count is-clock">
          <span class="stage-count-value">{{ elapsed }}</span>
          <span class="stage-label">{{ t('problems.clock') }}</span>
        </div>
      </div>

      <div class="stage-leaders">
        <span class="stage-label">{{ t('problems.leaders') }}</span>
        <TransitionGroup v-if="leaders.length" tag="ol" name="leader" class="stage-leader-list">
          <li v-for="(entry, index) in leaders" :key="entry.audienceId" class="stage-leader" :class="{ 'is-first': index === 0 }">
            <span class="stage-leader-rank"><span class="text-trim">{{ index + 1 }}</span></span>
            <span class="stage-leader-name">{{ entry.shown }}</span>
            <span class="stage-leader-stars">{{ '★'.repeat(entry.points) }}</span>
            <span class="stage-leader-time">{{ entry.time }}</span>
          </li>
        </TransitionGroup>
        <p v-else class="stage-nobody">{{ t('problems.nobodyYet') }}</p>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 5vw;
  padding: 9vh 6vw 10vh;
  background: var(--bg);
  color: var(--text);
}

.stage-eyebrow,
.stage-label {
  font-size: clamp(0.6rem, 1.35vh, 0.95rem);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.stage-title {
  margin: 1.4vh 0 2.4vh;
  font-size: clamp(2rem, 8vh, 5.6rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.04em;
}
.stage-line {
  margin-top: 1.4vh;
  max-width: 48vw;
  font-size: clamp(0.9rem, 2.4vh, 1.7rem);
  line-height: 1.5;
  color: var(--text-dim);
}
.stage-line code,
.stage-example-answer code {
  padding: 0.05em 0.3em;
  border-radius: 0.3em;
  background: var(--bg-off);
  font-family: var(--font-code);
  font-size: 0.9em;
  color: var(--text);
}

.stage-example {
  margin-top: 3vh;
  display: flex;
  flex-direction: column;
  gap: 1vh;
  padding: 2vh 2.2vh;
  border-radius: 2vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
}
.stage-example-input {
  font-family: var(--font-code);
  font-size: clamp(0.8rem, 2.1vh, 1.45rem);
  font-weight: 700;
}
.stage-example-answer {
  font-size: clamp(0.75rem, 1.9vh, 1.3rem);
  color: var(--text-dim);
}
.stage-example-answer b {
  font-family: var(--font-code);
  font-weight: 900;
  color: var(--text);
}

.stage-part-two {
  margin-top: 3vh;
  padding: 2vh 2.2vh;
  border-radius: 2vh;
  border: 2px solid var(--lavender);
  background: color-mix(in srgb, var(--lavender) 12%, var(--bg));
}
.part-two-enter-active {
  transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.part-two-enter-from {
  opacity: 0;
  transform: translateY(1.5vh);
}

/* ─── The room ───────────────────────────────────────────────────────── */
.stage-room {
  display: flex;
  flex-direction: column;
  gap: 3.5vh;
  padding-top: 2vh;
}
.stage-how {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.4vh;
}
.stage-how li {
  display: flex;
  align-items: center;
  gap: 1.4vh;
  font-size: clamp(0.8rem, 2vh, 1.4rem);
  font-weight: 700;
}
.stage-how-num {
  flex: none;
  display: grid;
  place-items: center;
  width: 4vh;
  height: 4vh;
  border-radius: 999px;
  background: var(--sun);
  font-size: clamp(0.65rem, 1.6vh, 1.1rem);
  font-weight: 900;
}

.stage-counts {
  display: flex;
  gap: 1.6vh;
}
.stage-count {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8vh;
  padding: 1.8vh 2vh;
  border-radius: 2vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
}
.stage-count-value {
  font-family: var(--font-code);
  font-size: clamp(1.4rem, 5vh, 3.6rem);
  font-weight: 900;
  line-height: 1;
}
.stage-count.is-clock .stage-count-value {
  color: var(--text-dim);
}

.stage-leaders {
  display: flex;
  flex-direction: column;
  gap: 1.2vh;
}
.stage-leader-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.9vh;
}
.stage-leader {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 1.4vh;
  padding: 1.1vh 1.6vh;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 2px solid var(--border);
  font-size: clamp(0.8rem, 2vh, 1.4rem);
  font-weight: 800;
}
.stage-leader.is-first {
  border-color: var(--text);
  background: color-mix(in srgb, var(--sun) 30%, var(--bg));
}
.stage-leader-rank {
  display: grid;
  place-items: center;
  width: 3.6vh;
  height: 3.6vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  color: var(--bg);
}
.stage-leader-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.stage-leader-stars {
  color: var(--sun);
  letter-spacing: 0.1em;
}
.stage-leader.is-first .stage-leader-stars {
  color: var(--text);
}
.stage-leader-time {
  font-family: var(--font-code);
  font-size: 0.85em;
  color: var(--text-muted);
}
.stage-nobody {
  font-size: clamp(0.8rem, 2vh, 1.4rem);
  font-weight: 700;
  color: var(--text-muted);
}

.leader-enter-active {
  transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.leader-enter-from {
  opacity: 0;
  transform: translateX(1.5vh);
}
.leader-move {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
