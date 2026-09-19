<script setup lang="ts">
/**
 * `/puzzles` — every puzzle this device has opened, on one page.
 *
 * A follow-along device follows the talk, so when the room moves past a puzzle
 * slide the device moves too. This page is where the puzzle stays reachable:
 * open it in a second tab, or from the last slide, and keep working while the
 * talk goes on. It replaces the floating dock that used to sit on every slide;
 * that corner now belongs to "play it again".
 *
 * The page is read-only as far as the room is concerned: it moves nothing, and
 * it is not a slide, so it never joins the audience counts.
 */
import { onMounted } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useProblems } from '~/composables/useProblems'

const { t } = useI18n()
const problems = useProblems()

useHead({ title: 'Rätsel' })

// After a reload only the ids are remembered; fetch the rest so the page is whole.
onMounted(async () => {
  problems.restoreOpened()
  await Promise.allSettled(
    problems.opened.value.filter(id => !problems.mine.value[id]).map(id => problems.load(id)),
  )
})
</script>

<template>
  <div class="page">
    <header class="head">
      <h1 class="title">{{ t('puzzles.title') }}</h1>
      <p class="intro">{{ t('puzzles.intro') }}</p>
    </header>

    <ProblemsWorkspace v-if="problems.opened.value.length" :problems="problems.opened.value" />
    <p v-else class="empty">{{ t('puzzles.empty') }}</p>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 1.5rem 1rem 3rem;
  background: var(--bg);
  font-family: var(--font-text);
  color: var(--text);
}
.head {
  margin-bottom: 1.25rem;
}
.title {
  font-size: 1.35rem;
  font-weight: 800;
}
.intro {
  margin-top: 0.4rem;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-dim);
}
.empty {
  padding: 2rem 0;
  font-size: 0.9rem;
  color: var(--text-muted);
}
</style>
