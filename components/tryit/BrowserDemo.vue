<script setup lang="ts">
/**
 * "Try it yourself" demo browser. Auto-imported as `<TryitBrowserDemo />`.
 *
 * Plays once when the slide lands, like a short screen recording: type a
 * search, open the first result, paste one line of Python, press Run, read the
 * output. The browser and the editor are drawn from scratch and brand-free, so
 * the steps read clearly without copying any real site; only the real compiler's
 * address is shown (`utils/tryit.ts`).
 *
 * Replay with the button or Enter. Switching the language replays it in that
 * language. Reduced motion shows the finished state straight away.
 *
 * Text and the one-line program live in `tryit.*` in `locales/`.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { COMPILER } from '~/utils/tryit'

const { t, locale } = useI18n()

type Scene = 'search' | 'results' | 'loading' | 'site'
type Target = 'search' | 'result' | 'run'

const frame = ref<HTMLElement | null>(null)
const searchButton = ref<HTMLElement | null>(null)
const firstResult = ref<HTMLElement | null>(null)
const runButton = ref<HTMLElement | null>(null)

const scene = ref<Scene>('search')
const query = ref('')
const lines = ref(0)
const output = ref(false)
const pressed = ref<Target | null>(null)
const pointer = ref({ x: 0, y: 0, visible: false })
const finished = ref(false)

const code = computed(() => t('tryit.code'))
const visibleCode = computed(() => code.value.split('\n').slice(0, lines.value).join('\n'))
const onSite = computed(() => scene.value === 'loading' || scene.value === 'site')

let timers: ReturnType<typeof setTimeout>[] = []
const later = (ms: number, step: () => void) => { timers.push(setTimeout(step, ms)) }
const stop = () => {
  timers.forEach(clearTimeout)
  timers = []
}

/** Glide the pointer onto an element, measured after the scene has rendered. */
const pointAt = async (target: Ref<HTMLElement | null>) => {
  await nextTick()
  const box = frame.value?.getBoundingClientRect()
  const el = target.value?.getBoundingClientRect()
  if (!box || !el) return
  pointer.value = { x: el.left - box.left + el.width * 0.55, y: el.top - box.top + el.height * 0.6, visible: true }
}

const play = () => {
  stop()
  const text = t('tryit.query')
  const total = code.value.split('\n').length

  scene.value = 'search'
  query.value = ''
  lines.value = 0
  output.value = false
  pressed.value = null
  finished.value = false
  pointer.value = {
    x: (frame.value?.clientWidth ?? 600) * 0.82,
    y: (frame.value?.clientHeight ?? 400) * 0.92,
    visible: false,
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    query.value = text
    scene.value = 'site'
    lines.value = total
    output.value = true
    finished.value = true
    return
  }

  // About nine seconds, start to finish.
  let at = 600
  for (let i = 1; i <= text.length; i++) {
    later(at, () => { query.value = text.slice(0, i) })
    at += 70
  }
  later(at += 350, () => pointAt(searchButton))
  later(at += 750, () => { pressed.value = 'search' })
  later(at += 180, () => { pressed.value = null; scene.value = 'results' })
  later(at += 650, () => pointAt(firstResult))
  later(at += 800, () => { pressed.value = 'result' })
  later(at += 180, () => { pressed.value = null; scene.value = 'loading' })
  later(at += 700, () => { scene.value = 'site' })
  at += 450
  for (let i = 1; i <= total; i++) {
    later(at, () => { lines.value = i })
    at += 110
  }
  later(at += 450, () => pointAt(runButton))
  later(at += 800, () => { pressed.value = 'run' })
  later(at += 180, () => { pressed.value = null; output.value = true })
  later(at += 900, () => {
    finished.value = true
    pointer.value = { ...pointer.value, visible: false }
  })
}

const onKey = (event: KeyboardEvent) => {
  if (event.key !== 'Enter') return
  if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) return
  event.preventDefault()
  play()
}

onMounted(() => {
  play()
  window.addEventListener('keydown', onKey)
})

watch(locale, () => play())

