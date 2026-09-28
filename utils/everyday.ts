/**
 * The everyday decisions shared by the two if/else intuition scenes:
 * `LessonEverydayIf` (before any code) and `LessonEverydayCode` (the same
 * cards, turned into pseudo-code and Python). The words live in
 * `everyday.scenarios` in `locales/`; the pictures and colours live here.
 */

export type EverydayIcon = 'rain' | 'light' | 'battery' | 'clock' | 'pizza' | 'lock'

export interface EverydayScenario {
  icon: EverydayIcon
  /** The question as someone would ask it: "Regnet es?" */
  question: string
  /** The same question as the middle of a "wenn" sentence: "es regnet". */
  condition: string
  yes: string
  no: string
}

/** The part of the pattern a row of a card is. */
export type EverydayKind = 'if' | 'elif' | 'then' | 'else'

/**
 * One row of a card up close. `key` ties it to the card's own row (`if`,
 * `then`, `else`) so it grows out of that row; any other key is a new row.
 */
export interface EverydayDetailRow {
  key: string
  kind: EverydayKind
  text: string
  /** Nesting level, for an if inside an if. */
  depth?: number
  /** Pseudo-code lines this row stands for, 1-based. */
  lines?: number[]
}

/** One card taken to Python, as `everydayCode.variations` in `locales/` lists it. */
export interface EverydayVariation {
  /** Index into `everyday.scenarios`. */
  card: number
  titles: { zoom?: string, card: string, python: string, flip?: string }
  notes: { zoom?: string, card: string, python: string, flip?: string }
  rows: EverydayDetailRow[]
  pseudo: string
  python: string
  output: string
  /** Python lines that run, 1-based. */
  focus: number[]
  /** The same code with the value flipped, for a step of its own. */
  flip?: { python: string, output: string, focus: number[] }
}

/** Line icons in a 24×24 box. `.fill` parts take the card's accent. */
export const EVERYDAY_ICONS: Record<EverydayIcon, string> = {
  rain: '<path d="M7 15a4 4 0 0 1 .4-8A5 5 0 0 1 17 8.6 3.3 3.3 0 0 1 17 15Z"/><path d="M9 18l-1 2.5M13 18l-1 2.5M17 18l-1 2.5"/>',
  light: '<rect x="8" y="2" width="8" height="20" rx="3"/><circle cx="12" cy="7" r="1.8" class="fill"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="17" r="1.8"/>',
  battery: '<rect x="2.5" y="7" width="17" height="10" rx="2"/><path d="M21.5 10.5v3"/><rect x="5" y="9.5" width="3" height="5" rx="0.6" class="fill"/>',
  clock: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9v4l2.8 1.8M4.5 5.5 6.8 3.5M19.5 5.5l-2.3-2"/>',
  pizza: '<path d="M12 21 3.2 6.5C8.8 3.3 15.2 3.3 20.8 6.5Z"/><circle cx="10" cy="9.5" r="1.1" class="fill"/><circle cx="14.2" cy="10.5" r="1.1" class="fill"/><circle cx="12" cy="15" r="1.1" class="fill"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10.5" rx="2.2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2.5"/>',
}

const ACCENTS = ['sky', 'coral', 'mint', 'lavender', 'sun', 'rose']

/** One accent per card, in the order the locale lists them. */
export const everydayAccent = (index: number) => `var(--${ACCENTS[index % ACCENTS.length]})`

/**
 * How a card wears its accent. Most accents are strong enough to tint the icon
 * disc at a fifth and to outline the card as they are; `--sun` is so pale that
 * a fifth of it is white and an outline of it vanishes, so it fills the disc
 * outright and outlines in a deeper gold.
 */
export function everydayTint(accent: string) {
  const pale = accent.includes('--sun')
  return {
    '--accent': accent,
    '--accent-fill': pale ? accent : `color-mix(in srgb, ${accent} 22%, var(--bg))`,
    '--accent-line': pale ? `color-mix(in srgb, ${accent} 35%, #E0A100)` : accent,
  }
}
