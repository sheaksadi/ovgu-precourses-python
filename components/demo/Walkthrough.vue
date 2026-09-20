<script setup lang="ts">
/**
 * Page for a click-through demo. Auto-imported as `<DemoWalkthrough>`.
 *
 * Steps on the left, ticking off as `stage` advances, one tip per step and an
 * optional `aside` at the bottom; the demo frame (default slot) on the right
 * with its controls under it. Used by the walk-throughs in `components/pycharm/`,
 * which drive it with `useDemoPlayer`.
 *
 * The demo plays when the slide opens, like every other animated slide, so
 * there is nothing to press to begin. Once it has played through, the devices
 * following along get the button that plays it again for the whole room; the
 * projector never gets a button at all, and Enter on its keyboard does the
 * same job. Nothing is ever laid over the frame: a control that covers the
 * thing it controls is the one place a viewer cannot look.
 */
import { computed } from 'vue'
import { useDeckRole } from '~/composables/useDeckRole'
import { useDemos } from '~/composables/useDemos'

const props = defineProps<{
  eyebrow: string
  title: string
  steps: string[]
  stage: number
  finished: boolean
  tip?: string
  replay: string
  hint: string
}>()

const emit = defineEmits<{ replay: [] }>()

// The projector carries no buttons; Enter on its own keyboard still replays.
const { isProjector, role } = useDeckRole()

// While the room is watching a replay, the button that would cut it off goes
// quiet. The presenter view keeps every control it has.
const demos = useDemos()
const held = computed(() => demos.busy.value && role.value !== 'presenter')

// The replay lives under the frame here, so the deck's own bar stands down.
demos.claimReplay()

/** Six steps and a tip do not fit the column at the size three of them do. */
const dense = computed(() => props.steps.length > 4)

const isDone = (step: number) => step < props.stage || (step === props.stage && props.finished)
</script>

<template>
  <div class="walk relative w-full h-full overflow-hidden" :class="[`stage-${stage}`, { 'is-dense': dense }]">
    <section class="walk-copy">
      <p class="walk-eyebrow">{{ eyebrow }}</p>
      <h2 class="walk-title">{{ title }}</h2>

      <ol class="walk-steps">
        <li
          v-for="(step, index) in steps"
          :key="index"
          class="walk-step"
          :class="{ 'is-now': index + 1 === stage && !finished, 'is-done': isDone(index + 1) }"
        >
          <span class="walk-num">
            <span class="text-trim">{{ isDone(index + 1) ? '✓' : index + 1 }}</span>
          </span>
          <span>{{ step }}</span>
        </li>
      </ol>

      <p v-if="tip" class="walk-tip">
        <span class="walk-rail" aria-hidden="true"></span>
        <span :key="tip" class="walk-tip-text">{{ tip }}</span>
      </p>

      <div v-if="$slots.aside" class="walk-aside">
        <slot name="aside" />
      </div>
    </section>

    <section class="walk-demo">
      <slot />

      <!-- Played through: the row that plays it again, for the devices only. -->
      <div v-if="!isProjector && finished" class="walk-controls">
        <button type="button" class="walk-replay" :disabled="held" @click="emit('replay')">
          <Icon name="lucide:rotate-ccw" />
          <span class="text-trim">{{ replay }}</span>
        </button>
        <span class="walk-hint">{{ hint }}</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.walk {
  background: var(--bg);
}

/* ─── Steps ──────────────────────────────────────────────────────────── */
.walk-copy {
  position: absolute;
  top: 9vh;
  bottom: 7vh;
  left: 6vw;
  width: 32vw;
  display: flex;
  flex-direction: column;
}

