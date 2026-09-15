import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { slideCounter } from '~/slides.config'

export type DeckRole = 'control' | 'presenter' | 'viewer' | 'dashboard' | 'peek'
export type ViewMode = 'stage' | 'interactive'

/** Storage keys are per deck, so two decks on one host cannot collide. */
export const storageKey = (name: string) => `deck:${slideCounter.prefix}:${name}`

const VIEW_MODE_KEY = () => storageKey('view-mode')
const SCREEN_KEY = () => storageKey('screen')

export type Screen = 'projector' | 'audience'

/** Read once per client, then shared, so every component agrees. */
const storedMode = ref<ViewMode | null>(null)
const storedScreen = ref<Screen | null>(null)
let storedLoaded = false

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // A device with blocked storage still works, it just forgets the value.
  }
}

/**
 * Who this client is and what it is allowed to do.
 *
 * The role comes from the route alone, so a slide view can never promote itself
 * into a controller with a query parameter. Only the phone remote and the
 * presenter view may move the global slide position.
 *
 * The view mode is the opposite: a per-device preference. It travels in the
 * `mode` query parameter so the server renders the right chrome straight away,
 * and it is remembered in `localStorage` for links that carry no query.
 *
 * The screen works the same way: `?screen=projector` (the start page's
 * Projector button) marks the big screen, which watches the room's activities
 * instead of taking part; `/join` marks a device as `audience` again.
 */
export const useDeckRole = () => {
  const route = useRoute()

  /** A peek frame is a preview inside the presenter view. */
  const isPeek = computed(() => route.query.peek === '1')

  const role = computed<DeckRole>(() => {
    if (route.path === '/control') return 'control'
    if (route.path === '/presenter') return 'presenter'
    if (route.path === '/dashboard') return 'dashboard'
    return isPeek.value ? 'peek' : 'viewer'
  })

  /** True for the two surfaces that own the presentation order. */
  const canControlGlobal = computed(() => role.value === 'control' || role.value === 'presenter')

  /** True for a screen that renders a slide and keeps its own local position. */
  const isViewer = computed(() => role.value === 'viewer')

  const queryMode = computed<ViewMode | null>(() => {
    const raw = Array.isArray(route.query.mode) ? route.query.mode[0] : route.query.mode
    return raw === 'interactive' || raw === 'stage' ? raw : null
  })

  const queryScreen = computed<Screen | null>(() => {
    const raw = Array.isArray(route.query.screen) ? route.query.screen[0] : route.query.screen
    return raw === 'projector' || raw === 'audience' ? raw : null
  })

  const setScreen = (screen: Screen) => {
    storedScreen.value = screen
    if (import.meta.client) writeStorage(SCREEN_KEY(), screen)
  }

  /** The projector: a slide view that shows what the audience does but joins in nothing. */
  const isProjector = computed(() => isViewer.value && (queryScreen.value || storedScreen.value) === 'projector')

  const setViewMode = (mode: ViewMode) => {
    storedMode.value = mode
    if (import.meta.client) writeStorage(VIEW_MODE_KEY(), mode)
  }

  /**
   * Load what this device remembers. Called after mount, so nothing can differ
   * between the server render and hydration.
   */
  const adoptDeviceSettings = () => {
    if (import.meta.client && !storedLoaded) {
      storedLoaded = true
      const remembered = readStorage(VIEW_MODE_KEY())
      if (remembered === 'interactive' || remembered === 'stage') storedMode.value = remembered
      const screen = readStorage(SCREEN_KEY())
      if (screen === 'projector' || screen === 'audience') storedScreen.value = screen
    }
    if (queryMode.value) setViewMode(queryMode.value)
    if (queryScreen.value) setScreen(queryScreen.value)
  }

  /** The query parameter wins, so a shared link always behaves as intended. */
  const viewMode = computed<ViewMode>(() => queryMode.value || storedMode.value || 'stage')

  const isInteractive = computed(() => isViewer.value && viewMode.value === 'interactive')

  return {
    role,
    isPeek,
    canControlGlobal,
    isViewer,
    viewMode,
    queryMode,
    isInteractive,
    isProjector,
    setScreen,
    setViewMode,
    adoptDeviceSettings
  }
}
