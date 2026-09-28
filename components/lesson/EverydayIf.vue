<script setup lang="ts">
/**
 * Everyday decisions, before any code. Auto-imported as
 * `<LessonEverydayIf :stage="1" />`.
 *
 * Sits between the introductions and Momo's door (PRE-0208 and its seven
 * sub-slides). Nobody has seen `if` yet, so the slide builds the intuition
 * first: we make yes/no decisions all day long, and every one of them has the
 * same shape. The words `if` and `else` stay out of it on purpose; they arrive
 * with `LessonEverydayCode`, once the room knows its conditionals.
 *
 *   1–6. One card per step. The card of the step lands big in the middle, its
 *        two answers appear under it, and on the next step it flies to its
 *        place in the grid while the next card lands.
 *   7.   The last card flies home and the room is asked for its own examples.
 *   8.   The cards turn over one after another, a quick wave across the
 *        grid, and their backs read as the pattern: the question becomes a
 *        "wenn" sentence, Ja becomes "dann", Nein becomes "sonst". The
 *        pattern bar then names the three parts.
 *
 * Every step opens on the previous step's last frame. The card in the middle
 * always sits above the grid, and the one flying home above the cards already
 * there, so nothing ever slides underneath. The flight needs each card's
 * distance to the middle, which only the laid-out page knows, so it is
 * measured on mount and written to `--dx` / `--dy` before the first frame is
 * painted. Every word comes from `everyday.*` in `locales/`.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { everydayAccent, type EverydayScenario } from '~/utils/everyday'

const props = defineProps<{ stage: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 }>()
const { t, tm } = useI18n()

const scenarios = computed(() => tm<EverydayScenario[]>('everyday.scenarios'))

/** The card this step lands in the middle, and the one it sends home. */
const landing = computed(() => (props.stage <= 6 ? props.stage - 1 : -1))
const leaving = computed(() => (props.stage >= 2 && props.stage <= 7 ? props.stage - 2 : -1))

/** When the landing card appears: straight away, or once the last one has left. */
const LAND_AT = computed(() => (leaving.value >= 0 ? 0.45 : 0.3))

function cardState(index: number) {
  if (index === landing.value) return 'landing'
  if (index === leaving.value) return 'leaving'
  if (props.stage === 8 || index < props.stage - 1) return 'home'
  return 'waiting'
}

const root = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)
const measured = ref(false)

/** How far each card sits from the middle of the slide, so it can fly from there. */
function measure() {
  const box = root.value
  const grid = list.value
  if (!box || !grid) return
  const midX = box.clientWidth / 2
  const midY = box.clientHeight * 0.52
  for (const card of Array.from(grid.children) as HTMLElement[]) {
    const x = grid.offsetLeft + card.offsetLeft + card.offsetWidth / 2
    const y = grid.offsetTop + card.offsetTop + card.offsetHeight / 2
    card.style.setProperty('--dx', `${midX - x}px`)
    card.style.setProperty('--dy', `${midY - y}px`)
  }
  measured.value = true
}

onMounted(() => {
  measure()
  window.addEventListener('resize', measure)
})
onBeforeUnmount(() => window.removeEventListener('resize', measure))
</script>

