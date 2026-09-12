<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCurrentSlide } from '~/composables/useCurrentSlide'

const { slide: currentSlide } = useCurrentSlide()
const fontSize = ref(2)
const showControls = ref(true)
const intervalId = ref<number | null>(null)

const notes = computed(() => currentSlide.value?.teleprompter)

const fontSizeClasses = [
  'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl'
]

function toggleControls() {
  showControls.value = !showControls.value
  if (!showControls.value) {
    const timer = setTimeout(() => {
      showControls.value = true
    }, 2000)
    intervalId.value = timer as unknown as number
  } else {
    if (intervalId.value) clearTimeout(intervalId.value)
  }
}

defineExpose({ fontSize })
</script>

<template>
  <div 
    class="fixed top-4 right-4 w-96 max-h-[80vh] bg-black/90 backdrop-blur-md rounded-xl border border-gray-700 shadow-2xl z-[9999] overflow-hidden flex flex-col cursor-pointer"
    @click="toggleControls"
    @mouseenter="showControls = true"
    role="complementary"
    aria-label="Presenter teleprompter notes"
  >
    <div class="bg-gray-900 p-3 border-b border-gray-700 flex justify-between items-center text-sm font-medium shrink-0" @click.stop>
      <span class="text-emerald-400 flex items-center gap-2">
        <Icon name="lucide:monitor-play" /> Teleprompter
      </span>
      <div class="flex items-center gap-2" @click.stop>
        <button 
          @click="fontSize = Math.max(0, fontSize - 1)"
          class="p-1 hover:text-white text-gray-500 transition-colors"
          :aria-label="'Decrease notes font size, current size: ' + fontSizeClasses[fontSize]"
          title="Decrease font size"
        >
          <Icon name="lucide:minus" class="w-4 h-4" />
        </button>
        <span class="text-gray-500 text-xs">Aa</span>
        <button 
          @click="fontSize = Math.min(fontSizeClasses.length - 1, fontSize + 1)"
          class="p-1 hover:text-white text-gray-500 transition-colors"
          :aria-label="'Increase notes font size, current size: ' + fontSizeClasses[fontSize]"
          title="Increase font size"
        >
          <Icon name="lucide:plus" class="w-4 h-4" />
        </button>
        <button 
          @click="showControls = false"
          class="p-1 hover:text-white text-gray-500 transition-colors"
          :aria-label="'Auto-hide controls'"
          title="Auto-hide controls"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>
    </div>
    <div 
      :class="fontSizeClasses[fontSize]"
      class="p-6 overflow-y-auto flex-grow leading-relaxed text-gray-200"
      role="note"
      aria-label="Speaker notes"
    >
      <div v-if="notes">{{ notes }}</div>
      <div v-else class="text-gray-600 italic flex items-center justify-center h-full">No notes for this slide</div>
    </div>
  </div>
</template>
