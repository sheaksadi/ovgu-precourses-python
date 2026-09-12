<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SlideTable from '~/components/dashboard/SlideTable.vue'
import QRCodeDisplay from '~/components/control/QRCodeDisplay.vue'
import { usePresentationStore } from '~/stores/presentationStore'
import { useWebSocket } from '~/composables/useWebSocket'
import { useRoomKey } from '~/composables/useRoomKey'

const store = usePresentationStore()
const ws = useWebSocket()
const { available: keyAvailable, open: controlOpen, load: loadRoomKey, linkQuery } = useRoomKey()
const remoteQuery = ref('')

const following = computed(() => Math.max(0, store.presence.viewers - store.presence.detached))

onMounted(async () => {
  if (ws && ws.connect) ws.connect()
  await loadRoomKey()
  remoteQuery.value = linkQuery()
})
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-200 p-8 md:p-12 font-sans">
    <header class="max-w-6xl mx-auto mb-12 flex justify-between items-end border-b border-gray-800 pb-8">
      <div>
        <h1 class="text-4xl font-bold text-white mb-2 tracking-tight">Presentation Dashboard</h1>
        <p class="text-gray-500">Manage your slides, view speaker notes, and control remotely.</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/presenter"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Icon name="lucide:presentation" />
          Presenter view
        </NuxtLink>
        <div class="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
          <div class="w-2.5 h-2.5 rounded-full" :class="store.connectedClients > 0 ? 'bg-green-500' : 'bg-gray-600'"></div>
          <span class="text-sm font-medium text-gray-400">
            {{ store.connectedClients }} device(s) connected
          </span>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <SlideTable />
      </div>
      <div class="space-y-8">
        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-2xl">
          <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Icon name="lucide:smartphone" class="text-blue-400" />
            Remote Control
          </h3>
          <p class="text-sm text-gray-400 mb-6 leading-relaxed">
            Scan this QR code with your phone to use it as a remote control and teleprompter. Both devices must be on the same network.
            The remote and the presenter view are the only surfaces that move the room's slide.
          </p>
          <p v-if="keyAvailable === false && !controlOpen" class="text-xs text-amber-300 mb-4">
            This dashboard is open from another device, so it cannot show the room key. Open the
            dashboard on the machine running the presentation to hand out a working remote link.
          </p>
          <p v-else-if="controlOpen" class="text-xs text-gray-500 mb-4">
            Control is open: DECK_OPEN_CONTROL=1 is set, so any device on the network can drive the room.
          </p>
          <p v-else class="text-xs text-gray-500 mb-4">
            The link below carries this session's room key. It stops working when the server restarts.
          </p>
          <QRCodeDisplay path="/control" :query="remoteQuery" />
        </div>

        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-2xl">
          <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Icon name="lucide:hand" class="text-amber-400" />
            Audience Link
          </h3>
          <p class="text-sm text-gray-400 mb-6 leading-relaxed">
            Share this code with the room. Each device follows along, keeps its own position when it
            wants to, and rejoins with the sync button.
          </p>
          <QRCodeDisplay path="/join" />
        </div>

        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-2xl">
          <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Icon name="lucide:users" class="text-emerald-400" />
            Audience
          </h3>
          <dl class="grid grid-cols-3 gap-3 text-center">
            <div>
              <dt class="text-[11px] text-gray-500">Following</dt>
              <dd class="text-2xl font-bold text-emerald-400">{{ following }}</dd>
            </div>
            <div>
              <dt class="text-[11px] text-gray-500">Off-sync</dt>
              <dd class="text-2xl font-bold text-amber-400">{{ store.presence.detached }}</dd>
            </div>
            <div>
              <dt class="text-[11px] text-gray-500">Working</dt>
              <dd class="text-2xl font-bold text-blue-400">{{ store.presence.interacting }}</dd>
            </div>
          </dl>
        </div>
        
        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-2xl">
           <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Icon name="lucide:keyboard" class="text-emerald-400" />
            Keyboard Shortcuts
          </h3>
          <ul class="space-y-3 text-sm text-gray-400">
            <li class="flex justify-between"><span>Next Slide</span> <kbd class="px-2 py-1 bg-gray-800 rounded font-mono text-gray-300">Space</kbd></li>
            <li class="flex justify-between"><span>Prev Slide</span> <kbd class="px-2 py-1 bg-gray-800 rounded font-mono text-gray-300">Backspace</kbd></li>
            <li class="flex justify-between"><span>Exit</span> <kbd class="px-2 py-1 bg-gray-800 rounded font-mono text-gray-300">Esc</kbd></li>
            <li class="flex justify-between"><span>Toggle Notes</span> <kbd class="px-2 py-1 bg-gray-800 rounded font-mono text-gray-300">T</kbd></li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>