<template>
  <div
    ref="root"
    class="everyday relative w-full h-full overflow-hidden"
    :class="[`stage-${stage}`, { measured }]"
    :style="{ '--land-at': `${LAND_AT}s`, '--rows-at': `${LAND_AT + 0.45}s` }"
  >
    <header class="head">
      <span class="eyebrow">{{ t('everyday.eyebrow') }}</span>
      <h2 class="title">
        <span class="face face-1">{{ t('everyday.title1') }}</span>
        <span class="face face-2">{{ t('everyday.title2') }}</span>
      </h2>
    </header>

    <ul ref="list" class="cards">
      <LessonEverydayCard
        v-for="(item, index) in scenarios"
        :key="item.icon"
        :item="item"
        :accent="everydayAccent(index)"
        :face="stage === 8 ? 'swap' : 'ask'"
        :reveal="cardState(index) === 'landing'"
        class="card"
        :class="`card-${cardState(index)}`"
        :style="{ '--flip-at': `${0.2 + index * 0.09}s` }"
      />
    </ul>

    <div class="foot">
      <p class="prompt">
        {{ t('everyday.prompt') }}
        <strong>{{ t('everyday.ask') }}</strong>
      </p>

      <div class="pattern">
        <span class="part">
          <span class="pill tag-if">{{ t('everyday.if') }}</span>
          {{ t('everyday.patternIf') }}
        </span>
        <span class="part">
          <span class="pill tag-yes">{{ t('everyday.then') }}</span>
          {{ t('everyday.patternThen') }}
        </span>
        <span class="part">
          <span class="pill tag-no">{{ t('everyday.else') }}</span>
          {{ t('everyday.patternElse') }}
        </span>
        <span class="next">{{ t('everyday.next') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.everyday {
  background: var(--bg);
}

/* Title faces stack in one grid cell, so the swap never reflows. */
.title {
  display: inline-grid;
}
.face {
  grid-area: 1 / 1;
}

/* ─── Header ─────────────────────────────────────────────────────────── */
.head {
  position: absolute;
  top: 7vh;
  left: 6vw;
  right: 6vw;
}
.eyebrow {
  display: block;
  margin-bottom: 1.4vh;
  font-size: clamp(0.65rem, 1.35vh, 0.9rem);
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.title {
  font-size: clamp(1.8rem, 6vh, 4.2rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--text);
}

/* ─── Cards ──────────────────────────────────────────────────────────── */
.cards {
  position: absolute;
  top: 24vh;
  left: 6vw;
  right: 6vw;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2.2vh 1.6vw;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* ─── Foot ───────────────────────────────────────────────────────────── */
.foot {
  position: absolute;
  left: 6vw;
  right: 6vw;
  bottom: 9vh;
  display: grid;
}
.prompt,
.pattern {
  grid-area: 1 / 1;
  align-self: end;
}
.prompt {
  font-size: clamp(0.8rem, 2.2vh, 1.5rem);
  color: var(--text-dim);
}
.prompt strong {
  color: var(--text);
}

.pattern {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.2vh 2.4vw;
  font-size: clamp(0.75rem, 2vh, 1.35rem);
  font-weight: 700;
  color: var(--text);
}
.part {
  display: inline-flex;
  align-items: center;
  gap: 0.7vw;
}
.pill {
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
.tag-if {
  background: var(--sky);
}
.tag-yes {
  background: var(--mint);
}
.tag-no {
  background: var(--coral);
}
.next {
  flex-basis: 100%;
  font-size: clamp(0.7rem, 1.8vh, 1.2rem);
  font-weight: 600;
  color: var(--text-dim);
}

/* ─── Steps 1–7: one card at a time, middle first, then its place ───── */
.stage-8 .face-1 {
  animation: vanish 0.25s ease both;
}
.face-2,
.pattern {
  opacity: 0;
}
.stage-1 .eyebrow,
.stage-1 .title {
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
}

.card-waiting {
  visibility: hidden;
}
/* Until the distances are known, a card has nowhere to fly from. */
.everyday:not(.measured) .card-landing,
.everyday:not(.measured) .card-leaving {
  opacity: 0;
}
.card-home {
  z-index: 1;
}
.card-leaving {
  z-index: 2;
  animation: go-home 0.6s cubic-bezier(0.65, 0, 0.35, 1) both;
}
.card-landing {
  z-index: 3;
  animation: land 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) var(--land-at) both;
}

.prompt {
  opacity: 0;
}
.stage-7 .prompt {
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.7s both;
}

/* ─── Step 8: the same cards, reworded into the pattern ──────────────── */
.stage-8 .title .face-2 {
  opacity: 1;
  animation: appear 0.3s ease 0.2s both;
}
.stage-8 .pattern {
  opacity: 1;
  animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) 1.3s both;
}

/* ─── Phones held upright ────────────────────────────────────────────── */
/* No LessonShell here, so the same pattern as DoorProblem: the
   absolutely-placed pieces go static in reading order, the root becomes one
   scrolling column, and the cards stack one per row. The flight from the
   middle only reads on a screen that shows the whole grid, so here the cards
   simply rise one after another. */
@media (orientation: portrait) and (max-width: 760px) {
  .everyday {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 3.5rem 1rem 5rem;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .head,
  .cards,
  .foot {
    position: static;
    inset: auto;
  }
  .eyebrow {
    margin-bottom: 0.6rem;
    font-size: 0.7rem;
  }
  .title {
    font-size: clamp(1.6rem, 7vw, 2.4rem);
  }
  .cards {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.75rem;
  }
  /* A phone shows one column, so the cards simply stack up as they come. */
  .card-leaving {
    animation: none;
  }
  .card-landing {
    animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
  }
  .foot {
    margin-top: 0.5rem;
  }
  .prompt {
    font-size: 1rem;
  }
  .pattern {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
    font-size: 0.95rem;
  }
  .part {
    gap: 0.6rem;
  }
  .pill {
    padding: calc(0.2rem + 0.34em) 0.55rem;
    font-size: 0.62rem;
  }
  .next {
    flex-basis: auto;
    font-size: 0.9rem;
  }
}

/* ─── Keyframes ──────────────────────────────────────────────────────── */
/* Land big in the middle, and later fly home from there. */
@keyframes land {
  from { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.9); }
  to { opacity: 1; transform: translate(var(--dx), var(--dy)) scale(1.3); }
}
@keyframes go-home {
  from { transform: translate(var(--dx), var(--dy)) scale(1.3); }
  to { transform: none; }
}
@keyframes rise {
  from { opacity: 0; transform: translateY(2.5vh); }
  to { opacity: 1; transform: none; }
}
@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes vanish {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
