import { computed } from 'vue'
import { usePresentationStore } from '~/stores/presentationStore'
import { useInteractionStore } from '~/stores/interactionStore'
import { useSlideData } from '~/composables/useSlideData'
import { useDeckRole } from '~/composables/useDeckRole'
import { useRouter } from '#app'

export interface MoveOptions {
  /** The move comes from the presenter, not from this device. */
  fromFollow?: boolean
  /** Ignore a pending interaction on the current slide. */
  force?: boolean
}

/**
 * Navigation for every surface.
 *
 * A move always changes the local slide of this device. It changes the global
 * slide of the room only when the role is allowed to: the phone remote and the
 * presenter view. A viewer that moves on its own stops following the presenter
 * until it syncs again.
 */
export const usePresentation = () => {
  const store = usePresentationStore()
  const interactions = useInteractionStore()
  const { flatSlides, mainSlideCount, getSlideById, getSlideByRoute, firstSlideId } = useSlideData()
  const { canControlGlobal, isViewer, isInteractive, isPeek, queryMode } = useDeckRole()
  const router = useRouter()

  /** Position of the slide this device renders. */
  const currentIndex = computed(() =>
    flatSlides.value.findIndex(s => s.id === store.localSlideId)
  )

  const currentSlide = computed(() => flatSlides.value[currentIndex.value])

  /** Position of the slide the room is on. */
  const globalIndex = computed(() =>
    flatSlides.value.findIndex(s => s.id === store.globalSlideId)
  )

  const globalSlide = computed(() => flatSlides.value[globalIndex.value])

  /**
   * True when this client is actually showing a slide.
   *
   * The landing page, the join page and the handout are viewers too, but they
   * are not screens in the room: they must never be navigated away by a
   * presenter's move, and they do not count as audience.
   */
  const onSlideRoute = computed(() => !!getSlideByRoute(router.currentRoute.value.path))

  const navigateTo = (route: string) => {
    if (router.currentRoute.value.path === route) return
    // Carry the view mode along, so the next slide renders the same chrome.
    const target = queryMode.value ? { path: route, query: { mode: queryMode.value } } : { path: route }
    router.push(target)
  }

  /**
   * Try to move to a slide. Returns false when an unfinished interaction blocks
   * the move, in which case the guard modal is open and will retry or cancel.
   */
  const requestSlide = (slideId: string, options: MoveOptions = {}): boolean => {
    const target = getSlideById(slideId)
    if (!target) return false

    const leaving = store.localSlideId
    const leavingSlide = getSlideById(leaving)
    // A `required` interaction asks even when the viewer has not started it.
    const unfinished = !!leaving && (
      interactions.pendingOn(leaving) ||
      (!!leavingSlide?.interactive?.required && !interactions.isComplete(leaving))
    )
    const blocked =
      !options.force &&
      isInteractive.value &&
      leaving !== target.id &&
      unfinished

    if (blocked) {
      interactions.openGuard(leaving, target.id, !!options.fromFollow)
      return false
    }

    interactions.closeGuard()
    store.setLocal(target.id)

    // A viewer that moves by itself stops following the presenter.
    if (isViewer.value) store.setFollowing(!!options.fromFollow)

    if (canControlGlobal.value) store.setGlobal(target.id)

    // Controllers drive other screens over the socket, they do not route here.
    // A peek frame routes too: the presenter view tells it what to show.
    if (isViewer.value || isPeek.value) navigateTo(target.route)

    return true
  }

  const goToSlide = (slideId: string, options: MoveOptions = {}) => requestSlide(slideId, options)

  const goToIndex = (index: number, options: MoveOptions = {}) => {
    const target = flatSlides.value[index]
    return target ? requestSlide(target.id, options) : false
  }

  const nextSlide = (options: MoveOptions = {}) => {
    const index = currentIndex.value
    if (index < 0) return goToIndex(0, options)
    if (index < flatSlides.value.length - 1) return goToIndex(index + 1, options)
    return false
  }

  const prevSlide = (options: MoveOptions = {}) => {
    const index = currentIndex.value
    if (index > 0) return goToIndex(index - 1, options)
    return false
  }

  /** Rejoin the room after drifting. */
  const syncToGlobal = () => {
    const target = store.globalSlideId
    if (!target) return false
    store.setFollowing(true)
    return requestSlide(target, { fromFollow: true, force: true })
  }

  const toggleTeleprompter = () => {
    store.toggleTeleprompter()
  }

  const startPresentation = () => {
    store.isPresenting = true
    if (firstSlideId.value) requestSlide(firstSlideId.value, { force: true })
  }

  const exitPresentation = () => {
    if (canControlGlobal.value) store.isPresenting = false
    if (isViewer.value) router.push('/')
  }

  return {
    store,
    interactions,
    flatSlides,
    mainSlideCount,
    onSlideRoute,
    currentIndex,
    currentSlide,
    globalIndex,
    globalSlide,
    canControlGlobal,
    isViewer,
    isInteractive,
    requestSlide,
    goToSlide,
    goToIndex,
    nextSlide,
    prevSlide,
    syncToGlobal,
    toggleTeleprompter,
    startPresentation,
    exitPresentation
  }
}
