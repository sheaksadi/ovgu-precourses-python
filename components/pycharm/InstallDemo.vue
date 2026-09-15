<script setup lang="ts">
/**
 * PyCharm install walk-through. Auto-imported as `<PycharmInstallDemo />`.
 *
 * One browser on one slide (PRE-0048), played in one go like the try-it demo
 * (`components/tryit/BrowserDemo.vue`). The step list ticks along as it plays:
 *
 *   1. type "pycharm download" and search     3. scroll down past Professional
 *   2. open the jetbrains.com result          4. download the Community Edition
 *
 * `useDemoPlayer` runs the timeline, replays it on Enter and jumps to the last
 * frame for reduced motion. The download page is laid out in vh, so its scroll
 * position renders on the server.
 *
 * Text lives in `pycharm.*` in `locales/`, the address in `utils/pycharm.ts`.
 */
import { computed, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useDemoPlayer } from '~/composables/useDemoPlayer'
import { PYCHARM } from '~/utils/pycharm'

type Scene = 'search' | 'results' | 'loading' | 'site'

const { t, tm } = useI18n()

/** Wheel notches it takes to bring the Community Edition into view. */
const SCROLL_STEPS = 3
const OS = ['Windows', 'macOS', 'Linux']

/** The step the demo is showing, 1 to 4. */
const step = ref(1)
const steps = computed(() => tm<string[]>('pycharm.steps'))
const tip = computed(() => tm<string[]>('pycharm.tips')[step.value - 1])

const frame = ref<HTMLElement | null>(null)
const scene = ref<Scene>('search')
const query = ref('')
const scroll = ref(0)
const picked = ref(false)
const download = ref<'none' | 'running' | 'done'>('none')
const pressed = ref<string | null>(null)

const onSite = computed(() => scene.value === 'loading' || scene.value === 'site')

const reset = () => {
  step.value = 1
  scene.value = 'search'
  query.value = ''
  scroll.value = 0
  picked.value = false
  download.value = 'none'
  pressed.value = null
}

const land = () => {
  step.value = 4
  scene.value = 'site'
  query.value = t('pycharm.query')
  scroll.value = SCROLL_STEPS
  picked.value = true
  download.value = 'done'
  pressed.value = null
}

const { pointer, instant, finished, later, pointAt, pointAtFraction, play } = useDemoPlayer({
  id: 'pycharm-install',
  stage: 1,
  frame,
  reset,
  land,
  script: () => {
    // 1. Search, typed like a person: a beat before each word.
    const text = t('pycharm.query')
    let at = 700
    for (let i = 1; i <= text.length; i++) {
      later(at, () => { query.value = text.slice(0, i) })
      at += text[i] === ' ' ? 240 : 80 + (i % 3) * 25
    }
    later(at += 400, () => pointAt('[data-point="search"]'))
    later(at += 750, () => { pressed.value = 'search' })
    later(at += 180, () => { pressed.value = null; scene.value = 'results' })

    // 2. Open the jetbrains.com result.
    later(at += 900, () => { step.value = 2 })
    later(at += 300, () => pointAt('[data-point="result"]'))
    later(at += 800, () => { pressed.value = 'result' })
    later(at += 180, () => { pressed.value = null; scene.value = 'loading' })
    later(at += 700, () => { scene.value = 'site' })
    later(at += 500, () => pointAtFraction(0.74, 0.58))

    // 3. Scroll past Professional.
    later(at += 1100, () => { step.value = 3 })
    at += 900
    for (let i = 1; i <= SCROLL_STEPS; i++) {
      later(at, () => { scroll.value = i })
      at += 560
    }
    later(at += 150, () => { picked.value = true })

    // 4. Download the Community Edition.
    later(at += 1100, () => { step.value = 4 })
    later(at += 300, () => pointAt('[data-point="download"]'))
    later(at += 800, () => { pressed.value = 'download' })
    later(at += 180, () => { pressed.value = null; download.value = 'running' })
    later(at += 2200, () => { download.value = 'done' })

    return at
  },
})
</script>

