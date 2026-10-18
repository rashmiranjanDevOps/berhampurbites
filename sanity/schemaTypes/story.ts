import { defineField, defineType } from 'sanity';
import { IMAGE_SPECS, specText, ratioWarning } from '../lib/imageRules';

export default defineType({
  name: 'story',
  title: 'Our Story',
  type: 'document',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'Born in Berhampur.' }),
    defineField({ name: 'subheading', title: 'Subheading (accent color)', type: 'string', initialValue: 'Built for Big Cravings.' }),
    defineField({ name: 'bodyText', title: 'Story Text', type: 'text', rows: 6 }),
    defineField({ name: 'image', title: 'Story Image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }], description: specText(IMAGE_SPECS.standard), validation: ratioWarning(IMAGE_SPECS.standard) }),
    defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string', initialValue: 'Our Journey' }),
    defineField({ name: 'ctaLink', title: 'CTA Link', type: 'string' }),
  ],
  preview: { prepare: () => ({ title: 'Our Story' }) },
});
