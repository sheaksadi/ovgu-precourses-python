<script setup lang="ts">
/**
 * "Play it again", on a follow-along device. Mounted once, in `app.vue`.
 *
 * Every animated slide can be replayed by anybody in the room, not only by the
 * person at the laptop: the request goes over the WebSocket and comes back as a
 * broadcast, so the projector and every phone start from the top together —
 * replaying only the phone in your hand would be no use to anyone.
 *
 * It takes the corner the puzzle dock used to have; the puzzles moved to
 * `/puzzles`. While a replay runs the button holds, and the server ignores a
 * second request inside its own lock, the same way the icebreaker spin does.
 *
 * Never on the projector, a peek frame, a controller — or on a slide somebody
 * is working in, where a replay would remount their answer away.
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

const show = computed(() =>
  isViewer.value && !isPeek.value && !isProjector.value
  && !!slide.value && !slide.value.problem && !slide.value.interactive,
)

/** Zero: every screen holds for its own scene, and at least the floor in `useDemos`. */
const replay = () => {
  if (demos.busy.value) return
  ws.sendDemoReplay(0)
}
</script>

<template>
  <button
    v-if="show"
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
</template>

<style scoped>
.replay {
  position: fixed;
  right: 1rem;
  bottom: 2.75rem;
  z-index: 70;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.95rem;
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
