<script setup lang="ts">
/**
 * One code sample, tokenized and dressed like an editor. Auto-imported as
 * `<CodePanel>`.
 *
 * Editor furniture: a tab bar with the file name, a line-number gutter, indent
 * guides, a lit current line, and occurrence highlighting — hovering a token
 * outlines every token that means the same thing, in this panel and in every
 * other panel on the slide.
 */
import { computed } from 'vue'
import { needsSpaceBefore, tokenizeCode, type CodeToken } from '~/utils/codeTokens'
import { useCodeLink } from '~/composables/useCodeLink'
import { codeAccent, codeInk } from '~/utils/codeTheme'

const props = withDefaults(defineProps<{
  code: string
  /** Chooses the tab name, the language label and the accent colour. */
  variant?: 'python' | 'pseudo'
  /** Tab label. Defaults to `main.py` / `plan.txt`. */
  filename?: string
  label?: string
  /** 1-based line numbers to keep lit. Every other line dims. */
  focus?: number[]
  /** Tab bar with the file name and the language. */
  chrome?: boolean
  /** Line-number gutter. */
  gutter?: boolean
  /** Hovering a token highlights the same idea everywhere. */
  linkable?: boolean
  /** Stagger the lines in on mount. */
  reveal?: boolean
  /** `lg` for the hero sample on a slide. */
  size?: 'base' | 'lg'
}>(), {
  size: 'base',
  variant: 'python',
  chrome: true,
  gutter: true,
  linkable: true,
  reveal: false,
})

const link = useCodeLink()
const lines = computed(() => tokenizeCode(props.code.replace(/\n+$/, '')))
const isPython = computed(() => props.variant === 'python')
const accent = computed(() => codeAccent(props.variant))
const ink = (token: CodeToken) => codeInk(props.variant, token)

const tabName = computed(() => props.filename || (isPython.value ? 'main.py' : 'plan.txt'))
const gutterWidth = computed(() => `${String(lines.value.length).length + 1}ch`)
const isFocused = (index: number) => !props.focus?.length || props.focus.includes(index + 1)
const isLit = (index: number) => Boolean(props.focus?.length) && isFocused(index)
</script>

<template>
  <div
    class="code-panel rounded-2xl overflow-hidden"
    :style="{ background: 'var(--bg-off)', border: '2px solid var(--border)' }"
  >
    <!-- Tab bar -->
    <div v-if="chrome" class="code-tabbar flex items-stretch">
      <div class="code-tab flex items-center gap-2 px-4 py-2" :style="{ borderBottomColor: accent }">
        <span class="w-1.5 h-1.5 rounded-full" :style="{ background: accent }"></span>
        <span class="text-[11px] font-bold" style="color: var(--text);">{{ tabName }}</span>
      </div>
      <div class="ml-auto flex items-center px-4">
        <span class="text-[10px] font-bold uppercase tracking-widest" :style="{ color: accent }">
          {{ label || (isPython ? 'python' : 'pseudo-code') }}
        </span>
      </div>
    </div>

    <div
      class="py-4"
      :class="size === 'lg' ? 'text-base md:text-lg' : 'text-sm md:text-base'"
      style="font-family: var(--font-code);"
    >
      <div
        v-for="(line, index) in lines"
        :key="line.key"
        class="code-line flex items-start px-5"
        :class="{ 'code-line-dim': !isFocused(index), 'code-line-lit': isLit(index), 'code-line-reveal': reveal }"
        :style="{
          ...(reveal ? { animationDelay: `${Math.min(index, 8) * 0.06}s` } : {}),
          ...(isLit(index) ? { boxShadow: `inset 2px 0 0 ${accent}` } : {}),
        }"
      >
        <span
          v-if="gutter"
          class="code-gutter shrink-0 text-right select-none"
          :style="{ width: gutterWidth, opacity: isLit(index) ? 0.9 : 0.4 }"
        >{{ index + 1 }}</span>

        <span class="code-content flex-1 whitespace-pre-wrap">
          <span v-for="level in line.indent" :key="level" class="code-indent-guide"></span>
          <template v-for="(token, position) in line.tokens" :key="token.key">
            <span
              class="code-token"
              :class="{
                'code-token-comment': token.kind === 'comment',
                'code-token-linkable': linkable && token.link,
                'code-token-linked': linkable && link.isActive(token.link),
              }"
              :style="{ color: ink(token), fontWeight: token.kind === 'keyword' ? 700 : 400 }"
              @mouseenter="linkable && link.hover(token.link)"
              @mouseleave="linkable && link.unhover()"
              @click="linkable && token.link && link.toggle(token.link)"
            >{{ (needsSpaceBefore(line.tokens[position - 1], token) ? ' ' : '') + token.text }}</span>
          </template>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-tabbar {
  border-bottom: 1px solid var(--border);
}
.code-tab {
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.code-line {
  line-height: 1.9;
  transition: opacity 0.3s ease, background 0.3s ease;
}
.code-line-dim {
  opacity: 0.32;
}
.code-line-lit {
  background: rgba(0, 0, 0, 0.035);
}
.code-line-reveal {
  animation: fade-in 0.35s ease both;
}

.code-gutter {
  margin-right: 1.25rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  transition: opacity 0.3s ease;
}

/* One faint rule per indent level, the way an editor draws them. */
.code-indent-guide {
  display: inline-block;
  width: 1.5rem;
  border-left: 1px solid color-mix(in srgb, currentColor 14%, transparent);
  vertical-align: text-bottom;
  height: 1.9em;
  margin-bottom: -0.45em;
}
.code-content {
  color: var(--text);
}

.code-token {
  white-space: pre;
  border-radius: 2px;
  transition: background 0.15s ease, color 0.3s ease, outline-color 0.15s ease;
  outline: 1px solid transparent;
}
.code-token-comment {
  font-style: italic;
}
.code-token-linkable {
  cursor: pointer;
}
.code-token-linked {
  background: color-mix(in srgb, currentColor 16%, transparent);
  outline-color: color-mix(in srgb, currentColor 40%, transparent);
}
</style>
