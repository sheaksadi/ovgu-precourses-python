<script setup lang="ts">
/**
 * PRE-0181 — the last slide. The title card again, emptier: the room is leaving,
 * so it holds the address the slides stay at and nothing to do.
 */
import { onMounted, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
const joinUrl = ref('')
const shortUrl = (value: string) => value.replace(/^https?:\/\//, '')

// After mount, so the server render and the first client render agree.
onMounted(() => { joinUrl.value = `${window.location.origin}/join` })
</script>

<template>
  <div class="thanks-slide relative w-full h-full overflow-hidden">
    <div class="dot-field absolute inset-0 pointer-events-none" aria-hidden="true"></div>
    <!-- Two soft colour fields, so the last slide is not a white sheet. -->
    <div class="wash wash-warm" aria-hidden="true"></div>
    <div class="wash wash-cool" aria-hidden="true"></div>

    <div class="thanks-body">
      <div class="rule" aria-hidden="true">
        <span style="background: var(--coral);"></span>
        <span style="background: var(--sun);"></span>
        <span style="background: var(--mint);"></span>
        <span style="background: var(--sky);"></span>
        <span style="background: var(--lavender);"></span>
      </div>

      <h1 class="thanks-title">{{ t('outro.thanks.title') }}</h1>
      <p class="thanks-line">{{ t('outro.thanks.line') }}</p>
      <p class="thanks-note">{{ t('outro.thanks.note') }}</p>

      <p v-if="joinUrl" class="thanks-url">{{ shortUrl(joinUrl) }}</p>
      <p class="thanks-sign">{{ t('outro.thanks.sign') }}</p>
    </div>
  </div>
</template>

<style scoped>
.thanks-slide {
  background: var(--bg);
}

.wash {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.wash-warm {
  right: -12vw;
  top: -18vh;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in srgb, var(--sun) 40%, transparent),
    color-mix(in srgb, var(--coral) 16%, transparent) 55%,
    transparent 72%
  );
}
.wash-cool {
  right: 8vw;
  bottom: -26vh;
  width: 42vw;
  height: 42vw;
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in srgb, var(--mint) 32%, transparent),
    color-mix(in srgb, var(--lavender) 14%, transparent) 55%,
    transparent 72%
  );
}

.dot-field {
  background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
  background-size: 2.4vw 2.4vw;
  mask-image: radial-gradient(circle at 30% 45%, transparent 0%, transparent 34%, black 72%);
  opacity: 0.6;
}

.thanks-body {
  position: absolute;
  top: 50%;
  left: 6vw;
  right: 6vw;
  translate: 0 -50%;
}

.rule {
  display: flex;
  gap: 0.4vw;
  margin-bottom: 3.2vh;
}
.rule span {
  height: 0.8vh;
  width: 3.2vw;
  border-radius: 999px;
  animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.rule span:nth-child(2) { animation-delay: 0.05s; }
.rule span:nth-child(3) { animation-delay: 0.1s; }
.rule span:nth-child(4) { animation-delay: 0.15s; }
.rule span:nth-child(5) { animation-delay: 0.2s; }

.thanks-title {
  font-size: clamp(2.4rem, 11vh, 7rem);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: var(--text);
  animation: rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
}
.thanks-line {
  margin-top: 2vh;
  font-size: clamp(0.85rem, 2.6vh, 1.7rem);
  font-weight: 600;
  color: var(--text-dim);
  animation: rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}
.thanks-note {
  margin-top: 1.2vh;
  max-width: 54ch;
  font-size: clamp(0.65rem, 1.8vh, 1.05rem);
  line-height: 1.5;
  color: var(--text-muted);
  animation: rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
}
.thanks-url {
  margin-top: 3vh;
  font-family: var(--font-code);
  font-size: clamp(0.65rem, 1.9vh, 1.1rem);
  font-weight: 700;
  color: var(--text);
  animation: rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
}
.thanks-sign {
  margin-top: 0.8vh;
  font-size: clamp(0.7rem, 2vh, 1.2rem);
  font-weight: 800;
  color: var(--coral);
  animation: rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
}

@keyframes rise {
  from { opacity: 0; translate: 0 1.4vh; }
  to { opacity: 1; translate: 0 0; }
}
</style>
