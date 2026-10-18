import { defineField, defineType } from 'sanity';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { IMAGE_SPECS, specText, ratioWarning } from '../lib/imageRules';

/** One round picture in the homepage strip under the hero. Add, hide, delete and drag to reorder in Studio. */
export default defineType({
  name: 'homeCircle',
  title: 'Homepage Circle',
  type: 'document',
  fields: [
    orderRankField({ type: 'homeCircle' }),
    defineField({ name: 'title', title: 'Label (shown under the circle)', type: 'string', validation: (r) => r.required().max(24) }),
    defineField({
      name: 'image', title: 'Picture', type: 'image', options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
      description: specText(IMAGE_SPECS.circle) + ' It is shown inside a circle — use the crop/hotspot tool to centre the food.',
      validation: (r) => [r.required(), ratioWarning(IMAGE_SPECS.circle)(r)],
    }),
    defineField({
      name: 'category', title: 'Opens this menu category (optional)', type: 'reference', to: [{ type: 'category' }],
      description: 'When tapped, the Menu page opens filtered to this category.',
    }),
    defineField({
      name: 'customLink', title: 'Or a custom link (optional)', type: 'string',
      description: 'Overrides the category. Use /menu, /gallery … or a full https:// link. If both are empty the circle opens the full Menu.',
      validation: (r) => r.custom((v: string | undefined) => !v || /^\/(?!\/)/.test(v) || /^https?:\/\//i.test(v) || 'Start with / (for a page on this site) or https://'),
    }),
    defineField({ name: 'visible', title: 'Show on website', type: 'boolean', initialValue: true, description: 'Turn off to hide without deleting.' }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { title: 'title', media: 'image', visible: 'visible' },
    prepare: ({ title, media, visible }) => ({ title, media, subtitle: visible === false ? 'Hidden' : 'Shown' }),
  },
});
