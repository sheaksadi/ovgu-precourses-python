/**
 * Code tasks: problems where students write a function instead of an answer.
 *
 * There is no single number to submit, so the device runs the code with the
 * bundled Pyodide (`composables/usePython.ts`) and checks it against the tests
 * here. Tests are not secret — they say exactly what the function must do — but
 * the last ones only run on Submit, so nobody tunes their code to one example.
 *
 * Function and parameter names follow the language, like the walkthroughs, and
 * the room counts a passing task exactly like a solved puzzle: one star, a
 * toast, a place on the leaderboard (`server/api/tasks/`).
 *
 * Text lives in `problems.<id>` in `locales/`, as for puzzles.
 */
import type { Locale } from '~/composables/useI18n'

export interface CodeTest {
  /** Python expression, evaluated after the student's code. */
  call: string
  /** What `repr()` of the result must be. */
  expect: string
  /** Only checked on Submit, not on Run. */
  hidden?: boolean
}

export interface CodeTask {
  id: string
  names: Record<Locale, Record<string, string>>
  starter: (names: Record<string, string>) => string
  tests: (names: Record<string, string>) => CodeTest[]
}

const functionsGreet: CodeTask = {
  id: 'functions-greet',
  names: {
    de: { fn: 'hallo', a: 'name', greeting: 'Hallo', todo: 'dein Code' },
    en: { fn: 'hello', a: 'name', greeting: 'Hello', todo: 'your code' },
  },
  starter: n => [
    `def ${n.fn}(${n.a}):`,
    `    # ${n.todo}`,
    '    return ""',
    '',
  ].join('\n'),
  // Python shows a string with its quotes, so that is what the tests compare.
  tests: n => [
    { call: `${n.fn}("Momo")`, expect: `'${n.greeting}, Momo!'` },
    { call: `${n.fn}("Bello")`, expect: `'${n.greeting}, Bello!'` },
    { call: `${n.fn}("")`, expect: `'${n.greeting}, !'`, hidden: true },
  ],
}

const functionsArea: CodeTask = {
  id: 'functions-area',
  names: {
    de: { fn: 'flaeche', a: 'breite', b: 'hoehe', todo: 'dein Code' },
    en: { fn: 'area', a: 'width', b: 'height', todo: 'your code' },
  },
  starter: n => [
    `def ${n.fn}(${n.a}, ${n.b}):`,
    `    # ${n.todo}`,
    '    return 0',
    '',
  ].join('\n'),
  tests: n => [
    { call: `${n.fn}(3, 4)`, expect: '12' },
    { call: `${n.fn}(5, 5)`, expect: '25' },
    { call: `${n.fn}(1, 9)`, expect: '9', hidden: true },
    { call: `${n.fn}(0, 7)`, expect: '0', hidden: true },
  ],
}

export const CODE_TASKS: Record<string, CodeTask> = {
  [functionsGreet.id]: functionsGreet,
  [functionsArea.id]: functionsArea,
}

export const isCodeTask = (id: string) => id in CODE_TASKS
