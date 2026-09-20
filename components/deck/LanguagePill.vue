<script setup lang="ts">
/**
 * Language switch for follow-along devices. Auto-imported as `<DeckLanguagePill>`.
 *
 * Only touch screens show it, so the projector never displays a control; a
 * screen with a keyboard switches with the `l` key. Controllers and peek frames
 * never show it, and neither does the projector: its language comes from the
 * link the start page opens.
 *
 * It sits at the left end of the strip `components/deck/ReplayDock.vue` puts
 * under the slide, which is why it is fixed rather than placed in a corner of
 * the scene: a device's controls all live in the same row, and none of them
 * covers the slide.
 */
import { useDeckRole } from '~/composables/useDeckRole'
import { useI18n } from '~/composables/useI18n'

const { isViewer, isPeek, isProjector } = useDeckRole()
const { locale, locales, setLocale, t } = useI18n()
</script>

<template>
  <div v-if="isViewer && !isPeek && !isProjector" class="lang-pill" role="group" :aria-label="t('common.switchLanguage')">
    <button
      v-for="code in locales"
      :key="code"
      type="button"
      class="lang-option"
      :class="{ 'is-active': code === locale }"
      :aria-pressed="code === locale"
      @click="setLocale(code)"
    >
      <span class="text-trim">{{ code.toUpperCase() }}</span>
    </button>
  </div>
</template>

<style scoped>
/* Docked at the left end of the device's strip, never over the slide. */
.lang-pill {
  position: fixed;
  left: 0.75rem;
  bottom: 0;
  height: 3.5rem;
  z-index: 71;
  display: none;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border-radius: 999px;
  background: var(--bg-off);
  border: 2px solid var(--border);
}

@media (pointer: coarse) {
  .lang-pill {
    display: flex;
  }
}

.lang-option {
  min-width: 2.6rem;
  padding: calc(0.4rem + 0.14em) 0.6rem;
  border-radius: 999px;
  font-family: var(--font-text);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1;
  color: var(--text-muted);
  transition: background 0.2s ease, color 0.2s ease;
}

.lang-option.is-active {
  background: var(--text);
  color: var(--bg);
}
</style>
