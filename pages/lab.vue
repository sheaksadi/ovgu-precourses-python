<script setup lang="ts">
/**
 * The lab: every view of the deck at once, on one monitor.
 *
 * A testing surface, not part of a talk. One big pane on the left and a column
 * of smaller ones on the right, each an iframe holding a real view — the
 * projector, a student device, the presenter, the remote, the dashboard. The
 * splitters resize, every pane is live and clickable, and each pane renders the
 * deck at desktop size and scales it down, so a narrow pane still shows the
 * projector layout instead of the phone one.
 *
 * Device panes carry `?as=<name>`, so three of them are three different
 * students in the room rather than the same cookie three times.
 *
 * Reached from the start page or the debug bar while debug mode is on. The room
 * controls at the top move every pane at once, exactly like the presenter would.
 */
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { usePresentationStore } from '~/stores/presentationStore'
import { useSlideData } from '~/composables/useSlideData'
import { storageKey } from '~/composables/useDeckRole'

definePageMeta({ layout: 'default' })
useHead({ title: 'Deck lab' })

const store = usePresentationStore()
const { flatSlides, getSlideById, firstSlideId } = useSlideData()

/* ─── What a pane can show ───────────────────────────────────────────── */
type Kind = 'projector' | 'device' | 'presenter' | 'control' | 'dashboard' | 'join' | 'home'

interface Pane {
  key: number
  kind: Kind
  /** Only for device panes: who this frame pretends to be. */
  as: string
  /** The screen this frame pretends to be: a laptop or a phone. */
  size: Size
  /** Bumped to force the iframe to reload. */
  nonce: number
}

type Size = 'desk' | 'phone'

/** A pane renders at one of these, then scales to fit, so the layout is real. */
const SIZES: Record<Size, { w: number, h: number }> = {
  desk: { w: 1440, h: 810 },
  phone: { w: 414, h: 880 },
}

const KINDS: { value: Kind, label: string }[] = [
  { value: 'projector', label: 'projector' },
  { value: 'device', label: 'device' },
  { value: 'presenter', label: 'presenter' },
  { value: 'control', label: 'remote' },
  { value: 'dashboard', label: 'dashboard' },
  { value: 'join', label: 'join' },
  { value: 'home', label: 'start page' },
]

/** Names for new device panes, so a second student is one click away. */
const CAST = ['Lea', 'Jonas', 'Mira', 'Tom', 'Ada', 'Kim']

let nextKey = 1
const makePane = (kind: Kind, as = '', size: Size = 'desk'): Pane => ({ key: nextKey++, kind, as, size, nonce: 0 })

const panes = ref<Pane[]>([
  makePane('projector'),
  makePane('device', CAST[0], 'phone'),
  makePane('presenter'),
])

/** The slide this room is on, which every pane follows. */
const here = computed(() => getSlideById(store.globalSlideId) || getSlideById(firstSlideId.value))
const index = computed(() => flatSlides.value.findIndex(slide => slide.id === here.value?.id))

const srcOf = (pane: Pane) => {
  const slide = here.value?.route ?? '/'
  const bust = pane.nonce ? `&n=${pane.nonce}` : ''
  switch (pane.kind) {
    case 'projector': return `${slide}?mode=stage&screen=projector${bust}`
    case 'device': return `${slide}?mode=stage&screen=audience${pane.as ? `&as=${encodeURIComponent(pane.as)}` : ''}${bust}`
    case 'presenter': return `/presenter?lab=1${bust}`
    case 'control': return `/control?lab=1${bust}`
    case 'dashboard': return `/dashboard?lab=1${bust}`
    case 'join': return `/join?lab=1${pane.as ? `&as=${encodeURIComponent(pane.as)}` : ''}${bust}`
    default: return `/?lab=1${bust}`
  }
}

const addPane = () => {
  const devices = panes.value.filter(pane => pane.kind === 'device').length
  panes.value.push(makePane('device', CAST[devices % CAST.length], 'phone'))
  save()
}
const removePane = (key: number) => {
  if (panes.value.length <= 1) return
  panes.value = panes.value.filter(pane => pane.key !== key)
  save()
}
const reload = (pane: Pane) => { pane.nonce++ }
/** Swap this pane with the big one on the left. */
const promote = (key: number) => {
  const at = panes.value.findIndex(pane => pane.key === key)
  if (at <= 0) return
  const list = [...panes.value]
  ;[list[0], list[at]] = [list[at]!, list[0]!]
  panes.value = list
  save()
}

