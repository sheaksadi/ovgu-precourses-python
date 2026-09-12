import { ref } from 'vue'
import { useDeckRole } from '~/composables/useDeckRole'

/**
 * Fetches the room key for the machine running the deck.
 *
 * The server hands the key to loopback callers only, which is the dashboard and
 * the presenter view on the presenter's own computer. The phone remote receives
 * the key inside the QR code instead, so it never calls this.
 */
export const useRoomKey = () => {
  const { setRoomKey } = useDeckRole()
  const key = ref('')
  const open = ref(false)
  const available = ref<boolean | null>(null)

  const load = async () => {
    try {
      const res = await $fetch<{ key: string, open: boolean }>('/api/room-key')
      key.value = res.key
      open.value = res.open
      available.value = true
      setRoomKey(res.key)
    } catch {
      // Another device on the network asked. It cannot control the room.
      available.value = false
    }
    return key.value
  }

  /** Query string to append to a remote link, empty when control is open. */
  const linkQuery = () => (key.value && !open.value ? `?key=${encodeURIComponent(key.value)}` : '')

  return { key, open, available, load, linkQuery }
}
