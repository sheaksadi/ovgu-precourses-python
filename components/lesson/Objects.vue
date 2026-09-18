<script setup lang="ts">
/**
 * Objects lesson: "Viele Katzen, ein Bauplan". Auto-imported as
 * `<LessonObjects :stage="1" />`.
 *
 * The last teaching block, after the APIs section, and the one the deck has
 * been hinting at twice (`DataFrame(...)` in the libraries scene, methods on
 * strings and lists). PRE-0166 and its seven sub-slides:
 *
 *   1. three cats in three parallel lists, and what happens when one slips
 *   2. one dictionary per cat: the data is together, the behaviour is not
 *   3. blueprint and thing built from it, as a cutter and its cookies
 *   4. `class`, `__init__` and `self`
 *   5. attributes through the dot, read and written
 *   6. methods, and why `self` comes first
 *   7. three cats from one class, each with its own values
 *   8. the punchline: `.upper()`, `.append()`, `DataFrame(...)`
 *
 * Stages 1 and 2 keep the old picture and put the new one beside it, so the
 * problem stays visible while it is being solved. The cards are the same shape
 * throughout: a cat is a title and its fields, whether it is drawn as a
 * dictionary, a blueprint or an object. Words come from `objects.*` in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

interface Stage {
  headline: string
  note: string
  code: string
  focus: number[]
  output: string[]
  outputFrom: number
}

interface Known {
  name: string
  example: string
  note: string
}

const props = defineProps<{ stage: StageNumber }>()
const { t, tm } = useI18n()

const stages = computed(() => tm<Stage[]>('objects.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const listNames = computed(() => tm<Record<string, string>>('objects.lists'))
const plan = computed(() => tm<{ has: string[], can: string[] }>('objects.plan'))
const known = computed(() => tm<Known[]>('objects.known'))

/** The three cats, as every stage tells them. */
const CATS = [
  { name: 'Momo', hunger: 8, mood: 'müde' },
  { name: 'Bello', hunger: 3, mood: 'wach' },
  { name: 'Kiki', hunger: 5, mood: 'wach' },
]

/** Stage 5 writes the value, stage 6 feeds it: same card, different number. */
const momoHunger = computed(() => {
  if (props.stage === 5) return { from: 8, to: 2 }
  if (props.stage === 6 || props.stage === 7) return { from: 8, to: 3 }
  return { from: 8, to: 8 }
})
const flips = computed(() => props.stage >= 5 && props.stage <= 7)
</script>

<template>
  <LessonShell
    :eyebrow="t('objects.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :variant="stage === 3 ? 'pseudo' : 'python'"
    :file="t('objects.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="current.outputFrom"
    :dense="stage === 6"
    :output-label="t('objects.output')"
    :no-output="t('objects.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <!-- 1: three lists, and the slip -->
      <div v-if="stage === 1" class="lists">
        <div v-for="(row, r) in ['names', 'hunger', 'mood']" :key="row" class="list" :style="{ '--t': `${r * 0.15}s` }">
          <span class="list-name">{{ listNames[row] }}</span>
          <span
            v-for="(cat, i) in CATS"
            :key="cat.name"
            class="cell"
            :class="{ 'is-lit': i === 1 }"
          >{{ row === 'names' ? cat.name : row === 'hunger' ? cat.hunger : cat.mood }}</span>
        </div>
        <span class="warn">{{ t('objects.shifted') }} ➜</span>
      </div>

      <!-- 8: objects you already used -->
      <div v-else-if="stage === 8" class="knowns">
        <div v-for="(item, i) in known" :key="item.name" class="known" :style="{ '--t': `${0.15 + i * 0.15}s` }">
          <span class="known-name">{{ item.name }}</span>
          <code class="known-example">{{ item.example }}</code>
          <span class="known-note">{{ item.note }}</span>
        </div>
      </div>

      <!-- 2–7: the cat as a card, and what the stage does to it -->
      <div v-else class="cards" :class="{ 'is-many': stage === 7 }">
        <!-- 3–4: the blueprint the cards come from -->
        <div v-if="stage === 3 || stage === 4" class="plan">
          <span class="plan-tag">{{ t('objects.blueprint') }}</span>
          <span class="plan-name">Katze</span>
          <span class="plan-row"><span class="plan-label">{{ t('objects.hasLabel') }}</span>{{ plan.has.join(', ') }}</span>
          <span class="plan-row"><span class="plan-label">{{ t('objects.canLabel') }}</span>{{ plan.can.join(', ') }}</span>
        </div>

        <div
          v-for="(cat, i) in (stage === 7 || stage === 3 ? CATS : CATS.slice(0, 1))"
          :key="cat.name"
          class="card"
          :class="{ 'is-dict': stage === 2, 'is-acting': stage >= 5 && i === 0 }"
          :style="{ '--t': `${0.3 + i * 0.18}s` }"
        >
          <span class="card-name">{{ cat.name }}</span>
          <span class="card-row">
            <span class="card-key">name</span>
            <span class="card-value">{{ cat.name }}</span>
          </span>
          <span class="card-row">
            <span class="card-key">hunger</span>
            <span class="card-value" :class="{ 'is-flipping': flips && i === 0 }">
              <span v-if="flips && i === 0" class="value-face value-old">{{ momoHunger.from }}</span>
              <span class="value-face value-new">{{ i === 0 ? momoHunger.to : cat.hunger }}</span>
            </span>
          </span>
          <span v-if="stage >= 6 && i === 0" class="card-call">{{ t('objects.call') }}</span>
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
  align-items: center;
  justify-content: center;
  padding: 3vh 5%;
}

