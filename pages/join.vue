<script setup lang="ts">
/**
 * Follow-along landing page. The QR code on the title slide opens it.
 *
 * Read-only on purpose: the device picks a name and a language, switches to
 * stage mode (following the presenter) and opens the room's slide. Nothing here
 * writes to the room; the name travels in the WebSocket hello
 * (`composables/useAudience.ts`). The name is optional: without one, the device
 * keeps a generated cute name, shown here with a die to roll another. A slide with an interactive part offers it on its own, through the
 * small pill in the slide layouts.
 */
import { computed, ref } from 'vue'
import { useState } from '#app'
import { useRouter } from 'vue-router'
import { usePresentation } from '~/composables/usePresentation'
import { useSlideData } from '~/composables/useSlideData'
import { useDeckRole } from '~/composables/useDeckRole'
import { useI18n, type Locale } from '~/composables/useI18n'
import { useAudience } from '~/composables/useAudience'
import { NAME_MAX, cleanName, formatCuteName, parseCuteName, rollCuteName, type CuteNameParts } from '~/utils/cuteNames'

definePageMeta({ layout: false })

const router = useRouter()
const { store } = usePresentation()
const { getSlideById, firstSlideId } = useSlideData()
const { setViewMode } = useDeckRole()
const { t, locale, setLocale } = useI18n()
const { name, custom, setName } = useAudience()

/** The field: prefilled only with a name the person typed before. */
const draft = ref(custom.value ? name.value : '')
const typed = computed(() => cleanName(draft.value))

/** The generated name this device has without a typed one. Shared with hydration, so it stays put. */
const anonymous = useState<CuteNameParts>('join-anonymous', () => (!custom.value && parseCuteName(name.value)) || rollCuteName())
const anonymousName = computed(() => formatCuteName(anonymous.value, locale.value))

const reroll = () => {
  const before = anonymousName.value
  while (anonymousName.value === before) anonymous.value = rollCuteName()
}

const target = computed(() => getSlideById(store.globalSlideId) || getSlideById(firstSlideId.value))

const languages: Array<{ code: Locale, name: string }> = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
]

const open = (code: Locale) => {
  setLocale(code)
  if (typed.value) setName(typed.value)
  else setName(formatCuteName(anonymous.value, code), false)
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

      <label class="follow-label" for="follow-name">{{ t('follow.nameLabel') }}</label>
      <input
        id="follow-name"
        v-model="draft"
        class="follow-input"
        type="text"
        :maxlength="NAME_MAX"
        autocomplete="nickname"
        autocapitalize="words"
        enterkeyhint="done"
        :placeholder="t('follow.namePlaceholder')"
      >
      <p class="follow-as">
        <template v-if="typed">{{ t('follow.nameShown', { name: typed }) }}</template>
        <template v-else>
          <span>{{ t('follow.anonymous') }}</span>
          <button type="button" class="follow-anon" :aria-label="t('follow.reroll')" @click="reroll">
            <span class="text-trim">{{ anonymousName }}</span>
            <Icon name="lucide:dices" class="follow-dice" />
          </button>
        </template>
      </p>

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
  display: block;
  margin-top: 1.5rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.follow-input {
  margin-top: 0.6rem;
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  background: var(--bg);
  border: 2px solid var(--border);
  font: inherit;
  /* 1rem or more, or iOS zooms into the field. */
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s ease;
}

.follow-input:focus {
  border-color: var(--text);
}

.follow-input::placeholder {
  font-weight: 600;
  color: var(--text-muted);
}

.follow-as {
  margin-top: 0.55rem;
  min-height: 1.9rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--text-dim);
}

.follow-anon {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.45rem 0.35rem 0.7rem;
  border-radius: 999px;
  background: var(--sun);
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--text);
}

.follow-dice {
  font-size: 1rem;
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
