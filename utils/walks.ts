/**
 * Solution walkthroughs: the code of a problem's solution, played line by line.
 *
 * A walk is staged over sub-slides like the lessons. Each stage may zoom the
 * code to a range of lines and trace it: every step lights a line, may set
 * variables, may show a condition with its result, may print. A stage opens on
 * the state the previous stages left, so the slides cut into each other.
 *
 * Variable names follow the language (`names`), so the code on the slide
 * matches the code the students wrote. Headlines and notes live in `locales/`
 * under `walks.<id>`. Rendered by `components/problems/SolutionWalk.vue`.
 */
import type { Locale } from '~/composables/useI18n'

export interface WalkStep {
  /** 1-based line to light. */
  line: number
  /** Variables by key (see `names`), set after the line ran. */
  set?: Record<string, string | number>
  /** A condition with the values filled in, and what it came to. */
  check?: string
  result?: boolean
  /** A line of output. */
  out?: string
}

export interface WalkStage {
  /** First and last line to zoom to; none shows the whole code. */
  zoom?: [number, number]
  steps?: WalkStep[]
}

export interface Walk {
  /** Display names per language for every key used in `code` and `set`. */
  names: Record<Locale, Record<string, string>>
  code: (names: Record<string, string>) => string
  /** Order of the variables in the variables card. */
  vars: string[]
  stages: WalkStage[]
}

const loopsFish: Walk = {
  names: {
    de: { list: 'fische', item: 'fisch', kept: 'behalten', belly: 'bauch', eaten: 'gefressen', part: 'Teil' },
    en: { list: 'fish', item: 'size', kept: 'kept', belly: 'belly', eaten: 'eaten', part: 'Part' },
  },
  code: n => [
    `${n.list} = [12, 25, 20, 7, 31]`,
    '',
    `# ${n.part} 1`,
    `${n.kept} = 0`,
    `for ${n.item} in ${n.list}:`,
    `    if ${n.item} >= 20:`,
    `        ${n.kept} = ${n.kept} + 1`,
    `print(${n.kept})`,
    '',
    `# ${n.part} 2`,
    `${n.belly} = 0`,
    `${n.eaten} = 0`,
    `for ${n.item} in ${n.list}:`,
    `    if ${n.belly} + ${n.item} > 50:`,
    '        break',
    `    ${n.belly} = ${n.belly} + ${n.item}`,
    `    ${n.eaten} = ${n.eaten} + 1`,
    `print(${n.eaten})`,
  ].join('\n'),
  vars: ['item', 'kept', 'belly', 'eaten'],
  stages: [
    {},
    {
      zoom: [4, 8],
      steps: [
        { line: 4, set: { kept: 0 } },
        { line: 5, set: { item: 12 } },
        { line: 6, check: '12 >= 20', result: false },
        { line: 5, set: { item: 25 } },
        { line: 6, check: '25 >= 20', result: true },
        { line: 7, set: { kept: 1 } },
        { line: 5, set: { item: 20 } },
        { line: 6, check: '20 >= 20', result: true },
        { line: 7, set: { kept: 2 } },
        { line: 5, set: { item: 7 } },
        { line: 6, check: '7 >= 20', result: false },
        { line: 5, set: { item: 31 } },
        { line: 6, check: '31 >= 20', result: true },
        { line: 7, set: { kept: 3 } },
        { line: 8, out: '3' },
      ],
    },
    {
      zoom: [11, 18],
      steps: [
        { line: 11, set: { belly: 0 } },
        { line: 12, set: { eaten: 0 } },
        { line: 13, set: { item: 12 } },
        { line: 14, check: '0 + 12 > 50', result: false },
        { line: 16, set: { belly: 12 } },
        { line: 17, set: { eaten: 1 } },
        { line: 13, set: { item: 25 } },
        { line: 14, check: '12 + 25 > 50', result: false },
        { line: 16, set: { belly: 37 } },
        { line: 17, set: { eaten: 2 } },
        { line: 13, set: { item: 20 } },
        { line: 14, check: '37 + 20 > 50', result: true },
        { line: 15 },
        { line: 18, out: '2' },
      ],
    },
    {},
  ],
}

export const WALKS: Record<string, Walk> = {
  'loops-fish': loopsFish,
}
