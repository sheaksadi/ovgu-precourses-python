import { randomInt } from '../utils/seeded'
import { defineProblem } from './types'

/**
 * The hard round, after the objects lesson: everything the course taught, at once.
 *
 * finale-logbook: Momo's log book, one catch per line, as plain text.
 *   Part 1: who caught the most fish in total? (split the lines, count into a dict)
 *   Part 2: that same cat's longest run of days in a row.
 *
 * finale-shelter: a shelter simulated round by round, with rules instead of a list.
 *   Part 1: the total hunger after the last round.
 *   Part 2: which cat was fed most often.
 *
 * Both are solvable with plain loops and lists, and both get much shorter with a
 * function or a small class, which is exactly the point this late in the course.
 * Generation makes every answer unique, so nobody loses on a tie.
 */

const CATS = ['Momo', 'Bello', 'Kiki', 'Nala', 'Rocky']

interface LogEntry {
  day: number
  cat: string
  fish: number
}

/** The longest run of days in a row in a set of days. */
const longestRun = (days: number[]) => {
  const sorted = [...new Set(days)].sort((a, b) => a - b)
  let best = 0
  let run = 0
  sorted.forEach((day, index) => {
    run = index > 0 && day === sorted[index - 1]! + 1 ? run + 1 : 1
    best = Math.max(best, run)
  })
  return best
}

const totalsOf = (entries: LogEntry[]) => {
  const totals = new Map<string, number>()
  entries.forEach(({ cat, fish }) => totals.set(cat, (totals.get(cat) ?? 0) + fish))
  return totals
}

export const finaleLogbook = defineProblem<LogEntry[]>({
  id: 'finale-logbook',
  parts: 2,
  generate: (rng) => {
    const entries: LogEntry[] = []
    for (let day = 1; day <= 20; day++) {
      // Two to four catches a day, so the days overlap and the run is worth finding.
      const catches = randomInt(rng, 2, 4)
      const seen = new Set<string>()
      for (let i = 0; i < catches; i++) {
        const cat = CATS[randomInt(rng, 0, CATS.length - 1)]!
        if (seen.has(cat)) continue
        seen.add(cat)
        entries.push({ day, cat, fish: randomInt(rng, 1, 9) })
      }
    }

    // One clear winner: a tie would make Part 1 ambiguous and Part 2 unanswerable.
    const totals = totalsOf(entries)
    const best = Math.max(...totals.values())
    const leaders = [...totals.entries()].filter(([, total]) => total === best)
    if (leaders.length > 1) {
      const [name] = leaders[0]!
      const entry = entries.find(one => one.cat === name)!
      entry.fish += 2
    }
    return entries
  },
  format: entries => entries.map(({ day, cat, fish }) => `${day} ${cat} ${fish}`).join('\n'),
  solve: (entries, part) => {
    const totals = totalsOf(entries)
    const winner = [...totals.entries()].reduce((best, one) => (one[1] > best[1] ? one : best))[0]
    if (part === 1) return winner
    return longestRun(entries.filter(entry => entry.cat === winner).map(entry => entry.day))
  },
})

interface Shelter {
  start: number[]
  portions: number[]
}

/** The rules, in one place, so the text on the slide and the answer cannot drift apart. */
const runShelter = (data: Shelter) => {
  const hunger = [...data.start]
  const fed = hunger.map(() => 0)
  data.portions.forEach((portion) => {
    for (let cat = 0; cat < hunger.length; cat++) hunger[cat]! += 1
    let hungriest = 0
    for (let cat = 1; cat < hunger.length; cat++) if (hunger[cat]! > hunger[hungriest]!) hungriest = cat
    hunger[hungriest] = Math.max(0, hunger[hungriest]! - portion)
    fed[hungriest]! += 1
  })
  return { hunger, fed }
}

export const finaleShelter = defineProblem<Shelter>({
  id: 'finale-shelter',
  parts: 2,
  generate: (rng) => {
    const data: Shelter = {
      start: Array.from({ length: 8 }, () => randomInt(rng, 0, 9)),
      portions: Array.from({ length: 30 }, () => randomInt(rng, 2, 7)),
    }
    // Part 2 needs one cat fed more often than every other.
    for (let attempt = 0; attempt < 40; attempt++) {
      const { fed } = runShelter(data)
      const most = Math.max(...fed)
      if (fed.filter(times => times === most).length === 1) break
      data.portions[attempt % data.portions.length] = randomInt(rng, 2, 7)
    }
    return data
  },
  format: (data, locale) => {
    const names = locale === 'de' ? ['start', 'portionen'] : ['start', 'portions']
    return `${names[0]} = [${data.start.join(', ')}]\n${names[1]} = [${data.portions.join(', ')}]`
  },
  solve: (data, part) => {
    const { hunger, fed } = runShelter(data)
    if (part === 1) return hunger.reduce((sum, one) => sum + one, 0)
    return fed.indexOf(Math.max(...fed))
  },
})
