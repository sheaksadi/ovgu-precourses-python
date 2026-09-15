<script setup lang="ts">
/**
 * Presenter view.
 *
 * One of the two surfaces that own the global slide position, together with the
 * phone remote at `/control`. It shows the live slide, the slide that comes
 * next, the speaker notes, pacing against the planned times, and where the
 * audience actually is.
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { usePresentation } from '~/composables/usePresentation'
import { useSlideData } from '~/composables/useSlideData'
import { useWebSocket } from '~/composables/useWebSocket'
import { useKeyBindings } from '~/composables/useKeyBindings'
import SlidePreview from '~/components/presenter/SlidePreview.vue'
import { useSpins } from '~/composables/useSpins'

definePageMeta({ layout: false })

const {
  store,
  flatSlides,
  mainSlideCount,
  globalSlide,
  globalIndex,
  goToSlide,
  nextSlide,
  prevSlide
} = usePresentation()
const { deckConfig, slideTree } = useSlideData()
const { resolveKeys } = useKeyBindings()
const ws = useWebSocket()

/** The presenter view drives the room, so its own position is the room's. */
const current = computed(() => globalSlide.value || flatSlides.value[0])
const upcoming = computed(() => flatSlides.value[Math.max(0, globalIndex.value) + 1])

// --- Timer and pacing ---------------------------------------------------
const elapsed = ref(0)
const slideElapsed = ref(0)
const running = ref(false)
let timer: any = null

const startTimer = () => {
  running.value = true
  clearInterval(timer)
  timer = setInterval(() => {
    elapsed.value++
    slideElapsed.value++
  }, 1000)
}
const pauseTimer = () => {
  running.value = false
  clearInterval(timer)
}
const resetTimer = () => {
  elapsed.value = 0
  slideElapsed.value = 0
  if (running.value) startTimer()
}

