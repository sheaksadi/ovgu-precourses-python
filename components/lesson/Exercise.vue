<script setup lang="ts">
/**
 * "Jetzt du" exercise slide. Auto-imported as `<LessonExercise section="lists" />`.
 *
 * Two or three tasks of growing difficulty side by side: level dots, the task,
 * starter code and the output to aim for. Enter reveals the next hint, one task
 * at a time, so the presenter can help the room without giving everything away;
 * Backspace-free on purpose, since the deck already uses it for navigation.
 *
 * Text lives in `exercises.<section>` in `locales/`.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from '~/composables/useI18n'

interface Task {
  level: 1 | 2 | 3
  title: string
  text: string
  starter: string
  output: string[]
  hint: string
}

const props = defineProps<{ section: string }>()
const { t, tm, locale } = useI18n()

const tasks = computed(() => tm<Task[]>(`exercises.${props.section}.tasks`))
const levels = computed(() => tm<string[]>('exercises.levels'))
const LEVEL_COLOR = ['mint', 'sun', 'coral']

const revealed = ref(0)

const segments = (text: string) => text.split('`').map((part, index) => ({ part, code: index % 2 === 1 }))

const onKey = (event: KeyboardEvent) => {
  if (event.key !== 'Enter') return
  if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) return
  event.preventDefault()
  revealed.value = revealed.value >= tasks.value.length ? 0 : revealed.value + 1
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
watch(locale, () => { revealed.value = 0 })
</script>

<template>
  <div class="exercise relative w-full h-full overflow-hidden">
    <header class="ex-head">
      <p class="ex-eyebrow">{{ t(`exercises.${section}.eyebrow`) }}</p>
      <h2 class="ex-title">{{ t('exercises.title') }}</h2>
    </header>

    <div class="ex-tasks" :style="{ '--count': tasks.length }">
      <article
        v-for="(task, index) in tasks"
        :key="index"
        class="task"
        :style="{ '--accent': `var(--${LEVEL_COLOR[task.level - 1]})` }"
      >
        <div class="task-top">
          <span class="task-num"><span class="text-trim">{{ index + 1 }}</span></span>
          <span class="task-level" aria-hidden="true">
            <i v-for="n in 3" :key="n" :class="{ 'is-on': n <= task.level }"></i>
          </span>
          <span class="task-tag">{{ levels[task.level - 1] }}</span>
        </div>

        <h3 class="task-title">{{ task.title }}</h3>
        <p class="task-text">
          <template v-for="(bit, i) in segments(task.text)" :key="i">
            <code v-if="bit.code" class="inline-code">{{ bit.part }}</code>
            <template v-else>{{ bit.part }}</template>
          </template>
        </p>

        <CodePanel :code="task.starter" variant="python" :chrome="false" :linkable="false" class="task-code" />

        <div class="task-output">
          <span class="task-label">{{ t('exercises.goal') }}</span>
          <span class="task-lines" :class="{ 'is-columns': task.output.length > 3 && task.output.every(line => line.length <= 10) }">
            <span v-for="(line, i) in task.output" :key="i" class="task-line">{{ line }}</span>
          </span>
        </div>

        <div class="task-hint-slot">
          <Transition name="hint">
            <p v-if="revealed > index" class="task-hint">
              <Icon name="lucide:lightbulb" class="hint-icon" />
              <span>
                <template v-for="(bit, i) in segments(task.hint)" :key="i">
                  <code v-if="bit.code" class="inline-code">{{ bit.part }}</code>
                  <template v-else>{{ bit.part }}</template>
                </template>
              </span>
            </p>
          </Transition>
        </div>
      </article>
    </div>

    <footer class="ex-foot">
      <ArtSprite name="cat-peek" color="coral" accent="sun" :size="96" class="ex-cat" />
      <span class="ex-help">{{ t('exercises.help') }}</span>
      <span class="ex-key">{{ t('exercises.key') }}</span>
    </footer>
  </div>
</template>

<style scoped>
.exercise {
  background: var(--bg);
}

.ex-head {
  position: absolute;
  top: 7vh;
  left: 6vw;
  right: 6vw;
}

.ex-eyebrow {
  font-size: clamp(0.65rem, 1.35vh, 0.9rem);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.ex-title {
  margin-top: 1.2vh;
  font-size: clamp(1.8rem, 6vh, 4.2rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--text);
}

/* ─── Tasks ──────────────────────────────────────────────────────────── */
.ex-tasks {
  position: absolute;
  top: 21vh;
  left: 6vw;
  right: 6vw;
  bottom: 13vh;
  display: grid;
  grid-template-columns: repeat(var(--count), minmax(0, 1fr));
  gap: 1.6vw;
}

