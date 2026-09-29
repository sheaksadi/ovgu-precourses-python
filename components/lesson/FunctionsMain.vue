<script setup lang="ts">
/**
 * "main()". Auto-imported as `<LessonFunctionsMain :stage="1" />`.
 *
 * Two slides (PRE-0230 and its sub-slide PRE-0231), after the function lessons:
 *
 *   1. Python reads the file top to bottom. Both `def`s are only remembered;
 *      the `if` at the bottom is where it starts, and `main` calls the rest.
 *   2. Why the `if`: `__name__` is `"__main__"` when the file is started, and
 *      the file's name when another file imports it — then nothing starts.
 *
 * The scene is the file itself, as three blocks. A dot walks down them in
 * reading order, then jumps back up in running order. Stage 2 opens on that
 * last frame, lets it go, and splits into the two ways a file can be started.
 * Words come from `functions.main.*` in `locales/`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

type StageNumber = 1 | 2

interface Stage {
  headline: string
  note: string
  tally: string
  code: string
  focus: number[]
  output: string[]
}

const props = defineProps<{ stage: StageNumber }>()
const { t, tm } = useI18n()

const stages = computed(() => tm<Stage[]>('functions.main.stages'))
const current = computed(() => stages.value[props.stage - 1]!)
const w = computed(() => tm<Record<
  'greet' | 'param' | 'remembered' | 'runs' | 'go' | 'direct' | 'directHow' | 'imported' | 'importedHow' | 'yes' | 'no' | 'noHow' | 'module',
  string
>>('functions.main.words'))

/** Beats of stage 1, in seconds: read down, then run back up. */
const READ = [0.7, 1.5, 2.3]
const RUN_MAIN = 3.1
const RUN_GREET = 3.9
</script>

<template>
  <LessonShell
    :eyebrow="t('functions.main.title')"
    :stage="stage"
    :stages="stages.length"
    :headline="current.headline"
    :note="current.note"
    :code="current.code"
    :file="t('functions.main.file')"
    :focus="current.focus"
    :output="current.output"
    :output-from="stage === 1 ? 0 : 1"
    :output-delays="[RUN_GREET + 0.7]"
    dense
    :output-label="t('functions.main.output')"
    :no-output="t('functions.main.noOutput')"
  >
    <div class="scene" :class="`stage-${stage}`">
      <span :key="stage" class="tally"><span class="text-trim">{{ current.tally }}</span></span>

      <!-- ═══ 1: the file, read down and run back up ═══ -->
      <div class="file" :class="stage === 1 ? 'is-active' : 'is-leaving'">
        <span class="rail" aria-hidden="true"></span>
        <span v-if="stage === 1" class="runner" aria-hidden="true"></span>

        <div class="block block-greet" :style="{ '--read': `${READ[0]}s`, '--run': `${RUN_GREET}s` }">
          <code class="block-head">def {{ w.greet }}({{ w.param }}):</code>
          <span class="badge is-kept">{{ w.remembered }}</span>
          <span class="badge is-running"><b>3</b> {{ w.runs }}</span>
        </div>

        <div class="block block-main" :style="{ '--read': `${READ[1]}s`, '--run': `${RUN_MAIN}s` }">
          <code class="block-head">def main():</code>
          <span class="badge is-kept">{{ w.remembered }}</span>
          <span class="badge is-running"><b>2</b> {{ w.runs }}</span>
        </div>

        <div class="block block-start" :style="{ '--read': `${READ[2]}s` }">
          <code class="block-head">if __name__ == "__main__":</code>
          <span class="badge is-go"><b>1</b> {{ w.go }}</span>
        </div>
      </div>

      <!-- ═══ 2: two ways to start a file ═══ -->
      <div v-if="stage === 2" class="ways">
        <div class="way is-direct">
          <span class="way-head">▶ {{ w.direct }}</span>
          <span class="way-how">{{ w.directHow }}</span>
          <code class="way-name">__name__ <i>=</i> <span>"__main__"</span></code>
          <span class="way-result"><code>main()</code> {{ w.yes }}</span>
        </div>
        <div class="way is-import">
          <span class="way-head"><code>import {{ w.module }}</code></span>
          <span class="way-how">{{ w.importedHow }}</span>
          <code class="way-name">__name__ <i>=</i> <span>"{{ w.module }}"</span></code>
          <span class="way-result"><code>main()</code> {{ w.no }}</span>
          <span class="way-extra">{{ w.noHow }}</span>
        </div>
      </div>
    </div>
  </LessonShell>
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
  padding: 7vh 6% 3vh;
}
code {
  font-family: var(--font-code);
}

