<script setup lang="ts">
/**
 * PRE-0039 — try it yourself. A short demo shows the way (search, open an online
 * compiler, paste a one-line print, Run); the QR code and the link open the same
 * compiler. Text lives in `tryit.*` in `locales/`; the compiler in `utils/tryit.ts`.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { COMPILER } from '~/utils/tryit'

const { t, tm } = useI18n()
const steps = computed(() => tm<string[]>('tryit.steps'))
</script>

<template>
  <div class="tryit relative w-full h-full overflow-hidden">
    <section class="tryit-copy">
      <p class="tryit-eyebrow">{{ t('tryit.eyebrow') }}</p>
      <h2 class="tryit-title">{{ t('tryit.title') }}</h2>

      <ol class="tryit-steps">
        <li v-for="(step, index) in steps" :key="index" class="tryit-step">
          <span class="tryit-num"><span class="text-trim">{{ index + 1 }}</span></span>
          <span>{{ step }}</span>
        </li>
      </ol>

      <div class="tryit-link">
        <div class="tryit-qr">
          <ArtQrCode :href="COMPILER.href" :badge="false" />
        </div>
        <div class="tryit-link-text">
          <span class="tryit-scan">{{ t('tryit.scan') }}</span>
          <span class="tryit-url">{{ COMPILER.display }}</span>
        </div>
      </div>
    </section>

    <section class="tryit-demo">
      <TryitBrowserDemo />
    </section>
  </div>
</template>

<style scoped>
.tryit {
  background: var(--bg);
}

.tryit-copy {
  position: absolute;
  top: 9vh;
  left: 6vw;
  width: 34vw;
}

.tryit-eyebrow {
  font-size: clamp(0.7rem, 1.45vh, 1rem);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.tryit-title {
  margin-top: 1.6vh;
  font-size: clamp(2.2rem, min(9vh, 5.6vw), 6rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.04em;
  color: var(--text);
}

.tryit-steps {
  margin: 4.5vh 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2.2vh;
}

.tryit-step {
  display: flex;
  align-items: center;
  gap: 1.4vw;
  font-size: clamp(0.95rem, 2.5vh, 1.8rem);
  font-weight: 800;
  line-height: 1.3;
  color: var(--text);
}

.tryit-num {
  display: grid;
  place-items: center;
  flex: none;
  width: 4.6vh;
  height: 4.6vh;
  border-radius: 999px;
  font-size: clamp(0.8rem, 2vh, 1.3rem);
  color: #FFFFFF;
}
.tryit-step:nth-child(1) .tryit-num {
  background: var(--coral);
}
.tryit-step:nth-child(2) .tryit-num {
  background: var(--sun);
  color: var(--text);
}
.tryit-step:nth-child(3) .tryit-num {
  background: var(--mint);
}

.tryit-link {
  margin-top: 5vh;
  display: flex;
  align-items: center;
  gap: 2.2vh;
}

.tryit-qr {
  flex: none;
  width: 17vh;
  padding: 1.2vh;
  border-radius: 1.8vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
}

.tryit-link-text {
  display: flex;
  flex-direction: column;
  gap: 0.6vh;
  min-width: 0;
}

.tryit-scan {
  font-size: clamp(0.8rem, 1.9vh, 1.25rem);
  font-weight: 800;
  color: var(--text);
}

.tryit-url {
  font-size: clamp(0.65rem, 1.4vh, 0.95rem);
  font-weight: 600;
  color: var(--text-muted);
  overflow-wrap: anywhere;
}

.tryit-demo {
  position: absolute;
  top: 17vh;
  right: 6vw;
  width: 50vw;
}
</style>
