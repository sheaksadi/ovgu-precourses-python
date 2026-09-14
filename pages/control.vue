<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePresentation } from '~/composables/usePresentation'
import { useSlideData } from '~/composables/useSlideData'
import { usePresentationStore } from '~/stores/presentationStore'
import { useWebSocket } from '~/composables/useWebSocket'
import QRCodeDisplay from '~/components/control/QRCodeDisplay.vue'

const { goToSlide, goToIndex, flatSlides } = usePresentation()
const { firstSlideId, getSlideById } = useSlideData()
const { sendCommand, sendPointer } = useWebSocket()
const store = usePresentationStore()
const menuOpen = ref(false)
const showQrModal = ref(false)

// Control page has no local slide — track the global room position instead.
const currentSlideData = computed(() => getSlideById(store.globalSlideId) || getSlideById(firstSlideId.value))
const currentIndex = computed(() => flatSlides.value.findIndex(s => s.id === (store.globalSlideId || firstSlideId.value)))

const nextSlide = () => {
  const i = currentIndex.value
  if (i < flatSlides.value.length - 1) goToIndex(i + 1)
  else if (i < 0) goToIndex(0)
}
const prevSlide = () => {
  const i = currentIndex.value
  if (i > 0) goToIndex(i - 1)
}

// Laser Pointer Touchpad logic
const touchpadRef = ref<HTMLElement | null>(null)
const pointerActive = ref(false)
const pointerX = ref(0.5)
const pointerY = ref(0.5)
let lastPointerSend = 0

// Predefined colors
const pointerColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#a855f7', '#ec4899']

let savedClientId = ''
let savedColor = ''

if (import.meta.client) {
  savedClientId = localStorage.getItem('remote_client_id') || ''
  if (!savedClientId) {
    savedClientId = Math.random().toString(36).substring(2, 9)
    localStorage.setItem('remote_client_id', savedClientId)
  }
  
  savedColor = localStorage.getItem('remote_pointer_color') || ''
  if (!savedColor || !pointerColors.includes(savedColor)) {
    savedColor = pointerColors[Math.floor(Math.random() * pointerColors.length)]
    localStorage.setItem('remote_pointer_color', savedColor)
  }
}

// Unique ID for this remote
const clientId = savedClientId || Math.random().toString(36).substring(2, 9)
const pointerColor = ref(savedColor || pointerColors[0])

watch(pointerColor, (newColor) => {
  if (import.meta.client) {
    localStorage.setItem('remote_pointer_color', newColor)
  }
})

const updatePointer = (clientX: number, clientY: number) => {
  if (!touchpadRef.value) return
  const rect = touchpadRef.value.getBoundingClientRect()
  
  let x = (clientX - rect.left) / rect.width
  let y = (clientY - rect.top) / rect.height
  
  x = Math.max(0, Math.min(1, x))
  y = Math.max(0, Math.min(1, y))
  
  pointerX.value = x
  pointerY.value = y

  const now = Date.now()
  if (now - lastPointerSend > 16) { // ~60 FPS
    sendPointer(clientId, true, x, y, pointerColor.value)
    lastPointerSend = now
  }
}

const handlePointerStart = (e: TouchEvent | MouseEvent) => {
  pointerActive.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY
  updatePointer(clientX, clientY)
}

const handlePointerMove = (e: TouchEvent | MouseEvent) => {
  if (!pointerActive.value) return
  const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY
  updatePointer(clientX, clientY)
}

const handlePointerEnd = () => {
  if (!pointerActive.value) return
  pointerActive.value = false
  sendPointer(clientId, false, pointerX.value, pointerY.value, pointerColor.value)
}

definePageMeta({
  layout: false
})
</script>

