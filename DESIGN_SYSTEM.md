# Design System Documentation

## Overview

This is a Nuxt 3 presentation framework for teaching Python to beginners. The design system takes its restraint from 3Blue1Brown and its flat pastel look from Jet Lag The Game.

## Design Philosophy

**Minimal Pastel**: White backgrounds, JetBrains Mono everywhere, bold pastel color blocks, flat graphics, no shadows, thick 2px borders.

**Educational Focus**: Every animation serves pedagogy. Motion is state, never decoration: nothing loops on its own, and the deck holds still until the presenter moves it. Pseudo-code bridges concepts to syntax, and a transform moves the words that survive instead of swapping one block for another.

## Directory Structure

```
pages/design/           # Design system slides (PRE-0010 to PRE-0032)
  system.vue           # Cover page
  primary-colors.vue   # Coral, Mint, Sky
  secondary-colors.vue # Rose, Sun, Lavender, Peach, Sage
  backgrounds.vue      # White, off-white, warm tint surfaces
  typography.vue       # JetBrains Mono scale and weights
  buttons.vue          # Filled, outline, ghost
  tags.vue            # Pastel pills
  code-blocks.vue     # Dark Catppuccin surface
  chrome.vue          # Progress bar, page numbers, deck title
  layouts.vue         # slide-bare, slide, slide-section
  spacing.vue         # Margins, spacing scale, border-radius
  animation.vue        # Entry animations, timing rules
  code-keywords.vue    # Syntax colours, keyword links, line focus
  pseudo-to-python.vue # Staged pseudo-code → Python morph
  cast-critters.vue    # The six animals, tints, sizes, names
  props-places.vue     # Objects and scenery, one meaning each
  cast-in-practice.vue # Worked scenes paired with real code

components/code/
  Panel.vue            # <CodePanel>  — one tokenized sample
  Morph.vue            # <CodeMorph>  — staged transform between samples

components/art/
  Sprite.vue           # <ArtSprite>  — one cast member, tinted

utils/codeTokens.ts    # Tokenizer, concept links, morph keys
utils/codeTheme.ts     # One ink map for both code components
utils/sprites.ts       # The cast: 20 flat SVG sprites
composables/useCodeLink.ts  # Shared "same idea" highlight
assets/css/main.css    # CSS variables, five entry animations
slides.config.ts       # Slide order and metadata
slides.counter.json    # Next available slide ID (currently 33)
```

## Color System

### Primary Colors (Action & Structure)
- **Coral** `#FF6B6B` — Primary action, emphasis, errors, progress bars
- **Mint** `#4ECDC4` — Success, code, positive feedback
- **Sky** `#74B9FF` — Info, links, secondary actions

### Secondary Colors (Personality & Decoration)
- **Rose** `#F78DA7` — Warm pink, highlights, friendly moments
- **Sun** `#FFEAA7` — Warnings, tips, attention (dark text)
- **Lavender** `#A29BFE` — Special content, bonus, decorative

### Tertiary Colors
- **Peach** `#FAB1A0` — Soft warmth, gentle backgrounds
- **Sage** `#B8E994` — Nature, growth metaphors (dark text)

### Surfaces
- **White** `#FFFFFF` — Primary background (all content slides)
- **Off-white** `#F5F5F0` — Cards, insets, kbd hints
- **Warm** `#FFF8F3` — Title slides, section intros
- **Code surface** `#1E1E2E` — Only dark element (Catppuccin Mocha)

## Typography

**One font**: JetBrains Mono (variable weight 100–900)

### Type Scale
- Display: `text-7xl font-black tracking-tight`
- H1: `text-5xl font-black tracking-tight`
- H2: `text-3xl font-bold`
- Body: `text-xl` with `text-dim` color
- Small: `text-xs` for captions
- Chrome: `text-[11px] font-bold uppercase tracking-widest`

## Animation System

The deck has **five entry animations and two code components**. That is the whole
inventory. Emphasis and transforms are not CSS classes any more: they belong to
components, where they are driven by state instead of looping forever.

### Entry animations

| Class | Duration | Use for |
| --- | --- | --- |
| `anim-fade-in-up` | 500ms | Default. Headers, content blocks, cards |
| `anim-fade-in` | 400ms | Captions, footnotes, supporting text |
| `anim-pop-in` | 400ms | Tags, badges, code panels |
| `anim-slide-left` | 500ms | Left column of a split slide |
| `anim-slide-right` | 500ms | Right column of a split slide |

Cascade them with `anim-delay-1` … `anim-delay-6` (80ms apart).

### `<CodePanel>` — one code sample

```vue
<CodePanel :code="python" variant="python" :focus="[3]" reveal />
<CodePanel :code="pseudo" variant="pseudo" />
```

