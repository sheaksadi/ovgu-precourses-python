<script setup lang="ts">
/**
 * The three closing slides. Auto-imported as `<LessonOutro kind="can" />`.
 *
 *   can   — what the room can do now, one card per section of the course
 *   watch — channels worth watching, 3Blue1Brown and Sebastian Lague first
 *   next  — where to keep practising, ending on the honest advice: automate
 *           something annoying and actually finish it
 *
 * No code panel here: nothing is being taught any more. Instead every card
 * carries an icon and one of the deck's five colours, cycled in the order of
 * the rule under the title slide, so the last slides look like the first one
 * rather than like a bullet list. The channel cards all carry the YouTube mark,
 * because that is where every one of them lives.
 *
 * Words come from `outro.*` in `locales/` — the recommendations are opinions,
 * and opinions belong in the text. Icons and colour belong here.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

interface Card {
  name: string
  what: string
  tag?: string
}

const props = defineProps<{ kind: 'can' | 'watch' | 'next' }>()
const { tm } = useI18n()

const block = computed(() => tm<{
  title: string
  note: string
  items?: Card[]
  channels?: Card[]
}>(`outro.${props.kind}`))

const cards = computed(() => block.value.channels ?? block.value.items ?? [])

/** The deck's rule, in its order. Cards cycle through it. */
const COLOURS = ['coral', 'sun', 'mint', 'sky', 'lavender', 'rose']

/** One icon per card, in the order the locale lists them. */
const ICONS: Record<'can' | 'watch' | 'next', string[]> = {
  can: [
    'lucide:box', 'lucide:git-branch', 'lucide:list', 'lucide:repeat', 'lucide:square-function',
    'lucide:wrench', 'lucide:book-open', 'lucide:library', 'lucide:globe', 'lucide:boxes',
  ],
  watch: ['lucide:youtube', 'lucide:youtube', 'lucide:youtube', 'lucide:youtube', 'lucide:youtube', 'lucide:youtube'],
  next: ['lucide:calendar-days', 'lucide:graduation-cap', 'lucide:wand-sparkles'],
}

const iconOf = (index: number) => ICONS[props.kind][index] ?? 'lucide:star'
const colourOf = (index: number) => `var(--${COLOURS[index % COLOURS.length]})`

/** Split `backtick` spans out of a line, so they render as code. */
const segments = (text: string) => text.split('`').map((part, index) => ({ part, code: index % 2 === 1 }))
</script>

<template>
  <div class="outro" :class="`is-${kind}`">
    <!-- The same five colours as the title slide, as a wash behind the cards. -->
    <div class="wash" aria-hidden="true"></div>

    <header class="outro-head">
      <div class="rule" aria-hidden="true">
        <span v-for="colour in COLOURS.slice(0, 5)" :key="colour" :style="{ background: `var(--${colour})` }"></span>
      </div>
      <h2 class="outro-title">{{ block.title }}</h2>
      <p class="outro-note">{{ block.note }}</p>
    </header>

    <div class="outro-cards">
      <div
        v-for="(card, index) in cards"
        :key="card.name"
        class="card"
        :style="{ '--accent': colourOf(index), '--t': `${0.25 + index * 0.07}s` }"
      >
        <span class="card-icon" aria-hidden="true">
          <Icon :name="iconOf(index)" />
        </span>

        <span class="card-body">
          <span class="card-name">{{ card.name }}</span>
          <span class="card-what">
            <template v-for="(bit, at) in segments(card.what)" :key="at">
              <code v-if="bit.code" class="inline-code">{{ bit.part }}</code>
              <template v-else>{{ bit.part }}</template>
            </template>
          </span>
          <span v-if="card.tag" class="card-tag">{{ card.tag }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outro {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 6vh 6vw 5vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Soft colour behind the corner, so the slide is not a white sheet of text. */
.wash {
  position: absolute;
  inset: auto -10vw -22vh auto;
  width: 46vw;
  height: 46vw;
  border-radius: 50%;
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in srgb, var(--lavender) 24%, transparent),
    color-mix(in srgb, var(--sky) 12%, transparent) 55%,
    transparent 70%
  );
  pointer-events: none;
}

.outro-head {
  position: relative;
  margin-bottom: 2.6vh;
}
.rule {
  display: flex;
  gap: 0.4vw;
  margin-bottom: 1.8vh;
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

.outro-title {
  font-size: clamp(1.5rem, 4.8vh, 3.2rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--text);
  animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both;
}
.outro-note {
  margin-top: 0.8vh;
  max-width: 62ch;
  font-size: clamp(0.65rem, 1.75vh, 1.1rem);
  line-height: 1.45;
  color: var(--text-dim);
  animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both;
}

.outro-cards {
  position: relative;
  flex: 1;
  min-height: 0;
  display: grid;
  /* Fills the slide instead of hugging the top: the cards are the slide. */
  align-content: center;
  gap: 1.6vh 1.6vw;
}
.is-can .outro-cards,
.is-watch .outro-cards {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.is-next .outro-cards {
  grid-template-columns: minmax(0, 1fr);
  gap: 1.6vh;
}

.card {
  display: flex;
  align-items: flex-start;
  gap: 1.1vh;
  padding: 1.2vh 1.4vh;
  border-radius: 1.1vh;
  background: var(--bg);
  border: 2px solid var(--border);
  /* The accent belongs to the card, not just to its icon. */
  border-left-color: var(--accent);
  border-left-width: 0.5vh;
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.is-watch .card:nth-child(-n+2),
.is-next .card:last-child {
  background: color-mix(in srgb, var(--accent) 9%, var(--bg));
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
  border-left-color: var(--accent);
}

.card-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 4.2vh;
  height: 4.2vh;
  border-radius: 1vh;
  background: color-mix(in srgb, var(--accent) 22%, var(--bg));
  color: color-mix(in srgb, var(--accent) 75%, var(--text));
  font-size: clamp(0.8rem, 2.3vh, 1.5rem);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.25vh;
  min-width: 0;
}
.card-name {
  font-size: clamp(0.7rem, 1.95vh, 1.2rem);
  font-weight: 800;
  color: var(--text);
}
.card-what {
  font-size: clamp(0.58rem, 1.55vh, 0.98rem);
  line-height: 1.4;
  color: var(--text-dim);
}
.card-tag {
  margin-top: 0.4vh;
  align-self: flex-start;
  padding: 0.25vh 0.8vh;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent) 20%, var(--bg));
  font-size: clamp(0.42rem, 1.1vh, 0.7rem);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--accent) 70%, var(--text));
}

.inline-code {
  padding: 0 0.3em;
  border-radius: 0.3em;
  background: var(--bg-off);
  font-family: var(--font-code);
  font-size: 0.92em;
  color: var(--text);
}

@keyframes rise {
  from { opacity: 0; translate: 0 1.2vh; }
  to { opacity: 1; translate: 0 0; }
}

/* A phone reads every list as one column. */
@media (max-width: 760px) {
  .outro-cards {
    grid-template-columns: minmax(0, 1fr) !important;
  }
  .wash {
    display: none;
  }
}
</style>
