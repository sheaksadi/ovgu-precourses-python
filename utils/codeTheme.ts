/**
 * One colour table for both code components, so a token looks the same
 * wherever it is drawn.
 *
 * Both languages sit on the same light surface — Python is not a dark box any
 * more — so there is one ink map, tuned for `--bg-off`: keywords lavender,
 * definitions and calls sky, builtins and operators coral, strings rose,
 * numbers sky, comments muted and italic. Brackets cycle by nesting depth, the
 * way bracket-pair colouring does.
 */
import type { CodeToken, TokenKind } from '~/utils/codeTokens'

export type CodeVariant = 'python' | 'pseudo'

const INK: Record<TokenKind, string> = {
  keyword: 'var(--lavender)',
  definition: 'var(--sky)',
  call: 'var(--sky)',
  builtin: 'var(--coral)',
  constant: 'var(--coral)',
  self: 'var(--coral)',
  decorator: 'var(--coral)',
  name: 'var(--text)',
  string: 'var(--rose)',
  number: 'var(--sky)',
  operator: 'var(--coral)',
  bracket: 'var(--lavender)',
  punct: 'var(--text-muted)',
  comment: 'var(--text-muted)',
}

/** Nesting colours for bracket pairs, innermost repeating. */
const BRACKET_CYCLE = ['var(--lavender)', 'var(--rose)', 'var(--sky)']

/** Accent per language: the tab underline, the label, the lit line's rail. */
export const codeAccent = (variant: CodeVariant) =>
  variant === 'python' ? 'var(--mint)' : 'var(--lavender)'

export function codeInk(_variant: CodeVariant, token: CodeToken): string {
  if (token.kind === 'bracket') return BRACKET_CYCLE[(token.depth ?? 0) % BRACKET_CYCLE.length]!
  return INK[token.kind]
}
