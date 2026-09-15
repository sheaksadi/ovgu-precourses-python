<script setup lang="ts">
/**
 * The live notifications of this screen. Mounted once, in `app.vue`.
 *
 * Top-right, newest on top. On a slide view the sync pill owns the corner, so
 * the stack starts below it. Peek frames (the previews inside the presenter
 * view) show none, or every toast would appear twice on the presenter's screen.
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useToasts } from '~/composables/useToasts'
import { useDeckRole } from '~/composables/useDeckRole'
import { useSlideData } from '~/composables/useSlideData'

const { toasts, dismiss } = useToasts()
const { isViewer, isPeek } = useDeckRole()
const { getSlideByRoute } = useSlideData()
const route = useRoute()

const belowPill = computed(() => isViewer.value && !!getSlideByRoute(route.path))
</script>

<template>
  <div v-if="!isPeek" class="toast-stack" :class="{ 'is-below-pill': belowPill }" aria-live="polite">
    <TransitionGroup name="toast">
      <DeckToastCard
        v-for="toast in toasts"
        :key="toast.id"
        :title="toast.title"
        :body="toast.body"
        :tone="toast.tone"
        :name="toast.name"
        :icon="toast.icon"
        :duration="toast.duration"
        holding
        class="toast-live"
        @click="dismiss(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9990;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  pointer-events: none;
}
.toast-stack.is-below-pill {
  top: 3.6rem;
}
.toast-live {
  pointer-events: auto;
  cursor: pointer;
}

/* In from the right with the deck's settle; out as a quick fade; the rest glide up. */
.toast-enter-active {
  transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(1.5rem);
}
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
.toast-move {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
