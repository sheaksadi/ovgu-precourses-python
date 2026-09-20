<script setup lang="ts">
/**
 * "Play it again", on a follow-along device. Mounted once, in `app.vue`.
 *
 * Every animated slide can be replayed by anybody in the room, not only by the
 * person at the laptop: the request goes over the WebSocket and comes back as a
 * broadcast, so the projector and every phone start from the top together —
 * replaying only the phone in your hand would be no use to anyone.
 *
 * On a phone it is a bar under the slide, not a button floating over it: the
 * corner it would sit in is the corner a scene tends to fill, so it costs the
 * slide those few rems instead (`--deck-dock`, see `assets/css/main.css`,
 * applied by the `.deck-stage` height every slide layout uses).
 *
 * A wider screen keeps the button in the corner. There is room there, and a bar
 * across a laptop is a band of nothing under a slide that already fits.
 *
 * While a replay runs the button holds, and the server ignores a second request
 * inside its own lock, the same way the icebreaker spin does.
 *
 * Never on the projector, a peek frame, a controller — or on a slide somebody
 * is working in, where a replay would remount their answer away.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '~/composables/useI18n'
import { useDeckRole } from '~/composables/useDeckRole'
import { useDemos } from '~/composables/useDemos'
import { useSlideData } from '~/composables/useSlideData'
import { useWebSocket } from '~/composables/useWebSocket'

const { t } = useI18n()
const { isViewer, isPeek, isProjector } = useDeckRole()
const { getSlideByRoute } = useSlideData()
const demos = useDemos()
const ws = useWebSocket()
const route = useRoute()

const slide = computed(() => getSlideByRoute(route.path))

const show = computed(() =>
  isViewer.value && !isPeek.value && !isProjector.value
  && !!slide.value && !slide.value.problem && !slide.value.interactive
  // A walk-through carries its own replay, under the frame it belongs to.
  && !demos.ownsReplay.value,
)

/** The width at which the button becomes a bar. Also in this file's styles. */
const PHONE = '(orientation: portrait) and (max-width: 760px)'
const narrow = ref(false)
let media: MediaQueryList | null = null
const onWidth = (event: MediaQueryListEvent) => { narrow.value = event.matches }

/**
 * The slide gives up the height the bar takes, so nothing of the scene ends up
 * behind it. The class carries it rather than a style on one element, because
 * every layout reads the same variable — and only where there is a bar, so a
 * laptop keeps the whole screen.
 */
const dock = () => {
  if (import.meta.server) return
  document.body.classList.toggle('has-deck-dock', show.value && narrow.value)
}
watch([show, narrow], dock)

onMounted(() => {
  media = window.matchMedia(PHONE)
  narrow.value = media.matches
  media.addEventListener('change', onWidth)
  dock()
})

onBeforeUnmount(() => {
  media?.removeEventListener('change', onWidth)
  narrow.value = false
  dock()
})

/** Zero: every screen holds for its own scene, and at least the floor in `useDemos`. */
const replay = () => {
  if (demos.busy.value) return
  ws.sendDemoReplay(0)
}
</script>

<template>
  <div v-if="show" class="dock">
    <button
      type="button"
      class="replay"
      :class="{ 'is-busy': demos.busy.value }"
      :disabled="demos.busy.value"
      :aria-label="t('replay.hint')"
      @click="replay"
    >
      <Icon name="lucide:rotate-ccw" class="replay-icon" />
      <span class="text-trim">{{ demos.busy.value ? t('replay.running') : t('replay.label') }}</span>
    </button>
  </div>
</template>

<style scoped>
/* Wide enough for a corner: the button sits in one, over the slide. */
.dock {
  position: fixed;
  right: 1rem;
  bottom: 2.75rem;
  z-index: 70;
}

.replay {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  background: var(--text);
  font-family: var(--font-text);
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--bg);
  transition: opacity 0.2s ease;
}
.replay.is-busy {
  opacity: 0.45;
}

/* A phone held upright: a bar of its own, and the slide gives up its height. */
@media (orientation: portrait) and (max-width: 760px) {
  .dock {
    left: 0;
    right: 0;
    bottom: 0;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    background: var(--bg);
    border-top: 2px solid var(--border);
  }
}
.replay-icon {
  font-size: 1rem;
}
</style>
