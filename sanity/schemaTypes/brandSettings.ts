import { defineField, defineType } from 'sanity';

const colorField = (name: string, title: string, description?: string) =>
  defineField({ group: 'theme', name, title, type: 'color', description, options: { disableAlpha: true } });

export default defineType({
  name: 'brandSettings',
  title: 'Brand Settings',
  type: 'document',
  groups: [
    { name: 'logo', title: 'Logo & Favicon', default: true },
    { name: 'theme', title: 'Theme Colors' },
  ],
  fields: [
    defineField({ group: 'logo', name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true }, description: 'Used in the header and footer. Any shape works (round badge, wide logo…) — it is never cropped. Use a TRANSPARENT PNG so no white box shows behind it, at least 600 px wide.', fields: [{ name: 'alt', title: 'Alt text', type: 'string' }] }),
    defineField({ group: 'logo', name: 'logoAlt', title: 'Alternate / Mobile Logo', type: 'image', description: 'Optional — used in tight mobile header space if provided.', fields: [{ name: 'alt', title: 'Alt text', type: 'string' }] }),
    defineField({ group: 'logo', name: 'favicon', title: 'Favicon', type: 'image', description: 'Square image, at least 512x512px.' }),

    colorField('primaryColor', 'Primary Color', 'Main brand color — buttons, links, badges. Default: Berhampur Bites red.'),
    colorField('secondaryColor', 'Secondary / Accent Color', 'Highlights and secondary CTAs. Default: yellow.'),
    colorField('backgroundColor', 'Page Background Color', 'Default: warm cream.'),
    colorField('surfaceColor', 'Card / Surface Color', 'Background for cards and panels. Default: white.'),
    colorField('textColor', 'Main Text Color', 'Default: dark brown-black.'),
    colorField('mutedTextColor', 'Muted Text Color', 'Used for descriptions and secondary text.'),
    colorField('buttonColor', 'Primary Button Background', 'Defaults to Primary Color if left empty.'),
    colorField('buttonTextColor', 'Primary Button Text Color'),
  ],
  preview: { prepare: () => ({ title: 'Brand Settings' }) },
});
