<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-10 shrink-0 anim-fade-in-up">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Secondary & Accent Colors
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--rose);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        Supporting colors for highlights, decoration, and personality.
      </p>
    </header>

    <div class="flex-grow grid grid-cols-2 md:grid-cols-5 gap-4 anim-fade-in-up anim-delay-2">
      <!-- Rose -->
      <div class="rounded-2xl overflow-hidden flex flex-col" style="border: 2px solid var(--border);">
        <div class="h-28 flex items-end p-4" style="background: var(--rose);">
          <span class="text-white text-xl font-black">Rose</span>
        </div>
        <div class="p-4 flex flex-col gap-2" style="background: var(--bg);">
          <code class="text-[10px] font-bold" style="color: var(--text-muted);">#F78DA7</code>
          <p class="text-[10px] leading-relaxed" style="color: var(--text-dim);">
            <span class="font-bold" style="color: var(--text);">Highlight.</span>
            Warm decorative accent. Friendly, approachable. Use for callouts, hover states, and "fun" elements.
          </p>
        </div>
      </div>

      <!-- Sun -->
      <div class="rounded-2xl overflow-hidden flex flex-col" style="border: 2px solid var(--border);">
        <div class="h-28 flex items-end p-4" style="background: var(--sun);">
          <span class="text-xl font-black" style="color: var(--text);">Sun</span>
        </div>
        <div class="p-4 flex flex-col gap-2" style="background: var(--bg);">
          <code class="text-[10px] font-bold" style="color: var(--text-muted);">#FFEAA7</code>
          <p class="text-[10px] leading-relaxed" style="color: var(--text-dim);">
            <span class="font-bold" style="color: var(--text);">Attention.</span>
            Warnings, tips, "note" callouts. Text stays dark on this background.
          </p>
        </div>
      </div>

      <!-- Lavender -->
      <div class="rounded-2xl overflow-hidden flex flex-col" style="border: 2px solid var(--border);">
        <div class="h-28 flex items-end p-4" style="background: var(--lavender);">
          <span class="text-white text-xl font-black">Lavender</span>
        </div>
        <div class="p-4 flex flex-col gap-2" style="background: var(--bg);">
          <code class="text-[10px] font-bold" style="color: var(--text-muted);">#A29BFE</code>
          <p class="text-[10px] leading-relaxed" style="color: var(--text-dim);">
            <span class="font-bold" style="color: var(--text);">Special.</span>
            Decorative tags, "bonus" content, advanced topics, personality moments.
          </p>
        </div>
      </div>

      <!-- Peach -->
      <div class="rounded-2xl overflow-hidden flex flex-col" style="border: 2px solid var(--border);">
        <div class="h-28 flex items-end p-4" style="background: var(--peach);">
          <span class="text-white text-xl font-black">Peach</span>
        </div>
        <div class="p-4 flex flex-col gap-2" style="background: var(--bg);">
          <code class="text-[10px] font-bold" style="color: var(--text-muted);">#FAB1A0</code>
          <p class="text-[10px] leading-relaxed" style="color: var(--text-dim);">
            <span class="font-bold" style="color: var(--text);">Soft warmth.</span>
            Gentle backgrounds, illustration fills, "beginner-friendly" tone.
          </p>
        </div>
      </div>

      <!-- Sage -->
      <div class="rounded-2xl overflow-hidden flex flex-col" style="border: 2px solid var(--border);">
        <div class="h-28 flex items-end p-4" style="background: var(--sage);">
          <span class="text-xl font-black" style="color: var(--text);">Sage</span>
        </div>
        <div class="p-4 flex flex-col gap-2" style="background: var(--bg);">
          <code class="text-[10px] font-bold" style="color: var(--text-muted);">#B8E994</code>
          <p class="text-[10px] leading-relaxed" style="color: var(--text-dim);">
            <span class="font-bold" style="color: var(--text);">Nature.</span>
            Environmental cues, "try it" prompts, organic / growth metaphors.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
