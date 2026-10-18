import { defineField, defineType } from 'sanity';
import { IMAGE_SPECS, specText } from '../lib/imageRules';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';

export default defineType({
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'document',
  fields: [
    // Required by @sanity/orderable-document-list: a hidden string field holding the drag-and-drop rank.
    orderRankField({ type: 'galleryItem' }),
    defineField({
      name: 'image', title: 'Image', type: 'image', options: { hotspot: true },
      description: 'Any shape works — the gallery shows each photo in its own shape. ' + specText(IMAGE_SPECS.standard),
      fields: [{ name: 'alt', title: 'Alt text (for accessibility & SEO)', type: 'string' }], validation: r => r.required(),
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    defineField({
      name: 'category', title: 'Category', type: 'string',
      options: { list: ['Food', 'Outlet', 'Behind the Scenes'] }, validation: r => r.required(),
    }),
    defineField({ name: 'enabled', title: 'Show on Website', type: 'boolean', initialValue: true }),
    defineField({ name: 'sortOrder', title: 'Display Order (legacy — use the orderable Gallery list in the sidebar instead)', type: 'number', initialValue: 0, hidden: true }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { title: 'caption', media: 'image', category: 'category', enabled: 'enabled' },
    prepare({ title, media, category, enabled }) {
      return { title: title || '(no caption)', subtitle: `${category || 'Uncategorized'} — ${enabled === false ? 'Hidden' : 'Visible'}`, media };
    },
  },
});