<template>
  <DemoWalkthrough
    :eyebrow="t('pycharm.eyebrow')"
    :title="t('pycharm.title')"
    :steps="steps"
    :stage="step"
    :finished="finished"
    :tip="tip"
    :replay="t('pycharm.replay')"
    :hint="t('pycharm.hint')"
    @replay="play"
  >
    <div ref="frame" class="browser" :class="{ 'is-instant': instant }" role="img" :aria-label="t('pycharm.demoLabel')">
      <div class="browser-bar">
        <span class="browser-nav">
          <Icon name="lucide:arrow-left" />
          <Icon name="lucide:arrow-right" />
          <Icon name="lucide:rotate-cw" />
        </span>
        <span class="browser-address">
          <template v-if="onSite">
            <Icon name="lucide:lock" class="address-icon" />
            <span class="address-text">{{ PYCHARM.display }}</span>
          </template>
          <template v-else>
            <Icon name="lucide:search" class="address-icon" />
            <span class="address-text">{{ query || t('pycharm.search') }}</span>
          </template>
        </span>
      </div>
      <div class="browser-progress" :class="{ 'is-loading': scene === 'loading' }"></div>

      <div class="browser-view">
        <Transition name="scene">
          <!-- 1. Search -->
          <div v-if="scene === 'search'" key="search" class="view view-search">
            <div class="search-mark">
              <Icon name="lucide:search" />
            </div>
            <div class="search-field">
              <span>{{ query }}</span>
              <span class="caret"></span>
            </div>
            <span class="search-button" data-point="search" :class="{ 'is-pressed': pressed === 'search' }">
              <span class="text-trim">{{ t('pycharm.search') }}</span>
            </span>
          </div>

          <!-- 2. Results -->
          <div v-else-if="scene === 'results'" key="results" class="view view-results">
            <div class="results-query">
              <Icon name="lucide:search" />
              <span>{{ query }}</span>
            </div>
            <div class="result" data-point="result" :class="{ 'is-pressed': pressed === 'result' }">
              <span class="result-crumbs">{{ PYCHARM.crumbs }}</span>
              <span class="result-title">{{ t('pycharm.result.title') }}</span>
              <span class="result-snippet">{{ t('pycharm.result.snippet') }}</span>
            </div>
            <div v-for="n in 2" :key="n" class="result" aria-hidden="true">
              <span class="ghost ghost-short"></span>
              <span class="ghost ghost-title"></span>
              <span class="ghost"></span>
            </div>
          </div>

          <!-- Loading -->
          <div v-else-if="scene === 'loading'" key="loading" class="view"></div>

          <!-- 3–4. The download page -->
          <div v-else key="site" class="view view-site">
            <div class="site-page" :style="{ '--scroll': scroll / SCROLL_STEPS }">
              <header class="site-nav">
                <span class="site-brand">
                  <span class="product-mark"><span class="text-trim">PC</span></span>
                  PyCharm
                </span>
                <span class="site-links" aria-hidden="true"><i></i><i></i><i></i></span>
              </header>

              <section class="site-hero">
                <h3 class="site-title">{{ t('pycharm.page.title') }}</h3>
                <span class="os-tabs">
                  <span v-for="(os, index) in OS" :key="os" class="os-tab" :class="{ 'is-active': index === 0 }">
                    <span class="text-trim">{{ os }}</span>
                  </span>
                </span>
              </section>

              <article class="edition">
                <div class="edition-head">
                  <span class="product-mark"><span class="text-trim">PC</span></span>
                  <span class="edition-name">
                    <strong>PyCharm Professional</strong>
                    <span>{{ t('pycharm.page.proText') }}</span>
                  </span>
                </div>
                <div class="edition-actions">
                  <span class="dl-button"><span class="text-trim">{{ t('pycharm.page.download') }}</span></span>
                  <span class="dl-type"><span class="text-trim">.exe</span></span>
                </div>
                <span class="edition-note">{{ t('pycharm.page.trial') }}</span>
              </article>

              <div class="site-ghosts" aria-hidden="true">
                <span class="ghost ghost-title"></span>
                <span class="ghost"></span>
                <span class="ghost ghost-short"></span>
                <span class="ghost-tiles"><i></i><i></i><i></i></span>
              </div>

              <article class="edition edition-community" :class="{ 'is-picked': picked }">
                <Transition name="pop">
                  <span v-if="picked" class="pick-tag"><span class="text-trim">{{ t('pycharm.pick') }}</span></span>
                </Transition>
                <div class="edition-head">
                  <span class="product-mark"><span class="text-trim">PC</span></span>
                  <span class="edition-name">
                    <strong>PyCharm Community Edition</strong>
                    <span>{{ t('pycharm.page.communityText') }}</span>
                  </span>
                </div>
                <div class="edition-actions">
                  <span class="dl-button" data-point="download" :class="{ 'is-pressed': pressed === 'download' }">
                    <span class="text-trim">{{ t('pycharm.page.download') }}</span>
                  </span>
                  <span class="dl-type"><span class="text-trim">.exe</span></span>
                </div>
                <span class="edition-note">{{ t('pycharm.page.free') }}</span>
              </article>

              <div class="site-ghosts" aria-hidden="true">
                <span class="ghost ghost-title"></span>
                <span class="ghost"></span>
                <span class="ghost"></span>
              </div>
            </div>

            <Transition name="fade">
              <span v-if="step === 3 && !picked" class="scroll-hint">
                <Icon name="lucide:mouse" />
                <span class="text-trim">{{ t('pycharm.scroll') }}</span>
                <Icon name="lucide:chevrons-down" class="scroll-chevron" />
              </span>
            </Transition>

            <Transition name="pop">
              <div v-if="download !== 'none'" class="download-pop" :class="{ 'is-done': download === 'done' }">
                <span class="download-icon">
                  <Icon :name="download === 'done' ? 'lucide:check' : 'lucide:download'" />
                </span>
                <span class="download-text">
                  <span class="download-file">{{ PYCHARM.file }}</span>
                  <span class="download-state">{{ download === 'done' ? t('pycharm.downloaded') : t('pycharm.downloading') }}</span>
                  <span class="download-bar"><i></i></span>
                </span>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>

      <DemoPointer v-bind="pointer" :clicking="pressed !== null" :instant="instant" />
    </div>
  </DemoWalkthrough>