const clock = (seconds: number) => {
  const minutes = Math.floor(Math.abs(seconds) / 60)
  const rest = Math.abs(seconds) % 60
  return `${seconds < 0 ? '-' : ''}${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

/** Planned minutes for the whole deck, from `duration` in slides.config.ts. */
const plannedTotal = computed(() =>
  flatSlides.value.reduce((sum, slide) => sum + (slide.duration || 0), 0)
)

/** Planned minutes up to and including the current slide. */
const plannedSoFar = computed(() =>
  flatSlides.value
    .slice(0, Math.max(0, globalIndex.value) + 1)
    .reduce((sum, slide) => sum + (slide.duration || 0), 0)
)

const slideBudget = computed(() => current.value?.duration || 0)

/** Seconds behind the plan. Negative means ahead of it. */
const drift = computed(() => (plannedSoFar.value ? elapsed.value - plannedSoFar.value * 60 : 0))

const paceClass = computed(() => {
  if (!plannedTotal.value) return 'text-gray-200'
  if (drift.value > 120) return 'text-red-400'
  if (drift.value > 30) return 'text-amber-400'
  return 'text-emerald-400'
})

const slideOverrun = computed(() => slideBudget.value > 0 && slideElapsed.value > slideBudget.value * 60)

const advance = () => {
  nextSlide()
  slideElapsed.value = 0
  if (!running.value) startTimer()
}

const back = () => {
  prevSlide()
  slideElapsed.value = 0
}

const jumpTo = (slideId: string) => {
  goToSlide(slideId)
  slideElapsed.value = 0
}

const runSlideAction = () => {
  const action = current.value?.presenterAction
  if (!action || !current.value) return
  ws.sendCommand('slide_action', { slideId: current.value.id, action: action.command })
}

const spins = useSpins()

const followingCount = computed(() => Math.max(0, store.presence.viewers - store.presence.detached))

// --- Keyboard: navigation, plus type a number to jump -------------------
const jumpBuffer = ref('')
let jumpTimer: any = null

const runJump = () => {
  const target = slideTree.value[Number(jumpBuffer.value) - 1]
  if (target) jumpTo(target.id)
  jumpBuffer.value = ''
}

const handleKeydown = (e: KeyboardEvent) => {
  if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return
  const key = e.key

  if (/^[0-9]$/.test(key)) {
    e.preventDefault()
    jumpBuffer.value += key
    clearTimeout(jumpTimer)
    jumpTimer = setTimeout(runJump, 700)
    return
  }

  if (key === 'Enter' && jumpBuffer.value) {
    e.preventDefault()
    clearTimeout(jumpTimer)
    runJump()
    return
  }

  if (resolveKeys('nextSlide').includes(key)) {
    e.preventDefault()
    advance()
    return
  }
  if (resolveKeys('prevSlide').includes(key)) {
    e.preventDefault()
    back()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  if (ws && ws.sendHello) ws.sendHello()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  clearInterval(timer)
  clearTimeout(jumpTimer)
})
</script>

<template>
  <div class="min-h-dvh bg-gray-950 text-gray-200 font-sans flex flex-col">
    <!-- Header -->
    <header class="flex-none flex flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-6 sm:py-4 border-b border-gray-800">
      <div class="flex items-center gap-3 min-w-0">
        <span class="text-xs font-bold uppercase tracking-widest text-blue-400">Presenter view</span>
        <span class="text-gray-700">/</span>
        <span class="truncate text-sm text-gray-400">{{ deckConfig.title }}</span>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5">
          <Icon name="lucide:timer" class="text-gray-500" />
          <span class="font-mono text-lg tabular-nums" :class="paceClass">{{ clock(elapsed) }}</span>
          <span v-if="plannedTotal" class="text-xs text-gray-500 font-mono">/ {{ plannedTotal }}m plan</span>
          <button
            @click="running ? pauseTimer() : startTimer()"
            class="text-gray-400 hover:text-white p-1"
            :aria-label="running ? 'Pause the timer' : 'Start the timer'"
          >
            <Icon :name="running ? 'lucide:pause' : 'lucide:play'" />
          </button>
          <button @click="resetTimer" class="text-gray-500 hover:text-white p-1" aria-label="Reset the timer">
            <Icon name="lucide:rotate-ccw" />
          </button>
        </div>

        <NuxtLink to="/dashboard" class="px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg text-sm">
          Dashboard
        </NuxtLink>
      </div>
    </header>

    <main class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 p-3 sm:p-6 min-h-0">
      <!-- Live slide and controls -->
      <section class="lg:col-span-2 flex flex-col gap-4 min-h-0">
        <div class="flex items-center justify-between gap-4">
          <div class="min-w-0">
            <div class="text-xs uppercase tracking-widest text-gray-500 mb-1">On screen</div>
            <h2 class="text-xl font-bold text-white truncate">
              <span class="font-mono text-gray-500 mr-2">{{ current?.pageLabel }}</span>
              {{ current?.title || 'Nothing yet' }}
            </h2>
          </div>
          <div class="text-right flex-none">
            <div class="font-mono text-xs text-gray-600">{{ current?.id }}</div>
            <div v-if="slideBudget" class="font-mono text-xs" :class="slideOverrun ? 'text-red-400' : 'text-gray-500'">
              {{ clock(slideElapsed) }} / {{ slideBudget }}m
            </div>
          </div>
        </div>

        <SlidePreview
          :slide-id="current?.id"
          :route="current?.route"
          label="Live slide"
        />

        <div class="sticky bottom-0 z-20 grid grid-cols-2 gap-3 bg-gray-950 py-2">
          <button
            type="button"
            @click="back"
            class="min-h-14 touch-manipulation py-3 rounded-xl bg-gray-900 hover:bg-gray-800 active:bg-gray-700 border border-gray-800 font-medium flex items-center justify-center gap-2"
          >
            <Icon name="lucide:arrow-left" /> Prev
          </button>
          <button
            type="button"
            @click="advance"
            class="min-h-14 touch-manipulation py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-400 border border-blue-500 text-white font-bold flex items-center justify-center gap-2"
          >
            Next <Icon name="lucide:arrow-right" />
          </button>
          <button
            v-if="current?.presenterAction"
            type="button"
            @click="runSlideAction"
            class="col-span-2 min-h-14 touch-manipulation py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-300 border border-amber-400 text-gray-950 font-bold flex items-center justify-center gap-2"
          >
            <Icon name="lucide:refresh-cw" /> {{ current.presenterAction.label }}
          </button>
          <p v-if="current?.presenterAction?.command === 'spin'" class="col-span-2 text-xs text-gray-400 truncate">
            {{ spins.latestLine.value }}
          </p>
        </div>

        <p class="text-[11px] text-gray-600">
          Space or the arrows move the room. Type a slide number to jump, Enter to confirm.
          <span v-if="jumpBuffer" class="text-blue-400 font-mono">jump to {{ jumpBuffer }}…</span>
        </p>

        <!-- Speaker notes -->
        <div class="flex-1 min-h-0 bg-gray-900 border border-gray-800 rounded-2xl p-5 overflow-y-auto">
          <div class="text-xs uppercase tracking-widest text-emerald-400 mb-3">Speaker notes</div>
          <p v-if="current?.teleprompter" class="text-lg leading-relaxed text-gray-200">
            {{ current.teleprompter }}
          </p>
          <p v-else class="text-gray-600 italic">No notes for this slide</p>
        </div>
      </section>

      <!-- Next slide, audience, slide list -->
      <aside class="flex flex-col gap-6 min-h-0">
        <div>
          <div class="text-xs uppercase tracking-widest text-gray-500 mb-2">Up next</div>
          <SlidePreview
            :slide-id="upcoming?.id"
            :route="upcoming?.route"
            label="Next slide"
            placeholder="End of deck"
          />
          <div v-if="upcoming" class="mt-2 text-sm text-gray-400 truncate">
            <span class="font-mono text-gray-600 mr-2">{{ upcoming.pageLabel }}</span>{{ upcoming.title }}
          </div>
        </div>

        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div class="text-xs uppercase tracking-widest text-gray-500 mb-3">Audience</div>
          <dl class="grid grid-cols-3 gap-3 text-center">
            <div>
              <dt class="text-[11px] text-gray-500">Following</dt>
              <dd class="text-2xl font-bold text-emerald-400">{{ followingCount }}</dd>
            </div>
            <div>
              <dt class="text-[11px] text-gray-500">Off-sync</dt>
              <dd class="text-2xl font-bold text-amber-400">{{ store.presence.detached }}</dd>
            </div>
            <div>
              <dt class="text-[11px] text-gray-500">Working</dt>
              <dd class="text-2xl font-bold text-blue-400">{{ store.presence.interacting }}</dd>
            </div>
          </dl>
          <p class="text-[11px] text-gray-600 mt-3">
            {{ store.connectedClients }} device(s) connected. Answers stay on each device.
          </p>
        </div>

        <PresenterProblemPanel v-if="current?.problem" :problem-id="current.problem" />

        <div class="flex-1 min-h-0 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
          <div class="px-5 py-3 border-b border-gray-800 text-xs uppercase tracking-widest text-gray-500">
            Deck · {{ mainSlideCount }} main slide(s)
          </div>
          <ul class="flex-1 overflow-y-auto p-2">
            <li v-for="slide in flatSlides" :key="slide.id">
              <button
                @click="jumpTo(slide.id)"
                class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors"
                :class="[
                  slide.id === store.globalSlideId ? 'bg-blue-600/20 text-blue-300' : 'hover:bg-gray-800 text-gray-400',
                  slide.isSubSlide ? 'pl-7' : ''
                ]"
              >
                <span class="font-mono text-xs text-gray-600 w-10 flex-none">{{ slide.pageLabel }}</span>
                <span class="truncate flex-1">{{ slide.title }}</span>
                <span v-if="slide.duration" class="flex-none text-[10px] font-mono text-gray-600">{{ slide.duration }}m</span>
                <Icon v-if="slide.interactive" name="lucide:hand" class="text-amber-400 flex-none" />
                <span
                  v-if="store.presence.bySlide[slide.id]"
                  class="flex-none text-[10px] font-mono bg-gray-800 text-gray-400 rounded-full px-2 py-0.5"
                >
                  {{ store.presence.bySlide[slide.id] }}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </main>
  </div>
</template>
