/** Copy text to the clipboard, falling back to a temporary textarea. */
export async function copyText(text) {
  const value = String(text);
  try {
    await navigator.clipboard.writeText(value);
    return;
  } catch {
    /* fall through to the legacy path */
  }
  const ta = document.createElement('textarea');
  ta.value = value;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
  } catch {
    /* ignore */
  }
  document.body.removeChild(ta);
}
