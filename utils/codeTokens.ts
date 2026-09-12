/**
 * Tiny tokenizer for the two languages the deck teaches with: plain pseudo-code
 * and Python. It exists so a code sample is data, not markup:
 *
 *   - every token carries a `kind`, which decides its colour,
 *   - every meaningful token carries a `link`, which is the *concept* it stands
 *     for (`loop`, `branch`, `output`, ...). Two tokens that share a link are
 *     the same idea in different words, so `FOR EACH` and `for` light up
 *     together, and so does the variable `total` on both sides,
 *   - every token carries a `key` that is stable across samples, so a morph
 *     from pseudo-code to Python moves the shared tokens instead of replacing
 *     the whole block.
 */

export type TokenKind =
  | 'keyword'
  | 'definition'
  | 'call'
  | 'builtin'
  | 'constant'
  | 'self'
  | 'decorator'
  | 'name'
  | 'string'
  | 'number'
  | 'operator'
  | 'bracket'
  | 'punct'
  | 'comment'

export interface CodeToken {
  text: string
  kind: TokenKind
  /** Nesting level of a bracket, so pairs can be coloured like an editor. */
  depth?: number
  /** Concept shared between pseudo-code and Python. Undefined for noise. */
  link?: string
  /** Unique inside one sample, identical across samples for the same concept. */
  key: string
}

export interface CodeLine {
  /** Leading spaces, in units of two, so indentation can be animated. */
  indent: number
  tokens: CodeToken[]
  /** Stable key for `v-for`. */
  key: string
}

const PY_KEYWORDS = new Set([
  'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif',
  'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in',
  'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try',
  'while', 'with', 'yield',
])

/** Keywords that introduce a name: the name after them is a definition. */
const PY_DEFINERS = new Set(['def', 'class'])

/** Coloured like an editor does: a function you did not write. */
const PY_BUILTINS = new Set([
  'abs', 'all', 'any', 'bool', 'dict', 'enumerate', 'filter', 'float', 'input',
  'int', 'len', 'list', 'map', 'max', 'min', 'open', 'print', 'range', 'round',
  'set', 'sorted', 'str', 'sum', 'tuple', 'type', 'zip',
])

const PY_CONSTANTS = new Set(['True', 'False', 'None'])
const PY_SELF = new Set(['self', 'cls'])

/**
 * Word (lowercased) to the concept it expresses, in either language. Keep
 * ordinary variable names (`total`, `sum`, `result`) out of this map: they link
 * to themselves already, and a concept here would tie them to unrelated syntax.
 */
const WORD_CONCEPTS: Record<string, string> = {
  // iteration
  for: 'loop', each: 'loop', repeat: 'loop', foreach: 'loop', every: 'loop',
  in: 'sequence', of: 'sequence', over: 'sequence',
  while: 'while', until: 'while',
  // branching
  if: 'branch', is: 'branch', when: 'branch', check: 'branch', then: 'branch',
  else: 'otherwise', otherwise: 'otherwise',
  // input / output
  print: 'output', say: 'output', show: 'output', display: 'output', output: 'output',
  input: 'input', ask: 'input',
  // definition
  def: 'define', define: 'define', function: 'define', recipe: 'define',
  return: 'return', give: 'return',
  // assignment
  set: 'assign', store: 'assign', let: 'assign', initialize: 'assign',
  // accumulation
  add: 'accumulate', increment: 'accumulate',
  // size
  len: 'length', count: 'length', size: 'length',
}

/** Operator to concept, so `←` and `=` are one idea. */
const OPERATOR_CONCEPTS: Record<string, string> = {
  '=': 'assign', '←': 'assign', '<-': 'assign', ':=': 'assign',
  '+=': 'accumulate',
  '>': 'compare', '<': 'compare', '>=': 'compare', '<=': 'compare',
  '≥': 'compare', '≤': 'compare', '==': 'compare', '!=': 'compare',
}

