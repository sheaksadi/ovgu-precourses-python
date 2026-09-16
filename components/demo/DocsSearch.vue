<script setup lang="ts">
/**
 * Looking something up, played in one animation. Auto-imported as
 * `<DemoDocsSearch demo="builtins" />`.
 *
 * The move every programmer makes twenty times a day: type what you want into a
 * search engine, open the official documentation, find the entry, read its
 * example. One slide plays all of it — search, open, scroll, land — the way the
 * PyCharm install demo does.
 *
 * The page content is `utils/docsSearch.ts`; the labels are `docs.*` in
 * `locales/`. Enter or the replay button plays it again; reduced motion shows
 * the finished page.
 */
import { computed, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useDemoPlayer } from '~/composables/useDemoPlayer'
import { DOCS_DEMOS } from '~/utils/docsSearch'

type Scene = 'search' | 'results' | 'loading' | 'site'

const props = defineProps<{ demo: string }>()
const { t, tm, locale } = useI18n()

const data = computed(() => DOCS_DEMOS[props.demo]!)
const query = computed(() => data.value.query[locale.value])
const entries = computed(() => data.value.entries.map(entry => ({ name: entry.name, text: entry[locale.value] })))

/** Wheel notches it takes to bring the entry into view. */
const SCROLL_STEPS = 2

const frame = ref<HTMLElement | null>(null)
const scene = ref<Scene>('search')
const typed = ref('')
const scroll = ref(0)
const picked = ref(false)
const example = ref(false)
const pressed = ref<string | null>(null)

const onSite = computed(() => scene.value === 'loading' || scene.value === 'site')

const reset = () => {
  scene.value = 'search'
  typed.value = ''
  scroll.value = 0
  picked.value = false
  example.value = false
  pressed.value = null
}

const land = () => {
  scene.value = 'site'
  typed.value = query.value
  scroll.value = SCROLL_STEPS
  picked.value = true
  example.value = true
  pressed.value = null
}

const { pointer, instant, finished, later, pointAt, pointAtFraction, play } = useDemoPlayer({
  id: `docs-${props.demo}`,
  stage: 1,
  frame,
  reset,
  land,
  script: () => {
    // 1. Type what you want, the way you would say it.
    const text = query.value
    let at = 700
    for (let i = 1; i <= text.length; i++) {
      later(at, () => { typed.value = text.slice(0, i) })
      at += text[i] === ' ' ? 220 : 70 + (i % 3) * 20
    }
    later(at += 400, () => pointAt('[data-point="search"]'))
    later(at += 700, () => { pressed.value = 'search' })
    later(at += 180, () => { pressed.value = null; scene.value = 'results' })

    // 2. Open the official page, not the first blog.
    later(at += 900, () => pointAt('[data-point="result"]'))
    later(at += 800, () => { pressed.value = 'result' })
    later(at += 180, () => { pressed.value = null; scene.value = 'loading' })
    later(at += 700, () => { scene.value = 'site' })
    later(at += 500, () => pointAtFraction(0.68, 0.55))

    // 3. Scroll to the entry and read its example.
    at += 700
    for (let i = 1; i <= SCROLL_STEPS; i++) {
      later(at, () => { scroll.value = i })
      at += 620
    }
    later(at += 250, () => { picked.value = true })
    later(at += 900, () => { example.value = true })

    return at
  },
})
</script>

