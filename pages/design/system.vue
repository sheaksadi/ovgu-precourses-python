<template>
  <div class="w-full h-full flex flex-col items-center justify-center p-16 text-center">
    <div class="max-w-3xl flex flex-col items-center gap-6">
      <!-- Python colored bar -->
      <div class="flex gap-1 anim-fade-in">
        <div class="w-8 h-2 rounded-full" style="background: var(--coral);"></div>
        <div class="w-8 h-2 rounded-full" style="background: var(--mint);"></div>
        <div class="w-8 h-2 rounded-full" style="background: var(--sky);"></div>
        <div class="w-8 h-2 rounded-full" style="background: var(--rose);"></div>
        <div class="w-8 h-2 rounded-full" style="background: var(--lavender);"></div>
      </div>

      <h1 class="text-5xl md:text-8xl font-black tracking-tight anim-fade-in-up" style="color: var(--text);">
        Design System
      </h1>

      <p class="text-lg md:text-xl font-medium anim-fade-in-up anim-delay-2" style="color: var(--text-dim);">
        Python for Beginners — Style Guide
      </p>

      <div class="mt-8 flex flex-col gap-2 text-xs font-bold uppercase tracking-widest anim-fade-in anim-delay-4" style="color: var(--text-muted);">
        <span>JetBrains Mono · White backgrounds · Bold pastels</span>
        <span>Minimal · Flat · Graphic</span>
      </div>
    </div>
  </div>
</template>
