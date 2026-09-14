<script setup lang="ts">
/**
 * The pointer of a click-through demo. Auto-imported as `<DemoPointer>`.
 * Glides to the positions `useDemoPlayer` gives it; `instant` places it without
 * gliding. Put it inside the frame the positions are measured against.
 */
defineProps<{
  x: number
  y: number
  visible: boolean
  clicking?: boolean
  instant?: boolean
}>()
</script>

<template>
  <svg
    class="pointer"
    :class="{ 'is-visible': visible, 'is-clicking': clicking, 'is-instant': instant }"
    :style="{ transform: `translate(${x}px, ${y}px)` }"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="M4 2 L4 19 L8.5 14.8 L11.6 21.5 L14.4 20.2 L11.3 13.6 L17.5 13.2 Z"
      fill="var(--text)"
      stroke="#FFFFFF"
      stroke-width="1.4"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped>
.pointer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 3.4vh;
  height: 3.4vh;
  margin: -0.4vh 0 0 -0.6vh;
  opacity: 0;
  pointer-events: none;
  transition: transform 0.7s cubic-bezier(0.45, 0, 0.2, 1), opacity 0.25s ease, scale 0.12s ease;
}
.pointer.is-visible {
  opacity: 1;
}
.pointer.is-clicking {
  scale: 0.85;
}
.pointer.is-instant {
  transition: none;
}
</style>
