<script setup lang="ts">
/** PRE-0030 — the animals that carry the examples. */
const cast = [
  { name: 'cat', color: 'coral', accent: 'rose', label: 'Momo', use: 'Default protagonist. One object with attributes' },
  { name: 'dog', color: 'sky', accent: 'peach', label: 'Rex', use: 'A second instance of the same idea' },
  { name: 'bird', color: 'lavender', accent: 'sun', label: 'Pip', use: 'Movement — loops, steps, iteration' },
  { name: 'frog', color: 'sage', accent: 'mint', label: 'Bo', use: 'True / False. A boolean with eyes' },
  { name: 'fish', color: 'mint', accent: 'sky', label: 'Nemi', use: 'An item inside a container' },
  { name: 'bunny', color: 'rose', accent: 'coral', label: 'Hopps', use: 'Counting. They add up fast' },
] as const

const tints = ['coral', 'mint', 'sky', 'rose', 'sun', 'lavender', 'peach', 'sage'] as const

/** The cat comes in five poses. Same character, different state. */
const poses = [
  { name: 'cat', label: 'sitting', use: 'Default. Any example' },
  { name: 'cat-loaf', label: 'loaf', use: 'At rest, settled value' },
  { name: 'cat-peek', label: 'peek', use: 'Inside a box or list' },
  { name: 'cat-sleep', label: 'sleep', use: 'Waiting, idle, done' },
  { name: 'cat-stand', label: 'stand', use: 'Moving, one loop pass' },
] as const
</script>

<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-8 shrink-0">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Cast: Critters
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--coral);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        Six animals carry every example. Flat SVG, 2px outlines, tinted from the palette — so a variable can literally be a coral cat.
      </p>
    </header>

    <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
      <div
        v-for="(member, index) in cast"
        :key="member.name"
        class="rounded-2xl p-4 flex flex-col items-center gap-3"
        style="background: var(--bg-off);"
      >
        <ArtSprite :name="member.name" :color="member.color" :accent="member.accent" :size="76" :label="member.label" />
        <div class="text-center">
          <p class="text-xs font-bold" style="color: var(--text);">{{ member.label }}</p>
          <code class="text-[10px]" style="color: var(--text-muted);">{{ member.name }}</code>
        </div>
        <p class="text-[10px] text-center leading-relaxed" style="color: var(--text-dim);">{{ member.use }}</p>
      </div>
    </div>

    <div class="mt-8 flex-grow grid md:grid-cols-3 gap-5 items-start content-start">
      <div class="rounded-2xl p-5" style="background: var(--bg-off);">
        <p class="text-[10px] font-bold uppercase tracking-widest mb-4" style="color: var(--text-muted);">One sprite, eight tints</p>
        <div class="flex flex-wrap items-end gap-3">
          <ArtSprite v-for="tint in tints" :key="tint" name="cat" :color="tint" accent="text" :size="40" />
        </div>
        <p class="text-[11px] mt-4 leading-relaxed" style="color: var(--text-dim);">
          Colour is data. Three coral cats and one mint cat is a list with one odd element, and nobody needs the word "element" explained.
        </p>
      </div>

      <div class="rounded-2xl p-5" style="background: var(--bg-off);">
        <p class="text-[10px] font-bold uppercase tracking-widest mb-4" style="color: var(--text-muted);">Sizes</p>
        <div class="flex items-end gap-5">
          <div class="flex flex-col items-center gap-2">
            <ArtSprite name="dog" color="sky" accent="peach" :size="40" />
            <code class="text-[9px]" style="color: var(--text-muted);">40 · inline</code>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ArtSprite name="dog" color="sky" accent="peach" :size="64" />
            <code class="text-[9px]" style="color: var(--text-muted);">64 · default</code>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ArtSprite name="dog" color="sky" accent="peach" :size="96" />
            <code class="text-[9px]" style="color: var(--text-muted);">96 · hero</code>
          </div>
        </div>
        <p class="text-[11px] mt-4 leading-relaxed" style="color: var(--text-dim);">
          Never below 40 on a projector. Outlines stay 2.5 at every size, so the set keeps one weight.
        </p>
      </div>

      <div class="rounded-2xl p-5" style="background: var(--bg-off);">
        <p class="text-[10px] font-bold uppercase tracking-widest mb-4" style="color: var(--text-muted);">Names are fixed</p>
        <div class="flex flex-wrap gap-2 mb-3">
          <span v-for="member in cast" :key="member.label" class="tag" :class="`tag-${member.color}`">{{ member.label }}</span>
        </div>
        <p class="text-[11px] leading-relaxed" style="color: var(--text-dim);">
          Momo is always the cat, Rex always the dog. One word, no surnames, never reassigned to another species — the names become
          variable names in the code, and a beginner should recognise them on sight.
        </p>
      </div>

      <div class="rounded-2xl p-5 md:col-span-3" style="background: var(--bg-off);">
        <p class="text-[10px] font-bold uppercase tracking-widest mb-4" style="color: var(--text-muted);">Momo has five poses</p>
        <div class="flex flex-wrap items-end gap-6">
          <div v-for="pose in poses" :key="pose.name" class="flex flex-col items-center gap-1.5">
            <ArtSprite :name="pose.name" color="coral" accent="rose" :size="66" />
            <code class="text-[10px] font-bold" style="color: var(--text);">{{ pose.label }}</code>
            <span class="text-[9px] text-center leading-snug" style="color: var(--text-dim);">{{ pose.use }}</span>
          </div>
        </div>
        <p class="text-[11px] mt-4 leading-relaxed" style="color: var(--text-dim);">
          One character, five states — not five characters. A sleeping cat is the same Momo, waiting.
        </p>
      </div>
    </div>

    <div class="pt-6 flex gap-4">
      <div class="w-1.5 h-10 rounded-full shrink-0" style="background: var(--coral);"></div>
      <p class="text-xs md:text-sm leading-relaxed" style="color: var(--text-dim);">
        <code style="color: var(--text);">&lt;ArtSprite name="cat" color="coral" accent="rose" :size="76" /&gt;</code> —
        body takes <code style="color: var(--text);">color</code>, second colour takes <code style="color: var(--text);">accent</code>,
        outlines are always <code style="color: var(--text);">--text</code>. Sprites live in <code style="color: var(--text);">utils/sprites.ts</code>.
      </p>
    </div>
  </div>
</template>
