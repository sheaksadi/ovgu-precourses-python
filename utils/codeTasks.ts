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
  /** What the student reads, when the expression itself is noisy. */
  show?: string
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

/** The last one: a class, not a function. Tests build it and then use it. */
const objectsCat: CodeTask = {
  id: 'objects-cat',
  names: {
    de: { cls: 'Katze', a: 'name', b: 'hunger', fn: 'fuettern', c: 'menge', todo: 'dein Code' },
    en: { cls: 'Katze', a: 'name', b: 'hunger', fn: 'fuettern', c: 'menge', todo: 'your code' },
  },
  starter: n => [
    `class ${n.cls}:`,
    `    def __init__(self, ${n.a}, ${n.b}):`,
    `        # ${n.todo}`,
    '        pass',
    '',
    `    def ${n.fn}(self, ${n.c}):`,
    `        # ${n.todo}`,
    '        pass',
    '',
  ].join('\n'),
  tests: n => [
    { call: `${n.cls}("Momo", 8).${n.b}`, expect: '8' },
    { call: `${n.cls}("Momo", 8).${n.a}`, expect: "'Momo'" },
    // Feeding returns nothing; what counts is the value left in the object.
    {
      call: `(lambda k: (k.${n.fn}(5), k.${n.b})[1])(${n.cls}("Momo", 8))`,
      show: `${n.cls}("Momo", 8).${n.fn}(5) ➜ .${n.b}`,
      expect: '3',
    },
    {
      call: `(lambda k: (k.${n.fn}(1), k.${n.fn}(1), k.${n.b})[2])(${n.cls}("Kiki", 5))`,
      show: `${n.cls}("Kiki", 5).${n.fn}(1) 2x ➜ .${n.b}`,
      expect: '3',
      hidden: true,
    },
    {
      call: `(lambda k: (k.${n.fn}(0), k.${n.b})[1])(${n.cls}("Bello", 3))`,
      show: `${n.cls}("Bello", 3).${n.fn}(0) ➜ .${n.b}`,
      expect: '3',
      hidden: true,
    },
  ],
}

export const CODE_TASKS: Record<string, CodeTask> = {
  [functionsGreet.id]: functionsGreet,
  [functionsArea.id]: functionsArea,
  [objectsCat.id]: objectsCat,
}

export const isCodeTask = (id: string) => id in CODE_TASKS
