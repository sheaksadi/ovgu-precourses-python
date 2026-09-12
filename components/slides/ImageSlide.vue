<script setup lang="ts">
withDefaults(defineProps<{
  imageSrc: string
  title?: string
  alt?: string
  layout?: 'full' | 'split-left' | 'split-right'
}>(), {
  layout: 'full'
})
</script>

<template>
  <!-- Full Bleed -->
  <div v-if="layout === 'full'" class="w-full h-full relative">
    <img :src="imageSrc" :alt="alt || title || 'Slide Image'" class="w-full h-full object-cover" />
    <div v-if="title" class="absolute bottom-0 left-0 w-full p-12 bg-gradient-to-t from-black to-transparent">
      <h2 class="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">{{ title }}</h2>
    </div>
  </div>
  
  <!-- Split Layouts -->
  <div v-else class="w-full h-full flex" :class="{ 'flex-row-reverse': layout === 'split-right' }">
    <div class="w-1/2 h-full">
      <img :src="imageSrc" :alt="alt || title || 'Slide Image'" class="w-full h-full object-cover" />
    </div>
    <div class="w-1/2 h-full p-16 md:p-24 flex flex-col justify-center">
      <h2 v-if="title" class="text-4xl md:text-5xl font-bold text-blue-400 mb-8">{{ title }}</h2>
      <div class="text-xl md:text-2xl text-gray-200 leading-relaxed">
        <slot />
      </div>
    </div>
  </div>
</template>
