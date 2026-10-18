// Builds the CSS custom-property declarations for :root from Brand Settings.
// Any color left empty in Sanity is simply omitted, so the Tailwind fallback (the Berhampur Bites palette)
// applies automatically — an admin can configure zero, some, or all colors without ever breaking the site.
//
// The Primary Color is nudged darker ONLY if it is too light for readable text/buttons (WCAG AA 4.5:1 against
// white and the cream backgrounds). The hover shade is derived from it automatically.

type RGB = [number, number, number];
const hexToRgb = (hex: string): RGB | null => {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex || '').trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbToHex = ([r, g, b]: RGB) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const lum = ([r, g, b]: RGB) => {
  const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (a: RGB, b: RGB) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const scale = (c: RGB, k: number): RGB => [c[0] * k, c[1] * k, c[2] * k];

export function accessiblePrimary(hex: string, backgroundHex?: string): { primary: string; dark: string } | null {
  const base = hexToRgb(hex);
  if (!base) return null;
  const white: RGB = [255, 255, 255];
  const bg = hexToRgb(backgroundHex || '#F7ECDA') || ([247, 236, 218] as RGB);
  let c = base, guard = 0;
  while ((contrast(c, white) < 4.6 || contrast(c, bg) < 4.6) && guard++ < 60) c = scale(c, 0.97);
  return { primary: rgbToHex(c), dark: rgbToHex(scale(c, 0.82)) };
}

export function buildThemeCss(brand: any): string {
  if (!brand) return '';
  const primary = brand.primaryColor?.hex ? accessiblePrimary(brand.primaryColor.hex, brand.backgroundColor?.hex) : null;
  const map: Record<string, string | undefined> = {
    '--brand-primary': primary?.primary,
    '--brand-primary-dark': primary?.dark,
    '--brand-secondary': brand.secondaryColor?.hex,
    '--brand-background': brand.backgroundColor?.hex,
    '--brand-surface': brand.surfaceColor?.hex,
    '--brand-text': brand.textColor?.hex,
    '--brand-muted': brand.mutedTextColor?.hex,
    '--brand-button': brand.buttonColor?.hex,
    '--brand-button-text': brand.buttonTextColor?.hex,
  };
  const declarations = Object.entries(map)
    .filter(([, value]) => Boolean(value) && /^#[0-9a-f]{3,8}$/i.test(value as string)) // hex only — nothing else can reach the <style> tag
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
  return declarations ? `:root { ${declarations} }` : '';
}
