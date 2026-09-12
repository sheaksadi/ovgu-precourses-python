<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string
  code: string
  language?: string
}>()

const copied = ref(false)

const copyCode = () => {
  navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-6 shrink-0 flex justify-between items-center">
      <div>
        <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
          {{ title }}
        </h2>
        <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--mint);"></div>
      </div>
      <button
        @click="copyCode"
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
        :style="{
          background: copied ? 'var(--mint)' : 'var(--bg-off)',
          color: copied ? '#fff' : 'var(--text-dim)',
          border: '2px solid ' + (copied ? 'var(--mint)' : 'var(--border)'),
        }"
      >
        <Icon v-if="copied" name="lucide:check" />
        <Icon v-else name="lucide:copy" />
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </header>

    <div class="flex-grow overflow-hidden rounded-2xl flex flex-col" style="background: var(--code-bg); border: 2px solid var(--code-border);">
      <!-- Top bar -->
      <div class="px-5 py-3 text-[11px] font-bold uppercase tracking-widest flex justify-between items-center" style="color: var(--text-muted); border-bottom: 1px solid var(--code-border);">
        <div class="flex gap-2">
          <div class="w-3 h-3 rounded-full" style="background: #FF6B6B;"></div>
          <div class="w-3 h-3 rounded-full" style="background: #FFEAA7;"></div>
          <div class="w-3 h-3 rounded-full" style="background: #4ECDC4;"></div>
        </div>
        <span style="color: var(--mint);">{{ language || 'python' }}</span>
      </div>
      <pre class="p-6 overflow-auto flex-grow text-sm md:text-base leading-relaxed" style="color: var(--code-text);"><code v-text="code"></code></pre>
    </div>
  </div>
</template>