/* ─── Moving the room ────────────────────────────────────────────────── */
const busy = ref(false)
const goToRoom = async (step: number) => {
  const target = flatSlides.value[index.value + step]
  if (!target || busy.value) return
  busy.value = true
  try {
    await $fetch('/api/navigate', {
      method: 'POST',
      headers: { 'x-deck-controller': 'lab' },
      body: { slideId: target.id },
    })
  } finally {
    busy.value = false
  }
}

const onKey = (event: KeyboardEvent) => {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement)?.tagName)) return
  if (event.key === 'ArrowRight') goToRoom(1)
  if (event.key === 'ArrowLeft') goToRoom(-1)
}

/* ─── Sizes, dragged and remembered ──────────────────────────────────── */
const layout = reactive({
  /** Width of the big pane, as a share of the window. */
  main: 0.62,
  /** Height of each side pane, as shares of the side column. */
  side: [] as number[],
})

const LAYOUT_KEY = () => storageKey('lab-layout')
const PANES_KEY = () => storageKey('lab-panes')

const save = () => {
  try {
    localStorage.setItem(LAYOUT_KEY(), JSON.stringify(layout))
    localStorage.setItem(PANES_KEY(), JSON.stringify(panes.value.map(pane => ({ kind: pane.kind, as: pane.as, size: pane.size }))))
  } catch { /* blocked storage: this visit only */ }
}

const load = () => {
  try {
    const storedPanes = JSON.parse(localStorage.getItem(PANES_KEY()) || 'null')
    if (Array.isArray(storedPanes) && storedPanes.length) {
      panes.value = storedPanes
        .filter((pane: Pane) => KINDS.some(kind => kind.value === pane.kind))
        .map((pane: Pane) => makePane(pane.kind, typeof pane.as === 'string' ? pane.as : '', pane.size === 'phone' ? 'phone' : 'desk'))
    }
    const storedLayout = JSON.parse(localStorage.getItem(LAYOUT_KEY()) || 'null')
    if (storedLayout && typeof storedLayout.main === 'number') {
      layout.main = Math.min(0.85, Math.max(0.25, storedLayout.main))
      if (Array.isArray(storedLayout.side)) layout.side = storedLayout.side
    }
  } catch { /* a broken value just means the default layout */ }
}

/** Side panes share the column evenly until one of them is dragged. */
const sideShares = computed(() => {
  const count = Math.max(panes.value.length - 1, 1)
  const stored = layout.side.slice(0, count)
  const missing = count - stored.length
  const filled = [...stored, ...Array(Math.max(missing, 0)).fill(1 / count)]
  const total = filled.reduce((sum, share) => sum + share, 0) || 1
  return filled.map(share => share / total)
})

const dragging = ref<{ what: 'main' | number, startX: number, startY: number, startShare: number, columnHeight: number } | null>(null)

const startMainDrag = (event: PointerEvent) => {
  dragging.value = { what: 'main', startX: event.clientX, startY: 0, startShare: layout.main, columnHeight: 0 }
  ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
}
const startSideDrag = (event: PointerEvent, at: number) => {
  const column = (event.target as HTMLElement).closest('.lab-side') as HTMLElement | null
  dragging.value = {
    what: at,
    startX: 0,
    startY: event.clientY,
    startShare: sideShares.value[at] ?? 0.5,
    columnHeight: column?.clientHeight ?? window.innerHeight,
  }
  ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
}
const onDrag = (event: PointerEvent) => {
  const drag = dragging.value
  if (!drag) return
  if (drag.what === 'main') {
    layout.main = Math.min(0.85, Math.max(0.25, drag.startShare + (event.clientX - drag.startX) / window.innerWidth))
    return
  }
  const shares = [...sideShares.value]
  const delta = (event.clientY - drag.startY) / Math.max(drag.columnHeight, 1)
  const at = drag.what
  const next = shares[at + 1]
  if (next === undefined) return
  const moved = Math.min(drag.startShare + next - 0.08, Math.max(0.08, drag.startShare + delta))
  shares[at + 1] = next + (shares[at]! - moved)
  shares[at] = moved
  layout.side = shares
}
const endDrag = () => {
  if (!dragging.value) return
  dragging.value = null
  save()
}