<template>
  <DemoWalkthrough
    :eyebrow="t('docs.eyebrow')"
    :title="t(`docs.${demo}.title`)"
    :steps="tm<string[]>(`docs.${demo}.steps`)"
    :stage="picked ? 3 : scene === 'search' ? 1 : 2"
    :finished="finished"
    :tip="t(`docs.${demo}.tip`)"
    :replay="t('docs.replay')"
    :hint="t('docs.hint')"
    @replay="play"
  >
    <div ref="frame" class="browser" :class="{ 'is-instant': instant }" role="img" :aria-label="t('docs.demoLabel')">
      <div class="browser-bar">
        <span class="browser-nav">
          <Icon name="lucide:arrow-left" />
          <Icon name="lucide:arrow-right" />
          <Icon name="lucide:rotate-cw" />
        </span>
        <span class="browser-address">
          <template v-if="onSite">
            <Icon name="lucide:lock" class="address-icon" />
            <span class="address-text">{{ data.address }}</span>
          </template>
          <template v-else>
            <Icon name="lucide:search" class="address-icon" />
            <span class="address-text">{{ typed || t('docs.search') }}</span>
          </template>
        </span>
      </div>
      <div class="browser-progress" :class="{ 'is-loading': scene === 'loading' }"></div>

      <div class="browser-view">
        <Transition name="scene">
          <!-- 1. The search -->
          <div v-if="scene === 'search'" key="search" class="view view-search">
            <div class="search-mark"><Icon name="lucide:search" /></div>
            <div class="search-field">
              <span>{{ typed }}</span>
              <span class="caret"></span>
            </div>
            <span class="search-button" data-point="search" :class="{ 'is-pressed': pressed === 'search' }">
              <span class="text-trim">{{ t('docs.search') }}</span>
            </span>
          </div>

          <!-- 2. The results -->
          <div v-else-if="scene === 'results'" key="results" class="view view-results">
            <div class="results-query">
              <Icon name="lucide:search" />
              <span>{{ typed }}</span>
            </div>
            <div class="result" data-point="result" :class="{ 'is-pressed': pressed === 'result' }">
              <span class="result-crumbs">{{ data.crumbs }}</span>
              <span class="result-title">{{ data.result[locale] }}</span>
              <span class="result-snippet">{{ data.snippet[locale] }}</span>
            </div>
            <div v-for="n in 2" :key="n" class="result" aria-hidden="true">
              <span class="ghost ghost-short"></span>
              <span class="ghost ghost-title"></span>
              <span class="ghost"></span>
            </div>
          </div>

          <div v-else-if="scene === 'loading'" key="loading" class="view"></div>

          <!-- 3. The documentation -->
          <div v-else key="site" class="view view-site">
            <div class="site-page" :style="{ '--scroll': scroll / SCROLL_STEPS }">
              <header class="site-head">
                <span class="site-brand"><span class="text-trim">{{ data.address.split('/')[0] }}</span></span>
                <h3 class="site-title">{{ data.pageTitle[locale] }}</h3>
              </header>

              <div
                v-for="(entry, index) in entries"
                :key="entry.name"
                class="entry"
                :class="{ 'is-picked': picked && index === data.pick }"
              >
                <code class="entry-name">{{ entry.name }}</code>
                <span class="entry-text">{{ entry.text }}</span>

                <Transition name="pop">
                  <div v-if="example && index === data.pick" class="entry-example">
                    <code v-for="(line, k) in data.example" :key="k" :class="{ 'is-prompt': line.startsWith('>>>') }">{{ line }}</code>
                  </div>
                </Transition>
              </div>
            </div>

            <Transition name="fade">
              <span v-if="!picked" class="scroll-hint">
                <Icon name="lucide:mouse" />
                <span class="text-trim">{{ t('docs.scroll') }}</span>
                <Icon name="lucide:chevrons-down" class="scroll-chevron" />
              </span>
            </Transition>
          </div>
        </Transition>
      </div>

      <DemoPointer v-bind="pointer" :clicking="pressed !== null" :instant="instant" />
    </div>
  </DemoWalkthrough>
</template>

<style scoped>
.browser {
  position: relative;
  height: 68vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 2vh;
  background: var(--bg);
  border: 2px solid var(--text);
}

/* ─── Chrome ─────────────────────────────────────────────────────────── */
.browser-bar {
  flex: none;
  display: flex;
  align-items: center;
  gap: 1.4vh;
  padding: 1.2vh 1.6vh;
  background: var(--bg-off);
  border-bottom: 2px solid var(--border);
}
.browser-nav {
  display: flex;
  gap: 1vh;
  font-size: clamp(0.7rem, 1.8vh, 1.2rem);
  color: var(--text-muted);
}
.browser-address {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.8vh;
  padding: 0.7vh 1.2vh;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--border);
  font-family: var(--font-code);
  font-size: clamp(0.55rem, 1.5vh, 1rem);
  color: var(--text-dim);
}
.address-icon {
  flex: none;
  font-size: 0.9em;
}
.address-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.browser-progress {
  flex: none;
  height: 0.4vh;
  background: transparent;
}
.browser-progress.is-loading {
  background: linear-gradient(90deg, var(--sky) 0%, var(--sky) 60%, transparent 60%);
  animation: load 0.7s linear both;
}
.browser-view {
  position: relative;
  flex: 1;
  overflow: hidden;
}
.view {
  position: absolute;
  inset: 0;
}

/* ─── 1: search ──────────────────────────────────────────────────────── */
.view-search {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.4vh;
}
.search-mark {
  display: grid;
  place-items: center;
  width: 8vh;
  height: 8vh;
  border-radius: 999px;
  background: var(--bg-off);
  font-size: clamp(1.2rem, 3.4vh, 2.4rem);
  color: var(--text-muted);
}
.search-field {
  display: flex;
  align-items: center;
  gap: 0.4vh;
  width: 60%;
  padding: 1.4vh 2vh;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.7rem, 2vh, 1.4rem);
  color: var(--text);
}
.caret {
  width: 0.2vh;
  height: 2.4vh;
  background: var(--text);
  animation: blink 1s steps(2) infinite;
}
.search-button {
  padding: calc(0.8vh + 0.3em) 2vh;
  border-radius: 1.2vh;
  background: var(--text);
  font-size: clamp(0.65rem, 1.8vh, 1.2rem);
  font-weight: 800;
  color: var(--bg);
  transition: transform 0.15s ease;
}
.search-button.is-pressed {
  transform: scale(0.94);
}