| Prop | Default | What it does |
| --- | --- | --- |
| `code` | — | The sample. Tokenized, never hand-marked-up |
| `variant` | `python` | Tab name, language label and accent. Both share one light surface |
| `focus` | — | 1-based line numbers. Everything else dims to 32% |
| `linkable` | `true` | Hovering a token highlights the same idea everywhere |
| `chrome` | `true` | Tab bar with the file name and the language |
| `gutter` | `true` | Line-number gutter |
| `filename` | — | Tab label. Defaults to `main.py` / `plan.txt` |
| `reveal` | `false` | Stagger the lines in on mount, 60ms apart |
| `size` | `base` | `lg` steps the code up one size, for the hero sample on a slide |
| `label` | — | Overrides the language label |

### `<CodeMorph>` — pseudo-code becomes Python

```vue
<CodeMorph :stages="stages" />
```

Each stage is `{ label, code, variant?, note? }`. Tokens that mean the same thing
in two stages keep the same key, so `<TransitionGroup>` **moves** them (550ms)
instead of tearing the block down. Words that exist in one stage only fade out
first, and new syntax fades in 250ms later, once the moves have landed. The
surface stays put; only the tab name, the accent and the words change.

Stages step by hand from the pills or the arrows; pass `autoplay` (and
`interval`, default 3600ms) for an unattended screen, which pauses on hover.

### Keyword links

`utils/codeTokens.ts` gives every token a **concept**, and `useCodeLink()` shares
the hovered concept across every panel on the slide:

- synonyms link: `SAY` / `print`, `FOR EACH` / `for`, `SET` / `=`, `ADD` / `+=`,
  `IF` / `if`, `OTHERWISE` / `else`, `>=` / `≥`,
- identifiers link to themselves, so `total` lights up in both languages,
- clicking pins the link, so it survives while the presenter talks; clicking the
  slide background clears it.

Add a synonym by editing `WORD_CONCEPTS` or `OPERATOR_CONCEPTS` in
`utils/codeTokens.ts`. Nothing in a slide page needs to change.

## Animation Rules

### Timing
- Entry animations: 400–500ms
- Token move inside a morph: 550ms; the new syntax lands 250ms behind it
- Colour and surface crossfades: 300–500ms
- Stagger delay: 80ms between siblings, 60ms between code lines
- Maximum: 6 elements animating at once
- Nothing loops. An animation runs because state changed, and then it stops

### Easing
- Entry and movement: `cubic-bezier(0.22, 1, 0.36, 1)` — quick start, gentle settle
- Colour, opacity and dimming: `ease`

### Hierarchy
1. Header (`anim-fade-in-up`)
2. Accent bar and lede (delay 80ms)
3. Code panels (delay 160ms)
4. Explanatory cards (delay 240ms)
5. Footnote (`anim-fade-in`, delay 320ms)

### Properties
- **GPU-accelerated**: transform, opacity (FAST)
- **Avoid**: width, height, top, left (SLOW)
- **Never**: transition: all (specify properties)

## The Cast

Examples use a fixed set of characters and objects, drawn as flat SVG on a 64×64
grid and tinted from the palette. Import nothing: `<ArtSprite>` is auto-imported.

```vue
<ArtSprite name="cat" color="coral" accent="rose" :size="76" />
<ArtSprite name="lever" state="on" color="sky" accent="mint" />
```

| Prop | Default | What it does |
| --- | --- | --- |
| `name` | — | Sprite key from `utils/sprites.ts` |
| `color` | `coral` | Body. A palette token or any CSS colour |
| `accent` | `sun` | Second colour: beak, roof, lever knob |
| `size` | `64` | Pixels. Never below 40 on a projector |
| `state` | `off` | Levers only. `on` flips the arm |
| `label` | name | Screen-reader label |

**Critters** — cat (Momo), dog (Rex), bird (Pip), frog (Bo), fish (Nemi), bunny (Hopps).
**Cat poses** — `cat` (sitting, the default), `cat-loaf` (at rest), `cat-peek`
(inside a box or list), `cat-sleep` (waiting, idle, done), `cat-stand` (moving,
one pass of a loop). Five states of one character, never five characters.
**Props** — lever, box, key, door, ball, book, basket, flag.
**Places** — house, road, tree, hill, fence, sign.

Rules that keep the set legible:

- **One meaning per sprite, for the whole course.** A basket is a list, a lever
  is a boolean, a sign is output. Never borrow a prop for a second concept.
- **Colour separates instances, not concepts.** A mint fish and a coral fish are
  two fish. Three coral cats and one mint cat is a list with one odd element.
- **Names are fixed and one word.** Momo is always the cat; the names double as
  variable names in the code beside the picture.
- **Outlines are always `--text` at 2.5**, at every size, so the cast reads as
  one set and matches the flat 2px borders everywhere else.
- **Pair a scene with code.** The drawing carries the concept, the `<CodePanel>`
  beside it carries the syntax. See `pages/design/cast-in-practice.vue`.

Adding a sprite: append an entry to `SPRITES` in `utils/sprites.ts` with
`category`, a one-line `use`, and markup where `currentColor` is the body and
`var(--sprite-accent)` the second colour. It then appears in the style guide
automatically, because those slides iterate the registry.

