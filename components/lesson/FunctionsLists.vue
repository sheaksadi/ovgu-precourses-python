<script setup lang="ts">
/**
 * "Funktionen und Listen" (PRE-0108), one slide, auto-imported as
 * `<LessonFunctionsLists />`.
 *
 * All the functions so far took numbers and gave numbers back. This one takes a
 * list — and changes it. The scene shows why that is worth a slide: the
 * parameter `tier` is not a copy of `momo`, it is the same list, so the change
 * is still there after the call has finished.
 *
 * It is also the question the dictionary section answers later: position 1 is
 * the hunger only because we said so.
 *
 * Words come from `functions.lists.*` in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t, tm } = useI18n()

const lesson = computed(() => tm<{
  headline: string
  note: string
  tally: string
  code: string
  focus: number[]
  output: string[]
  /** The variable in the scene, and the name stored inside it. */
  name: string
  label: string
  words: { outside: string, inside: string, same: string, fn: string, param: string }
}>('functions.lists'))

/** The one value that changes, and when. */
const EAT_AT = 2.4
</script>

<template>
  <LessonShell
    :eyebrow="t('functions.lists.title')"
    :stage="1"
    :stages="1"
    :headline="lesson.headline"
    :note="lesson.note"
    :code="lesson.code"
    :file="t('functions.lists.file')"
    :focus="lesson.focus"
    :output="lesson.output"
    :output-from="0"
    :output-delays="[EAT_AT + 1.4]"
    dense
    :output-label="t('functions.lists.outputLabel')"
    :no-output="t('functions.lists.noOutput')"
  >
    <div class="scene">
      <span class="tally"><span class="text-trim">{{ lesson.tally }}</span></span>

      <!-- The list, living outside the function -->
      <div class="outside">
        <span class="area-label">{{ lesson.words.outside }}</span>
        <div class="list">
          <code class="list-name">{{ lesson.name }}</code>
          <span class="cells">
            <code class="cell">"{{ lesson.label }}"</code>
            <code class="cell is-hunger">
              <span class="stack">
                <span class="value before">5</span>
                <span class="value after" :style="{ '--t': `${EAT_AT}s` }">2</span>
              </span>
            </code>
          </span>
          <span class="pips">
            <i v-for="pip in 5" :key="pip" :class="{ 'is-gone': pip > 2 }" :style="{ '--t': `${EAT_AT + (5 - pip) * 0.12}s` }"></i>
          </span>
        </div>
      </div>

      <!-- The call, reaching the same list -->
      <span class="link">
        <span class="link-line"></span>
        <code class="link-tag">{{ lesson.words.param }}</code>
      </span>

      <div class="inside">
        <span class="area-label">{{ lesson.words.inside }}</span>
        <code class="call">{{ lesson.words.fn }}(<span class="arg">{{ lesson.name }}</span>, 3)</code>
        <span class="same">{{ lesson.words.same }}</span>
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
  padding: 7vh 5% 3vh;
}
code {
  font-family: var(--font-code);
}
.stack {
  display: inline-grid;
}

.tally {
  position: absolute;
  top: 1.6vh;
  left: 50%;
  translate: -50% 0;
  padding: calc(0.4vh + 0.3em) 1.3vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}

.area-label {
  display: block;
  margin-bottom: 0.8vh;
  font-size: clamp(0.42rem, 1.1vh, 0.7rem);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: center;
  color: var(--text-muted);
}

/* ─── The list ───────────────────────────────────────────────────────── */
.outside {
  animation: swap-in 0.4s ease 0.4s both;
}
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;
  padding: 1.6vh 2vh;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 3px solid var(--text);
}
.list-name {
  font-size: clamp(0.62rem, 1.8vh, 1.15rem);
  font-weight: 800;
  color: var(--text);
}
.cells {
  display: flex;
  gap: 0.8vh;
}
.cell {
  min-width: 5ch;
  padding: 0.6vh 1vh;
  border-radius: 0.8vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  text-align: center;
  color: var(--text);
}
.cell.is-hunger {
  background: color-mix(in srgb, var(--coral) 18%, var(--bg));
  border-color: var(--coral);
}
.value {
  grid-area: 1 / 1;
  justify-self: center;
}
.value.before {
  animation: vanish 0.2s ease calc(var(--t, 2.4s)) forwards;
}
.value.after {
  opacity: 0;
  color: var(--coral);
  animation: swap-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) var(--t) both;
}
/* The hunger, as pips: three of them leave when the function runs. */
.pips {
  display: flex;
  gap: 0.5vh;
}
.pips i {
  width: 1.2vh;
  height: 1.2vh;
  border-radius: 999px;
  background: var(--coral);
}
.pips i.is-gone {
  animation: eaten 0.3s ease var(--t) forwards;
}

/* ─── The call ───────────────────────────────────────────────────────── */
.link {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1vh 0;
}
.link-line {
  width: 0.4vh;
  height: 4.5vh;
  border-radius: 999px;
  background: var(--sky);
  animation: appear 0.3s ease 1.4s both;
}
.link-tag {
  position: absolute;
  top: 50%;
  left: calc(50% + 1.2vh);
  translate: 0 -50%;
  padding: 0.25vh 0.8vh;
  border-radius: 999px;
  background: var(--sky);
  font-size: clamp(0.45rem, 1.25vh, 0.8rem);
  font-weight: 800;
  white-space: nowrap;
  color: #FFFFFF;
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 1.7s both;
}

.inside {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: swap-in 0.4s ease 1.2s both;
}
.call {
  padding: 0.8vh 1.4vh;
  border-radius: 1vh;
  background: var(--bg);
  border: 3px dashed var(--sky);
  font-size: clamp(0.62rem, 1.8vh, 1.15rem);
  font-weight: 800;
  color: var(--text);
}
.arg {
  color: var(--sky);
}
.same {
  margin-top: 1.4vh;
  padding: calc(0.3vh + 0.3em) 1.1vh;
  border-radius: 999px;
  background: var(--mint);
  font-size: clamp(0.48rem, 1.3vh, 0.85rem);
  font-weight: 800;
  color: var(--text);
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 3.2s both;
}

@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes vanish {
  from { opacity: 1; }
  to { opacity: 0; }
}
@keyframes pop {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes swap-in {
  from { opacity: 0; transform: translateY(-0.8vh); }
  to { opacity: 1; transform: none; }
}
@keyframes eaten {
  from { opacity: 1; transform: none; }
  to { opacity: 0; transform: translateY(-1.4vh) scale(0.5); }
}
</style>