.task {
  display: flex;
  flex-direction: column;
  gap: 1.3vh;
  min-width: 0;
  padding: 2vh 1.4vw;
  border-radius: 2.2vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
  border-top: 0.7vh solid var(--accent);
}

.task-top {
  display: flex;
  align-items: center;
  gap: 1vh;
}

.task-num {
  display: grid;
  place-items: center;
  width: 3.6vh;
  height: 3.6vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.7rem, 1.7vh, 1.1rem);
  font-weight: 900;
  color: var(--bg);
}

.task-level {
  display: flex;
  gap: 0.5vh;
}
.task-level i {
  width: 1.2vh;
  height: 1.2vh;
  border-radius: 999px;
  background: var(--border);
}
.task-level i.is-on {
  background: var(--accent);
}

.task-tag {
  margin-left: auto;
  font-size: clamp(0.55rem, 1.25vh, 0.85rem);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.task-title {
  font-size: clamp(1rem, 2.7vh, 1.8rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--text);
}

.task-text {
  font-size: clamp(0.75rem, 1.85vh, 1.2rem);
  line-height: 1.5;
  color: var(--text-dim);
}

.inline-code {
  padding: 0 0.2em;
  border-radius: 0.25em;
  background: var(--bg);
  color: var(--lavender);
}

.task-code {
  background: var(--bg) !important;
}
/* Long starter lines wrap inside the narrow card instead of running out of it. */
.task-code :deep(.code-content) {
  min-width: 0;
  overflow-wrap: anywhere;
}
.task-code :deep(.py-4) {
  padding-block: 1.2vh;
  font-size: clamp(0.65rem, 1.7vh, 1.05rem);
}
.task-code :deep(.code-line) {
  padding-inline: 1.2vh;
}

.task-output {
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
  padding: 1vh 1.4vh;
  border-radius: 1.2vh;
  background: var(--bg);
  border: 2px dashed var(--border);
}
.task-label {
  font-size: clamp(0.5rem, 1.15vh, 0.8rem);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}
/* Many short lines, like a countdown, flow into columns to keep the card short. */
.task-lines {
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
}
.task-lines.is-columns {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9ch, 1fr));
  gap: 0.4vh 1.2vh;
}
/* Long expected output, like a printed dictionary, wraps instead of being cut off. */
.task-line {
  font-family: var(--font-code);
  font-size: clamp(0.65rem, 1.7vh, 1.05rem);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: var(--text);
}

.task-hint-slot {
  margin-top: auto;
}
.task-hint {
  display: flex;
  gap: 0.9vh;
  padding: 1.1vh 1.2vh;
  border-radius: 1.2vh;
  background: color-mix(in srgb, var(--sun) 40%, var(--bg));
  font-size: clamp(0.7rem, 1.7vh, 1.1rem);
  line-height: 1.45;
  color: var(--text);
}
.hint-icon {
  flex: none;
  margin-top: 0.2vh;
  color: var(--text);
}

.hint-enter-active {
  animation: hint-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.hint-leave-active {
  transition: opacity 0.2s ease;
}
.hint-leave-to {
  opacity: 0;
}

/* ─── Footer ─────────────────────────────────────────────────────────── */
.ex-foot {
  position: absolute;
  left: 6vw;
  right: 6vw;
  bottom: 3vh;
  display: flex;
  align-items: center;
  gap: 1.4vh;
}
.ex-cat {
  width: 8vh;
  height: 8vh;
}
.ex-help {
  font-size: clamp(0.8rem, 2vh, 1.35rem);
  font-weight: 800;
  color: var(--text);
}
.ex-key {
  margin-left: auto;
  margin-right: 5vw;
  font-size: clamp(0.6rem, 1.4vh, 0.95rem);
  font-weight: 600;
  color: var(--text-muted);
}

@keyframes hint-in {
  from { opacity: 0; transform: translateY(1.2vh) scale(0.97); }
  to { opacity: 1; transform: none; }
}
</style>