</template>

<style scoped>
/* ─── Browser ────────────────────────────────────────────────────────── */
.browser {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 68vh;
  overflow: hidden;
  border-radius: 2vh;
  background: var(--bg);
  border: 2px solid var(--border);
}

.browser-bar {
  display: flex;
  align-items: center;
  gap: 1.6vh;
  padding: 1.2vh 1.6vh;
  background: var(--bg-off);
  border-bottom: 1px solid var(--border);
}

.browser-nav {
  display: flex;
  gap: 1.1vh;
  font-size: clamp(0.8rem, 1.9vh, 1.2rem);
  color: var(--text-muted);
}

.browser-address {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.9vh;
  padding: 0.7vh 1.4vh;
  border-radius: 999px;
  background: var(--bg);
  border: 1px solid var(--border);
  font-size: clamp(0.7rem, 1.5vh, 1rem);
  color: var(--text-dim);
}
.address-icon {
  flex: none;
  color: var(--text-muted);
}
.address-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.browser-progress {
  position: relative;
  height: 3px;
  overflow: hidden;
}
.browser-progress.is-loading::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--sky);
  transform-origin: left center;
  animation: load 0.7s ease-out both;
}

.browser-view {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.view {
  position: absolute;
  inset: 0;
}

/* A new view fades in; the old one is gone at once, like a real page. */
.scene-enter-active {
  animation: appear 0.3s ease both;
}

.ghost {
  display: block;
  width: 80%;
  height: 1.1vh;
  border-radius: 999px;
  background: var(--border);
}
.ghost-short {
  width: 35%;
}
.ghost-title {
  width: 55%;
  height: 2vh;
}

/* ─── 1. Search ──────────────────────────────────────────────────────── */
.view-search {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.6vh;
}

.search-mark {
  display: grid;
  place-items: center;
  width: 7vh;
  height: 7vh;
  border-radius: 999px;
  background: var(--sun);
  font-size: 3.2vh;
  color: var(--text);
}

.search-field {
  width: 72%;
  min-height: 6.2vh;
  display: flex;
  align-items: center;
  padding: 0 2.4vh;
  border-radius: 999px;
  border: 2px solid var(--text);
  font-size: clamp(0.9rem, 2.3vh, 1.5rem);
  font-weight: 600;
  color: var(--text);
  white-space: pre;
}

.caret {
  width: 2px;
  height: 2.8vh;
  margin-left: 2px;
  background: var(--text);
  animation: blink 1s steps(1) infinite;
}

.search-button {
  padding: 1.4vh 2.6vh;
  border-radius: 1.2vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
  font-size: clamp(0.75rem, 1.7vh, 1.1rem);
  font-weight: 800;
  color: var(--text);
  transition: transform 0.12s ease, background 0.12s ease;
}
.search-button.is-pressed {
  transform: scale(0.94);
  background: var(--sun);
}

/* ─── 2. Results ─────────────────────────────────────────────────────── */
.view-results {
  display: flex;
  flex-direction: column;
  gap: 1.4vh;
  padding: 2.4vh 3vh;
}

.results-query {
  display: flex;
  align-items: center;
  gap: 1vh;
  padding-bottom: 1.4vh;
  border-bottom: 1px solid var(--border);
  font-size: clamp(0.75rem, 1.7vh, 1.1rem);
  font-weight: 600;
  color: var(--text-dim);
}

.result {
  display: flex;
  flex-direction: column;
  gap: 0.6vh;
  padding: 1.2vh 1.4vh;
  border-radius: 1.2vh;
  transition: background 0.15s ease;
}
.result.is-pressed {
  background: var(--bg-off);
}

.result-crumbs {
  font-size: clamp(0.6rem, 1.3vh, 0.9rem);
  color: var(--text-muted);
}
.result-title {
  font-size: clamp(0.95rem, 2.4vh, 1.6rem);
  font-weight: 800;
  color: var(--sky);
}
.result-snippet {
  font-size: clamp(0.7rem, 1.5vh, 1rem);
  color: var(--text-dim);
}

/* ─── 3–4. The download page ─────────────────────────────────────────── */
/*
 * Every block has a fixed height in vh, so the Community Edition sits at a known
 * depth and three wheel notches bring it to the top of the view.
 */
.site-page {
  --depth: 62vh;
  display: flex;
  flex-direction: column;
  padding: 0 4.5%;
  transform: translateY(calc(var(--scroll) * var(--depth) * -1));
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.3, 1);
}
/* Replay jumps back to the top instead of scrolling up. */
.is-instant .site-page {
  transition: none;
}

