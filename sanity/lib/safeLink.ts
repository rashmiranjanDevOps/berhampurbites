/**
 * Links typed in Studio are shown only if they are safe: a page on this site ("/menu"), http(s), tel: or mailto:.
 * Anything else (for example "javascript:…") is ignored and the caller's fallback is used.
 */
export function safeHref(value?: string | null): string | null {
  const t = (value || '').trim();
  if (!t) return null;
  if (/^\/(?!\/)/.test(t)) return t;
  if (/^https?:\/\//i.test(t)) return t;
  if (/^(tel|mailto):/i.test(t)) return t;
  return null;
}
