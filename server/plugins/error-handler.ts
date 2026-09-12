export default defineNitroPlugin((nitroApp) => {
  process.on('unhandledRejection', (reason: any) => {
    if (reason?.code === 'ECONNRESET' || reason?.message?.includes('socket hang up') || reason?.message?.includes('stream.push() after EOF')) {
      return // Ignore common network errors from Nitro WebSockets
    }
    console.error('[unhandledRejection]', reason)
  })
})
