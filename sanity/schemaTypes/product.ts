import { defineField, defineType } from 'sanity';
import { IMAGE_SPECS, specText, ratioWarning } from '../lib/imageRules';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    // Required by @sanity/orderable-document-list: a hidden string field holding the drag-and-drop rank.
    orderRankField({ type: 'product' }),
    defineField({
      name: 'name', title: 'Product Name', type: 'string', validation: r => r.required().custom(async (name, context) => {
        if (!name) return true;
        const { getClient, document } = context;
        const client = getClient({ apiVersion: '2024-01-01' });
        const id = document?._id?.replace(/^drafts\./, '');
        const count = await client.fetch(
          `count(*[_type == "product" && lower(name) == lower($name) && !(_id in [$id, "drafts." + $id])])`,
          { name, id }
        );
        if (count > 0) {
          return { message: `Another product is already named "${name}" — consider a more specific name (e.g. add a size or variant) to avoid confusing customers.`, level: 'warning' } as any;
        }
        return true;
      }),
    }),
    defineField({
      name: 'slug', title: 'Slug (used in the product URL)', type: 'slug',
      options: {
        source: 'name',
        isUnique: async (slug, context) => {
          const { document, getClient } = context;
          const client = getClient({ apiVersion: '2024-01-01' });
          const id = document?._id?.replace(/^drafts\./, '');
          const count = await client.fetch(
            `count(*[_type == "product" && slug.current == $slug && !(_id in [$id, "drafts." + $id])])`,
            { slug, id }
          );
          return count === 0;
        },
      },
      validation: r => r.required().custom(async (slug, context) => {
        if (!slug?.current) return true;
        const { document, getClient } = context;
        const client = getClient({ apiVersion: '2024-01-01' });
        const id = document?._id?.replace(/^drafts\./, '');
        const count = await client.fetch(
          `count(*[_type == "product" && slug.current == $slugValue && !(_id in [$id, "drafts." + $id])])`,
          { slugValue: slug.current, id }
        );
        return count === 0 ? true : 'This slug is already used by another product — choose a different one.';
      }),
    }),
    defineField({ name: 'category', title: 'Category', type: 'reference', to: [{ type: 'category' }], validation: r => r.required() }),
    defineField({ name: 'shortDescription', title: 'Short Description', type: 'string', description: 'Shown on cards (menu / home). Keep it to one short line.' }),
    defineField({ name: 'fullDescription', title: 'Full Description', type: 'text', rows: 4, description: 'Shown on the product detail page.' }),
    defineField({
      name: 'regularPrice', title: 'Regular Price (₹)', type: 'number',
      validation: r => r.required().min(0).error('Regular price must be zero or more.'),
    }),
    defineField({
      name: 'offerPrice', title: 'Offer Price (₹)', type: 'number',
      description: 'Leave empty if there is no offer. Must not be higher than the regular price.',
      validation: r => r.min(0).error('Offer price cannot be negative.').custom((offerPrice, context) => {
        const regular = (context.document as any)?.regularPrice;
        if (offerPrice != null && regular != null && offerPrice > regular) {
          return 'Offer price cannot be higher than the regular price.';
        }
        return true;
      }),
    }),
    defineField({
      name: 'mainImage', title: 'Main Product Image', type: 'image',
      description: specText(IMAGE_SPECS.standard) + ' The whole product is shown on its page; cards show it in a 4:3 frame.',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text (for accessibility & SEO)', type: 'string' }],
      validation: r => [r.required(), ratioWarning(IMAGE_SPECS.standard)(r)],
    }),
    defineField({
      name: 'cutoutImage', title: 'Signature cut-out (optional)', type: 'image',
      description: 'OPTIONAL. A TRANSPARENT PNG of just the dish (background removed, e.g. with remove.bg). If this product is the homepage Signature Bite, it floats over the yellow splash like the design. Best size: 1200 × 900 px (4:3). Leave empty to use the normal photo.',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    }),
    defineField({
      name: 'gallery', title: 'Additional Product Images', type: 'array',
      description: 'Optional extra photos shown on the product detail page. Drag to reorder. ' + specText(IMAGE_SPECS.standard),
      of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'string' }] }],
    }),
    defineField({
      name: 'badge', title: 'Badge', type: 'string', description: 'Shown as a small label on the product card. Choose "None" for no badge.',
      options: { list: ['Bestseller', 'New', 'Popular', 'Spicy', 'Limited', 'None'] }, initialValue: 'None',
    }),
    defineField({
      name: 'featured', title: 'Show on Homepage (Signature Picks)', type: 'boolean', initialValue: false,
      validation: r => r.custom(async (featured, context) => {
        if (!featured) return true;
        const { getClient, document } = context;
        const client = getClient({ apiVersion: '2024-01-01' });
        const id = document?._id?.replace(/^drafts\./, '');
        const count = await client.fetch(
          `count(*[_type == "product" && featured == true && available == true && !(_id in [$id, "drafts." + $id])])`,
          { id }
        );
        if (count >= 8) {
          return { message: 'You already have 8+ products featured on the homepage — consider un-featuring an older one so Signature Picks stays focused.', level: 'warning' } as any;
        }
        return true;
      }),
    }),
    defineField({ name: 'available', title: 'Available (in stock / on the menu right now)', type: 'boolean', initialValue: true, description: 'Turn off to show "Currently Unavailable" without deleting the product.' }),
    defineField({ name: 'archived', title: 'Archived', type: 'boolean', initialValue: false, description: 'Archived products are hidden everywhere on the public site but kept for your records. Prefer this over deleting.' }),
    defineField({ name: 'sortOrder', title: 'Display Order (legacy — use the orderable Products list in the sidebar instead)', type: 'number', initialValue: 0, hidden: true }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { title: 'name', subtitle: 'category.title', media: 'mainImage', price: 'regularPrice', offer: 'offerPrice', available: 'available', archived: 'archived', featured: 'featured', badge: 'badge' },
    prepare({ title, subtitle, media, price, offer, available, archived, featured, badge }) {
      const priceText = offer ? `₹${offer} (was ₹${price})` : `₹${price ?? '—'}`;
      const flags = [
        archived ? 'Archived' : (available ? 'Available' : 'Unavailable'),
        featured ? 'Featured' : null,
        badge && badge !== 'None' ? badge : null,
      ].filter(Boolean).join(' · ');
      return { title, subtitle: `${subtitle || 'No category'} — ${priceText} — ${flags}`, media };
    },
  },
});