onBeforeUnmount(() => {
  stop()
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div class="demo">
    <div class="demo-momo" aria-hidden="true">
      <span :key="finished ? 'done' : 'idle'" class="demo-bubble" :class="{ 'is-first': !finished }">
        {{ finished ? t('tryit.momo.done') : t('tryit.momo.idle') }}
      </span>
      <ArtSprite name="cat-peek" color="coral" accent="sun" :size="96" class="w-full h-full" />
    </div>

    <div ref="frame" class="browser" role="img" :aria-label="t('tryit.demoLabel')">
      <!-- Browser chrome -->
      <div class="browser-bar">
        <span class="browser-nav">
          <Icon name="lucide:arrow-left" />
          <Icon name="lucide:arrow-right" />
          <Icon name="lucide:rotate-cw" />
        </span>
        <span class="browser-address">
          <template v-if="onSite">
            <Icon name="lucide:lock" class="address-icon" />
            <span class="address-text">{{ COMPILER.display }}</span>
          </template>
          <template v-else>
            <Icon name="lucide:search" class="address-icon" />
            <span class="address-text">{{ query || t('tryit.search') }}</span>
          </template>
        </span>
      </div>
      <div class="browser-progress" :class="{ 'is-loading': scene === 'loading' }"></div>

      <div class="browser-view">
        <!-- 1. Search -->
        <div v-if="scene === 'search'" class="view-search">
          <div class="search-mark">
            <Icon name="lucide:search" />
          </div>
          <div class="search-field">
            <span>{{ query }}</span>
            <span class="caret"></span>
          </div>
          <span ref="searchButton" class="search-button" :class="{ 'is-pressed': pressed === 'search' }">
            {{ t('tryit.search') }}
          </span>
        </div>

        <!-- 2. Results -->
        <div v-else-if="scene === 'results'" class="view-results">
          <div class="results-query">
            <Icon name="lucide:search" />
            <span>{{ query }}</span>
          </div>
          <div ref="firstResult" class="result" :class="{ 'is-pressed': pressed === 'result' }">
            <span class="result-crumbs">{{ COMPILER.crumbs }}</span>
            <span class="result-title">{{ COMPILER.name }}</span>
            <span class="result-snippet">{{ t('tryit.snippet') }}</span>
          </div>
          <div v-for="n in 2" :key="n" class="result result-ghost" aria-hidden="true">
            <span class="ghost ghost-short"></span>
            <span class="ghost ghost-title"></span>
            <span class="ghost"></span>
          </div>
        </div>

        <!-- 3. Loading -->
        <div v-else-if="scene === 'loading'" class="view-loading"></div>

        <!-- 4. The compiler -->
        <div v-else class="view-site">
          <div class="site-bar">
            <span class="site-name">{{ COMPILER.name }}</span>
            <span ref="runButton" class="site-run" :class="{ 'is-pressed': pressed === 'run' }">
              <Icon name="lucide:play" />
              <span class="text-trim">Run</span>
            </span>
          </div>
          <div class="site-body">
            <div class="site-pane">
              <span class="site-tab">main.py</span>
              <CodePanel :code="visibleCode" variant="python" :chrome="false" :linkable="false" class="site-code" />
            </div>
            <div class="site-pane site-output">
              <span class="site-tab">Output</span>
              <div v-if="output" class="output-text">
                <span>{{ t('tryit.output') }}</span>
                <span class="output-done">{{ t('tryit.done') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <svg
        class="pointer"
        :class="{ 'is-visible': pointer.visible, 'is-clicking': pressed }"
        :style="{ transform: `translate(${pointer.x}px, ${pointer.y}px)` }"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M4 2 L4 19 L8.5 14.8 L11.6 21.5 L14.4 20.2 L11.3 13.6 L17.5 13.2 Z"
          fill="var(--text)"
          stroke="#FFFFFF"
          stroke-width="1.4"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <div class="demo-controls">
      <button type="button" class="replay" @click="play">
        <Icon name="lucide:rotate-ccw" />
        <span class="text-trim">{{ t('tryit.replay') }}</span>
      </button>
      <span class="hint">{{ t('tryit.hint') }}</span>
    </div>
  </div>
</template>

<style scoped>
.demo {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2.2vh;
}

/* ─── Momo ───────────────────────────────────────────────────────────── */
.demo-momo {
  position: absolute;
  top: -9.4vh;
  right: 4vh;
  width: 10.5vh;
  height: 10.5vh;
  z-index: 6;
  pointer-events: none;
}

.demo-bubble {
  position: absolute;
  bottom: calc(100% - 0.4vh);
  right: 30%;
  padding: calc(0.7vh + 0.24em) 1.3vh;
  text-box: trim-both cap alphabetic;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.7rem, 1.55vh, 1.05rem);
  font-weight: 800;
  line-height: 1.2;
  color: var(--text);
  white-space: nowrap;
  transform-origin: 85% 120%;
  animation: bubble-pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.demo-bubble.is-first {
  animation-delay: 0.45s;
}
.demo-bubble::after {
  content: '';
  position: absolute;
  right: 1.4vh;
  bottom: calc(-0.6vh - 1px);
  width: 1.1vh;
  height: 1.1vh;
  background: var(--bg);
  border-right: 2px solid var(--text);
  border-bottom: 2px solid var(--text);
  transform: rotate(45deg);
}

/* ─── Browser ────────────────────────────────────────────────────────── */
.browser {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 58vh;
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

/* ─── 1. Search ──────────────────────────────────────────────────────── */
.view-search {
  height: 100%;
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
}

.search-button {
  padding: calc(1.1vh + 0.38em) 2.6vh;
  text-box: trim-both cap alphabetic;
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
  animation: appear 0.3s ease both;
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
  gap: 0.5vh;
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

/* ─── 3. Loading ─────────────────────────────────────────────────────── */
.view-loading {
  height: 100%;
}

/* ─── 4. The compiler ────────────────────────────────────────────────── */
.view-site {
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: appear 0.3s ease both;
}

.site-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2vh 2vh;
  border-bottom: 1px solid var(--border);
}

.site-name {
  font-size: clamp(0.8rem, 1.8vh, 1.2rem);
  font-weight: 800;
  color: var(--text);
}

.site-run {
  display: inline-flex;
  align-items: center;
  gap: 0.7vh;
  padding: calc(0.9vh + 0.25em) 2vh;
  border-radius: 1vh;
  background: var(--mint);
  font-size: clamp(0.75rem, 1.7vh, 1.1rem);
  font-weight: 800;
  color: #FFFFFF;
  transition: transform 0.12s ease, filter 0.12s ease;
}
.site-run.is-pressed {
  transform: scale(0.92);
  filter: brightness(0.92);
}

.site-body {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1.35fr 1fr;
}

.site-pane {
  position: relative;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.site-output {
  background: var(--bg-off);
  border-left: 1px solid var(--border);
}

.site-tab {
  padding: 0.9vh 2vh 0;
  font-size: clamp(0.6rem, 1.3vh, 0.85rem);
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* The editor is a plain code panel with its card look taken off. */
.site-code {
  border: none !important;
  border-radius: 0 !important;
  background: transparent !important;
}

.output-text {
  display: flex;
  flex-direction: column;
  gap: 1.4vh;
  padding: 1.2vh 2vh;
  font-family: var(--font-code);
  font-size: clamp(0.8rem, 1.9vh, 1.25rem);
  color: var(--text);
  animation: appear 0.25s ease both;
}
.output-done {
  font-weight: 800;
  color: var(--mint);
}

/* Code in the demo editor never wraps; a narrow frame stacks the output below instead. */
.site-code :deep(.code-content) {
  white-space: pre;
}

@media (max-aspect-ratio: 3/2) {
  .site-body {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) 13vh;
  }
  .site-output {
    border-left: none;
    border-top: 1px solid var(--border);
  }
}

/* ─── Pointer ────────────────────────────────────────────────────────── */
.pointer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  width: 3.4vh;
  height: 3.4vh;
  margin: -0.4vh 0 0 -0.6vh;
  opacity: 0;
  pointer-events: none;
  transition: transform 0.7s cubic-bezier(0.45, 0, 0.2, 1), opacity 0.25s ease, scale 0.12s ease;
}
.pointer.is-visible {
  opacity: 1;
}
.pointer.is-clicking {
  scale: 0.85;
}

/* ─── Controls ───────────────────────────────────────────────────────── */
.demo-controls {
  display: flex;
  align-items: center;
  gap: 1.6vh;
}

.replay {
  display: inline-flex;
  align-items: center;
  gap: 0.9vh;
  padding: calc(1vh + 0.25em) 2vh;
  border-radius: 1.2vh;
  border: 2px solid var(--text);
  font-size: clamp(0.8rem, 1.8vh, 1.2rem);
  font-weight: 800;
  color: var(--text);
  cursor: pointer;
}

.hint {
  font-size: clamp(0.7rem, 1.5vh, 1rem);
  font-weight: 600;
  color: var(--text-muted);
}

@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes load {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes bubble-pop {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: scale(1); }
}
</style>
