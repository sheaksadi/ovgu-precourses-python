/**
 * The sorting runs of the detour, recorded frame by frame.
 *
 * Both sorting scenes play the same thing: `components/lesson/Sorting.vue` next
 * to its code panel with five fish, `components/lesson/SortingRun.vue` across
 * the whole slide with twenty. So the algorithms live here once, and they are
 * the real ones — every comparison and every swap is recorded as it happens,
 * nothing is staged.
 *
 * A frame also carries the line of code it is running, so the panel can follow
 * the bars. Line numbers differ per slide, which is why they are passed in.
 */

/** One moment of a run: where every value stands, and what is being looked at. */
export interface SortFrame {
  /** Value ids in their current places. */
  order: number[]
  /** The two places being compared, or -1. */
  a: number
  b: number
  /** True when this frame is the result of a swap. */
  swap: boolean
  /** How many places are final, counted from the left and from the right. */
  left: number
  right: number
  compares: number
  swaps: number
  pass: number
  /** The line of the code panel this moment is running. */
  line: number
}

export type SortName = 'bubble' | 'selection' | 'insertion'

/** Which line each kind of moment lights. */
export interface SortLines {
  compare: number
  swap: number
  done: number
}

const NO_LINES: SortLines = { compare: 0, swap: 0, done: 0 }

export const sortFrames = (values: number[], name: SortName, lines: SortLines = NO_LINES): SortFrame[] => {
  const size = values.length
  const ids = values.map((_, i) => i)
  const value = (id: number) => values[id]!
  const arr = [...ids]
  const out: SortFrame[] = []
  let compares = 0
  let swaps = 0

  const frame = (rest: Partial<SortFrame> = {}): SortFrame => ({
    order: [...arr],
    a: -1,
    b: -1,
    swap: false,
    left: 0,
    right: 0,
    compares,
    swaps,
    pass: 0,
    line: 0,
    ...rest,
  })

  out.push(frame({ line: name === 'bubble' ? lines.done : 1 }))

  if (name === 'bubble') {
    for (let i = 0; i < size - 1; i++) {
      for (let j = 0; j < size - 1 - i; j++) {
        compares++
        out.push(frame({ a: j, b: j + 1, right: i, pass: i + 1, line: lines.compare }))
        if (value(arr[j]!) > value(arr[j + 1]!)) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1]!, arr[j]!]
          swaps++
          out.push(frame({ a: j, b: j + 1, swap: true, right: i, pass: i + 1, line: lines.swap }))
        }
      }
    }
  }

  if (name === 'selection') {
    for (let i = 0; i < size - 1; i++) {
      let min = i
      for (let j = i + 1; j < size; j++) {
        compares++
        out.push(frame({ a: min, b: j, left: i, pass: i + 1, line: lines.compare }))
        if (value(arr[j]!) < value(arr[min]!)) min = j
      }
      if (min !== i) {
        ;[arr[i], arr[min]] = [arr[min]!, arr[i]!]
        swaps++
        out.push(frame({ a: i, b: min, swap: true, left: i, pass: i + 1, line: lines.swap }))
      }
    }
  }

  if (name === 'insertion') {
    // Drawn as the adjacent swaps it really is: the card slides left one place
    // at a time, which is what the picture has to show.
    for (let i = 1; i < size; i++) {
      let j = i
      while (j > 0 && value(arr[j - 1]!) > value(arr[j]!)) {
        compares++
        out.push(frame({ a: j - 1, b: j, left: i, pass: i, line: lines.compare }))
        ;[arr[j - 1], arr[j]] = [arr[j]!, arr[j - 1]!]
        swaps++
        out.push(frame({ a: j - 1, b: j, swap: true, left: i, pass: i, line: lines.swap }))
        j--
      }
      if (j > 0) {
        compares++
        out.push(frame({ a: j - 1, b: j, left: i + 1, pass: i, line: lines.compare }))
      }
    }
  }

  out.push(frame({ left: size, pass: size - 1, line: lines.done }))
  return out
}
