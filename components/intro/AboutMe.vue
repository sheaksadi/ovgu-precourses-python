<script setup lang="ts">
/**
 * The instructor, briefly (PRE-0185, right before the introductions round).
 * Auto-imported as `<IntroAboutMe />`.
 *
 * It exists for one reason: the room is about to be asked to introduce
 * themselves, and that is easier once someone else has gone first. So it is a
 * hello, not a portfolio — a name, one line, and the path from Minecraft mods
 * in a lockdown to Rust at the university.
 *
 * The path is the point, so the path is what moves: each stop lands in turn and
 * draws its own segment of the rail down to the next one, in its own colour, so
 * the line ends at the last stop rather than running on past it. Everything else
 * is deliberately short — the talking happens in the room, not on the slide.
 *
 * Words come from `me.*` in `locales/`, lifted from the portfolio site's own
 * wording so both say the same thing.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

interface Step {
  year: string
  what: string
  how: string
}

interface Chip {
  icon: string
  text: string
}

const { t, tm } = useI18n()

const path = computed(() => tm<Step[]>('me.path'))
const chips = computed(() => tm<Chip[]>('me.chips'))

/** The deck's rule, in its order: one colour per stop. */
const COLOURS = ['coral', 'sun', 'mint', 'sky', 'lavender']
const colourOf = (index: number) => `var(--${COLOURS[index % COLOURS.length]})`

/** The thread reaches a stop, then the stop lands. One rhythm for the whole path. */
const STEP = 0.45
const START = 0.7
const at = (index: number) => START + index * STEP
</script>

<template>
  <div class="me">
    <div class="wash wash-warm" aria-hidden="true"></div>
    <div class="wash wash-cool" aria-hidden="true"></div>

    <div class="me-body">
      <section class="me-said">
        <div class="rule" aria-hidden="true">
          <span v-for="(colour, index) in COLOURS" :key="colour" :style="{ background: `var(--${colour})`, '--t': `${index * 0.06}s` }"></span>
        </div>

        <span class="me-eyebrow">{{ t('me.eyebrow') }}</span>

        <h2 class="me-name">
          <span class="name-text">{{ t('me.name') }}</span>
          <span class="name-sweep" aria-hidden="true"></span>
        </h2>

        <p class="me-role">{{ t('me.role') }}</p>

        <div class="me-chips">
          <span
            v-for="(chip, index) in chips"
            :key="chip.text"
            class="chip"
            :style="{ '--t': `${1.5 + index * 0.1}s` }"
          >
            <Icon :name="chip.icon" aria-hidden="true" />
            {{ chip.text }}
          </span>
        </div>
      </section>

      <!-- The path starts at zero, which is the whole reason it is on the slide. -->
      <section class="me-path">
        <ol class="path-list">
          <li
            v-for="(step, index) in path"
            :key="step.year"
            class="step"
            :style="{ '--accent': colourOf(index), '--t': `${at(index)}s` }"
          >
            <span class="step-dot" aria-hidden="true"></span>
            <span class="step-year">{{ step.year }}</span>
            <span class="step-body">
              <span class="step-what">{{ step.what }}</span>
              <span v-if="step.how" class="step-how">{{ step.how }}</span>
            </span>
          </li>
        </ol>
      </section>
    </div>

    <p class="me-note">{{ t('me.note') }}</p>
  </div>
</template>

<style scoped>
.me {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 6vh 6vw 4vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Two soft colour fields, drifting, so the slide is not a white sheet. */
.wash {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  animation: drift 18s ease-in-out infinite alternate;
}
.wash-warm {
  right: -14vw;
  top: -20vh;
  width: 48vw;
  height: 48vw;
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in srgb, var(--coral) 26%, transparent),
    color-mix(in srgb, var(--sun) 12%, transparent) 55%,
    transparent 72%
  );
}
.wash-cool {
  left: 34vw;
  bottom: -30vh;
  width: 40vw;
  height: 40vw;
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in srgb, var(--sky) 22%, transparent),
    color-mix(in srgb, var(--lavender) 12%, transparent) 55%,
    transparent 72%
  );
  animation-delay: -9s;
}

.me-body {
  position: relative;
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 4vw;
  align-content: center;
}

/* ─── Left: who ──────────────────────────────────────────────────────── */
.rule {
  display: flex;
  gap: 0.4vw;
  margin-bottom: 2vh;
}
.rule span {
  height: 0.6vh;
  width: 2.6vw;
  border-radius: 999px;
  animation: sweep-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
  transform-origin: left center;
}

.me-eyebrow {
  display: block;
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  animation: rise 0.45s ease 0.1s both;
}

