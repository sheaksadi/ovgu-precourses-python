<script setup lang="ts">
/**
 * Everyday decisions, turned into code. Auto-imported as
 * `<LessonEverydayCode :stage="1" />`.
 *
 * Comes back to the cards of `LessonEverydayIf` once the room knows its
 * conditionals (PRE-0210 and its thirteen sub-slides, right after the
 * comparison lesson). Each card is taken from plain language to Python, and
 * each one shows a different form of `if`, so the forms arrive as ways of
 * saying something everyone already understands:
 *
 *   Regen      — a True/False variable, then flipped to False
 *   Akku       — a comparison as the question
 *   Ampel      — a third way: elif
 *   Wochenende — two questions, either will do: or
 *   Passwort   — two questions, both must hold: and
 *   Pizza      — a question inside the question: if inside if
 *
 * The steps come from the order of `everydayCode.variations`:
 *
 *   zoom    — (first card only) the grid returns, the rest step back, the
 *             card zooms into the left column.
 *   card    — the card up close, grown into its richer form where it has one,
 *             with its pseudo-code on the right. From the second card on, the
 *             previous card's code clears, the whole grid fades back in for a
 *             moment, and then the next card lifts out of it and zooms in while
 *             the rest step back, so every card starts from the same place.
 *   python  — the card has done its job: the pseudo-code moves over to the
 *             left, Python lands on the right and runs.
 *   flip    — (Regen only) True becomes False, the other way runs.
 *
 * The zoom needs each card's offset from the slot, which only the laid-out
 * page knows, so it is measured on mount and written to `--zx` / `--zy` /
 * `--zs` before the first frame is painted. Every step opens on the previous
 * step's last frame. Hovering a row of the card lights its pseudo-code lines,
 * and hovering `if` / `wenn` or `else` / `sonst` in the code lights the rows.
 * Every word comes from `everyday.*` and `everydayCode.*` in `locales/`.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useCodeLink } from '~/composables/useCodeLink'
import { useI18n } from '~/composables/useI18n'
import { everydayAccent, type EverydayScenario, type EverydayVariation } from '~/utils/everyday'

type StepKind = 'zoom' | 'card' | 'python' | 'flip'
interface Step { variation: number, kind: StepKind }

const props = defineProps<{ stage: number }>()
const { t, tm } = useI18n()
const link = useCodeLink()

const scenarios = computed(() => tm<EverydayScenario[]>('everyday.scenarios'))
const variations = computed(() => tm<EverydayVariation[]>('everydayCode.variations'))

const steps = computed<Step[]>(() => variations.value.flatMap((variation, index) => [
  ...(index === 0 ? [{ variation: index, kind: 'zoom' as const }] : []),
  { variation: index, kind: 'card' as const },
  { variation: index, kind: 'python' as const },
  ...(variation.flip ? [{ variation: index, kind: 'flip' as const }] : []),
]))

const step = computed(() => steps.value[Math.min(props.stage, steps.value.length) - 1]!)
const previous = computed(() => steps.value[props.stage - 2])
const current = computed(() => variations.value[step.value.variation]!)
/** The card before this one, when this step clears its code away. */
const outgoing = computed(() => (step.value.kind === 'card' && previous.value && previous.value.variation !== step.value.variation
  ? variations.value[previous.value.variation]!
  : null))

const title = computed(() => current.value.titles[step.value.kind])
const note = computed(() => current.value.notes[step.value.kind])
const python = computed(() => (step.value.kind === 'flip' ? current.value.flip!.python : current.value.python))
const output = computed(() => (step.value.kind === 'flip' ? current.value.flip!.output : current.value.output))

/** How a card appears on this step. */
function cardState(index: number) {
  if (index !== current.value.card) {
    if (step.value.kind === 'zoom') return 'stepping-back'
    return outgoing.value ? 'regrouping' : 'away'
  }
  if (step.value.kind === 'zoom') return 'zooming'
  if (step.value.kind === 'card') return outgoing.value ? 'arriving' : 'up-close'
  if (step.value.kind === 'python' && previous.value?.kind === 'card') return 'leaving'
  return 'away'
}
/** The richer rows show once the card is up close; they grow in on the step that brings it. */
const rowsFor = (index: number) => (index === current.value.card && step.value.kind !== 'zoom' ? current.value.rows : null)
const morphs = computed(() => step.value.kind === 'card' && (Boolean(outgoing.value) || previous.value?.kind === 'zoom'))

/** Rows under the pointer, or the rows the hovered keyword stands for. */
const hoveredRow = ref<string | null>(null)
const litRows = computed(() => {
  if (hoveredRow.value) return [hoveredRow.value]
  const active = link.activeLink.value
  if (active === 'branch') return current.value.rows.filter(row => row.kind === 'if' || row.kind === 'elif').map(row => row.key)
  if (active === 'otherwise') return current.value.rows.filter(row => row.kind === 'else' || row.kind === 'elif').map(row => row.key)
  return []
})
const pseudoFocus = computed(() => current.value.rows
  .filter(row => litRows.value.includes(row.key))
  .flatMap(row => row.lines ?? []))
