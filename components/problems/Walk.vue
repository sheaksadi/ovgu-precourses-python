<script setup lang="ts">
/**
 * A worked example, step by step. Auto-imported as `<ProblemsWalk :steps="…" />`.
 *
 * The example's answer on its own tells a student what to get, not how to get
 * there. The walk plays the example through in words and numbers — what is
 * looked at, what it does to the running result — so the idea is on the slide
 * and the code is still theirs to write.
 *
 * A step is one line from `problems.<id>.example.walk` (or `part2.example.walk`).
 * `what → result` puts the result in its own column; backtick spans render as
 * code. `size="stage"` is the projector's type, the default is a device's.
 */
const props = withDefaults(defineProps<{ steps: string[], size?: 'stage' | 'device' }>(), { size: 'device' })

const split = (step: string) => {
  const [what, result] = step.split(' → ')
  return { what: what!, result }
}
const segments = (line: string) => line.split('`').map((part, index) => ({ part, code: index % 2 === 1 }))
</script>

<template>
  <ol class="walk" :class="`is-${props.size}`">
    <li v-for="(step, index) in steps" :key="index" class="walk-step" :style="{ '--i': index }">
      <span class="walk-num"><span class="text-trim">{{ index + 1 }}</span></span>
      <span class="walk-what">
        <template v-for="(bit, i) in segments(split(step).what)" :key="i">
          <code v-if="bit.code">{{ bit.part }}</code>
          <template v-else>{{ bit.part }}</template>
        </template>
      </span>
      <span v-if="split(step).result" class="walk-result">
        <template v-for="(bit, i) in segments(split(step).result!)" :key="i">
          <code v-if="bit.code">{{ bit.part }}</code>
          <template v-else>{{ bit.part }}</template>
        </template>
      </span>
    </li>
  </ol>
</template>

<style scoped>
.walk {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: auto 1fr auto;
  column-gap: 0.8em;
  row-gap: 0.45em;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-dim);
}
.walk.is-stage {
  font-size: clamp(0.7rem, 1.75vh, 1.25rem);
  row-gap: 0.7vh;
}
.walk-step {
  display: contents;
}
.walk-num {
  display: grid;
  place-items: center;
  width: 1.7em;
  height: 1.7em;
  border-radius: 999px;
  background: var(--bg);
  border: 2px solid var(--border);
  font-size: max(11px, 0.75em);
  font-weight: 900;
  color: var(--text-muted);
}
.walk-what {
  line-height: 1.4;
}
.walk-result {
  justify-self: end;
  padding: 0.1em 0.6em;
  border-radius: 999px;
  background: color-mix(in srgb, var(--mint) 35%, var(--bg));
  font-family: var(--font-code);
  font-weight: 800;
  white-space: nowrap;
  color: var(--text);
}
.walk code {
  padding: 0.02em 0.3em;
  border-radius: 0.3em;
  background: var(--bg);
  font-family: var(--font-code);
  font-size: 0.92em;
  color: var(--text);
}
.walk-result code {
  padding: 0;
  background: none;
}

/* On the projector the steps arrive one after another, like reading along. */
.walk.is-stage .walk-num,
.walk.is-stage .walk-what,
.walk.is-stage .walk-result {
  animation: walk-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(0.5s + var(--i) * 0.45s);
}
@keyframes walk-in {
  from { opacity: 0; transform: translateY(0.6vh); }
  to { opacity: 1; transform: none; }
}
</style>
