<template>
  <div class="guide-page w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-10 shrink-0">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Primary Colors
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--coral);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        The three core colors. Each has a clear semantic role.
      </p>
    </header>

    <div class="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Coral -->
      <div class="rounded-2xl overflow-hidden flex flex-col" style="border: 2px solid var(--border);">
        <div class="h-36 flex items-end p-5" style="background: var(--coral);">
          <span class="text-white text-3xl font-black">Coral</span>
        </div>
        <div class="p-5 flex flex-col gap-3" style="background: var(--bg);">
          <code class="text-xs font-bold" style="color: var(--text-muted);">#FF6B6B</code>
          <p class="text-xs leading-relaxed" style="color: var(--text-dim);">
            <span class="font-bold" style="color: var(--text);">Primary action.</span>
            Progress bars, active buttons, destructive states, error highlights,
            list markers. The "look here" color.
          </p>
          <div class="flex gap-2 mt-1">
            <span class="tag tag-coral">action</span>
            <span class="tag tag-coral">emphasis</span>
          </div>
        </div>
      </div>

      <!-- Mint -->
      <div class="rounded-2xl overflow-hidden flex flex-col" style="border: 2px solid var(--border);">
        <div class="h-36 flex items-end p-5" style="background: var(--mint);">
          <span class="text-white text-3xl font-black">Mint</span>
        </div>
        <div class="p-5 flex flex-col gap-3" style="background: var(--bg);">
          <code class="text-xs font-bold" style="color: var(--text-muted);">#4ECDC4</code>
          <p class="text-xs leading-relaxed" style="color: var(--text-dim);">
            <span class="font-bold" style="color: var(--text);">Success & code.</span>
            Code block accents, success confirmations, "correct" states,
            positive feedback. The trustworthy color.
          </p>
          <div class="flex gap-2 mt-1">
            <span class="tag tag-mint">success</span>
            <span class="tag tag-mint">code</span>
          </div>
        </div>
      </div>

      <!-- Sky -->
      <div class="rounded-2xl overflow-hidden flex flex-col" style="border: 2px solid var(--border);">
        <div class="h-36 flex items-end p-5" style="background: var(--sky);">
          <span class="text-white text-3xl font-black">Sky</span>
        </div>
        <div class="p-5 flex flex-col gap-3" style="background: var(--bg);">
          <code class="text-xs font-bold" style="color: var(--text-muted);">#74B9FF</code>
          <p class="text-xs leading-relaxed" style="color: var(--text-dim);">
            <span class="font-bold" style="color: var(--text);">Info & links.</span>
            Informational callouts, hyperlinks, secondary actions,
            split-slide dividers. The calm, guiding color.
          </p>
          <div class="flex gap-2 mt-1">
            <span class="tag tag-sky">info</span>
            <span class="tag tag-sky">links</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
