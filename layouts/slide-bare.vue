<script setup lang="ts">
/**
 * Chrome-free slide layout — white, minimal.
 */
import { computed } from 'vue'
import { useCurrentSlide } from '~/composables/useCurrentSlide'
import SyncPill from '~/components/slides/SyncPill.vue'

const { slide: currentSlide } = useCurrentSlide()

const slideBg = computed(() => currentSlide.value?.backgroundColor || '')
</script>

<template>
  <div
    :class="slideBg"
    class="relative w-screen h-screen overflow-hidden text-ink font-sans flex flex-col"
    :style="{ backgroundColor: slideBg ? undefined : 'var(--bg)' }"
  >
    <main class="flex-grow relative w-full h-full">
      <slot />
    </main>

    <SyncPill />
    <DeckLanguagePill />
    <DeckInteractiveHint />
  </div>
</template>
