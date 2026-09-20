<script setup lang="ts">
/**
 * A code task on a student's device. Auto-imported as `<ProblemsCodeTask task-id="functions-area" />`.
 *
 * An editor with the starter code, Run, and the tests the function has to pass.
 * The code runs in this browser with the bundled Pyodide
 * (`composables/usePython.ts`), so nothing is sent anywhere and a room without
 * internet still works. Run checks the visible tests; Submit also runs the
 * hidden ones and, when everything passes, tells the room — which counts it
 * like a solved puzzle: a star, a toast, a place on the leaderboard.
 *
 * The draft is kept per device, so a reload does not lose an hour of work.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { usePython, type RunResult } from '~/composables/usePython'
import { useProblems } from '~/composables/useProblems'
import { storageKey } from '~/composables/useDeckRole'
import { CODE_TASKS } from '~/utils/codeTasks'

const props = defineProps<{ taskId: string }>()
const { t, locale } = useI18n()
const python = usePython()
const store = useProblems()

const task = computed(() => CODE_TASKS[props.taskId]!)
const names = computed(() => task.value.names[locale.value])
const tests = computed(() => task.value.tests(names.value))
const visibleTests = computed(() => tests.value.filter(test => !test.hidden))
const hiddenCount = computed(() => tests.value.length - visibleTests.value.length)

const draftKey = computed(() => storageKey(`task:${props.taskId}:${locale.value}`))
const code = ref(task.value.starter(names.value))

/* ─── Editor ─────────────────────────────────────────────────────────── */
const host = ref<HTMLElement | null>(null)
let view: any = null

const readDraft = () => {
  try {
    return localStorage.getItem(draftKey.value) || ''
  } catch {
    return ''
  }
}
const writeDraft = (value: string) => {
  try { localStorage.setItem(draftKey.value, value) } catch { /* blocked storage: this run only */ }
}

const mountEditor = async () => {
  if (!host.value) return
  const [{ EditorView, basicSetup }, { python: pythonLanguage }] = await Promise.all([
    import('codemirror'),
    import('@codemirror/lang-python'),
  ])
  view = new EditorView({
    doc: code.value,
    parent: host.value,
    extensions: [
      basicSetup,
      pythonLanguage(),
      EditorView.lineWrapping,
      EditorView.updateListener.of((update: any) => {
        if (!update.docChanged) return
        code.value = update.state.doc.toString()
        writeDraft(code.value)
      }),
    ],
  })
}

const setCode = (next: string) => {
  code.value = next
  writeDraft(next)
  if (view) view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: next } })
}

onMounted(async () => {
  const draft = readDraft()
  if (draft) code.value = draft
  python.warm()
  await mountEditor()
})

watch(locale, () => {
  // Names changed with the language; an untouched starter follows along.
  const draft = readDraft()
  if (!draft) setCode(task.value.starter(names.value))
})

onBeforeUnmount(() => view?.destroy())

/* ─── Running ────────────────────────────────────────────────────────── */
const result = ref<RunResult | null>(null)
const busy = ref(false)
const submitted = ref(false)
const failedSubmit = ref(false)

const solvedAt = computed(() => store.mine.value[props.taskId]?.solved?.[1])
const rank = computed(() => store.rankOf(props.taskId, 1))

const runWith = async (all: boolean) => {
  if (busy.value) return null
  busy.value = true
  failedSubmit.value = false
  result.value = null
  const answer = await python.run(code.value, (all ? tests.value : visibleTests.value).map(({ call, expect }) => ({ call, expect })))
  result.value = answer
  busy.value = false
  return answer
}

const run = () => runWith(false)

const submit = async () => {
  const answer = await runWith(true)
  if (!answer) return
  const passed = answer.results.filter(test => test.pass).length
  if (!answer.ok || passed < tests.value.length) {
    failedSubmit.value = true
    return
  }
  await store.submitCode(props.taskId, passed, tests.value.length)
  submitted.value = true
}

const passedCount = computed(() => result.value?.results.filter(test => test.pass).length ?? 0)
const status = computed(() => {
  if (python.status.value === 'loading' && busy.value) return t('problems.code.loadingPython')
  if (python.status.value === 'failed') return `${t('problems.code.noPython')}${python.error.value ? ` (${python.error.value})` : ''}`
  if (result.value?.timedOut) return t('problems.code.timeout')
  if (result.value?.error) return `${t('problems.code.errorTitle')}: ${result.value.error}`
  if (failedSubmit.value) return t('problems.code.notYet')
  if (result.value) return t('problems.code.passed', { n: passedCount.value, total: result.value.results.length })
  return ''
})
</script>

