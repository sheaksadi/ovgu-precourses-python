<script setup lang="ts">
/** PRE-0032 — the cast doing actual teaching work, next to real code. */
const boolean = `is_open = False

if is_open:
    print("come in")`

const list = `bucket = ["nemi", "koi", "bo"]

print(len(bucket))`

const loop = `for house in street:
    deliver(house)`
</script>

<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-6 shrink-0 anim-fade-in-up">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Cast in Practice
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--mint);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        Picture left, code right, one idea per row. The drawing carries the concept; the code carries the syntax.
      </p>
    </header>

    <div class="flex-grow flex flex-col justify-between gap-4">
      <!-- Boolean -->
      <div class="grid md:grid-cols-[1fr_1.3fr] gap-5 items-center rounded-2xl p-4 anim-fade-in-up anim-delay-1" style="background: var(--bg-off);">
        <div class="flex items-center gap-4">
          <ArtSprite name="lever" state="off" color="sky" accent="coral" :size="64" />
          <ArtSprite name="door" color="lavender" accent="sun" :size="64" />
          <div>
            <p class="text-xs font-bold" style="color: var(--text);">A lever and a door</p>
            <p class="text-[11px] leading-relaxed" style="color: var(--text-dim);">
              The lever is the boolean. The door only opens when it is up.
            </p>
          </div>
        </div>
        <CodePanel :code="boolean" filename="door.py" :chrome="false" />
      </div>

      <!-- List -->
      <div class="grid md:grid-cols-[1fr_1.3fr] gap-5 items-center rounded-2xl p-4 anim-fade-in-up anim-delay-2" style="background: var(--bg-off);">
        <div class="flex items-center gap-4">
          <ArtSprite name="basket" color="peach" accent="text" :size="64" />
          <div class="flex">
            <ArtSprite name="fish" color="mint" accent="sky" :size="46" />
            <ArtSprite name="fish" color="coral" accent="rose" :size="46" class="-ml-3" />
            <ArtSprite name="fish" color="lavender" accent="sky" :size="46" class="-ml-3" />
          </div>
          <div>
            <p class="text-xs font-bold" style="color: var(--text);">A basket of fish</p>
            <p class="text-[11px] leading-relaxed" style="color: var(--text-dim);">
              Three items, one container. Colour tells them apart without a single label.
            </p>
          </div>
        </div>
        <CodePanel :code="list" filename="bucket.py" :chrome="false" />
      </div>

      <!-- Loop -->
      <div class="grid md:grid-cols-[1fr_1.3fr] gap-5 items-center rounded-2xl p-4 anim-fade-in-up anim-delay-3" style="background: var(--bg-off);">
        <div class="flex items-center gap-4">
          <div class="flex items-end">
            <ArtSprite name="house" color="sun" accent="coral" :size="52" />
            <ArtSprite name="house" color="mint" accent="sky" :size="52" class="-ml-2" />
            <ArtSprite name="house" color="rose" accent="lavender" :size="52" class="-ml-2" />
          </div>
          <ArtSprite name="bird" color="sky" accent="sun" :size="52" />
          <div>
            <p class="text-xs font-bold" style="color: var(--text);">A bird down a street</p>
            <p class="text-[11px] leading-relaxed" style="color: var(--text-dim);">
              One visitor, many houses. That is a loop before the word is spoken.
            </p>
          </div>
        </div>
        <CodePanel :code="loop" filename="street.py" :chrome="false" :focus="[1]" />
      </div>
    </div>

    <div class="pt-5 flex gap-4 anim-fade-in anim-delay-5">
      <div class="w-1.5 h-10 rounded-full shrink-0" style="background: var(--mint);"></div>
      <p class="text-xs md:text-sm leading-relaxed" style="color: var(--text-dim);">
        <strong style="color: var(--text);">Rule of the cast:</strong> a sprite keeps one meaning for the whole course. Colour separates
        instances, never concepts — a mint fish and a coral fish are two fish, not two ideas. Pair every scene with the code beside it,
        so the picture is a caption for the syntax and never a replacement for it.
      </p>
    </div>
  </div>
</template>
