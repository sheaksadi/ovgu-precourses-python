import counter from './slides.counter.json'

export interface SlideEntry {
  /** Permanent identifier, e.g. `PRE-0001`. Never renumber or reuse it. */
  id: string
  title: string
  subtitle?: string
  /** Id of the parent slide. Set it to turn this entry into a sub-slide. */
  parent?: string
  /** Layout file in `layouts/` that draws the chrome around this slide. */
  layout?: SlideLayoutName
  /**
   * Marks the slide as interactive. A device in interactive mode renders the
   * interactive chrome and asks before leaving an unfinished interaction.
   */
  interactive?: SlideInteractive
  teleprompter?: string
  /** Page transition: `fade`, `slide` or `zoom`. */
  transition?: SlideTransition
  /** Planned minutes on this slide, used by the presenter view's pacing. */
  duration?: number
  backgroundColor?: string
  /** Keep the page and the id, but skip the slide during the presentation. */
  hidden?: boolean
  /** Escape hatch for a page that does not live at `/<id lowercased>`. */
  route?: string
}

export type SlideTransition = 'fade' | 'slide' | 'zoom'

export type SlideLayoutName = 'slide' | 'slide-bare' | 'slide-section' | 'slide-interactive'

export interface SlideInteractive {
  /** Stable name for the interaction, for your own bookkeeping. */
  id?: string
  /** How many steps the viewer works through. Defaults to 1. */
  steps?: number
  /** Ask before leaving even when the viewer has not started yet. */
  required?: boolean
}

/** Deck prefix and the next free slide number. Owned by `npm run slide:new`. */
export const slideCounter: { prefix: string, next: number } = counter

/**
 * Presentation order is the order of this array, and nothing else.
 * Move an entry to reorder a slide; no page, id or route changes.
 */
export const slides: SlideEntry[] = [
  // <slides:start>
  {
    id: 'PRE-0010',
    title: 'Design System',
    subtitle: 'Python for Beginners — Style Guide',
    layout: 'slide-bare',
    transition: 'fade',
    route: '/design/system',
    teleprompter: 'This is our design system and style guide. Every visual decision for the Python pre-courses deck is documented here.',
  },
  {
    id: 'PRE-0011',
    title: 'Primary Colors',
    parent: 'PRE-0010',
    route: '/design/primary-colors',
    teleprompter: 'Three primary colors: Coral for action and emphasis, Mint for success and code, Sky for information and links.',
  },
  {
    id: 'PRE-0012',
    title: 'Secondary & Accent Colors',
    parent: 'PRE-0010',
    route: '/design/secondary-colors',
    teleprompter: 'Five supporting colors for personality and decoration. Rose is our warm pink highlight, Sun for warnings, Lavender for special content.',
  },
  {
    id: 'PRE-0013',
    title: 'Backgrounds & Surfaces',
    route: '/design/backgrounds',
    teleprompter: 'Three surface tiers: pure white for content, off-white for cards, warm tint for title slides. Code blocks are the only dark surface.',
  },
  {
    id: 'PRE-0014',
    title: 'Typography',
    route: '/design/typography',
    teleprompter: 'One font everywhere: JetBrains Mono. Variable weight. We primarily use bold and black. The type scale goes from display down to chrome.',
  },
  {
    id: 'PRE-0015',
    title: 'Buttons & Interactions',
    parent: 'PRE-0014',
    route: '/design/buttons',
    teleprompter: 'Three button tiers: filled primary, outlined secondary, ghost. All are flat, no shadows, 2px borders, rounded-lg.',
  },
  {
    id: 'PRE-0016',
    title: 'Tags, Pills & Labels',
    parent: 'PRE-0014',
    route: '/design/tags',
    teleprompter: 'Small uppercase pills for categorizing content. Filled for strong presence, outlined for metadata. Each color has a semantic meaning.',
  },
  {
    id: 'PRE-0017',
    title: 'Code Blocks',
    route: '/design/code-blocks',
    teleprompter: 'The only dark element in the system. Catppuccin-inspired dark surface with pastel window dots matching our palette.',
    transition: 'fade',
  },
  {
    id: 'PRE-0018',
    title: 'Page Chrome & Navigation',
    parent: 'PRE-0017',
    route: '/design/chrome',
    teleprompter: 'Persistent chrome: deck title top-left, progress bar bottom, page number bottom-right. All in text-muted so they never compete with content.',
  },
  {
    id: 'PRE-0019',
    title: 'Title Cards & Layouts',
    route: '/design/layouts',
    teleprompter: 'Three layout types: slide-bare for titles and drama, slide for all teaching content, slide-section for chapter breaks.',
    transition: 'slide',
  },
  {
    id: 'PRE-0020',
    title: 'Spacing & Layout',
    parent: 'PRE-0019',
    route: '/design/spacing',
    teleprompter: 'Generous margins. Desktop has 96px horizontal padding. Spacing scale from 4px to 96px. Five border-radius tiers.',
  },
  {
    id: 'PRE-0021',
    title: 'Animation & Motion',
    route: '/design/animation',
    teleprompter: 'Fast, subtle, purposeful animations. 80ms stagger between elements. All motion respects prefers-reduced-motion.',
    transition: 'fade',
  },
  {
    id: 'PRE-0022',
    title: 'Manim Entrances',
    parent: 'PRE-0021',
    route: '/design/manim-entrances',
    teleprompter: 'Six entrance types from Manim: Write, FadeIn, GrowFromCenter, DrawBorderThenFill, SpinIn, ShrinkToCenter. Every appearance is deliberate and earned.',
  },
  {
    id: 'PRE-0023',
    title: 'Manim Emphasis',
    parent: 'PRE-0021',
    route: '/design/manim-emphasis',
    teleprompter: 'Five emphasis animations: Indicate, Wiggle, Circumscribe, Flash, FocusOn. These highlight what is already on screen without changing it.',
  },
  {
    id: 'PRE-0024',
    title: 'Manim Transforms',
    parent: 'PRE-0021',
    route: '/design/manim-transforms',
    teleprompter: 'Four transform types: ReplacementTransform, Transform, MoveToTarget, CountUp. The audience sees continuity, not replacement.',
  },
  {
    id: 'PRE-0025',
    title: 'Animation Choreography',
    parent: 'PRE-0021',
    route: '/design/manim-choreography',
    teleprompter: 'How to compose animations: 80ms stagger, max 400ms, max 6 elements at once. Headers first. Code blocks pop in. Every animation has enter and exit.',
  },
  {
    id: 'PRE-0026',
    title: 'Code Animation Patterns',
    parent: 'PRE-0021',
    route: '/design/code-animations',
    teleprompter: 'Four patterns for teaching code: block transform, line correlation, colored blocks, progressive disclosure. Pseudo-code bridges concept to implementation.',
  },
  {
    id: 'PRE-0027',
    title: 'Pseudo → Python Transform',
    parent: 'PRE-0021',
    route: '/design/pseudo-transform',
    teleprompter: 'Step-by-step morphing from plain English to Python. Variables, conditionals, loops, and functions. Each transform respects cognitive continuity.',
  },
  // <slides:end>
]

/** Deck-wide values that the layouts render on top of every slide. */
export const deckConfig = {
  title: 'Design System',
  author: '',
  showSlideId: false,
  showPageNumber: true,
  showProgressBar: true,
}