.site-nav {
  flex: none;
  height: 6vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}

.site-brand {
  display: flex;
  align-items: center;
  gap: 1vh;
  font-size: clamp(0.75rem, 1.8vh, 1.2rem);
  font-weight: 900;
  color: var(--text);
}

.site-links {
  display: flex;
  gap: 1.4vh;
}
.site-links i {
  width: 5vh;
  height: 1vh;
  border-radius: 999px;
  background: var(--border);
}

.product-mark {
  display: grid;
  place-items: center;
  flex: none;
  width: 3.6vh;
  height: 3.6vh;
  border-radius: 0.8vh;
  background: var(--lavender);
  font-size: clamp(0.55rem, 1.3vh, 0.85rem);
  font-weight: 900;
  color: #FFFFFF;
}

.site-hero {
  flex: none;
  height: 13vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.6vh;
}

.site-title {
  font-size: clamp(1.1rem, 3.4vh, 2.3rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--text);
}

.os-tabs {
  display: flex;
  gap: 0.8vh;
}
.os-tab {
  padding: 0.9vh 1.4vh;
  border-radius: 999px;
  border: 1px solid var(--border);
  font-size: clamp(0.6rem, 1.35vh, 0.9rem);
  font-weight: 700;
  color: var(--text-dim);
}
.os-tab.is-active {
  background: var(--text);
  border-color: var(--text);
  color: var(--bg);
}

.edition {
  position: relative;
  flex: none;
  height: 24vh;
  margin-top: 1vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.2vh 2.4vh;
  border-radius: 1.6vh;
  border: 2px solid var(--border);
  background: var(--bg-off);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}

.edition-head {
  display: flex;
  align-items: center;
  gap: 1.4vh;
}
.edition .product-mark {
  width: 5.4vh;
  height: 5.4vh;
  border-radius: 1.2vh;
  font-size: clamp(0.75rem, 1.9vh, 1.25rem);
}
.edition-community .product-mark {
  background: var(--mint);
}

