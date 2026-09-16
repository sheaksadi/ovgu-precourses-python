<script setup lang="ts">
/**
 * Frame of a staged lesson. Auto-imported as `<LessonShell>`.
 *
 * The layout the variables lesson introduced, shared by the lessons after it:
 * eyebrow with stage dots and headline on top, the scene card on the left
 * (default slot), the code and its output on the right, the takeaway underneath.
 *
 * A lesson is one scene over several slides. The shell fades the headline and the
 * takeaway in on every stage after the first and marks new output lines; the
 * scene animates itself with `stage-N` classes, which the shell puts on its root.
 * Backtick spans in the headline and the takeaway render as code. More than four
 * short output lines flow into columns, so the output card never runs into the
 * takeaway.
 */
import { computed, onMounted } from 'vue'
import { useCodeLink } from '~/composables/useCodeLink'

const props = withDefaults(defineProps<{
  eyebrow: string
  stage: number
  stages: number
  headline: string
  note: string
  code: string
  variant?: 'python' | 'pseudo'
  file?: string
  focus?: number[]
  output?: string[]
  /** Output lines from this index on are new on this stage and fade in. */
  outputFrom?: number
  /** Seconds after the stage opens at which each new line appears, to match the scene. */
  outputDelays?: number[]
  /** Keep output lines stacked even when they are short, e.g. for a printed pattern. */
  stackOutput?: boolean
  /** Smaller code and output type, for samples of seven lines or more. */
  dense?: boolean
  outputLabel: string
  noOutput: string
}>(), {
  variant: 'python',
  file: undefined,
  focus: () => [],
  output: () => [],
  outputFrom: 0,
  outputDelays: undefined,
  stackOutput: false,
  dense: false,
})

const link = useCodeLink()
onMounted(() => link.clear())

/** Split `backtick` spans out of a sentence, so they render as code. */
const segments = (text: string) => text.split('`').map((part, index) => ({ part, code: index % 2 === 1 }))

const columns = computed(() => !props.stackOutput && props.output.length > 4 && props.output.every(line => line.length <= 8))
/** Column width: the longest line plus a gap, so neighbours never touch. */
const columnWidth = computed(() => `${Math.max(...props.output.map(line => line.length), 1) + 2}ch`)
</script>

<template>
  <div class="shell relative w-full h-full overflow-hidden" :class="`stage-${stage}`">
    <header class="shell-head">
      <div class="shell-progress">
        <span class="shell-eyebrow">{{ eyebrow }}</span>
        <span class="shell-dots" aria-hidden="true">
          <span
            v-for="n in stages"
            :key="n"
            class="shell-dot"
            :class="{ 'is-done': n < stage, 'is-now': n === stage }"
          ></span>
        </span>
        <span class="shell-count">{{ stage }} / {{ stages }}</span>
      </div>
      <h2 class="shell-headline">
        <template v-for="(bit, index) in segments(headline)" :key="index">
          <code v-if="bit.code" class="inline-code">{{ bit.part }}</code>
          <template v-else>{{ bit.part }}</template>
        </template>
      </h2>
    </header>

    <section class="shell-scene" aria-hidden="true">
      <slot />
    </section>

    <section class="shell-code" :class="{ 'is-dense': dense }">
      <CodePanel :code="code" :variant="variant" :filename="variant === 'python' ? file : undefined" :focus="focus" />

      <div class="shell-output">
        <span class="output-label">{{ outputLabel }}</span>
        <div v-if="output.length" class="out-lines" :class="{ 'is-columns': columns }" :style="{ '--col': columnWidth }">
          <span
            v-for="(line, index) in output"
            :key="`${stage}-${index}`"
            class="out-line"
            :class="{ 'is-new': index >= outputFrom }"
            :style="{ animationDelay: `${outputDelays?.[index] ?? 0.45 + (index - outputFrom) * 0.35}s` }"
          >{{ line }}</span>
        </div>
        <span v-else class="out-empty">{{ noOutput }}</span>
      </div>
    </section>

    <p class="shell-note">
      <span class="note-rail" aria-hidden="true"></span>
      <span class="note-text">
        <template v-for="(bit, index) in segments(note)" :key="index">
          <code v-if="bit.code" class="inline-code">{{ bit.part }}</code>
          <template v-else>{{ bit.part }}</template>
        </template>
      </span>
    </p>
  </div>
</template>

<style scoped>
.shell {
  background: var(--bg);
}

/* ─── Header ─────────────────────────────────────────────────────────── */
.shell-head {
  position: absolute;
  top: 7vh;
  left: 6vw;
  right: 6vw;
}

.shell-progress {
  display: flex;
  align-items: center;
  gap: 1.4vh;
  margin-bottom: 1.8vh;
}

.shell-eyebrow,
.shell-count {
  font-size: clamp(0.65rem, 1.35vh, 0.9rem);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.shell-dots {
  display: flex;
  align-items: center;
  gap: 0.6vh;
}

.shell-dot {
  width: 1vh;
  height: 1vh;
  border-radius: 999px;
  background: var(--border);
  transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1), background 0.35s ease;
}
.shell-dot.is-done {
  background: var(--text-dim);
}
.shell-dot.is-now {
  width: 2.8vh;
  background: var(--text);
}

