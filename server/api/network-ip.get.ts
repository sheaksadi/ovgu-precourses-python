import { defineEventHandler } from 'h3'
import { networkInterfaces } from 'os'

export default defineEventHandler(() => {
  const nets = networkInterfaces()
  let ip = ''

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
      if (net.family === familyV4Value && !net.internal) {
        ip = net.address
        break
      }
    }
    if (ip) break
  }

  return { ip: ip || 'localhost' }
})
