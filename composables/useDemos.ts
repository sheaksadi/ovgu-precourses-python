/**
 * Demos, played by the room rather than by one screen.
 *
 *   const demos = useDemos()
 *   demos.replay(4200)   // ask every screen to play this demo again
 *   demos.busy.value     // true while one is playing
 *
 * Pressing "play it again" on a phone used to replay the phone. The room is
 * watching the projector, so a replay has to reach every screen: the request
 * goes over the WebSocket (`server/routes/_ws.ts`), comes back as a broadcast,
 * and every screen plays from the top at the same moment.
 *
 * While one runs, `busy` is true everywhere. Screens use it to hold their
 * buttons still, so a second tap cannot cut the animation off halfway. The
 * presenter view ignores it and keeps its controls: whoever is talking must be
 * able to move on at any time.
 *
 * `nonce` is how a scene with no JavaScript of its own replays. Most lesson
 * scenes are CSS animations that run once when they mount, so the slide layouts
 * key their content on it: a replay remounts the scene and every animation
 * starts from the top. Slides carrying a puzzle or a code task are left alone —
 * remounting those would throw away what somebody is typing.
 */
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useState } from '#app'

export function useDemos() {
  /** Local clock time when the running demo is done everywhere. */
  const until = useState<number>('deck-demo-until', () => 0)
  /** Ticks while a demo runs, so `busy` re-evaluates without a timer per button. */
  const now = useState<number>('deck-demo-now', () => 0)
  /** Counts replays, so a keyed scene remounts and its animations start again. */
  const nonce = useState<number>('deck-demo-nonce', () => 0)
  /**
   * Scenes that carry a replay button of their own — the walk-throughs put one
   * under their frame, where the demo is. Two buttons asking the room for the
   * same thing is one too many, so the deck's own bar stands down while such a
   * scene is on screen.
   */
  const owners = useState<number>('deck-demo-owners', () => 0)

  let timer: ReturnType<typeof setInterval> | null = null

  const tick = () => {
    now.value = Date.now()
    if (now.value >= until.value && timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const hold = (ms: number) => {
    until.value = Date.now() + ms
    now.value = Date.now()
    if (!timer) timer = setInterval(tick, 200)
  }

  onMounted(() => { if (until.value > Date.now() && !timer) timer = setInterval(tick, 200) })
  onBeforeUnmount(() => { if (timer) { clearInterval(timer); timer = null } })

  /** The shortest a replay holds the buttons, for a scene that reports nothing. */
  const MIN_HOLD = 1200

  return {
    busy: computed(() => now.value < until.value),
    nonce: computed(() => nonce.value),
    /** True while a scene on screen offers a replay of its own. */
    ownsReplay: computed(() => owners.value > 0),
    /** Said by such a scene, for as long as it is mounted. */
    claimReplay: () => {
      owners.value++
      onBeforeUnmount(() => { owners.value = Math.max(0, owners.value - 1) })
    },
    /** How long the demo that is running still has, for anything that wants to wait. */
    remaining: computed(() => Math.max(0, until.value - now.value)),
    hold,
    /** The room heard a replay: play from the top and hold the buttons. */
    applyRemote: (event: { forMs?: number }) => {
      nonce.value++
      hold(Math.max(Number(event?.forMs) || 0, MIN_HOLD))
    },
    clear: () => { until.value = 0; now.value = Date.now() },
  }
}