.me-name {
  position: relative;
  display: inline-block;
  margin-top: 0.6vh;
  font-size: clamp(2rem, 8vh, 5rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.035em;
  color: var(--text);
}
.name-text {
  position: relative;
  display: inline-block;
  animation: rise-big 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
}
/* A colour sweep that runs under the name once it has landed. */
.name-sweep {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.6vh;
  height: 0.7vh;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--coral), var(--sun), var(--mint), var(--sky), var(--lavender));
  transform-origin: left center;
  animation: sweep-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
}

.me-role {
  margin-top: 2.2vh;
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.7vh, 1.05rem);
  font-weight: 700;
  color: var(--text-dim);
  animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both;
}

.me-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8vh;
  margin-top: 3.4vh;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5vh;
  padding: 0.5vh 1.1vh;
  border-radius: 999px;
  background: var(--bg-off);
  border: 1px solid var(--border);
  font-size: clamp(0.5rem, 1.35vh, 0.88rem);
  font-weight: 600;
  color: var(--text-dim);
  animation: pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}

/* ─── Right: the path ────────────────────────────────────────────────── */
.me-path {
  min-width: 0;
}
.path-label {
  display: block;
  margin-bottom: 1.6vh;
  font-size: clamp(0.45rem, 1.15vh, 0.72rem);
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  animation: rise 0.4s ease 0.55s both;
}
.path-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.8vh;
  /* The rail the dots sit on, measured from the left edge of the list. */
  --rail: 1.1vh;
  --dot: 1.3vh;
  padding-left: 2.2vh;
}
.step {
  position: relative;
  display: grid;
  grid-template-columns: 6.5ch 1fr;
  align-items: baseline;
  gap: 1.1vh;
  animation: step-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
/* The segment from this stop down to the next one, in this stop's colour. */
.step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: calc(var(--rail) - 2.2vh - 1px);
  top: calc(0.5vh + var(--dot));
  height: calc(100% - var(--dot) + 1.8vh);
  width: 2px;
  background: var(--accent);
  opacity: 0.45;
  transform-origin: top center;
  animation: grow-down 0.4s linear var(--t) both;
}

.step-dot {
  position: absolute;
  /* Centre on the rail: the step itself starts one padding in. */
  left: calc(var(--rail) - 2.2vh - var(--dot) / 2);
  top: 0.5vh;
  width: var(--dot);
  height: var(--dot);
  border-radius: 999px;
  background: var(--accent);
  animation: dot-pop 0.45s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.step-year {
  font-family: var(--font-code);
  font-size: clamp(0.52rem, 1.45vh, 0.95rem);
  font-weight: 800;
  color: var(--accent);
}
.step-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.step-what {
  font-size: clamp(0.68rem, 2vh, 1.2rem);
  font-weight: 800;
  color: var(--text);
}
.step-how {
  font-size: clamp(0.52rem, 1.45vh, 0.92rem);
  line-height: 1.35;
  color: var(--text-dim);
}
/* The last stop is where the story is now, so it is the one that is filled in. */
.step:last-child .step-what {
  /* The pill hugs the words instead of running to the edge of the slide. */
  align-self: flex-start;
  padding: 0.2vh 0.9vh;
  margin-left: -0.9vh;
  border-radius: 0.7vh;
  background: color-mix(in srgb, var(--accent) 20%, var(--bg));
}

.me-note {
  position: relative;
  margin-top: 1.4vh;
  font-size: clamp(0.48rem, 1.35vh, 0.85rem);
  color: var(--text-muted);
  animation: rise 0.45s ease 2s both;
}

@keyframes rise {
  from { opacity: 0; translate: 0 1.2vh; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes rise-big {
  from { opacity: 0; translate: 0 2.4vh; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes sweep-in {
  from { opacity: 0; scale: 0 1; }
  to { opacity: 1; scale: 1 1; }
}
@keyframes grow-down {
  from { scale: 1 0; }
  to { scale: 1 1; }
}
@keyframes step-in {
  from { opacity: 0; translate: 1.4vh 0; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes dot-pop {
  from { opacity: 0; scale: 0; }
  60% { scale: 1.35; }
  to { opacity: 1; scale: 1; }
}
@keyframes pop {
  from { opacity: 0; scale: 0.85; }
  to { opacity: 1; scale: 1; }
}
@keyframes drift {
  from { translate: 0 0; }
  to { translate: -3vw 2vh; }
}

/* A phone reads it as one column, the path underneath. */
@media (max-width: 760px) {
  .me-body {
    grid-template-columns: minmax(0, 1fr);
    gap: 3vh;
    align-content: start;
  }
  .wash {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wash {
    animation: none;
  }
}
</style>
