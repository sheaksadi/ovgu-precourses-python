/**
 * Runs a student's Python in the browser, off the main thread.
 *
 * A module worker: it imports the Pyodide build that `scripts/copy-pyodide.mjs`
 * put in `public/pyodide`, so nothing is fetched from the internet and nothing
 * needs bundling. Plain JavaScript, served as a static file.
 *
 * Messages in:  { type: 'run', id, code, tests: [{ call, expect }] }
 * Messages out: { type: 'ready' | 'failed' | 'started' | 'out' | 'done', ... }
 *
 * Every run gets a fresh namespace, so a name from the last run cannot make a
 * broken program look right. Endless loops are not stopped here: the page
 * terminates the worker and starts a new one (`composables/usePython.ts`).
 */
import { loadPyodide } from '/pyodide/pyodide.mjs'

let runtime = null

const post = message => self.postMessage(message)

async function ready() {
  if (!runtime) {
    runtime = await loadPyodide({ indexURL: '/pyodide/' })
    // input() would wait forever in a worker; it reads an empty line instead.
    runtime.setStdin({ stdin: () => '' })
  }
  return runtime
}

/** The last line of a Python traceback: what a beginner needs, without the frames. */
function shortError(error) {
  const text = String(error?.message ?? error)
  const lines = text.trim().split('\n').filter(Boolean)
  return lines[lines.length - 1] || text
}

self.onmessage = async (event) => {
  const message = event.data
  if (!message || message.type !== 'run') return
  const { id, code, tests = [] } = message

  let python
  try {
    python = await ready()
  } catch (error) {
    post({ type: 'done', id, ok: false, error: shortError(error), results: [], output: [] })
    return
  }

  post({ type: 'started', id })

  const output = []
  const collect = (line) => {
    output.push(line)
    post({ type: 'out', id, line })
  }
  python.setStdout({ batched: collect })
  python.setStderr({ batched: collect })

  const namespace = python.globals.get('dict')()
  try {
    python.runPython(code, { globals: namespace })
  } catch (error) {
    namespace.destroy()
    post({ type: 'done', id, ok: false, error: shortError(error), results: [], output })
    return
  }

  const results = []
  for (const test of tests) {
    try {
      const got = python.runPython(`repr(${test.call})`, { globals: namespace })
      results.push({ call: test.call, expect: test.expect, got, pass: got === test.expect })
    } catch (error) {
      results.push({ call: test.call, expect: test.expect, got: shortError(error), pass: false })
    }
  }
  namespace.destroy()

  post({ type: 'done', id, ok: true, results, output })
}

ready().then(() => post({ type: 'ready' })).catch(error => post({ type: 'failed', error: shortError(error) }))
