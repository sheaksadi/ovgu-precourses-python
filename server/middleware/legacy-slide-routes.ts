/**
 * Old slide addresses keep working.
 *
 * Slides used to live at the root (`/pre-0033`) and the style guide at
 * `/design`. Every slide page now lives in `pages/slides/` and is served at
 * `/slides/<id>`, so links, bookmarks and printed QR codes from before still
 * land on the right slide, with their query (`?mode=`, `?lang=`) intact.
 */
import { defineEventHandler, getRequestURL, sendRedirect } from 'h3'

const LEGACY_SLIDE = /^\/([a-z]{3}-\d{4,})\/?$/i

export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  const legacy = LEGACY_SLIDE.exec(url.pathname)
  if (legacy) return sendRedirect(event, `/slides/${legacy[1]!.toLowerCase()}${url.search}`, 302)

  if (url.pathname === '/design' || url.pathname === '/design/') {
    return sendRedirect(event, '/slides/pre-0010', 302)
  }
})
