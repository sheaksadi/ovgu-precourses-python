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
  if (!loaded.value || !props.slideId) return
  frame.value?.contentWindow?.postMessage(
    { type: 'deck:peek', slideId: props.slideId },
    window.location.origin
  )
}

const onLoad = () => {
  loaded.value = true
  post()
}

// The first slide we are asked for decides the iframe's one and only src.
watch(() => props.route, (route) => {
  if (route && !initialSrc.value) initialSrc.value = `${route}?mode=stage&peek=1`
}, { immediate: true })

watch(() => props.slideId, () => post())

// With no slide to show, fall back to the placeholder rather than leaving the
// last slide on screen: at the end of the deck there is no next slide.
const showFrame = computed(() => !!initialSrc.value && !!props.slideId)

onMounted(() => {
  measure()
  if (box.value && 'ResizeObserver' in window) {
    observer = new ResizeObserver(measure)
    observer.observe(box.value)
  }
})

onBeforeUnmount(() => observer?.disconnect())
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
