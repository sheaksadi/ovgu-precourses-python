<script setup lang="ts">
/**
 * Single question with local answers.
 *
 * The answer stays on the device: nothing is sent to the server and no other
 * viewer sees it. The presenter view only learns that someone is mid-question.
 */
import { computed } from 'vue'
import { useInteraction } from '~/composables/useInteraction'

const props = defineProps<{
  question: string
  options: string[]
  /** Index of the correct option. Omit for an opinion question. */
  answerIndex?: number
}>()

const { markStarted, complete, completed, reset, value, setValue } = useInteraction(1)

// The pick lives in the interaction store, so a reload does not lose it.
const picked = computed(() => (typeof value.value === 'number' ? value.value : null))

const isCorrect = computed(() =>
  props.answerIndex === undefined ? null : picked.value === props.answerIndex
)

const pick = (index: number) => {
  if (completed.value) return
  markStarted()
  setValue(index)
}

const submit = () => {
  if (picked.value === null) return
  complete()
}

const tryAgain = () => {
  reset()
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <h3 class="text-2xl font-bold text-blue-300">{{ question }}</h3>

    <div class="flex flex-col gap-2.5">
      <button
        v-for="(option, index) in options"
        :key="index"
        @click="pick(index)"
        class="text-left px-4 py-3 rounded-2xl border transition-colors"
        :class="[
          picked === index
            ? 'bg-blue-600/20 border-blue-500 text-white'
            : 'bg-gray-800/70 border-gray-700 text-gray-300 hover:bg-gray-800',
          completed && answerIndex === index ? 'border-emerald-500 text-emerald-300' : ''
        ]"
      >
        <span class="font-mono text-xs text-gray-500 mr-3">{{ String.fromCharCode(65 + index) }}</span>
        {{ option }}
      </button>
    </div>

    <div class="flex items-center gap-3">
      <button
        v-if="!completed"
        @click="submit"
        :disabled="picked === null"
        class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-500 text-sm font-bold text-white disabled:opacity-40 transition-colors"
      >
        Submit answer
      </button>

      <template v-else>
        <span v-if="isCorrect === true" class="flex items-center gap-2 text-emerald-400 text-sm font-medium">
          <Icon name="lucide:check-circle" /> Correct
        </span>
        <span v-else-if="isCorrect === false" class="flex items-center gap-2 text-amber-400 text-sm font-medium">
          <Icon name="lucide:x-circle" /> Not quite
        </span>
        <span v-else class="flex items-center gap-2 text-emerald-400 text-sm font-medium">
          <Icon name="lucide:check-circle" /> Answer recorded
        </span>
        <button
          @click="tryAgain"
          class="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-400 hover:bg-gray-700 transition-colors"
        >
          Answer again
        </button>
      </template>
    </div>

    <p class="text-xs text-gray-600">Your answer stays on this device.</p>
  </div>
</template>
