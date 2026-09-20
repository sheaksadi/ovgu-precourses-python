<script setup lang="ts">
/**
 * A PyCharm-like window, drawn from scratch. Auto-imported as `<PycharmWindow>`.
 *
 * Dark surface, title bar, and a view for the content. It defines the `--ide-*`
 * colours, which everything inside inherits: the welcome screen and the New
 * Project dialog (`ProjectDemo.vue`) and the editor (`Ide.vue`).
 */
defineProps<{ title: string }>()
</script>

<template>
  <div class="window">
    <div class="window-bar">
      <span class="window-dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="window-title">{{ title }}</span>
    </div>
    <div class="window-view">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.window {
  --ide-bg: var(--code-bg);
  --ide-panel: #181825;
  --ide-raised: #282A3A;
  --ide-line: var(--code-border);
  --ide-edge: #45475A;
  --ide-text: var(--code-text);
  --ide-muted: #7F849C;
  --ide-select: #3B4261;
  --ide-accent: #89B4FA;
  --ide-green: #A6E3A1;
  --ide-yellow: #F9E2AF;

  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 2vh;
  background: var(--ide-bg);
  border: 2px solid var(--text);
  font-family: var(--font-code);
  font-size: clamp(0.6rem, 1.45vh, 0.95rem);
  color: var(--ide-text);
}

.window-bar {
  flex: none;
  display: flex;
  align-items: center;
  height: 4.2vh;
  padding: 0 1.6vh;
  background: var(--ide-panel);
  border-bottom: 1px solid var(--ide-line);
}

.window-dots {
  display: flex;
  gap: 0.8vh;
}
.window-dots i {
  width: 1.2vh;
  height: 1.2vh;
  border-radius: 999px;
  background: var(--coral);
}
.window-dots i:nth-child(2) {
  background: var(--sun);
}
.window-dots i:nth-child(3) {
  background: var(--mint);
}

.window-title {
  flex: 1;
  margin-right: 5.2vh;
  text-align: center;
  font-size: clamp(0.6rem, 1.35vh, 0.9rem);
  font-weight: 700;
  color: var(--ide-muted);
}

.window-view {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* ─── A phone held upright ───────────────────────────────────────────── */
/* The window is drawn in `vh`, and `1.45vh` of a phone is under reading size.
   It is a picture of PyCharm, so it may crop — but the words in it are the
   words students look for on their own screen, and those have to be legible. */
@media (orientation: portrait) and (max-width: 760px) {
  .window {
    font-size: 0.72rem;
  }
}
</style>
