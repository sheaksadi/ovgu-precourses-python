<script setup lang="ts">
/**
 * A student's workspace for a problem round. Auto-imported as `<ProblemsWorkspace>`.
 *
 * Tabs for the round's problems, the story with its example, this device's own
 * input with a copy button, and one answer field per part. Part 2 and its story
 * open once Part 1 is solved. A wrong answer says too high / too low and locks
 * the field for a few seconds, counting down on the button.
 *
 * Rendered on problem slides for follow-along devices, and inside the problem
 * dock on every other slide. Stacked on a phone, story and work side by side
 * on a laptop. Text lives in `problems.*` in `locales/`.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useProblems, type AnswerResult, type Part } from '~/composables/useProblems'
import { copyText } from '~/utils/copyText'
import { CODE_TASKS } from '~/utils/codeTasks'

interface ProblemText {
  title: string
  story: string[]
  example: { input: string, answer: string, note?: string }
  part2?: { story: string[], example: { answer: string, note?: string } }
}

const props = defineProps<{
  problems: string[]
  /** The tab to open with; follows the slide when it changes. */
  initial?: string
}>()

const { t, tm, locale } = useI18n()
const store = useProblems()

const pickTab = (id?: string) => (id && props.problems.includes(id) ? id : props.problems[0]!)
const active = ref(pickTab(props.initial))
watch(() => props.initial, (id) => { if (id) active.value = pickTab(id) })

const text = computed(() => tm<ProblemText>(`problems.${active.value}`))
const mine = computed(() => store.mine.value[active.value])
/** A code task is written and run here instead of answered with a number. */
const codeTask = computed(() => CODE_TASKS[active.value])
const parts = computed<Part[]>(() => ((mine.value?.parts ?? (text.value.part2 ? 2 : 1)) === 2 ? [1, 2] : [1]))

/* ─── Input ──────────────────────────────────────────────────────────── */
const loading = ref(false)
const offline = ref(false)

const ensure = async (id: string) => {
  const have = store.mine.value[id]
  if (have && have.locale === locale.value) return
  loading.value = true
  offline.value = false
  try {
    await store.load(id)
  } catch {
    offline.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => ensure(active.value))
watch([active, locale], () => ensure(active.value))

const inputBox = ref<HTMLElement | null>(null)
const copied = ref<'yes' | 'selected' | null>(null)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

/** Copy the input. Where the browser refuses, select it, so a long-press copies it by hand. */
const copy = async () => {
  if (!mine.value) return
  if (await copyText(mine.value.input)) {
    copied.value = 'yes'
  } else if (inputBox.value) {
    const range = document.createRange()
    range.selectNodeContents(inputBox.value)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
    copied.value = 'selected'
  }
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => { copied.value = null }, 2400)
}

/* ─── Answers ────────────────────────────────────────────────────────── */
const drafts = ref<Record<string, string>>({})
const feedback = ref<Record<string, AnswerResult>>({})
const sending = ref(false)

const now = ref(Date.now())
let clock: ReturnType<typeof setInterval> | undefined
onMounted(() => { clock = setInterval(() => { now.value = Date.now() }, 250) })
onBeforeUnmount(() => {
  clearInterval(clock)
  clearTimeout(copiedTimer)
})

const slot = (part: Part) => `${active.value}:${part}`
const draft = (part: Part) => drafts.value[slot(part)] ?? ''
const setDraft = (part: Part, value: string) => { drafts.value = { ...drafts.value, [slot(part)]: value } }

const cooldown = computed(() => Math.max(0, Math.ceil(((mine.value?.cooldownUntil ?? 0) - now.value) / 1000)))
const solvedAt = (part: Part) => mine.value?.solved?.[part]
const isOpen = (part: Part) => part === 1 || !!solvedAt(1)

const send = async (part: Part) => {
  if (sending.value || cooldown.value > 0 || !draft(part).trim()) return
  sending.value = true
  try {
    const result = await store.submit(active.value, part, draft(part))
    feedback.value = { ...feedback.value, [slot(part)]: result }
  } catch {
    offline.value = true
  } finally {
    sending.value = false
  }
}

const message = (part: Part) => {
  const result = feedback.value[slot(part)]
  if (!result || result.result === 'correct') return ''
  return t(`problems.results.${result.result}`)
}

const solvedLine = (part: Part) => {
  const result = feedback.value[slot(part)]
  if (result?.first) return t('problems.results.first')
  const rank = store.rankOf(active.value, part) ?? result?.rank
  return rank ? t('problems.solvedRank', { rank }) : t('problems.solved')
}

const doneIn = (id: string) => Object.keys(store.mine.value[id]?.solved ?? {}).length

