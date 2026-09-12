<script setup lang="ts">
/**
 * Chrome for a device in interactive mode.
 *
 * It keeps the default page number and progress bar, adds the interaction step
 * indicator, and adds touch-sized local navigation: those buttons move this
 * device only, never the room.
 */
import { computed } from 'vue'
import { useSlideData } from '~/composables/useSlideData'
import { useCurrentSlide } from '~/composables/useCurrentSlide'
import { usePresentation } from '~/composables/usePresentation'
import SyncPill from '~/components/slides/SyncPill.vue'

const { deckConfig, mainSlideCount } = useSlideData()
const { slide: currentSlide, progress } = useCurrentSlide()
const { interactions, nextSlide, prevSlide, currentIndex, flatSlides } = usePresentation()

const slideBg = computed(() => currentSlide.value?.backgroundColor || 'bg-gray-900')

const interaction = computed(() => {
  const id = currentSlide.value?.id
  return id ? interactions.progress[id] : undefined
})

const atStart = computed(() => currentIndex.value <= 0)
const atEnd = computed(() => currentIndex.value >= flatSlides.value.length - 1)
</script>

<template>
  <div :class="slideBg" class="relative w-screen h-screen overflow-hidden text-white flex flex-col">
    <main class="flex-grow relative w-full h-full pt-8 pb-20">
      <slot />
    </main>

    <div class="absolute top-5 left-6 flex items-center gap-3 z-50 pointer-events-none">
      <span v-if="deckConfig.title" class="text-xs font-medium tracking-wide text-gray-500">
        {{ deckConfig.title }}
      </span>
      <span v-if="deckConfig.showSlideId && currentSlide" class="text-[10px] font-mono tracking-widest text-gray-600">
        {{ currentSlide.id }}
      </span>
    </div>

    <SyncPill />

    <div v-if="deckConfig.showProgressBar" class="absolute bottom-16 left-0 h-1 bg-gray-700 w-full z-40">
      <div
        class="h-full bg-blue-500 transition-all duration-300 ease-out"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>

    <!-- Local navigation. These buttons never move the room. -->
    <div class="absolute bottom-0 left-0 w-full z-50 bg-black/60 backdrop-blur-sm border-t border-white/10 px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div class="flex items-center gap-3">
        <button
          @click="prevSlide()"
          :disabled="atStart"
          class="flex-none w-14 h-11 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center disabled:opacity-40 active:bg-gray-700 transition-colors"
          aria-label="Previous slide on this device"
        >
          <Icon name="lucide:arrow-left" class="text-xl" />
        </button>

        <div class="flex-1 min-w-0 text-center">
          <div class="text-xs font-medium text-gray-300 truncate">{{ currentSlide?.title }}</div>
          <div class="text-[11px] font-mono text-gray-500">
            <span v-if="deckConfig.showPageNumber && currentSlide">{{ currentSlide.pageLabel }} / {{ mainSlideCount }}</span>
            <span v-if="interaction && interaction.total > 1" class="text-amber-400">
              · step {{ interaction.step }} / {{ interaction.total }}
            </span>
            <span v-else-if="interaction?.completed" class="text-emerald-400">· done</span>
          </div>
        </div>

        <button
          @click="nextSlide()"
          :disabled="atEnd"
          class="flex-none w-14 h-11 rounded-xl bg-blue-600 border border-blue-500 flex items-center justify-center disabled:opacity-40 active:bg-blue-500 transition-colors"
          aria-label="Next slide on this device"
        >
          <Icon name="lucide:arrow-right" class="text-xl" />
        </button>
      </div>
    </div>
  </div>
</template>
