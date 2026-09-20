<script setup lang="ts">
/**
 * "Play it again", on a follow-along device. Mounted once, in `app.vue`.
 *
 * Every animated slide can be replayed by anybody in the room, not only by the
 * person at the laptop: the request goes over the WebSocket and comes back as a
 * broadcast, so the projector and every phone start from the top together —
 * replaying only the phone in your hand would be no use to anyone.
 *
 * It hovers in the bottom right corner and takes no room from the slide, which
 * keeps the whole screen. While a replay runs the button holds, and the server
 * ignores a second request inside its own lock, the same way the icebreaker
 * spin does.
 *
 * Never on the projector, a peek frame, a controller — or on a slide somebody
 * is working in, where a replay would remount their answer away. A scene that
 * carries a replay of its own (`demos.claimReplay`) takes this one's place.
 */
import { computed } from 'vue'
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

const show = computed(() =>
  onDevice.value && !slide.value!.problem && !slide.value!.interactive
  // A walk-through carries its own replay, under the frame it belongs to.
  && !demos.ownsReplay.value,
)

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
.dock {
  position: fixed;
  right: 1rem;
  /* Clear of the page number in the corner under it. */
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
.replay-icon {
  font-size: 1rem;
}
</style>
