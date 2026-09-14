<script setup lang="ts">
/**
 * Sync control, top right of every slide layout.
 *
 * A slide view keeps its own local position, so it can fall behind or run ahead
 * of the room. This says how far off it is, offers a peek at the room's slide,
 * syncs in one tap, and can keep syncing by itself. Controllers never see it:
 * they own the room's position. Peek frames never see it either.
 */
import { computed, ref } from 'vue'
import { usePresentation } from '~/composables/usePresentation'
import { useDeckRole } from '~/composables/useDeckRole'

const { store, globalSlide, currentIndex, globalIndex, isViewer, syncToGlobal } = usePresentation()
const { isPeek } = useDeckRole()

const showPill = computed(() => isViewer.value && !isPeek.value)
const detached = computed(() => showPill.value && store.detached)
const showFollowing = computed(() => showPill.value && !detached.value)
const target = computed(() => globalSlide.value)

/** How far this screen is from the room, and in which direction. */
const distance = computed(() => {
  if (globalIndex.value < 0 || currentIndex.value < 0) return ''
  const delta = globalIndex.value - currentIndex.value
  if (delta === 0) return ''
  const count = Math.abs(delta)
  return delta > 0 ? `${count} behind` : `${count} ahead`
})

const peeking = ref(false)
const peekUrl = computed(() => (target.value ? `${target.value.route}?mode=stage&peek=1` : ''))

const sync = () => {
  peeking.value = false
  syncToGlobal()
}
</script>

<template>
  <div v-if="detached || showFollowing" class="absolute top-4 right-4 z-[60] flex flex-col items-end gap-2">
    <template v-if="detached">
      <div class="flex items-center gap-1.5">
        <button
          @click="peeking = !peeking"
          class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm text-gray-300 hover:bg-black/60 transition-colors"
          :aria-expanded="peeking"
          aria-label="Peek at the presenter's slide"
        >
          <Icon :name="peeking ? 'lucide:eye-off' : 'lucide:eye'" class="text-sm" />
          <span class="text-[11px] font-medium">Peek</span>
        </button>

        <button
          @click="sync"
          class="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/50 backdrop-blur-sm text-amber-200 hover:bg-amber-500/25 transition-colors shadow-lg"
          :aria-label="target ? `Sync to the presenter, slide ${target.pageLabel}` : 'Sync to the presenter'"
        >
          <Icon name="lucide:unlink" class="text-sm" />
          <span class="text-xs font-medium">
            <template v-if="distance">{{ distance }}</template>
            <template v-else>Off-sync</template>
            <template v-if="target"> · presenter on {{ target.pageLabel }}</template>
          </span>
          <span class="text-[11px] font-bold uppercase tracking-wide bg-amber-400 text-gray-900 rounded-full px-2 py-0.5">
            Sync
          </span>
        </button>
      </div>

      <!-- Peek panel: the room's slide, live, without giving up your place. -->
      <div
        v-if="peeking && peekUrl"
        class="w-64 rounded-xl overflow-hidden border border-gray-700 bg-black shadow-2xl"
      >
        <div class="relative w-full aspect-video">
          <iframe
            :src="peekUrl"
            title="The presenter's slide"
            class="absolute top-0 left-0 origin-top-left border-0 pointer-events-none"
            style="width: 1280px; height: 720px; transform: scale(0.2);"
          ></iframe>
        </div>
        <div class="px-3 py-2 text-[11px] text-gray-400 truncate">
          {{ target?.pageLabel }} · {{ target?.title }}
        </div>
      </div>

      <label class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm cursor-pointer">
        <input
          type="checkbox"
          class="accent-amber-400"
          :checked="store.autoFollow"
          @change="store.setAutoFollow(($event.target as HTMLInputElement).checked)"
        />
        <span class="text-[11px] text-gray-300">Auto-sync when I'm free</span>
      </label>
    </template>

    <div
      v-else
      class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 border border-white/10 backdrop-blur-sm text-gray-400"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
      <span class="text-[11px] font-medium">Following presenter</span>
    </div>
  </div>
</template>
