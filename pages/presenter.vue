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
import { useI18n } from '~/composables/useI18n'

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

/**
 * The presenter's own language, not the room's. The slides on the projector
 * follow the link they were opened with; this only decides which half of the
 * deck this screen reads — the German the room sees, or the English of
 * `slides.en.ts`, titles and speaker notes included.
 */
const { locale, locales, setLocale } = useI18n()

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
  <!-- One screen, never the page: each panel scrolls inside itself. -->
  <div class="h-dvh overflow-hidden bg-gray-950 text-gray-200 font-sans flex flex-col">
    <!-- Header: what this is, the clock, the room, the controls that are not slides -->
    <header class="flex-none flex items-center justify-between gap-3 px-3 sm:px-4 py-2 border-b border-gray-800">
      <div class="flex items-center gap-2 min-w-0">
        <span class="text-[11px] font-bold uppercase tracking-widest text-blue-400">Presenter</span>
        <span class="text-gray-700">/</span>
        <span class="truncate text-xs text-gray-500">{{ deckConfig.title }}</span>
      </div>

      <div class="flex items-center gap-2">
        <!-- Clock -->
        <div class="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1">
          <Icon name="lucide:timer" class="text-gray-600 text-sm" />
          <span class="font-mono text-base tabular-nums leading-none" :class="paceClass">{{ clock(elapsed) }}</span>
          <span v-if="plannedTotal" class="text-[10px] text-gray-600 font-mono">/ {{ plannedTotal }}m</span>
          <button
            @click="running ? pauseTimer() : startTimer()"
            class="text-gray-400 hover:text-white"
            :aria-label="running ? 'Pause the timer' : 'Start the timer'"
          >
            <Icon :name="running ? 'lucide:pause' : 'lucide:play'" class="text-sm" />
          </button>
          <button @click="resetTimer" class="text-gray-600 hover:text-white" aria-label="Reset the timer">
            <Icon name="lucide:rotate-ccw" class="text-sm" />
          </button>
        </div>

        <!-- The room, right under the clock where the pacing is read -->
        <div class="hidden sm:flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1 font-mono text-xs">
          <span class="text-emerald-400" title="Following" data-audience="following">{{ followingCount }} following</span>
          <span class="text-gray-700">·</span>
          <span :class="store.presence.detached ? 'text-amber-400' : 'text-gray-600'" title="Off-sync" data-audience="detached">{{ store.presence.detached }} off</span>
          <span class="text-gray-700">·</span>
          <span :class="store.presence.interacting ? 'text-blue-400' : 'text-gray-600'" title="Working" data-audience="working">{{ store.presence.interacting }} working</span>
          <span class="text-gray-700">·</span>
          <span class="text-gray-600" data-audience="devices">{{ store.connectedClients }} device(s)</span>
        </div>

        <div class="flex items-center gap-0.5 bg-gray-900 border border-gray-800 rounded-lg p-0.5" role="group" aria-label="Notes language">
          <button
            v-for="code in locales"
            :key="code"
            type="button"
            class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide transition-colors"
            :class="code === locale ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'"
            :aria-pressed="code === locale"
            @click="setLocale(code)"
          >
            {{ code }}
          </button>
        </div>

        <NuxtLink to="/dashboard" class="px-2.5 py-1 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg text-xs">
          Dashboard
        </NuxtLink>
      </div>
    </header>

    <main class="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3">
      <!-- Live slide and the controls that move the room -->
      <section class="lg:col-span-7 flex flex-col gap-2 min-h-0">
        <div class="flex-none flex items-baseline justify-between gap-3">
          <h2 class="text-base font-bold text-white truncate">
            <span class="font-mono text-gray-600 mr-2">{{ current?.pageLabel }}</span>
            {{ current?.title || 'Nothing yet' }}
          </h2>
          <div class="flex-none flex items-center gap-2 font-mono text-[11px]">
            <span v-if="slideBudget" :class="slideOverrun ? 'text-red-400' : 'text-gray-600'">
              {{ clock(slideElapsed) }} / {{ slideBudget }}m
            </span>
            <span class="text-gray-700">{{ current?.id }}</span>
          </div>
        </div>

        <div class="flex-none">
          <SlidePreview
            :slide-id="current?.id"
            :route="current?.route"
            label="Live slide"
          />
        </div>

        <!-- What comes next, small: it is a glance, not a second stage. -->
        <div class="flex-1 min-h-0 flex items-center gap-2 overflow-hidden">
          <div class="w-40 flex-none">
            <SlidePreview
              :slide-id="upcoming?.id"
              :route="upcoming?.route"
              label="Next slide"
              placeholder="End of deck"
            />
          </div>
          <div class="min-w-0 pt-0.5">
            <div class="text-[10px] uppercase tracking-widest text-gray-500">Up next</div>
            <div v-if="upcoming" class="text-xs text-gray-400">
              <span class="font-mono text-gray-600 mr-1.5">{{ upcoming.pageLabel }}</span>{{ upcoming.title }}
            </div>
            <div v-else class="text-xs text-gray-600 italic">End of deck</div>
          </div>
        </div>

        <!-- Prev on the left, Next on the right, thumbs where they already are;
             a slide's own action sits between them, so it is never a stray tap. -->
        <div class="flex-none flex items-stretch gap-2">
          <button
            type="button"
            @click="back"
            class="flex-1 min-h-12 touch-manipulation rounded-xl bg-gray-900 hover:bg-gray-800 active:bg-gray-700 border border-gray-800 font-medium flex items-center justify-center gap-2"
          >
            <Icon name="lucide:arrow-left" /> Prev
          </button>

          <button
            v-if="current?.presenterAction"
            type="button"
            @click="runSlideAction"
            class="flex-1 min-h-12 touch-manipulation rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-300 border border-amber-400 text-gray-950 font-bold flex items-center justify-center gap-2"
          >
            <Icon name="lucide:refresh-cw" /> {{ current.presenterAction.label }}
          </button>

          <button
            type="button"
            @click="advance"
            class="flex-1 min-h-12 touch-manipulation rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-400 border border-blue-500 text-white font-bold flex items-center justify-center gap-2"
          >
            Next <Icon name="lucide:arrow-right" />
          </button>
        </div>

        <p v-if="current?.presenterAction?.command === 'spin'" class="flex-none text-[11px] text-gray-400 truncate">
          {{ spins.latestLine.value }}
        </p>

        <p class="flex-none text-[10px] text-gray-600">
          Space or the arrows move the room. Type a slide number to jump, Enter to confirm.
          <span v-if="jumpBuffer" class="text-blue-400 font-mono">jump to {{ jumpBuffer }}…</span>
        </p>
      </section>

      <!-- The notes and the deck, stacked in one column -->
      <aside class="lg:col-span-5 flex flex-col gap-2 min-h-0">
        <div class="flex-1 min-h-0 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 overflow-y-auto">
          <div class="text-[10px] uppercase tracking-widest text-emerald-400 mb-2">Notes</div>
          <p v-if="current?.teleprompter" class="text-base leading-relaxed text-gray-200">
            {{ current.teleprompter }}
          </p>
          <p v-else class="text-gray-600 italic text-sm">No notes for this slide</p>
        </div>

        <div v-if="current?.problem" class="flex-none max-h-[34vh] overflow-y-auto">
          <PresenterProblemPanel :problem-id="current.problem" />
        </div>

        <div class="flex-1 min-h-0 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
          <div class="flex-none px-3 py-2 border-b border-gray-800 text-[10px] uppercase tracking-widest text-gray-500">
            Deck · {{ mainSlideCount }} main slide(s)
          </div>
          <ul class="flex-1 overflow-y-auto p-1.5">
            <li v-for="slide in flatSlides" :key="slide.id">
              <button
                @click="jumpTo(slide.id)"
                class="w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left text-xs transition-colors"
                :class="[
                  slide.id === store.globalSlideId ? 'bg-blue-600/20 text-blue-300' : 'hover:bg-gray-800 text-gray-400',
                  slide.isSubSlide ? 'pl-6' : ''
                ]"
              >
                <span class="font-mono text-[10px] text-gray-600 w-8 flex-none">{{ slide.pageLabel }}</span>
                <span class="truncate flex-1">{{ slide.title }}</span>
                <span v-if="slide.duration" class="flex-none text-[10px] font-mono text-gray-600">{{ slide.duration }}m</span>
                <Icon v-if="slide.interactive" name="lucide:hand" class="text-amber-400 flex-none" />
                <span
                  v-if="store.presence.bySlide[slide.id]"
                  class="flex-none text-[10px] font-mono bg-gray-800 text-gray-400 rounded-full px-1.5"
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
