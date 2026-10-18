import { defineField, defineType } from 'sanity';
import { IMAGE_SPECS, specText, ratioWarning } from '../lib/imageRules';

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'signature', title: 'Signature Bite' },
    { name: 'highlights', title: 'Highlights' },
    { name: 'promo', title: 'Promo banner' },
  ],
  fields: [
    defineField({ group: 'hero', name: 'heroBadge', title: 'Hero Badge Text', type: 'string', description: 'Small label above the headline, e.g. "Berhampur\'s Own QSR". Leave empty to hide it.' }),
    defineField({ group: 'hero', name: 'heroHeadingLine1', title: 'Hero Heading — Line 1', type: 'string', initialValue: 'Good Food' }),
    defineField({ group: 'hero', name: 'heroHeadingLine2', title: 'Hero Heading — Line 2 (accent color)', type: 'string', initialValue: 'Good Mood' }),
    defineField({ group: 'hero', name: 'heroSubheading', title: 'Hero Subheading', type: 'string', initialValue: 'Burgers • Chicken • Fries • Beverages' }),
    defineField({ group: 'hero', name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }], description: specText(IMAGE_SPECS.hero) + ' Wide photo of your food; keep the left side quieter — the headline sits there.', validation: ratioWarning(IMAGE_SPECS.hero) }),
    defineField({
      group: 'hero', name: 'heroTextPosition', title: 'Hero — Where the headline sits (desktop)', type: 'string', initialValue: 'left',
      options: { layout: 'radio', list: [
        { title: 'On the photo — left side', value: 'left' },
        { title: 'On the photo — right side (use this if your dish is on the left)', value: 'right' },
        { title: 'Above the photo (the whole photo stays visible, nothing covered)', value: 'above' },
      ] },
      description: 'Phones always show the headline above the whole photo.',
    }),
    defineField({
      group: 'hero', name: 'heroOverlay', title: 'Hero — Photo darkening behind the headline', type: 'string', initialValue: 'light',
      options: { layout: 'radio', list: [{ title: 'None', value: 'none' }, { title: 'Light', value: 'light' }, { title: 'Medium', value: 'medium' }, { title: 'Strong', value: 'strong' }] },
      description: 'Only used when the headline sits ON the photo. Lower it to show more of the photo; raise it if the text is hard to read.',
    }),
    defineField({ group: 'hero', name: 'heroCta1Label', title: 'Primary Button Label', type: 'string', initialValue: 'View Menu' }),
    defineField({ group: 'hero', name: 'heroCta1Link', title: 'Primary Button Link', type: 'string', initialValue: '/menu' }),
    defineField({ group: 'hero', name: 'heroCta2Enabled', title: 'Show Secondary Button', type: 'boolean', initialValue: true }),
    defineField({ group: 'hero', name: 'heroCta2Label', title: 'Secondary Button Label', type: 'string', initialValue: 'Find Us' }),
    defineField({ group: 'hero', name: 'heroCta2Link', title: 'Secondary Button Link', type: 'string', initialValue: '/outlet' }),
    defineField({
      group: 'highlights', name: 'features', title: 'Brand Promise (Feature Row)', type: 'array',
      description: 'Drag to reorder. Works with any number of items — the layout adapts.',
      of: [{
        type: 'object', fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'string' },
          { name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true },
        ],
        preview: { select: { title: 'title', subtitle: 'description', enabled: 'enabled' }, prepare: ({ title, subtitle, enabled }) => ({ title, subtitle: enabled === false ? `${subtitle} (hidden)` : subtitle }) },
      }],
    }),
    // ── Signature Bite section (the big dish with the yellow splash) ─────────────
    defineField({ group: 'signature', name: 'signatureEnabled', title: 'Signature Bite — Show this section', type: 'boolean', initialValue: true }),
    defineField({ group: 'signature', name: 'signatureHeadingLine1', title: 'Signature Bite — Heading line 1', type: 'string', initialValue: 'Our' }),
    defineField({ group: 'signature', name: 'signatureHeadingLine2', title: 'Signature Bite — Heading line 2 (red)', type: 'string', initialValue: 'Signature Bite' }),
    defineField({
      group: 'signature', name: 'signatureProduct', title: 'Signature Bite — Product to feature', type: 'reference', to: [{ type: 'product' }],
      options: { filter: 'archived != true' },
      description: 'Pick the product. Its name, price and “View Product” page link are used. Leave empty to automatically use the first product marked “Show on Homepage”.',
    }),
    defineField({
      group: 'signature', name: 'signatureImage', title: 'Signature Bite — Image', type: 'image', options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
      description: 'Your own image for this section. For the floating look on the yellow splash upload a TRANSPARENT PNG of the dish (background removed) and keep “Image style” on Cut-out. ' + specText(IMAGE_SPECS.standard) + ' Leave empty to use the product’s cut-out or main photo.',
      validation: ratioWarning(IMAGE_SPECS.standard),
    }),
    defineField({
      group: 'signature', name: 'signatureImageStyle', title: 'Signature Bite — Image style', type: 'string', initialValue: 'cutout',
      options: { list: [{ title: 'Cut-out (transparent PNG floats on the splash)', value: 'cutout' }, { title: 'Photo (normal picture in a rounded frame)', value: 'photo' }], layout: 'radio' },
      description: 'Only applies to the image uploaded above.',
    }),
    defineField({ group: 'signature', name: 'signatureDescription', title: 'Signature Bite — Description', type: 'text', rows: 3, description: 'Leave empty to use the product’s own description.' }),
    defineField({ group: 'signature', name: 'signatureShowPrice', title: 'Signature Bite — Show price', type: 'boolean', initialValue: true }),
    defineField({ group: 'signature', name: 'signatureShowNote', title: 'Signature Bite — Show handwritten note', type: 'boolean', initialValue: true }),
    defineField({ group: 'signature', name: 'signatureNote', title: 'Signature Bite — Handwritten note text', type: 'string', description: 'Small handwritten line with an arrow pointing at the dish, e.g. “The Taste of Berhampur”. Leave empty to use that default.' }),
    defineField({
      group: 'signature', name: 'signatureNotePosition', title: 'Signature Bite — Note position', type: 'string', initialValue: 'top-right',
      options: { layout: 'dropdown', list: [
        { title: 'Above the picture — left', value: 'top-left' }, { title: 'Above the picture — centre', value: 'top-center' }, { title: 'Above the picture — right', value: 'top-right' },
        { title: 'Below the picture — left', value: 'bottom-left' }, { title: 'Below the picture — centre', value: 'bottom-center' }, { title: 'Below the picture — right', value: 'bottom-right' },
      ] },
      description: 'The note always sits in its own space above or below the picture, so it never covers the dish.',
    }),
    defineField({ group: 'signature', name: 'signatureNoteStyle', title: 'Signature Bite — Note boldness', type: 'string', initialValue: 'normal', options: { layout: 'radio', list: [{ title: 'Normal', value: 'normal' }, { title: 'Bold', value: 'bold' }] } }),
    defineField({ group: 'signature', name: 'signatureNoteSize', title: 'Signature Bite — Note size', type: 'string', initialValue: 'medium', options: { layout: 'radio', list: [{ title: 'Small', value: 'small' }, { title: 'Medium', value: 'medium' }, { title: 'Large', value: 'large' }] } }),
    defineField({ group: 'signature', name: 'signatureButtonLabel', title: 'Signature Bite — Button label', type: 'string', initialValue: 'View Product' }),
    defineField({ group: 'signature', name: 'signatureButtonLink', title: 'Signature Bite — Button link', type: 'string', description: 'Optional. Leave empty to open the product’s own page. Example: /menu', }),
    defineField({ group: 'promo', name: 'promoEnabled', title: 'Show Promotional Section', type: 'boolean', initialValue: false, description: 'Off by default — turn on only once the section below is filled in with real content.' }),
    defineField({ group: 'promo', name: 'promoHeading', title: 'Promo Heading', type: 'string' }),
    defineField({ group: 'promo', name: 'promoDescription', title: 'Promo Description', type: 'text', rows: 3 }),
    defineField({ group: 'promo', name: 'promoImage', title: 'Promo Image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }], description: specText(IMAGE_SPECS.standard), validation: ratioWarning(IMAGE_SPECS.standard) }),
    defineField({ group: 'promo', name: 'promoButtonLabel', title: 'Promo Button Label', type: 'string' }),
    defineField({ group: 'promo', name: 'promoButtonLink', title: 'Promo Button Link', type: 'string', description: 'A page on this site (e.g. /menu) or a full https:// link.', validation: (r) => r.custom((v: string | undefined) => !v || /^\/(?!\/)/.test(v) || /^https?:\/\//i.test(v) || 'Start with / (for a page on this site) or https://') }),
  ],
  preview: { prepare: () => ({ title: 'Homepage' }) },
});
