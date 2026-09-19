<script setup lang="ts">
/**
 * The instructor, briefly (PRE-0185, right before the introductions round).
 * Auto-imported as `<IntroAboutMe />`.
 *
 * It exists for one reason: the room is about to be asked to introduce
 * themselves, and it is easier to do that after someone else has gone first.
 * So this is a short hello, not a portfolio — a few lines on the left, and on
 * the right the path from Minecraft mods in a lockdown to writing Rust at the
 * university. The path is the point: it starts at zero, which is where the room
 * is starting too.
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

const lines = computed(() => tm<string[]>('me.lines'))
const path = computed(() => tm<Step[]>('me.path'))
const chips = computed(() => tm<Chip[]>('me.chips'))

/** The deck's rule, in its order: one colour per step of the path. */
const COLOURS = ['coral', 'sun', 'mint', 'sky', 'lavender']
const colourOf = (index: number) => `var(--${COLOURS[index % COLOURS.length]})`
</script>

<template>
  <div class="me">
    <div class="wash" aria-hidden="true"></div>

    <header class="me-head">
      <div class="rule" aria-hidden="true">
        <span v-for="colour in COLOURS" :key="colour" :style="{ background: `var(--${colour})` }"></span>
      </div>
      <span class="me-eyebrow">{{ t('me.eyebrow') }}</span>
      <h2 class="me-name">{{ t('me.name') }}</h2>
      <p class="me-role">{{ t('me.role') }}</p>
    </header>

    <div class="me-body">
      <div class="me-said">
        <p v-for="(line, index) in lines" :key="index" class="me-line" :style="{ '--t': `${0.35 + index * 0.12}s` }">
          {{ line }}
        </p>

        <div class="me-chips">
          <span class="chips-label">{{ t('me.chipsLabel') }}</span>
          <span
            v-for="(chip, index) in chips"
            :key="chip.text"
            class="chip"
            :style="{ '--t': `${0.8 + index * 0.08}s` }"
          >
            <Icon :name="chip.icon" aria-hidden="true" />
            {{ chip.text }}
          </span>
        </div>
      </div>

      <!-- The path: it starts at zero, which is the whole reason it is on the slide. -->
      <div class="me-path">
        <span class="path-label">{{ t('me.pathLabel') }}</span>
        <ol class="path-list">
          <li
            v-for="(step, index) in path"
            :key="step.year"
            class="step"
            :style="{ '--accent': colourOf(index), '--t': `${0.5 + index * 0.12}s` }"
          >
            <span class="step-dot" aria-hidden="true"></span>
            <span class="step-year">{{ step.year }}</span>
            <span class="step-body">
              <span class="step-what">{{ step.what }}</span>
              <span class="step-how">{{ step.how }}</span>
            </span>
          </li>
        </ol>
      </div>
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

.wash {
  position: absolute;
  inset: auto -12vw -24vh auto;
  width: 44vw;
  height: 44vw;
  border-radius: 50%;
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in srgb, var(--coral) 18%, transparent),
    color-mix(in srgb, var(--sun) 10%, transparent) 55%,
    transparent 72%
  );
  pointer-events: none;
}

.me-head {
  position: relative;
}
.rule {
  display: flex;
  gap: 0.4vw;
  margin-bottom: 1.6vh;
}
.rule span {
  height: 0.55vh;
  width: 2.4vw;
  border-radius: 999px;
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.rule span:nth-child(2) { animation-delay: 0.05s; }
.rule span:nth-child(3) { animation-delay: 0.1s; }
.rule span:nth-child(4) { animation-delay: 0.15s; }
.rule span:nth-child(5) { animation-delay: 0.2s; }

.me-eyebrow {
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.me-name {
  margin-top: 0.4vh;
  font-size: clamp(1.6rem, 5.4vh, 3.6rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--text);
  animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
}
.me-role {
  margin-top: 0.8vh;
  font-size: clamp(0.65rem, 1.8vh, 1.1rem);
  font-weight: 600;
  color: var(--text-dim);
  animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.18s both;
}

.me-body {
  position: relative;
  flex: 1;
  min-height: 0;
  margin-top: 4vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3vw;
  /* Follows the header rather than floating in the middle of the slide. */
  align-content: start;
}

.me-line {
  margin-bottom: 1.4vh;
  max-width: 44ch;
  font-size: clamp(0.68rem, 1.9vh, 1.15rem);
  line-height: 1.45;
  color: var(--text);
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.me-line:last-of-type {
  color: var(--text-dim);
}

.me-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6vh 0.8vh;
  margin-top: 2vh;
}
.chips-label {
  width: 100%;
  font-size: clamp(0.45rem, 1.15vh, 0.72rem);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5vh;
  padding: 0.45vh 1vh;
  border-radius: 999px;
  background: var(--bg-off);
  border: 1px solid var(--border);
  font-size: clamp(0.5rem, 1.35vh, 0.88rem);
  font-weight: 600;
  color: var(--text-dim);
  animation: rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}

/* ─── The path ───────────────────────────────────────────────────────── */
.me-path {
  min-width: 0;
}
.path-label {
  display: block;
  margin-bottom: 1.2vh;
  font-size: clamp(0.45rem, 1.15vh, 0.72rem);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.path-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.1vh;
  padding-left: 1.6vh;
}
/* The thread the dots sit on. */
.path-list::before {
  content: '';
  position: absolute;
  top: 1vh;
  bottom: 1vh;
  left: 0.55vh;
  width: 2px;
  background: var(--border);
}
.step {
  position: relative;
  display: grid;
  grid-template-columns: 6.5ch 1fr;
  align-items: baseline;
  gap: 1vh;
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.step-dot {
  position: absolute;
  left: -1.35vh;
  top: 0.55vh;
  width: 1.1vh;
  height: 1.1vh;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 0.35vh color-mix(in srgb, var(--accent) 20%, transparent);
}
.step-year {
  font-family: var(--font-code);
  font-size: clamp(0.5rem, 1.4vh, 0.9rem);
  font-weight: 800;
  color: var(--accent);
}
.step-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.step-what {
  font-size: clamp(0.62rem, 1.75vh, 1.05rem);
  font-weight: 800;
  color: var(--text);
}
.step-how {
  font-size: clamp(0.52rem, 1.4vh, 0.9rem);
  line-height: 1.35;
  color: var(--text-dim);
}

.me-note {
  position: relative;
  margin-top: 1.6vh;
  font-size: clamp(0.5rem, 1.4vh, 0.9rem);
  color: var(--text-muted);
  animation: rise 0.45s ease 1.2s both;
}

@keyframes rise {
  from { opacity: 0; translate: 0 1.2vh; }
  to { opacity: 1; translate: 0 0; }
}

/* A phone reads it as one column, the path underneath. */
@media (max-width: 760px) {
  .me-body {
    grid-template-columns: minmax(0, 1fr);
    gap: 2.4vh;
  }
  .wash {
    display: none;
  }
}
</style>