const segments = (line: string) => line.split('`').map((part, index) => ({ part, code: index % 2 === 1 }))
</script>

<template>
  <div class="ws">
    <nav v-if="problems.length > 1" class="ws-tabs" :aria-label="t('problems.eyebrow')">
      <button
        v-for="(id, index) in problems"
        :key="id"
        type="button"
        class="ws-tab"
        :class="{ 'is-active': id === active }"
        @click="active = id"
      >
        <span class="text-trim">{{ index + 1 }}. {{ t(`problems.${id}.title`) }}</span>
        <span v-if="doneIn(id)" class="ws-tab-done" :aria-label="t('problems.solved')">{{ '✓'.repeat(doneIn(id)) }}</span>
      </button>
    </nav>

    <div class="ws-grid">
      <!-- The problem -->
      <section class="ws-story">
        <p class="ws-eyebrow">{{ t('problems.eyebrow') }}</p>
        <h2 class="ws-title">{{ text.title }}</h2>
        <p v-for="(line, index) in text.story" :key="index" class="ws-line">
          <template v-for="(bit, i) in segments(line)" :key="i">
            <code v-if="bit.code">{{ bit.part }}</code>
            <template v-else>{{ bit.part }}</template>
          </template>
        </p>

        <div class="ws-example">
          <span class="ws-label">{{ t('problems.example') }}</span>
          <code class="ws-example-input">{{ text.example.input }}</code>
          <p class="ws-example-answer">
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

        <template v-if="text.part2 && isOpen(2)">
          <h3 class="ws-part-title">{{ t('problems.part', { n: 2 }) }}</h3>
          <p v-for="(line, index) in text.part2.story" :key="`p2-${index}`" class="ws-line">
            <template v-for="(bit, i) in segments(line)" :key="i">
              <code v-if="bit.code">{{ bit.part }}</code>
              <template v-else>{{ bit.part }}</template>
            </template>
          </p>
          <div class="ws-example">
            <span class="ws-label">{{ t('problems.example') }}</span>
            <p class="ws-example-answer">
              <b>{{ text.part2.example.answer }}</b>
              <template v-if="text.part2.example.note">
                <span> – </span>
                <template v-for="(bit, i) in segments(text.part2.example.note)" :key="i">
                  <code v-if="bit.code">{{ bit.part }}</code>
                  <template v-else>{{ bit.part }}</template>
                </template>
              </template>
            </p>
          </div>
        </template>
      </section>

      <!-- The work -->
      <section class="ws-work">
        <ProblemsCodeTask v-if="codeTask" :task-id="active" />

        <div v-if="!codeTask" class="ws-card">
          <div class="ws-card-head">
            <span class="ws-label">{{ t('problems.yourInput') }}</span>
            <button type="button" class="ws-copy" :disabled="!mine" @click="copy">
              <Icon :name="copied === 'yes' ? 'lucide:check' : 'lucide:copy'" />
              <span class="text-trim">{{ copied === 'yes' ? t('problems.copied') : t('problems.copy') }}</span>
            </button>
          </div>
          <pre ref="inputBox" class="ws-input" :class="{ 'is-waiting': !mine }">{{ mine?.input ?? (offline ? t('problems.offline') : t('problems.loading')) }}</pre>
          <p class="ws-hint">{{ copied === 'selected' ? t('problems.selected') : t('problems.copyHint') }}</p>
        </div>

        <form
          v-for="part in (codeTask ? [] : parts)"
          :key="`${active}-${part}`"
          class="ws-card ws-answer"
          :class="{ 'is-solved': solvedAt(part), 'is-locked': !isOpen(part) }"
          @submit.prevent="send(part)"
        >
          <span class="ws-label">{{ t('problems.part', { n: part }) }}</span>

          <p v-if="solvedAt(part)" class="ws-solved">
            <span class="ws-solved-mark"><Icon name="lucide:check" /></span>
            <span>{{ solvedLine(part) }}</span>
          </p>
          <p v-else-if="!isOpen(part)" class="ws-locked">
            <Icon name="lucide:lock" />
            <span>{{ t('problems.results.locked') }}</span>
          </p>
          <template v-else>
            <div class="ws-field">
              <input
                :value="draft(part)"
                class="ws-field-input"
                type="text"
                inputmode="decimal"
                autocomplete="off"
                enterkeyhint="send"
                :aria-label="`${t('problems.answer')} · ${t('problems.part', { n: part })}`"
                :placeholder="t('problems.answer')"
                :disabled="cooldown > 0"
                @input="setDraft(part, ($event.target as HTMLInputElement).value)"
              >
              <button type="submit" class="ws-submit" :disabled="sending || cooldown > 0 || !draft(part).trim()">
                <span class="text-trim">{{ cooldown > 0 ? `${cooldown} s` : t('problems.submit') }}</span>
              </button>
            </div>
            <p v-if="message(part)" class="ws-feedback" :class="`is-${feedback[slot(part)]?.result}`" role="status">
              {{ message(part) }}
            </p>
          </template>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.ws {
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  font-family: var(--font-text);
  color: var(--text);
}

