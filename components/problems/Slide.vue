<script setup lang="ts">
/**
 * A problem slide. Auto-imported as `<ProblemsSlide problem="loops-fish" round="loops" />`.
 *
 * The same slide serves two audiences: the projector (and the presenter view's
 * previews) show the problem to the room with its progress; a follow-along
 * device gets the workspace for the whole round, opened on this problem.
 */
import { computed } from 'vue'
import { useDeckRole } from '~/composables/useDeckRole'
import { PROBLEM_ROUNDS } from '~/utils/problemRounds'

const props = defineProps<{ problem: string, round: string }>()
const { isViewer, isPeek, isProjector } = useDeckRole()

const onDevice = computed(() => isViewer.value && !isPeek.value && !isProjector.value)
const round = computed(() => PROBLEM_ROUNDS[props.round] ?? [props.problem])
</script>

<template>
  <div class="problem-slide" :class="onDevice ? 'is-device' : 'is-stage'">
    <ProblemsWorkspace v-if="onDevice" :problems="round" :initial="problem" />
    <ProblemsStage v-else :problem="problem" />
  </div>
</template>

<style scoped>
.problem-slide {
  width: 100%;
  height: 100%;
  background: var(--bg);
}
/* A device scrolls; room at the top for the sync pill, at the bottom for the language pill. */
.problem-slide.is-device {
  overflow-x: hidden;
  overflow-y: auto;
  padding: 4rem 1rem 5rem;
}
</style>