.shell-headline {
  font-size: clamp(1.6rem, 5.2vh, 3.8rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--text);
}

.inline-code {
  padding: 0 0.2em;
  border-radius: 0.25em;
  background: var(--bg-off);
  color: var(--lavender);
}

/* ─── Scene card ─────────────────────────────────────────────────────── */
.shell-scene {
  position: absolute;
  top: 24vh;
  left: 6vw;
  width: 44vw;
  height: 50vh;
  overflow: hidden;
  border-radius: 2.4vh;
  background: var(--bg-off);
}

/* ─── Code and output ────────────────────────────────────────────────── */
.shell-code {
  position: absolute;
  top: 24vh;
  left: 54vw;
  width: 40vw;
}

.shell-output {
  display: flex;
  flex-direction: column;
  gap: 0.8vh;
  margin-top: 1.8vh;
  padding: 1.4vh 2vh;
  border-radius: 2vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
}

.output-label {
  font-size: clamp(0.6rem, 1.3vh, 0.85rem);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.out-lines {
  display: flex;
  flex-direction: column;
  gap: 0.8vh;
}
.out-lines.is-columns {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--col), 1fr));
  gap: 0.8vh 1.6vh;
}

.out-line {
  font-family: var(--font-code);
  font-size: clamp(0.85rem, 2vh, 1.35rem);
  color: var(--text);
  white-space: pre;
}
.out-line.is-new {
  animation: appear 0.3s ease both;
}

.out-empty {
  font-size: clamp(0.8rem, 1.8vh, 1.2rem);
  font-style: italic;
  color: var(--text-muted);
}

/* Long samples: a size down, so code and output stay above the takeaway. */
.shell-code.is-dense :deep(.py-4) {
  padding-block: 1.1vh;
  font-size: clamp(0.7rem, 1.8vh, 0.95rem);
}
.shell-code.is-dense .shell-output {
  gap: 0.5vh;
  padding-block: 1.1vh;
}
.shell-code.is-dense .out-line {
  font-size: clamp(0.7rem, 1.8vh, 1.1rem);
}

/* ─── Takeaway ───────────────────────────────────────────────────────── */
.shell-note {
  position: absolute;
  top: 78vh;
  left: 6vw;
  right: 6vw;
  display: flex;
  gap: 1.4vw;
  font-size: clamp(0.9rem, 2.3vh, 1.6rem);
  line-height: 1.5;
  color: var(--text-dim);
}
.note-rail {
  flex: none;
  width: 0.6vh;
  border-radius: 999px;
  background: var(--coral);
}

/* Headline and takeaway answer the press; stage 1 has only the slide entrance. */
.shell-headline,
.note-text {
  animation: appear 0.35s ease both;
}
.stage-1 .shell-headline,
.stage-1 .note-text {
  animation: none;
}

/* ─── A phone held upright ───────────────────────────────────────────── */
/* Students follow the slides on their own devices, so a lesson stacks into one
   scrolling column instead of the projector's two. The scene card keeps its
   height in vh, because the scenes inside are drawn in vh. */
@media (orientation: portrait) and (max-width: 760px) {
  .shell {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 3.5rem 1rem 5rem;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .shell-head,
  .shell-code,
  .shell-note {
    position: static;
    inset: auto;
    width: auto;
  }

  /* Eyebrow, dots and count need two rows at this width. */
  .shell-progress {
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    margin-bottom: 0.9rem;
  }

  .shell-headline {
    font-size: clamp(1.5rem, 7vw, 2.2rem);
  }

  /* No zoom here: it shifts every scene that centres itself with
     translate(-50%), which cuts labels off at the left edge. A projector-shaped
     scene may crop on a phone instead, which reads far better. */

  /* A long line scrolls sideways in its panel instead of being cut off. */
  .shell-code :deep(.code-panel) {
    overflow-x: auto;
  }

  /* Relative, not static: the scenes inside are drawn absolutely against this
     card, and would otherwise anchor to the whole slide. */
  .shell-scene {
    position: relative;
    inset: auto;
    flex: none;
    width: auto;
    height: 46vh;
  }

  .shell-code :deep(.py-4),
  .shell-code.is-dense :deep(.py-4) {
    font-size: 0.82rem;
  }

  .out-line {
    font-size: 0.9rem;
  }

  .shell-note {
    gap: 0.75rem;
    font-size: 0.95rem;
  }
  .note-rail {
    width: 0.25rem;
  }
}

/* ─── 4:3 projectors ─────────────────────────────────────────────────── */
/* Code lines need more room than the picture, and tall code reaches further down.
   Only wide screens: a phone held upright is also taller than 3/2, and it has
   its own layout above. */
@media (max-aspect-ratio: 3/2) and (min-width: 761px) {
  .shell-scene {
    width: 40vw;
  }
  .shell-code {
    left: 49vw;
    width: 45vw;
  }
  .shell-note {
    top: 84vh;
    font-size: clamp(0.8rem, 2vh, 1.4rem);
  }
}

@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
