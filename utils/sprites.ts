/**
 * The teaching cast: flat SVG sprites drawn on a 64×64 grid.
 *
 * Every sprite is markup only, so `<ArtSprite>` can colour it from the deck's
 * palette. Three conventions hold the set together:
 *
 *   - `currentColor` is the body. The component sets it from the `color` prop,
 *     so the same cat comes in coral, mint or lavender.
 *   - `var(--sprite-accent)` is the second colour: a beak, a roof, a lever knob.
 *   - Outlines inherit `stroke: var(--text)` at 2.5, and `fill="none"` means a
 *     line rather than a shape. Eyes and noses set their own fill.
 *
 * Shapes are deliberately blunt — circles, triangles, rounded rectangles — so a
 * sprite reads at 40px on a projector and never competes with the code beside it.
 */

export type SpriteCategory = 'critter' | 'prop' | 'place'

export interface Sprite {
  category: SpriteCategory
  /** What it is good for in an example. */
  use: string
  markup: string
}

const ink = (x: number, y: number, r = 2) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--text)" stroke="none"/>`

export const SPRITES: Record<string, Sprite> = {
  cat: {
    category: 'critter',
    use: 'The default protagonist. One object, many attributes',
    markup: `
      <path d="M21 57 Q21 41 32 41 Q43 41 43 57 Z" fill="currentColor"/>
      <path d="M43 53 Q57 52 53 40"/>
      <circle cx="25" cy="55" r="4" fill="#FFFFFF"/>
      <circle cx="39" cy="55" r="4" fill="#FFFFFF"/>
      <path d="M17 20 L15 5 L30 13 Z" fill="currentColor"/>
      <path d="M47 20 L49 5 L34 13 Z" fill="currentColor"/>
      <circle cx="32" cy="27" r="16" fill="currentColor"/>
      <path d="M20 17 L19 10 L26 13.5 Z" fill="var(--sprite-accent)" stroke="none"/>
      <path d="M44 17 L45 10 L38 13.5 Z" fill="var(--sprite-accent)" stroke="none"/>
      <ellipse cx="19" cy="33" rx="3.6" ry="2.3" fill="var(--sprite-accent)" stroke="none" opacity="0.8"/>
      <ellipse cx="45" cy="33" rx="3.6" ry="2.3" fill="var(--sprite-accent)" stroke="none" opacity="0.8"/>
      <circle cx="26" cy="26" r="3.6" fill="var(--text)" stroke="none"/>
      <circle cx="38" cy="26" r="3.6" fill="var(--text)" stroke="none"/>
      <circle cx="24.7" cy="24.7" r="1.2" fill="#FFFFFF" stroke="none"/>
      <circle cx="36.7" cy="24.7" r="1.2" fill="#FFFFFF" stroke="none"/>
      <path d="M30.3 31 L33.7 31 L32 33.2 Z" fill="var(--sprite-accent)" stroke="none"/>
      <path d="M28.5 34 Q30.2 36.4 32 34 Q33.8 36.4 35.5 34" stroke-width="1.8"/>`,
  },
  'cat-loaf': {
    category: 'critter',
    use: 'Cat at rest. A value sitting still, a settled state',
    markup: `
      <path d="M15 27 L13 11 L29 20 Z" fill="currentColor"/>
      <path d="M49 27 L51 11 L35 20 Z" fill="currentColor"/>
      <path d="M7 54 Q7 23 32 23 Q57 23 57 54 Z" fill="currentColor"/>
      <path d="M55 52 Q64 48 60 38"/>
      <path d="M18 24 L17 15 L25 19.5 Z" fill="var(--sprite-accent)" stroke="none"/>
      <path d="M46 24 L47 15 L39 19.5 Z" fill="var(--sprite-accent)" stroke="none"/>
      <ellipse cx="16" cy="43" rx="4" ry="2.5" fill="var(--sprite-accent)" stroke="none" opacity="0.8"/>
      <ellipse cx="48" cy="43" rx="4" ry="2.5" fill="var(--sprite-accent)" stroke="none" opacity="0.8"/>
      <path d="M21 40 Q25 34 29 40"/>
      <path d="M35 40 Q39 34 43 40"/>
      <path d="M30.3 43 L33.7 43 L32 45.2 Z" fill="var(--sprite-accent)" stroke="none"/>
      <path d="M28.5 46 Q30.2 48.4 32 46 Q33.8 48.4 35.5 46" stroke-width="1.8"/>`,
  },
  'cat-peek': {
    category: 'critter',
    use: 'Cat in a container. A value inside a box or a list',
    markup: `
      <path d="M17 18 L15 4 L29 12 Z" fill="currentColor"/>
      <path d="M47 18 L49 4 L35 12 Z" fill="currentColor"/>
      <circle cx="32" cy="26" r="15" fill="currentColor"/>
      <path d="M20 15 L19 8 L26 12 Z" fill="var(--sprite-accent)" stroke="none"/>
      <path d="M44 15 L45 8 L38 12 Z" fill="var(--sprite-accent)" stroke="none"/>
      <ellipse cx="20" cy="31" rx="3.4" ry="2.2" fill="var(--sprite-accent)" stroke="none" opacity="0.8"/>
      <ellipse cx="44" cy="31" rx="3.4" ry="2.2" fill="var(--sprite-accent)" stroke="none" opacity="0.8"/>
      <circle cx="26" cy="25" r="3.4" fill="var(--text)" stroke="none"/>
      <circle cx="38" cy="25" r="3.4" fill="var(--text)" stroke="none"/>
      <circle cx="24.8" cy="23.8" r="1.1" fill="#FFFFFF" stroke="none"/>
      <circle cx="36.8" cy="23.8" r="1.1" fill="#FFFFFF" stroke="none"/>
      <path d="M30.3 30 L33.7 30 L32 32.2 Z" fill="var(--sprite-accent)" stroke="none"/>
      <path d="M28.5 33 Q30.2 35.4 32 33 Q33.8 35.4 35.5 33" stroke-width="1.8"/>
      <rect x="5" y="40" width="54" height="19" rx="4" fill="var(--sprite-accent)"/>
      <rect x="17" y="34" width="11" height="8" rx="4" fill="#FFFFFF"/>
      <rect x="36" y="34" width="11" height="8" rx="4" fill="#FFFFFF"/>`,
  },
  'cat-sleep': {
    category: 'critter',
    use: 'Cat asleep. Waiting, idle, or a finished job',
    markup: `
      <ellipse cx="35" cy="40" rx="23" ry="15" fill="currentColor"/>
      <path d="M55 48 Q60 34 44 31"/>
      <path d="M12 32 L9 20 L20 27 Z" fill="currentColor"/>
      <path d="M26 30 L29 19 L18 25 Z" fill="currentColor"/>
      <circle cx="19" cy="38" r="12" fill="currentColor"/>
      <path d="M13.5 29.5 L12 24 L18 27.5 Z" fill="var(--sprite-accent)" stroke="none"/>
      <path d="M25 28.5 L26.5 23 L20.5 26 Z" fill="var(--sprite-accent)" stroke="none"/>
      <ellipse cx="11" cy="42" rx="3.4" ry="2.2" fill="var(--sprite-accent)" stroke="none" opacity="0.8"/>
      <path d="M14 38 Q17 35 20 38"/>
      <path d="M24 39 Q26.5 36.5 29 39"/>
      <path d="M42 12 H50 L42 21 H50" stroke="var(--sprite-accent)" stroke-width="2.5"/>`,
  },
  'cat-stand': {
    category: 'critter',
    use: 'Cat walking. Movement, steps, one pass of a loop',
    markup: `
      <path d="M11 33 Q1 25 8 15"/>
      <rect x="16" y="40" width="7" height="14" rx="3.5" fill="currentColor"/>
      <rect x="26" y="40" width="7" height="14" rx="3.5" fill="currentColor"/>
      <rect x="36" y="40" width="7" height="14" rx="3.5" fill="currentColor"/>
      <ellipse cx="29" cy="34" rx="19" ry="12" fill="currentColor"/>
      <path d="M40 19 L39 7 L48 14 Z" fill="currentColor"/>
      <path d="M54 19 L57 8 L47 13 Z" fill="currentColor"/>
      <circle cx="47" cy="25" r="12" fill="currentColor"/>
      <path d="M42 17 L41.5 11 L47 14.5 Z" fill="var(--sprite-accent)" stroke="none"/>
      <path d="M53 17 L54.5 11 L48.5 14 Z" fill="var(--sprite-accent)" stroke="none"/>
      <ellipse cx="40" cy="30" rx="3.2" ry="2" fill="var(--sprite-accent)" stroke="none" opacity="0.8"/>
      <circle cx="43" cy="24" r="2.9" fill="var(--text)" stroke="none"/>
      <circle cx="52" cy="24" r="2.9" fill="var(--text)" stroke="none"/>
      <circle cx="42" cy="23" r="1" fill="#FFFFFF" stroke="none"/>
      <circle cx="51" cy="23" r="1" fill="#FFFFFF" stroke="none"/>
      <path d="M45.8 28.5 L49.2 28.5 L47.5 30.7 Z" fill="var(--sprite-accent)" stroke="none"/>`,
  },
  dog: {
    category: 'critter',
    use: 'A second instance of the same class',
    markup: `
      <path d="M16 54 Q16 36 32 36 Q48 36 48 54 Z" fill="currentColor"/>
      <path d="M20 18 Q9 25 13 39 Q21 40 24 27 Z" fill="currentColor"/>
      <path d="M44 18 Q55 25 51 39 Q43 40 40 27 Z" fill="currentColor"/>
      <path d="M48 50 Q59 45 55 33"/>
      <circle cx="32" cy="26" r="12" fill="currentColor"/>
      <ellipse cx="32" cy="33" rx="8" ry="5.5" fill="#FFFFFF"/>
      ${ink(27, 23)}${ink(37, 23)}
      <ellipse cx="32" cy="30" rx="3" ry="2.2" fill="var(--text)" stroke="none"/>`,
  },
  bird: {
    category: 'critter',
    use: 'Something that moves — good for loops and steps',
    markup: `
      <ellipse cx="29" cy="36" rx="17" ry="14" fill="currentColor"/>
      <circle cx="41" cy="22" r="10" fill="currentColor"/>
      <path d="M50 19 L61 24 L50 29 Z" fill="var(--sprite-accent)"/>
      <path d="M21 34 Q30 28 38 38 Q28 45 21 34 Z" fill="var(--sprite-accent)"/>
      ${ink(43, 20)}
      <path d="M25 50 V58 M36 50 V58"/>`,
  },
  frog: {
    category: 'critter',
    use: 'True / False. The eyes make a boolean obvious',
    markup: `
      <ellipse cx="16" cy="52" rx="8" ry="4.5" fill="currentColor"/>
      <ellipse cx="48" cy="52" rx="8" ry="4.5" fill="currentColor"/>
      <ellipse cx="32" cy="41" rx="19" ry="14" fill="currentColor"/>
      <circle cx="23" cy="21" r="8" fill="currentColor"/>
      <circle cx="41" cy="21" r="8" fill="currentColor"/>
      <circle cx="23" cy="21" r="4" fill="#FFFFFF"/>
      <circle cx="41" cy="21" r="4" fill="#FFFFFF"/>
      ${ink(23, 21, 2)}${ink(41, 21, 2)}
      <path d="M24 44 Q32 50 40 44"/>`,
  },
  fish: {
    category: 'critter',
    use: 'An item inside a container — lists, aquariums, buckets',
    markup: `
      <ellipse cx="29" cy="33" rx="19" ry="13" fill="currentColor"/>
      <path d="M47 33 L61 23 L61 43 Z" fill="var(--sprite-accent)"/>
      <path d="M25 21 Q31 12 38 22" fill="var(--sprite-accent)"/>
      ${ink(20, 30, 2.5)}
      <path d="M10 33 Q13 37 17 34"/>`,
  },
  bunny: {
    category: 'critter',
    use: 'Counting and multiplication — they add up fast',
    markup: `
      <path d="M26 20 Q21 4 28 3 Q34 4 30 20 Z" fill="currentColor"/>
      <path d="M38 20 Q43 4 36 3 Q30 4 34 20 Z" fill="currentColor"/>
      <ellipse cx="32" cy="45" rx="15" ry="12" fill="currentColor"/>
      <circle cx="32" cy="29" r="11" fill="currentColor"/>
      ${ink(28, 28)}${ink(36, 28)}
      <path d="M29 33 L35 33 L32 36.5 Z" fill="var(--sprite-accent)"/>
      <circle cx="46" cy="51" r="5" fill="#FFFFFF"/>`,
  },

  lever: {
    category: 'prop',
    use: 'A boolean you can see. Pass state="on" to flip it',
    markup: `
      <rect x="12" y="42" width="40" height="12" rx="4" fill="currentColor"/>
      <path d="M32 44 L18 20" stroke-width="5"/>
      <circle cx="18" cy="18" r="6" fill="var(--sprite-accent)"/>
      ${ink(32, 44, 3)}`,
  },
  'lever-on': {
    category: 'prop',
    use: 'The same lever, switched',
    markup: `
      <rect x="12" y="42" width="40" height="12" rx="4" fill="currentColor"/>
      <path d="M32 44 L46 20" stroke-width="5"/>
      <circle cx="46" cy="18" r="6" fill="var(--sprite-accent)"/>
      ${ink(32, 44, 3)}`,
  },
  box: {
    category: 'prop',
    use: 'A variable: a labelled box that holds one thing',
    markup: `
      <rect x="12" y="22" width="40" height="30" rx="4" fill="currentColor"/>
      <path d="M12 32 H52"/>
      <path d="M32 32 V52"/>
      <rect x="25" y="15" width="14" height="7" rx="2" fill="var(--sprite-accent)"/>`,
  },
  key: {
    category: 'prop',
    use: 'A dictionary key, or access to a branch',
    markup: `
      <circle cx="21" cy="32" r="11" fill="currentColor"/>
      <circle cx="21" cy="32" r="4" fill="#FFFFFF"/>
      <path d="M32 32 H54" stroke-width="5"/>
      <path d="M45 33 V41 M52 33 V39"/>`,
  },
  door: {
    category: 'prop',
    use: 'A branch: if it opens, go through',
    markup: `
      <rect x="16" y="10" width="32" height="46" rx="3" fill="currentColor"/>
      <rect x="22" y="16" width="20" height="15" rx="2" fill="var(--sprite-accent)"/>
      ${ink(40, 42, 2.5)}`,
  },
  ball: {
    category: 'prop',
    use: 'A value being passed around',
    markup: `
      <circle cx="32" cy="32" r="19" fill="currentColor"/>
      <path d="M13 32 Q32 19 51 32"/>
      <path d="M13 32 Q32 45 51 32"/>`,
  },
  book: {
    category: 'prop',
    use: 'A module, a recipe, a function definition',
    markup: `
      <rect x="14" y="12" width="36" height="40" rx="3" fill="currentColor"/>
      <path d="M22 12 V52"/>
      <rect x="28" y="22" width="16" height="4" rx="2" fill="var(--sprite-accent)"/>
      <rect x="28" y="32" width="12" height="4" rx="2" fill="var(--sprite-accent)"/>`,
  },
  basket: {
    category: 'prop',
    use: 'A list. Put things in, take things out',
    markup: `
      <path d="M20 28 Q32 8 44 28"/>
      <path d="M13 26 H51 L46 53 H18 Z" fill="currentColor"/>
      <path d="M21 38 H43"/>`,
  },
  flag: {
    category: 'prop',
    use: 'A goal, a break, the end of a loop',
    markup: `
      <path d="M18 8 V57" stroke-width="4"/>
      <path d="M18 12 L47 20 L18 29 Z" fill="currentColor"/>`,
  },

  house: {
    category: 'place',
    use: 'One entry in a street — the classic list element',
    markup: `
      <path d="M8 31 L32 10 L56 31 Z" fill="var(--sprite-accent)"/>
      <rect x="16" y="29" width="32" height="25" rx="2" fill="currentColor"/>
      <rect x="28" y="39" width="10" height="15" rx="1" fill="#FFFFFF"/>
      <rect x="19" y="34" width="7" height="7" rx="1" fill="#FFFFFF"/>`,
  },
  road: {
    category: 'place',
    use: 'A sequence. Lay several side by side for a program',
    markup: `
      <rect x="3" y="18" width="58" height="28" rx="4" fill="currentColor"/>
      <path d="M10 32 H21 M28 32 H36 M43 32 H54" stroke="#FFFFFF" stroke-width="4"/>`,
  },
  tree: {
    category: 'place',
    use: 'Scenery, or a node when you get to structures',
    markup: `
      <rect x="28" y="33" width="8" height="21" rx="2" fill="var(--sprite-accent)"/>
      <circle cx="32" cy="25" r="16" fill="currentColor"/>`,
  },
  hill: {
    category: 'place',
    use: 'Background, or a threshold to climb',
    markup: `
      <path d="M4 50 Q32 12 60 50 Z" fill="currentColor"/>
      <path d="M2 50 H62" stroke-width="3"/>`,
  },
  fence: {
    category: 'place',
    use: 'A boundary: a range, a limit, a guard clause',
    markup: `
      <path d="M11 24 L15 18 L19 24 V54 H11 Z" fill="currentColor"/>
      <path d="M28 24 L32 18 L36 24 V54 H28 Z" fill="currentColor"/>
      <path d="M45 24 L49 18 L53 24 V54 H45 Z" fill="currentColor"/>
      <rect x="6" y="28" width="52" height="7" rx="2" fill="currentColor"/>
      <rect x="6" y="41" width="52" height="7" rx="2" fill="currentColor"/>`,
  },
  sign: {
    category: 'place',
    use: 'A label, a print statement, a direction',
    markup: `
      <path d="M32 30 V57" stroke-width="4"/>
      <path d="M11 11 H43 L53 21 L43 31 H11 Z" fill="currentColor"/>
      <path d="M19 21 H37" stroke="#FFFFFF" stroke-width="3"/>`,
  },
}

export type SpriteName = keyof typeof SPRITES

export const spritesIn = (category: SpriteCategory) =>
  (Object.keys(SPRITES) as SpriteName[]).filter(name => SPRITES[name]!.category === category)
