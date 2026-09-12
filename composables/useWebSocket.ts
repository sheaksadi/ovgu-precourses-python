import { ref, watch } from 'vue'
import { usePresentationStore } from '~/stores/presentationStore'
import { useInteractionStore } from '~/stores/interactionStore'
import { usePresentation } from '~/composables/usePresentation'
import { useDeckRole } from '~/composables/useDeckRole'

let ws: WebSocket | null = null
let reconnectTimer: any = null
let pingTimer: any = null

export const useWebSocket = () => {
  const store = usePresentationStore()
  const interactions = useInteractionStore()
  const { requestSlide, onSlideRoute } = usePresentation()
  const { role, canControlGlobal, isViewer, isPeek, viewMode, roomKey } = useDeckRole()
  const isConnected = ref(false)
  const wasDisconnected = ref(false)

  let isRemoteUpdate = false
  let remoteUpdateTimer: any = null

  const send = (payload: unknown) => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload))
  }

  /** Tell the server which surface this is. It gates writes on this. */
  const sendHello = () => {
    send({ type: 'hello', role: role.value, mode: viewMode.value, key: roomKey.value })
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

    if (ws && ws.readyState === WebSocket.OPEN) return

    wasDisconnected.value = false
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/_ws`

    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      isConnected.value = true
      sendHello()
      sendPresence()
      if (wasDisconnected.value) {
        wasDisconnected.value = false
        send({ type: 'sync_request' })
      }
      ws!.send('ping')
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
          // The server downgrades a controller that cannot show the room key.
          store.setControlRejected(!data.authorised)
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
          isRemoteUpdate = true
          clearTimeout(remoteUpdateTimer)
          remoteUpdateTimer = setTimeout(() => { isRemoteUpdate = false }, 100)

          const wasPresenting = store.isPresenting
          if (data.isPresenting !== undefined) {
            store.isPresenting = data.isPresenting
          }

          if (data.slideId) store.setGlobal(data.slideId)

          // The presenter ended the session: say so on the slide instead of
          // yanking the device away, which used to interrupt anyone working.
          if (wasPresenting && !data.isPresenting) store.setSessionEnded(true)
          if (data.isPresenting) store.setSessionEnded(false)

          // A controller always adopts the room. A peek frame never does, since
          // the presenter view drives it. A slide screen follows until it drifts,
          // and a page that is not a slide is never dragged into one.
          const mayFollow = canControlGlobal.value
            ? true
            : (isPeek.value || !onSlideRoute.value ? false : store.following)
          if (data.slideId && mayFollow && store.localSlideId !== data.slideId) {
            requestSlide(data.slideId, { fromFollow: true })
          }
        }
        else if (data.type === 'command') {
          if (data.name === 'goto_dashboard' && window.location.pathname !== '/control') {
            window.location.href = '/dashboard'
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
      const wasConnected = isConnected.value
      isConnected.value = false
      if (wasConnected) wasDisconnected.value = true
      clearInterval(pingTimer)
      clearTimeout(reconnectTimer)
      reconnectTimer = setTimeout(() => {
        connect()
      }, 2000)
    }
  }

  const sendCommand = (name: string) => {
    send({ type: 'command', name })
  }

  const sendPointer = (clientId: string, active: boolean, x: number, y: number, color: string) => {
    send({ type: 'pointer', clientId, active, x, y, color })
  }

  // Only the remote and the presenter view publish the room's position.
  watch(
    () => [store.globalSlideId, store.isPresenting] as [string, boolean],
    ([slideId, isPresenting], [oldSlideId, oldPresenting]) => {
      if (isRemoteUpdate || !canControlGlobal.value) return
      if (slideId === oldSlideId && isPresenting === oldPresenting) return
      send({ type: 'navigate', slideId, isPresenting })
    }
  )

  // A viewer reports drift and interaction state instead of driving the room.
  watch(
    () => [store.localSlideId, store.detached, onSlideRoute.value, interactions.pendingCount] as [string, boolean, boolean, number],
    () => { sendPresence() }
  )

  // Auto-follow: a viewer that asked to stay in step catches up by itself once
  // it is no longer busy with an interaction.
  watch(
    () => [store.autoFollow, store.globalSlideId, store.localSlideId] as [boolean, string, string],
    ([autoFollow, globalSlideId, localSlideId]) => {
      if (!isViewer.value || !onSlideRoute.value || !autoFollow || store.following) return
      if (!globalSlideId || globalSlideId === localSlideId) return
      if (localSlideId && interactions.pendingOn(localSlideId)) return
      store.setFollowing(true)
      requestSlide(globalSlideId, { fromFollow: true })
    }
  )

  return {
    connect,
    isConnected,
    sendHello,
    sendCommand,
    sendPointer,
    sendPresence
  }
}
