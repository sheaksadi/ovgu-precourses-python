<script setup lang="ts">
/** PRE-0029 — one program, three stages, tokens that survive the trip. */
import type { MorphStage } from '~/utils/codeTokens'

const stages: MorphStage[] = [
  {
    label: 'Plain',
    variant: 'pseudo',
    code: `FOR EACH student IN students
  IF grade >= 60
    SAY "pass"
  OTHERWISE
    SAY "fail"`,
    note: 'Plain English. Every word is a concept, none of them is syntax yet.',
  },
  {
    label: 'Structured',
    variant: 'pseudo',
    code: `FOR student IN students:
  IF grade >= 60:
    SAY "pass"
  ELSE:
    SAY "fail"`,
    note: 'Structure arrives: EACH drops, colons and ELSE fade in. Nothing else moves.',
  },
  {
    label: 'Python',
    variant: 'python',
    code: `for student in students:
    if student.grade >= 60:
        print("pass")
    else:
        print("fail")`,
    note: 'Syntax arrives: the words go lowercase, colons and brackets appear, SAY becomes print().',
  },
]
</script>

<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-6 shrink-0 anim-fade-in-up">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Pseudo → Python
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--lavender);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        One program, three stages. Shared tokens travel to their new place; only genuinely new syntax fades in.
      </p>
    </header>

    <div class="flex-grow flex flex-col justify-center anim-fade-in-up anim-delay-1">
      <CodeMorph :stages="stages" />
    </div>

    <div class="mt-6 flex gap-4 anim-fade-in anim-delay-3" style="border-top: 2px solid var(--border); padding-top: 1.5rem;">
      <div class="w-1.5 h-12 rounded-full shrink-0" style="background: var(--lavender);"></div>
      <p class="text-xs md:text-sm leading-relaxed" style="color: var(--text-dim);">
        <strong style="color: var(--text);">Why it reads:</strong> the tokens carry keys, not positions. A word that means the
        same thing in both languages keeps its key, so the browser moves it (550ms) instead of replacing the block. Words that
        only exist in one stage fade out first, and the new ones arrive after the moves have landed. Hover any word to link it
        to its twin; the arrows and the stage pills step the transform by hand.
      </p>
    </div>
  </div>
</template>
