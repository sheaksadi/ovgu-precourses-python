# Design System Documentation

## Overview

This is a Nuxt 3 presentation framework for teaching Python to beginners. The design system takes its restraint from 3Blue1Brown and its flat pastel look from Jet Lag The Game.

## Design Philosophy

**Minimal Pastel**: White backgrounds, JetBrains Mono everywhere, bold pastel color blocks, flat graphics, no shadows, thick 2px borders.

**Educational Focus**: Every animation serves pedagogy. Motion is state, never decoration: nothing loops on its own, and the deck holds still until the presenter moves it. Pseudo-code bridges concepts to syntax, and a transform moves the words that survive instead of swapping one block for another.

## Directory Structure

```
pages/slides/           # Every slide page, one file per id: pre-0033.vue → /slides/pre-0033
  pre-0033.vue         # Course title
  pre-0038.vue         # Intro round (question reel)
  pre-0034…0037.vue    # Momo if/else lesson, four stages
  pre-0039.vue         # Try it yourself
  pre-0040…0047.vue    # Variables lesson, eight stages
  pre-0010…0032.vue    # Style guide: colours, type, buttons, tags, code, chrome,
                       # layouts, spacing, motion, code components, the cast
pages/index.vue          # Start page: projector, presenter, control panel, follow along

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

Motion comes in three kinds, and a slide uses as little of it as it can.

### 1. One slide entrance

Every slide rises in once when it appears: opacity and a 10px lift, 400ms,
`cubic-bezier(0.22, 1, 0.36, 1)`. The page transition in `app.vue` owns it, so
pages never animate their own elements in: no staggered headers, cards or lists.
Leaving is instant.

Set `transition: 'none'` on a slide in `slides.config.ts` to skip the entrance.
Use it only for the stages of one scene, which have to cut into each other
invisibly (the Momo lesson, PRE-0035 to PRE-0037).

### 2. State changes

Motion that answers a click or a "next": the lesson's stages, the step that was
just reached, the question reel. It lives in the component that owns the state,
runs once and stops. The two code components below are the reference.

A demo may play once on its own when its slide lands, like a short screen
recording, as long as it stops at the end and offers a replay button (and Enter).
Reference: the "try it yourself" browser in `components/tryit/BrowserDemo.vue`.

### 3. One accent

At most one small pop after the slide lands, usually Momo's speech bubble
(`pop-in`, delayed about 450–500ms so it arrives after the entrance). It changes
again only when the state behind it changes.

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
- Slide entrance: 400ms, once per slide
- Accent pop: 400ms, 450–500ms after the slide appears
- Token move inside a morph: 550ms; the new syntax lands 250ms behind it
- Colour and surface crossfades: 300–500ms
- No staggered entrances
- Nothing loops. An animation runs because state changed, and then it stops

### Easing
- Entry and movement: `cubic-bezier(0.22, 1, 0.36, 1)` — quick start, gentle settle
- Colour, opacity and dimming: `ease`

### Order on screen
1. The slide rises in as one piece
2. One accent, if any
3. Nothing else until the presenter clicks

### Properties
- **GPU-accelerated**: transform, opacity (FAST)
- **Avoid**: width, height, top, left (SLOW)
- **Never**: transition: all (specify properties)

## Language

Every course-facing word lives in `locales/de.ts` and `locales/en.ts`, never in a
page. German is the source shape: `en.ts` is typed against it, so a missing key
fails. Code samples are translated too, pseudo-code and Python strings alike.

```vue
<script setup lang="ts">
const { t, tm } = useI18n()
const questions = computed(() => tm<string[]>('intro.questions'))
</script>

<h2>{{ t('door.title') }}</h2>
<p>{{ t('follow.startsAt', { label: '2.1', title: 'Problem' }) }}</p>
```

- **Per device.** The projector and each phone pick their own language. `?lang=en`
  on a link, then the `deck-lang` cookie, so the server renders the right words.
- **Switching.** `l` on a keyboard. Touch screens get a small DE | EN pill bottom
  left; the projector never shows it.
- **Only `if`, `else` and Python stay English** in every language.
- **Picture links follow the language.** A scene that lights up on hovered words
  keeps those words in the dictionary (`door.words`), not in the component.
- The design-system slides and the speaker notes in `slides.config.ts` are not
  translated; they are for the people building and giving the course.

## Sound

Sound is an accent, never a soundtrack.

- **Synthesised, not downloaded.** Web Audio oscillators, a few milliseconds each.
- **Only in answer to a click or a key.** Nothing plays on load or on its own.
- **Quiet.** Peaks stay below 0.07 gain; ticks sit lower still.
- **Always mutable.** A speaker button next to the control, remembered per device.
- **Reference:** the question reel in `components/intro/Spinner.vue` — a tick per
  passing card, brighter while fast and softer as it slows, then a two-note chime
  a fifth apart when it lands.

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
  beside it carries the syntax. See `pages/slides/pre-0032.vue` (Cast in Practice).

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

## Pills, Dots and Bubbles

Short labels in pills, number dots and speech bubbles must sit in the true middle.
A font's line box has more room below the baseline than above the capitals, so an
untrimmed label rides high.

- **Block-level pill:** set `text-box: trim-both cap alphabetic` on it and give it
  its height with padding (about `0.38em` more per side than before, at line-height 1.5).
- **Pill, dot or button with flex/grid inside:** wrap the text in `<span class="text-trim">`
  (`assets/css/main.css`).
- **Faces stacked in one grid cell** (the lesson's Frage / Fall / `if` chips) need
  `align-self: center`, or the smaller faces stretch and their text rides high again.
- Checked by measuring letter pixels in 3× screenshots: every pill within 1px of centre.

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

The generator creates `pages/slides/<id>.vue` for every slide, style-guide slides
included; there is no separate folder and no route to override. Move the new entry in
`slides.config.ts` to where it belongs in the deck.

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
