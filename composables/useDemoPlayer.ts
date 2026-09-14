import { nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { useState } from '#app'
import { useI18n } from '~/composables/useI18n'

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
 * Plays on mount, again on Enter or `play()`, and again when the language changes.
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
  const continues = options.continues ?? { id: options.id, stage: options.stage - 1 }

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

  const play = async () => {
    stop()
    finished.value = false
    options.reset()
    await openPointer()

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      options.land()
      pointer.value = { ...pointer.value, visible: false }
      finished.value = true
      return
    }

    const end = options.script()
    later(end + 500, () => { finished.value = true })
  }

  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'Enter') return
    if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) return
    event.preventDefault()
    play()
  }

  options.reset()

  onMounted(() => {
    play()
    window.addEventListener('keydown', onKey)
  })

  watch(locale, () => play())

  onBeforeUnmount(() => {
    stop()
    window.removeEventListener('keydown', onKey)
  })

  return { pointer, instant, finished, later, pointAt, pointAtFraction, play }
}
