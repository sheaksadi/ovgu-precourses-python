<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16 overflow-y-auto">
    <h2 class="text-3xl md:text-5xl font-black tracking-tight anim-fade-in-up" style="color: var(--text);">
      Manim Transforms
    </h2>
    <div class="w-16 h-1.5 rounded-full mt-3 mb-2 anim-fade-in-up anim-delay-1" style="background: var(--sky);"></div>
    <p class="text-sm md:text-base font-medium mb-8 anim-fade-in-up anim-delay-1" style="color: var(--text-dim);">
      Transforms change what's already visible. The audience sees continuity, not replacement.
    </p>

    <div class="flex-grow grid grid-cols-2 gap-8">
      <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-1">
        <p class="text-sm font-bold" style="color: var(--text);">ReplacementTransform</p>
        <div class="rounded-2xl p-6 flex items-center justify-center min-h-[130px] relative" style="background: var(--bg-off); border: 2px solid var(--border);">
          <span class="absolute text-2xl font-black manim-crossfade-out" style="color: var(--coral);">Before</span>
          <span class="absolute text-2xl font-black manim-crossfade-in" style="color: var(--mint);">After</span>
        </div>
        <p class="text-xs" style="color: var(--text-dim);">One element fades and morphs into another. Use when replacing content in the same location — old values becoming new ones, step progressions.</p>
        <code class="text-[10px] font-bold px-1.5 py-0.5 rounded w-fit" style="background: var(--bg-off); color: var(--text-muted);">manim-crossfade-out / manim-crossfade-in</code>
      </div>

      <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-2">
        <p class="text-sm font-bold" style="color: var(--text);">Transform</p>
        <div class="rounded-2xl p-6 flex items-center justify-center min-h-[130px]" style="background: var(--bg-off); border: 2px solid var(--border);">
          <div class="w-16 h-16 rounded-xl flex items-center justify-center text-white text-sm font-black manim-prop-transform">A</div>
        </div>
        <p class="text-xs" style="color: var(--text-dim);">Same element smoothly changes properties: color, size, border-radius, position. The identity persists. Use for state changes — selected/unselected, enabled/disabled.</p>
        <code class="text-[10px] font-bold px-1.5 py-0.5 rounded w-fit" style="background: var(--bg-off); color: var(--text-muted);">manim-prop-transform</code>
      </div>

      <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-2">
        <p class="text-sm font-bold" style="color: var(--text);">MoveToTarget</p>
        <div class="rounded-2xl p-6 flex items-center justify-center min-h-[130px] relative overflow-hidden" style="background: var(--bg-off); border: 2px solid var(--border);">
          <div class="absolute left-8 flex items-center gap-1 opacity-30">
            <div class="w-3 h-3 rounded-full" style="background: var(--border);"></div>
            <span class="text-[10px] font-bold" style="color: var(--text-muted);">start</span>
          </div>
          <div class="absolute right-8 flex items-center gap-1 opacity-30">
            <span class="text-[10px] font-bold" style="color: var(--text-muted);">end</span>
            <div class="w-3 h-3 rounded-full" style="background: var(--border);"></div>
          </div>
          <div class="w-10 h-10 rounded-full manim-move-target" style="background: var(--rose);"></div>
        </div>
        <p class="text-xs" style="color: var(--text-dim);">Element glides from its current position to a target. Use for reordering lists, moving items between groups, or spatial storytelling.</p>
        <code class="text-[10px] font-bold px-1.5 py-0.5 rounded w-fit" style="background: var(--bg-off); color: var(--text-muted);">manim-move-target</code>
      </div>

      <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-3">
        <p class="text-sm font-bold" style="color: var(--text);">CountUp</p>
        <div class="rounded-2xl p-6 flex items-center justify-center min-h-[130px]" style="background: var(--bg-off); border: 2px solid var(--border);">
          <div class="flex items-baseline gap-1">
            <span class="text-5xl font-black tabular-nums manim-count-up" style="color: var(--lavender);">
              <span class="tabular-nums manim-count-tick">42</span>
            </span>
            <span class="text-lg font-bold" style="color: var(--text-muted);">%</span>
          </div>
        </div>
        <p class="text-xs" style="color: var(--text-dim);">Number ticks from 0 to target value. Use for statistics, progress, scores — any number that should feel earned rather than static.</p>
        <code class="text-[10px] font-bold px-1.5 py-0.5 rounded w-fit" style="background: var(--bg-off); color: var(--text-muted);">manim-count-up</code>
      </div>
    </div>

    <div class="mt-8 pt-5 anim-fade-in anim-delay-5" style="border-top: 2px solid var(--border);">
      <p class="text-xs font-bold uppercase tracking-widest mb-3" style="color: var(--text-muted);">Transform Rules</p>
      <div class="grid grid-cols-3 gap-6">
        <div class="flex items-start gap-2">
          <div class="w-1 h-full min-h-[40px] rounded-full shrink-0" style="background: var(--coral);"></div>
          <div>
            <p class="text-xs font-bold" style="color: var(--text);">Specific properties only</p>
            <p class="text-[10px] mt-0.5" style="color: var(--text-dim);">Always transition specific properties (transform, opacity, color) — never <code>all</code>. Prevents accidental animations on layout shifts.</p>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <div class="w-1 h-full min-h-[40px] rounded-full shrink-0" style="background: var(--mint);"></div>
          <div>
            <p class="text-xs font-bold" style="color: var(--text);">GPU-accelerated transforms</p>
            <p class="text-[10px] mt-0.5" style="color: var(--text-dim);">Prefer <code>transform</code> and <code>opacity</code> — they composite on the GPU. Avoid animating <code>width</code>, <code>height</code>, <code>top</code>, <code>left</code>.</p>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <div class="w-1 h-full min-h-[40px] rounded-full shrink-0" style="background: var(--sky);"></div>
          <div>
            <p class="text-xs font-bold" style="color: var(--text);">will-change: sparingly</p>
            <p class="text-[10px] mt-0.5" style="color: var(--text-dim);">Only apply <code>will-change</code> to elements about to animate, and remove it after. Over-use wastes memory.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
