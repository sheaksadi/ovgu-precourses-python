/**
 * Language from the link, on every navigation.
 *
 *   /pre-0033?lang=en    /pre-0033?en    /join?de
 *
 * Runs on the server too, so the first render is already in that language. The
 * choice goes into the cookie, so the next slide keeps it without the query.
 */
import { defineNuxtPlugin, useRouter } from '#app'
import { localeFromQuery, useI18n } from '~/composables/useI18n'

export default defineNuxtPlugin(() => {
  const router = useRouter()
  const { setLocale } = useI18n()

  const apply = (query: Record<string, unknown>) => {
    const code = localeFromQuery(query)
    if (code) setLocale(code)
  }

  apply(router.currentRoute.value.query)
  router.afterEach(to => apply(to.query))
})
