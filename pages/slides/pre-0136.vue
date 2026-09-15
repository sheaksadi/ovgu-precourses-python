<script setup lang="ts">
/**
 * PRE-0136 — style guide: notifications. The card is components/deck/ToastCard.vue,
 * the live stack components/deck/ToastStack.vue, the API composables/useToasts.ts.
 */
import { useToasts, type ToastInput } from '~/composables/useToasts'

const { push } = useToasts()

const samples: Array<ToastInput & { use: string }> = [
  { use: 'mint · solved', title: 'Fluffy Otter solved Part 1', body: 'Loops · 3rd so far', tone: 'mint', name: 'Fluffy Otter' },
  { use: 'sun · first place', title: 'Mira solved it first', body: 'Loops · Part 2 · 4:12', tone: 'sun', name: 'Mira' },
  { use: 'sky · room news', title: '12 people are here', body: 'Everyone is on slide 18', tone: 'sky', icon: 'lucide:users' },
  { use: 'coral · problem', title: 'Connection lost', body: 'Trying again …', tone: 'coral', icon: 'lucide:wifi-off' },
]

/** Plays the four samples into the live stack, a beat apart, as they would arrive in a round. */
const play = () => {
  samples.forEach(({ use, ...toast }, index) => setTimeout(() => push(toast), index * 900))
}
</script>

<template>
  <div class="w-full h-full flex flex-col px-8 py-10 md:px-24 md:py-16">
    <header class="mb-8 shrink-0">
      <h2 class="text-3xl md:text-5xl font-black tracking-tight" style="color: var(--text);">
        Notifications
      </h2>
      <div class="mt-3 h-1 w-16 rounded-full" style="background: var(--sun);"></div>
      <p class="mt-4 text-sm" style="color: var(--text-dim);">
        One card for everything the room should notice. Top-right, newest on top, gone after four seconds.
      </p>
    </header>

    <div class="flex-grow grid md:grid-cols-2 gap-10 min-h-0">
      <div class="flex flex-col gap-4">
        <p class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--text-muted);">Tones — the badge and the hold bar carry the colour</p>
        <div v-for="sample in samples" :key="sample.use" class="flex items-center gap-4">
          <DeckToastCard :title="sample.title" :body="sample.body" :tone="sample.tone" :name="sample.name" :icon="sample.icon" />
          <span class="text-[11px] font-bold" style="color: var(--text-dim);">{{ sample.use }}</span>
        </div>
        <button type="button" class="play" @click="play">
          <Icon name="lucide:bell" />
          <span class="text-trim">Play them live</span>
        </button>
      </div>

      <div class="flex flex-col gap-3 text-sm" style="color: var(--text-dim);">
        <p class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--text-muted);">Rules</p>
        <p><b style="color: var(--text);">Title</b> says who and what, in one line: “Mira solved Part 1”. <b style="color: var(--text);">Body</b> says where, muted.</p>
        <p><b style="color: var(--text);">Badge:</b> a person gets their avatar (their animal, or their initial on a colour taken from the name); room messages get an icon.</p>
        <p><b style="color: var(--text);">Stack:</b> at most four; a fifth pushes the oldest out. On slide views it starts below the sync pill. Peek frames show none.</p>
        <p><b style="color: var(--text);">Motion:</b> slides in 1.5rem from the right, 400ms, <code>cubic-bezier(0.22, 1, 0.36, 1)</code>; leaves with a 200ms fade; the cards below glide up. The bar runs out over the hold time. A click dismisses.</p>
        <p><b style="color: var(--text);">Code:</b> <code>useToasts().push({ title, body, tone, name })</code>. Never build a one-off notification.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
code {
  font-family: var(--font-code);
  font-size: 0.9em;
  color: var(--text);
}

.play {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.7rem 1rem;
  border-radius: 0.75rem;
  background: var(--text);
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--bg);
}
</style>
