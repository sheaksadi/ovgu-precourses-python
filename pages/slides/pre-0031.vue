<script setup lang="ts">
/** PRE-0031 — the things the cast acts on. */
import { SPRITES, spritesIn } from '~/utils/sprites'

const tint: Record<string, { color: string, accent: string }> = {
  lever: { color: 'sky', accent: 'coral' },
  box: { color: 'peach', accent: 'coral' },
  key: { color: 'sun', accent: 'text' },
  door: { color: 'lavender', accent: 'sun' },
  ball: { color: 'coral', accent: 'text' },
  book: { color: 'mint', accent: 'sun' },
  basket: { color: 'peach', accent: 'text' },
  flag: { color: 'rose', accent: 'text' },
  house: { color: 'sun', accent: 'coral' },
  road: { color: 'text-muted', accent: 'text' },
  tree: { color: 'sage', accent: 'peach' },
  hill: { color: 'mint', accent: 'text' },
  fence: { color: 'peach', accent: 'text' },
  sign: { color: 'sky', accent: 'text' },
}

const props = spritesIn('prop').filter(name => name !== 'lever-on')
const places = spritesIn('place')
const paint = (name: string) => tint[name] ?? { color: 'coral', accent: 'sun' }
</script>

<template>
  <div class="guide-page w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-6 shrink-0">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Props &amp; Places
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--sun);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        Objects the cast acts on. Each one stands for exactly one programming idea, and it always stands for that same idea.
      </p>
    </header>

    <p class="text-[10px] font-bold uppercase tracking-widest mb-3" style="color: var(--text-muted);">Props</p>
    <div class="grid grid-cols-4 md:grid-cols-8 gap-4">
      <div
        v-for="name in props"
        :key="name"
        class="rounded-xl p-4 flex flex-col items-center gap-2"
        style="background: var(--bg-off);"
      >
        <ArtSprite :name="name" :color="paint(name).color" :accent="paint(name).accent" :size="72" />
        <code class="text-[10px] font-bold" style="color: var(--text);">{{ name }}</code>
        <p class="text-[9px] text-center leading-snug" style="color: var(--text-dim);">{{ SPRITES[name]?.use }}</p>
      </div>
    </div>

    <p class="text-[10px] font-bold uppercase tracking-widest mt-7 mb-3" style="color: var(--text-muted);">Places</p>
    <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
      <div
        v-for="name in places"
        :key="name"
        class="rounded-xl p-4 flex flex-col items-center gap-2"
        style="background: var(--bg-off);"
      >
        <ArtSprite :name="name" :color="paint(name).color" :accent="paint(name).accent" :size="72" />
        <code class="text-[10px] font-bold" style="color: var(--text);">{{ name }}</code>
        <p class="text-[9px] text-center leading-snug" style="color: var(--text-dim);">{{ SPRITES[name]?.use }}</p>
      </div>
    </div>

    <div class="mt-auto pt-7 grid md:grid-cols-3 gap-4 items-start">
      <div class="rounded-2xl p-4 flex items-center gap-4" style="background: var(--bg-off);">
        <div class="flex items-center gap-1">
          <ArtSprite name="lever" state="off" color="sky" accent="coral" :size="52" />
          <ArtSprite name="lever" state="on" color="sky" accent="mint" :size="52" />
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted);">Two states</p>
          <p class="text-[11px] leading-relaxed" style="color: var(--text-dim);">
            <code style="color: var(--text);">state="on"</code> flips the lever. The only sprite that carries state — everything else is one drawing.
          </p>
        </div>
      </div>

      <div class="rounded-2xl p-4 flex items-center gap-4" style="background: var(--bg-off);">
        <div class="flex">
          <ArtSprite name="house" color="sun" accent="coral" :size="46" />
          <ArtSprite name="house" color="mint" accent="sky" :size="46" class="-ml-2" />
          <ArtSprite name="house" color="rose" accent="lavender" :size="46" class="-ml-2" />
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted);">Repeat to mean many</p>
          <p class="text-[11px] leading-relaxed" style="color: var(--text-dim);">
            Three houses is a street, and a street is a list. Overlap them slightly so they read as one group.
          </p>
        </div>
      </div>

      <div class="rounded-2xl p-4 flex items-center gap-4" style="background: var(--bg-off);">
        <ArtSprite name="sign" color="sky" accent="text" :size="52" />
        <div>
          <p class="text-[10px] font-bold uppercase tracking-widest mb-1" style="color: var(--text-muted);">One meaning each</p>
          <p class="text-[11px] leading-relaxed" style="color: var(--text-dim);">
            A sign is always output. Never reuse a prop for a second concept in the same deck — the picture is the vocabulary.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