/* ─── Tabs ───────────────────────────────────────────────────────────── */
.ws-tabs {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
  overflow-x: auto;
}
.ws-tab {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 0.9rem;
  border-radius: 999px;
  background: var(--bg-off);
  border: 2px solid var(--border);
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--text-dim);
}
.ws-tab.is-active {
  border-color: var(--text);
  background: var(--bg);
  color: var(--text);
}
.ws-tab-done {
  color: var(--mint);
  font-weight: 900;
}

.ws-grid {
  display: grid;
  /* minmax(0, …): a long input line must scroll inside its box, not widen the page. */
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;
}
.ws-story,
.ws-work {
  min-width: 0;
}
@media (min-width: 900px) {
  .ws-grid {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    align-items: start;
    gap: 2.5rem;
  }
}

/* ─── Story ──────────────────────────────────────────────────────────── */
.ws-eyebrow,
.ws-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.ws-title {
  margin: 0.35rem 0 0.9rem;
  font-size: clamp(1.8rem, 6vw, 2.6rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
}
.ws-line {
  margin-top: 0.6rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-dim);
}
.ws-line code,
.ws-example-answer code {
  padding: 0.05em 0.35em;
  border-radius: 0.35em;
  background: var(--bg-off);
  font-family: var(--font-code);
  font-size: 0.9em;
  color: var(--text);
}
.ws-part-title {
  margin-top: 1.6rem;
  font-size: 1.25rem;
  font-weight: 900;
}

.ws-example {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  background: var(--bg-off);
  border: 2px solid var(--border);
}
.ws-example-input {
  overflow-x: auto;
  font-family: var(--font-code);
  font-size: 0.85rem;
  font-weight: 700;
  white-space: pre;
}
.ws-example-answer {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-dim);
}
.ws-example-answer b {
  font-family: var(--font-code);
  font-weight: 900;
  color: var(--text);
}

/* ─── Work ───────────────────────────────────────────────────────────── */
.ws-work {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.ws-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem;
  border-radius: 1.1rem;
  background: var(--bg);
  border: 2px solid var(--border);
}
.ws-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.ws-copy {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  background: var(--text);
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--bg);
}
.ws-copy:disabled {
  opacity: 0.4;
}
.ws-input {
  max-height: 11rem;
  margin: 0;
  overflow: auto;
  padding: 0.8rem;
  border-radius: 0.8rem;
  background: var(--code-bg);
  font-family: var(--font-code);
  font-size: 0.8rem;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--code-text);
}
.ws-input.is-waiting {
  color: var(--text-muted);
}
.ws-hint {
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-muted);
}

.ws-answer.is-solved {
  border-color: var(--mint);
  background: color-mix(in srgb, var(--mint) 12%, var(--bg));
}
.ws-answer.is-locked {
  background: var(--bg-off);
}
.ws-field {
  display: flex;
  gap: 0.5rem;
}
.ws-field-input {
  min-width: 0;
  flex: 1;
  padding: 0.8rem 0.9rem;
  border-radius: 0.8rem;
  background: var(--bg);
  border: 2px solid var(--border);
  font-family: var(--font-code);
  /* 1rem or more, or iOS zooms into the field. */
  font-size: 1rem;
  font-weight: 800;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s ease;
}
.ws-field-input:focus {
  border-color: var(--text);
}
.ws-submit {
  flex: none;
  min-width: 6.5rem;
  padding: 0 1rem;
  border-radius: 0.8rem;
  background: var(--coral);
  font-size: 0.9rem;
  font-weight: 800;
  color: #FFFFFF;
  transition: opacity 0.2s ease;
}
.ws-submit:disabled {
  opacity: 0.45;
}
.ws-feedback {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-dim);
}
.ws-feedback.is-high,
.ws-feedback.is-low,
.ws-feedback.is-wrong {
  color: var(--coral);
}
.ws-solved,
.ws-locked {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
  font-weight: 800;
}
.ws-locked {
  font-weight: 600;
  color: var(--text-muted);
}
.ws-solved-mark {
  display: grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 999px;
  background: var(--mint);
  color: #FFFFFF;
}
</style>