.walk-eyebrow {
  font-size: clamp(0.7rem, 1.45vh, 1rem);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.walk-title {
  margin-top: 1.6vh;
  font-size: clamp(2rem, min(8vh, 4.6vw), 5.2rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.04em;
  color: var(--text);
}

.walk-steps {
  margin: 4.5vh 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.2vh;
}

.walk-step {
  display: flex;
  align-items: center;
  gap: 1.2vw;
  padding: 1vh 1.2vh;
  border-radius: 1.4vh;
  font-size: clamp(0.85rem, 2.2vh, 1.55rem);
  font-weight: 800;
  line-height: 1.3;
  color: var(--text-muted);
  transition: background 0.3s ease, color 0.3s ease;
}
.walk-step.is-now {
  background: var(--bg-off);
  color: var(--text);
}
.walk-step.is-done {
  color: var(--text-dim);
}

.walk-num {
  display: grid;
  place-items: center;
  flex: none;
  width: 4.4vh;
  height: 4.4vh;
  border-radius: 999px;
  border: 2px solid var(--border);
  font-size: clamp(0.75rem, 1.9vh, 1.25rem);
  color: var(--text-muted);
  transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
.is-now .walk-num {
  background: var(--coral);
  border-color: var(--coral);
  color: #FFFFFF;
}
.is-done .walk-num {
  background: var(--mint);
  border-color: var(--mint);
  color: #FFFFFF;
}

.walk-tip {
  display: flex;
  gap: 1.2vw;
  margin-top: 4vh;
  font-size: clamp(0.8rem, 2vh, 1.35rem);
  line-height: 1.5;
  color: var(--text-dim);
}
.walk-rail {
  flex: none;
  width: 0.6vh;
  border-radius: 999px;
  background: var(--coral);
}

/* Step 1 has only the slide entrance; later tips appear as their step starts. */
.walk-tip-text {
  animation: appear 0.35s ease both;
}
.stage-1 .walk-tip-text {
  animation: none;
}

.walk-aside {
  margin-top: auto;
  padding-top: 2.4vh;
}

/* A longer walk-through trades size for the room to show every step at once. */
.walk.is-dense .walk-steps {
  margin-top: 2.8vh;
  gap: 0.4vh;
}
.walk.is-dense .walk-step {
  padding: 0.7vh 1vh;
  font-size: clamp(0.72rem, 1.85vh, 1.2rem);
}
.walk.is-dense .walk-num {
  width: 3.6vh;
  height: 3.6vh;
  font-size: clamp(0.65rem, 1.6vh, 1rem);
}
.walk.is-dense .walk-tip {
  margin-top: 2.4vh;
  font-size: clamp(0.72rem, 1.7vh, 1.1rem);
}
.walk.is-dense .walk-aside {
  padding-top: 1.6vh;
}

/* ─── Demo ───────────────────────────────────────────────────────────── */
.walk-demo {
  position: absolute;
  z-index: 0;
  top: 9vh;
  right: 5vw;
  width: 52vw;
  display: flex;
  flex-direction: column;
  gap: 2.2vh;
}

.walk-controls {
  display: flex;
  align-items: center;
  gap: 1.6vh;
}

.walk-replay:disabled {
  opacity: 0.45;
  cursor: default;
}
.walk-replay {
  display: inline-flex;
  align-items: center;
  gap: 0.9vh;
  padding: calc(1vh + 0.25em) 2vh;
  border-radius: 1.2vh;
  border: 2px solid var(--text);
  font-size: clamp(0.8rem, 1.8vh, 1.2rem);
  font-weight: 800;
  color: var(--text);
  cursor: pointer;
}

.walk-hint {
  font-size: clamp(0.7rem, 1.5vh, 1rem);
  font-weight: 600;
  color: var(--text-muted);
}

/* ─── A phone held upright ───────────────────────────────────────────── */
/* See "A phone held upright" in AGENTS.md. The projector's two columns become
   one scrolling column: what the demo is about, then the demo, then the tip. */
@media (orientation: portrait) and (max-width: 760px) {
  .walk {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 3.5rem 1rem 5rem;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .walk-copy,
  .walk-demo {
    position: static;
    inset: auto;
    width: auto;
  }

  .walk-title {
    font-size: clamp(1.5rem, 7vw, 2.2rem);
  }

  .walk-steps {
    margin-top: 1.6rem;
    gap: 0.35rem;
  }
  .walk-step {
    gap: 0.75rem;
    padding: 0.5rem 0.6rem;
    border-radius: 0.8rem;
    font-size: 0.95rem;
  }
  .walk-num {
    width: 1.9rem;
    height: 1.9rem;
    font-size: 0.8rem;
  }

  .walk-tip {
    gap: 0.75rem;
    margin-top: 1.4rem;
    font-size: 0.95rem;
  }
  .walk-rail {
    width: 0.25rem;
  }

  .walk-aside {
    margin-top: 1.2rem;
    padding-top: 0;
  }

  /* The window inside is drawn in vh against this box, so it keeps a vh height
     and crops rather than being redrawn for a narrow screen. */
  .walk-demo :deep(.frame) {
    height: 42vh;
  }

  .walk-controls {
    gap: 0.75rem;
  }
  .walk-replay {
    padding: 0.6rem 1.1rem;
    border-radius: 0.8rem;
    font-size: 0.9rem;
  }
  .walk-hint {
    font-size: 0.8rem;
  }

}

@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
