/**
 * Keeps the screen awake on every page.
 *
 * Uses the Screen Wake Lock API. The browser drops the lock whenever the tab is
 * hidden, so it is asked for again each time the page becomes visible. Some
 * browsers refuse the lock until the user has touched the page, so the first
 * tap, click or key press asks once more. Browsers without the API, or pages
 * served over plain http from another machine, simply keep their normal sleep.
 */
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (!('wakeLock' in navigator)) return

  let lock: WakeLockSentinel | null = null
  let pending = false

  const acquire = async () => {
    if (lock || pending || document.visibilityState !== 'visible') return
    pending = true
    try {
      lock = await navigator.wakeLock.request('screen')
      lock.addEventListener('release', () => { lock = null })
    }
    catch {
      // Refused (no user activation yet, battery saver, policy): try again later.
    }
    finally {
      pending = false
    }
  }

  document.addEventListener('visibilitychange', acquire)
  for (const type of ['pointerdown', 'keydown'] as const)
    window.addEventListener(type, acquire, { passive: true })

  acquire()
})
