<script setup lang="ts">
/**
 * The three closing slides. Auto-imported as `<LessonOutro kind="can" />`.
 *
 *   can   — what the room can do now, one line per section of the course
 *   watch — channels worth watching, 3Blue1Brown and Sebastian Lague first
 *   next  — where to keep practising, ending on the honest advice: automate
 *           something annoying and actually finish it
 *
 * No code panel here: nothing is being taught any more, so the slide is a title
 * and a set of cards that land one after another. Words come from `outro.*` in
 * `locales/`, which is also where the channel list lives — the recommendations
 * are opinions, and opinions belong in the text, not in the markup.
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

/** Split `backtick` spans out of a line, so they render as code. */
const segments = (text: string) => text.split('`').map((part, index) => ({ part, code: index % 2 === 1 }))
</script>

<template>
  <div class="outro" :class="`is-${kind}`">
    <header class="outro-head">
      <h2 class="outro-title">{{ block.title }}</h2>
      <p class="outro-note">{{ block.note }}</p>
    </header>

    <div class="outro-cards">
      <div
        v-for="(card, index) in cards"
        :key="card.name"
        class="card"
        :style="{ '--t': `${0.25 + index * 0.07}s` }"
      >
        <span class="card-name">{{ card.name }}</span>
        <span class="card-what">
          <template v-for="(bit, at) in segments(card.what)" :key="at">
            <code v-if="bit.code" class="inline-code">{{ bit.part }}</code>
            <template v-else>{{ bit.part }}</template>
          </template>
        </span>
        <span v-if="card.tag" class="card-tag">{{ card.tag }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outro {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 7vh 6vw 6vh;
  overflow: hidden;
}

.outro-head {
  margin-bottom: 3vh;
}
.outro-title {
  font-size: clamp(1.6rem, 5.2vh, 3.4rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--text);
  animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.outro-note {
  margin-top: 1vh;
  max-width: 60ch;
  font-size: clamp(0.7rem, 1.9vh, 1.15rem);
  line-height: 1.45;
  color: var(--text-dim);
  animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
}

.outro-cards {
  display: grid;
  gap: 1.2vh 1.6vw;
}
/* Ten short lines read as two columns; three long ones read as one. */
.is-can .outro-cards {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.is-watch .outro-cards {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.is-next .outro-cards {
  grid-template-columns: minmax(0, 1fr);
  gap: 1.6vh;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.3vh;
  padding: 1.3vh 1.5vh;
  border-radius: 1.1vh;
  background: var(--bg-off);
  border: 2px solid transparent;
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.is-watch .card,
.is-next .card {
  background: var(--bg);
  border-color: var(--border);
}
/* The first two channels are the ones actually being recommended. */
.is-watch .card:nth-child(-n+2) {
  border-color: var(--lavender);
}
.is-next .card:last-child {
  border-color: var(--mint);
}

.card-name {
  font-size: clamp(0.72rem, 2vh, 1.25rem);
  font-weight: 800;
  color: var(--text);
}
.card-what {
  font-size: clamp(0.6rem, 1.6vh, 1rem);
  line-height: 1.4;
  color: var(--text-dim);
}
.card-tag {
  margin-top: 0.4vh;
  align-self: flex-start;
  padding: 0.25vh 0.8vh;
  border-radius: 999px;
  background: var(--bg-off);
  font-size: clamp(0.45rem, 1.15vh, 0.72rem);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.is-watch .card:nth-child(-n+2) .card-tag {
  background: color-mix(in srgb, var(--lavender) 22%, var(--bg));
  color: var(--lavender);
}
.is-next .card:last-child .card-tag {
  background: color-mix(in srgb, var(--mint) 25%, var(--bg));
  color: var(--text);
}

.inline-code {
  padding: 0 0.3em;
  border-radius: 0.3em;
  background: var(--bg);
  font-family: var(--font-code);
  font-size: 0.92em;
  color: var(--text);
}
.is-watch .inline-code,
.is-next .inline-code {
  background: var(--bg-off);
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
}
</style>
