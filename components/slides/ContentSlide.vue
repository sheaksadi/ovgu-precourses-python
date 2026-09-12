<script setup lang="ts">
defineProps<{
  title: string
  /** Pastel accent for the title underline: coral, mint, sky, sun, lavender */
  accent?: string
}>()
</script>

<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-8 md:mb-14 shrink-0 anim-fade-in-up">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        {{ title }}
      </h2>
      <div
        class="mt-3 h-1 w-16 rounded-full"
        :style="{ background: `var(--${accent || 'coral'})` }"
      ></div>
    </header>

    <div class="flex-grow overflow-auto text-base md:text-xl leading-relaxed content-area anim-fade-in-up anim-delay-2" style="color: var(--text-dim);">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.content-area :deep(ul) {
  list-style-type: none;
  padding-left: 0;
  margin-bottom: 1rem;
}
.content-area :deep(li) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
}
.content-area :deep(li)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: var(--coral);
}
</style>
