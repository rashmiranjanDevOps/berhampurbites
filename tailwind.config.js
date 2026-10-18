/** @type {import('tailwindcss').Config} */
module.exports = {
  // Wraps every `hover:` variant in @media (hover: hover), so touch devices never get "sticky" hover states.
  future: { hoverOnlyWhenSupported: true },
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Every one of these reads a CMS-controlled CSS variable first (set in
        // app/layout.tsx from Brand Settings) and falls back to the approved
        // Berhampur Bites palette if the admin hasn't configured a color yet.
        // This means every existing `bg-red`, `text-yellow`, etc. class in the
        // app automatically follows Brand Settings — no component changes needed.
        cream: 'var(--brand-background, #FCF3E4)',
        surface: 'var(--brand-surface, #FFFFFF)',
        // Default red is the brand red nudged slightly deeper so text and white-on-red buttons pass WCAG AA (4.5:1).
        red: { DEFAULT: 'var(--brand-primary, #CC281C)', dark: 'var(--brand-primary-dark, #A82117)' },
        yellow: 'var(--brand-secondary, #FFC72C)',
        ink: 'var(--brand-text, #2B1B12)',
        muted: 'var(--brand-muted, #7A6455)',
        btn: { DEFAULT: 'var(--brand-button, var(--brand-primary, #CC281C))', text: 'var(--brand-button-text, #FFFFFF)' },

        // Non-CMS support tones — part of the approved static palette (warm
        // brown, hairline borders) but not exposed as Brand Settings fields,
        // so these are plain constants rather than CSS-variable-backed like
        // the tokens above. Used for photography backdrops/gradients and
        // subtle dividers, not by content editors.
        brown: { DEFAULT: '#6B4028', dark: '#3C2010', darker: '#2B1B12' },
        line: '#EEE0CF',
      },
      fontFamily: {
        // Self-hosted via @fontsource packages (imported in app/layout.tsx) — they load on every phone.
        display: ['"Playfair Display Variable"', 'Georgia', 'serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
        script: ['"Caveat Variable"', 'cursive'],
      },
      // Typographic scale: semantic names (display-*, body-*) so a role is chosen, not a raw px value.
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1.02', letterSpacing: '-0.02em' }],      // ~64px hero headline
        'display-lg': ['3rem', { lineHeight: '1.05', letterSpacing: '-0.015em' }],     // ~48px section headline
        'display-md': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],    // ~36px sub-section headline
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],   // ~18px lead paragraph
        body: ['1rem', { lineHeight: '1.65' }],           // ~16px default copy
        'body-sm': ['0.875rem', { lineHeight: '1.55' }],  // ~14px secondary/meta text
        caption: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em' }], // ~12px badges/labels
        button: ['0.875rem', { lineHeight: '1', letterSpacing: '0.01em' }],  // consistent CTA label size
      },
      // Section rhythm: consistent vertical spacing.
      spacing: {
        'section-sm': '3.5rem',  // 56px — tight sections (promo bars, feature rows)
        section: '5rem',         // 80px — standard section padding
        'section-lg': '6.5rem',  // 104px — hero/cinematic scenes
      },
      // Semantic radius names layered on top of Tailwind's default scale.
      borderRadius: {
        card: '20px',
        panel: '28px',
        chip: '999px',
      },
      // Elevation system: three levels.
      boxShadow: {
        header: '0 2px 10px rgba(43,27,18,0.06)',
        card: '0 12px 28px rgba(43,27,18,0.09)',
        floating: '0 20px 44px rgba(43,27,18,0.16)',
      },
      maxWidth: { site: '1320px' },
    },
  },
  plugins: [],
};
