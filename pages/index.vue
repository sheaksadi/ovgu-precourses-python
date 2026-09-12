<script setup lang="ts">
import { usePresentationStore } from '~/stores/presentationStore'

const store = usePresentationStore()

definePageMeta({
  layout: false
})
</script>

<template>
  <div class="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans overflow-hidden relative">
    
    <!-- Background Animation -->
    <div class="absolute inset-0 z-0 opacity-20">
      <div class="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
      <div class="absolute top-1/3 right-1/4 w-[40vw] h-[40vw] bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
    </div>

    <!-- Main Content -->
    <div class="z-10 text-center px-6 max-w-4xl w-full">
      <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gray-900/80 border border-gray-800 text-sm font-bold text-gray-300 mb-12 shadow-2xl backdrop-blur-sm">
        <div class="w-2 h-2 rounded-full" :class="store.connectedClients > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'"></div>
        <span>{{ store.connectedClients > 0 ? 'Remote Connected' : 'Waiting for Remote' }}</span>
      </div>

      <h1 class="text-6xl md:text-8xl font-black mb-8 tracking-tight bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent drop-shadow-sm">
        Presentation <br/> Standby
      </h1>
      
      <p class="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
        Please scan the QR code on the dashboard to connect your remote control and begin.
      </p>

      <div class="mt-16 flex flex-wrap justify-center gap-4">
        <NuxtLink 
          to="/dashboard" 
          class="flex items-center gap-3 px-6 py-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-blue-500/50 rounded-2xl transition-all duration-300 group shadow-xl"
        >
          <Icon name="lucide:layout-dashboard" class="text-2xl text-blue-400 group-hover:scale-110 transition-transform" />
          <span class="font-bold text-lg text-gray-200 group-hover:text-white">Dashboard</span>
        </NuxtLink>
        <NuxtLink 
          to="/presenter" 
          class="flex items-center gap-3 px-6 py-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 group shadow-xl"
        >
          <Icon name="lucide:presentation" class="text-2xl text-emerald-400 group-hover:scale-110 transition-transform" />
          <span class="font-bold text-lg text-gray-200 group-hover:text-white">Presenter view</span>
        </NuxtLink>
        <NuxtLink 
          to="/join" 
          class="flex items-center gap-3 px-6 py-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-amber-500/50 rounded-2xl transition-all duration-300 group shadow-xl"
        >
          <Icon name="lucide:hand" class="text-2xl text-amber-400 group-hover:scale-110 transition-transform" />
          <span class="font-bold text-lg text-gray-200 group-hover:text-white">Follow along</span>
        </NuxtLink>
      </div>

      <p class="mt-8 text-sm text-gray-600">
        Handout version: <NuxtLink to="/print" class="underline hover:text-gray-400">printable deck</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite alternate;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
