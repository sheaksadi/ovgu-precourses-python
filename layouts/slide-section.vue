<script setup lang="ts">
/**
 * Section-break layout — bold pastel accent bar at top.
 */
import { computed } from 'vue'
import { useSlideData } from '~/composables/useSlideData'
import { useCurrentSlide } from '~/composables/useCurrentSlide'
import { useDemos } from '~/composables/useDemos'
import SyncPill from '~/components/slides/SyncPill.vue'

const { deckConfig, mainSlideCount } = useSlideData()
const { slide: currentSlide } = useCurrentSlide()

const demos = useDemos()
/**
 * A replay remounts the scene, so animations that only run once start again.
 * Never on a slide somebody is working in: a puzzle answer or half-written
 * function would go with it. It is also on the element as `data-scene`, which is
 * how `scripts/` can see that a replay reached this screen.
 */
const sceneKey = computed(() => (currentSlide.value?.problem || currentSlide.value?.interactive
  ? 'held'
  : `replay-${demos.nonce.value}`))

const slideBg = computed(() => currentSlide.value?.backgroundColor || '')
</script>

<template>
  <div
    :class="slideBg"
    class="relative w-screen h-screen overflow-hidden text-ink font-sans flex flex-col"
    :style="{ backgroundColor: slideBg ? undefined : 'var(--bg)' }"
  >
    <!-- Bold pastel accent bar -->
    <div class="absolute top-0 left-0 h-2 w-full z-50" style="background: var(--coral);"></div>

    <main :key="sceneKey" :data-scene="sceneKey" class="flex-grow relative w-full h-full">
      <slot />
    </main>

    <div v-if="deckConfig.showPageNumber && currentSlide" class="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm font-bold tracking-[0.3em] z-50 pointer-events-none" style="color: var(--text-muted);">
      {{ currentSlide.pageLabel }}/{{ mainSlideCount }}
    </div>

    <SyncPill />
  </div>
</template>
