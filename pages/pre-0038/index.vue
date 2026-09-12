<script setup lang="ts">
/**
 * PRE-0038 — introductions. Each person says their name, then spins an
 * icebreaker question and answers it. Text lives in `intro.*` in `locales/`;
 * the reel is `components/intro/Spinner.vue`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t, tm } = useI18n()
const steps = computed(() => tm<string[]>('intro.steps'))
</script>

<template>
  <div class="intro relative w-full h-full overflow-hidden">
    <section class="intro-copy">
      <p class="intro-eyebrow anim-fade-in-up">{{ t('intro.eyebrow') }}</p>
      <h2 class="intro-title anim-fade-in-up anim-delay-1">{{ t('intro.title') }}</h2>

      <ol class="intro-steps">
        <li
          v-for="(step, index) in steps"
          :key="index"
          class="intro-step anim-fade-in-up"
          :class="`anim-delay-${index + 2}`"
        >
          <span class="intro-num">{{ index + 1 }}</span>
          <span>{{ step }}</span>
        </li>
      </ol>
    </section>

    <section class="intro-reel anim-pop-in anim-delay-3">
      <IntroSpinner />
    </section>
  </div>
</template>

<style scoped>
.intro {
  background: var(--bg);
}

.intro-copy {
  position: absolute;
  top: 9vh;
  left: 6vw;
  width: 32vw;
}

.intro-eyebrow {
  font-size: clamp(0.7rem, 1.45vh, 1rem);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.intro-title {
  margin-top: 1.6vh;
  font-size: clamp(2.4rem, min(10vh, 6.4vw), 7rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.04em;
  color: var(--text);
}

.intro-steps {
  margin: 6vh 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2.8vh;
}

.intro-step {
  display: flex;
  align-items: center;
  gap: 1.4vw;
  font-size: clamp(1rem, 3vh, 2.1rem);
  font-weight: 800;
  color: var(--text);
}

.intro-num {
  display: grid;
  place-items: center;
  flex: none;
  width: 5vh;
  height: 5vh;
  border-radius: 999px;
  font-size: clamp(0.8rem, 2.2vh, 1.4rem);
  color: #FFFFFF;
}
.intro-step:nth-child(1) .intro-num {
  background: var(--coral);
}
.intro-step:nth-child(2) .intro-num {
  background: var(--sun);
  color: var(--text);
}
.intro-step:nth-child(3) .intro-num {
  background: var(--mint);
}

.intro-reel {
  position: absolute;
  top: 24vh;
  right: 6vw;
  width: 50vw;
}
</style>
