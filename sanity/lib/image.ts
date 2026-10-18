import createImageUrlBuilder from '@sanity/image-url';
// Built from just the project id + dataset (public values) — NOT from the Sanity client — so the browser bundle
// (client components such as the hero and gallery import this file) does not drag the whole client library along.
const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
});

export function urlFor(source: any) {
  return builder.image(source);
}

/**
 * Image URL that keeps whatever crop the editor chose in Studio (the free crop
 * tool) and only limits the pixel WIDTH. The height is never forced, so the
 * website itself never crops a photo into a shape the editor didn't choose.
 */
export function imgSrc(source: any, width: number) {
  return builder.image(source).width(width).auto('format').url();
}

/** CSS object-position from the Studio hotspot, so if a box has to trim a photo it trims around the focus point. */
export function imgPos(source: any): string | undefined {
  const h = source?.hotspot;
  if (!h || typeof h.x !== 'number' || typeof h.y !== 'number') return undefined;
  return `${Math.round(h.x * 100)}% ${Math.round(h.y * 100)}%`;
}

/** Width/height of the photo AFTER the editor's Studio crop (parsed from the asset id), so a box can match it exactly. Falls back to 4:3. */
export function imgRatio(source: any): number {
  const m = /-(\d+)x(\d+)-/.exec(source?.asset?._ref || '');
  if (!m) return 4 / 3;
  const c = source?.crop || {};
  const w = parseInt(m[1], 10) * (1 - (c.left || 0) - (c.right || 0));
  const h = parseInt(m[2], 10) * (1 - (c.top || 0) - (c.bottom || 0));
  return w > 0 && h > 0 ? w / h : 4 / 3;
}
