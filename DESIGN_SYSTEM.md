# Design System Documentation

## Overview

This is a Nuxt 3 presentation framework for teaching Python to beginners. The design system is inspired by 3Blue1Brown's Manim animations and Jet Lag The Game's visual aesthetic.

## Design Philosophy

**Minimal Pastel**: White backgrounds, JetBrains Mono everywhere, bold pastel color blocks, flat graphics, no shadows, thick 2px borders.

**Educational Focus**: Every animation serves pedagogy. Pseudo-code bridges concepts to syntax. Transforms show continuity, not replacement.

## Directory Structure

```
pages/design/           # Design system slides (PRE-0010 to PRE-0027)
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
  animation.vue       # Entry animations, timing rules
  manim-entrances.vue      # Write, FadeIn, Grow, DrawBorderThenFill
  manim-emphasis.vue       # Indicate, Wiggle, Circumscribe (code examples)
  manim-transforms.vue     # ReplacementTransform, Transform, MoveToTarget, CountUp
  manim-choreography.vue   # Timing, stagger, composition rules
  code-animations.vue      # Block transform, line correlation, colored blocks
  pseudo-transform.vue     # Pseudo-code → Python morphing

assets/css/main.css    # All CSS variables and keyframes
slides.config.ts       # Slide order and metadata
slides.counter.json    # Next available slide ID (currently 28)
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

### Entry Animations

**Write** (1.2s) — Clip-path reveal left-to-right
```vue
<div class="manim-write">def greet(name):</div>
```
Use for: Function signatures, class definitions, key statements

**FadeIn** (0.4s) — Pure opacity 0→1
```vue
<div class="anim-fade-in">// Comment text</div>
```
Use for: Comments, labels, supporting text

**GrowFromCenter** (0.4s) — Scale 0.9→1 with elastic
```vue
<div class="anim-pop-in">Badge</div>
```
Use for: Tags, badges, icons, decorative elements

**DrawBorderThenFill** (1.9s) — Border traces (1.5s) then content fills (0.4s)
```vue
<div class="manim-border-draw" style="border: 3px solid var(--rose);">
  <code class="manim-fill-after" style="animation-delay: 1.9s;">code</code>
</div>
```
Use for: Code blocks, containers, theorem boxes

**CodeBlockIn** (0.8s) — translateY + blur → sharp
```vue
<div class="manim-code-block-in anim-delay-4">
  <!-- Full code block -->
</div>
```
Use for: Complete code examples

### Emphasis Animations

**Highlight Line** (3s cycle) — Scale pulse + mint border flash
```vue
<div class="manim-highlight-line">for item in items:</div>
```
Use for: Drawing attention to specific lines

**Syntax Pulse** (2s cycle) — Color shift to coral + weight increase
```vue
<span class="manim-syntax-pulse">self</span>
```
Use for: Highlighting keywords or patterns

**Wiggle** (1.5s cycle) — Rotation ±3°
```vue
<span class="manim-wiggle">x / 0</span>
```
Use for: Errors, edge cases, problematic code

**Circumscribe** (3s cycle) — Border traces perimeter
```vue
<div class="relative">
  <div class="content">Important block</div>
  <div class="absolute inset-0 manim-circumscribe"></div>
</div>
```
Use for: Boxing important structures

**Character Reveal** — Staggered character appearance
```vue
<span class="manim-char-appear">H</span>
<span class="manim-char-appear char-delay-1">e</span>
<span class="manim-char-appear char-delay-2">l</span>
<span class="manim-char-appear char-delay-3">l</span>
<span class="manim-char-appear char-delay-4">o</span>
```
Use for: Dramatic reveals, "aha moment" lines

### Transform Animations

**ReplacementTransform** (5s) — Crossfade with vertical offset
```vue
<span class="manim-crossfade-out">old_expr</span>
<span class="manim-crossfade-in">new_expr</span>
```
Use for: Variable reassignment, refactoring steps

**PropertyTransform** (4s loop) — Color, size, shape morph
```vue
<div class="manim-prop-transform">element</div>
```
Use for: Parameter changes, state transitions

**MoveToTarget** (4s with bounce) — Translate with arrival wiggle
```vue
<div class="manim-move-target">moving element</div>
```
Use for: Vector addition, function composition

**CountUp** (2.5s) — JavaScript-driven number animation
```vue
<span id="count-display">42</span>

<script setup>
// See pages/design/manim-transforms.vue for implementation
</script>
```
Use for: Statistics, scores, iteration counts

### Pseudo-code Transforms

**Block Morph** (3s) — Background, padding, color interpolation
```vue
<div class="manim-pseudo-to-code">STORE value</div>
```
Use for: Entire pseudo-code blocks transforming to syntax

## Animation Rules

### Timing
- Entry animations: 0.4–1.2s
- Emphasis cycles: 1.5–3s infinite
- Transforms: 2–5s
- Stagger delay: 80ms between siblings
- Maximum: 400ms for any single animation
- Maximum: 6 elements animating simultaneously

### Easing
- Entry: `cubic-bezier(0.22, 1, 0.36, 1)` — quick start, gentle settle
- Emphasis: `ease-in-out`
- Transforms: `cubic-bezier(0.4, 0, 0.2, 1)` — material design standard

### Hierarchy
1. Headers enter first (Write)
2. Accent bars (FadeIn, delay 80ms)
3. Body content (FadeIn, delay 160ms)
4. Code blocks (CodeBlockIn, delay 240ms)
5. Tags/badges (Grow, delay 320ms)

### Properties
- **GPU-accelerated**: transform, opacity (FAST)
- **Avoid**: width, height, top, left (SLOW)
- **Never**: transition: all (specify properties)

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

### Side-by-side Correlation
```vue
<div class="grid grid-cols-2 gap-6">
  <!-- Pseudo -->
  <div class="rounded-xl p-4" style="background: var(--rose); color: white;">
    <div class="manim-highlight-line">FOR each item IN list</div>
  </div>
  
  <!-- Real code -->
  <div class="rounded-xl" style="background: var(--code-bg);">
    <pre class="p-4">
<span class="manim-highlight-line"><span style="color: var(--sky);">for</span> item <span style="color: var(--sky);">in</span> my_list:</span>
    </pre>
  </div>
</div>
```
Both highlight lines simultaneously (3s cycle).

### Progressive Disclosure
Build code one line at a time with `anim-fade-in-up` and staggered delays.

### Colored Blocks for Control Flow
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

- Design inspired by: Jet Lag The Game, 3Blue1Brown (Manim)
- Font: JetBrains Mono
- Colors: Catppuccin (code blocks)
- Framework: Nuxt 3, Vue 3, Tailwind CSS v4
