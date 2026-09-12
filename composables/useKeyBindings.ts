export interface KeyBinding {
  key: string
  action: string
}

export const defaultKeyBindings: KeyBinding[] = [
  { key: ' ', action: 'nextSlide' },
  { key: 'ArrowRight', action: 'nextSlide' },
  { key: 'ArrowDown', action: 'nextSlide' },
  { key: 'Backspace', action: 'prevSlide' },
  { key: 'ArrowLeft', action: 'prevSlide' },
  { key: 'ArrowUp', action: 'prevSlide' },
  { key: 'Escape', action: 'exitPresentation' },
  { key: 't', action: 'toggleTeleprompter' },
  { key: 'f', action: 'toggleFullscreen' },
  { key: 'F', action: 'toggleFullscreen' },
  { key: 's', action: 'syncToGlobal' },
  { key: 'S', action: 'syncToGlobal' },
]

export interface CustomKeyBindings {
  [action: string]: string | string[]
}

export const useKeyBindings = (customBindings?: CustomKeyBindings) => {
  // Every key bound to an action counts, not just the last one declared.
  const bindings: CustomKeyBindings = customBindings || defaultKeyBindings.reduce(
    (acc, binding) => {
      const keys = acc[binding.action]
      acc[binding.action] = Array.isArray(keys) ? [...keys, binding.key] : [binding.key]
      return acc
    },
    {} as CustomKeyBindings
  )
  
  const resolveKeys = (action: string): string[] => {
    const keys = bindings[action]
    if (!keys) return []
    return Array.isArray(keys) ? keys : [keys]
  }
  
  return { resolveKeys }
}