const pythonFocus = computed(() => (step.value.kind === 'flip' ? current.value.flip!.focus : current.value.focus))

const list = ref<HTMLElement | null>(null)
const slot = ref<HTMLElement | null>(null)
const measured = ref(false)

/** Offset and scale from every card's place in the grid to the slot. */
function measure() {
  const grid = list.value
  const target = slot.value
  if (!grid || !target) return
  for (const card of Array.from(grid.children) as HTMLElement[]) {
    if (!card.offsetWidth) continue
    card.style.setProperty('--zx', `${target.offsetLeft - grid.offsetLeft - card.offsetLeft}px`)
    card.style.setProperty('--zy', `${target.offsetTop - grid.offsetTop - card.offsetTop}px`)
    card.style.setProperty('--zs', String(target.offsetWidth / card.offsetWidth))
  }
  measured.value = true
}

onMounted(() => {
  link.clear()
  measure()
  window.addEventListener('resize', measure)
})
onBeforeUnmount(() => window.removeEventListener('resize', measure))
</script>

<template>
  <div
    class="everyday-code relative w-full h-full overflow-hidden"
    :class="[`step-${step.kind}`, { measured, 'has-outgoing': outgoing }]"
    @click.self="link.clear()"
  >
    <header class="head">
      <span class="eyebrow">{{ t('everydayCode.eyebrow') }}</span>
      <h2 :key="title" class="title">{{ title }}</h2>
    </header>

    <ul ref="list" class="cards">
      <LessonEverydayCard
        v-for="(item, index) in scenarios"
        :key="item.icon"
        :item="item"
        :accent="everydayAccent(index)"
        face="pattern"
        :rows="rowsFor(index)"
        :morph="morphs"
        class="card"
        :class="`card-${cardState(index)}`"
        :style="{ '--t': `${0.15 + index * 0.08}s` }"
        :lit="index === current.card ? litRows : []"
        @row="hoveredRow = index === current.card ? $event : null"
      />
    </ul>

    <!-- Where the card up close sits; measured, never seen. -->
    <div ref="slot" class="slot" aria-hidden="true"></div>

    <!-- The previous card's code, clearing away for the next card. -->
    <template v-if="outgoing">
      <div class="dock dock-left dock-out" aria-hidden="true">
        <CodePanel :code="outgoing.pseudo" variant="pseudo" :linkable="false" />
      </div>
      <div class="dock dock-right dock-out" aria-hidden="true">
        <CodePanel :code="outgoing.flip?.python ?? outgoing.python" variant="python" :linkable="false" size="lg" />
        <div class="console">
          <span class="console-label">{{ t('everydayCode.output') }}</span>
          <span class="console-line">{{ outgoing.flip?.output ?? outgoing.output }}</span>
        </div>
      </div>
    </template>

    <div v-if="step.kind !== 'zoom'" class="dock pseudo-dock">
      <CodePanel :code="current.pseudo" variant="pseudo" :focus="pseudoFocus" :reveal="step.kind === 'card'" />
    </div>

    <div v-if="step.kind === 'python' || step.kind === 'flip'" class="dock dock-right python-dock">
      <CodePanel :code="python" variant="python" :focus="pythonFocus" :reveal="step.kind === 'python'" size="lg" />
      <div class="console">
        <span class="console-label">{{ t('everydayCode.output') }}</span>
        <span :key="output" class="console-line">{{ output }}</span>
      </div>
    </div>

    <p :key="note" class="note">{{ note }}</p>
  </div>
</template>

<style scoped>
.everyday-code {
  background: var(--bg);
  /* The left column holds the card, and later the pseudo-code; the right one
     the pseudo-code, and later Python. */
  --left: 6vw;
  --col: 38vw;
  --right: 50vw;
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
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
}

/* ─── Cards ──────────────────────────────────────────────────────────── */
.cards {
  position: absolute;
  top: 24vh;
  left: 6vw;
  right: 6vw;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: start;
  gap: 2.2vh 1.6vw;
  margin: 0;
  padding: 0;
  list-style: none;
}
.card {
  transform-origin: top left;
}
.slot {
  position: absolute;
  top: 25vh;
  left: var(--left);
  width: 34vw;
  visibility: hidden;
}

.everyday-code:not(.measured) .card {
  opacity: 0;
}
.card-away {
  visibility: hidden;
}
.card-stepping-back {
  animation:
    rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both,
    step-back 0.45s ease 2s forwards;
}
.card-zooming {
  z-index: 2;
  animation:
    rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both,
    zoom 0.85s cubic-bezier(0.65, 0, 0.35, 1) 2.3s forwards;
}
.card-up-close {
  z-index: 2;
  transform: translate(var(--zx), var(--zy)) scale(var(--zs));
  --morph-at: 0.3s;
}
/* Between two cards: the grid fades back in where it was, holds a moment,
   then the next card lifts out of it and zooms in while the rest step back. */
