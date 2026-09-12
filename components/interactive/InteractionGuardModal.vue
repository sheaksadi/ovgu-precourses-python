<script setup lang="ts">
/**
 * Asked before a viewer leaves an unfinished interaction.
 *
 * It opens when the presenter moves on, or when the viewer navigates itself,
 * while the interaction on the current slide is still in progress. Skipping goes
 * to the new slide; staying keeps the viewer here and off-sync, so the sync pill
 * takes over from there.
 *
 * While it is open it owns the keyboard: focus starts on the safe choice, Tab
 * stays inside, Escape stays put, and focus returns where it came from.
 */
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { usePresentation } from '~/composables/usePresentation'
import { useSlideData } from '~/composables/useSlideData'

const { store, interactions, requestSlide } = usePresentation()
const { getSlideById } = useSlideData()

const guard = computed(() => interactions.guard)
const fromSlide = computed(() => getSlideById(guard.value?.fromSlideId))
const toSlide = computed(() => getSlideById(guard.value?.toSlideId))

const dialog = ref<HTMLElement | null>(null)
const stayButton = ref<HTMLButtonElement | null>(null)
let lastFocused: HTMLElement | null = null

const skipNow = () => {
  const current = guard.value
  if (!current) return
  interactions.skip(current.fromSlideId)
  interactions.closeGuard()
  requestSlide(current.toSlideId, { force: true, fromFollow: current.fromFollow })
}

const stayHere = () => {
  const current = guard.value
  if (!current) return
  // Only refusing the presenter's move detaches this device; refusing your own
  // tap leaves you following, so the next presenter move still arrives.
  if (current.fromFollow) store.setFollowing(false)
  interactions.closeGuard()
}

const focusables = () =>
  Array.from(dialog.value?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') || [])

const onKeydown = (e: KeyboardEvent) => {
  if (!guard.value) return

  if (e.key === 'Escape') {
    e.preventDefault()
    stayHere()
    return
  }

  if (e.key !== 'Tab') return

  const items = focusables()
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement as HTMLElement | null

  if (e.shiftKey && (active === first || !dialog.value?.contains(active))) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && active === last) {
    e.preventDefault()
    first.focus()
  }
}

// Focus the safe choice on open, and hand focus back on close.
watch(guard, async (open, wasOpen) => {
  if (open && !wasOpen) {
    lastFocused = document.activeElement as HTMLElement | null
    await nextTick()
    stayButton.value?.focus()
  } else if (!open && wasOpen) {
    lastFocused?.focus?.()
    lastFocused = null
  }
})

onMounted(() => window.addEventListener('keydown', onKeydown, true))
onUnmounted(() => window.removeEventListener('keydown', onKeydown, true))
</script>

<template>
  <div
    v-if="guard"
    class="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
  >
    <div
      ref="dialog"
      class="w-full max-w-md bg-gray-900 border border-gray-700 rounded-3xl p-7 shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="interaction-guard-title"
      aria-describedby="interaction-guard-body"
    >
      <div class="flex items-center gap-3 mb-4 text-amber-400">
        <Icon name="lucide:hourglass" class="text-2xl" />
        <span class="text-xs font-bold uppercase tracking-widest">Interaction in progress</span>
      </div>

      <h2 id="interaction-guard-title" class="text-2xl font-bold text-white mb-3">
        Move on to the next interaction?
      </h2>

      <p id="interaction-guard-body" class="text-gray-400 leading-relaxed mb-2">
        <template v-if="guard.fromFollow">
          The presenter moved to
          <span class="text-gray-200 font-medium">{{ toSlide?.pageLabel }} · {{ toSlide?.title }}</span>.
        </template>
        <template v-else>
          You are about to open
          <span class="text-gray-200 font-medium">{{ toSlide?.pageLabel }} · {{ toSlide?.title }}</span>.
        </template>
        Your work on
        <span class="text-gray-200 font-medium">{{ fromSlide?.title }}</span>
        is not finished yet.
      </p>

      <p class="text-sm text-gray-500 mb-7">
        Stay here and you keep working at your own pace, off-sync from the room. Use the sync
        button in the corner to catch up whenever you want.
      </p>

      <div class="grid grid-cols-2 gap-3">
        <button
          ref="stayButton"
          @click="stayHere"
          class="py-3.5 rounded-2xl bg-gray-800 hover:bg-gray-700 border border-gray-700 font-bold text-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          Stay here
        </button>
        <button
          @click="skipNow"
          class="py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 border border-blue-500 font-bold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Skip now
        </button>
      </div>
    </div>
  </div>
</template>
