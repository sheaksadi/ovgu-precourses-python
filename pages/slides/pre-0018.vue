<template>
  <div class="guide-page w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-8 shrink-0">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Page Chrome & Navigation
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--sky);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        The persistent elements that frame every slide.
      </p>
    </header>

    <div class="flex-grow flex flex-col gap-6 overflow-auto">
      <!-- Mini slide mockup -->
      <div class="rounded-2xl overflow-hidden relative" style="border: 2px solid var(--border); height: 280px;">
        <!-- Mock deck title -->
        <div class="absolute top-3 left-4 text-[9px] font-bold uppercase tracking-widest" style="color: var(--text-muted);">
          Python for Beginners
        </div>

        <!-- Mock content center -->
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-xl font-black" style="color: var(--text);">Slide Content Area</span>
        </div>

        <!-- Mock progress bar -->
        <div class="absolute bottom-0 left-0 w-full h-[3px]" style="background: var(--border);">
          <div class="h-full w-[40%]" style="background: var(--coral);"></div>
        </div>

        <!-- Mock page number -->
        <div class="absolute bottom-3 right-4 text-[9px] font-bold" style="color: var(--text-muted);">
          3/12
        </div>

        <!-- Annotations -->
        <div class="absolute top-3 right-4 flex flex-col items-end gap-1">
          <div class="flex items-center gap-2">
            <span class="text-[8px] font-bold px-2 py-0.5 rounded-full" style="background: var(--sky); color: white;">Sync Pill area</span>
          </div>
        </div>
      </div>

      <!-- Breakdown grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="rounded-xl p-4 flex flex-col gap-2" style="background: var(--bg-off);">
          <span class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--coral);">Progress Bar</span>
          <span class="text-[10px]" style="color: var(--text-dim);">
            3px height · coral fill on grey track · transitions 500ms ease · sticks to bottom edge
          </span>
        </div>

        <div class="rounded-xl p-4 flex flex-col gap-2" style="background: var(--bg-off);">
          <span class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--sky);">Page Number</span>
          <span class="text-[10px]" style="color: var(--text-dim);">
            Bottom-right · 11px · font-bold · format: "3/12" no spaces · color: text-muted
          </span>
        </div>

        <div class="rounded-xl p-4 flex flex-col gap-2" style="background: var(--bg-off);">
          <span class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--lavender);">Deck Title</span>
          <span class="text-[10px]" style="color: var(--text-dim);">
            Top-left · 11px · font-bold · uppercase · tracking-widest · color: text-muted
          </span>
        </div>

        <div class="rounded-xl p-4 flex flex-col gap-2" style="background: var(--bg-off);">
          <span class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--mint);">Section Bar</span>
          <span class="text-[10px]" style="color: var(--text-dim);">
            Section layout only · 8px tall · full-width · coral fill · top edge
          </span>
        </div>
      </div>

      <!-- Navigation rules -->
      <div class="rounded-2xl p-5 text-xs leading-relaxed" style="background: var(--bg-off); color: var(--text-dim);">
        <span class="font-bold" style="color: var(--text);">Navigation:</span>
        Arrow keys / Space advance. Page numbers show "main.sub" for sub-slides (e.g. 2.1). Chrome never competes with content — uses text-muted color and minimal weight. All chrome is pointer-events-none.
      </div>
    </div>
  </div>
</template>
