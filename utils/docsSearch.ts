/**
 * What the documentation demos show: how to look something up.
 *
 * Two slides play the same three moves — search, open the official page, find
 * the entry — once for Python's built-in functions and once for a third-party
 * library. The page content lives here rather than in `locales/`, because it is
 * quasi-technical: real function names with a one-line description in either
 * language, as the real pages have.
 *
 * Rendered by `components/demo/DocsSearch.vue`.
 */
import type { Locale } from '~/composables/useI18n'

export interface DocsEntry {
  /** Signature, as the documentation writes it. */
  name: string
  de: string
  en: string
}

export interface DocsDemo {
  query: Record<Locale, string>
  /** What the browser's address bar shows once the page is open. */
  address: string
  /** The search result: breadcrumb, title, snippet. */
  crumbs: string
  result: Record<Locale, string>
  snippet: Record<Locale, string>
  pageTitle: Record<Locale, string>
  entries: DocsEntry[]
  /** Index of the entry the demo lands on. */
  pick: number
  /** The example under that entry, as a console session. */
  example: string[]
}

const builtins: DocsDemo = {
  query: { de: 'python eingebaute funktionen', en: 'python built in functions' },
  address: 'docs.python.org/3/library/functions.html',
  crumbs: 'docs.python.org › 3 › library',
  result: { de: 'Eingebaute Funktionen — Python Dokumentation', en: 'Built-in Functions — Python documentation' },
  snippet: {
    de: 'Der Python-Interpreter kennt diese Funktionen immer, ohne Import.',
    en: 'The Python interpreter has a number of functions built into it, always available.',
  },
  pageTitle: { de: 'Eingebaute Funktionen', en: 'Built-in Functions' },
  entries: [
    { name: 'abs(x)', de: 'Betrag einer Zahl', en: 'absolute value of a number' },
    { name: 'enumerate(iterable)', de: 'Zähler und Wert zusammen', en: 'counter and value together' },
    { name: 'len(s)', de: 'Anzahl der Elemente', en: 'number of items' },
    { name: 'max(iterable)', de: 'größter Wert', en: 'largest item' },
    { name: 'round(number, ndigits)', de: 'auf Stellen runden', en: 'round to digits' },
    { name: 'sorted(iterable, reverse=False)', de: 'neue, sortierte Liste', en: 'a new, sorted list' },
    { name: 'sum(iterable)', de: 'alles zusammenzählen', en: 'add everything up' },
    { name: 'zip(*iterables)', de: 'Listen paarweise verbinden', en: 'pair lists up' },
  ],
  pick: 5,
  example: ['>>> sorted([3, 1, 2])', '[1, 2, 3]', '>>> sorted(["b", "a", "c"], reverse=True)', "['c', 'b', 'a']"],
}

const pandas: DocsDemo = {
  query: { de: 'pandas dataframe funktionen', en: 'pandas dataframe methods' },
  address: 'pandas.pydata.org/docs/reference/frame.html',
  crumbs: 'pandas.pydata.org › docs › reference',
  result: { de: 'DataFrame — pandas Dokumentation', en: 'DataFrame — pandas documentation' },
  snippet: {
    de: 'Alle Methoden eines DataFrame, jede mit Beispiel.',
    en: 'Every method of a DataFrame, each with an example.',
  },
  pageTitle: { de: 'DataFrame', en: 'DataFrame' },
  entries: [
    { name: 'DataFrame.head(n=5)', de: 'die ersten Zeilen ansehen', en: 'look at the first rows' },
    { name: 'DataFrame.describe()', de: 'Mittelwert, Min und Max auf einen Blick', en: 'mean, min and max at a glance' },
    { name: 'DataFrame.sort_values(by)', de: 'nach einer Spalte sortieren', en: 'sort by a column' },
    { name: 'DataFrame.shape', de: 'wie viele Zeilen und Spalten', en: 'how many rows and columns' },
    { name: 'DataFrame.groupby(by)', de: 'Zeilen gruppieren und rechnen', en: 'group rows and compute' },
  ],
  // The last entry: the demo has to scroll to it, which is the point of the scene.
  pick: 4,
  example: ['>>> tiere.groupby("art")["alter"].mean()', 'art', 'Hund     5.0', 'Katze    3.0'],
}

const catapi: DocsDemo = {
  query: { de: 'cat api zufälliges bild', en: 'cat api random image' },
  address: 'docs.thecatapi.com/api-reference/images/images-search',
  crumbs: 'docs.thecatapi.com › api-reference › images',
  result: { de: 'Images Search — The Cat API', en: 'Images Search — The Cat API' },
  snippet: {
    de: 'Ein zufälliges Katzenbild als JSON. Ohne Schlüssel, direkt im Browser.',
    en: 'A random cat image as JSON. No key needed, straight from the browser.',
  },
  pageTitle: { de: 'GET /v1/images/search', en: 'GET /v1/images/search' },
  entries: [
    { name: 'GET /v1/images/search', de: 'ein zufälliges Bild holen', en: 'get one random image' },
    { name: 'limit=10', de: 'mehrere Bilder auf einmal', en: 'several images at once' },
    { name: 'x-api-key', de: 'Schlüssel für mehr Anfragen – für uns nicht nötig', en: 'key for more requests – not needed here' },
    { name: 'Response: [ { id, url, width, height } ]', de: 'eine Liste mit einem Dictionary darin', en: 'a list with one dictionary inside' },
  ],
  // The response shape: exactly what the next slide reads in Python.
  pick: 3,
  example: [
    '[',
    '  {',
    '    "id": "95l",',
    '    "url": "https://cdn2.thecatapi.com/images/95l.jpg",',
    '    "width": 500, "height": 333',
    '  }',
    ']',
  ],
}

export const DOCS_DEMOS: Record<string, DocsDemo> = { builtins, pandas, catapi }
