<script setup lang="ts">
/**
 * Start page: one button per view of the deck.
 *
 *   Projector      the slides, big, following the room (stage mode)
 *   Presenter      live and next slide, notes, pacing, audience
 *   Control panel  the dashboard: remote QR code, slide list, room state
 *   Follow along   the read-only view for phones, in German or English
 *
 * Text lives in `home.*` in `locales/`.
 */
import { computed } from 'vue'
import { usePresentationStore } from '~/stores/presentationStore'
import { useSlideData } from '~/composables/useSlideData'
import { useI18n } from '~/composables/useI18n'
import { useFont } from '~/composables/useFont'
import { slideIdToRoute } from '~/utils/slideId'

definePageMeta({ layout: false })

const store = usePresentationStore()
const { getSlideById, firstSlideId } = useSlideData()
const { t, locale, locales, setLocale } = useI18n()
const { font, fonts, setFont } = useFont()

/** The room's slide while a talk runs, otherwise the first slide, with current language. */
const projectorTarget = computed(() => {
  const slide = getSlideById(store.globalSlideId) || getSlideById(firstSlideId.value)
  return slide ? { path: slide.route, query: { mode: 'stage', lang: locale.value, screen: 'projector' } } : '/'
})

const views = computed(() => [
  { key: 'projector', to: projectorTarget.value, icon: 'lucide:projector', color: 'coral' },
  { key: 'presenter', to: '/presenter', icon: 'lucide:presentation', color: 'sky' },
  { key: 'control', to: '/dashboard', icon: 'lucide:layout-dashboard', color: 'lavender' },
  { key: 'remote', to: '/control', icon: 'lucide:smartphone', color: 'purple' },
  { key: 'follow', to: '/join', icon: 'lucide:users', color: 'mint' },
])

const styleGuide = slideIdToRoute('PRE-0010')
</script>

<template>
  <main class="home">
    <div class="home-inner">
      <header class="home-head">
        <div class="home-dashes" aria-hidden="true">
          <span style="background: var(--coral);"></span>
          <span style="background: var(--sun);"></span>
          <span style="background: var(--mint);"></span>
          <span style="background: var(--sky);"></span>
          <span style="background: var(--lavender);"></span>
        </div>
        <p class="home-eyebrow">{{ t('title.university') }} <span class="home-slash">/</span> {{ t('title.semester') }}</p>
        <h1 class="home-title">{{ t('title.line1') }} {{ t('title.line2') }}</h1>
        <p class="home-lede">{{ t('home.lede') }}</p>
      </header>

      <div class="home-grid">
        <div class="home-momo" aria-hidden="true">
          <span class="home-bubble"><span class="text-trim">{{ t('home.momo') }}</span></span>
          <ArtSprite name="cat-peek" color="coral" accent="sun" :size="96" class="w-full h-full" />
        </div>

        <NuxtLink v-for="view in views" :key="view.key" :to="view.to" class="home-card">
          <span class="home-icon" :style="{ background: `var(--${view.color})` }">
            <Icon :name="view.icon" />
          </span>
          <span class="home-card-text">
            <span class="home-card-title">{{ t(`home.views.${view.key}.title`) }}</span>
            <span class="home-card-desc">{{ t(`home.views.${view.key}.desc`) }}</span>
          </span>
          <Icon name="lucide:arrow-right" class="home-arrow" />
        </NuxtLink>
      </div>

      <footer class="home-foot">
        <span class="home-status">
          <span class="home-dot" :class="{ 'is-on': store.presence.viewers > 0 }"></span>
          {{ t('home.screens', { n: store.presence.viewers }) }}
        </span>
        <NuxtLink to="/print" class="home-link">{{ t('home.print') }}</NuxtLink>
        <NuxtLink :to="styleGuide" class="home-link">{{ t('home.styleGuide') }}</NuxtLink>
        <span class="home-prefs">
        <span class="home-lang" role="group" :aria-label="t('home.font')">
          <button
            v-for="option in fonts"
            :key="option.id"
            type="button"
            class="home-lang-option home-font-option"
            :class="{ 'is-active': option.id === font }"
            :style="{ fontFamily: option.stack }"
            :aria-pressed="option.id === font"
            :title="option.label"
            @click="setFont(option.id)"
          >
            <span class="text-trim">{{ option.label }}</span>
          </button>
        </span>
        <span class="home-lang" role="group" :aria-label="t('common.switchLanguage')">
          <button
            v-for="code in locales"
            :key="code"
            type="button"
            class="home-lang-option"
            :class="{ 'is-active': code === locale }"
            :aria-pressed="code === locale"
            @click="setLocale(code)"
          >
            <span class="text-trim">{{ code.toUpperCase() }}</span>
          </button>
        </span>
        </span>
      </footer>
    </div>
  </main>
