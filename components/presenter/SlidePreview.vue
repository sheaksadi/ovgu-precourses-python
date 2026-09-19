<script setup lang="ts">
/**
 * Live thumbnail of a slide.
 *
 * The iframe boots once for the whole talk: it loads a slide route as a peek
 * frame, and every later change is a `postMessage`, so advancing a slide no
 * longer reloads a second copy of the app. A peek frame pins its own position,
 * never follows the room, and is left out of the audience counts.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  /** Slide id to show. */
  slideId?: string
  /** Route of that slide, used for the first load only. */
  route?: string
  label?: string
  placeholder?: string
}>(), {
  placeholder: 'Nothing to show'
})

const BASE_WIDTH = 1280
const BASE_HEIGHT = 720

const box = ref<HTMLElement | null>(null)
const frame = ref<HTMLIFrameElement | null>(null)
const scale = ref(0.25)
const loaded = ref(false)
const initialSrc = ref('')
let observer: ResizeObserver | null = null

const measure = () => {
  if (box.value) scale.value = box.value.clientWidth / BASE_WIDTH
}

const post = () => {
  if (!props.slideId) return
  frame.value?.contentWindow?.postMessage(
    { type: 'deck:peek', slideId: props.slideId },
    window.location.origin
  )
}

/**
 * Keep asking until the frame is actually on the slide.
 *
 * The frame boots on whichever slide the presenter view knew first, which is
 * slide 1 while the room state is still on its way. The message that corrects
 * it can arrive before the app inside the frame is listening — the load event
 * can even fire before this component hydrates — and then the preview sits on
 * the wrong slide for the rest of the talk. So: post, check, post again.
 */
let syncTimer: ReturnType<typeof setInterval> | null = null

const onSlide = () => {
  if (!props.route) return false
  try {
    return frame.value?.contentWindow?.location.pathname === props.route
  } catch {
    // Not readable yet; assume not there, the retries are cheap.
    return false
  }
}

const sync = () => {
  if (syncTimer) clearInterval(syncTimer)
  post()
  let tries = 0
  syncTimer = setInterval(() => {
    tries++
    if (onSlide() || tries > 12) {
      clearInterval(syncTimer!)
      syncTimer = null
      return
    }
    post()
  }, 400)
}

const onLoad = () => {
  loaded.value = true
  sync()
}

// The first slide we are asked for decides the iframe's one and only src.
watch(() => props.route, (route) => {
  if (route && !initialSrc.value) initialSrc.value = `${route}?mode=stage&peek=1`
}, { immediate: true })

watch(() => props.slideId, () => sync())

// With no slide to show, fall back to the placeholder rather than leaving the
// last slide on screen: at the end of the deck there is no next slide.
const showFrame = computed(() => !!initialSrc.value && !!props.slideId)

onMounted(() => {
  measure()
  // The frame can finish loading before this component hydrates, in which case
  // its load event is long gone and the first postMessage would be dropped.
  // Anything already complete counts as loaded, and gets told what to show.
  const ready = frame.value?.contentDocument?.readyState
  if (ready === 'complete' || ready === 'interactive') loaded.value = true
  sync()
  if (box.value && 'ResizeObserver' in window) {
    observer = new ResizeObserver(measure)
    observer.observe(box.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  if (syncTimer) clearInterval(syncTimer)
})
</script>

<template>
  <div ref="box" class="relative w-full aspect-video bg-black rounded-xl border border-gray-800 overflow-hidden">
    <iframe
      v-if="showFrame"
      ref="frame"
      :src="initialSrc"
      :title="label || 'Slide preview'"
      class="absolute top-0 left-0 origin-top-left border-0 pointer-events-none"
      :style="{ width: `${BASE_WIDTH}px`, height: `${BASE_HEIGHT}px`, transform: `scale(${scale})` }"
      @load="onLoad"
    ></iframe>
    <div v-else class="absolute inset-0 flex items-center justify-center text-xs text-gray-600 px-4 text-center">
      {{ placeholder }}
    </div>
  </div>
</template>