## Code Block Conventions

### Structure
```vue
<div class="rounded-xl overflow-hidden" style="background: var(--code-bg); border: 2px solid var(--code-border);">
  <!-- Window dots -->
  <div class="px-4 py-3 flex items-center gap-2" style="border-bottom: 1px solid var(--code-border);">
    <div class="w-3 h-3 rounded-full" style="background: var(--coral);"></div>
    <div class="w-3 h-3 rounded-full" style="background: var(--sun);"></div>
    <div class="w-3 h-3 rounded-full" style="background: var(--mint);"></div>
    <span class="ml-auto text-xs font-bold" style="color: var(--mint);">python</span>
  </div>
  
  <!-- Code -->
  <pre class="p-5 text-sm leading-relaxed" style="color: var(--code-text); font-family: 'JetBrains Mono', monospace;">
<span style="color: var(--sky);">def</span> <span style="color: var(--mint);">function_name</span>():
    <span style="color: var(--sky);">return</span> <span style="color: var(--sun);">"value"</span>
  </pre>
</div>
```

### Syntax Colors
- Keywords (`def`, `if`, `return`): Sky `--sky`
- Function names: Mint `--mint`
- Strings: Sun `--sun`
- Comments: `--text-dim` or `var(--code-text)` with opacity
- Base text: `--code-text`

## Pseudo-code Patterns

### Side-by-side correlation
```vue
<div class="grid md:grid-cols-2 gap-6 items-start">
  <CodePanel :code="pseudo" variant="pseudo" />
  <CodePanel :code="python" variant="python" />
</div>
```
Both panels share one `useCodeLink()` state, so hovering a word in either panel
lights up its twin in the other. No paired classes, no timing to keep in sync.

### Staged transform
Use `<CodeMorph>` with three stages — plain English, structured pseudo-code,
Python. Keep the identifiers identical across stages (`students`, `grade`,
`total`); those are the tokens that travel, and they are what carries the
audience from one stage to the next.

### Line focus
`:focus="[3]"` dims every other line to 32% and rails the live one. It is a prop,
not a loop: the line stays lit until the presenter changes it.

### Colored blocks for control flow
- Coral = condition check
- Mint = true branch
- Sky = false branch

## Slide Layouts

### slide-bare
No chrome. Use for title cards, full-bleed images, dramatic moments.

### slide (default)
Full chrome: deck title top-left, progress bar bottom, page number bottom-right.

### slide-section
Bold coral bar at top, centered page number. Use for chapter breaks, Q&A, closing.

## Adding New Slides

Always use the generator:
```bash
npm run slide:new -- "Slide Title"                    # main slide
npm run slide:new -- "Sub Title" --parent PRE-0XXX   # sub-slide
```

For design system slides, manually override route in `slides.config.ts`:
```ts
{
  id: 'PRE-0028',
  title: 'New Design Slide',
  route: '/design/new-slide',
  teleprompter: '...',
}
```

Create page at `pages/design/new-slide.vue`.

## CSS Variables

All in `assets/css/main.css`:
```css
:root {
  /* Surfaces */
  --bg: #FFFFFF;
  --bg-off: #F5F5F0;
  --bg-warm: #FFF8F3;
  
  /* Ink */
  --text: #1A1A1A;
  --text-dim: #6B6B6B;
  --text-muted: #B0B0B0;
  --border: #E5E5E5;
  
  /* Pastels */
  --coral: #FF6B6B;
  --mint: #4ECDC4;
  --sky: #74B9FF;
  --rose: #F78DA7;
  --sun: #FFEAA7;
  --lavender: #A29BFE;
  --peach: #FAB1A0;
  --sage: #B8E994;
  
  /* Code */
  --code-bg: #1E1E2E;
  --code-text: #CDD6F4;
  --code-border: #313244;
}
```

## Accessibility

- All animations respect `prefers-reduced-motion`
- Text/background contrast meets WCAG AA
- Keyboard navigation: arrow keys, space
- Focus indicators on interactive elements

## Browser Requirements

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- CSS custom properties support
- CSS animations support
- ES2020+ JavaScript

## Development

```bash
npm run dev              # Start dev server
npm run slides:check     # Validate config
npm run slide:new        # Generate new slide
npx nuxi typecheck       # Type check
npm run build            # Production build
```

## Counter Management

`slides.counter.json` tracks the next available ID:
```json
{
  "prefix": "PRE",
  "next": 28
}
```

Never manually decrement. Deleted slides leave permanent gaps.

## Future Enhancements

- [ ] Add syntax highlighting library (Shiki/Prism)
- [ ] Interactive code playgrounds
- [ ] Live Python execution
- [ ] Export to PDF with animations preserved as frames
- [ ] Accessibility audit with screen reader testing

## Credits

- Design inspired by: Jet Lag The Game, 3Blue1Brown
- Font: JetBrains Mono
- Colors: Catppuccin (code blocks)
- Framework: Nuxt 3, Vue 3, Tailwind CSS v4
