import { computed } from 'vue'
import { slides, deckConfig, slideCounter } from '~/slides.config'
import type { SlideEntry, SlideInteractive, SlideLayoutName, SlideTransition } from '~/slides.config'
import { isSlideId, slideIdToRoute, routeToSlideId } from '~/utils/slideId'

export interface FlatSlide {
  /** Permanent slide id, e.g. `PRE-0004`. */
  id: string
  title: string
  subtitle?: string
  route: string
  layout: SlideLayoutName
  teleprompter?: string
  transition?: SlideTransition
  /** Planned minutes on this slide. */
  duration?: number
  backgroundColor?: string
  /** Present when the slide declares an interaction. */
  interactive?: SlideInteractive
  /** True when the entry declares a `parent`. */
  isSubSlide: boolean
  parentId?: string
  parentTitle?: string
  /** Zero based position in the presentation order. */
  index: number
  /** Number of the parent slide, or of the slide itself when it is a main slide. */
  mainNumber: number
  /** 1 based position inside the parent, or 0 for a main slide. */
  subNumber: number
  /** Human page number drawn by the layouts: `3` or `3.2`. */
  pageLabel: string
}

export interface SlideNode extends FlatSlide {
  children: FlatSlide[]
}

const DEFAULT_LAYOUT: SlideLayoutName = 'slide'

function routeOf(entry: SlideEntry): string {
  return entry.route || slideIdToRoute(entry.id)
}

export const useSlideData = () => {
  /** Every visible slide, in presentation order, with numbering resolved. */
  const flatSlides = computed<FlatSlide[]>(() => {
    const visible = slides.filter(entry => !entry.hidden)
    // A hidden parent cannot hold a sub-slide, so its children become main slides.
    const byId = new Map(visible.map(entry => [entry.id, entry]))

    // Pass one: number the main slides, so a sub-slide can read its parent
    // number no matter where the parent sits in the array.
    const mainNumbers = new Map<string, number>()
    visible.forEach((entry) => {
      if (!entry.parent || !byId.has(entry.parent)) {
        mainNumbers.set(entry.id, mainNumbers.size + 1)
      }
    })

    // Pass two: number the sub-slides inside each parent and build the list.
    const subCounters = new Map<string, number>()

    return visible.map((entry, index) => {
      const parent = entry.parent ? byId.get(entry.parent) : undefined
      const isSubSlide = !!parent

      let mainNumber = mainNumbers.get(entry.id) ?? 0
      let subNumber = 0

      if (isSubSlide) {
        mainNumber = mainNumbers.get(parent!.id) ?? 0
        subNumber = (subCounters.get(parent!.id) || 0) + 1
        subCounters.set(parent!.id, subNumber)
      }

      return {
        id: entry.id,
        title: entry.title,
        subtitle: entry.subtitle,
        route: routeOf(entry),
        layout: entry.layout || DEFAULT_LAYOUT,
        teleprompter: entry.teleprompter,
        transition: entry.transition,
        duration: entry.duration,
        backgroundColor: entry.backgroundColor,
        interactive: entry.interactive,
        isSubSlide,
        parentId: parent?.id,
        parentTitle: parent?.title,
        index,
        mainNumber,
        subNumber,
        pageLabel: isSubSlide ? `${mainNumber}.${subNumber}` : `${mainNumber}`,
      }
    })
  })

  /** Main slides with their sub-slides nested, for the dashboard. */
  const slideTree = computed<SlideNode[]>(() => {
    const nodes: SlideNode[] = []
    const index = new Map<string, SlideNode>()

    for (const slide of flatSlides.value) {
      if (slide.isSubSlide) {
        index.get(slide.parentId!)?.children.push(slide)
      } else {
        const node: SlideNode = { ...slide, children: [] }
        index.set(slide.id, node)
        nodes.push(node)
      }
    }

    return nodes
  })

  /** Count of main slides, which is what the page number is measured against. */
  const mainSlideCount = computed(() => slideTree.value.length)

  const getSlideById = (id: string | null | undefined) =>
    id ? flatSlides.value.find(s => s.id === id) : undefined

  const getSlideByRoute = (path: string) => {
    const byId = getSlideById(routeToSlideId(path))
    return byId || flatSlides.value.find(s => s.route === path)
  }

  const firstSlideId = computed(() => flatSlides.value[0]?.id)

  const isSlideRoute = (path: string) => !!getSlideByRoute(path)

  return {
    slides,
    deckConfig,
    slideCounter,
    flatSlides,
    slideTree,
    mainSlideCount,
    getSlideById,
    getSlideByRoute,
    firstSlideId,
    isSlideRoute,
    isSlideId,
  }
}