<template>
<div class="h-dvh min-h-dvh bg-black text-white flex flex-col font-sans touch-none selection:bg-none select-none overflow-hidden relative">
    <!-- QR Modal Overlay -->
    <div v-if="showQrModal" class="absolute inset-0 bg-black/95 z-[60] flex flex-col items-center justify-center p-6">
      <button @click="showQrModal = false" class="absolute top-6 right-6 p-2 bg-gray-800 rounded-full hover:bg-gray-700">
        <Icon name="lucide:x" class="text-2xl" />
      </button>
      <h2 class="text-2xl font-bold mb-8">Scan to Control</h2>
      <QRCodeDisplay />
    </div>

    <!-- ===== Top Nav Bar ===== -->
    <header class="flex-none p-3 border-b border-gray-800 bg-black z-50">
      <div class="flex items-center gap-2 min-w-0">
        <span class="shrink-0 text-sm text-blue-400 font-bold">PRESENTATION</span>
        <span class="text-gray-700 text-xs shrink-0">/</span>
        <span class="truncate text-sm font-semibold text-white">{{ currentSlideData?.title || 'Ready to Present' }}</span>
      </div>
      <button @click="menuOpen = !menuOpen" class="shrink-0 text-gray-300 hover:text-white p-1" :aria-label="menuOpen ? 'Close menu' : 'Open menu'">
        <Icon :name="menuOpen ? 'lucide:x' : 'lucide:menu'" class="text-2xl" />
      </button>
    </header>

    <!-- Menu Overlay -->
    <div v-if="menuOpen" class="absolute inset-0 top-[60px] bg-black/95 z-40 flex flex-col pb-6 px-6 overflow-y-auto">
      <div class="flex flex-col gap-4 mt-6">
        <button @click="() => { sendCommand('goto_dashboard'); menuOpen = false }" class="w-full py-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-left px-6 text-lg font-bold flex items-center gap-4 transition-colors">
          <Icon name="lucide:layout-dashboard" /> Go to Dashboard
        </button>
        <button @click="() => { showQrModal = true; menuOpen = false }" class="w-full py-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-left px-6 text-lg font-bold flex items-center gap-4 transition-colors">
          <Icon name="lucide:qr-code" /> Show QR Code
        </button>
        <button @click="() => { store.isPresenting = true; goToIndex(0); menuOpen = false }" class="w-full py-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-left px-6 text-lg font-bold flex items-center gap-4 transition-colors">
          <Icon name="lucide:rotate-ccw" /> Restart Presentation
        </button>

        <div class="text-gray-500 text-xs font-bold uppercase tracking-wider pb-1">Jump to Slide</div>
        <button 
          v-for="(slide, index) in flatSlides" :key="slide.id"
          @click="() => { store.isPresenting = true; goToSlide(slide.id); menuOpen = false }"
          class="w-full py-3 bg-gray-900 border hover:bg-gray-800 rounded-xl text-left px-6 text-base flex items-center gap-4 transition-colors"
          :class="currentIndex === index ? 'border-blue-500 text-blue-400' : 'border-gray-800'"
        >
          <span class="font-mono text-gray-500 shrink-0 w-10">{{ slide.pageLabel }}</span>
          <span class="truncate">{{ slide.title }}</span>
        </button>
      </div>
    </div>

    <!-- ===== Main Content ===== -->
    <div class="flex-1 flex flex-col min-h-0">
      <!-- Always show controls — no "ready to present" gate -->
      <div class="flex-1 flex flex-col justify-end min-h-0">
        <!-- Scrollable Notes -->
        <div class="flex-1 min-h-0 overflow-y-auto px-5 pt-3 pb-2">
          <div v-if="currentSlideData?.teleprompter" class="text-lg leading-relaxed text-gray-200">
            {{ currentSlideData.teleprompter }}
          </div>
          <div v-else class="text-gray-600 italic text-center py-8">No notes for this slide</div>
        </div>

        <!-- Fixed Controls -->
        <div class="flex-none border-t border-gray-800 bg-black">
          <!-- Laser -->
          <div class="pt-3 pb-1">
            <div class="text-gray-500 text-[10px] uppercase tracking-widest text-center mb-2">Laser</div>
            <div 
              ref="touchpadRef"
              class="w-[calc(100%-2rem)] mx-auto h-28 bg-gray-900 border border-gray-800 rounded-2xl relative overflow-hidden flex items-center justify-center select-none"
              @mousedown="handlePointerStart"
              @mousemove.stop="handlePointerMove"
              @mouseup="handlePointerEnd"
              @mouseleave="handlePointerEnd"
              @touchstart="handlePointerStart"
              @touchmove="handlePointerMove"
              @touchend="handlePointerEnd"
            >
              <div v-if="!pointerActive" class="text-gray-600 font-bold tracking-widest uppercase text-xs pointer-events-none flex flex-col items-center gap-2">
                <Icon name="lucide:navigation" class="text-2xl opacity-50" />
                <span>Tap to aim</span>
              </div>
              <div v-else class="absolute w-14 h-14 rounded-full flex items-center justify-center pointer-events-none" :style="{ left: `${pointerX * 100}%`, top: `${pointerY * 100}%`, transform: 'translate(-50%, -50%)', backgroundColor: pointerColor + '33' }">
                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: pointerColor, boxShadow: `0 0 15px ${pointerColor}` }"></div>
              </div>
            </div>
          </div>

          <!-- Colors -->
          <div class="flex justify-center gap-3 mb-2">
            <button 
              v-for="color in pointerColors" :key="color"
              @click="pointerColor = color"
              class="w-5 h-5 rounded-full border-2 transition-transform"
              :class="pointerColor === color ? 'scale-125 border-white shadow-[0_0_8px_rgba(255,255,255,0.3)] z-10' : 'border-transparent opacity-50 hover:opacity-100'"
              :style="{ backgroundColor: color }"
            ></button>
          </div>

          <!-- Nav Buttons -->
          <div class="pb-[max(1rem,env(safe-area-inset-bottom))] pt-1">
            <div class="grid grid-cols-2 gap-3 px-4">
              <button 
                @click="prevSlide()" 
                class="bg-gray-800 active:bg-gray-700 rounded-2xl flex flex-col items-center justify-center gap-1 py-4 transition-colors border border-gray-700"
                :class="{'opacity-50 pointer-events-none': currentIndex === 0}"
                :aria-label="'Previous slide'"
              >
                <Icon name="lucide:arrow-left" class="text-3xl" />
                <span class="text-sm font-medium">Prev</span>
              </button>
              <button 
                @click="nextSlide()" 
                class="bg-blue-600 active:bg-blue-500 rounded-2xl flex flex-col items-center justify-center gap-1 py-4 transition-colors border border-blue-500"
                :class="{'opacity-50 pointer-events-none': currentIndex === flatSlides.length - 1}"
                :aria-label="'Next slide'"
              >
                <Icon name="lucide:arrow-right" class="text-3xl text-white" />
                <span class="text-sm font-medium text-white">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  overscroll-behavior-y: contain;
}
</style>
