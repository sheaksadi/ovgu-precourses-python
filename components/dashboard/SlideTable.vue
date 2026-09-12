<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSlideData } from '~/composables/useSlideData'

const { slideTree, mainSlideCount, flatSlides } = useSlideData()
const router = useRouter()

/**
 * The dashboard is not a controller: the room's slide only moves from `/control`
 * and `/presenter`. Opening a slide here turns this browser into a slide view,
 * which then follows the presenter.
 */
const openOnThisScreen = (route: string) => router.push(route)
const openFirstSlide = () => {
  const first = flatSlides.value[0]
  if (first) router.push(first.route)
}
</script>

<template>
  <div class="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
    <div class="p-6 border-b border-gray-800 flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold text-white">Presentation Slides</h2>
        <p class="text-xs text-gray-500 mt-1">
          {{ mainSlideCount }} main slide(s). Order comes from slides.config.ts, and the room is driven
          from the remote or the presenter view.
        </p>
      </div>
      <button 
        @click="openFirstSlide" 
        class="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
      >
        <Icon name="lucide:monitor-play" />
        Open on this screen
      </button>
    </div>
    
    <table class="w-full text-left text-gray-300">
      <thead class="bg-gray-800/50 text-xs uppercase text-gray-500">
        <tr>
          <th class="px-6 py-4">#</th>
          <th class="px-6 py-4">Slide ID</th>
          <th class="px-6 py-4">Title</th>
          <th class="px-6 py-4">Layout</th>
          <th class="px-6 py-4">Route</th>
          <th class="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="slide in slideTree" :key="slide.id">
          <tr class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
            <td class="px-6 py-4 font-mono text-gray-500">{{ slide.pageLabel }}</td>
            <td class="px-6 py-4 font-mono text-xs text-gray-400">{{ slide.id }}</td>
            <td class="px-6 py-4">
              <div class="font-medium text-gray-200">{{ slide.title }}</div>
              <div v-if="slide.subtitle" class="text-xs text-gray-500">{{ slide.subtitle }}</div>
            </td>
            <td class="px-6 py-4">
              <span class="px-2.5 py-1 bg-gray-800 rounded-full text-xs font-mono text-gray-400">{{ slide.layout }}</span>
            </td>
            <td class="px-6 py-4 font-mono text-xs text-blue-400">{{ slide.route }}</td>
            <td class="px-6 py-4 text-right">
              <button 
                @click="openOnThisScreen(slide.route)"
                class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm rounded transition-colors text-gray-300"
              >
                Open
              </button>
            </td>
          </tr>
          <tr 
            v-for="sub in slide.children" :key="sub.id"
            class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors bg-gray-950/40"
          >
            <td class="px-6 py-3 font-mono text-xs text-gray-600 pl-10">{{ sub.pageLabel }}</td>
            <td class="px-6 py-3 font-mono text-xs text-gray-500">{{ sub.id }}</td>
            <td class="px-6 py-3 text-sm text-gray-400 flex items-center gap-2">
              <Icon name="lucide:corner-down-right" class="text-gray-700" />
              {{ sub.title }}
            </td>
            <td class="px-6 py-3">
              <span class="px-2.5 py-1 bg-gray-800/60 rounded-full text-xs font-mono text-gray-500">{{ sub.layout }}</span>
            </td>
            <td class="px-6 py-3 font-mono text-xs text-blue-400/70">{{ sub.route }}</td>
            <td class="px-6 py-3 text-right">
              <button 
                @click="openOnThisScreen(sub.route)"
                class="px-3 py-1 bg-gray-800/60 hover:bg-gray-700 text-xs rounded transition-colors text-gray-400"
              >
                Open
              </button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
