<script setup lang="ts">
/**
 * Small "join in" pill for follow-along devices. Auto-imported as
 * `<DeckInteractiveHint>`.
 *
 * A device that scanned the title slide follows the talk read-only. When the
 * slide it shows has an interactive part, this offers it instead of switching
 * the device on its own; tapping it turns on interactive mode for this device.
 * Only touch screens show it, so the projector stays clean.
 */
import { computed } from 'vue'
import { useRoute, useRouter } from '#app'
import { useCurrentSlide } from '~/composables/useCurrentSlide'
import { useDeckRole } from '~/composables/useDeckRole'
import { useI18n } from '~/composables/useI18n'

const { slide } = useCurrentSlide()
const { isViewer, isPeek, isInteractive, setViewMode } = useDeckRole()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const show = computed(() => isViewer.value && !isPeek.value && !isInteractive.value && !!slide.value?.interactive)

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
.interactive-hint {
  position: absolute;
  left: 50%;
  bottom: 1rem;
  translate: -50% 0;
  z-index: 60;
  display: none;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.5rem 0.5rem 0.9rem;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--text);
  font-family: 'JetBrains Mono', monospace;
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
