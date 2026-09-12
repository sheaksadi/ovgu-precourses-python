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
  /**
   * Every slide rises in softly. `none` skips that, for the stages of one scene
   * that must cut into each other invisibly.
   */
  transition?: SlideTransition
  /** Planned minutes on this slide, used by the presenter view's pacing. */
  duration?: number
  backgroundColor?: string
  /** Keep the page and the id, but skip the slide during the presentation. */
  hidden?: boolean
  /** Escape hatch for a page that does not live at `pages/slides/<id lowercased>.vue`. */
  route?: string
}

export type SlideTransition = 'none'

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
    id: 'PRE-0033',
    title: 'Python Pre-Course',
    subtitle: 'for AI & Machine Learning Engineering — OVGU, Winter Semester 2026/27',
    layout: 'slide-bare',
    teleprompter: 'Welcome to the Python pre-course. Scan the code in the corner to open the slides on your own device: you can follow along, move at your own pace, and the sync button brings you back to where we are.',
  },
  {
    id: 'PRE-0038',
    title: 'Vorstellungsrunde',
    subtitle: 'Name sagen, kurz vorstellen, Frage drehen',
    duration: 10,
    teleprompter: 'Reihum: Name sagen, kurz vorstellen – Hobbys, etwas Schräges oder Besonderes, etwas Nettes über sich. Dann Enter drücken oder auf das Rad tippen und die Frage beantworten. Keine Frage kommt doppelt, bis alle einmal dran waren. Ton an und aus unten rechts. Selbst anfangen hilft.',
  },
  {
    id: 'PRE-0034',
    title: 'Kommt Momo ins Haus?',
    subtitle: 'Problem',
    teleprompter: 'Momo steht vor ihrer Haustür. Manchmal hat sie den Schlüssel dabei, manchmal nicht. Frag die Gruppe: Was passiert in beiden Fällen? Erst sammeln, dann weiter.',
  },
  {
    id: 'PRE-0035',
    title: 'Kommt Momo ins Haus? – Lösen',
    parent: 'PRE-0034',
    transition: 'none',
    teleprompter: 'Gleiche Situation, ein Unterschied. Beide Katzen laufen los. Mit Schlüssel geht die Tür auf und Momo ist drin. Ohne Schlüssel bleibt die Tür zu und Momo schläft davor. Eine Frage, zwei Wege.',
  },
  {
    id: 'PRE-0036',
    title: 'Kommt Momo ins Haus? – Aufschreiben',
    parent: 'PRE-0034',
    transition: 'none',
    teleprompter: 'Jetzt schreiben wir genau das auf. if steht vor der Frage, else vor dem anderen Weg. Alles andere ist ganz normales Deutsch. Fahr mit der Maus über ein Wort im Code, dann leuchtet es im Bild auf.',
  },
  {
    id: 'PRE-0037',
    title: 'Kommt Momo ins Haus? – Python',
    parent: 'PRE-0034',
    transition: 'none',
    teleprompter: 'Und jetzt als echtes Python. Oben unser Plan, unten derselbe Plan, den der Computer ausführen kann. if und else bleiben gleich, die Frage wird zu einer Variablen hat_schluessel, und was Momo tut, wird zu print. Ändere True zu False und frag: Was steht jetzt da?',
  },
  {
    id: 'PRE-0039',
    title: 'Probier’s selbst',
    subtitle: 'Online-Compiler öffnen und den Code ausführen',
    duration: 5,
    teleprompter: 'Jetzt selbst ausprobieren. Die Vorführung zeigt den Weg: suchen, Online-Compiler öffnen, Code einfügen, Run. Wer mag, scannt den Code. Aufgabe: den Text im print ändern, zum Beispiel in den eigenen Namen, und nochmal Run drücken. Enter zeigt die Vorführung nochmal.',
  },
  {
    id: 'PRE-0040',
    title: 'Variablen',
    duration: 15,
    teleprompter: 'Erinnerung an print("Hallo Welt!"). Jetzt kommt der Text in eine Box. Name links, Wert rechts, das = heißt: leg das hier hinein.',
  },
  {
    id: 'PRE-0041',
    title: 'Variablen – Wert benutzen',
    parent: 'PRE-0040',
    transition: 'none',
    teleprompter: 'print(gruss) ohne Anführungszeichen: Python schaut in die Box. Frag: Was würde mit Anführungszeichen ausgegeben? Genau, das Wort gruss.',
  },
  {
    id: 'PRE-0042',
    title: 'Variablen – Neuer Wert',
    parent: 'PRE-0040',
    transition: 'none',
    teleprompter: 'Gleiche Box, neuer Inhalt. Der alte Wert ist weg. Zwei prints, zwei Ausgaben, jeweils mit dem Wert, der gerade drin ist.',
  },
  {
    id: 'PRE-0043',
    title: 'Variablen – Typen',
    parent: 'PRE-0040',
    transition: 'none',
    teleprompter: 'Vier Typen für den Anfang: str, int, float, bool. Anführungszeichen machen den Unterschied zwischen "3" und 3. type() verrät den Typ.',
  },
  {
    id: 'PRE-0044',
    title: 'Variablen – Rechnen',
    parent: 'PRE-0040',
    transition: 'none',
    teleprompter: 'Rechte Seite zuerst: alter + 1 ergibt 4, das kommt zurück in alter. += ist die Kurzform. Am Ende steht 5 in der Box.',
  },
  {
    id: 'PRE-0045',
    title: 'Variablen – f-Strings',
    parent: 'PRE-0040',
    transition: 'none',
    teleprompter: 'f-Strings: ein f vor die Anführungszeichen, Variablen in geschweifte Klammern. Python setzt die Werte ein.',
  },
  {
    id: 'PRE-0046',
    title: 'Variablen – input()',
    parent: 'PRE-0040',
    transition: 'none',
    teleprompter: 'input() gibt immer Text zurück, auch wenn jemand eine Zahl tippt. Mit int() umwandeln, sonst gibt "5" + 1 einen Fehler.',
  },
  {
    id: 'PRE-0047',
    title: 'Variablen – Namen',
    parent: 'PRE-0040',
    transition: 'none',
    teleprompter: 'Namensregeln. Groß und klein zählt: alter und Alter sind zwei verschiedene Boxen, darum gibt print(alter) die 3 aus.',
  },
  {
    id: 'PRE-0010',
    title: 'Design System',
    subtitle: 'Python for Beginners — Style Guide',
    layout: 'slide-bare',
    teleprompter: 'This is our design system and style guide. Every visual decision for the Python pre-courses deck is documented here.',
  },
  {
    id: 'PRE-0011',
    title: 'Primary Colors',
    parent: 'PRE-0010',
    teleprompter: 'Three primary colors: Coral for action and emphasis, Mint for success and code, Sky for information and links.',
  },
  {
    id: 'PRE-0012',
    title: 'Secondary & Accent Colors',
    parent: 'PRE-0010',
    teleprompter: 'Five supporting colors for personality and decoration. Rose is our warm pink highlight, Sun for warnings, Lavender for special content.',
  },
  {
    id: 'PRE-0013',
    title: 'Backgrounds & Surfaces',
    teleprompter: 'Three surface tiers: pure white for content, off-white for cards, warm tint for title slides. Code blocks are the only dark surface.',
  },
  {
    id: 'PRE-0014',
    title: 'Typography',
    teleprompter: 'One font everywhere: JetBrains Mono. Variable weight. We primarily use bold and black. The type scale goes from display down to chrome.',
  },
  {
    id: 'PRE-0015',
    title: 'Buttons & Interactions',
    parent: 'PRE-0014',
    teleprompter: 'Three button tiers: filled primary, outlined secondary, ghost. All are flat, no shadows, 2px borders, rounded-lg.',
  },
  {
    id: 'PRE-0016',
    title: 'Tags, Pills & Labels',
    parent: 'PRE-0014',
    teleprompter: 'Small uppercase pills for categorizing content. Filled for strong presence, outlined for metadata. Each color has a semantic meaning.',
  },
  {
    id: 'PRE-0017',
    title: 'Code Blocks',
    teleprompter: 'The only dark element in the system. Catppuccin-inspired dark surface with pastel window dots matching our palette.',
  },
  {
    id: 'PRE-0018',
    title: 'Page Chrome & Navigation',
    parent: 'PRE-0017',
    teleprompter: 'Persistent chrome: deck title top-left, progress bar bottom, page number bottom-right. All in text-muted so they never compete with content.',
  },
  {
    id: 'PRE-0019',
    title: 'Title Cards & Layouts',
    teleprompter: 'Three layout types: slide-bare for titles and drama, slide for all teaching content, slide-section for chapter breaks.',
  },
  {
    id: 'PRE-0020',
    title: 'Spacing & Layout',
    parent: 'PRE-0019',
    teleprompter: 'Generous margins. Desktop has 96px horizontal padding. Spacing scale from 4px to 96px. Five border-radius tiers.',
  },
  {
    id: 'PRE-0021',
    title: 'Animation & Motion',
    teleprompter: 'Fast, subtle, purposeful animations. 80ms stagger between elements. All motion respects prefers-reduced-motion.',
  },
  {
    id: 'PRE-0028',
    title: 'Code & Keyword Links',
    parent: 'PRE-0021',
    teleprompter: 'Two tools for teaching code: hovering a word links every token that means the same thing across both panels, and line focus dims everything but the live line. Click a word to pin the link while you talk.',
  },
  {
    id: 'PRE-0029',
    title: 'Pseudo → Python',
    parent: 'PRE-0021',
    teleprompter: 'One program in three stages. Shared tokens move to their new place, only new syntax fades in. Step it with the stage pills or the arrows.',
  },
  {
    id: 'PRE-0030',
    title: 'Cast: Critters',
    teleprompter: 'Six animals carry every example in this course. Flat SVG, two-pixel outlines, tinted from the palette, so colour itself becomes data: three coral cats and one mint cat is a list with one odd element.',
  },
  {
    id: 'PRE-0031',
    title: 'Props & Places',
    parent: 'PRE-0030',
    teleprompter: 'The things the cast acts on. A box is a variable, a basket is a list, a lever is a boolean, a door is a branch, a road is a sequence, a fence is a range.',
  },
  {
    id: 'PRE-0032',
    title: 'Cast in Practice',
    parent: 'PRE-0030',
    teleprompter: 'Three worked scenes: a lever next to a boolean, a basket of fish next to a list, a street of houses next to a for loop. Picture on the left, code on the right, same words highlighted in both.',
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
