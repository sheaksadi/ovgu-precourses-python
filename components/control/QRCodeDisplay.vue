<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

/** Which surface the code opens. `/control` is the phone remote, `/join` the audience. */
const props = withDefaults(defineProps<{ path?: string, query?: string }>(), {
  path: '/control',
  query: ''
})

const qrCodeDataUrl = ref('')
const controlUrl = ref('')

const render = async () => {
  // Get current hostname (IP address) and port to build the remote control URL
  const { protocol, host } = window.location
  
  let targetHost = host
  // Fetch from API to get LAN IP
  try {
    const res = await $fetch<{ ip: string }>('/api/network-ip')
    if (res && res.ip) {
      targetHost = `${res.ip}:${window.location.port}`
    }
  } catch (e) {
    console.log('Could not get network IP, falling back to window.location.host')
  }

  controlUrl.value = `${protocol}//${targetHost}${props.path}${props.query}`
  
  try {
    const QRCode = (await import('qrcode')).default || await import('qrcode')
    qrCodeDataUrl.value = await QRCode.toDataURL(controlUrl.value, {
      width: 256,
      margin: 2,
      color: {
        dark: '#ffffff',
        light: '#00000000' // transparent
      }
    })
  } catch (err) {
    console.error('Error generating QR code', err)
  }
}

onMounted(render)
// Redraw when caller changes target query.
watch(() => props.query, () => { if (controlUrl.value) render() })
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="bg-gray-800 p-4 rounded-xl border border-gray-700 w-full aspect-square flex items-center justify-center overflow-hidden mb-4 relative">
      <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="QR Code" class="w-full h-full object-contain mix-blend-screen" />
      <div v-else class="text-gray-500 animate-pulse">Generating...</div>
    </div>
    <div class="w-full">
      <div class="text-xs text-gray-500 mb-1">Direct link:</div>
      <div class="bg-black/50 p-2 text-xs font-mono text-gray-300 rounded overflow-hidden text-ellipsis whitespace-nowrap">
        {{ controlUrl || 'Loading...' }}
      </div>
    </div>
  </div>
</template>
