import { getCookie, getQuery, type H3Event } from 'h3'

/**
 * Who is asking, for the problem endpoints.
 *
 * The device id and name are the cookies `useAudience` sets. They identify a
 * phone in the room; they are not a login.
 */
const ID_PATTERN = /^[\w-]{6,40}$/

export const audienceIdOf = (event: H3Event): string | null => {
  const id = getCookie(event, 'deck-audience')
  return id && ID_PATTERN.test(id) ? id : null
}

export const cleanName = (value: unknown) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, 24) : ''

/** The name the device sends, else its cookie. */
export const audienceNameOf = (event: H3Event, sent?: unknown) =>
  cleanName(sent) || cleanName(getCookie(event, 'deck-name')) || 'Anonym'

export const localeOf = (event: H3Event): 'de' | 'en' => {
  const lang = getQuery(event).lang ?? getCookie(event, 'deck-lang')
  return lang === 'en' ? 'en' : 'de'
}
