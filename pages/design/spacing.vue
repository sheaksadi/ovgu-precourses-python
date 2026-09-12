<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-8 shrink-0 anim-fade-in-up">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Spacing & Layout
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--sage);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        Generous whitespace. Content breathes. Nothing feels cramped.
      </p>
    </header>

    <div class="flex-grow flex flex-col gap-6 overflow-auto anim-fade-in-up anim-delay-2">
      <!-- Page margins -->
      <div>
        <p class="text-[10px] font-bold uppercase tracking-widest mb-3" style="color: var(--text-muted);">Page Margins</p>
        <div class="rounded-2xl p-1 relative" style="border: 2px dashed var(--coral);">
          <div class="rounded-xl p-6 relative" style="background: var(--bg-off);">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-[9px] font-bold" style="background: var(--bg); color: var(--coral);">py-10 / md:py-16</div>
            <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 px-2 text-[9px] font-bold" style="background: var(--bg); color: var(--coral);">px-8 / md:px-24</div>
            <div class="h-16 flex items-center justify-center">
              <span class="text-xs font-bold" style="color: var(--text-dim);">Content area</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Spacing scale -->
      <div>
        <p class="text-[10px] font-bold uppercase tracking-widest mb-3" style="color: var(--text-muted);">Spacing Scale</p>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-4">
            <div class="w-2 h-4 rounded-sm" style="background: var(--sky);"></div>
            <code class="text-[10px] w-12" style="color: var(--text-muted);">4px</code>
            <span class="text-[10px]" style="color: var(--text-dim);">Inline spacing, icon gaps</span>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-4 h-4 rounded-sm" style="background: var(--sky);"></div>
            <code class="text-[10px] w-12" style="color: var(--text-muted);">8px</code>
            <span class="text-[10px]" style="color: var(--text-dim);">Tag padding, tight groups</span>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-6 h-4 rounded-sm" style="background: var(--sky);"></div>
            <code class="text-[10px] w-12" style="color: var(--text-muted);">16px</code>
            <span class="text-[10px]" style="color: var(--text-dim);">Card padding, button padding</span>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-8 h-4 rounded-sm" style="background: var(--sky);"></div>
            <code class="text-[10px] w-12" style="color: var(--text-muted);">24px</code>
            <span class="text-[10px]" style="color: var(--text-dim);">Section gaps, grid gutters</span>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-12 h-4 rounded-sm" style="background: var(--coral);"></div>
            <code class="text-[10px] w-12" style="color: var(--text-muted);">48px</code>
            <span class="text-[10px]" style="color: var(--text-dim);">Header-to-content gap</span>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-16 h-4 rounded-sm" style="background: var(--coral);"></div>
            <code class="text-[10px] w-12" style="color: var(--text-muted);">96px</code>
            <span class="text-[10px]" style="color: var(--text-dim);">Page horizontal margin (desktop)</span>
          </div>
        </div>
      </div>

      <!-- Border radius -->
      <div>
        <p class="text-[10px] font-bold uppercase tracking-widest mb-3" style="color: var(--text-muted);">Border Radius</p>
        <div class="flex gap-4 items-end">
          <div class="flex flex-col items-center gap-2">
            <div class="w-12 h-12 rounded" style="background: var(--bg-off); border: 2px solid var(--border);"></div>
            <code class="text-[9px]" style="color: var(--text-muted);">rounded</code>
            <span class="text-[9px]" style="color: var(--text-dim);">Badges</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <div class="w-12 h-12 rounded-lg" style="background: var(--bg-off); border: 2px solid var(--border);"></div>
            <code class="text-[9px]" style="color: var(--text-muted);">rounded-lg</code>
            <span class="text-[9px]" style="color: var(--text-dim);">Buttons</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <div class="w-12 h-12 rounded-xl" style="background: var(--bg-off); border: 2px solid var(--border);"></div>
            <code class="text-[9px]" style="color: var(--text-muted);">rounded-xl</code>
            <span class="text-[9px]" style="color: var(--text-dim);">Small cards</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <div class="w-12 h-12 rounded-2xl" style="background: var(--bg-off); border: 2px solid var(--border);"></div>
            <code class="text-[9px]" style="color: var(--text-muted);">rounded-2xl</code>
            <span class="text-[9px]" style="color: var(--text-dim);">Cards, code</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <div class="w-12 h-12 rounded-full" style="background: var(--bg-off); border: 2px solid var(--border);"></div>
            <code class="text-[9px]" style="color: var(--text-muted);">rounded-full</code>
            <span class="text-[9px]" style="color: var(--text-dim);">Tags, pills</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
