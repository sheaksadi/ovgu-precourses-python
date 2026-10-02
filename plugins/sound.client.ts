/**
 * Wires the room's sound layer (`composables/useSound.ts`) to the deck.
 *
 * Two things make a sound, on a screen that is heard (`useSound`): the deck
 * moving to another slide and a notification coming up. `m` flips the sound on
 * any slide view and says so in a toast, so a screen being recorded can be
 * switched on without pretending to be the projector. Anything
 * the room asks for and waits on — a spin landing, a cat arriving — plays its
 * own cue from where that answer is handled, in `useWebSocket`.
 *
 * Direction comes from the slide order, so going back sounds duller than going
 * on. The very first slide a screen opens makes no sound: nobody moved, the
 * page simply loaded.
 */
import { watch } from 'vue'
import { defineNuxtPlugin, useRouter } from '#app'
import { useSound } from '~/composables/useSound'
import { useToasts } from '~/composables/useToasts'
import { useI18n } from '~/composables/useI18n'
import { useSlideData } from '~/composables/useSlideData'

export default defineNuxtPlugin(() => {
  const router = useRouter()
  const sound = useSound()
  const toasts = useToasts()
  const { t } = useI18n()
  const { flatSlides } = useSlideData()

  sound.hydrate()

  const indexOf = (path: string) => flatSlides.value.findIndex(slide => slide.route === path)

  let last = indexOf(router.currentRoute.value.path)
  router.afterEach((to) => {
    const next = indexOf(to.path)
    if (next < 0) { last = next; return }
    if (last >= 0 && next !== last) sound.move(next > last)
    last = next
  })

  // A notification is a small event; it gets the quietest cue there is.
  watch(() => toasts.toasts.value.length, (now, before) => {
    if (now > (before ?? 0)) sound.note()
  })

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'm' && event.key !== 'M') return
    if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement)?.tagName)) return
    if (!sound.onViewer.value) return
    const on = !sound.audible.value
    sound.setMuted(!on)
    toasts.push({
      tone: on ? 'mint' : 'sun',
      icon: on ? 'lucide:volume-2' : 'lucide:volume-x',
      title: t(on ? 'sound.on' : 'sound.off'),
      duration: 1600,
    })
  })
})
