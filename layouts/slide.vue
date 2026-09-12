<script setup lang="ts">
/**
 * Default slide layout — minimal white, JetBrains Mono, pastel accents.
 */
import { computed } from 'vue'
import { useSlideData } from '~/composables/useSlideData'
import { useCurrentSlide } from '~/composables/useCurrentSlide'
import SyncPill from '~/components/slides/SyncPill.vue'

const { deckConfig, mainSlideCount } = useSlideData()
const { slide: currentSlide, progress } = useCurrentSlide()

const slideBg = computed(() => currentSlide.value?.backgroundColor || '')
</script>

<template>
  <div
    :class="slideBg"
    class="relative w-screen h-screen overflow-hidden text-ink font-mono flex flex-col"
    :style="{ backgroundColor: slideBg ? undefined : 'var(--bg)' }"
  >
    <main class="flex-grow relative w-full h-full">
      <slot />
    </main>

    <!-- Top-left: deck title -->
    <div class="absolute top-5 left-6 flex items-center gap-3 z-50 pointer-events-none">
      <span v-if="deckConfig.title" class="text-[11px] font-bold tracking-widest uppercase" style="color: var(--text-muted);">
        {{ deckConfig.title }}
      </span>
    </div>

    <SyncPill />
    <DeckLanguagePill />
    <DeckInteractiveHint />

    <!-- Progress bar: bold coral -->
    <div v-if="deckConfig.showProgressBar" class="absolute bottom-0 left-0 h-[3px] w-full z-50" style="background: var(--border);">
      <div
        class="h-full transition-all duration-500 ease-out"
        :style="{ width: `${progress}%`, background: 'var(--coral)' }"
      ></div>
    </div>

    <!-- Page number -->
    <div v-if="deckConfig.showPageNumber && currentSlide" class="absolute bottom-5 right-6 text-[11px] font-bold z-50 pointer-events-none" style="color: var(--text-muted);">
      {{ currentSlide.pageLabel }}/{{ mainSlideCount }}
    </div>

    <!-- Author -->
    <div v-if="deckConfig.author" class="absolute bottom-5 left-6 text-[11px] z-50 pointer-events-none" style="color: var(--text-muted);">
      {{ deckConfig.author }}
    </div>
  </div>
</template>