<template>
  <div class="task">
    <div class="task-card">
      <div class="task-head">
        <span class="task-label">{{ t('problems.code.yourCode') }}</span>
        <button type="button" class="task-reset" @click="setCode(task.starter(names))">
          <Icon name="lucide:rotate-ccw" />
          <span class="text-trim">{{ t('problems.code.reset') }}</span>
        </button>
      </div>
      <div ref="host" class="task-editor"></div>

      <div class="task-actions">
        <button type="button" class="task-run" :disabled="busy" @click="run">
          <Icon name="lucide:play" />
          <span class="text-trim">{{ busy ? t('problems.code.running') : t('problems.code.run') }}</span>
        </button>
        <button type="button" class="task-submit" :disabled="busy || !!solvedAt" @click="submit">
          <span class="text-trim">{{ t('problems.submit') }}</span>
        </button>
      </div>

      <p v-if="status" class="task-status" :class="{ 'is-bad': result?.error || result?.timedOut || failedSubmit }">{{ status }}</p>

      <div v-if="result?.output.length" class="task-output">
        <span class="task-label">{{ t('problems.code.output') }}</span>
        <code v-for="(line, index) in result.output" :key="index" class="task-out-line">{{ line }}</code>
      </div>
    </div>

    <div class="task-card">
      <span class="task-label">{{ t('problems.code.tests') }}</span>
      <ul class="task-tests">
        <li v-for="test in visibleTests" :key="test.call" class="task-test" :class="{
          'is-pass': result?.results.find(entry => entry.call === test.call)?.pass,
          'is-fail': result && result.results.find(entry => entry.call === test.call)?.pass === false,
        }">
          <code class="task-test-call">{{ test.show ?? test.call }}</code>
          <span class="task-test-arrow">→</span>
          <code class="task-test-expect">{{ test.expect }}</code>
          <span class="task-test-mark">
            <Icon v-if="result?.results.find(entry => entry.call === test.call)?.pass" name="lucide:check" />
            <template v-else-if="result?.results.find(entry => entry.call === test.call)">{{ result.results.find(entry => entry.call === test.call)?.got }}</template>
          </span>
        </li>
      </ul>
      <p v-if="hiddenCount" class="task-hint">{{ t('problems.code.hidden', { n: hiddenCount }) }}</p>
    </div>

    <p v-if="solvedAt" class="task-solved">
      <span class="task-solved-mark"><Icon name="lucide:check" /></span>
      <span>{{ rank ? t('problems.solvedRank', { rank }) : t('problems.solved') }}</span>
    </p>
  </div>
</template>

<style scoped>
.task {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.task-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem;
  border-radius: 1.1rem;
  background: var(--bg);
  border: 2px solid var(--border);
}
.task-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.task-label {
  /* 0.7rem, not less: below 11px a label stops being read on a phone. */
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.task-reset {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
}

.task-editor {
  overflow: hidden;
  border-radius: 0.8rem;
  border: 2px solid var(--border);
}
.task-editor :deep(.cm-editor) {
  max-height: 16rem;
  font-family: var(--font-code);
  /* 1rem or more, or iOS zooms into the editor. */
  font-size: 1rem;
  background: var(--bg-off);
}
.task-editor :deep(.cm-editor.cm-focused) {
  outline: none;
}
.task-editor :deep(.cm-gutters) {
  background: var(--bg-off);
  border-right: 1px solid var(--border);
  color: var(--text-muted);
}
.task-editor :deep(.cm-activeLine),
.task-editor :deep(.cm-activeLineGutter) {
  background: color-mix(in srgb, var(--sun) 20%, transparent);
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}
.task-run,
.task-submit {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.8rem 1rem;
  border-radius: 0.8rem;
  font-size: 0.9rem;
  font-weight: 800;
}
.task-run {
  background: var(--text);
  color: var(--bg);
}
.task-submit {
  background: var(--coral);
  color: #FFFFFF;
}
.task-run:disabled,
.task-submit:disabled {
  opacity: 0.45;
}

.task-status {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-dim);
}
.task-status.is-bad {
  color: var(--coral);
}

.task-output {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.7rem 0.8rem;
  border-radius: 0.8rem;
  background: var(--code-bg);
}
.task-out-line {
  font-family: var(--font-code);
  font-size: 0.85rem;
  color: var(--code-text);
}

.task-tests {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.task-test {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.6rem;
  border-radius: 0.7rem;
  background: var(--bg-off);
  font-family: var(--font-code);
  font-size: 0.85rem;
  font-weight: 700;
}
.task-test.is-pass {
  background: color-mix(in srgb, var(--mint) 18%, var(--bg));
}
.task-test.is-fail {
  background: color-mix(in srgb, var(--coral) 14%, var(--bg));
}
.task-test-arrow,
.task-test-mark {
  color: var(--text-muted);
}
.task-test-mark {
  margin-left: auto;
  font-weight: 800;
}
.task-test.is-pass .task-test-mark {
  color: var(--mint);
}
.task-test.is-fail .task-test-mark {
  color: var(--coral);
}
.task-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.task-solved {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0.9rem;
  border-radius: 1.1rem;
  background: color-mix(in srgb, var(--mint) 14%, var(--bg));
  border: 2px solid var(--mint);
  font-size: 0.95rem;
  font-weight: 800;
}
.task-solved-mark {
  display: grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 999px;
  background: var(--mint);
  color: #FFFFFF;
}
</style>
