/**
 * Copy text to the clipboard, and say whether it worked.
 *
 * `navigator.clipboard` only exists on https and localhost, but phones reach the
 * deck over plain http on the local network, so this falls back to selecting a
 * hidden textarea and the old copy command.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch { /* fall back below */ }

  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.top = '0'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  area.setSelectionRange(0, text.length)
  let copied = false
  try { copied = document.execCommand('copy') } catch { copied = false }
  area.remove()
  return copied
}
