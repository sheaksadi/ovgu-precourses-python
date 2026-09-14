import { computed, ref, watch } from 'vue'
import { usePresentationStore } from '~/stores/presentationStore'
import { useInteractionStore } from '~/stores/interactionStore'
import { useDeckRole } from '~/composables/useDeckRole'
import { useSlideData } from '~/composables/useSlideData'
import { useRoute } from 'vue-router'

let ws: WebSocket | null = null
let reconnectTimer: any = null
let pingTimer: any = null
const isConnected = ref(false)
let watchersStarted = false
let controllerId = ''

const controllerHeaders = () => {
  if (!controllerId) {
    try {
      controllerId = localStorage.getItem('deck-controller-id') || ''
      if (!controllerId) {
        controllerId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        localStorage.setItem('deck-controller-id', controllerId)
      }
    } catch {
      controllerId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    }
  }
  return { 'x-deck-controller': controllerId }
}

export const useWebSocket = () => {
  const store = usePresentationStore()
  const interactions = useInteractionStore()
  const { role, canControlGlobal, isViewer, viewMode } = useDeckRole()
  const { getSlideByRoute } = useSlideData()
  const route = useRoute()
  const onSlideRoute = computed(() => !!getSlideByRoute(route.path))

  const send = (payload: unknown) => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload))
  }

  /** Tell the server which surface this is. It gates writes on this. */
  const sendHello = () => {
    send({ type: 'hello', role: role.value, mode: viewMode.value })
  }

  /** Controllers publish intent; only a server state event mutates global state. */
  const navigate = (slideId: string, isPresenting?: boolean) => {
    if (!canControlGlobal.value || !slideId) return false
    $fetch('/api/navigate', {
      method: 'POST',
      headers: controllerHeaders(),
      body: { slideId, isPresenting }
    })
    return true
  }

  const requestState = () => {
    if (!ws || ws.readyState === WebSocket.CLOSED) connect()
    else if (ws.readyState === WebSocket.OPEN) send({ type: 'sync_request' })
  }

  /** Report where this viewer is, so the presenter view can see the room. */
  const sendPresence = () => {
    if (!isViewer.value) return
    send({
      type: 'presence',
      // Empty while this client is not showing a slide, which keeps the landing
      // page, the join page and the handout out of the audience numbers.
      slideId: onSlideRoute.value ? store.localSlideId : '',
      detached: store.detached,
      interacting: !!store.localSlideId && interactions.pendingOn(store.localSlideId)
    })
  }

  const connect = () => {
    if (import.meta.server) return

    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/_ws`

    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      isConnected.value = true
      sendHello()
      sendPresence()
      // Always request current state on connect/reconnect so the device is
      // never stuck on a stale slide after a WiFi hiccup.
      send({ type: 'sync_request' })
      // A fast navigation can replace `ws` with a newer socket that is still
      // connecting before this handler runs, so check before pinging.
      if (ws?.readyState === WebSocket.OPEN) ws.send('ping')
      clearInterval(pingTimer)
      pingTimer = setInterval(() => {
        if (ws?.readyState === WebSocket.OPEN) {
          ws!.send('ping')
        }
      }, 5000)
    }

    ws.onmessage = (event) => {
      if (event.data === 'pong') return

      try {
        const data = JSON.parse(event.data)

        if (data.type === 'clients_count') {
          store.setConnectedClients(data.count)
        }
        else if (data.type === 'role') {
          // Role acknowledgement; room position still changes only through HTTP endpoints.
        }
        else if (data.type === 'presence_summary') {
          store.setPresence({
            viewers: data.viewers,
            detached: data.detached,
            interacting: data.interacting,
            bySlide: data.bySlide || {}
          })
        }
        else if (data.type === 'state') {
          const wasPresenting = store.isPresenting
          if (data.isPresenting !== undefined) {
            store.isPresenting = data.isPresenting
          }

          if (data.slideId) store.setGlobal(data.slideId)

          if (wasPresenting && !data.isPresenting) store.setSessionEnded(true)
          if (data.isPresenting) store.setSessionEnded(false)

        }
        else if (data.type === 'command') {
          if (data.name === 'goto_dashboard' && window.location.pathname !== '/control') {
            window.location.href = '/dashboard'
          }
          else if (data.name === 'slide_action') {
            window.dispatchEvent(new CustomEvent('deck:slide-action', { detail: data }))
          }
        }
        else if (data.type === 'pointer') {
          store.setPointer(data.clientId, data.active, data.x, data.y, data.color)
        }
      } catch (e) {
        console.error('Failed to parse WS msg', e)
      }
    }

    ws.onclose = () => {
      isConnected.value = false
      clearInterval(pingTimer)
      clearTimeout(reconnectTimer)
      reconnectTimer = setTimeout(() => {
        connect()
      }, 2000)
    }
  }

  const sendCommand = (name: string, payload: Record<string, unknown> = {}) => {
    if (!canControlGlobal.value) return
    $fetch('/api/command', {
      method: 'POST',
      headers: controllerHeaders(),
      body: { name, ...payload }
    })
  }

  const sendPointer = (clientId: string, active: boolean, x: number, y: number, color: string) => {
    send({ type: 'pointer', clientId, active, x, y, color })
  }

  if (import.meta.client && !watchersStarted) {
    watchersStarted = true

    // A viewer reports local position and explicit follow mode.
    watch(
      () => [store.localSlideId, store.detached, onSlideRoute.value, interactions.pendingCount] as [string, boolean, boolean, number],
      () => sendPresence()
    )

    // Auto-follow reattaches once this device is no longer busy.
    watch(
      () => [store.autoFollow, store.globalSlideId, store.localSlideId] as [boolean, string, string],
      ([autoFollow, globalSlideId, localSlideId]) => {
        if (!isViewer.value || !onSlideRoute.value || !autoFollow || store.following) return
        if (!globalSlideId || globalSlideId === localSlideId) return
        if (localSlideId && interactions.pendingOn(localSlideId)) return
        store.setFollowing(true)
        requestState()
      }
    )
  }

  return {
    connect,
    isConnected,
    sendHello,
    navigate,
    requestState,
    sendCommand,
    sendPointer,
    sendPresence
  }
}
