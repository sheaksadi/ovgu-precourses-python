/**
 * The sorting runs of the detour, recorded frame by frame.
 *
 * Both sorting scenes play the same thing: `components/lesson/Sorting.vue` next
 * to its code panel with five fish, `components/lesson/SortingRun.vue` across
 * the whole slide with twenty. So the algorithms live here once, and they are
 * the real ones — every comparison and every swap is recorded as it happens,
 * nothing is staged.
 *
 * The three the lesson writes out by hand work on the whole row, so a frame
 * says how much of it is final (`left`, `right`). The two that divide the row
 * instead — merge and quick — say which stretch they are working on (`lo`,
 * `hi`), which places are settled (`fixed`), and, for quick sort, where the
 * pivot stands.
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
  /** The stretch being worked on right now, or -1: merge and quick sort. */
  lo: number
  hi: number
  /** Where the pivot stands right now, or -1: quick sort. */
  pivot: number
  /** Places that are in order already, for the runs that settle them apart. */
  fixed: number[]
  compares: number
  swaps: number
  pass: number
  /** The loop counters right now, as the code names them, or -1. */
  i: number
  j: number
  /** The line of the code panel this moment is running. */
  line: number
}

export type SortName = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick'

/**
 * Which line each kind of moment lights. The loop headers matter as much as the
 * body: a run that only ever lights the `if` hides where the passes begin and
 * end, which is the part of a nested loop that is hard to see.
 */
export interface SortLines {
  /** The outer `for`, lit when a pass starts. */
  outer: number
  /** The inner `for` or `while`, lit when it starts over. */
  inner: number
  compare: number
  swap: number
  done: number
}

