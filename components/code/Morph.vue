<script setup lang="ts">
/**
 * Morphs one code sample into the next. Auto-imported as `<CodeMorph>`.
 *
 * Tokens that mean the same thing keep their key across stages, so the browser
 * moves them (FLIP, via `<TransitionGroup>`) instead of swapping blocks. Words
 * that only exist in one stage fade out; new syntax fades in after the moves
 * have landed. That is the whole trick: the audience never loses the thread.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { flattenForMorph, tokenizeCode, type CodeToken, type MorphStage } from '~/utils/codeTokens'
import { codeAccent, codeInk } from '~/utils/codeTheme'
import { useCodeLink } from '~/composables/useCodeLink'

const props = withDefaults(defineProps<{
  stages: MorphStage[]
  /** Advance on its own, pausing while the pointer is over the panel. */
  autoplay?: boolean
  /** Milliseconds per stage when autoplaying. */
  interval?: number
  linkable?: boolean
}>(), {
  autoplay: false,
  interval: 3600,
  linkable: true,
})

const link = useCodeLink()
const index = ref(0)
const paused = ref(false)

const stage = computed(() => props.stages[index.value]!)
const isPython = computed(() => (stage.value.variant ?? 'python') === 'python')
const accent = computed(() => codeAccent(stage.value.variant ?? 'python'))
const items = computed(() => flattenForMorph(tokenizeCode(stage.value.code.replace(/\n+$/, ''))))

const go = (next: number) => { index.value = (next + props.stages.length) % props.stages.length }

let timer: ReturnType<typeof setInterval> | undefined
const stopTimer = () => { if (timer) { clearInterval(timer); timer = undefined } }
const startTimer = () => {
  stopTimer()
  if (!props.autoplay) return
  timer = setInterval(() => { if (!paused.value) go(index.value + 1) }, props.interval)
}
watch(() => [props.autoplay, props.interval], startTimer, { immediate: true })
onBeforeUnmount(stopTimer)

const ink = (token: CodeToken) => codeInk(stage.value.variant ?? 'python', token)

</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Stage rail -->
    <div class="flex items-center gap-3">
      <button
        v-for="(item, position) in stages"
        :key="item.label"
        class="morph-step text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full cursor-pointer"
        :style="{
          background: position === index ? 'var(--text)' : 'transparent',
          color: position === index ? 'var(--bg)' : 'var(--text-muted)',
          border: `2px solid ${position === index ? 'var(--text)' : 'var(--border)'}`,
        }"
        @click="go(position)"
      >
        <span class="text-trim">{{ item.label }}</span>
      </button>

      <div class="ml-auto flex items-center gap-2">
        <button class="morph-nav" aria-label="Previous stage" @click="go(index - 1)">
          <Icon name="lucide:arrow-left" />
        </button>
        <button class="morph-nav" aria-label="Next stage" @click="go(index + 1)">
          <Icon name="lucide:arrow-right" />
        </button>
      </div>
    </div>

    <!-- Morph surface -->
    <div
      class="morph-surface rounded-2xl overflow-hidden"
      :style="{ background: 'var(--bg-off)', border: '2px solid var(--border)' }"
      @mouseenter="paused = true"
      @mouseleave="paused = false"
    >
      <div class="morph-tabbar flex items-stretch">
        <div class="morph-tab flex items-center gap-2 px-4 py-2" :style="{ borderBottomColor: accent }">
          <span class="w-1.5 h-1.5 rounded-full" :style="{ background: accent }"></span>
          <span class="text-[11px] font-bold" style="color: var(--text);">
            {{ isPython ? 'main.py' : 'plan.txt' }}
          </span>
        </div>
        <div class="ml-auto flex items-center px-4">
          <span class="text-[10px] font-bold uppercase tracking-widest morph-language" :style="{ color: accent }">
            {{ isPython ? 'python' : 'pseudo-code' }}
          </span>
        </div>
      </div>

      <TransitionGroup
        tag="div"
        name="morph"
        class="morph-flow p-6 text-sm md:text-base leading-[2]"
        style="font-family: var(--font-code);"
      >
        <template v-for="item in items" :key="item.key">
          <span v-if="!item.token" class="morph-break"></span>
          <span
            v-else
            class="morph-token"
            :class="{
              'morph-token-comment': item.token.kind === 'comment',
              'morph-token-linkable': linkable && item.token.link,
              'morph-token-linked': linkable && link.isActive(item.token.link),
            }"
            :style="{
              color: ink(item.token),
              fontWeight: item.token.kind === 'keyword' ? 700 : 400,
              marginLeft: item.first ? `${item.indent * 1.5}rem` : (item.space ? '0.5ch' : '0'),
            }"
            @mouseenter="linkable && link.hover(item.token.link)"
            @mouseleave="linkable && link.unhover()"
            @click="linkable && item.token.link && link.toggle(item.token.link)"
          >{{ item.token.text }}</span>
        </template>
      </TransitionGroup>
    </div>

    <p v-if="stage.note" :key="stage.label" class="morph-note text-xs md:text-sm" style="color: var(--text-dim);">
      {{ stage.note }}
    </p>
  </div>
</template>

<style scoped>
.morph-flow {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  position: relative;
}
.morph-break {
  flex-basis: 100%;
  height: 0;
}
.morph-surface,
.morph-language {
  transition: background 0.5s ease, border-color 0.5s ease, color 0.4s ease;
}
.morph-tabbar {
  border-bottom: 1px solid var(--border);
}
.morph-tab {
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: border-color 0.5s ease;
}
.morph-token {
  border-radius: 0.25rem;
  white-space: pre;
  transition: color 0.4s ease, background 0.2s ease, box-shadow 0.2s ease, margin-left 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.morph-token-comment {
  font-style: italic;
}
.morph-token-linkable {
  cursor: pointer;
}
.morph-token-linked {
  background: color-mix(in srgb, currentColor 16%, transparent);
  outline: 1px solid color-mix(in srgb, currentColor 40%, transparent);
  border-radius: 2px;
}

/* Shared tokens travel; only the genuinely new words fade. */
.morph-move {
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.morph-enter-active {
  transition: opacity 0.3s ease 0.25s, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1) 0.25s;
}
.morph-leave-active {
  transition: opacity 0.2s ease;
  position: absolute;
}
.morph-enter-from,
.morph-leave-to {
  opacity: 0;
}
.morph-enter-from {
  transform: translateY(6px);
}

.morph-nav {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: 2px solid var(--border);
  color: var(--text-dim);
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}
.morph-nav:hover {
  border-color: var(--text);
  color: var(--text);
}
.morph-step {
  padding-block: calc(0.375rem + 0.38em);
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}
.morph-note {
  animation: fade-in 0.4s ease both;
}
</style>
