<script setup lang="ts">
defineProps<{
  title?: string
  /** Pastel accent for the title underline */
  accent?: string
}>()
</script>

<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header v-if="title" class="mb-8 md:mb-14 shrink-0 anim-fade-in-up">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        {{ title }}
      </h2>
      <div
        class="mt-3 h-1 w-16 rounded-full"
        :style="{ background: `var(--${accent || 'sky'})` }"
      ></div>
    </header>

    <div class="flex-grow flex flex-col md:flex-row gap-8 md:gap-16 overflow-y-auto md:overflow-hidden">
      <div class="w-full md:w-1/2 md:overflow-auto content-area md:pr-4 anim-slide-left anim-delay-2">
        <slot name="left" />
      </div>
      <div class="h-px w-full md:h-auto md:w-[3px] rounded-full shrink-0" style="background: var(--border);"></div>
      <div class="w-full md:w-1/2 md:overflow-auto content-area md:pl-4 anim-slide-right anim-delay-3">
        <slot name="right" />
      </div>
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
  background: var(--sky);
}
</style>
