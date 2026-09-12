<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-8 shrink-0 anim-fade-in-up">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Title Cards & Layouts
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--rose);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        Three layout types and what each one signals to the audience.
      </p>
    </header>

    <div class="flex-grow grid grid-cols-1 md:grid-cols-3 gap-5 overflow-auto anim-fade-in-up anim-delay-2">
      <!-- slide-bare -->
      <div class="rounded-2xl overflow-hidden flex flex-col" style="border: 2px solid var(--border);">
        <div class="h-40 flex flex-col items-center justify-center p-4 relative" style="background: var(--bg-warm);">
          <div class="w-10 h-1.5 rounded-full mb-3" style="background: var(--coral);"></div>
          <span class="text-2xl font-black" style="color: var(--text);">Python</span>
          <span class="text-xs mt-1" style="color: var(--text-dim);">Pre-Courses</span>
        </div>
        <div class="p-4 flex flex-col gap-2" style="background: var(--bg);">
          <span class="text-xs font-bold uppercase tracking-widest" style="color: var(--coral);">slide-bare</span>
          <span class="text-sm font-bold" style="color: var(--text);">Title & Welcome Cards</span>
          <p class="text-[10px] leading-relaxed" style="color: var(--text-dim);">
            No chrome at all. Used for the opening slide, full-bleed images, and dramatic moments. Signals: "pay attention, something new is starting."
          </p>
          <p class="text-[10px] font-bold mt-1" style="color: var(--text-muted);">
            Background: white or warm (#FFF8F3) · No page number · No progress bar
          </p>
        </div>
      </div>

      <!-- slide -->
      <div class="rounded-2xl overflow-hidden flex flex-col" style="border: 2px solid var(--border);">
        <div class="h-40 flex flex-col justify-center p-4 relative" style="background: var(--bg);">
          <span class="absolute top-2 left-3 text-[7px] font-bold uppercase tracking-widest" style="color: var(--text-muted);">Python for Beginners</span>
          <span class="text-lg font-black" style="color: var(--text);">Variables</span>
          <div class="mt-1 h-1 w-8 rounded-full" style="background: var(--coral);"></div>
          <span class="text-[9px] mt-2" style="color: var(--text-dim);">A variable stores a value...</span>
          <div class="absolute bottom-0 left-0 w-full h-[2px]" style="background: var(--border);">
            <div class="h-full w-1/3" style="background: var(--coral);"></div>
          </div>
          <span class="absolute bottom-2 right-3 text-[7px] font-bold" style="color: var(--text-muted);">3/12</span>
        </div>
        <div class="p-4 flex flex-col gap-2" style="background: var(--bg);">
          <span class="text-xs font-bold uppercase tracking-widest" style="color: var(--sky);">slide (default)</span>
          <span class="text-sm font-bold" style="color: var(--text);">Content Slides</span>
          <p class="text-[10px] leading-relaxed" style="color: var(--text-dim);">
            Full chrome: deck title, progress bar, page number. Used for all teaching content, code, exercises. Signals: "we're in the lesson."
          </p>
          <p class="text-[10px] font-bold mt-1" style="color: var(--text-muted);">
            Background: white · All chrome visible · Content fills the frame
          </p>
        </div>
      </div>

      <!-- slide-section -->
      <div class="rounded-2xl overflow-hidden flex flex-col" style="border: 2px solid var(--border);">
        <div class="h-40 flex flex-col items-center justify-center p-4 relative" style="background: var(--bg);">
          <div class="absolute top-0 left-0 w-full h-1.5" style="background: var(--coral);"></div>
          <span class="text-2xl font-black" style="color: var(--text);">Q & A</span>
          <span class="text-xs mt-1" style="color: var(--text-dim);">Thank You</span>
          <span class="absolute bottom-2 text-[7px] font-bold tracking-widest" style="color: var(--text-muted);">6/12</span>
        </div>
        <div class="p-4 flex flex-col gap-2" style="background: var(--bg);">
          <span class="text-xs font-bold uppercase tracking-widest" style="color: var(--rose);">slide-section</span>
          <span class="text-sm font-bold" style="color: var(--text);">Section Breaks</span>
          <p class="text-[10px] leading-relaxed" style="color: var(--text-dim);">
            Bold coral bar at top. Centered content and page number. Signals: "chapter ending, take a breath." Used for Q&A, breaks, topic transitions.
          </p>
          <p class="text-[10px] font-bold mt-1" style="color: var(--text-muted);">
            Background: white · Coral top bar · Centered page number
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