const TOKEN_PATTERNS: Array<[TokenKind, RegExp]> = [
  ['comment', /^(?:#|\/\/)[^\n]*/],
  ['string', /^(?:"[^"]*"|'[^']*')/],
  ['decorator', /^@[A-Za-z_][A-Za-z0-9_]*/],
  ['number', /^\d+(?:\.\d+)?/],
  // Unicode letters, so German pseudo-code (`Schlüssel`, `Tür`) stays one word.
  ['name', /^[\p{L}_][\p{L}\p{N}_]*/u],
  ['operator', /^(?:<-|:=|>=|<=|==|!=|\+=|-=|\*=|\/=|[=+\-*/%<>←≥≤])/],
  ['bracket', /^[()[\]{}]/],
  ['punct', /^[:,.]/],
]

function conceptOf(kind: TokenKind, text: string): string | undefined {
  if (kind === 'operator') return OPERATOR_CONCEPTS[text]
  if (kind === 'string' || kind === 'number') return `${kind}:${text}`
  if (kind === 'keyword' || kind === 'name' || kind === 'call' || kind === 'builtin'
    || kind === 'definition' || kind === 'constant' || kind === 'self') {
    const word = text.toLowerCase()
    return WORD_CONCEPTS[word] ?? `word:${word}`
  }
  return undefined
}

/**
 * Splits one source string into lines of tokens. `keySeed` only has to differ
 * between two samples that are shown at the same time and must *not* share
 * their unlinked tokens; samples that morph into each other should use the
 * same seed, which is the default.
 */
export function tokenizeCode(source: string): CodeLine[] {
  const seen = new Map<string, number>()
  let bracketDepth = 0
  const rawLines = source.replace(/\t/g, '  ').split('\n')

  // One indent level is whatever the sample uses for its first step, so a
  // 4-space Python body and a 2-space pseudo body line up at the same depth.
  const widths = rawLines
    .map(line => (/^ */.exec(line)?.[0].length ?? 0))
    .filter(width => width > 0)
  const step = widths.length ? Math.min(...widths) : 2

  return rawLines.map((rawLine, lineIndex) => {
    const indent = Math.round((/^ */.exec(rawLine)?.[0].length ?? 0) / step)
    let rest = rawLine.trimStart()
    const tokens: CodeToken[] = []
    let afterDefiner = false

    while (rest.length) {
      const space = /^\s+/.exec(rest)
      if (space) {
        rest = rest.slice(space[0].length)
        continue
      }

      let matched = false
      for (const [kind, pattern] of TOKEN_PATTERNS) {
        const hit = pattern.exec(rest)
        if (!hit) continue

        const text = hit[0]
        rest = rest.slice(text.length)
        matched = true

        let finalKind = kind
        if (kind === 'name') {
          const upperCased = text.length > 1 && text === text.toUpperCase() && /[A-Z]/.test(text)
          if (afterDefiner) finalKind = 'definition'
          else if (PY_CONSTANTS.has(text)) finalKind = 'constant'
          else if (PY_SELF.has(text)) finalKind = 'self'
          else if (PY_KEYWORDS.has(text) || upperCased) finalKind = 'keyword'
          else if (PY_BUILTINS.has(text) && rest.startsWith('(')) finalKind = 'builtin'
          else if (rest.startsWith('(')) finalKind = 'call'
          afterDefiner = finalKind === 'keyword' && PY_DEFINERS.has(text)
        } else {
          afterDefiner = false
        }

        let depth: number | undefined
        if (finalKind === 'bracket') {
          if (text === ')' || text === ']' || text === '}') bracketDepth = Math.max(0, bracketDepth - 1)
          depth = bracketDepth
          if (text === '(' || text === '[' || text === '{') bracketDepth += 1
        }

        const link = conceptOf(finalKind, text)
        const base = link ?? `${finalKind}:${text}`
        const occurrence = (seen.get(base) ?? 0) + 1
        seen.set(base, occurrence)

        tokens.push({ text, kind: finalKind, link, depth, key: `${base}#${occurrence}` })
        break
      }

      // Anything the patterns do not know keeps the line readable as one token.
      if (!matched) {
        const text = rest[0]!
        rest = rest.slice(1)
        const occurrence = (seen.get(text) ?? 0) + 1
        seen.set(text, occurrence)
        tokens.push({ text, kind: 'punct', key: `raw:${text}#${occurrence}` })
      }
    }

    return { indent, tokens, key: `line#${lineIndex}` }
  })
}

export interface MorphItem {
  key: string
  /** `null` marks a line break, which carries the indentation of the next line. */
  token: CodeToken | null
  indent: number
  line: number
  /** First token of its line, so it owns the indentation. */
  first: boolean
  /** A space belongs in front of this token. */
  space: boolean
}

/**
 * Flattens lines into one keyed stream for a `<TransitionGroup>`: tokens keep
 * their key across samples, line breaks are keyed by line number, so both move
 * with FLIP instead of being torn down.
 */
export function flattenForMorph(lines: CodeLine[]): MorphItem[] {
  const items: MorphItem[] = []
  lines.forEach((line, index) => {
    if (index > 0) {
      items.push({ key: `break#${index}`, token: null, indent: line.indent, line: index, first: false, space: false })
    }
    line.tokens.forEach((token, position) => items.push({
      key: token.key,
      token,
      indent: line.indent,
      line: index,
      first: position === 0,
      space: needsSpaceBefore(line.tokens[position - 1], token),
    }))
  })
  return items
}

/** True when two tokens should be treated as the same idea. */
export function sharesConcept(a: string | undefined, b: string | null): boolean {
  return Boolean(a && b && a === b)
}

const TIGHT_BEFORE = new Set([')', ']', '}', ',', ':', '.'])
const TIGHT_AFTER = new Set(['(', '[', '{', '.'])
const OPENERS = new Set(['(', '['])
/** A call, an index or a slice hugs the name in front of it. */
const CALLABLE: TokenKind[] = ['call', 'builtin', 'definition', 'name', 'self', 'constant']

/** Whether a space belongs between two rendered tokens. */
export function needsSpaceBefore(previous: CodeToken | undefined, token: CodeToken): boolean {
  if (!previous) return false
  if (TIGHT_BEFORE.has(token.text)) return false
  if (TIGHT_AFTER.has(previous.text)) return false
  if (OPENERS.has(token.text) && (CALLABLE.includes(previous.kind) || previous.text === ')' || previous.text === ']')) return false
  return true
}

/** One step of a `<CodeMorph>`. */
export interface MorphStage {
  label: string
  code: string
  variant?: 'pseudo' | 'python'
  note?: string
}
