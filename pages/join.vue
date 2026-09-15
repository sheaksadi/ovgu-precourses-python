<script setup lang="ts">
/**
 * Follow-along landing page. The QR code on the title slide opens it.
 *
 * Read-only on purpose: the device picks a language, switches to stage mode
 * (following the presenter) and opens the room's slide. Nothing here writes to
 * the room. A slide with an interactive part offers it on its own, through the
 * small pill in the slide layouts.
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePresentation } from '~/composables/usePresentation'
import { useSlideData } from '~/composables/useSlideData'
import { useDeckRole } from '~/composables/useDeckRole'
import { useI18n, type Locale } from '~/composables/useI18n'

definePageMeta({ layout: false })

const router = useRouter()
const { store } = usePresentation()
const { getSlideById, firstSlideId } = useSlideData()
const { setViewMode } = useDeckRole()
const { t, locale, setLocale } = useI18n()

const target = computed(() => getSlideById(store.globalSlideId) || getSlideById(firstSlideId.value))

const languages: Array<{ code: Locale, name: string }> = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
]

const open = (code: Locale) => {
  setLocale(code)
  setViewMode('stage')
  store.setFollowing(true)
  if (target.value) router.push({ path: target.value.route, query: { mode: 'stage' } })
}
</script>

<template>
  <main class="follow">
    <div class="follow-card">
      <div class="follow-momo" aria-hidden="true">
        <ArtSprite name="cat-peek" color="coral" accent="sun" :size="96" class="w-full h-full" />
      </div>

      <p class="follow-eyebrow">{{ t('follow.eyebrow') }}</p>
      <h1 class="follow-title">{{ t('follow.title') }}</h1>
      <p class="follow-body">{{ t('follow.body') }}</p>

      <p class="follow-label">{{ t('follow.pick') }}</p>
      <div class="follow-languages">
        <button
          v-for="language in languages"
          :key="language.code"
          type="button"
          class="follow-language"
          :class="{ 'is-current': language.code === locale }"
          :disabled="!target"
          @click="open(language.code)"
        >
          <span>{{ language.name }}</span>
          <span class="follow-code">{{ language.code.toUpperCase() }} →</span>
        </button>
      </div>

      <p class="follow-foot">
        {{ target ? t('follow.startsAt', { label: target.pageLabel, title: target.title }) : t('follow.waiting') }}
      </p>
    </div>
  </main>
</template>

<style scoped>
.follow {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 5rem 1.25rem 2rem;
  background: var(--bg);
  font-family: var(--font-text);
}

.follow-card {
  position: relative;
  width: 100%;
  max-width: 24rem;
  padding: 1.75rem 1.5rem 1.5rem;
  border-radius: 1.5rem;
  background: var(--bg-off);
  border: 2px solid var(--border);
}

.follow-momo {
  position: absolute;
  top: -4.4rem;
  right: 1.25rem;
  width: 5.5rem;
  height: 5.5rem;
}

.follow-eyebrow {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.follow-title {
  margin-top: 0.4rem;
  font-size: 2.2rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--text);
}

.follow-body {
  margin-top: 0.9rem;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--text-dim);
}

.follow-label {
  margin-top: 1.5rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.follow-languages {
  margin-top: 0.6rem;
  display: grid;
  gap: 0.6rem;
}

.follow-language {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.1rem;
  border-radius: 1rem;
  background: var(--bg);
  border: 2px solid var(--border);
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.follow-language.is-current {
  border-color: var(--text);
}

.follow-language:active {
  background: var(--sun);
}

.follow-language:disabled {
  opacity: 0.5;
}

.follow-code {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.follow-foot {
  margin-top: 1rem;
  font-size: 0.7rem;
  color: var(--text-muted);
  text-align: center;
}
</style>
