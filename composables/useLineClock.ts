/**
 * Lights the line of code a scene is currently running.
 *
 *   const line = useLineClock(() => SCHEDULE[props.stage] ?? [], () => props.stage)
 *   <LessonShell :focus="line ? [line] : current.focus" />
 *
 * The lesson scenes animate in CSS, on a rhythm the component already knows
 * (`at(i)`, `biteAt(k)`, `tileAt(r, c)`). This replays that same rhythm in
 * JavaScript and hands back which line should be lit, so the code panel walks
 * the loop with the picture: the `for` lights when a pass starts, the body
 * while it runs, the line after the loop when it is over.
 *
 * A loop only reads as a loop if the header lights again on every pass, which
 * is the whole reason this exists — a run that only ever lights the `if` hides
 * where the passes begin and end.
 *
 * Reduced motion lands on the last line, since the scene does not animate either.
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface LineStep {
  /** Seconds after the stage opens. */
  at: number
  /** 1-based line of the code panel. */
  line: number
}

export const useLineClock = (steps: () => LineStep[], replayOn?: () => unknown) => {
  const line = ref(0)
  let timers: ReturnType<typeof setTimeout>[] = []

  const stop = () => {
    timers.forEach(clearTimeout)
    timers = []
  }

  const play = () => {
    stop()
    const list = [...steps()].sort((one, two) => one.at - two.at)
    if (!list.length) {
      line.value = 0
      return
    }
    if (import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      line.value = list[list.length - 1]!.line
      return
    }
    line.value = 0
    list.forEach((step) => {
      timers.push(setTimeout(() => { line.value = step.line }, step.at * 1000))
    })
  }

  onMounted(play)
  if (replayOn) watch(replayOn, play)
  onBeforeUnmount(stop)

  return line
}
