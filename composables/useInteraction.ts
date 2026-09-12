import { computed, onMounted } from 'vue'
import { useInteractionStore } from '~/stores/interactionStore'
import { useCurrentSlide } from '~/composables/useCurrentSlide'

/**
 * What an interactive slide component uses to report its progress.
 *
 * Progress is per device and never leaves it. The layout reads the same store to
 * show the step indicator, and `usePresentation` reads it to decide whether to
 * ask before leaving the slide.
 *
 * ```ts
 * const { step, total, next, complete } = useInteraction(3)
 * ```
 */
export const useInteraction = (total = 1, slideId?: string) => {
  const interactions = useInteractionStore()
  const { slide } = useCurrentSlide()

  const id = computed(() => slideId || slide.value?.id || '')

  onMounted(() => {
    if (id.value) interactions.ensure(id.value, total)
  })

  const entry = computed(() => (id.value ? interactions.progress[id.value] : undefined))

  const step = computed(() => entry.value?.step ?? 1)
  const steps = computed(() => entry.value?.total ?? total)
  const started = computed(() => !!entry.value?.started)
  const completed = computed(() => !!entry.value?.completed)
  /** Value this device remembered for the slide, such as a chosen answer. */
  const value = computed(() => entry.value?.value)

  const markStarted = () => { if (id.value) interactions.markStarted(id.value, total) }
  const setStep = (target: number) => { if (id.value) interactions.setStep(id.value, target) }
  const next = () => setStep(step.value + 1)
  const back = () => setStep(step.value - 1)
  const complete = () => { if (id.value) interactions.complete(id.value) }
  const reset = () => { if (id.value) interactions.reset(id.value) }
  const setValue = (stored: unknown) => { if (id.value) interactions.setValue(id.value, stored) }

  return {
    slideId: id,
    step,
    total: steps,
    started,
    completed,
    value,
    markStarted,
    setStep,
    next,
    back,
    complete,
    reset,
    setValue
  }
}