/* ─── Each pane renders at full size, then scales down to fit ────────── */
const board = ref<HTMLElement | null>(null)
const scales = reactive<Record<number, number>>({})

const frameOf = (pane: Pane) => SIZES[pane.size]

const measure = () => {
  if (!board.value) return
  board.value.querySelectorAll<HTMLElement>('.lab-pane').forEach((element) => {
    const key = Number(element.dataset.key)
    const pane = panes.value.find(one => one.key === key)
    const body = element.querySelector<HTMLElement>('.lab-body')
    if (!pane || !body) return
    const frame = frameOf(pane)
    scales[key] = Math.min(body.clientWidth / frame.w, body.clientHeight / frame.h)
  })
}

let frame: number | null = null
const remeasure = () => {
  if (frame) cancelAnimationFrame(frame)
  frame = requestAnimationFrame(measure)
}

let observer: ResizeObserver | null = null

onMounted(() => {
  load()
  remeasure()
  observer = new ResizeObserver(remeasure)
  if (board.value) observer.observe(board.value)
  window.addEventListener('resize', remeasure)
  window.addEventListener('keydown', onKey)
})
watch([panes, () => layout.main, sideShares], () => remeasure(), { deep: true })
onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('resize', remeasure)
  window.removeEventListener('keydown', onKey)
  if (frame) cancelAnimationFrame(frame)
})
</script>

<template>
  <div class="lab" @pointermove="onDrag" @pointerup="endDrag" @pointercancel="endDrag">
    <header class="lab-bar">
      <span class="lab-name">deck lab</span>

      <span class="lab-group">
        <button type="button" :disabled="busy || index <= 0" title="Room: previous slide (←)" @click="goToRoom(-1)">◀</button>
        <span class="lab-where">{{ here?.pageLabel ?? '–' }}</span>
        <button
          type="button"
          :disabled="busy || index < 0 || index >= flatSlides.length - 1"
          title="Room: next slide (→)"
          @click="goToRoom(1)"
        >▶</button>
        <span class="lab-title">{{ here?.title }}</span>
      </span>

      <span class="lab-group">
        <button type="button" @click="addPane">+ pane</button>
        <NuxtLink class="lab-link" to="/">✕ leave</NuxtLink>
      </span>
    </header>

    <div ref="board" class="lab-board" :style="{ '--main': layout.main }">
      <!-- The big one -->
      <section v-if="panes[0]" class="lab-pane is-main" :data-key="panes[0].key">
        <div class="lab-head">
          <select v-model="panes[0].kind" class="lab-select" @change="save">
            <option v-for="kind in KINDS" :key="kind.value" :value="kind.value">{{ kind.label }}</option>
          </select>
          <input
            v-if="panes[0].kind === 'device' || panes[0].kind === 'join'"
            v-model="panes[0].as"
            class="lab-as"
            placeholder="as…"
            @change="save"
          >
          <span class="lab-src">{{ srcOf(panes[0]) }}</span>
          <button
            type="button"
            :title="panes[0].size === 'phone' ? 'Render as a laptop' : 'Render as a phone'"
            @click="panes[0].size = panes[0].size === 'phone' ? 'desk' : 'phone'; save(); remeasure()"
          >{{ panes[0].size === 'phone' ? '▯' : '▭' }}</button>
          <button type="button" title="Reload this pane" @click="reload(panes[0])">⟳</button>
          <a class="lab-link" :href="srcOf(panes[0])" target="_blank" title="Open in a tab">↗</a>
          <button type="button" title="Close this pane" @click="removePane(panes[0].key)">✕</button>
        </div>
        <div class="lab-body">
          <iframe
            :key="`${panes[0].key}-${panes[0].nonce}`"
            :src="srcOf(panes[0])"
            :style="{ width: `${frameOf(panes[0]).w}px`, height: `${frameOf(panes[0]).h}px`, '--scale': scales[panes[0].key] ?? 1 }"
          ></iframe>
        </div>
      </section>

      <div class="lab-split is-main" @pointerdown="startMainDrag"></div>

      <!-- The column beside it -->
      <div class="lab-side">
        <template v-for="(pane, at) in panes.slice(1)" :key="pane.key">
          <section class="lab-pane" :data-key="pane.key" :style="{ '--share': sideShares[at] }">
            <div class="lab-head">
              <select v-model="pane.kind" class="lab-select" @change="save">
                <option v-for="kind in KINDS" :key="kind.value" :value="kind.value">{{ kind.label }}</option>
              </select>
              <input
                v-if="pane.kind === 'device' || pane.kind === 'join'"
                v-model="pane.as"
                class="lab-as"
                placeholder="as…"
                @change="save"
              >
              <span class="lab-src">{{ srcOf(pane) }}</span>
              <button
                type="button"
                :title="pane.size === 'phone' ? 'Render as a laptop' : 'Render as a phone'"
                @click="pane.size = pane.size === 'phone' ? 'desk' : 'phone'; save(); remeasure()"
              >{{ pane.size === 'phone' ? '▯' : '▭' }}</button>
              <button type="button" title="Make this the big pane" @click="promote(pane.key)">⤢</button>
              <button type="button" title="Reload this pane" @click="reload(pane)">⟳</button>
              <a class="lab-link" :href="srcOf(pane)" target="_blank" title="Open in a tab">↗</a>
              <button type="button" title="Close this pane" @click="removePane(pane.key)">✕</button>
            </div>
            <div class="lab-body">
              <iframe
                :key="`${pane.key}-${pane.nonce}`"
                :src="srcOf(pane)"
                :style="{ width: `${frameOf(pane).w}px`, height: `${frameOf(pane).h}px`, '--scale': scales[pane.key] ?? 1 }"
              ></iframe>
            </div>
          </section>
          <div
            v-if="at < panes.length - 2"
            class="lab-split is-side"
            @pointerdown="event => startSideDrag(event, at)"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Deliberately outside the design system: this is a tool, never a slide. */
