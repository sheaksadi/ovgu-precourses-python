<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16 overflow-y-auto">
    <h2 class="text-3xl md:text-5xl font-black tracking-tight anim-fade-in-up" style="color: var(--text);">
      Manim Entrances
    </h2>
    <div class="w-16 h-1.5 rounded-full mt-3 mb-2 anim-fade-in-up anim-delay-1" style="background: var(--coral);"></div>
    <p class="text-sm md:text-base font-medium mb-8 anim-fade-in-up anim-delay-1" style="color: var(--text-dim);">
      Every element's first appearance should feel intentional. These are your entrance tools.
    </p>

    <div class="flex-grow grid grid-cols-2 md:grid-cols-3 gap-6">
      <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-1">
        <div class="rounded-2xl p-6 flex items-center justify-center min-h-[120px] overflow-hidden" style="background: var(--coral);">
          <span class="text-white text-2xl font-black tracking-tight manim-write">Write</span>
        </div>
        <div>
          <p class="text-sm font-bold" style="color: var(--text);">Write</p>
          <p class="text-xs mt-0.5" style="color: var(--text-dim);">Text appears letter-by-letter, like being handwritten. Use for titles and key phrases.</p>
          <code class="text-[10px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded" style="background: var(--bg-off); color: var(--text-muted);">manim-write</code>
        </div>
      </div>

      <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-2">
        <div class="rounded-2xl p-6 flex items-center justify-center min-h-[120px] anim-fade-in anim-delay-3" style="background: var(--mint);">
          <span class="text-white text-2xl font-black tracking-tight">FadeIn</span>
        </div>
        <div>
          <p class="text-sm font-bold" style="color: var(--text);">FadeIn</p>
          <p class="text-xs mt-0.5" style="color: var(--text-dim);">Simple opacity transition. The workhorse — use for body text and supporting elements.</p>
          <code class="text-[10px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded" style="background: var(--bg-off); color: var(--text-muted);">anim-fade-in</code>
        </div>
      </div>

      <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-2">
        <div class="rounded-2xl p-6 flex items-center justify-center min-h-[120px] anim-pop-in anim-delay-3" style="background: var(--sky);">
          <span class="text-white text-2xl font-black tracking-tight">Grow</span>
        </div>
        <div>
          <p class="text-sm font-bold" style="color: var(--text);">GrowFromCenter</p>
          <p class="text-xs mt-0.5" style="color: var(--text-dim);">Scales from 0 to 1 with a slight overshoot. Use for icons, badges, and diagrams.</p>
          <code class="text-[10px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded" style="background: var(--bg-off); color: var(--text-muted);">anim-pop-in</code>
        </div>
      </div>

      <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-3">
        <div class="rounded-2xl flex items-center justify-center min-h-[120px] manim-border-draw" style="background: var(--bg-off); border: 3px solid var(--rose);">
          <span class="text-2xl font-black tracking-tight manim-fill-after" style="color: var(--rose); animation-delay: 1.1s;">Border→Fill</span>
        </div>
        <div>
          <p class="text-sm font-bold" style="color: var(--text);">DrawBorderThenFill</p>
          <p class="text-xs mt-0.5" style="color: var(--text-dim);">Outline traces first, then color fills in. Use for shapes, containers, and code blocks.</p>
          <code class="text-[10px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded" style="background: var(--bg-off); color: var(--text-muted);">manim-border-draw</code>
        </div>
      </div>

      <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-3">
        <div class="rounded-2xl p-6 flex items-center justify-center min-h-[120px] manim-spin-in" style="background: var(--sun); animation-delay: 0.4s;">
          <span class="text-xl font-black tracking-tight" style="color: var(--text);">SpinIn</span>
        </div>
        <div>
          <p class="text-sm font-bold" style="color: var(--text);">SpinIn</p>
          <p class="text-xs mt-0.5" style="color: var(--text-dim);">Rotates in from 0 scale. Sparingly — use for playful moments, icons, or decorative elements only.</p>
          <code class="text-[10px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded" style="background: var(--bg-off); color: var(--text-muted);">manim-spin-in</code>
        </div>
      </div>

      <div class="flex flex-col gap-3 anim-fade-in-up anim-delay-4">
        <div class="rounded-2xl p-6 flex items-center justify-center min-h-[120px] manim-shrink-in" style="background: var(--lavender); animation-delay: 0.5s;">
          <span class="text-white text-xl font-black tracking-tight">Shrink</span>
        </div>
        <div>
          <p class="text-sm font-bold" style="color: var(--text);">ShrinkToCenter</p>
          <p class="text-xs mt-0.5" style="color: var(--text-dim);">Oversized then settles to final size. Use for reveals that need weight — key stats, results.</p>
          <code class="text-[10px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded" style="background: var(--bg-off); color: var(--text-muted);">manim-shrink-in</code>
        </div>
      </div>
    </div>

    <div class="mt-8 pt-5 flex items-start gap-4 anim-fade-in anim-delay-5" style="border-top: 2px solid var(--border);">
      <div class="w-1.5 h-12 rounded-full shrink-0" style="background: var(--coral);"></div>
      <div>
        <p class="text-xs font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted);">Manim Philosophy</p>
        <p class="text-sm font-medium leading-relaxed" style="color: var(--text-dim);">
          Every element's appearance is <strong style="color: var(--text);">deliberate and earned</strong>.
          Nothing pops in by accident. Match the entrance to the content's role: titles are written,
          content fades in, diagrams grow, and containers draw their borders first.
        </p>
      </div>
    </div>
  </div>
</template>
