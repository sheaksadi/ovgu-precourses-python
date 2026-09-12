<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-8 shrink-0">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Buttons & Interactions
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--coral);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        Flat, chunky, no shadows. Borders are thick (2px). Corners are rounded-lg.
      </p>
    </header>

    <div class="flex-grow flex flex-col gap-8 overflow-auto">
      <!-- Primary buttons -->
      <div>
        <p class="text-[10px] font-bold uppercase tracking-widest mb-4" style="color: var(--text-muted);">Primary — filled pastel, white text, bold</p>
        <div class="flex flex-wrap gap-3">
          <button class="px-6 py-3 rounded-lg text-sm font-bold text-white cursor-pointer" style="background: var(--coral);">Run Code</button>
          <button class="px-6 py-3 rounded-lg text-sm font-bold text-white cursor-pointer" style="background: var(--mint);">Next Step</button>
          <button class="px-6 py-3 rounded-lg text-sm font-bold text-white cursor-pointer" style="background: var(--sky);">Learn More</button>
          <button class="px-6 py-3 rounded-lg text-sm font-bold text-white cursor-pointer" style="background: var(--rose);">Try It</button>
        </div>
      </div>

      <!-- Secondary buttons -->
      <div>
        <p class="text-[10px] font-bold uppercase tracking-widest mb-4" style="color: var(--text-muted);">Secondary — outline, 2px border, pastel text</p>
        <div class="flex flex-wrap gap-3">
          <button class="px-6 py-3 rounded-lg text-sm font-bold cursor-pointer bg-transparent" style="border: 2px solid var(--coral); color: var(--coral);">Run Code</button>
          <button class="px-6 py-3 rounded-lg text-sm font-bold cursor-pointer bg-transparent" style="border: 2px solid var(--mint); color: var(--mint);">Next Step</button>
          <button class="px-6 py-3 rounded-lg text-sm font-bold cursor-pointer bg-transparent" style="border: 2px solid var(--sky); color: var(--sky);">Learn More</button>
          <button class="px-6 py-3 rounded-lg text-sm font-bold cursor-pointer bg-transparent" style="border: 2px solid var(--rose); color: var(--rose);">Try It</button>
        </div>
      </div>

      <!-- Ghost buttons -->
      <div>
        <p class="text-[10px] font-bold uppercase tracking-widest mb-4" style="color: var(--text-muted);">Ghost — off-white bg, grey border, subtle</p>
        <div class="flex flex-wrap gap-3">
          <button class="px-6 py-3 rounded-lg text-sm font-bold cursor-pointer" style="background: var(--bg-off); border: 2px solid var(--border); color: var(--text-dim);">Skip</button>
          <button class="px-6 py-3 rounded-lg text-sm font-bold cursor-pointer" style="background: var(--bg-off); border: 2px solid var(--border); color: var(--text-dim);">Back</button>
          <button class="px-6 py-3 rounded-lg text-sm font-bold cursor-pointer" style="background: var(--bg-off); border: 2px solid var(--border); color: var(--text-dim);">Cancel</button>
        </div>
      </div>

      <!-- Keyboard hints -->
      <div>
        <p class="text-[10px] font-bold uppercase tracking-widest mb-4" style="color: var(--text-muted);">Keyboard hints — used in instructional copy</p>
        <div class="flex flex-wrap items-center gap-2 text-sm" style="color: var(--text-dim);">
          Press
          <kbd class="px-2.5 py-1 rounded-md text-xs font-bold" style="background: var(--bg-off); border: 2px solid var(--border); color: var(--text);">Space</kbd>
          or
          <kbd class="px-2.5 py-1 rounded-md text-xs font-bold" style="background: var(--bg-off); border: 2px solid var(--border); color: var(--text);">Enter</kbd>
          to continue ·
          <kbd class="px-2.5 py-1 rounded-md text-xs font-bold" style="background: var(--bg-off); border: 2px solid var(--border); color: var(--text);">Esc</kbd>
          to exit
        </div>
      </div>

      <!-- Rules -->
      <div class="rounded-2xl p-5 text-xs leading-relaxed" style="background: var(--bg-off); color: var(--text-dim);">
        <span class="font-bold" style="color: var(--text);">Rules:</span>
        No box-shadows. No gradients. Borders are always 2px. Border-radius is rounded-lg (0.5rem) for buttons, rounded-2xl (1rem) for cards. Hover = slight opacity change only. Active = scale(0.97).
      </div>
    </div>
  </div>
</template>