.lab {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: #11111B;
  font-family: ui-monospace, 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #CDD6F4;
}

.lab-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.4rem 0.6rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.lab-name {
  padding: 0.15rem 0.45rem;
  border-radius: 0.35rem;
  background: rgba(137, 180, 250, 0.18);
  font-weight: 700;
  color: #89B4FA;
}
.lab-group {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.lab-group:last-child {
  margin-left: auto;
}
.lab-where {
  min-width: 2.4rem;
  text-align: center;
  color: #A6ADC8;
}
.lab-title {
  margin-left: 0.4rem;
  max-width: 28ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #6C7086;
}

button,
.lab-link,
.lab-select,
.lab-as {
  padding: 0.2rem 0.4rem;
  border-radius: 0.35rem;
  background: transparent;
  border: 1px solid transparent;
  font-family: inherit;
  font-size: 11px;
  color: #CDD6F4;
  text-decoration: none;
  transition: background 0.15s ease;
}
button:hover,
.lab-link:hover {
  background: rgba(255, 255, 255, 0.12);
}
button:disabled {
  opacity: 0.35;
}
.lab-select,
.lab-as {
  border-color: rgba(255, 255, 255, 0.18);
  background: #181825;
}
.lab-as {
  width: 8ch;
}

/* ─── The board ──────────────────────────────────────────────────────── */
.lab-board {
  flex: 1;
  display: grid;
  grid-template-columns: calc(var(--main) * 100%) 6px 1fr;
  min-height: 0;
}
.lab-side {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.lab-pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  background: #181825;
}
.lab-side .lab-pane {
  flex: var(--share, 1) 1 0;
}
.lab-head {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.25rem 0.35rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.lab-src {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #6C7086;
}

/* The frame renders at desktop size and is scaled to fit, so a narrow pane
   still shows the projector layout rather than the phone one. */
.lab-body {
  position: relative;
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  background: #0B0B12;
}
/* Out of flow on purpose: a 1440px frame inside the grid would set the column
   width, and the pane could never be dragged narrower than the deck. */
.lab-body iframe {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 0;
  background: #FFFFFF;
  transform-origin: center center;
  transform: translate(-50%, -50%) scale(var(--scale, 1));
}

.lab-split {
  background: rgba(255, 255, 255, 0.08);
  transition: background 0.15s ease;
}
.lab-split:hover {
  background: #89B4FA;
}
.lab-split.is-main {
  cursor: col-resize;
}
.lab-split.is-side {
  height: 6px;
  cursor: row-resize;
}
</style>
