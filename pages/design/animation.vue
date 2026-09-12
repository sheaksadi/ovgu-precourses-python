<script setup lang="ts">
/** PRE-0021 — the motion policy: one entrance per slide, state changes, one accent. */
import { ref } from 'vue'

/** Bumping the key remounts the demos, which replays them. */
const replay = ref(0)
</script>

<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-8 shrink-0">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Animation &amp; Motion
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--peach);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        One entrance per slide. Everything else moves only because something changed.
      </p>
    </header>

    <div class="grid md:grid-cols-3 gap-5 items-start">
      <!-- 1. Slide entrance -->
      <section class="rounded-2xl p-5" style="background: var(--bg-off);">
        <p class="label">1 · Slide entrance</p>
        <div class="stage">
          <div :key="`rise-${replay}`" class="demo-rise">
            <span class="demo-bar" style="width: 70%;"></span>
            <span class="demo-bar" style="width: 45%;"></span>
            <span class="demo-block"></span>
          </div>
        </div>
        <p class="note">
          The whole slide rises in once: <code>10px</code>, <code>400ms</code>,
          <code>cubic-bezier(0.22, 1, 0.36, 1)</code>. Leaving is instant. Nothing inside it is staggered.
        </p>
        <p class="note">
          <code>transition: 'none'</code> in <code>slides.config.ts</code> turns it off between the stages of one scene.
        </p>
      </section>

      <!-- 2. State change -->
      <section class="rounded-2xl p-5" style="background: var(--bg-off);">
        <p class="label">2 · State change</p>
        <div class="stage">
          <div class="demo-steps">
            <span class="demo-dot is-done"><span class="text-trim">1</span></span>
            <span :key="`step-${replay}`" class="demo-dot is-now demo-step-in"><span class="text-trim">2</span></span>
          </div>
        </div>
        <p class="note">
          Motion answers a click or a "next": the lesson's stages, the step that was just reached, the question reel.
          It runs once, then the slide holds still.
        </p>
      </section>

      <!-- 3. Accent -->
      <section class="rounded-2xl p-5" style="background: var(--bg-off);">
        <p class="label">3 · One accent</p>
        <div class="stage stage-momo">
          <span :key="`bubble-${replay}`" class="demo-bubble">Hi!</span>
          <ArtSprite name="cat-peek" color="coral" accent="sun" :size="72" />
        </div>
        <p class="note">
          At most one small pop after the slide lands, usually Momo's speech bubble. It changes again only when
          the state behind it changes.
        </p>
      </section>
    </div>

    <div class="mt-5 grid md:grid-cols-[1fr_auto] gap-5 items-center">
      <div class="rounded-2xl p-5 text-xs leading-relaxed" style="background: var(--bg-off); color: var(--text-dim);">
        <span class="font-bold" style="color: var(--text);">Never:</span>
        element-by-element entrances · loops that run on their own · more than one accent · motion without a reason.
        All motion respects <code style="color: var(--lavender);">prefers-reduced-motion</code> and lands on its final frame.
      </div>
      <button type="button" class="replay" @click="replay++">Replay demos</button>
    </div>
  </div>
</template>

<style scoped>
.label {
  margin-bottom: 0.9rem;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.note {
  margin-top: 0.8rem;
  font-size: 11px;
  line-height: 1.6;
  color: var(--text-dim);
}
.note code {
  color: var(--text);
}

.stage {
  position: relative;
  display: grid;
  place-items: center;
  height: 8.5rem;
  border-radius: 0.9rem;
  background: var(--bg);
  border: 2px solid var(--border);
  overflow: hidden;
}

.demo-rise {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 70%;
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.demo-bar {
  height: 0.5rem;
  border-radius: 999px;
  background: var(--border);
}
.demo-block {
  height: 2.4rem;
  border-radius: 0.6rem;
  background: var(--sky);
}

.demo-steps {
  display: flex;
  gap: 0.9rem;
}
.demo-dot {
  display: grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 999px;
  border: 2px solid var(--text-dim);
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--text-dim);
}
.demo-dot.is-now {
  background: var(--text);
  border-color: var(--text);
  color: var(--bg);
}
.demo-step-in {
  animation: step-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
}

.stage-momo {
  align-content: end;
  padding-top: 2.4rem;
}
.demo-bubble {
  position: absolute;
  top: 0.9rem;
  left: 50%;
  translate: -50% 0;
  padding: calc(0.25rem + 0.38em) 0.7rem;
  border-radius: 0.7rem;
  text-box: trim-both cap alphabetic;
  background: var(--bg);
  border: 2px solid var(--text);
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--text);
  animation: pop-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
}

.replay {
  padding: 0.7rem 1.1rem;
  border-radius: 0.75rem;
  border: 2px solid var(--text);
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--text);
  cursor: pointer;
}

@keyframes rise {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}
@keyframes step-in {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: none; }
}
</style>
