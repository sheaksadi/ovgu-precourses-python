import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePresentationStore } from '~/stores/presentationStore'
import { useSlideData } from '~/composables/useSlideData'

/**
 * The slide the chrome should describe.
 *
 * The route wins, so a layout renders the right page number during server side
 * rendering and on a directly opened slide URL. The local position is the next
 * fallback, and the room's position the last one; the remote control and the
 * presenter view need that, since their own route is not a slide.
 */
export const useCurrentSlide = () => {
  const route = useRoute()
  const store = usePresentationStore()
  const { flatSlides, getSlideByRoute, getSlideById } = useSlideData()

  const slide = computed(() =>
    getSlideByRoute(route.path) || getSlideById(store.localSlideId) || getSlideById(store.globalSlideId)
  )

  const index = computed(() => slide.value?.index ?? -1)

  const progress = computed(() => {
    if (flatSlides.value.length <= 1) return 100
    return (Math.max(0, index.value) / (flatSlides.value.length - 1)) * 100
  })

  const background = computed(() => slide.value?.backgroundColor)

  return { slide, index, progress, background }
}
