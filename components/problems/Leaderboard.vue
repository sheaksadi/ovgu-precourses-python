<script setup lang="ts">
/**
 * The leaderboard of a problem round. Auto-imported as `<ProblemsLeaderboard round="loops" />`.
 *
 * Stars are solved parts across the round's problems; ties go to whoever got
 * there first. Times count from when the round's first problem opened. The
 * projector shows the top ten in two columns, with the podium tinted; a
 * follow-along device shows everyone and its own place.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useDeckRole } from '~/composables/useDeckRole'
import { useAudience } from '~/composables/useAudience'
import { useProblems } from '~/composables/useProblems'
import { PROBLEM_ROUNDS } from '~/utils/problemRounds'
import { avatarFor, localizeName } from '~/utils/cuteNames'
import type { SpriteName } from '~/utils/sprites'

const props = defineProps<{ round: string }>()
const { t, locale } = useI18n()
const { isViewer, isPeek, isProjector } = useDeckRole()
const audience = useAudience()
const problems = useProblems()

const onDevice = computed(() => isViewer.value && !isPeek.value && !isProjector.value)
const ids = computed(() => PROBLEM_ROUNDS[props.round] ?? [])

const start = computed(() => Math.min(...ids.value.map(id => problems.room.value[id]?.openedAt ?? Number.POSITIVE_INFINITY)))

const board = computed(() => {
  const merged = new Map<string, { audienceId: string, name: string, points: number, lastAt: number }>()
  for (const id of ids.value) {
    for (const standing of problems.room.value[id]?.standings ?? []) {
      const entry = merged.get(standing.audienceId) ?? { audienceId: standing.audienceId, name: standing.name, points: 0, lastAt: 0 }
      entry.points += standing.points
      entry.lastAt = Math.max(entry.lastAt, standing.lastAt)
      entry.name = standing.name
      merged.set(standing.audienceId, entry)
    }
  }
  return [...merged.values()]
    .sort((a, b) => b.points - a.points || a.lastAt - b.lastAt)
    .map((entry, index) => {
      const shown = localizeName(entry.name, locale.value)
      return { ...entry, rank: index + 1, shown, avatar: avatarFor(shown), time: clockTime(entry.lastAt - start.value) }
    })
})

const rows = computed(() => (onDevice.value ? board.value : board.value.slice(0, 10)))
const myRank = computed(() => board.value.find(entry => entry.audienceId === audience.id.value)?.rank ?? null)

function clockTime(ms: number) {
  if (!Number.isFinite(ms)) return ''
  const seconds = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
</script>

<template>
  <div class="board" :class="onDevice ? 'is-device' : 'is-stage'">
    <header class="board-head">
      <p class="board-eyebrow">{{ t('problems.board.eyebrow') }}</p>
      <h2 class="board-title">{{ t('problems.board.title') }}</h2>
      <p v-if="onDevice" class="board-you">
        {{ myRank ? t('problems.board.yourPlace', { rank: myRank }) : t('problems.board.notYet') }}
      </p>
    </header>

    <TransitionGroup v-if="rows.length" tag="ol" name="leader" class="board-list">
      <li
        v-for="entry in rows"
        :key="entry.audienceId"
        class="board-row"
        :class="[`is-rank-${Math.min(entry.rank, 4)}`, { 'is-me': onDevice && entry.audienceId === audience.id.value }]"
      >
        <span class="board-rank"><span class="text-trim">{{ entry.rank }}</span></span>
        <span class="board-avatar" :class="{ 'has-sprite': entry.avatar.sprite }" :style="{ '--badge': `var(--${entry.avatar.color})`, '--badge-ink': entry.avatar.ink }" aria-hidden="true">
          <ArtSprite v-if="entry.avatar.sprite" :name="entry.avatar.sprite as SpriteName" :color="entry.avatar.color" accent="sun" :size="48" class="board-avatar-art" />
          <span v-else class="text-trim">{{ entry.avatar.initial }}</span>
        </span>
        <span class="board-name">{{ entry.shown }}</span>
        <span class="board-stars" :aria-label="`${entry.points}`">{{ '★'.repeat(entry.points) }}</span>
        <span class="board-time">{{ entry.time }}</span>
      </li>
    </TransitionGroup>
    <p v-else class="board-empty">{{ t('problems.board.empty') }}</p>
  </div>
</template>

<style scoped>
.board {
  width: 100%;
  height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-text);
}

/* ─── Projector ──────────────────────────────────────────────────────── */
.is-stage {
  padding: 9vh 6vw 10vh;
}
.is-stage .board-eyebrow {
  font-size: clamp(0.6rem, 1.35vh, 0.95rem);
}
.board-eyebrow {
  /* 0.7rem, not less: below 11px a label stops being read on a phone. */
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.board-title {
  margin-top: 1.2vh;
  font-size: clamp(2rem, 8vh, 5.6rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.04em;
}
.is-stage .board-list {
  margin: 5vh 0 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(5, auto);
  grid-auto-flow: column;
  gap: 1.4vh 3vw;
}
.board-list {
  padding: 0;
  list-style: none;
}
.board-row {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 1.4vh;
  padding: 1.2vh 1.8vh;
  border-radius: 1.6vh;
  background: var(--bg);
  border: 2px solid var(--border);
  font-size: clamp(0.85rem, 2.3vh, 1.6rem);
  font-weight: 800;
}
.board-row.is-rank-1 {
  border-color: var(--text);
  background: color-mix(in srgb, var(--sun) 35%, var(--bg));
}
.board-row.is-rank-2 {
  border-color: var(--text);
  background: color-mix(in srgb, var(--sky) 18%, var(--bg));
}
.board-row.is-rank-3 {
  border-color: var(--text);
  background: color-mix(in srgb, var(--peach) 22%, var(--bg));
}
.board-rank {
  display: grid;
  place-items: center;
  width: 4.2vh;
  height: 4.2vh;
  border-radius: 999px;
  background: var(--text);
  font-size: 0.7em;
  color: var(--bg);
}
.board-avatar {
  display: grid;
  place-items: center;
  width: 4.6vh;
  height: 4.6vh;
  border-radius: 999px;
  background: var(--badge);
  border: 2px solid var(--text);
  font-size: 0.75em;
  font-weight: 900;
  color: var(--badge-ink, #FFFFFF);
}
.board-avatar.has-sprite {
  background: color-mix(in srgb, var(--badge) 22%, var(--bg));
}
.board-avatar-art {
  width: 3.6vh;
  height: 3.6vh;
}
.board-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.board-stars {
  color: var(--text);
  letter-spacing: 0.08em;
}
.board-time {
  font-family: var(--font-code);
  font-size: 0.8em;
  color: var(--text-muted);
}
.board-empty {
  margin-top: 5vh;
  font-size: clamp(0.9rem, 2.4vh, 1.7rem);
  font-weight: 700;
  color: var(--text-muted);
}

/* ─── Device ─────────────────────────────────────────────────────────── */
.is-device {
  overflow-y: auto;
  padding: 4rem 1rem 5rem;
}
.is-device .board-title {
  font-size: clamp(1.8rem, 8vw, 2.6rem);
}
.board-you {
  margin-top: 0.6rem;
  font-size: 1rem;
  font-weight: 800;
}
.is-device .board-list {
  margin: 1.25rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.is-device .board-row {
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.9rem;
  font-size: 0.9rem;
}
.is-device .board-rank {
  width: 1.8rem;
  height: 1.8rem;
}
.is-device .board-avatar {
  width: 2rem;
  height: 2rem;
}
.is-device .board-avatar-art {
  width: 1.6rem;
  height: 1.6rem;
}
.board-row.is-me {
  outline: 3px solid var(--coral);
  outline-offset: 2px;
}
.is-device .board-empty {
  margin-top: 1.5rem;
  font-size: 0.95rem;
}

.leader-enter-active {
  transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.leader-enter-from {
  opacity: 0;
  transform: translateX(1.5vh);
}
.leader-move {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
