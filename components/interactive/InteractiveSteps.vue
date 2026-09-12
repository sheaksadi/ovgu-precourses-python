<script setup lang="ts">
/**
 * Step-by-step reveal the viewer drives itself.
 *
 * Progress is reported through `useInteraction`, so the layout can show the step
 * count and the deck asks before the viewer leaves an unfinished run.
 */
import { computed } from 'vue'
import { useInteraction } from '~/composables/useInteraction'

const props = defineProps<{
  /** One entry per step. */
  items: string[]
  title?: string
}>()

const { step, total, started, completed, markStarted, next, back, complete, reset } =
  useInteraction(props.items.length)

const visible = computed(() => (started.value ? props.items.slice(0, step.value) : []))
const isLast = computed(() => step.value >= total.value)

const advance = () => {
  if (!started.value) return markStarted()
  if (isLast.value) return complete()
  next()
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <h3 v-if="title" class="text-2xl font-bold text-blue-300">{{ title }}</h3>

    <ol class="flex flex-col gap-3">
      <li
        v-for="(item, index) in visible"
        :key="index"
        class="flex items-start gap-3 bg-gray-800/70 border border-gray-700 rounded-2xl px-4 py-3"
      >
        <span class="flex-none w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
          {{ index + 1 }}
        </span>
        <span class="text-base text-gray-200 leading-relaxed">{{ item }}</span>
      </li>
    </ol>

    <p v-if="!started" class="text-gray-400">
      {{ items.length }} step(s) to work through at your own pace.
    </p>

    <div class="flex items-center gap-3">
      <button
        v-if="started && step > 1 && !completed"
        @click="back"
        class="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
      >
        Back
      </button>

      <button
        v-if="!completed"
        @click="advance"
        class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-500 text-sm font-bold text-white transition-colors"
      >
        {{ !started ? 'Start' : isLast ? 'Finish' : 'Next step' }}
      </button>

      <template v-else>
        <span class="flex items-center gap-2 text-emerald-400 text-sm font-medium">
          <Icon name="lucide:check-circle" /> Finished
        </span>
        <button
          @click="reset"
          class="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-400 hover:bg-gray-700 transition-colors"
        >
          Run again
        </button>
      </template>
    </div>
  </div>
</template>
