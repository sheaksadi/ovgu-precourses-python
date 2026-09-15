/**
 * Cute names for anonymous audience members, and an avatar for any name.
 *
 * Someone who skips the name field on `/join` becomes "Sleepy Otter" or
 * "Verschlafener Otter", in the language they picked. A generated name is an
 * adjective and an animal (`CuteNameParts`), so it can be shown in either
 * language and read back from its text. German adjectives take the ending of the
 * animal's gender, since there is no article: Flauschiger Otter, Flauschige
 * Eule, Flauschiges Häschen.
 *
 * `avatarFor` works on any name, typed or generated: a generated name keeps the
 * sprite of its animal where the cast has one, everything else gets its initial.
 * The colour comes from the name, so one person looks the same on every screen.
 */
import type { Locale } from '~/composables/useI18n'

type Gender = 'm' | 'f' | 'n'

interface Animal {
  en: string
  de: string
  gender: Gender
  /** Sprite from `utils/sprites.ts`, when the cast has this animal. */
  sprite?: string
}

const ANIMALS: Animal[] = [
  { en: 'Cat', de: 'Katze', gender: 'f', sprite: 'cat' },
  { en: 'Kitten', de: 'Kätzchen', gender: 'n', sprite: 'cat' },
  { en: 'Puppy', de: 'Welpe', gender: 'm', sprite: 'dog' },
  { en: 'Bird', de: 'Vogel', gender: 'm', sprite: 'bird' },
  { en: 'Frog', de: 'Frosch', gender: 'm', sprite: 'frog' },
  { en: 'Fish', de: 'Fisch', gender: 'm', sprite: 'fish' },
  { en: 'Bunny', de: 'Häschen', gender: 'n', sprite: 'bunny' },
  { en: 'Otter', de: 'Otter', gender: 'm' },
  { en: 'Penguin', de: 'Pinguin', gender: 'm' },
  { en: 'Panda', de: 'Panda', gender: 'm' },
  { en: 'Hedgehog', de: 'Igel', gender: 'm' },
  { en: 'Koala', de: 'Koala', gender: 'm' },
  { en: 'Fox', de: 'Fuchs', gender: 'm' },
  { en: 'Owl', de: 'Eule', gender: 'f' },
  { en: 'Duck', de: 'Ente', gender: 'f' },
  { en: 'Hamster', de: 'Hamster', gender: 'm' },
]

/** English adjective, German stem without its ending. */
const ADJECTIVES: Array<{ en: string, de: string }> = [
  { en: 'Fluffy', de: 'Flauschig' },
  { en: 'Sleepy', de: 'Verschlafen' },
  { en: 'Tiny', de: 'Klein' },
  { en: 'Curious', de: 'Neugierig' },
  { en: 'Cheerful', de: 'Fröhlich' },
  { en: 'Clever', de: 'Schlau' },
  { en: 'Brave', de: 'Mutig' },
  { en: 'Cozy', de: 'Gemütlich' },
  { en: 'Giggly', de: 'Kichernd' },
  { en: 'Sparkly', de: 'Glitzernd' },
  { en: 'Snuggly', de: 'Kuschelig' },
  { en: 'Speedy', de: 'Flink' },
  { en: 'Dreamy', de: 'Verträumt' },
  { en: 'Jolly', de: 'Lustig' },
  { en: 'Bouncy', de: 'Hüpfend' },
  { en: 'Wiggly', de: 'Wuselig' },
]

const ENDING: Record<Gender, string> = { m: 'er', f: 'e', n: 'es' }

export interface CuteNameParts {
  adjective: number
  animal: number
}

export const rollCuteName = (random: () => number = Math.random): CuteNameParts => ({
  adjective: Math.floor(random() * ADJECTIVES.length),
  animal: Math.floor(random() * ANIMALS.length),
})

export function formatCuteName(parts: CuteNameParts, locale: Locale): string {
  const adjective = ADJECTIVES[parts.adjective]!
  const animal = ANIMALS[parts.animal]!
  return locale === 'de'
    ? `${adjective.de}${ENDING[animal.gender]} ${animal.de}`
    : `${adjective.en} ${animal.en}`
}

/** The parts behind a generated name in either language, or null for any other name. */
export function parseCuteName(name: string): CuteNameParts | null {
  for (let animal = 0; animal < ANIMALS.length; animal++) {
    for (let adjective = 0; adjective < ADJECTIVES.length; adjective++) {
      const parts = { adjective, animal }
      if (name === formatCuteName(parts, 'en') || name === formatCuteName(parts, 'de')) return parts
    }
  }
  return null
}

export const generateCuteName = (locale: Locale, random?: () => number) => formatCuteName(rollCuteName(random), locale)

/** Colours an avatar can take. */
export const AVATAR_COLORS = ['coral', 'sun', 'mint', 'sky', 'lavender', 'rose', 'peach'] as const
export type AvatarColor = typeof AVATAR_COLORS[number]

export interface Avatar {
  color: AvatarColor
  /** A cast sprite when the name ends in an animal the cast has. */
  sprite?: string
  /** First letter, for names without a sprite. */
  initial: string
}

const hash = (text: string) => [...text].reduce((sum, char) => (sum * 31 + char.codePointAt(0)!) >>> 0, 7)

export function avatarFor(name: string): Avatar {
  const clean = name.trim()
  const last = clean.split(/\s+/).pop()?.toLowerCase() ?? ''
  const animal = ANIMALS.find(entry => entry.sprite && (entry.en.toLowerCase() === last || entry.de.toLowerCase() === last))
  // A generated name gets the same colour in both languages.
  const parts = parseCuteName(clean)
  const key = parts ? `${parts.adjective}:${parts.animal}` : clean.toLowerCase()
  return {
    color: AVATAR_COLORS[hash(key) % AVATAR_COLORS.length]!,
    sprite: animal?.sprite,
    initial: ([...clean][0] ?? '?').toUpperCase(),
  }
}

/** Longest name the room accepts; longer input is cut, so toasts stay one line. */
export const NAME_MAX = 24

export const cleanName = (raw: unknown): string =>
  typeof raw === 'string' ? raw.replace(/\s+/g, ' ').trim().slice(0, NAME_MAX) : ''
