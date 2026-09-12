<script setup lang="ts">
/**
 * Audience landing page.
 *
 * Scanning the audience QR code lands here. It switches this device into
 * interactive mode and sends it to the slide the room is on. The device keeps
 * its own position from then on, and the sync button brings it back.
 */
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePresentation } from '~/composables/usePresentation'
import { useSlideData } from '~/composables/useSlideData'
import { useDeckRole } from '~/composables/useDeckRole'

definePageMeta({ layout: false })

const router = useRouter()
const { store } = usePresentation()
const { getSlideById, firstSlideId } = useSlideData()
const { setViewMode } = useDeckRole()

const joining = ref(false)

const target = computed(() => getSlideById(store.globalSlideId) || getSlideById(firstSlideId.value))

const join = () => {
  joining.value = true
  setViewMode('interactive')
  store.setFollowing(true)
  if (target.value) {
    router.push({ path: target.value.route, query: { mode: 'interactive' } })
  } else {
    joining.value = false
  }
}

// Wait a moment for the socket to report the room's slide, then go.
onMounted(() => {
  setViewMode('interactive')
  setTimeout(() => { if (target.value) join() }, 600)
})
</script>

<template>
  <div class="min-h-dvh bg-black text-white flex flex-col items-center justify-center p-6 font-sans text-center">
    <div class="max-w-sm w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
      <Icon name="lucide:hand" class="text-5xl text-blue-400 mb-6 mx-auto" />
      <h1 class="text-2xl font-bold mb-3">Follow along</h1>
      <p class="text-gray-400 leading-relaxed mb-8">
        This device gets the interactive version of the deck. You can move at your own pace,
        and the sync button in the corner puts you back on the presenter's slide.
      </p>

      <button
        @click="join"
        :disabled="!target || joining"
        class="w-full py-4 bg-blue-600 active:bg-blue-500 disabled:opacity-50 text-white rounded-2xl text-lg font-bold transition-colors"
      >
        {{ target ? 'Join the deck' : 'Waiting for the presenter…' }}
      </button>

      <p v-if="target" class="text-xs text-gray-600 mt-4">
        Starting on {{ target.pageLabel }} · {{ target.title }}
      </p>
    </div>
  </div>
</template>
