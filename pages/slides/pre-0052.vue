<script setup lang="ts">
/**
 * PRE-0052 — everyone installs PyCharm. The QR code and the link open the
 * download page the walk-through before it showed. Text lives in
 * `pycharm.turn.*` in `locales/`; the address in `utils/pycharm.ts`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { PYCHARM } from '~/utils/pycharm'

const { t, tm } = useI18n()
const steps = computed(() => tm<string[]>('pycharm.turn.steps'))
</script>

<template>
  <div class="turn relative w-full h-full overflow-hidden">
    <section class="turn-copy">
      <p class="turn-eyebrow">{{ t('pycharm.eyebrow') }}</p>
      <h2 class="turn-title">{{ t('pycharm.turn.title') }}</h2>
      <p class="turn-lead">{{ t('pycharm.turn.lead') }}</p>

      <ol class="turn-steps">
        <li v-for="(step, index) in steps" :key="index" class="turn-step">
          <span class="turn-num"><span class="text-trim">{{ index + 1 }}</span></span>
          <span>{{ step }}</span>
        </li>
      </ol>

      <p class="turn-help">
        <Icon name="lucide:users" class="turn-help-icon" />
        <span>{{ t('pycharm.turn.help') }}</span>
      </p>
    </section>

    <section class="turn-link">
      <div class="turn-qr">
        <ArtQrCode :href="PYCHARM.href" :badge="false" />
      </div>
      <span class="turn-scan">{{ t('pycharm.turn.scan') }}</span>
      <span class="turn-url">{{ PYCHARM.display }}</span>
      <ArtSprite name="cat-peek" color="coral" accent="sun" :size="96" class="turn-cat" />
    </section>
  </div>
</template>

<style scoped>
.turn {
  background: var(--bg);
}

.turn-copy {
  position: absolute;
  top: 9vh;
  left: 6vw;
  width: 50vw;
}

.turn-eyebrow {
  font-size: clamp(0.7rem, 1.45vh, 1rem);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.turn-title {
  margin-top: 1.6vh;
  font-size: clamp(2.2rem, min(9vh, 5.6vw), 6rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.04em;
  color: var(--text);
}

.turn-lead {
  margin-top: 2vh;
  font-size: clamp(0.95rem, 2.5vh, 1.7rem);
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-dim);
}

.turn-steps {
  margin: 4.5vh 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2.2vh;
}

.turn-step {
  display: flex;
  align-items: center;
  gap: 1.4vw;
  font-size: clamp(0.95rem, 2.5vh, 1.8rem);
  font-weight: 800;
  line-height: 1.3;
  color: var(--text);
}

.turn-num {
  display: grid;
  place-items: center;
  flex: none;
  width: 4.6vh;
  height: 4.6vh;
  border-radius: 999px;
  font-size: clamp(0.8rem, 2vh, 1.3rem);
  color: #FFFFFF;
}
.turn-step:nth-child(1) .turn-num {
  background: var(--coral);
}
.turn-step:nth-child(2) .turn-num {
  background: var(--sun);
  color: var(--text);
}
.turn-step:nth-child(3) .turn-num {
  background: var(--sky);
}
.turn-step:nth-child(4) .turn-num {
  background: var(--mint);
}

.turn-help {
  display: flex;
  align-items: center;
  gap: 1vw;
  margin-top: 5vh;
  font-size: clamp(0.85rem, 2.1vh, 1.4rem);
  font-weight: 700;
  color: var(--text-dim);
}
.turn-help-icon {
  flex: none;
  font-size: 1.3em;
  color: var(--lavender);
}

.turn-link {
  position: absolute;
  top: 16vh;
  right: 8vw;
  width: 28vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2vh;
  text-align: center;
}

.turn-qr {
  width: 30vh;
  max-width: 100%;
  padding: 1.8vh;
  border-radius: 2.4vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
}

.turn-scan {
  margin-top: 1.2vh;
  font-size: clamp(0.85rem, 2.1vh, 1.4rem);
  font-weight: 800;
  color: var(--text);
}

.turn-url {
  font-size: clamp(0.65rem, 1.5vh, 1rem);
  font-weight: 600;
  color: var(--text-muted);
  overflow-wrap: anywhere;
}

.turn-cat {
  width: 14vh;
  height: 14vh;
  margin-top: 2vh;
}
</style>