/* ─── 2: results ─────────────────────────────────────────────────────── */
.view-results {
  display: flex;
  flex-direction: column;
  gap: 2vh;
  padding: 2.4vh;
}
.results-query {
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 1vh 1.6vh;
  border-radius: 999px;
  background: var(--bg-off);
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  color: var(--text-dim);
}
.result {
  display: flex;
  flex-direction: column;
  gap: 0.6vh;
  padding: 1.4vh 1.6vh;
  border-radius: 1.2vh;
  border: 2px solid transparent;
  transition: transform 0.15s ease, border-color 0.2s ease;
}
.result[data-point] {
  border-color: var(--border);
}
.result.is-pressed {
  transform: scale(0.99);
  border-color: var(--text);
}
.result-crumbs {
  font-family: var(--font-code);
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  color: var(--text-muted);
}
.result-title {
  font-size: clamp(0.75rem, 2vh, 1.35rem);
  font-weight: 800;
  color: var(--sky);
}
.result-snippet {
  font-size: clamp(0.6rem, 1.6vh, 1.05rem);
  color: var(--text-dim);
}
.ghost {
  height: 1.6vh;
  border-radius: 999px;
  background: var(--bg-off);
}
.ghost-short {
  width: 30%;
  height: 1.2vh;
}
.ghost-title {
  width: 60%;
  height: 2.2vh;
}

/* ─── 3: the documentation ───────────────────────────────────────────── */
.view-site {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.site-page {
  --depth: 30vh;
  display: flex;
  flex-direction: column;
  gap: 1.2vh;
  padding: 2.4vh;
  transform: translateY(calc(var(--scroll) * var(--depth) * -1));
  transition: transform 0.55s cubic-bezier(0.25, 0.8, 0.3, 1);
}
/* Replay jumps back to the top instead of scrolling up. */
.is-instant .site-page {
  transition: none;
}
.site-head {
  display: flex;
  flex-direction: column;
  gap: 0.8vh;
  padding-bottom: 1.2vh;
  border-bottom: 2px solid var(--border);
}
.site-brand {
  align-self: flex-start;
  padding: calc(0.3vh + 0.25em) 1vh;
  border-radius: 999px;
  background: var(--bg-off);
  font-family: var(--font-code);
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  font-weight: 700;
  color: var(--text-muted);
}
.site-title {
  font-family: var(--font-code);
  font-size: clamp(0.9rem, 2.6vh, 1.8rem);
  font-weight: 900;
  color: var(--text);
}
.entry {
  display: flex;
  flex-direction: column;
  gap: 0.4vh;
  padding: 1vh 1.4vh;
  border-radius: 1.2vh;
  border: 2px solid transparent;
  transition: background 0.3s ease, border-color 0.3s ease;
}
.entry.is-picked {
  background: color-mix(in srgb, var(--sun) 26%, var(--bg));
  border-color: var(--text);
}
.entry-name {
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.75vh, 1.15rem);
  font-weight: 800;
  color: var(--text);
}
.entry-text {
  font-size: clamp(0.55rem, 1.55vh, 1rem);
  color: var(--text-dim);
}
.entry-example {
  display: flex;
  flex-direction: column;
  gap: 0.3vh;
  margin-top: 0.8vh;
  padding: 1vh 1.2vh;
  border-radius: 0.9vh;
  background: var(--code-bg);
}
.entry-example code {
  /* JSON is indented; without this the browser eats the leading spaces. */
  white-space: pre;
  font-family: var(--font-code);
  font-size: clamp(0.55rem, 1.5vh, 0.95rem);
  color: var(--code-text);
}
.entry-example code.is-prompt {
  color: var(--mint);
}

.scroll-hint {
  position: absolute;
  left: 50%;
  bottom: 2vh;
  display: flex;
  align-items: center;
  gap: 0.8vh;
  padding: calc(0.6vh + 0.25em) 1.4vh;
  border-radius: 999px;
  background: var(--text);
  translate: -50% 0;
  font-size: clamp(0.55rem, 1.45vh, 0.95rem);
  font-weight: 700;
  color: var(--bg);
}
.scroll-chevron {
  animation: nudge 1.1s ease-in-out infinite;
}

/* ─── Transitions ────────────────────────────────────────────────────── */
.scene-enter-active {
  transition: opacity 0.3s ease;
}
.scene-enter-from {
  opacity: 0;
}
.scene-leave-active {
  position: absolute;
  inset: 0;
  transition: opacity 0.2s ease;
}
.scene-leave-to {
  opacity: 0;
}
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-leave-to {
  opacity: 0;
}
.pop-enter-active {
  transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.pop-enter-from {
  opacity: 0;
  transform: translateY(-0.8vh);
}

@keyframes blink {
  50% { opacity: 0; }
}
@keyframes load {
  from { background-size: 0% 100%; }
  to { background-size: 100% 100%; }
}
@keyframes nudge {
  50% { transform: translateY(0.5vh); }
}
</style>
