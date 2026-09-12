<script setup lang="ts">
/**
 * PRE-0033 — course title. The audience scans the code in the bottom-right
 * quarter to open the interactive deck on their own device.
 */
import { ref } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
const joinUrl = ref('')
const shortUrl = (value: string) => value.replace(/^https?:\/\//, '')
</script>

<template>
  <div class="title-slide relative w-full h-full overflow-hidden">
    <!-- Faint module grid behind the code, fading out towards the title. -->
    <div class="dot-field absolute inset-0 pointer-events-none" aria-hidden="true"></div>

    <!-- Top left: what this is -->
    <header class="absolute top-[8vh] left-[6vw]">
      <div class="flex items-center gap-1.5 mb-[3.2vh] anim-fade-in">
        <span class="h-[0.55vh] w-[2.4vw] rounded-full" style="background: var(--coral);"></span>
        <span class="h-[0.55vh] w-[2.4vw] rounded-full" style="background: var(--sun);"></span>
        <span class="h-[0.55vh] w-[2.4vw] rounded-full" style="background: var(--mint);"></span>
        <span class="h-[0.55vh] w-[2.4vw] rounded-full" style="background: var(--sky);"></span>
        <span class="h-[0.55vh] w-[2.4vw] rounded-full" style="background: var(--lavender);"></span>
      </div>

      <p class="eyebrow anim-fade-in-up">
        {{ t('title.university') }} <span class="mx-2" style="color: var(--border);">/</span> {{ t('title.semester') }}
      </p>

      <h1 class="title anim-fade-in-up anim-delay-1">
        {{ t('title.line1') }}<br>{{ t('title.line2') }}
      </h1>

      <p class="subtitle anim-fade-in-up anim-delay-2">
        {{ t('title.subtitleBefore') }} <span class="subtitle-mark">{{ t('title.subtitleMark') }}</span> {{ t('title.subtitleAfter') }}
      </p>
    </header>

    <!-- Bottom left: who is teaching -->
    <footer class="absolute bottom-[8vh] left-[6vw] flex flex-col gap-[2.6vh] anim-fade-in-up anim-delay-4">
      <div class="person">
        <span class="role">{{ t('title.instructor') }}</span>
        <span class="name name-lead">Karim</span>
      </div>
      <div class="person">
        <span class="role">{{ t('title.tutor') }}</span>
        <span class="name name-support">Sheak Sadi</span>
      </div>
    </footer>

    <!-- Bottom right quarter: the way in -->
    <aside class="qr-dock absolute anim-pop-in anim-delay-3">
      <div class="qr-peek" aria-hidden="true">
        <span class="qr-bubble">{{ t('title.momoHi') }}</span>
        <ArtSprite name="cat-peek" color="coral" accent="sun" :size="96" class="w-full h-full" />
      </div>

      <div class="qr-card">
        <ArtQrCode path="/join" badge="cat" badge-color="coral" badge-accent="rose" @url="joinUrl = $event" />

        <div class="qr-caption">
          <span class="qr-cta">{{ t('title.scan') }}</span>
          <span class="qr-url">{{ joinUrl ? shortUrl(joinUrl) : '…' }}</span>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.title-slide {
  background: var(--bg);
}

.dot-field {
  background-image: radial-gradient(var(--border) 1.4px, transparent 1.6px);
  background-size: 22px 22px;
  mask-image: radial-gradient(circle at 82% 78%, #000 0%, rgba(0, 0, 0, 0.55) 30%, transparent 58%);
  -webkit-mask-image: radial-gradient(circle at 82% 78%, #000 0%, rgba(0, 0, 0, 0.55) 30%, transparent 58%);
}

.eyebrow {
  font-size: clamp(0.7rem, 1.45vh, 1rem);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.title {
  margin-top: 2.2vh;
  /* Bounded by width too, so "Pre-Course" never breaks on a 4:3 projector. */
  font-size: clamp(2.6rem, min(12.5vh, 8vw), 9.5rem);
  white-space: nowrap;
  line-height: 0.92;
  font-weight: 900;
  letter-spacing: -0.045em;
  color: var(--text);
}

.subtitle {
  margin-top: 3.4vh;
  font-size: clamp(1rem, 2.9vh, 2rem);
  font-weight: 500;
  color: var(--text-dim);
}

/* A highlighter stroke, not a colour change: the words stay ink. */
.subtitle-mark {
  color: var(--text);
  font-weight: 700;
  background: linear-gradient(transparent 58%, var(--sun) 58%, var(--sun) 92%, transparent 92%);
  padding: 0 0.15em;
}

.person {
  display: flex;
  flex-direction: column;
  gap: 0.4vh;
  padding-left: 1.1vw;
  border-left: 0.45vh solid var(--border);
}
.person:first-child {
  border-left-color: var(--coral);
}

.role {
  font-size: clamp(0.65rem, 1.3vh, 0.9rem);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.name {
  font-weight: 800;
  line-height: 1.05;
  color: var(--text);
}
.name-lead {
  font-size: clamp(1.6rem, 5vh, 3.6rem);
  letter-spacing: -0.02em;
}
.name-support {
  font-size: clamp(1rem, 2.7vh, 1.9rem);
  color: var(--text-dim);
}

/* Bottom-right quarter of the screen, sized by height so it stays square. */
.qr-dock {
  right: 5vw;
  bottom: 7vh;
  width: min(50vh, 40vw);
}

/* A phone following along already scanned it; in portrait the code only gets in the way. */
@media (max-aspect-ratio: 3/4) {
  .qr-dock,
  .dot-field {
    display: none;
  }
}

.qr-card {
  position: relative;
  padding: 2.2vh;
  border-radius: 2.6vh;
  background: var(--bg-off);
  border: 2px solid var(--border);
}

.qr-caption {
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
  margin-top: 1.8vh;
  padding: 0 0.6vh;
}

.qr-cta {
  font-size: clamp(0.75rem, 1.7vh, 1.15rem);
  font-weight: 800;
  color: var(--text);
}

.qr-url {
  font-size: clamp(0.6rem, 1.25vh, 0.85rem);
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
}

/* Momo peeks over the top edge of the card. */
.qr-peek {
  position: absolute;
  top: -8.6vh;
  right: 3.2vh;
  width: 10vh;
  height: 10vh;
  z-index: 1;
}

/* Speech bubble over Momo. Arrives after the card, tail points at her head. */
.qr-bubble {
  position: absolute;
  bottom: calc(100% - 0.4vh);
  right: 30%;
  padding: 0.7vh 1.3vh;
  border-radius: 1.4vh;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: clamp(0.7rem, 1.55vh, 1.05rem);
  font-weight: 800;
  line-height: 1.2;
  color: var(--text);
  white-space: nowrap;
  transform-origin: 85% 120%;
  animation: pop-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both;
}
.qr-bubble::after {
  content: '';
  position: absolute;
  right: 1.4vh;
  bottom: calc(-0.6vh - 1px);
  width: 1.1vh;
  height: 1.1vh;
  background: var(--bg);
  border-right: 2px solid var(--text);
  border-bottom: 2px solid var(--text);
  transform: rotate(45deg);
}
</style>
