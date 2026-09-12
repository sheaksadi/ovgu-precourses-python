<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-8 shrink-0 anim-fade-in-up">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Animation & Motion
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--peach);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        Fast, subtle, purposeful. Never decorative.
      </p>
    </header>

    <div class="flex-grow flex flex-col gap-6 overflow-auto anim-fade-in-up anim-delay-2">
      <!-- Easing -->
      <div class="rounded-2xl p-5" style="background: var(--bg-off);">
        <p class="text-[10px] font-bold uppercase tracking-widest mb-3" style="color: var(--text-muted);">Easing curve</p>
        <div class="flex items-center gap-4">
          <code class="text-xs font-bold" style="color: var(--lavender);">cubic-bezier(0.22, 1, 0.36, 1)</code>
          <span class="text-xs" style="color: var(--text-dim);">— quick start, gentle settle. Used for all entry animations.</span>
        </div>
      </div>

      <!-- Available animations -->
      <div>
        <p class="text-[10px] font-bold uppercase tracking-widest mb-3" style="color: var(--text-muted);">Entry animations — each element picks one</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="rounded-xl p-4 flex flex-col items-center gap-3" style="border: 2px solid var(--border);">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center anim-fade-in-up" style="background: var(--coral);">
              <span class="text-white text-lg font-black">↑</span>
            </div>
            <code class="text-[9px] font-bold" style="color: var(--text-muted);">anim-fade-in-up</code>
            <span class="text-[9px] text-center" style="color: var(--text-dim);">Default. Titles, headers, content blocks.</span>
          </div>

          <div class="rounded-xl p-4 flex flex-col items-center gap-3" style="border: 2px solid var(--border);">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center anim-pop-in" style="background: var(--mint);">
              <span class="text-white text-lg font-black">⊡</span>
            </div>
            <code class="text-[9px] font-bold" style="color: var(--text-muted);">anim-pop-in</code>
            <span class="text-[9px] text-center" style="color: var(--text-dim);">Scale from 90%. Code blocks, cards.</span>
          </div>

          <div class="rounded-xl p-4 flex flex-col items-center gap-3" style="border: 2px solid var(--border);">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center anim-slide-left" style="background: var(--sky);">
              <span class="text-white text-lg font-black">←</span>
            </div>
            <code class="text-[9px] font-bold" style="color: var(--text-muted);">anim-slide-left</code>
            <span class="text-[9px] text-center" style="color: var(--text-dim);">Left column in split slides.</span>
          </div>

          <div class="rounded-xl p-4 flex flex-col items-center gap-3" style="border: 2px solid var(--border);">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center anim-slide-right" style="background: var(--rose);">
              <span class="text-white text-lg font-black">→</span>
            </div>
            <code class="text-[9px] font-bold" style="color: var(--text-muted);">anim-slide-right</code>
            <span class="text-[9px] text-center" style="color: var(--text-dim);">Right column in split slides.</span>
          </div>
        </div>
      </div>

      <!-- Stagger delays -->
      <div>
        <p class="text-[10px] font-bold uppercase tracking-widest mb-3" style="color: var(--text-muted);">Stagger delays — cascade content entrance</p>
        <div class="flex gap-2 items-end">
          <div v-for="i in 6" :key="i" class="flex flex-col items-center gap-1">
            <div
              class="w-8 rounded-lg anim-fade-in-up"
              :class="`anim-delay-${i}`"
              :style="{ height: `${20 + i * 8}px`, background: `var(--${['coral','mint','sky','rose','lavender','peach'][i-1]})` }"
            ></div>
            <code class="text-[8px]" style="color: var(--text-muted);">{{ (i * 80) }}ms</code>
          </div>
          <span class="text-[10px] ml-3" style="color: var(--text-dim);">80ms between each element</span>
        </div>
      </div>

      <!-- Page transitions -->
      <div class="grid grid-cols-3 gap-3">
        <div class="rounded-xl p-3 text-center" style="background: var(--bg-off);">
          <code class="text-[10px] font-bold" style="color: var(--coral);">fade</code>
          <p class="text-[9px] mt-1" style="color: var(--text-dim);">Opacity 350ms. Title and section slides.</p>
        </div>
        <div class="rounded-xl p-3 text-center" style="background: var(--bg-off);">
          <code class="text-[10px] font-bold" style="color: var(--sky);">slide</code>
          <p class="text-[9px] mt-1" style="color: var(--text-dim);">Translate 40px + opacity. Sequential content.</p>
        </div>
        <div class="rounded-xl p-3 text-center" style="background: var(--bg-off);">
          <code class="text-[10px] font-bold" style="color: var(--mint);">zoom</code>
          <p class="text-[9px] mt-1" style="color: var(--text-dim);">Scale 96% + opacity. Dramatic reveals.</p>
        </div>
      </div>

      <!-- Golden rule -->
      <div class="rounded-2xl p-5 text-xs leading-relaxed" style="background: var(--bg-off); color: var(--text-dim);">
        <span class="font-bold" style="color: var(--text);">Golden rule:</span>
        All motion respects <code class="text-[10px]" style="color: var(--lavender);">prefers-reduced-motion</code>. When the viewer opts out, every animation and transition drops to 0ms. No exceptions.
      </div>
    </div>
  </div>
</template>
