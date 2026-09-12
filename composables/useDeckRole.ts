import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { slideCounter } from '~/slides.config'

export type DeckRole = 'control' | 'presenter' | 'viewer' | 'dashboard' | 'peek'
export type ViewMode = 'stage' | 'interactive'

/** Storage keys are per deck, so two decks on one host cannot collide. */
export const storageKey = (name: string) => `deck:${slideCounter.prefix}:${name}`

const VIEW_MODE_KEY = () => storageKey('view-mode')
const ROOM_KEY = () => storageKey('room-key')

/** Read once per client, then shared, so every component agrees. */
const storedMode = ref<ViewMode | null>(null)
const storedRoomKey = ref<string>('')
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
 * presenter view may move the global slide position, and the server also asks
 * them for the room key before it accepts a move.
 *
 * The view mode is the opposite: a per-device preference. It travels in the
 * `mode` query parameter so the server renders the right chrome straight away,
 * and it is remembered in `localStorage` for links that carry no query.
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

  const queryKey = computed(() => {
    const raw = Array.isArray(route.query.key) ? route.query.key[0] : route.query.key
    return typeof raw === 'string' ? raw : ''
  })

  const setViewMode = (mode: ViewMode) => {
    storedMode.value = mode
    if (import.meta.client) writeStorage(VIEW_MODE_KEY(), mode)
  }

  const setRoomKey = (key: string) => {
    storedRoomKey.value = key
    if (import.meta.client && key) writeStorage(ROOM_KEY(), key)
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
      storedRoomKey.value = readStorage(ROOM_KEY()) || ''
    }
    if (queryMode.value) setViewMode(queryMode.value)
    if (queryKey.value) setRoomKey(queryKey.value)
  }

  /** The query parameter wins, so a shared link always behaves as intended. */
  const viewMode = computed<ViewMode>(() => queryMode.value || storedMode.value || 'stage')
  const roomKey = computed(() => queryKey.value || storedRoomKey.value)

  const isInteractive = computed(() => isViewer.value && viewMode.value === 'interactive')

  return {
    role,
    isPeek,
    canControlGlobal,
    isViewer,
    viewMode,
    queryMode,
    roomKey,
    isInteractive,
    setViewMode,
    setRoomKey,
    adoptDeviceSettings
  }
}
