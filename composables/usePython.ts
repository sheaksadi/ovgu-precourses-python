/**
 * Runs Python in the browser, for the code tasks.
 *
 *   const { status, warm, run } = usePython()
 *   const result = await run(code, [{ call: 'flaeche(3, 4)', expect: '12' }])
 *
 * The work happens in `public/python-worker.js` with the bundled Pyodide, so a
 * room without internet still works and a student's endless loop cannot freeze
 * the page: a run that takes too long terminates the worker, and the next run
 * starts a new one (which loads Pyodide again, hence the warning in the UI).
 *
 * One worker per screen, shared by every task on it.
 */
import { computed, ref } from 'vue'

export interface TestResult {
  call: string
  expect: string
  got: string
  pass: boolean
}

export interface RunResult {
  /** The program itself ran; tests may still have failed. */
  ok: boolean
  output: string[]
  /** The Python error, already shortened to its last line. */
  error?: string
  timedOut?: boolean
  results: TestResult[]
}

export type PythonStatus = 'idle' | 'loading' | 'ready' | 'failed'

/** A run that takes longer than this is an endless loop as far as the room is concerned. */
export const RUN_TIMEOUT_MS = 5000

const status = ref<PythonStatus>('idle')
/** Why Python did not start, for the UI and for debugging. */
const lastError = ref('')
let worker: Worker | null = null
let nextId = 1

interface Pending {
  resolve: (result: RunResult) => void
  output: string[]
  timer?: ReturnType<typeof setTimeout>
  timeout: number
}

const pending = new Map<number, Pending>()

const startWorker = () => {
  if (worker || import.meta.server) return
  status.value = 'loading'
  // A module worker: the Pyodide build in public/pyodide is an ES module.
  worker = new Worker('/python-worker.js', { type: 'module' })

  worker.onmessage = (event: MessageEvent) => {
    const message = event.data
    const entry = message?.id ? pending.get(message.id) : undefined

    switch (message?.type) {
      case 'ready':
        status.value = 'ready'
        break
      case 'failed':
        status.value = 'failed'
        lastError.value = message.error ?? ''
        break
      case 'started':
        // The clock starts once Python is loaded, not while it downloads.
        if (entry) entry.timer = setTimeout(() => stopRun(message.id), entry.timeout)
        break
      case 'out':
        entry?.output.push(message.line)
        break
      case 'done':
        if (!entry) break
        clearTimeout(entry.timer)
        pending.delete(message.id)
        status.value = 'ready'
        entry.resolve({ ok: !!message.ok, output: message.output ?? entry.output, error: message.error, results: message.results ?? [] })
        break
    }
  }

  worker.onerror = (event: ErrorEvent) => {
    status.value = 'failed'
    lastError.value = event.message || 'worker'
    console.error('python worker failed', event.message)
    // Drop the dead worker, so the next Run starts a fresh one instead of waiting forever.
    worker?.terminate()
    worker = null
    for (const [id, entry] of pending) {
      clearTimeout(entry.timer)
      pending.delete(id)
      entry.resolve({ ok: false, output: entry.output, error: 'worker', results: [] })
    }
  }
}

/** Kill a run that never came back, and answer it as a timeout. */
const stopRun = (id: number) => {
  const entry = pending.get(id)
  if (!entry) return
  pending.delete(id)
  worker?.terminate()
  worker = null
  status.value = 'idle'
  entry.resolve({ ok: false, output: entry.output, timedOut: true, results: [] })
}

export function usePython() {
  /** Start loading Python before the first run, so pressing Run feels quick. */
  const warm = () => startWorker()

  const run = (code: string, tests: Array<{ call: string, expect: string }> = [], timeout = RUN_TIMEOUT_MS) =>
    new Promise<RunResult>((resolve) => {
      startWorker()
      if (!worker) {
        resolve({ ok: false, output: [], error: 'no worker', results: [] })
        return
      }
      const id = nextId++
      pending.set(id, { resolve, output: [], timeout })
      worker.postMessage({ type: 'run', id, code, tests })
    })

  return { status: computed(() => status.value), error: computed(() => lastError.value), warm, run }
}
