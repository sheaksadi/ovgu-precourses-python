<script setup lang="ts">
/**
 * PRE-0205 — a pause for questions, between the comparison lesson and the lists.
 *
 * Half the course has gone by at this point: `print`, variables, comparisons,
 * `if`. It is the last moment where everything still fits in one head, so the
 * slide is a door rather than a lesson — three prompts, because "any questions?"
 * into a silent room gets nothing, and a concrete question gets a hand.
 *
 * Words come from `questionTime.*` in `locales/`.
 */
import { useI18n } from '~/composables/useI18n'

const { t, tm } = useI18n()

const prompts = tm<string[]>('questionTime.prompts')
const COLOURS = ['coral', 'sky', 'mint']
</script>

<template>
  <div class="ask-slide">
    <div class="wash" aria-hidden="true"></div>

    <div class="body">
      <span class="eyebrow">{{ t('questionTime.eyebrow') }}</span>
      <h1 class="mark" aria-hidden="true">?</h1>
      <h2 class="headline">{{ t('questionTime.headline') }}</h2>

      <div class="prompts">
        <span
          v-for="(prompt, index) in prompts"
          :key="prompt"
          class="prompt"
          :style="{ '--accent': `var(--${COLOURS[index % COLOURS.length]})`, '--t': `${0.5 + index * 0.15}s` }"
        >{{ prompt }}</span>
      </div>

      <p class="note">{{ t('questionTime.note') }}</p>
    </div>
  </div>
</template>

<style scoped>
.ask-slide {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--bg);
}

/* One soft wash behind the mark, so the slide is calm and not empty. */
.wash {
  position: absolute;
  top: -20vh;
  left: 50%;
  width: 90vh;
  height: 90vh;
  translate: -50% 0;
  border-radius: 999px;
  background: radial-gradient(circle, color-mix(in srgb, var(--sun) 35%, transparent) 0%, transparent 65%);
}

.body {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.6vh;
  padding: 6vh 8%;
  text-align: center;
}

.eyebrow {
  font-size: clamp(0.5rem, 1.35vh, 0.9rem);
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
}
.mark {
  font-size: clamp(3rem, 16vh, 11rem);
  font-weight: 800;
  line-height: 0.9;
  color: var(--text);
  animation: pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s both;
}
.headline {
  font-size: clamp(1.2rem, 4.2vh, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both;
}

.prompts {
  margin-top: 1.4vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1vh;
}
.prompt {
  padding: 0.8vh 1.6vh;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent) 16%, var(--bg));
  border: 2px solid var(--accent);
  font-size: clamp(0.6rem, 1.7vh, 1.1rem);
  font-weight: 800;
  color: var(--text);
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) var(--t) both;
}

.note {
  margin-top: 1.2vh;
  max-width: 46ch;
  font-size: clamp(0.55rem, 1.6vh, 1.05rem);
  line-height: 1.5;
  color: var(--text-dim);
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) 1.1s both;
}

@keyframes rise {
  from { opacity: 0; transform: translateY(1.2vh); }
  to { opacity: 1; transform: none; }
}
@keyframes pop {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: scale(1); }
}
</style>
