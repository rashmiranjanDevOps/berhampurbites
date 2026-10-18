import { createClient } from 'next-sanity';

// SANITY_API_HOST is an optional TESTING hook (e.g. a local stand-in for the
// Sanity API when the real one is unreachable). Leave it unset in real use.
const testHost = process.env.SANITY_API_HOST;

const base = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: !testHost, // fast reads; revalidated via time-based revalidation
  ...(testHost ? { apiHost: testHost, useProjectHostname: false } : {}),
});

/**
 * An image field where the editor typed alt text (or cropped) but never uploaded a picture comes back as
 * { _type: 'image', alt: '...' } with NO asset. Treat that as "no image" everywhere so one half-filled
 * field in Studio can never crash a page.
 */
const isEmptyImage = (v: any) => v && typeof v === 'object' && !Array.isArray(v) && v._type === 'image' && !v.asset;

function clean(value: any): any {
  if (Array.isArray(value)) return value.filter((v) => !isEmptyImage(v)).map(clean);
  if (isEmptyImage(value)) return null;
  if (value && typeof value === 'object') {
    const out: any = {};
    for (const k of Object.keys(value)) out[k] = clean(value[k]);
    return out;
  }
  return value;
}

const originalFetch = base.fetch.bind(base) as (...args: any[]) => Promise<any>;
(base as any).fetch = async (...args: any[]) => clean(await originalFetch(...args));

export const client = base;

/**
 * For the page FRAME (layout, header, footer, mobile bar): if the content service is unreachable this returns null
 * instead of throwing, so visitors still get your branded header and footer around a friendly "try again" message
 * rather than a bare server error. Page CONTENT keeps using client.fetch, so a failure there shows the branded error page.
 */
export async function safeFetch<T = any>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  try {
    return (await (params ? client.fetch(query, params) : client.fetch(query))) as T;
  } catch (error) {
    console.error('[Berhampur Bites] Could not load content from Sanity:', (error as Error)?.message);
    return null;
  }
}
