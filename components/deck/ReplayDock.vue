<script setup lang="ts">
/**
 * The follow-along device's own strip, under the slide. Mounted once, in
 * `app.vue`, and it holds "play it again" in the middle.
 *
 * Every animated slide can be replayed by anybody in the room, not only by the
 * person at the laptop: the request goes over the WebSocket and comes back as a
 * broadcast, so the projector and every phone start from the top together —
 * replaying only the phone in your hand would be no use to anyone.
 *
 * It is a bar at every size, never a button in a corner. A slide fills its
 * corners — a counter, a QR code, the tallest bar of a run — so a control
 * parked in one covers the thing it controls. The bar costs the slide its own
 * height instead (`--deck-dock`, see `assets/css/main.css`, applied by the
 * `.deck-stage` height every slide layout uses), and that is the same deal the
 * spin button and the walk-through replay take: a row under the scene.
 *
 * The device's other controls dock into the same strip from their own
 * components: the language switch at its left edge
 * (`components/deck/LanguagePill.vue`), the "join in" hint in the middle
 * (`components/deck/InteractiveHint.vue`) and how far this screen is from the
 * room at its right (`components/slides/SyncPill.vue`).
 *
 * While a replay runs the button holds, and the server ignores a second request
 * inside its own lock, the same way the icebreaker spin does.
 *
 * Never on the projector, a peek frame, a controller — or on a slide somebody
 * is working in, where a replay would remount their answer away.
 */
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
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

/** A screen somebody is holding: the only one that carries controls at all. */
const onDevice = computed(() =>
  isViewer.value && !isPeek.value && !isProjector.value && !!slide.value,
)

const replayable = computed(() =>
  onDevice.value && !slide.value!.problem && !slide.value!.interactive
  // A walk-through carries its own replay, under the frame it belongs to.
  && !demos.ownsReplay.value,
)

/**
 * The strip is there for the whole talk, not only where there is something to
 * replay: it also holds the language switch, the join-in hint and how far this
 * screen is from the room. A row that comes and goes under a thumb is worse
 * than a row that is always in the same place.
 */
const show = computed(() => onDevice.value)

/**
 * The slide gives up the height the strip takes, so nothing of the scene ends
 * up behind it. The class carries it rather than a style on one element,
 * because every layout reads the same variable — and only while there is a
 * strip, so the projector keeps the whole screen.
 */
const dock = (on: boolean) => {
  if (import.meta.server) return
  document.body.classList.toggle('has-deck-dock', on)
}
watch(show, dock)

onMounted(() => dock(show.value))
onBeforeUnmount(() => dock(false))

/** Zero: every screen holds for its own scene, and at least the floor in `useDemos`. */
const replay = () => {
  if (demos.busy.value) return
  ws.sendDemoReplay(0)
}
</script>

<template>
  <div v-if="show" class="dock">
    <button
      v-if="replayable"
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
.dock {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 70;
  /* Also `--deck-dock` in `assets/css/main.css`: the slide gives up this much. */
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  background: var(--bg);
  border-top: 2px solid var(--border);
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
.replay-icon {
  font-size: 1rem;
}
</style>
