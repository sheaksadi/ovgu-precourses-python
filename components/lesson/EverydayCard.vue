<script setup lang="ts">
/**
 * One everyday decision as a card: a question, the way for yes, the way for
 * no. Auto-imported as `<LessonEverydayCard>`; used by `LessonEverydayIf` and
 * `LessonEverydayCode`.
 *
 * Without `rows`, the card shows its own three rows and `face` picks the
 * wording: `ask` reads like a question with Ja and Nein, `pattern` reads as
 * wenn / dann / sonst, and `swap` starts on `ask` and flips over into
 * `pattern`, like a card turned over, at `--flip-at` (a CSS time on the card).
 *
 * With `rows`, the card shows a richer version of the same decision (a third
 * way, a second question, a question inside the question). With `morph` it
 * gets there from its own three rows at `--morph-at` (a CSS time on the card):
 * rows that share a key change their words in place and move to their depth,
 * and new rows grow open between them.
 *
 * Labels stack both wordings in one grid cell, so a change never reflows the
 * row. `reveal` holds the answer rows back until `--rows-at`. `lit` lights
 * rows by key, and hovering a row reports its key as `row`.
 */
import { computed } from 'vue'
import { EVERYDAY_ICONS, everydayTint, type EverydayDetailRow, type EverydayKind, type EverydayScenario } from '~/utils/everyday'
import { useI18n } from '~/composables/useI18n'

interface ShownRow {
  key: string
  kind: EverydayKind
  depth: number
  text: string
  /** The words the row had before, when they differ. */
  before?: string
  /** The question-style tag (Frage, Ja, Nein), for the card's own rows. */
  tagBefore?: string
  /** Not one of the card's own rows: it grows open when the card morphs. */
  isNew: boolean
  /** One of the card's own rows, moving in under a new question. */
  shifted: boolean
}

const props = withDefaults(defineProps<{
  item: EverydayScenario
  accent: string
  face?: 'ask' | 'pattern' | 'swap'
  rows?: EverydayDetailRow[] | null
  morph?: boolean
  reveal?: boolean
  lit?: string[]
}>(), {
  face: 'ask',
  rows: null,
  morph: false,
  reveal: false,
  lit: () => [],
})

const emit = defineEmits<{ row: [key: string | null] }>()
const { t } = useI18n()

const own = computed<ShownRow[]>(() => [
  { key: 'if', kind: 'if', depth: 0, text: props.item.condition, before: props.item.question, tagBefore: t('everyday.question'), isNew: false, shifted: false },
  { key: 'then', kind: 'then', depth: 0, text: props.item.yes, tagBefore: t('everyday.yes'), isNew: false, shifted: false },
  { key: 'else', kind: 'else', depth: 0, text: props.item.no, tagBefore: t('everyday.no'), isNew: false, shifted: false },
])

const shown = computed<ShownRow[]>(() => {
  if (!props.rows) return own.value
  return props.rows.map((row) => {
    const mine = own.value.find(candidate => candidate.key === row.key)
    const depth = row.depth ?? 0
    return {
      key: row.key,
      kind: row.kind,
      depth,
      text: row.text,
      before: mine && mine.text !== row.text ? mine.text : undefined,
      isNew: !mine,
      shifted: Boolean(mine) && depth > 0,
    }
  })
})

const mode = computed(() => (props.rows ? (props.morph ? 'morph' : 'detail') : props.face))

const LABELS: Record<EverydayKind, string> = { if: 'everyday.if', elif: 'everyday.elif', then: 'everyday.then', else: 'everyday.else' }
const TAGS: Record<EverydayKind, string> = { if: 'tag-if', elif: 'tag-if', then: 'tag-yes', else: 'tag-no' }

/** Rows that grow open are counted on their own, so they open one after another. */
const newIndex = (key: string) => shown.value.filter(row => row.isNew).findIndex(row => row.key === key)
</script>

<template>
  <li
    class="card"
    :class="[`mode-${mode}`, { reveal, 'wide-tags': shown.some(row => row.kind === 'elif') }]"
    :style="everydayTint(accent)"
    @mouseleave="emit('row', null)"
  >
    <span class="icon" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.9"
        stroke-linecap="round"
        stroke-linejoin="round"
        v-html="EVERYDAY_ICONS[item.icon]"
      />
    </span>

    <div
      v-for="(row, index) in shown"
      :key="row.key"
      class="row"
      :class="[`row-${row.kind}`, {
        'row-first': index === 0,
        'row-lit': lit.includes(row.key),
        'row-new': row.isNew,
        'row-shifted': row.shifted,
      }]"
      :style="{ '--i': index, '--n': newIndex(row.key), '--depth': row.depth }"
      @mouseenter="emit('row', row.key)"
    >
      <span class="tag">
        <span v-if="row.tagBefore" class="face face-a tag-q" :class="row.kind !== 'if' && TAGS[row.kind]">{{ row.tagBefore }}</span>
        <span class="face" :class="[TAGS[row.kind], { 'face-b': row.tagBefore }]">{{ t(LABELS[row.kind]) }}</span>
      </span>
      <span class="text" :class="{ 'text-q': row.kind === 'if' || row.kind === 'elif' }">
        <span v-if="row.before" class="face face-a">{{ row.before }}</span>
        <span class="face" :class="{ 'face-b': row.before }">{{ row.text }}</span>
      </span>
    </div>
  </li>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 2vh 1.6vw 2.2vh;
  border: 2px solid var(--border);
  border-radius: 1.8vh;
  background: var(--bg);
  list-style: none;
  transition: border-color 0.2s ease;
}
.card:hover {
  border-color: var(--accent-line);
}

