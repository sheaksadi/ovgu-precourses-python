<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  bgImage?: string
  /** Pastel accent color: coral, mint, sky, sun, lavender, peach, sage */
  accent?: string
}>()
</script>

<template>
  <div
    class="w-full h-full flex flex-col items-center justify-center relative p-8 md:p-16 text-center"
    :class="{ 'bg-cover bg-center': !!bgImage }"
    :style="bgImage ? { backgroundImage: `url(${bgImage})` } : {}"
  >
    <div v-if="bgImage" class="absolute inset-0 bg-white/80 z-0"></div>

    <div class="z-10 relative max-w-3xl flex flex-col items-center gap-4">
      <!-- Optional accent pill above title -->
      <div
        v-if="accent"
        class="w-16 h-2 rounded-full mb-4 anim-fade-in"
        :style="{ background: `var(--${accent})` }"
      ></div>

      <h1 class="text-5xl md:text-9xl font-black tracking-tight leading-none anim-fade-in-up" style="color: var(--text);">
        {{ title }}
      </h1>

      <p v-if="subtitle" class="text-lg md:text-2xl font-medium mt-2 anim-fade-in-up anim-delay-2" style="color: var(--text-dim);">
        {{ subtitle }}
      </p>

      <div class="mt-8 anim-fade-in-up anim-delay-3">
        <slot />
      </div>
    </div>
  </div>
</template>
