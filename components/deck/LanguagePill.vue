<script setup lang="ts">
/**
 * Language switch for follow-along devices. Auto-imported as `<DeckLanguagePill>`.
 *
 * Only touch screens show it, so the projector never displays a control; a
 * screen with a keyboard switches with the `l` key. Controllers and peek frames
 * never show it.
 */
import { useDeckRole } from '~/composables/useDeckRole'
import { useI18n } from '~/composables/useI18n'

const { isViewer, isPeek } = useDeckRole()
const { locale, locales, setLocale, t } = useI18n()
</script>

<template>
  <div v-if="isViewer && !isPeek" class="lang-pill" role="group" :aria-label="t('common.switchLanguage')">
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
.lang-pill {
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  z-index: 60;
  display: none;
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
  font-family: 'JetBrains Mono', monospace;
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