const NO_LINES: SortLines = { outer: 0, inner: 0, compare: 0, swap: 0, done: 0 }

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
    lo: -1,
    hi: -1,
    pivot: -1,
    fixed: [],
    compares,
    swaps,
    pass: 0,
    i: -1,
    j: -1,
    line: 0,
    ...rest,
  })

  out.push(frame({ line: name === 'bubble' ? lines.done : 1 }))

  if (name === 'bubble') {
    for (let i = 0; i < size - 1; i++) {
      out.push(frame({ right: i, pass: i + 1, i, line: lines.outer }))
      out.push(frame({ right: i, pass: i + 1, i, j: 0, line: lines.inner }))
      for (let j = 0; j < size - 1 - i; j++) {
        compares++
        out.push(frame({ a: j, b: j + 1, right: i, pass: i + 1, i, j, line: lines.compare }))
        if (value(arr[j]!) > value(arr[j + 1]!)) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1]!, arr[j]!]
          swaps++
          out.push(frame({ a: j, b: j + 1, swap: true, right: i, pass: i + 1, i, j, line: lines.swap }))
        }
      }
    }
  }

  if (name === 'selection') {
    for (let i = 0; i < size - 1; i++) {
      out.push(frame({ left: i, pass: i + 1, i, line: lines.outer }))
      let min = i
      out.push(frame({ a: min, left: i, pass: i + 1, i, j: i + 1, line: lines.inner }))
      for (let j = i + 1; j < size; j++) {
        compares++
        out.push(frame({ a: min, b: j, left: i, pass: i + 1, i, j, line: lines.compare }))
        if (value(arr[j]!) < value(arr[min]!)) min = j
      }
      if (min !== i) {
        ;[arr[i], arr[min]] = [arr[min]!, arr[i]!]
        swaps++
        out.push(frame({ a: i, b: min, swap: true, left: i, pass: i + 1, i, line: lines.swap }))
      }
    }
  }

  if (name === 'insertion') {
    // Drawn as the adjacent swaps it really is: the card slides left one place
    // at a time, which is what the picture has to show.
    for (let i = 1; i < size; i++) {
      out.push(frame({ left: i, pass: i, i, line: lines.outer }))
      let j = i
      out.push(frame({ a: j, left: i, pass: i, i, j, line: lines.inner }))
      while (j > 0 && value(arr[j - 1]!) > value(arr[j]!)) {
        compares++
        out.push(frame({ a: j - 1, b: j, left: i, pass: i, i, j, line: lines.compare }))
        ;[arr[j - 1], arr[j]] = [arr[j]!, arr[j - 1]!]
        swaps++
        out.push(frame({ a: j - 1, b: j, swap: true, left: i, pass: i, i, j, line: lines.swap }))
        j--
      }
      if (j > 0) {
        compares++
        out.push(frame({ a: j - 1, b: j, left: i + 1, pass: i, i, j, line: lines.compare }))
      }
    }
  }

  if (name === 'merge') {
    // Split to single values, then put the halves back together in order. The
    // row itself is the only thing on screen, so a merge writes its result into
    // the stretch it owns and pushes what is left of both halves behind it.
    const settled = new Set<number>()

    const mergeRange = (lo: number, mid: number, hi: number, depth: number) => {
      const leftHalf = arr.slice(lo, mid + 1)
      const rightHalf = arr.slice(mid + 1, hi + 1)
      // The two halves are in order, but the stretch is about to be rebuilt.
      for (let k = lo; k <= hi; k++) settled.delete(k)
      out.push(frame({ lo, hi, pass: depth, fixed: [...settled], line: lines.outer }))

      const merged: number[] = []
      let i = 0
      let j = 0

      /** Settled elsewhere, plus the front of this stretch, which is done too. */
      const inOrder = () => [...settled, ...merged.map((_, k) => lo + k)]

      /** Write the stretch as it stands: merged so far, then both leftovers. */
      const place = (rest: Partial<SortFrame>) => {
        const row = [...merged, ...leftHalf.slice(i), ...rightHalf.slice(j)]
        row.forEach((id, k) => { arr[lo + k] = id })
        out.push(frame({ lo, hi, pass: depth, fixed: inOrder(), ...rest }))
      }

      const take = (id: number) => {
        merged.push(id)
        swaps++
        // The value that just landed is the one to watch, not yet the green wall.
        place({ a: lo + merged.length - 1, swap: true, line: lines.swap, fixed: [...settled, ...merged.slice(0, -1).map((_, k) => lo + k)] })
      }

      while (i < leftHalf.length && j < rightHalf.length) {
        compares++
        out.push(frame({ a: lo + merged.length, lo, hi, pass: depth, fixed: inOrder(), line: lines.compare }))
        if (value(leftHalf[i]!) <= value(rightHalf[j]!)) take(leftHalf[i++]!)
        else take(rightHalf[j++]!)
      }
      while (i < leftHalf.length) take(leftHalf[i++]!)
      while (j < rightHalf.length) take(rightHalf[j++]!)

      for (let k = lo; k <= hi; k++) settled.add(k)
      out.push(frame({ lo, hi, pass: depth, fixed: [...settled], line: lines.done }))
    }

    const sortRange = (lo: number, hi: number, depth: number) => {
      if (lo >= hi) {
        settled.add(lo)
        return
      }
      const mid = Math.floor((lo + hi) / 2)
      sortRange(lo, mid, depth + 1)
      sortRange(mid + 1, hi, depth + 1)
      mergeRange(lo, mid, hi, depth)
    }

    sortRange(0, size - 1, 0)
  }

  if (name === 'quick') {
    // Lomuto's partition, with the last value of the stretch as the pivot: walk
    // it once, push everything smaller to the front, then drop the pivot in
    // between. That one place is final, and both sides are sorted the same way.
    const settled = new Set<number>()

    const partition = (lo: number, hi: number, depth: number): number => {
      const pivotId = arr[hi]!
      out.push(frame({ lo, hi, pivot: hi, pass: depth, fixed: [...settled], line: lines.outer }))
      let i = lo
      for (let j = lo; j < hi; j++) {
        compares++
        out.push(frame({ a: j, b: hi, lo, hi, pivot: hi, pass: depth, fixed: [...settled], line: lines.compare }))
        if (value(arr[j]!) < value(pivotId)) {
          if (i !== j) {
            ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
            swaps++
            out.push(frame({ a: i, b: j, swap: true, lo, hi, pivot: hi, pass: depth, fixed: [...settled], line: lines.swap }))
          }
          i++
        }
      }
      if (i !== hi) {
        ;[arr[i], arr[hi]] = [arr[hi]!, arr[i]!]
        swaps++
        out.push(frame({ a: i, b: hi, swap: true, lo, hi, pivot: i, pass: depth, fixed: [...settled], line: lines.swap }))
      }
      settled.add(i)
      out.push(frame({ lo, hi, pivot: i, pass: depth, fixed: [...settled], line: lines.done }))
      return i
    }

    const sortRange = (lo: number, hi: number, depth: number) => {
      if (lo > hi) return
      if (lo === hi) {
        settled.add(lo)
        return
      }
      const p = partition(lo, hi, depth)
      sortRange(lo, p - 1, depth + 1)
      sortRange(p + 1, hi, depth + 1)
    }

    sortRange(0, size - 1, 0)
  }

  out.push(frame({ left: size, pass: size - 1, line: lines.done }))
  return out
}
