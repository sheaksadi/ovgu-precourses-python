<script setup lang="ts">
/**
 * Printable handout.
 *
 * Every slide in presentation order with its speaker notes, one per page, for
 * "Print to PDF". It renders each slide route in a peek frame, so the handout
 * always matches what the room saw, and it never touches the room's position.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useSlideData } from '~/composables/useSlideData'

definePageMeta({ layout: false })

const { flatSlides, deckConfig, mainSlideCount } = useSlideData()

const BASE_WIDTH = 1280
const sheet = ref<HTMLElement | null>(null)
const scale = ref(0.6)
let observer: ResizeObserver | null = null

// Every frame sits in an equally wide box, so one measurement scales them all.
const measure = () => {
  const width = sheet.value?.querySelector('.slide-frame')?.clientWidth
  if (width) scale.value = width / BASE_WIDTH
}

onMounted(() => {
  measure()
  if (sheet.value && 'ResizeObserver' in window) {
    observer = new ResizeObserver(measure)
    observer.observe(sheet.value)
  }
  window.addEventListener('beforeprint', measure)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('beforeprint', measure)
})

const print = () => {
  if (import.meta.client) window.print()
}
</script>

<template>
  <div class="min-h-dvh bg-gray-950 text-gray-200 font-sans">
    <header class="print:hidden sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-gray-950 border-b border-gray-800">
      <div>
        <h1 class="text-lg font-bold text-white">{{ deckConfig.title }} · handout</h1>
        <p class="text-xs text-gray-500">
          {{ mainSlideCount }} main slide(s), {{ flatSlides.length }} screens with notes.
        </p>
      </div>
      <button
        @click="print"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white"
      >
        Print or save as PDF
      </button>
    </header>

    <main ref="sheet" class="max-w-4xl mx-auto px-6 py-8 print:px-0 print:py-0">
      <section
        v-for="slide in flatSlides"
        :key="slide.id"
        class="mb-10 print:mb-0 print:break-after-page"
      >
        <div class="flex items-baseline justify-between gap-4 mb-3">
          <h2 class="text-base font-bold text-white print:text-black">
            <span class="font-mono text-gray-500 mr-2">{{ slide.pageLabel }}</span>{{ slide.title }}
          </h2>
          <span class="font-mono text-[10px] text-gray-500">{{ slide.id }}</span>
        </div>

        <div class="slide-frame relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-gray-800 print:border-gray-400">
          <iframe
            :src="`${slide.route}?mode=stage&peek=1`"
            :title="slide.title"
            loading="lazy"
            class="absolute top-0 left-0 origin-top-left border-0 pointer-events-none"
            :style="{ width: `${BASE_WIDTH}px`, height: `${BASE_WIDTH * 9 / 16}px`, transform: `scale(${scale})` }"
          ></iframe>
        </div>

        <p v-if="slide.teleprompter" class="mt-3 text-sm leading-relaxed text-gray-300 print:text-black">
          {{ slide.teleprompter }}
        </p>
      </section>
    </main>
  </div>
</template>

<style>
@media print {
  /* White paper, and one slide per sheet with its notes underneath. */
  body {
    background: #fff;
    color: #000;
  }
}
</style>