/* ─── 1: parallel lists ──────────────────────────────────────────────── */
.lists {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1vh;
  width: 100%;
}
.list {
  display: grid;
  grid-template-columns: 7ch repeat(3, 1fr);
  align-items: center;
  gap: 0.8vh;
  animation: fade-in 0.4s ease var(--t) both;
}
.list-name {
  font-family: var(--font-code);
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 700;
  color: var(--text-dim);
}
.cell {
  padding: 1vh 0.6vh;
  border-radius: 0.8vh;
  background: var(--bg);
  border: 2px solid var(--border);
  text-align: center;
  font-family: var(--font-code);
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 700;
  color: var(--text);
}
.cell.is-lit {
  background: color-mix(in srgb, var(--sun) 45%, var(--bg));
  border-color: var(--sun);
}
/* The third row is drawn one place to the right: the slip, as a picture. */
.stage-1 .list:last-of-type .cell {
  translate: 12% 0;
  border-style: dashed;
  border-color: var(--coral);
}
.warn {
  position: absolute;
  right: 0;
  bottom: -3.4vh;
  font-size: clamp(0.5rem, 1.25vh, 0.8rem);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--coral);
  animation: fade-in 0.4s ease 0.7s both;
}

/* ─── 2–7: cards ─────────────────────────────────────────────────────── */
.cards {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.6vh;
  width: 100%;
}
.cards.is-many {
  gap: 1vh;
}

.plan {
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
  padding: 1.6vh;
  border-radius: 1.2vh;
  background: var(--bg);
  border: 2px dashed var(--lavender);
  animation: fade-in 0.45s ease 0.1s both;
}
.plan-tag {
  font-size: clamp(0.45rem, 1.1vh, 0.7rem);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--lavender);
}
.plan-name {
  font-size: clamp(0.75rem, 2vh, 1.3rem);
  font-weight: 800;
  color: var(--text);
}
.plan-row {
  display: flex;
  gap: 0.6vh;
  font-family: var(--font-code);
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  color: var(--text-dim);
}
.plan-label {
  min-width: 4ch;
  font-weight: 800;
  color: var(--text-muted);
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
  min-width: 0;
  padding: 1.4vh 1.6vh;
  border-radius: 1.2vh;
  background: var(--bg);
  border: 2px solid var(--mint);
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.card.is-dict {
  border-style: dashed;
  border-color: var(--sky);
}
.card.is-acting {
  box-shadow: 0 0 0 0.5vh color-mix(in srgb, var(--mint) 22%, transparent);
}
.card-name {
  font-size: clamp(0.7rem, 1.9vh, 1.2rem);
  font-weight: 800;
  color: var(--text);
}
.card-row {
  display: flex;
  align-items: center;
  gap: 0.8vh;
  font-family: var(--font-code);
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
}
.card-key {
  min-width: 7ch;
  color: var(--text-muted);
}
.card-value {
  display: inline-grid;
  padding: 0.2vh 0.7vh;
  border-radius: 0.5vh;
  background: var(--bg-off);
  font-weight: 800;
  color: var(--text);
}
.value-face {
  grid-area: 1 / 1;
}
.card-value.is-flipping .value-old {
  animation: flip-out 0.3s ease-in 0.8s both;
}
.card-value.is-flipping .value-new {
  animation: flip-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) 1.1s both;
}
.card-call {
  margin-top: 0.4vh;
  padding: 0.35vh 0.8vh;
  border-radius: 999px;
  background: var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.45rem, 1.15vh, 0.75rem);
  font-weight: 700;
  text-align: center;
  color: var(--bg);
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.8s both;
}

/* ─── 8: the ones they already used ──────────────────────────────────── */
.knowns {
  display: flex;
  flex-direction: column;
  gap: 1.4vh;
  width: 100%;
}
.known {
  display: flex;
  flex-direction: column;
  gap: 0.3vh;
  padding: 1.3vh 1.5vh;
  border-radius: 1.2vh;
  background: var(--bg);
  border: 2px solid var(--border);
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}
.known-name {
  font-family: var(--font-code);
  font-size: clamp(0.5rem, 1.25vh, 0.8rem);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--lavender);
}
.known-example {
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  color: var(--text);
}
.known-note {
  font-size: clamp(0.5rem, 1.3vh, 0.85rem);
  line-height: 1.35;
  color: var(--text-dim);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes rise {
  from { opacity: 0; translate: 0 1.2vh; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes pop {
  from { opacity: 0; scale: 0.85; }
  to { opacity: 1; scale: 1; }
}
@keyframes flip-out {
  from { opacity: 1; translate: 0 0; }
  to { opacity: 0; translate: 0 -0.8vh; }
}
@keyframes flip-in {
  from { opacity: 0; translate: 0 0.8vh; }
  to { opacity: 1; translate: 0 0; }
}
</style>
