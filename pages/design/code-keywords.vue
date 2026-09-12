<script setup lang="ts">
/** PRE-0028 — the two code tools: keyword links and line focus. */
import { useCodeLink } from '~/composables/useCodeLink'

const link = useCodeLink()

const pseudo = `# average grade
DEFINE average USING grades
  SET total = 0
  FOR EACH grade IN grades
    ADD grade TO total
  GIVE total / COUNT grades

SAY average(90, 72, 88)`

const python = `# average grade
def average(grades):
    total = 0
    for grade in grades:
        total += grade
    return total / len(grades)

print(average([90, 72, 88]))`
</script>

<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16" @click.self="link.clear()">
    <header class="mb-8 shrink-0 anim-fade-in-up">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Code &amp; Keyword Links
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--mint);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        Hover any word. The same idea lights up in both panels — click to pin it while you talk.
      </p>
    </header>

    <div class="grid md:grid-cols-2 gap-6 items-start anim-fade-in-up anim-delay-1">
      <CodePanel :code="pseudo" variant="pseudo" reveal />
      <CodePanel :code="python" variant="python" reveal />
    </div>

    <div class="mt-6 grid md:grid-cols-3 gap-4 items-start anim-fade-in-up anim-delay-3">
      <div class="rounded-xl p-4" style="background: var(--bg-off);">
        <p class="text-[10px] font-bold uppercase tracking-widest mb-1" style="color: var(--lavender);">Concept links</p>
        <p class="text-[11px] leading-relaxed" style="color: var(--text-dim);">
          <code style="color: var(--text);">SAY</code> and <code style="color: var(--text);">print</code> are one idea, so they
          highlight together. Same for <code style="color: var(--text);">FOR EACH</code> / <code style="color: var(--text);">for</code>,
          <code style="color: var(--text);">SET</code> / <code style="color: var(--text);">=</code>,
          <code style="color: var(--text);">GIVE</code> / <code style="color: var(--text);">return</code> and
          <code style="color: var(--text);">COUNT</code> / <code style="color: var(--text);">len</code>.
        </p>
      </div>
      <div class="rounded-xl p-4" style="background: var(--bg-off);">
        <p class="text-[10px] font-bold uppercase tracking-widest mb-1" style="color: var(--mint);">Name links</p>
        <p class="text-[11px] leading-relaxed" style="color: var(--text-dim);">
          Every identifier links to itself. Hovering <code style="color: var(--text);">total</code> traces the accumulator
          through both languages, every line it touches.
        </p>
      </div>
      <div class="rounded-xl p-4" style="background: var(--bg-off);">
        <p class="text-[10px] font-bold uppercase tracking-widest mb-1" style="color: var(--coral);">Line focus</p>
        <p class="text-[11px] leading-relaxed" style="color: var(--text-dim);">
          Pass <code style="color: var(--text);">:focus="[5]"</code> to dim everything else and rail the live line, gutter
          number included. State, not a loop — the slide holds still until you move it.
        </p>
      </div>
    </div>

    <div class="mt-auto pt-6 anim-fade-in-up anim-delay-4">
      <p class="text-[10px] font-bold uppercase tracking-widest mb-3" style="color: var(--text-muted);">Focus example — line 5</p>
      <CodePanel :code="python" :focus="[5]" :linkable="false" :chrome="false" />
    </div>
  </div>
</template>
