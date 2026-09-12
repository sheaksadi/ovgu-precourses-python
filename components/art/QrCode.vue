<script setup lang="ts">
/**
 * Deck-styled QR code. Auto-imported as `<ArtQrCode>`.
 *
 * Draws the symbol itself instead of embedding a bitmap, so it can wear the
 * design system: rounded modules, rounded finder patterns, a cast member in the
 * middle. Everything the scanner reads stays `--text` on white — pastel colours
 * binarise too close to white to be trusted — and error correction is `H`, so
 * the centre badge can cover a few modules safely.
 *
 * The link points at this machine's LAN address (from `/api/network-ip`), since
 * a phone cannot open `localhost`. It never carries the room key: `/join` is the
 * audience landing page and only reads.
 */
import { computed, onMounted, ref } from 'vue'
import type { SpriteName } from '~/utils/sprites'

const props = withDefaults(defineProps<{
  /** Route the code opens. */
  path?: string
  /** A full address outside the deck, such as the online compiler. Wins over `path`. */
  href?: string
  /** Sprite in the centre badge. `false` for a plain code. */
  badge?: SpriteName | false
  badgeColor?: string
  badgeAccent?: string
}>(), {
  path: '/join',
  badge: 'cat',
  badgeColor: 'coral',
  badgeAccent: 'rose',
})

const emit = defineEmits<{ url: [value: string] }>()

const QUIET = 2
const url = ref('')
const matrix = ref<{ size: number, dark: boolean[] } | null>(null)

onMounted(async () => {
  if (props.href) {
    url.value = props.href
  } else {
    const { protocol, host, port } = window.location
    let target = host
    try {
      const res = await $fetch<{ ip: string }>('/api/network-ip')
      if (res?.ip && res.ip !== 'localhost') target = port ? `${res.ip}:${port}` : res.ip
    } catch {
      // Fall back to the address the presenter opened the deck on.
    }
    url.value = `${protocol}//${target}${props.path}`
  }
  emit('url', url.value)

  const QRCode = (await import('qrcode')).default
  const { modules } = QRCode.create(url.value, { errorCorrectionLevel: 'H' })
  const dark: boolean[] = []
  for (let r = 0; r < modules.size; r++) {
    for (let c = 0; c < modules.size; c++) dark.push(Boolean(modules.get(r, c)))
  }
  matrix.value = { size: modules.size, dark }
})

const size = computed(() => matrix.value?.size ?? 0)

/** Odd number of modules the centre badge clears: about a fifth of the side. */
const badgeSpan = computed(() => {
  if (!props.badge || !size.value) return 0
  const span = Math.round(size.value * 0.22)
  return span % 2 ? span : span + 1
})

const inFinder = (r: number, c: number) => {
  const n = size.value
  return (r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8)
}

const inBadge = (r: number, c: number) => {
  if (!badgeSpan.value) return false
  const start = (size.value - badgeSpan.value) / 2
  return r >= start && r < start + badgeSpan.value && c >= start && c < start + badgeSpan.value
}

const dots = computed(() => {
  if (!matrix.value) return []
  const out: Array<{ x: number, y: number }> = []
  matrix.value.dark.forEach((on, i) => {
    const r = Math.floor(i / size.value)
    const c = i % size.value
    if (on && !inFinder(r, c) && !inBadge(r, c)) out.push({ x: c, y: r })
  })
  return out
})

const finders = computed(() => {
  const n = size.value
  return n ? [{ x: 0, y: 0 }, { x: n - 7, y: 0 }, { x: 0, y: n - 7 }] : []
})

const badgeBox = computed(() => {
  const span = badgeSpan.value
  const start = (size.value - span) / 2
  return { start, span }
})
</script>

<template>
  <div class="art-qr relative w-full aspect-square">
    <svg
      v-if="matrix"
      class="block w-full h-full"
      :viewBox="`${-QUIET} ${-QUIET} ${size + QUIET * 2} ${size + QUIET * 2}`"
      role="img"
      :aria-label="`QR code for ${url}`"
      shape-rendering="geometricPrecision"
    >
      <rect :x="-QUIET" :y="-QUIET" :width="size + QUIET * 2" :height="size + QUIET * 2" rx="3" fill="#FFFFFF" />

      <rect
        v-for="dot in dots"
        :key="`${dot.x}-${dot.y}`"
        :x="dot.x + 0.09"
        :y="dot.y + 0.09"
        width="0.82"
        height="0.82"
        rx="0.3"
        fill="var(--text)"
      />

      <g v-for="finder in finders" :key="`${finder.x}-${finder.y}`">
        <rect :x="finder.x + 0.5" :y="finder.y + 0.5" width="6" height="6" rx="1.7" fill="none" stroke="var(--text)" stroke-width="1" />
        <rect :x="finder.x + 2" :y="finder.y + 2" width="3" height="3" rx="0.9" fill="var(--text)" />
      </g>

      <rect
        v-if="badge"
        :x="badgeBox.start + 0.35"
        :y="badgeBox.start + 0.35"
        :width="badgeBox.span - 0.7"
        :height="badgeBox.span - 0.7"
        rx="1.6"
        fill="#FFFFFF"
        stroke="var(--border)"
        stroke-width="0.35"
      />
    </svg>

    <div v-else class="w-full h-full rounded-2xl animate-pulse" style="background: var(--border);"></div>

    <div
      v-if="badge && matrix"
      class="absolute pointer-events-none flex items-center justify-center"
      :style="{
        left: `${((badgeBox.start + QUIET) / (size + QUIET * 2)) * 100}%`,
        top: `${((badgeBox.start + QUIET) / (size + QUIET * 2)) * 100}%`,
        width: `${(badgeBox.span / (size + QUIET * 2)) * 100}%`,
        height: `${(badgeBox.span / (size + QUIET * 2)) * 100}%`,
      }"
    >
      <ArtSprite :name="badge" :color="badgeColor" :accent="badgeAccent" :size="64" class="w-[78%] h-[78%]" />
    </div>
  </div>
</template>
