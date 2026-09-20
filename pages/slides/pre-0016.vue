<template>
  <div class="guide-page w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-8 shrink-0">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Tags, Pills & Labels
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--mint);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        Small, bold, uppercase, fully rounded. Used to categorize and annotate.
      </p>
    </header>

    <div class="flex-grow flex flex-col gap-8 overflow-auto">
      <!-- Filled tags -->
      <div>
        <p class="text-[10px] font-bold uppercase tracking-widest mb-4" style="color: var(--text-muted);">Filled — strong presence, use sparingly</p>
        <div class="flex flex-wrap gap-2">
          <span class="tag tag-coral">beginner</span>
          <span class="tag tag-mint">exercise</span>
          <span class="tag tag-sky">concept</span>
          <span class="tag tag-rose">tip</span>
          <span class="tag tag-sun">warning</span>
          <span class="tag tag-lavender">bonus</span>
          <span class="tag tag-peach">example</span>
          <span class="tag tag-sage">practice</span>
        </div>
      </div>

      <!-- Outline tags -->
      <div>
        <p class="text-[10px] font-bold uppercase tracking-widest mb-4" style="color: var(--text-muted);">Outline — lighter, for metadata and secondary info</p>
        <div class="flex flex-wrap gap-2">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold" style="border: 2px solid var(--coral); color: var(--coral);">beginner</span>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold" style="border: 2px solid var(--mint); color: var(--mint);">exercise</span>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold" style="border: 2px solid var(--sky); color: var(--sky);">concept</span>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold" style="border: 2px solid var(--rose); color: var(--rose);">tip</span>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold" style="border: 2px solid var(--lavender); color: var(--lavender);">bonus</span>
        </div>
      </div>

      <!-- Semantic use cases -->
      <div>
        <p class="text-[10px] font-bold uppercase tracking-widest mb-4" style="color: var(--text-muted);">Semantic mapping — which tag for which purpose</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="rounded-xl p-4 flex flex-col gap-2" style="background: var(--bg-off);">
            <span class="tag tag-coral">topic</span>
            <span class="text-[10px]" style="color: var(--text-dim);">Python concept being taught</span>
          </div>
          <div class="rounded-xl p-4 flex flex-col gap-2" style="background: var(--bg-off);">
            <span class="tag tag-mint">try it</span>
            <span class="text-[10px]" style="color: var(--text-dim);">Interactive exercise</span>
          </div>
          <div class="rounded-xl p-4 flex flex-col gap-2" style="background: var(--bg-off);">
            <span class="tag tag-sun">note</span>
            <span class="text-[10px]" style="color: var(--text-dim);">Important caveat or tip</span>
          </div>
          <div class="rounded-xl p-4 flex flex-col gap-2" style="background: var(--bg-off);">
            <span class="tag tag-lavender">advanced</span>
            <span class="text-[10px]" style="color: var(--text-dim);">Beyond beginner scope</span>
          </div>
        </div>
      </div>

      <!-- Spec -->
      <div class="rounded-2xl p-5 text-xs leading-relaxed" style="background: var(--bg-off); color: var(--text-dim);">
        <span class="font-bold" style="color: var(--text);">Spec:</span>
        <code class="text-[10px]" style="color: var(--text-muted);"> padding: 0.25rem 0.75rem · border-radius: 9999px · font-size: 0.75rem · font-weight: 700 · letter-spacing: 0.05em · text-transform: uppercase</code>
      </div>
    </div>
  </div>
</template>
