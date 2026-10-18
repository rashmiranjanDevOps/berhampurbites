/**
 * The website's public address, used for canonical links, sitemap, share previews and the Share button.
 * Order: NEXT_PUBLIC_SITE_URL → Netlify's own URL variable → Netlify deploy URL → Vercel's → localhost (development only).
 *
 * In PRODUCTION any address that points at this computer (localhost / 127.0.0.1) is ignored — otherwise a copied
 * ".env.example" value would beat the real address and the live site would announce "localhost" to Google and WhatsApp.
 */
const isLocal = (u: string) => /^(https?:\/\/)?(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|\/|$)/i.test(u.trim());

export function getSiteUrl(): string {
  const production = process.env.NODE_ENV === 'production';
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '',
  ].filter((c): c is string => !!c && c.trim() !== '');
  const usable = candidates.find((c) => !(production && isLocal(c)));
  if (usable) return usable.trim().replace(/\/+$/, '');
  if (production && process.env.NEXT_PHASE !== 'phase-production-build') {
    console.warn('[Berhampur Bites] No real site address found — set NEXT_PUBLIC_SITE_URL in your hosting environment variables. Share links and SEO will be wrong until you do.');
  }
  return 'http://localhost:3000';
}
