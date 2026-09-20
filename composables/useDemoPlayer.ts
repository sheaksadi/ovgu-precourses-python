import { nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { useState } from '#app'
import { useI18n } from '~/composables/useI18n'
import { useDemos } from '~/composables/useDemos'
import { useWebSocket } from '~/composables/useWebSocket'

/**
 * Plays a click-through demo like a short screen recording: the browser of the
 * PyCharm install, the PyCharm window of the project and run walk-throughs.
 *
 * A demo is split over several slides, one stage each. Every stage opens on the
 * previous stage's last frame (`reset`, also used for the server render) and
 * schedules only its own steps (`script`); reduced motion jumps straight to the
 * last frame (`land`). Where the pointer rests is handed to the stage that
 * continues the demo through `useState`, so advancing a slide never makes it jump.
 *
 * Plays on mount, the way every other animated slide does: opening the slide
 * is what starts it, and nothing waits behind a button. Again on Enter or
 * `play()`, and again when the language changes.
 *
 * A replay asked for by a person plays everywhere: `replay()` tells the room
 * over the WebSocket and every screen starts from the top together, because the
 * room is watching the projector, not the phone that tapped. While it runs the
 * deck is held busy (`useDemos`), so the buttons that could cut it off go quiet.
 */
export interface DemoStage {
  /** Names the demo, so the pointer is handed only to the stage that continues it. */
  id: string
  stage: number
}

export interface DemoPointer {
  x: number
  y: number
  visible: boolean
}

export interface DemoPlayerOptions extends DemoStage {
  /** The element the pointer moves in. Targets are looked up inside it. */
  frame: Readonly<Ref<HTMLElement | null>>
  /** The stage whose last frame this one opens on. Defaults to the previous stage of the same demo. */
  continues?: DemoStage
  /** Puts the demo on this stage's opening frame. */
  reset: () => void
  /** Puts the demo on this stage's last frame. */
  land: () => void
  /** Schedules this stage's steps with `later` and returns when the last one fires, in ms. */
  script: () => number
}

export const useDemoPlayer = (options: DemoPlayerOptions) => {
  const { locale } = useI18n()
  const demos = useDemos()
  const ws = useWebSocket()
  const continues = options.continues ?? { id: options.id, stage: options.stage - 1 }

  /** How long the last run took, so a replay can hold the room for that long. */
  const lastRun = ref(0)
  const pointer = ref<DemoPointer>({ x: 0, y: 0, visible: false })
  /** Place the pointer and the scene without gliding, for the opening frame. */
  const instant = ref(false)
  const finished = ref(false)
  const carried = useState<(DemoStage & { x: number, y: number }) | null>('demo-pointer', () => null)

  let timers: ReturnType<typeof setTimeout>[] = []
  const later = (ms: number, step: () => void) => { timers.push(setTimeout(step, ms)) }
  const stop = () => {
    timers.forEach(clearTimeout)
    timers = []
  }

  /** Glide the pointer onto the element matching `selector`, measured after the scene has rendered. */
  const pointAt = async (selector: string) => {
    await nextTick()
    const frame = options.frame.value
    const target = frame?.querySelector(selector)
    if (!frame || !target) return
    const box = frame.getBoundingClientRect()
    const rect = target.getBoundingClientRect()
    pointer.value = {
      x: rect.left - box.left + Math.min(rect.width * 0.55, 60),
      y: rect.top - box.top + rect.height * 0.6,
      visible: true,
    }
  }

  const pointAtFraction = (x: number, y: number) => {
    const frame = options.frame.value
    if (!frame) return
    pointer.value = { x: frame.clientWidth * x, y: frame.clientHeight * y, visible: true }
  }

  watch(pointer, (value) => {
    const frame = options.frame.value
    if (!frame) return
    carried.value = value.visible
      ? { id: options.id, stage: options.stage, x: value.x / frame.clientWidth, y: value.y / frame.clientHeight }
      : null
  })

  /** Pick the pointer up where the stage before put it down, or keep it hidden in the corner. */
  const openPointer = async () => {
    const width = options.frame.value?.clientWidth ?? 600
    const height = options.frame.value?.clientHeight ?? 400
    const from = carried.value
    instant.value = true
    pointer.value = from && from.id === continues.id && from.stage === continues.stage
      ? { x: from.x * width, y: from.y * height, visible: true }
      : { x: width * 0.82, y: height * 0.92, visible: false }
    await nextTick()
    requestAnimationFrame(() => requestAnimationFrame(() => { instant.value = false }))
  }

  const play = async (): Promise<number> => {
    stop()
    finished.value = false
    options.reset()
    await openPointer()

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      options.land()
      pointer.value = { ...pointer.value, visible: false }
      finished.value = true
      return 0
    }

    const end = options.script()
    later(end + 500, () => { finished.value = true })
    return end + 500
  }

  /** A person asked for it again: the whole room plays it again. */
  const replay = () => {
    const runs = lastRun.value || 6000
    demos.hold(runs)
    ws.sendDemoReplay(runs)
  }

  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'Enter') return
    if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) return
    event.preventDefault()
    replay()
  }

  /** The room asked: play, but do not ask the room back. */
  const onRoomReplay = () => { play().then((ms) => { lastRun.value = ms }) }

  options.reset()

  onMounted(() => {
    play().then((ms) => { lastRun.value = ms })
    window.addEventListener('keydown', onKey)
    window.addEventListener('deck:demo-replay', onRoomReplay)
  })

  // The demo is written in the room's language, so it plays again when that
  // changes.
  watch(locale, () => { play().then((ms) => { lastRun.value = ms }) })

  onBeforeUnmount(() => {
    stop()
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('deck:demo-replay', onRoomReplay)
  })

  return { pointer, instant, finished, later, pointAt, pointAtFraction, play: replay, busy: demos.busy }
}
