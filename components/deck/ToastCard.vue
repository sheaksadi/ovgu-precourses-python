<script setup lang="ts">
/**
 * One notification. Auto-imported as `<DeckToastCard>`.
 *
 * Presentational only: `components/deck/ToastStack.vue` places and times the
 * live ones, and the style guide renders it still. With `holding`, a thin bar
 * along the bottom runs out over `duration` ms, so the room sees how long the
 * card stays.
 */
import { computed } from 'vue'
import type { ToastTone } from '~/composables/useToasts'
import { avatarFor } from '~/utils/cuteNames'
import type { SpriteName } from '~/utils/sprites'

const props = withDefaults(defineProps<{
  title: string
  body?: string
  tone?: ToastTone
  name?: string
  icon?: string
  duration?: number
  holding?: boolean
}>(), {
  tone: 'mint',
  duration: 4000,
  holding: false,
})

const avatar = computed(() => (props.name && !props.icon ? avatarFor(props.name) : null))
const badgeColor = computed(() => `var(--${avatar.value?.color ?? props.tone})`)
</script>

<template>
  <div class="toast" :class="`tone-${tone}`" role="status">
    <span class="toast-badge" :class="{ 'has-sprite': avatar?.sprite }" :style="{ '--badge': badgeColor }" aria-hidden="true">
      <Icon v-if="icon" :name="icon" class="toast-icon" />
      <ArtSprite v-else-if="avatar?.sprite" :name="avatar.sprite as SpriteName" :color="avatar.color" accent="sun" :size="48" class="toast-sprite" />
      <span v-else class="text-trim">{{ avatar?.initial ?? '!' }}</span>
    </span>

    <span class="toast-text">
      <span class="toast-title">{{ title }}</span>
      <span v-if="body" class="toast-body">{{ body }}</span>
    </span>

    <span v-if="holding" class="toast-hold" :style="{ animationDuration: `${duration}ms` }" aria-hidden="true"></span>
  </div>
</template>

<style scoped>
.toast {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.7em;
  width: clamp(15rem, 22vw, 26rem);
  padding: 0.7em 0.9em 0.8em 0.7em;
  overflow: hidden;
  border-radius: 1em;
  background: var(--bg);
  border: 2px solid var(--text);
  font-family: var(--font-text);
  font-size: clamp(0.8rem, 1.6vh, 1.1rem);
  color: var(--text);
}

.toast-badge {
  flex: none;
  display: grid;
  place-items: center;
  width: 2.5em;
  height: 2.5em;
  border-radius: 999px;
  background: var(--badge);
  border: 2px solid var(--text);
  font-size: 1em;
  font-weight: 900;
  color: #FFFFFF;
}
.tone-sun .toast-badge:not(.has-sprite) {
  color: var(--text);
}
.toast-badge.has-sprite {
  background: color-mix(in srgb, var(--badge) 22%, var(--bg));
}
.toast-icon {
  font-size: 1.2em;
}
.toast-sprite {
  width: 2em;
  height: 2em;
}

.toast-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2em;
}
.toast-title {
  overflow: hidden;
  font-weight: 800;
  line-height: 1.2;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.toast-body {
  overflow: hidden;
  font-size: 0.82em;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--text-dim);
}

/* How long the card stays: runs out once, then the stack removes the card. */
.toast-hold {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: var(--tone);
  transform-origin: left;
  animation: hold linear both;
}
.tone-mint { --tone: var(--mint); }
.tone-sun { --tone: var(--sun); }
.tone-sky { --tone: var(--sky); }
.tone-coral { --tone: var(--coral); }
.tone-lavender { --tone: var(--lavender); }

@keyframes hold {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}
</style>