</template>

<style scoped>
.home {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 3rem 1.25rem;
  background: var(--bg);
  font-family: var(--font-text);
  color: var(--text);
}

.home-inner {
  width: 100%;
  max-width: 60rem;
}

/* ─── Header ─────────────────────────────────────────────────────────── */
.home-dashes {
  display: flex;
  gap: 0.35rem;
  margin-bottom: 1.5rem;
}
.home-dashes span {
  width: 2.2rem;
  height: 0.35rem;
  border-radius: 999px;
}

.home-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.home-slash {
  margin: 0 0.4rem;
  color: var(--border);
}

.home-title {
  margin-top: 0.6rem;
  font-size: clamp(2.4rem, 7vw, 4.5rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.04em;
}

.home-lede {
  margin-top: 0.9rem;
  font-size: 1.05rem;
  color: var(--text-dim);
}

/* ─── Views ──────────────────────────────────────────────────────────── */
.home-grid {
  position: relative;
  margin-top: 3.5rem;
  display: grid;
  gap: 1rem;
}

@media (min-width: 720px) {
  .home-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.home-card {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding: 1.4rem 1.4rem;
  border-radius: 1.4rem;
  background: var(--bg-off);
  border: 2px solid var(--border);
  transition: border-color 0.2s ease, background 0.2s ease;
}
.home-card:hover,
.home-card:focus-visible {
  border-color: var(--text);
  background: var(--bg);
  outline: none;
}

.home-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 999px;
  font-size: 1.5rem;
  color: #FFFFFF;
}

.home-card-text {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.home-card-title {
  font-size: 1.2rem;
  font-weight: 800;
}

.home-card-desc {
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--text-dim);
}

.home-arrow {
  margin-left: auto;
  flex: none;
  font-size: 1.2rem;
  color: var(--text-muted);
  transition: color 0.2s ease, translate 0.2s ease;
}
.home-card:hover .home-arrow {
  color: var(--text);
  translate: 3px 0;
}

/* Momo peeks over the grid, one accent after the page lands. */
.home-momo {
  position: absolute;
  top: -4.6rem;
  right: 1.5rem;
  width: 5.2rem;
  height: 5.2rem;
  pointer-events: none;
}

.home-bubble {
  position: absolute;
  bottom: calc(100% - 0.3rem);
  right: 35%;
  padding: calc(0.4rem + 0.24em) 0.7rem;
  border-radius: 0.8rem;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: 0.8rem;
  font-weight: 800;
  line-height: 1.2;
  white-space: nowrap;
  transform-origin: 85% 120%;
  animation: pop-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
}
.home-bubble::after {
  content: '';
  position: absolute;
  right: 0.8rem;
  bottom: calc(-0.35rem - 1px);
  width: 0.6rem;
  height: 0.6rem;
  background: var(--bg);
  border-right: 2px solid var(--text);
  border-bottom: 2px solid var(--text);
  transform: rotate(45deg);
}

/* ─── Footer ─────────────────────────────────────────────────────────── */
.home-foot {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem 1.6rem;
  font-size: 0.78rem;
  color: var(--text-muted);
}

.home-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.home-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--border);
}
.home-dot.is-on {
  background: var(--mint);
}

.home-link {
  color: var(--text-dim);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
.home-link:hover {
  color: var(--text);
}

/* Font and language pickers, side by side at the right. */
.home-prefs {
  margin-left: auto;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.home-lang {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border-radius: 999px;
  background: var(--bg-off);
  border: 2px solid var(--border);
}

.home-lang-option {
  min-width: 2.6rem;
  padding: calc(0.35rem + 0.14em) 0.6rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1;
  color: var(--text-muted);
  cursor: pointer;
}
.home-font-option {
  letter-spacing: 0;
}

.home-lang-option.is-active {
  background: var(--text);
  color: var(--bg);
}
</style>
