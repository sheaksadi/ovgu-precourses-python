<script setup lang="ts">
/**
 * The problem dock. Mounted once, in `app.vue`.
 *
 * A follow-along device keeps following the talk, so when the presenter moves
 * past a problem slide the device moves too. Once it has opened a problem, a
 * small pill on every other slide brings the workspace back as a sheet, so
 * nobody has to choose between listening and finishing their puzzle.
 *
 * Only follow-along devices: never the projector, peek frames or controllers.
 */
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '~/composables/useI18n'
import { useDeckRole } from '~/composables/useDeckRole'
import { useProblems } from '~/composables/useProblems'
import { useSlideData } from '~/composables/useSlideData'

const { t } = useI18n()
const { isViewer, isPeek, isProjector } = useDeckRole()
const problems = useProblems()
const { getSlideByRoute } = useSlideData()
const route = useRoute()

const slide = computed(() => getSlideByRoute(route.path))

const show = computed(() =>
  isViewer.value && !isPeek.value && !isProjector.value
  && !!slide.value && !slide.value.problem
  && problems.opened.value.length > 0,
)

const solved = computed(() =>
  problems.opened.value.reduce((sum, id) => sum + Object.keys(problems.mine.value[id]?.solved ?? {}).length, 0),
)

// After a reload only the ids are remembered; fetch the rest so the count is right.
onMounted(async () => {
  problems.restoreOpened()
  if (!isViewer.value || isPeek.value || isProjector.value) return
  await Promise.allSettled(problems.opened.value.filter(id => !problems.mine.value[id]).map(id => problems.load(id)))
})
watch(show, (visible) => { if (!visible) problems.sheetOpen.value = false })
</script>

<template>
  <button v-if="show" type="button" class="dock" @click="problems.sheetOpen.value = true">
    <Icon name="lucide:puzzle" class="dock-icon" />
    <span class="text-trim">{{ t('problems.dock') }}</span>
    <span v-if="solved" class="dock-count"><span class="text-trim">✓ {{ solved }}</span></span>
  </button>

  <Transition name="sheet">
    <div v-if="show && problems.sheetOpen.value" class="sheet" role="dialog" aria-modal="true" :aria-label="t('problems.dock')">
      <div class="sheet-bar">
        <button type="button" class="sheet-close" @click="problems.sheetOpen.value = false">
          <Icon name="lucide:x" />
          <span class="text-trim">{{ t('problems.close') }}</span>
        </button>
      </div>
      <div class="sheet-body">
        <ProblemsWorkspace :problems="problems.opened.value" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.dock {
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
}
.dock-icon {
  font-size: 1rem;
}
.dock-count {
  padding: 0.3rem 0.45rem;
  border-radius: 999px;
  background: var(--mint);
  font-size: 0.72rem;
  color: #FFFFFF;
}

.sheet {
  position: fixed;
  inset: 0;
  z-index: 9980;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}
.sheet-bar {
  flex: none;
  display: flex;
  justify-content: flex-end;
  padding: 0.75rem 1rem;
  border-bottom: 2px solid var(--border);
}
.sheet-close {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.85rem;
  border-radius: 999px;
  border: 2px solid var(--border);
  font-family: var(--font-text);
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--text);
}
.sheet-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem 1rem 3rem;
}

.sheet-enter-active {
  transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.sheet-enter-from {
  opacity: 0;
  transform: translateY(1.5rem);
}
.sheet-leave-active {
  transition: opacity 0.2s ease;
}
.sheet-leave-to {
  opacity: 0;
}
</style>
