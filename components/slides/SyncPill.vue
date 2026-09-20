<script setup lang="ts">
/**
 * Sync control, top right of every slide view.
 *
 * A slide view keeps its own local position, so it can fall behind or run ahead
 * of the room. This says how far off it is, offers a peek at the room's slide,
 * syncs in one tap, and can keep syncing by itself. Controllers never see it:
 * they own the room's position. Peek frames never see it either.
 *
 * The projector sees it too, but only the half that has something to do. It is
 * not supposed to drift — yet a hand on its keyboard makes it drift anyway, and
 * then the one screen everybody is looking at is the one screen with no way
 * back. It never carries the quiet "following" line: the room does not need to
 * be told that the projector is in step.
 *
 * Until somebody moves the room there is no room position to be off from, so
 * this says the talk has not started rather than offering a peek at nothing and
 * a sync to nowhere. That state is what a screen sees when the server has just
 * come up, or before the first move of the day.
 */
import { computed, ref } from 'vue'
import { usePresentation } from '~/composables/usePresentation'
import { useDeckRole } from '~/composables/useDeckRole'

const { store, globalSlide, currentIndex, globalIndex, isViewer, syncToGlobal } = usePresentation()
const { isPeek, isProjector } = useDeckRole()

const onSlideView = computed(() => isViewer.value && !isPeek.value)
const target = computed(() => globalSlide.value)
/** Nobody has moved the room yet: there is nothing to sync to. */
const waiting = computed(() => onSlideView.value && !store.globalSlideId)
const detached = computed(() => onSlideView.value && store.detached && !waiting.value)
/** The projector says nothing while it is in step; a device says so quietly. */
const showFollowing = computed(() => onSlideView.value && !isProjector.value && !detached.value && !waiting.value)

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
  <div v-if="detached || showFollowing || (waiting && !isProjector)" class="sync">
    <template v-if="detached">
      <div class="sync-row">
        <button
          type="button"
          class="chip"
          :class="{ 'is-on': peeking }"
          :aria-expanded="peeking"
          aria-label="Peek at the presenter's slide"
          @click="peeking = !peeking"
        >
          <Icon :name="peeking ? 'lucide:eye-off' : 'lucide:eye'" class="chip-icon" />
          <span class="text-trim">Peek</span>
        </button>

        <button
          type="button"
          class="chip is-action"
          :aria-label="target ? `Sync to the presenter, slide ${target.pageLabel}` : 'Sync to the presenter'"
          @click="sync"
        >
          <Icon name="lucide:unlink" class="chip-icon" />
          <span class="text-trim">
            <template v-if="distance">{{ distance }}</template>
            <template v-else>Off-sync</template>
            <template v-if="target"> · {{ target.pageLabel }}</template>
          </span>
          <span class="chip-badge"><span class="text-trim">Sync</span></span>
        </button>
      </div>

      <!-- Peek panel: the room's slide, live, without giving up your place. -->
      <div v-if="peeking && peekUrl" class="peek">
        <div class="peek-frame">
          <iframe :src="peekUrl" title="The presenter's slide" class="peek-page"></iframe>
        </div>
        <div class="peek-label">{{ target?.pageLabel }} · {{ target?.title }}</div>
      </div>

      <label class="auto">
        <input
          type="checkbox"
          class="auto-box"
          :checked="store.autoFollow"
          @change="store.setAutoFollow(($event.target as HTMLInputElement).checked)"
        />
        <span>Auto-sync when I'm free</span>
      </label>
    </template>

    <!-- Nobody has moved the room yet. Nothing to peek at, nothing to sync to. -->
    <div v-else-if="waiting" class="note">
      <span class="dot is-waiting"></span>
      <span>Waiting for the presenter</span>
    </div>

    <div v-else class="note">
      <span class="dot"></span>
      <span>Following presenter</span>
    </div>
  </div>
</template>

<style scoped>
.sync {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 60;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  font-family: var(--font-text);
}

.sync-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

/* ─── The deck's own chip, not a dark overlay one ────────────────────── */
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: calc(0.35rem + 0.12em) 0.7rem;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--border);
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--text-dim);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.chip:hover {
  border-color: var(--text-muted);
  color: var(--text);
}
.chip.is-on {
  background: var(--bg-off);
  border-color: var(--text);
  color: var(--text);
}
.chip-icon {
  font-size: 0.85rem;
}

/* Off-sync is the one thing here worth a colour. */
.chip.is-action {
  background: color-mix(in srgb, var(--coral) 12%, var(--bg));
  border-color: var(--coral);
  color: var(--text);
  padding-right: 0.35rem;
}
.chip.is-action:hover {
  background: color-mix(in srgb, var(--coral) 20%, var(--bg));
  border-color: var(--coral);
}
.chip-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: var(--coral);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #FFFFFF;
}

/* ─── The peek ───────────────────────────────────────────────────────── */
.peek {
  width: 16rem;
  border-radius: 0.9rem;
  overflow: hidden;
  background: var(--bg);
  border: 2px solid var(--border);
}
.peek-frame {
  position: relative;
  width: 100%;
  /* 1280 × 720, scaled to the panel's width. */
  aspect-ratio: 16 / 9;
  background: var(--bg-off);
}
.peek-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 1280px;
  height: 720px;
  border: 0;
  transform: scale(0.2);
  transform-origin: top left;
  pointer-events: none;
}
.peek-label {
  padding: 0.4rem 0.6rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ─── Auto-sync ──────────────────────────────────────────────────────── */
.auto {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: calc(0.3rem + 0.1em) 0.7rem;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--border);
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-dim);
  cursor: pointer;
}
.auto-box {
  width: 0.85rem;
  height: 0.85rem;
  accent-color: var(--coral);
  cursor: pointer;
}

/* ─── In step, or waiting for the first move ─────────────────────────── */
.note {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-muted);
}
.dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
  background: var(--mint);
}
.dot.is-waiting {
  background: var(--sun);
}
</style>
