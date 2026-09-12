/**
 * Shared "same idea" highlight for code panels.
 *
 * Hovering a token publishes its concept link; every panel on the slide lights
 * up the tokens that share it. Clicking pins the link, so the presenter can
 * talk through the pair without holding the pointer still.
 */
import { computed } from 'vue'

export function useCodeLink() {
  // `useState` keeps the highlight per request, so SSR never leaks one
  // viewer's hover into another's page.
  const hovered = useState<string | null>('code-link-hovered', () => null)
  const pinned = useState<string | null>('code-link-pinned', () => null)

  const activeLink = computed(() => pinned.value ?? hovered.value)

  return {
    activeLink,
    pinned: computed(() => pinned.value),
    isActive: (link?: string) => Boolean(link && link === activeLink.value),
    hover: (link?: string) => { hovered.value = link ?? null },
    unhover: () => { hovered.value = null },
    toggle: (link?: string) => { pinned.value = pinned.value === link ? null : (link ?? null) },
    clear: () => { hovered.value = null; pinned.value = null },
  }
}