.card-regrouping {
  animation:
    regroup 0.5s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--t) + 0.2s) both,
    step-back 0.45s ease 1.7s forwards;
}
.card-arriving {
  z-index: 2;
  --morph-at: 2.95s;
  animation:
    regroup 0.5s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--t) + 0.2s) both,
    lift 0.45s cubic-bezier(0.22, 1, 0.36, 1) 1.55s forwards,
    zoom 0.85s cubic-bezier(0.65, 0, 0.35, 1) 2s forwards;
}
.card-leaving {
  z-index: 2;
  transform: translate(var(--zx), var(--zy)) scale(var(--zs));
  animation: vanish 0.3s ease forwards;
}

/* ─── Code ───────────────────────────────────────────────────────────── */
.dock {
  position: absolute;
  top: 25vh;
  display: flex;
  flex-direction: column;
  gap: 1.8vh;
}
.pseudo-dock {
  left: var(--right);
  width: var(--col);
}
.dock-left {
  left: var(--left);
  width: var(--col);
}
.dock-right {
  left: var(--right);
  right: 6vw;
}
.dock-out {
  animation: vanish 0.3s ease forwards;
  pointer-events: none;
}

.step-card .pseudo-dock {
  animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
}
.step-card.has-outgoing .pseudo-dock {
  animation-delay: 3.1s;
}
/* The pseudo-code moves over to where the card was; Python takes its place. */
.step-python .pseudo-dock,
.step-flip .pseudo-dock {
  left: var(--left);
}
.step-python .pseudo-dock {
  animation: move-left 0.6s cubic-bezier(0.65, 0, 0.35, 1) 0.25s both;
}
.step-python .python-dock {
  animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.8s both;
}
.step-python .console {
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) 1.7s both;
}
.step-flip .console-line {
  animation: appear 0.35s ease 0.5s both;
}

/* ─── Output ─────────────────────────────────────────────────────────── */
.console {
  display: flex;
  flex-direction: column;
  gap: 0.8vh;
  padding: 1.6vh 1.4vw;
  border-radius: 1.4vh;
  background: var(--text);
}
.console-label {
  font-size: clamp(0.55rem, 1.2vh, 0.8rem);
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--bg) 55%, transparent);
}
.console-line {
  font-family: var(--font-code);
  font-size: clamp(0.8rem, 2.2vh, 1.4rem);
  color: var(--bg);
}

/* ─── Note ───────────────────────────────────────────────────────────── */
.note {
  position: absolute;
  left: var(--left);
  width: var(--col);
  bottom: 9vh;
  font-size: clamp(0.75rem, 2vh, 1.3rem);
  line-height: 1.45;
  color: var(--text-dim);
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
}
.step-zoom .note {
  right: 6vw;
  width: auto;
  max-width: 70ch;
  animation-delay: 3.1s;
}
.has-outgoing .note {
  animation-delay: 3.1s;
}

/* ─── Phones held upright ────────────────────────────────────────────── */
/* Same pattern as DoorProblem: the absolutely-placed pieces go static in
   reading order and the root becomes one scrolling column. There is no room
   for a zoom beside the code, so only the current card shows, full width. */
@media (orientation: portrait) and (max-width: 760px) {
  .everyday-code {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 3.5rem 1rem 5rem;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .head,
  .cards,
  .dock,
  .everyday-code .note {
    position: static;
    inset: auto;
    width: auto;
  }
  .slot,
  .dock-out,
  .card-away,
  .card-regrouping,
  .card-leaving {
    display: none;
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
  .everyday-code .card {
    transform: none;
    animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    opacity: 1;
  }
  .step-zoom .card-stepping-back {
    display: none;
  }
  .everyday-code .dock {
    animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
    gap: 0.9rem;
  }
  .dock :deep(.code-panel) {
    overflow-x: auto;
  }
  .console {
    padding: 0.8rem 1rem;
    border-radius: 0.8rem;
  }
  .console-line {
    font-size: 1rem;
  }
  .everyday-code .note {
    font-size: 1rem;
    animation-delay: 0.3s;
  }
}

/* ─── Keyframes ──────────────────────────────────────────────────────── */
@keyframes zoom {
  from { transform: none; }
  to { transform: translate(var(--zx), var(--zy)) scale(var(--zs)); }
}
@keyframes regroup {
  from { opacity: 0; transform: scale(0.94); }
  to { opacity: 1; transform: none; }
}
/* The chosen card lights its border as it lifts, so the eye knows which one comes next. */
@keyframes lift {
  50% { transform: translateY(-1vh) scale(1.03); }
  to { transform: none; border-color: var(--accent-line); }
}
@keyframes step-back {
  from { opacity: 1; transform: none; }
  to { opacity: 0; transform: scale(0.94); }
}
@keyframes move-left {
  from { transform: translateX(calc(var(--right) - var(--left))); }
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
