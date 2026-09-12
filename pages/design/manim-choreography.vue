<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16 overflow-y-auto">
    <h2 class="text-3xl md:text-5xl font-black tracking-tight anim-fade-in-up" style="color: var(--text);">
      Animation Choreography
    </h2>
    <div class="w-16 h-1.5 rounded-full mt-3 mb-2 anim-fade-in-up anim-delay-1" style="background: var(--lavender);"></div>
    <p class="text-sm md:text-base font-medium mb-6 anim-fade-in-up anim-delay-1" style="color: var(--text-dim);">
      Individual animations are letters. Choreography is the sentence. This is where slides feel alive.
    </p>

    <div class="flex-grow flex flex-col gap-8">
      <div class="grid grid-cols-2 gap-8">
        <div class="anim-fade-in-up anim-delay-1">
          <p class="text-xs font-bold uppercase tracking-widest mb-3" style="color: var(--text-muted);">Stagger Demo — 80ms gaps</p>
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center gap-3">
              <span class="text-[10px] font-bold w-10 text-right tabular-nums" style="color: var(--text-muted);">0ms</span>
              <div class="h-5 rounded-r-full manim-stagger-bar" style="background: var(--coral); animation-delay: 0.80s;"></div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-[10px] font-bold w-10 text-right tabular-nums" style="color: var(--text-muted);">80ms</span>
              <div class="h-5 rounded-r-full manim-stagger-bar" style="background: var(--mint); animation-delay: 0.88s;"></div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-[10px] font-bold w-10 text-right tabular-nums" style="color: var(--text-muted);">160ms</span>
              <div class="h-5 rounded-r-full manim-stagger-bar" style="background: var(--sky); animation-delay: 0.96s;"></div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-[10px] font-bold w-10 text-right tabular-nums" style="color: var(--text-muted);">240ms</span>
              <div class="h-5 rounded-r-full manim-stagger-bar" style="background: var(--rose); animation-delay: 1.04s;"></div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-[10px] font-bold w-10 text-right tabular-nums" style="color: var(--text-muted);">320ms</span>
              <div class="h-5 rounded-r-full manim-stagger-bar" style="background: var(--sun); animation-delay: 1.12s;"></div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-[10px] font-bold w-10 text-right tabular-nums" style="color: var(--text-muted);">400ms</span>
              <div class="h-5 rounded-r-full manim-stagger-bar" style="background: var(--lavender); animation-delay: 1.20s;"></div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-[10px] font-bold w-10 text-right tabular-nums" style="color: var(--text-muted);">480ms</span>
              <div class="h-5 rounded-r-full manim-stagger-bar" style="background: var(--peach); animation-delay: 1.28s;"></div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-[10px] font-bold w-10 text-right tabular-nums" style="color: var(--text-muted);">560ms</span>
              <div class="h-5 rounded-r-full manim-stagger-bar" style="background: var(--sage); animation-delay: 1.36s;"></div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-6 anim-fade-in-up anim-delay-2">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color: var(--text-muted);">Sequence: A → B → C</p>
            <div class="flex items-center gap-2">
              <div class="flex-1 rounded-lg p-2 text-center manim-seq-a" style="background: var(--coral);">
                <span class="text-white text-xs font-black">A</span>
              </div>
              <span class="text-xs font-black" style="color: var(--text-muted);">→</span>
              <div class="flex-1 rounded-lg p-2 text-center manim-seq-b" style="background: var(--mint);">
                <span class="text-white text-xs font-black">B</span>
              </div>
              <span class="text-xs font-black" style="color: var(--text-muted);">→</span>
              <div class="flex-1 rounded-lg p-2 text-center manim-seq-c" style="background: var(--sky);">
                <span class="text-white text-xs font-black">C</span>
              </div>
            </div>
            <p class="text-[10px] mt-1.5" style="color: var(--text-dim);">Each waits for the previous. Use for cause→effect, build-up narratives.</p>
          </div>

          <div>
            <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color: var(--text-muted);">Parallel: A + B + C</p>
            <div class="flex items-center gap-2">
              <div class="flex-1 rounded-lg p-2 text-center manim-par-in" style="background: var(--rose);">
                <span class="text-white text-xs font-black">A</span>
              </div>
              <div class="flex-1 rounded-lg p-2 text-center manim-par-in" style="background: var(--sun);">
                <span class="text-xs font-black" style="color: var(--text);">B</span>
              </div>
              <div class="flex-1 rounded-lg p-2 text-center manim-par-in" style="background: var(--lavender);">
                <span class="text-white text-xs font-black">C</span>
              </div>
            </div>
            <p class="text-[10px] mt-1.5" style="color: var(--text-dim);">All at once. Use for peer elements of equal importance.</p>
          </div>
        </div>
      </div>

      <div class="anim-fade-in-up anim-delay-3">
        <p class="text-xs font-bold uppercase tracking-widest mb-3" style="color: var(--text-muted);">Real Example — Slide Entrance Timeline</p>
        <div class="rounded-2xl p-5" style="background: var(--bg-off); border: 2px solid var(--border);">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-3 manim-timeline-in" style="animation-delay: 0.80s;">
              <span class="text-[10px] font-bold w-12 text-right tabular-nums shrink-0" style="color: var(--text-muted);">0ms</span>
              <div class="h-8 flex-1 rounded-lg flex items-center px-3 gap-2" style="background: var(--coral);">
                <span class="text-white text-xs font-black">Header</span>
                <span class="text-[10px] font-bold ml-auto text-white/70">anim-fade-in-up</span>
              </div>
            </div>
            <div class="flex items-center gap-3 manim-timeline-in" style="animation-delay: 0.88s;">
              <span class="text-[10px] font-bold w-12 text-right tabular-nums shrink-0" style="color: var(--text-muted);">80ms</span>
              <div class="h-8 rounded-lg flex items-center px-3 gap-2" style="background: var(--mint); width: 30%;">
                <span class="text-white text-xs font-black">Accent bar</span>
              </div>
            </div>
            <div class="flex items-center gap-3 manim-timeline-in" style="animation-delay: 0.96s;">
              <span class="text-[10px] font-bold w-12 text-right tabular-nums shrink-0" style="color: var(--text-muted);">160ms</span>
              <div class="h-8 flex-1 rounded-lg flex items-center px-3 gap-2" style="background: var(--sky);">
                <span class="text-white text-xs font-black">Body text</span>
                <span class="text-[10px] font-bold ml-auto text-white/70">anim-fade-in-up</span>
              </div>
            </div>
            <div class="flex items-center gap-3 manim-timeline-in" style="animation-delay: 1.04s;">
              <span class="text-[10px] font-bold w-12 text-right tabular-nums shrink-0" style="color: var(--text-muted);">240ms</span>
              <div class="h-8 flex-1 rounded-lg flex items-center px-3 gap-2" style="background: var(--lavender);">
                <span class="text-white text-xs font-black">Code block</span>
                <span class="text-[10px] font-bold ml-auto text-white/70">anim-pop-in</span>
              </div>
            </div>
            <div class="flex items-center gap-3 manim-timeline-in" style="animation-delay: 1.12s;">
              <span class="text-[10px] font-bold w-12 text-right tabular-nums shrink-0" style="color: var(--text-muted);">320ms</span>
              <div class="h-8 rounded-lg flex items-center px-3 gap-2" style="background: var(--sun); width: 45%;">
                <span class="text-xs font-black" style="color: var(--text);">Tags</span>
                <span class="text-[10px] font-bold ml-auto" style="color: var(--text-dim);">anim-fade-in</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 pt-5 anim-fade-in anim-delay-5" style="border-top: 2px solid var(--border);">
      <p class="text-xs font-bold uppercase tracking-widest mb-3" style="color: var(--text-muted);">Choreography Rules</p>
      <div class="grid grid-cols-3 gap-x-6 gap-y-3">
        <div class="flex items-start gap-2">
          <div class="w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px] font-black text-white" style="background: var(--coral);">1</div>
          <p class="text-[11px] font-medium" style="color: var(--text-dim);"><strong style="color: var(--text);">Max 400ms</strong> for any single animation</p>
        </div>
        <div class="flex items-start gap-2">
          <div class="w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px] font-black text-white" style="background: var(--mint);">2</div>
          <p class="text-[11px] font-medium" style="color: var(--text-dim);"><strong style="color: var(--text);">80ms stagger</strong> between siblings</p>
        </div>
        <div class="flex items-start gap-2">
          <div class="w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px] font-black text-white" style="background: var(--sky);">3</div>
          <p class="text-[11px] font-medium" style="color: var(--text-dim);"><strong style="color: var(--text);">Max 6 elements</strong> animating at once</p>
        </div>
        <div class="flex items-start gap-2">
          <div class="w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px] font-black text-white" style="background: var(--rose);">4</div>
          <p class="text-[11px] font-medium" style="color: var(--text-dim);"><strong style="color: var(--text);">Headers first</strong> — always enter before content</p>
        </div>
        <div class="flex items-start gap-2">
          <div class="w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px] font-black text-white" style="background: var(--lavender);">5</div>
          <p class="text-[11px] font-medium" style="color: var(--text-dim);"><strong style="color: var(--text);">Code = pop-in</strong> — never fade-in-up for code blocks</p>
        </div>
        <div class="flex items-start gap-2">
          <div class="w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px] font-black text-white" style="background: var(--sun);">6</div>
          <p class="text-[11px] font-medium" style="color: var(--text-dim);"><strong style="color: var(--text);">Enter + exit</strong> — every animation needs both states</p>
        </div>
      </div>
    </div>
  </div>
</template>
