<script setup lang="ts">
/**
 * print lesson: "etwas anzeigen". Auto-imported as `<LessonPrinting :stage="1" />`.
 *
 * Sits between the first run and the variables lesson (PRE-0186 and its two
 * sub-slides). `print` has been on screen since Momo's door, but never on its
 * own; here it gets one slide, and with it the three kinds of value that turn
 * up for the rest of the course:
 *
 *   1. text, in quotes
 *   2. numbers, without quotes, which Python will do maths with
 *   3. True and False, which a comparison answers with
 *
 * Deliberately informal: no `str`, no `int`, no `bool`. Those words arrive two
 * slides later with the variables; what matters here is that quotes change what
 * a thing *is*. The scene shows the value dropping into `print()` and the kind
 * cards lighting up one after another. Words come from `printing.*` in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3

interface Stage {
  headline: string
  note: string
  code: string
  focus: number[]
  output: string[]
  outputFrom: number
  /** The value shown dropping into the machine on this stage. */
  chip: string
}

interface Kind {
  name: string
  hint: string
  sample: string
}

const props = defineProps<{ stage: StageNumber }>()
const { t, tm } = useI18n()

const stages = computed(() => tm<Stage[]>('printing.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const kinds = computed(() => tm<Kind[]>('printing.kinds'))

/** One colour per kind, in the order the locale lists them. */
const COLOURS = ['mint', 'sky', 'lavender']
const colourOf = (index: number) => `var(--${COLOURS[index % COLOURS.length]})`

/** Output lines land as the value drops in, so scene and panel agree. */
const outputDelays = computed(() => current.value.output.map((_, i) => 1.5 + i * 0.45))
</script>

<template>
  <LessonShell
    :eyebrow="t('printing.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :file="t('printing.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :output-delays="outputDelays"
    stack-output
    :output-label="t('printing.output')"
    :no-output="t('printing.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <!-- The value of this stage, falling into the machine -->
      <span :key="current.chip" class="chip" :style="{ '--accent': colourOf(stage - 1) }">
        {{ current.chip }}
      </span>

      <div class="machine">
        <span class="machine-name">print(<span class="machine-slot"></span>)</span>
        <span class="machine-note">{{ t('printing.machine') }}</span>
      </div>

      <!-- The kinds, arriving one per stage and staying -->
      <div class="kinds">
        <span class="kinds-label">{{ t('printing.kindsLabel') }}</span>
        <div
          v-for="(kind, index) in kinds"
          :key="kind.name"
          class="kind"
          :class="{ 'is-known': index < stage, 'is-new': index === stage - 1 }"
          :style="{ '--accent': colourOf(index), '--t': `${0.4 + index * 0.1}s` }"
        >
          <span class="kind-name">{{ kind.name }}</span>
          <code class="kind-sample">{{ kind.sample }}</code>
          <span class="kind-hint">{{ kind.hint }}</span>
        </div>
      </div>
    </div>
  </LessonShell>
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3vh 5%;
}

/* ─── The value going in ─────────────────────────────────────────────── */
.chip {
  padding: 0.7vh 1.4vh;
  border-radius: 0.9vh;
  background: color-mix(in srgb, var(--accent) 22%, var(--bg));
  border: 2px solid var(--accent);
  font-family: var(--font-code);
  font-size: clamp(0.7rem, 2vh, 1.25rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
  animation: drop 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
}

.machine {
  margin-top: 1.2vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4vh;
  padding: 1.6vh 2.4vh;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 2px solid var(--text);
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
}
.machine-name {
  font-family: var(--font-code);
  font-size: clamp(0.85rem, 2.6vh, 1.7rem);
  font-weight: 800;
  color: var(--text);
}
/* The gap the value falls into. */
.machine-slot {
  display: inline-block;
  width: 5ch;
  border-bottom: 2px dashed var(--text-muted);
}
.machine-note {
  font-size: clamp(0.45rem, 1.2vh, 0.75rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* ─── The three kinds ────────────────────────────────────────────────── */
.kinds {
  margin-top: auto;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1vh;
}
.kinds-label {
  grid-column: 1 / -1;
  font-size: clamp(0.45rem, 1.15vh, 0.72rem);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.kind {
  display: flex;
  flex-direction: column;
  gap: 0.2vh;
  padding: 1vh 1.2vh;
  border-radius: 1vh;
  background: var(--bg);
  border: 2px solid var(--border);
  opacity: 0.4;
  transition: opacity 0.4s ease, border-color 0.4s ease, background 0.4s ease;
}
/* A kind that has come up stays lit for the rest of the lesson. */
.kind.is-known {
  opacity: 1;
  border-color: color-mix(in srgb, var(--accent) 60%, var(--border));
  background: color-mix(in srgb, var(--accent) 8%, var(--bg));
}
.kind.is-new {
  animation: pop 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both;
}
.kind-name {
  font-size: clamp(0.6rem, 1.7vh, 1.05rem);
  font-weight: 800;
  color: var(--text);
}
.kind-sample {
  font-family: var(--font-code);
  font-size: clamp(0.5rem, 1.4vh, 0.9rem);
  font-weight: 700;
  color: color-mix(in srgb, var(--accent) 70%, var(--text));
}
.kind-hint {
  font-size: clamp(0.45rem, 1.25vh, 0.8rem);
  color: var(--text-dim);
}

@keyframes drop {
  from { opacity: 0; translate: 0 -3vh; }
  60% { opacity: 1; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes rise {
  from { opacity: 0; translate: 0 1.2vh; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes pop {
  from { scale: 1; }
  50% { scale: 1.04; }
  to { scale: 1; }
}
</style>