/* Faces stack in one grid cell, so a label can change without reflowing. */
.tag,
.text {
  display: inline-grid;
}
.face {
  grid-area: 1 / 1;
  /* The longer face sets the cell; the shorter one sits in its middle, level
     with the tag beside it, instead of riding at the top. */
  align-self: center;
}

.icon {
  position: absolute;
  top: 1.6vh;
  right: 1.2vw;
  display: grid;
  place-items: center;
  width: 5.2vh;
  height: 5.2vh;
  border-radius: 999px;
  background: var(--accent-fill);
  color: var(--text);
}
.icon svg {
  width: 62%;
  height: 62%;
}
.icon :deep(.fill) {
  fill: var(--accent-line);
}

.row {
  display: flex;
  align-items: center;
  gap: 0.8vw;
  min-width: 0;
  margin: 1.1vh -0.6vw 0;
  padding: 0.3vh 0.6vw 0.3vh calc(0.6vw + var(--depth) * 3vw);
  border-radius: 1vh;
  transition: background 0.25s ease;
}
.row-first {
  margin-top: 0;
  margin-bottom: 0.4vh;
  padding-right: 6.2vh;
  min-height: 5.2vh;
}
.row-lit {
  background: color-mix(in srgb, var(--accent-line) 16%, transparent);
}

.tag {
  flex: none;
  min-width: 8.8vh;
}
/* "sonst wenn" is the longest tag; with one on the card, every text lines up after it. */
.wide-tags .tag {
  min-width: 14.5vh;
}
.tag .face {
  justify-self: start;
  padding: calc(0.4vh + 0.34em) 1vh;
  text-box: trim-both cap alphabetic;
  border-radius: 999px;
  font-size: clamp(0.55rem, 1.25vh, 0.85rem);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  color: #FFFFFF;
}
.tag-q {
  background: var(--text);
  color: var(--bg);
}
.tag-if {
  background: var(--sky);
}
.tag-yes {
  background: var(--mint);
  color: #FFFFFF;
}
.tag-no {
  background: var(--coral);
  color: #FFFFFF;
}

.text {
  min-width: 0;
  font-size: clamp(0.8rem, 2vh, 1.35rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-dim);
}
.text-q {
  font-size: clamp(0.9rem, 2.4vh, 1.6rem);
  font-weight: 800;
  color: var(--text);
}

/* ─── Wording ────────────────────────────────────────────────────────── */
.mode-ask .face-b,
.mode-pattern .face-a,
.mode-detail .face-a {
  opacity: 0;
}

/* The whole card turns over; the words change while it stands edge-on, so
   the new side is simply the back of the card. */
.mode-swap {
  animation: flip 0.7s cubic-bezier(0.45, 0, 0.25, 1) var(--flip-at, 0s) both;
}
.mode-swap .face-a {
  animation: vanish 0s linear calc(var(--flip-at, 0s) + 0.35s) both;
}
.mode-swap .face-b {
  animation: appear 0s linear calc(var(--flip-at, 0s) + 0.35s) both;
}

/* Question first, then the ways out of it. */
.reveal .row:not(.row-first) {
  animation: appear 0.35s ease calc(var(--rows-at, 0s) + (var(--i) - 1) * 0.25s) both;
}

/* ─── Morph: the card's own rows become the richer decision ──────────── */
.mode-morph .face-a {
  animation: vanish 0.25s ease var(--morph-at, 0s) both;
}
.mode-morph .face-b {
  animation: appear 0.3s ease calc(var(--morph-at, 0s) + 0.2s) both;
}
.mode-morph .row-new {
  overflow: hidden;
  animation: grow 0.5s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--morph-at, 0s) + var(--n) * 0.3s) both;
}
.mode-morph .row-shifted {
  animation: shift 0.5s cubic-bezier(0.22, 1, 0.36, 1) var(--morph-at, 0s) both;
}

/* ─── Phones held upright ────────────────────────────────────────────── */
@media (orientation: portrait) and (max-width: 760px) {
  .card {
    padding: 0.9rem 1rem;
    border-radius: 1rem;
  }
  .icon {
    top: 0.8rem;
    right: 0.9rem;
    width: 2.4rem;
    height: 2.4rem;
  }
  .row {
    gap: 0.6rem;
    margin: 0.5rem -0.4rem 0;
    padding: 0.2rem 0.4rem 0.2rem calc(0.4rem + var(--depth) * 1.2rem);
  }
  .row-first {
    min-height: 2.4rem;
    margin-top: 0;
    margin-bottom: 0;
    padding-right: 2.8rem;
  }
  .tag {
    min-width: 4.2rem;
  }
  .wide-tags .tag {
    min-width: 6.6rem;
  }
  .tag .face {
    padding: calc(0.2rem + 0.34em) 0.55rem;
    font-size: 0.62rem;
  }
  .text {
    font-size: 0.95rem;
  }
  .text-q {
    font-size: 1.05rem;
  }
}

@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes vanish {
  from { opacity: 1; }
  to { opacity: 0; }
}
@keyframes flip {
  from { transform: perspective(240vh) rotateY(0deg); }
  50% { transform: perspective(240vh) rotateY(90deg); }
  to { transform: perspective(240vh) rotateY(0deg); }
}
@keyframes grow {
  from { max-height: 0; margin-top: 0; padding-block: 0; opacity: 0; }
  60% { opacity: 0; }
  to { max-height: 12vh; opacity: 1; }
}
@keyframes shift {
  from { padding-left: 0.6vw; }
}
</style>
