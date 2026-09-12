<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16 overflow-y-auto">
    <h2 class="text-3xl md:text-5xl font-black tracking-tight anim-fade-in-up" style="color: var(--text);">
      Manim Emphasis
    </h2>
    <div class="w-16 h-1.5 rounded-full mt-3 mb-2 anim-fade-in-up anim-delay-1" style="background: var(--mint);"></div>
    <p class="text-sm md:text-base font-medium mb-8 anim-fade-in-up anim-delay-1" style="color: var(--text-dim);">
      Draw attention to elements already on screen. Emphasis never changes content — it highlights it.
    </p>

    <div class="flex-grow flex flex-col gap-8">
      <div class="grid grid-cols-3 gap-6">
        <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-1">
          <div class="rounded-2xl p-6 flex items-center justify-center min-h-[110px] manim-indicate" style="background: var(--bg-off); border: 2px solid var(--border);">
            <span class="text-lg font-black" style="color: var(--coral);">Indicate</span>
          </div>
          <div>
            <p class="text-sm font-bold" style="color: var(--text);">Indicate</p>
            <p class="text-xs mt-0.5" style="color: var(--text-dim);">Subtle scale pulse 1 → 1.08 → 1 with a border color flash. Use for "look here" moments without disruption.</p>
            <div class="flex gap-2 mt-1.5">
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" style="background: var(--bg-off); color: var(--text-muted);">2s cycle</span>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" style="background: var(--bg-off); color: var(--text-muted);">manim-indicate</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-2">
          <div class="rounded-2xl p-6 flex items-center justify-center min-h-[110px] manim-wiggle" style="background: var(--bg-off); border: 2px solid var(--border);">
            <span class="text-lg font-black" style="color: var(--mint);">Wiggle</span>
          </div>
          <div>
            <p class="text-sm font-bold" style="color: var(--text);">Wiggle</p>
            <p class="text-xs mt-0.5" style="color: var(--text-dim);">Slight rotation oscillation ±3°. Playful — use for warnings, errors, or interactive prompts.</p>
            <div class="flex gap-2 mt-1.5">
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" style="background: var(--bg-off); color: var(--text-muted);">1.5s cycle</span>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" style="background: var(--bg-off); color: var(--text-muted);">manim-wiggle</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-2">
          <div class="rounded-2xl p-6 flex items-center justify-center min-h-[110px] relative" style="background: var(--bg-off);">
            <span class="text-lg font-black" style="color: var(--sky);">Circumscribe</span>
            <div class="absolute inset-0 rounded-2xl pointer-events-none manim-circumscribe"></div>
          </div>
          <div>
            <p class="text-sm font-bold" style="color: var(--text);">Circumscribe</p>
            <p class="text-xs mt-0.5" style="color: var(--text-dim);">A colored border traces around the element. Use for definitions, key terms, or "remember this."</p>
            <div class="flex gap-2 mt-1.5">
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" style="background: var(--bg-off); color: var(--text-muted);">3s cycle</span>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" style="background: var(--bg-off); color: var(--text-muted);">manim-circumscribe</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-3">
          <div class="rounded-2xl p-6 flex items-center justify-center min-h-[110px] manim-flash" style="border: 2px solid var(--border);">
            <span class="text-lg font-black" style="color: var(--rose);">Flash</span>
          </div>
          <div>
            <p class="text-sm font-bold" style="color: var(--text);">Flash</p>
            <p class="text-xs mt-0.5" style="color: var(--text-dim);">Momentary background color pulse — the element briefly glows its accent color then returns. Use for success states, new items, or "just changed."</p>
            <div class="flex gap-2 mt-1.5">
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" style="background: var(--bg-off); color: var(--text-muted);">2.5s cycle</span>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" style="background: var(--bg-off); color: var(--text-muted);">manim-flash</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-3">
          <div class="rounded-2xl p-6 flex items-center justify-center min-h-[110px] relative manim-focus-ring" style="background: var(--bg-off); border: 2px solid var(--border);">
            <div class="absolute inset-0 rounded-2xl pointer-events-none manim-focus-dim"></div>
            <span class="text-lg font-black relative z-10 manim-focus-bright" style="color: var(--lavender);">FocusOn</span>
          </div>
          <div>
            <p class="text-sm font-bold" style="color: var(--text);">FocusOn</p>
            <p class="text-xs mt-0.5" style="color: var(--text-dim);">Everything else dims; the focused element brightens and slightly scales. Use for step-by-step walkthroughs where one item leads.</p>
            <div class="flex gap-2 mt-1.5">
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" style="background: var(--bg-off); color: var(--text-muted);">3s cycle</span>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" style="background: var(--bg-off); color: var(--text-muted);">manim-focus-ring</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 pt-5 anim-fade-in anim-delay-5" style="border-top: 2px solid var(--border);">
      <p class="text-xs font-bold uppercase tracking-widest mb-3" style="color: var(--text-muted);">Timing Specs</p>
      <div class="grid grid-cols-5 gap-4">
        <div class="text-center">
          <div class="text-base font-black" style="color: var(--coral);">200ms</div>
          <div class="text-[10px] font-bold mt-0.5" style="color: var(--text-muted);">Indicate pulse</div>
        </div>
        <div class="text-center">
          <div class="text-base font-black" style="color: var(--mint);">300ms</div>
          <div class="text-[10px] font-bold mt-0.5" style="color: var(--text-muted);">Wiggle cycle</div>
        </div>
        <div class="text-center">
          <div class="text-base font-black" style="color: var(--sky);">800ms</div>
          <div class="text-[10px] font-bold mt-0.5" style="color: var(--text-muted);">Border trace</div>
        </div>
        <div class="text-center">
          <div class="text-base font-black" style="color: var(--rose);">150ms</div>
          <div class="text-[10px] font-bold mt-0.5" style="color: var(--text-muted);">Flash pulse</div>
        </div>
        <div class="text-center">
          <div class="text-base font-black" style="color: var(--lavender);">400ms</div>
          <div class="text-[10px] font-bold mt-0.5" style="color: var(--text-muted);">Focus transition</div>
        </div>
      </div>
    </div>
  </div>
</template>
