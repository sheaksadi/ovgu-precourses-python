import { computed, ref, watch } from 'vue'
import { usePresentationStore } from '~/stores/presentationStore'
import { useInteractionStore } from '~/stores/interactionStore'
import { useDeckRole } from '~/composables/useDeckRole'
import { useSlideData } from '~/composables/useSlideData'
import { useAudience } from '~/composables/useAudience'
import { SPIN_MS, useSpins } from '~/composables/useSpins'
import { useProblems } from '~/composables/useProblems'
import { useCats } from '~/composables/useCats'
import { useToasts } from '~/composables/useToasts'
import { useI18n } from '~/composables/useI18n'
import { localizeName } from '~/utils/cuteNames'
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
  const { role, canControlGlobal, isViewer, isProjector, viewMode } = useDeckRole()
  const { getSlideByRoute } = useSlideData()
  const audience = useAudience()
  const spins = useSpins()
  const problems = useProblems()
  const cats = useCats()
  const toasts = useToasts()
  const { t, tm, locale } = useI18n()
  const route = useRoute()
  const onSlideRoute = computed(() => !!getSlideByRoute(route.path))

  const send = (payload: unknown) => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload))
  }

  /** Tell the server which surface this is. It gates writes on this. A follow-along device also says who it is; the projector is nobody. */
  const sendHello = () => {
    send({
      type: 'hello',
      role: role.value,
      mode: viewMode.value,
      ...(isViewer.value && !isProjector.value ? { audienceId: audience.id.value, name: audience.name.value } : {}),
    })
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
            bySlide: data.bySlide || {},
            members: data.members || []
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
        else if (data.type === 'spin') {
          if (spins.apply(data)) {
            window.dispatchEvent(new CustomEvent('deck:spin', { detail: data }))
            const who = data.by ? localizeName(data.by.name, locale.value) : t('intro.presenter')
            const question = tm<string[]>('intro.questions')[data.question] ?? ''
            // The toast carries the answer, so it waits for the reel: announcing
            // the question while it is still rolling gives the spin away.
            const lands = Math.max(0, data.at + SPIN_MS - Date.now())
            setTimeout(() => {
              toasts.push({
                tone: 'lavender',
                name: data.by ? who : undefined,
                icon: data.by ? undefined : 'lucide:refresh-cw',
                title: t('intro.toast', { name: who }),
                body: question,
              })
            }, lands)
          }
        }
        else if (data.type === 'spin_state') {
          spins.applyState(data)
        }
        else if (data.type === 'problem_state') {
          problems.applyState(data)
        }
        else if (data.type === 'solve') {
          problems.applySolve(data)
          const name = localizeName(data.name, locale.value)
          const body = t('problems.toast.body', { title: t(`problems.${data.problemId}.title`), part: data.part, rank: data.rank })
          toasts.push(data.first
            ? { tone: 'sun', name, title: t('problems.toast.first', { name }), body }
            : { tone: 'mint', name, title: t('problems.toast.solved', { name, part: data.part }), body })
        }
        else if (data.type === 'cat') {
          cats.apply(data)
        }
        else if (data.type === 'cat_state') {
          cats.applyState(data)
        }
        else if (data.type === 'cat_busy') {
          cats.clearWaiting()
        }
        else if (data.type === 'spin_busy') {
          window.dispatchEvent(new CustomEvent('deck:spin-busy'))
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

  /** A follow-along device asks the room for the icebreaker spin. */
  const sendSpin = () => {
    if (isViewer.value) send({ type: 'spin' })
  }

  /** A follow-along device asks the room for a new cat. */
  const sendCat = () => {
    if (!isViewer.value || isProjector.value) return
    cats.markWaiting()
    send({ type: 'cat' })
  }

  const sendPointer = (clientId: string, active: boolean, x: number, y: number, color: string) => {
    send({ type: 'pointer', clientId, active, x, y, color })
  }

  if (import.meta.client && !watchersStarted) {
    watchersStarted = true

    // A new name reaches the room without reconnecting.
    watch(() => [audience.name.value, isProjector.value], () => sendHello())

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
    sendPresence,
    sendSpin,
    sendCat
  }
}
