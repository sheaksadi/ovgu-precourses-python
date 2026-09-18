<script setup lang="ts">
/**
 * The debug switcher. Mounted once in `app.vue`, visible only while debug mode
 * is on (turned on from the start page, remembered per device).
 *
 * It exists to try the deck out alone: open the same slide as the projector, as
 * a student device, in the presenter view, on the remote or the dashboard, and
 * step the room forward and back without a second machine. Drag it by its
 * handle when it covers something; where it sits is remembered.
 *
 * Deliberately in English and outside the design system: it is a tool, not part
 * of a talk, and it should never be mistaken for a slide.
 */
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDebug } from '~/composables/useDebug'
import { useDeckRole } from '~/composables/useDeckRole'
import { usePresentationStore } from '~/stores/presentationStore'
import { useSlideData } from '~/composables/useSlideData'

const debug = useDebug()
const { role, isProjector, viewMode } = useDeckRole()
const store = usePresentationStore()
const { flatSlides, getSlideById, getSlideByRoute, firstSlideId } = useSlideData()
const route = useRoute()
const router = useRouter()

/** Inside a lab pane, and on the lab page itself, the bar is only in the way. */
const framed = ref(false)
const hidden = computed(() => framed.value || route.path === '/lab')

onMounted(() => {
  debug.adopt()
  framed.value = window.self !== window.top
})

/** The slide this screen shows, else the room's. */
const here = computed(() => getSlideByRoute(route.path) || getSlideById(store.globalSlideId) || getSlideById(firstSlideId.value))
const index = computed(() => flatSlides.value.findIndex(slide => slide.id === here.value?.id))

const what = computed(() => {
  if (role.value !== 'viewer') return role.value
  if (isProjector.value) return 'projector'
  return viewMode.value === 'interactive' ? 'audience · interactive' : 'audience'
})

/* ─── Moving the room ────────────────────────────────────────────────── */
const busy = ref(false)

const goToRoom = async (step: number) => {
  const target = flatSlides.value[index.value + step]
  if (!target || busy.value) return
  busy.value = true
  try {
    await $fetch('/api/navigate', {
      method: 'POST',
      headers: { 'x-deck-controller': 'debug-bar' },
      body: { slideId: target.id },
    })
    // A screen that is not following still moves, so testing stays predictable.
    if (route.path.startsWith('/slides/')) router.push({ path: target.route, query: route.query })
  } finally {
    busy.value = false
  }
}

/* ─── Switching views ────────────────────────────────────────────────── */
const openSlide = (screen: 'projector' | 'audience') => {
  const target = here.value
  if (!target) return
  // A full load, so the screen really becomes what it claims to be.
  window.location.href = `${target.route}?mode=stage&screen=${screen}`
}
const openPage = (path: string) => { window.location.href = path }

/* ─── Dragging ───────────────────────────────────────────────────────── */
const dragging = ref(false)
let offset = { x: 0, y: 0 }

const startDrag = (event: PointerEvent) => {
  dragging.value = true
  offset = { x: event.clientX - debug.spot.value.x, y: event.clientY - debug.spot.value.y }
  ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
}
const onDrag = (event: PointerEvent) => {
  if (!dragging.value) return
  const x = Math.min(Math.max(0, event.clientX - offset.x), window.innerWidth - 80)
  const y = Math.min(Math.max(0, event.clientY - offset.y), window.innerHeight - 40)
  debug.moveTo({ x, y })
}
const endDrag = () => { dragging.value = false }
</script>

<template>
  <div
    v-if="debug.enabled.value && !hidden"
    class="debug"
    :class="{ 'is-dragging': dragging }"
    :style="{ left: `${debug.spot.value.x}px`, top: `${debug.spot.value.y}px` }"
  >
    <button
      type="button"
      class="grip"
      title="Drag me"
      @pointerdown="startDrag"
      @pointermove="onDrag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
    >⠿</button>

    <span class="what">{{ what }}</span>

    <span class="group">
      <button type="button" @click="goToRoom(-1)" :disabled="busy || index <= 0" title="Room: previous slide">◀</button>
      <span class="where">{{ here?.pageLabel ?? '–' }}</span>
      <button type="button" @click="goToRoom(1)" :disabled="busy || index < 0 || index >= flatSlides.length - 1" title="Room: next slide">▶</button>
    </span>

    <span class="group">
      <button type="button" :class="{ 'is-on': what === 'projector' }" @click="openSlide('projector')">projector</button>
      <button type="button" :class="{ 'is-on': what.startsWith('audience') }" @click="openSlide('audience')">device</button>
      <button type="button" :class="{ 'is-on': what === 'presenter' }" @click="openPage('/presenter')">presenter</button>
      <button type="button" :class="{ 'is-on': what === 'control' }" @click="openPage('/control')">remote</button>
      <button type="button" :class="{ 'is-on': what === 'dashboard' }" @click="openPage('/dashboard')">dashboard</button>
      <button type="button" @click="openPage('/join')">join</button>
      <button type="button" class="is-lab" title="Every view at once, side by side" @click="openPage('/lab')">lab</button>
    </span>

    <button type="button" class="off" title="Leave debug mode" @click="debug.set(false)">✕</button>
  </div>
</template>

<style scoped>
.debug {
  position: fixed;
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  border-radius: 0.6rem;
  background: rgba(17, 17, 27, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
  font-family: ui-monospace, 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #CDD6F4;
  user-select: none;
}
.debug.is-dragging {
  cursor: grabbing;
}

.grip {
  cursor: grab;
  padding: 0 0.15rem;
  font-size: 13px;
  color: #6C7086;
  touch-action: none;
}

.what {
  padding: 0.15rem 0.4rem;
  border-radius: 0.35rem;
  background: rgba(137, 180, 250, 0.18);
  color: #89B4FA;
  white-space: nowrap;
}

.group {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  padding-left: 0.4rem;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
}

.group button,
.off {
  padding: 0.2rem 0.4rem;
  border-radius: 0.35rem;
  font-family: inherit;
  font-size: 11px;
  color: #CDD6F4;
  transition: background 0.15s ease;
}
.group button:hover,
.off:hover {
  background: rgba(255, 255, 255, 0.12);
}
.group button:disabled {
  opacity: 0.35;
}
.group button.is-on {
  background: #89B4FA;
  color: #11111B;
}
.group button.is-lab {
  color: #89B4FA;
}

.where {
  min-width: 2.2rem;
  text-align: center;
  color: #A6ADC8;
}

.off {
  color: #F38BA8;
}
</style>
