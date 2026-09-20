<script setup lang="ts">
/**
 * Chrome-free slide layout — white, minimal.
 */
import { computed } from 'vue'
import { useCurrentSlide } from '~/composables/useCurrentSlide'
import { useDemos } from '~/composables/useDemos'
import SyncPill from '~/components/slides/SyncPill.vue'

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
    class="relative w-screen deck-stage overflow-hidden text-ink font-sans flex flex-col"
    :style="{ backgroundColor: slideBg ? undefined : 'var(--bg)' }"
  >
    <main :key="sceneKey" :data-scene="sceneKey" class="flex-grow relative w-full h-full">
      <slot />
    </main>

    <SyncPill />
    <DeckLanguagePill />
    <DeckInteractiveHint />
  </div>
</template>