.tally {
  position: absolute;
  top: 1.6vh;
  left: 50%;
  translate: -50% 0;
  z-index: 2;
  padding: calc(0.4vh + 0.3em) 1.3vh;
  border-radius: 999px;
  background: var(--text);
  font-size: clamp(0.6rem, 1.5vh, 1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--bg);
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}

/* ─── 1: the file ────────────────────────────────────────────────────── */
.file {
  position: absolute;
  inset: 8vh 6% 3vh 6%;
}
.file.is-leaving {
  animation: leave 0.45s ease both;
}

/* Reading order runs down the rail on the left. */
.rail {
  position: absolute;
  top: 12%;
  bottom: 12%;
  left: 0;
  width: 0.4vh;
  border-radius: 999px;
  background: var(--border);
}
.runner {
  position: absolute;
  left: 0.2vh;
  width: 2vh;
  height: 2vh;
  translate: -50% -50%;
  border-radius: 999px;
  background: var(--coral);
  box-shadow: 0 0 0 0.6vh color-mix(in srgb, var(--coral) 25%, transparent);
  animation: walk 4.2s cubic-bezier(0.45, 0, 0.25, 1) 0.3s both;
}
/* Block centres: 17%, 50%, 83%. Down in reading order, then back up to run. */
@keyframes walk {
  0% { top: 17%; opacity: 0; }
  6% { top: 17%; opacity: 1; }
  24% { top: 17%; }
  33% { top: 50%; }
  43% { top: 50%; }
  52% { top: 83%; }
  62% { top: 83%; }
  71% { top: 50%; }
  81% { top: 50%; }
  90% { top: 17%; }
  100% { top: 17%; opacity: 1; }
}

.block {
  position: absolute;
  left: 4%;
  right: 0;
  height: 22%;
  display: flex;
  align-items: center;
  gap: 1.2vh;
  padding: 0 2vh;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 3px solid var(--border);
  animation:
    swap-in 0.4s ease calc(var(--read) - 0.3s) both,
    lit-read 0.5s ease var(--read) both;
}
.block-greet { top: 6%; }
.block-main { top: 39%; }
.block-start { top: 72%; }

/* Once it runs, a block is lit for good. */
.block-greet,
.block-main {
  animation:
    swap-in 0.4s ease calc(var(--read) - 0.3s) both,
    lit-read 0.5s ease var(--read) both,
    lit-run 0.45s ease var(--run) both;
}
.block-start {
  animation:
    swap-in 0.4s ease calc(var(--read) - 0.3s) both,
    lit-go 0.45s ease var(--read) both;
}
.file.is-leaving .block {
  animation: none;
}
.file.is-leaving .block-greet,
.file.is-leaving .block-main {
  border-color: var(--mint);
}
.file.is-leaving .block-start {
  border-color: var(--sun);
}

.block-head {
  flex: 1;
  min-width: 0;
  font-size: clamp(0.62rem, 1.9vh, 1.2rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
}

.badge {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 0.6vh;
  padding: calc(0.3vh + 0.25em) 1.1vh;
  border-radius: 999px;
  font-size: clamp(0.5rem, 1.35vh, 0.85rem);
  font-weight: 800;
  white-space: nowrap;
}
.badge b {
  display: grid;
  place-items: center;
  width: 2.1vh;
  height: 2.1vh;
  border-radius: 999px;
  background: var(--text);
  font-size: 0.85em;
  color: var(--bg);
}
.badge.is-kept {
  background: var(--bg-off);
  border: 2px solid var(--border);
  color: var(--text-muted);
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--read) + 0.15s) both;
}
.badge.is-running {
  background: var(--mint);
  color: var(--text);
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--run) + 0.15s) both;
}
.badge.is-go {
  background: var(--sun);
  color: var(--text);
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--read) + 0.25s) both;
}
.file.is-leaving .badge {
  animation: none;
}

