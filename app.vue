<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { usePresentation } from '~/composables/usePresentation'
import { useKeyBindings } from '~/composables/useKeyBindings'
import { useSlideData } from '~/composables/useSlideData'
import { useWebSocket } from '~/composables/useWebSocket'
import { useDeckRole } from '~/composables/useDeckRole'
import { useI18n } from '~/composables/useI18n'
import Teleprompter from '~/components/teleprompter/Teleprompter.vue'
import InteractionGuardModal from '~/components/interactive/InteractionGuardModal.vue'
import { useRoute, useRouter } from 'vue-router'
import type { LayoutKey } from '#build/types/layouts'

const { nextSlide, prevSlide, exitPresentation, toggleTeleprompter, syncToGlobal, store, interactions } = usePresentation()
const { getSlideByRoute, getSlideById } = useSlideData()
const { resolveKeys } = useKeyBindings()
const { isViewer, isPeek, isInteractive, adoptDeviceSettings } = useDeckRole()
const route = useRoute()
const router = useRouter()
const ws = useWebSocket()
// Language is per device, like the view mode: `l` switches this screen only.
const { toggleLocale } = useI18n()

const routeSlide = computed(() => getSlideByRoute(route.path))

/**
 * Layout for the current route. A page that sets `layout` in `definePageMeta`
 * keeps control; a device in interactive mode on an interactive slide gets the
 * interactive chrome; any other slide takes the layout from its config entry.
 */
const layoutName = computed<LayoutKey | false>(() => {
  const meta = route.meta.layout as LayoutKey | false | undefined
  if (meta !== undefined) return meta
  const slide = routeSlide.value
  if (!slide) return false
  if (isInteractive.value && slide.interactive) return 'slide-interactive'
  return slide.layout as LayoutKey
})

/** Per-slide page transition, named in `slides.config.ts`. */
const pageTransition = computed(() => {
  const name = routeSlide.value?.transition
  return name ? { name: `slide-${name}`, mode: 'out-in' as const } : undefined
})

const navDebounce = ref(0)
const debounced = () => {
  const now = Date.now()
  if (now - navDebounce.value < 100) return false
  navDebounce.value = now
  return true
}

function toggleFullscreen() {
  if (import.meta.client) {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  }
}

/** Esc leaves the deck only on a second press, so one stray key cannot end a talk. */
const escArmed = ref(false)
let escTimer: any = null

const handleEscape = () => {
  if (import.meta.client && document.fullscreenElement) {
    document.exitFullscreen()
    return
  }
  if (!escArmed.value) {
    escArmed.value = true
    clearTimeout(escTimer)
    escTimer = setTimeout(() => { escArmed.value = false }, 3000)
    return
  }
  escArmed.value = false
  exitPresentation()
}

const handleKeydown = (e: KeyboardEvent) => {
  if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return
  if (interactions.guard) return // The guard modal owns the keyboard while open.

  const key = e.key
  if (resolveKeys('nextSlide').includes(key)) {
    e.preventDefault()
    if (debounced() && routeSlide.value) nextSlide()
    return
  }

  if (resolveKeys('prevSlide').includes(key)) {
    e.preventDefault()
    if (debounced() && routeSlide.value) prevSlide()
    return
  }

  if (resolveKeys('exitPresentation').includes(key)) {
    e.preventDefault()
    handleEscape()
    return
  }

  if (resolveKeys('syncToGlobal').includes(key)) {
    e.preventDefault()
    if (store.detached) syncToGlobal()
    return
  }

  if (resolveKeys('toggleTeleprompter').includes(key) || key === 'T') {
    e.preventDefault()
    toggleTeleprompter()
    return
  }

  if (resolveKeys('toggleLanguage').includes(key)) {
    e.preventDefault()
    toggleLocale()
    return
  }

  if (resolveKeys('toggleFullscreen').includes(key)) {
    e.preventDefault()
    toggleFullscreen()
  }
}

/**
 * Opening a slide URL directly, or using browser history, moves the local
 * position of this device only. The room's position never changes from here.
 */
watch(routeSlide, (slide) => {
  if (slide && slide.id !== store.localSlideId) store.setLocal(slide.id)
})

const onSlideRoute = computed(() => !!routeSlide.value)

/**
 * Peek frames are the previews inside the presenter view. They never follow the
 * room and never reload: the presenter view posts the slide it wants to see, so
 * the preview app boots once for the whole talk.
 */
const handlePeekMessage = (event: MessageEvent) => {
  if (event.origin !== window.location.origin) return
  const data = event.data
  if (!data || data.type !== 'deck:peek') return
  const slide = getSlideById(data.slideId)
  if (!slide || slide.id === store.localSlideId) return
  store.setLocal(slide.id)
  // Replace the route so the slide actually re-renders, without a page load.
  router.replace({ path: slide.route, query: { mode: 'stage', peek: '1' } })
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  adoptDeviceSettings()
  interactions.load()
  if (ws && ws.connect) ws.connect()

  if (routeSlide.value) store.setLocal(routeSlide.value.id)

  if (isPeek.value) {
    store.setFollowing(false)
    window.addEventListener('message', handlePeekMessage)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('message', handlePeekMessage)
  clearTimeout(escTimer)
})
</script>

<template>
  <div class="min-h-screen bg-surface text-ink font-mono overflow-x-hidden selection:bg-sky/30">
    <NuxtLayout :name="layoutName">
      <NuxtPage :transition="pageTransition" />
    </NuxtLayout>

    <Teleprompter v-if="onSlideRoute && store.showTeleprompter" />

    <InteractionGuardModal v-if="isViewer" />

    <!-- The session ended. Say so, rather than dragging the device elsewhere. -->
    <div
      v-if="onSlideRoute && isViewer && store.sessionEnded"
      class="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9998] px-4 py-2 rounded-full bg-white/90 border border-gray-200 text-xs text-ink-dim shadow-lg"
      role="status"
    >
      The presenter ended the session. You can keep reading.
    </div>

    <div
      v-if="onSlideRoute && escArmed"
      class="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9998] px-4 py-2 rounded-full bg-white/90 border border-gray-200 text-xs text-ink-dim"
      role="status"
    >
      Press Esc again to leave the deck
    </div>

    <template v-if="onSlideRoute">
      <div
        v-for="(pointer, id) in store.pointers"
        :key="id"
        v-show="pointer.active"
        :aria-hidden="true"
        class="fixed w-5 h-5 rounded-full z-[9999] pointer-events-none transition-all duration-200 ease-out"
        :style="{
          left: `${pointer.x * 100}vw`,
          top: `${pointer.y * 100}vh`,
          transform: 'translate(-50%, -50%)',
          backgroundColor: pointer.color,
          boxShadow: `0 0 20px 4px ${pointer.color}80`
        }"
      ></div>
    </template>
  </div>
</template>

<style>
/* Default page transition. */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s ease-out;
}
.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* `transition: 'fade'` in slides.config.ts */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.35s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

/* `transition: 'slide'` in slides.config.ts */
.slide-slide-enter-active,
.slide-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-slide-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.slide-slide-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

/* `transition: 'zoom'` in slides.config.ts */
.slide-zoom-enter-active,
.slide-zoom-leave-active {
  transition: all 0.35s ease;
}
.slide-zoom-enter-from,
.slide-zoom-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

/* Respect a viewer who asked for less motion. */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
