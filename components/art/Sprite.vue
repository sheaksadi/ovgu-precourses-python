<script setup lang="ts">
/**
 * One cast member. Auto-imported as `<ArtSprite>`.
 *
 *   <ArtSprite name="cat" color="coral" accent="rose" :size="72" />
 *
 * `color` fills the body, `accent` the second colour. Both take a palette token
 * (`coral`, `mint`, `sky`, `rose`, `sun`, `lavender`, `peach`, `sage`) or any
 * CSS colour. Outlines are always `--text`, so the whole cast stays flat and on
 * brand however it is tinted.
 */
import { computed } from 'vue'
import { SPRITES, type SpriteName } from '~/utils/sprites'

const props = withDefaults(defineProps<{
  name: SpriteName
  color?: string
  accent?: string
  size?: number
  /** Levers only: `on` flips the arm. */
  state?: 'on' | 'off'
  /** Screen-reader label. Defaults to the sprite name. */
  label?: string
}>(), {
  color: 'coral',
  accent: 'sun',
  size: 64,
  state: 'off',
})

const PALETTE = ['coral', 'mint', 'sky', 'rose', 'sun', 'lavender', 'peach', 'sage', 'text', 'text-dim', 'text-muted', 'border', 'bg-off']
const paint = (value: string) => (PALETTE.includes(value) ? `var(--${value})` : value)

const resolved = computed<SpriteName>(() =>
  (props.name === 'lever' && props.state === 'on' ? 'lever-on' : props.name) as SpriteName)
const sprite = computed(() => SPRITES[resolved.value])
</script>

<template>
  <svg
    v-if="sprite"
    class="art-sprite"
    viewBox="0 0 64 64"
    :width="size"
    :height="size"
    role="img"
    :aria-label="label || String(name)"
    :style="{ color: paint(color), '--sprite-accent': paint(accent) }"
  >
    <g
      fill="none"
      stroke="var(--text)"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      v-html="sprite.markup"
    />
  </svg>
</template>

<style scoped>
.art-sprite {
  display: block;
  overflow: visible;
}
</style>
