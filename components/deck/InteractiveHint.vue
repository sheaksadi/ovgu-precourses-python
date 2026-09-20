<script setup lang="ts">
/**
 * Small "join in" pill for follow-along devices. Auto-imported as
 * `<DeckInteractiveHint>`.
 *
 * A device that scanned the title slide follows the talk read-only. When the
 * slide it shows has an interactive part, this offers it instead of switching
 * the device on its own; tapping it turns on interactive mode for this device.
 * Only touch screens show it, so the projector stays clean.
 *
 * It docks in the strip `components/deck/ReplayDock.vue` puts under the slide,
 * in the middle, where the replay button sits on the slides that offer one.
 */
import { computed } from 'vue'
import { useRoute, useRouter } from '#app'
import { useCurrentSlide } from '~/composables/useCurrentSlide'
import { useDeckRole } from '~/composables/useDeckRole'
import { useI18n } from '~/composables/useI18n'

const { slide } = useCurrentSlide()
const { isViewer, isPeek, isProjector, isInteractive, setViewMode } = useDeckRole()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const show = computed(() => isViewer.value && !isPeek.value && !isProjector.value && !isInteractive.value && !!slide.value?.interactive)

const joinIn = () => {
  setViewMode('interactive')
  router.replace({ path: route.path, query: { ...route.query, mode: 'interactive' } })
}
</script>

<template>
  <button v-if="show" type="button" class="interactive-hint" @click="joinIn">
    <span class="hint-dot" aria-hidden="true"></span>
    <span>{{ t('follow.interactive') }}</span>
    <span class="hint-action">{{ t('follow.joinIn') }} →</span>
  </button>
</template>

<style scoped>
/* In the middle of the device's strip, where the replay button sits on the
   slides that have one. An interactive slide has no replay, so they never meet. */
.interactive-hint {
  position: fixed;
  left: 50%;
  bottom: 0.75rem;
  translate: -50% 0;
  z-index: 71;
  display: none;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.5rem 0.5rem 0.9rem;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--text);
  font-family: var(--font-text);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  animation: pop-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@media (pointer: coarse) {
  .interactive-hint {
    display: flex;
  }
}

.hint-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--mint);
}

.hint-action {
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: var(--mint);
  color: #FFFFFF;
  font-weight: 800;
}
</style>