/* ─── 2: two ways to start ───────────────────────────────────────────── */
.ways {
  position: absolute;
  inset: 9vh 6% 4vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.4vh;
}
.way {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.3vh;
  padding: 2.2vh;
  border-radius: 1.6vh;
  background: var(--bg);
  border: 3px solid var(--border);
  animation: swap-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
}
.way.is-direct {
  border-color: var(--mint);
}
.way.is-import {
  border-style: dashed;
  animation-delay: 1.9s;
}
.way-head {
  font-size: clamp(0.66rem, 2vh, 1.25rem);
  font-weight: 900;
  color: var(--text);
}
.way-how {
  margin-top: -0.6vh;
  font-size: clamp(0.5rem, 1.35vh, 0.85rem);
  font-weight: 700;
  color: var(--text-muted);
}
.way-name {
  padding: 0.8vh 1.2vh;
  border-radius: 1vh;
  background: var(--bg-off);
  font-size: clamp(0.58rem, 1.75vh, 1.1rem);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
}
.way-name i {
  font-style: normal;
  color: var(--text-muted);
}
.way-name span {
  color: var(--coral);
}
.way-result {
  padding: calc(0.3vh + 0.25em) 1.2vh;
  border-radius: 999px;
  font-size: clamp(0.52rem, 1.45vh, 0.9rem);
  font-weight: 800;
  white-space: nowrap;
}
.way.is-direct .way-result {
  background: var(--mint);
  color: var(--text);
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s both;
}
.way.is-import .way-result {
  background: var(--bg-off);
  border: 2px solid var(--border);
  color: var(--text-dim);
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 2.6s both;
}
.way-extra {
  font-size: clamp(0.5rem, 1.35vh, 0.85rem);
  line-height: 1.4;
  color: var(--text-dim);
  animation: appear 0.4s ease 3.1s both;
}

@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes leave {
  from { opacity: 1; transform: none; }
  to { opacity: 0; transform: scale(0.96); }
}
@keyframes pop {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes swap-in {
  from { opacity: 0; transform: translateY(-0.8vh); }
  to { opacity: 1; transform: none; }
}
@keyframes lit-read {
  from { border-color: var(--border); }
  50% { border-color: var(--coral); }
  to { border-color: var(--text-muted); }
}
@keyframes lit-run {
  from { border-color: var(--text-muted); background: var(--bg); }
  to { border-color: var(--mint); background: color-mix(in srgb, var(--mint) 12%, var(--bg)); }
}
@keyframes lit-go {
  from { border-color: var(--border); }
  to { border-color: var(--sun); background: color-mix(in srgb, var(--sun) 14%, var(--bg)); }
}

/* ─── A phone held upright ───────────────────────────────────────────── */
/* The blocks stack in reading order; the dot needs the projector's rail. */
@media (orientation: portrait) and (max-width: 760px) {
  .scene {
    position: relative;
    padding: 3rem 0 1rem;
  }
  .file {
    position: relative;
    inset: auto;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .file.is-leaving {
    display: none;
  }
  .rail,
  .runner {
    display: none;
  }
  .block {
    position: static;
    height: auto;
    flex-wrap: wrap;
    padding: 0.7rem 0.8rem;
  }
  .block-head {
    flex-basis: 100%;
    font-size: 0.85rem;
  }
  .badge,
  .way-how,
  .way-extra {
    font-size: 0.72rem;
  }
  .ways {
    position: static;
    grid-template-columns: 1fr;
  }
  .way-head,
  .way-name,
  .way-result {
    font-size: 0.85rem;
  }
}
</style>
