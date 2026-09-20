<template>
  <div class="guide-page w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-10 shrink-0">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Backgrounds & Surfaces
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--sky);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        Three surface tiers and when to use each one.
      </p>
    </header>

    <div class="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Pure White -->
      <div class="rounded-2xl p-6 flex flex-col gap-4" style="background: var(--bg); border: 2px solid var(--border);">
        <div class="w-full h-24 rounded-xl flex items-center justify-center" style="background: #FFFFFF; border: 2px dashed var(--border);">
          <span class="text-xs font-bold" style="color: var(--text-muted);">Primary Surface</span>
        </div>
        <div>
          <h3 class="text-lg font-black" style="color: var(--text);">White #FFFFFF</h3>
          <code class="text-[10px] font-bold" style="color: var(--text-muted);">--bg · bg-surface</code>
        </div>
        <p class="text-xs leading-relaxed" style="color: var(--text-dim);">
          Default slide background. Every content slide sits on pure white.
          Maximum contrast with ink text. Clean, open, breathable.
        </p>
        <div class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--coral);">
          Use for: all content slides
        </div>
      </div>

      <!-- Off-white -->
      <div class="rounded-2xl p-6 flex flex-col gap-4" style="background: var(--bg); border: 2px solid var(--border);">
        <div class="w-full h-24 rounded-xl flex items-center justify-center" style="background: var(--bg-off); border: 2px dashed var(--border);">
          <span class="text-xs font-bold" style="color: var(--text-muted);">Inset Surface</span>
        </div>
        <div>
          <h3 class="text-lg font-black" style="color: var(--text);">Off-white #F5F5F0</h3>
          <code class="text-[10px] font-bold" style="color: var(--text-muted);">--bg-off · bg-surface-off</code>
        </div>
        <p class="text-xs leading-relaxed" style="color: var(--text-dim);">
          Cards, inset panels, code block surrounds, keyboard hints.
          Creates depth without shadow. Warm neutral tone.
        </p>
        <div class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--sky);">
          Use for: cards, kbd, inset areas
        </div>
      </div>

      <!-- Warm tint -->
      <div class="rounded-2xl p-6 flex flex-col gap-4" style="background: var(--bg); border: 2px solid var(--border);">
        <div class="w-full h-24 rounded-xl flex items-center justify-center" style="background: var(--bg-warm); border: 2px dashed var(--border);">
          <span class="text-xs font-bold" style="color: var(--text-muted);">Warm Surface</span>
        </div>
        <div>
          <h3 class="text-lg font-black" style="color: var(--text);">Warm #FFF8F3</h3>
          <code class="text-[10px] font-bold" style="color: var(--text-muted);">--bg-warm · bg-surface-warm</code>
        </div>
        <p class="text-xs leading-relaxed" style="color: var(--text-dim);">
          Title cards, section intro backgrounds, "welcome" slides.
          A touch of warmth signals a softer, transitional moment.
        </p>
        <div class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--rose);">
          Use for: title slides, section intros
        </div>
      </div>
    </div>

    <!-- Dark exception -->
    <div class="mt-6 rounded-2xl p-5 flex items-center gap-6" style="background: var(--code-bg); border: 2px solid var(--code-border);">
      <div class="shrink-0">
        <code class="text-xs font-bold" style="color: var(--mint);">#1E1E2E</code>
      </div>
      <p class="text-xs" style="color: var(--code-text);">
        <span class="font-bold">Code surface.</span> The only dark background in the system. Used exclusively for code blocks.
        Text uses <code style="color: var(--mint);">--code-text #CDD6F4</code>.
      </p>
    </div>
  </div>
</template>