.edition-name {
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
  min-width: 0;
}
.edition-name strong {
  font-size: clamp(0.85rem, 2.3vh, 1.55rem);
  font-weight: 900;
  color: var(--text);
}
.edition-name span {
  font-size: clamp(0.65rem, 1.5vh, 1rem);
  color: var(--text-dim);
}

.edition-actions {
  display: flex;
  gap: 2px;
}

.dl-button,
.dl-type {
  padding: 1.3vh 2.2vh;
  background: var(--text);
  font-size: clamp(0.7rem, 1.65vh, 1.1rem);
  font-weight: 800;
  color: var(--bg);
  transition: transform 0.12s ease, background 0.3s ease, filter 0.12s ease;
}
.dl-button {
  border-radius: 1vh 0 0 1vh;
}
.dl-type {
  padding-inline: 1.4vh;
  border-radius: 0 1vh 1vh 0;
}
.dl-button.is-pressed {
  transform: scale(0.94);
  filter: brightness(0.9);
}

.edition-note {
  font-size: clamp(0.6rem, 1.35vh, 0.9rem);
  font-weight: 600;
  color: var(--text-muted);
}

.site-ghosts {
  flex: none;
  height: 20vh;
  margin-top: 3vh;
  display: flex;
  flex-direction: column;
  gap: 1.2vh;
}
.ghost-tiles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.4vh;
  margin-top: 1vh;
}
.ghost-tiles i {
  height: 9vh;
  border-radius: 1.2vh;
  background: var(--bg-off);
}

.edition-community {
  margin-top: 3vh;
}
.edition-community.is-picked {
  border-color: var(--mint);
  background: color-mix(in srgb, var(--mint) 10%, var(--bg));
  box-shadow: 0 0 0 0.6vh color-mix(in srgb, var(--mint) 25%, transparent);
}
.edition-community.is-picked .dl-button,
.edition-community.is-picked .dl-type {
  background: var(--mint);
  color: #FFFFFF;
}

.pick-tag {
  position: absolute;
  top: -1.7vh;
  right: 2.4vh;
  padding: 1vh 1.4vh;
  border-radius: 999px;
  background: var(--coral);
  font-size: clamp(0.65rem, 1.5vh, 1rem);
  font-weight: 900;
  color: #FFFFFF;
  transform-origin: 80% 100%;
}

.scroll-hint {
  position: absolute;
  left: 50%;
  bottom: 2.4vh;
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 1.1vh 1.8vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.65rem, 1.55vh, 1.05rem);
  font-weight: 800;
  color: var(--bg);
  white-space: nowrap;
  translate: -50% 0;
}
.scroll-chevron {
  animation: nudge 1s ease-in-out infinite;
}

.download-pop {
  position: absolute;
  top: 1.4vh;
  right: 1.4vh;
  display: flex;
  align-items: center;
  gap: 1.4vh;
  width: 34vh;
  padding: 1.4vh 1.6vh;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 2px solid var(--text);
  transform-origin: 90% 0;
}

.download-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 4.4vh;
  height: 4.4vh;
  border-radius: 999px;
  background: var(--sky);
  font-size: 2.2vh;
  color: #FFFFFF;
  transition: background 0.3s ease;
}
.is-done .download-icon {
  background: var(--mint);
}

.download-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6vh;
}
.download-file {
  font-size: clamp(0.65rem, 1.55vh, 1.05rem);
  font-weight: 800;
  color: var(--text);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.download-state {
  font-size: clamp(0.55rem, 1.25vh, 0.85rem);
  font-weight: 600;
  color: var(--text-muted);
}
.download-bar {
  height: 0.6vh;
  overflow: hidden;
  border-radius: 999px;
  background: var(--border);
}
.download-bar i {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: var(--sky);
  transform-origin: left center;
  animation: load 2s linear both;
}
.is-done .download-bar i {
  background: var(--mint);
  animation: none;
}

/* ─── Transitions ────────────────────────────────────────────────────── */
.pop-enter-active {
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-leave-to {
  opacity: 0;
}

@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes load {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes pop {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes blink {
  50% { opacity: 0; }
}
@keyframes nudge {
  50% { transform: translateY(0.5vh); }
}
</style>
