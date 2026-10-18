/**
 * Resolves the address of the map shown in the "Find Us / View Map" popup.
 * 1) Google's official embed link typed in Studio (outlet first, then Business Settings). A pasted whole
 *    <iframe …> code is accepted too — the src is extracted.
 * 2) Fallback: Google's address-search embed built from the typed address (less precise).
 * Returns null when there is nothing to show.
 */
function extractEmbedSrc(raw?: string | null): string | null {
  const t = (raw || '').trim();
  if (!t) return null;
  const m = t.match(/src\s*=\s*["']([^"']+)["']/i);
  const url = (m ? m[1] : t).replace(/&amp;/g, '&');
  return /^https:\/\/www\.google\.com\/maps\/embed/i.test(url) ? url : null;
}

export function resolveMapSrc(business: any, outlet?: any): string | null {
  const official = extractEmbedSrc(outlet?.mapEmbedUrl) || extractEmbedSrc(business?.mapEmbedUrl);
  if (official) return official;
  const address = (outlet?.address || business?.address || '').replace(/\s+/g, ' ').trim();
  return address ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed` : null;
}
