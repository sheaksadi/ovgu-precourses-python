<script setup lang="ts">
/**
 * Presenter view panel for a problem slide. Auto-imported as `<PresenterProblemPanel>`.
 *
 * Every named follow-along device in the room with its solve time per part.
 * Devices that have not solved anything yet are listed last and tinted, so the
 * presenter knows whom to walk over to. Solvers come from the problem room,
 * the names of everyone else from the presence summary.
 */
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useProblems, type Part } from '~/composables/useProblems'
import { usePresentationStore } from '~/stores/presentationStore'
import { localizeName } from '~/utils/cuteNames'

const props = defineProps<{ problemId: string }>()
const { t, locale } = useI18n()
const problems = useProblems()
const store = usePresentationStore()

const room = computed(() => problems.room.value[props.problemId])

const clockTime = (at: number | undefined) => {
  const opened = room.value?.openedAt
  if (!at || !opened) return '–'
  const seconds = Math.max(0, Math.floor((at - opened) / 1000))
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

const rows = computed(() => {
  const standings = room.value?.standings ?? []
  const solvers = new Set(standings.map(entry => entry.audienceId))
  const waiting = (store.presence.members ?? [])
    .filter(member => !solvers.has(member.audienceId))
    .map(member => ({ audienceId: member.audienceId, name: member.name, parts: {} as Partial<Record<Part, number>> }))
  return [...standings, ...waiting].map(entry => ({ ...entry, shown: localizeName(entry.name, locale.value) }))
})

const total = computed(() => rows.value.length)
const solved = (part: Part) => rows.value.filter(entry => entry.parts[part]).length
const stuck = computed(() => rows.value.filter(entry => !entry.parts[1]).length)
</script>

<template>
  <div class="bg-gray-900 border border-gray-800 rounded-2xl p-5">
    <div class="flex items-center justify-between gap-3 mb-3">
      <span class="text-xs uppercase tracking-widest text-gray-500 truncate">Puzzle · {{ t(`problems.${problemId}.title`) }}</span>
      <span class="flex-none font-mono text-xs text-gray-400">P1 {{ solved(1) }}/{{ total }} · P2 {{ solved(2) }}/{{ total }}</span>
    </div>
    <p v-if="stuck" class="text-xs text-amber-400 mb-2">{{ stuck }} without Part 1 yet</p>
    <ul v-if="rows.length" class="max-h-72 overflow-y-auto divide-y divide-gray-800">
      <li v-for="entry in rows" :key="entry.audienceId" class="flex items-center gap-3 py-1.5 text-sm">
        <span class="flex-1 truncate" :class="entry.parts[1] ? 'text-gray-200' : 'text-amber-300'">{{ entry.shown }}</span>
        <span class="w-12 text-right font-mono text-xs" :class="entry.parts[1] ? 'text-emerald-400' : 'text-gray-600'">{{ clockTime(entry.parts[1]) }}</span>
        <span class="w-12 text-right font-mono text-xs" :class="entry.parts[2] ? 'text-emerald-400' : 'text-gray-600'">{{ clockTime(entry.parts[2]) }}</span>
      </li>
    </ul>
    <p v-else class="text-sm italic text-gray-600">No named devices in the room yet.</p>
  </div>
</template>
