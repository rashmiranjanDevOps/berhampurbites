/**
 * Recommended sizes (one place, so Studio and the website agree).
 * Upload at these sizes and nothing is cropped on the website. The free crop/hotspot tool in the
 * image editor is always available — the website follows whatever crop you set there.
 */
export const IMAGE_SPECS = {
  hero:      { w: 1920, h: 1080 },
  standard:  { w: 1200, h: 900 },
  interior:  { w: 800,  h: 600 },
  logo:      { w: 600,  h: 200 },
  circle:    { w: 600,  h: 600 },
} as const;

export const specText = (s: { w: number; h: number }) => {
  const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
  const d = g(s.w, s.h);
  return `Best size: ${s.w} × ${s.h} px (${s.w / d}:${s.h / d}). Upload at this size so nothing gets cropped on the website. You can still use the crop tool (click the image → crop) to set your own crop.`;
};

/** Warning (never a block) when the photo — after any Studio crop — is not the recommended shape. */
export const ratioWarning = (spec: { w: number; h: number }) => (Rule: any) =>
  Rule.custom((value: any) => {
    const m = /-(\d+)x(\d+)-/.exec(value?.asset?._ref || '');
    if (!m) return true;
    const c = value.crop || {};
    const w = parseInt(m[1], 10) * (1 - (c.left || 0) - (c.right || 0));
    const h = parseInt(m[2], 10) * (1 - (c.top || 0) - (c.bottom || 0));
    const target = spec.w / spec.h;
    if (Math.abs(w / h - target) / target <= 0.06) return true;
    return `This photo is ${Math.round(w)} × ${Math.round(h)} px. The best size is ${spec.w} × ${spec.h} px (${(target).toFixed(2)}:1) — on the website it may be trimmed at the edges. You can ignore this warning or use the crop tool.`;
  }).warning();
