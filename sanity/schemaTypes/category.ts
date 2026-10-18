import { defineField, defineType } from 'sanity';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    // Required by @sanity/orderable-document-list: a hidden string field holding the drag-and-drop rank.
    orderRankField({ type: 'category' }),
    defineField({
      name: 'title', title: 'Category Name', type: 'string', validation: r => r.required().custom(async (title, context) => {
        if (!title) return true;
        const { getClient, document } = context;
        const client = getClient({ apiVersion: '2024-01-01' });
        const id = document?._id?.replace(/^drafts\./, '');
        const count = await client.fetch(
          `count(*[_type == "category" && lower(title) == lower($title) && !(_id in [$id, "drafts." + $id])])`,
          { title, id }
        );
        if (count > 0) {
          return `A category named "${title}" already exists (category names should be unique so products don't get split across duplicates like "Burger" and "Burgers").`;
        }
        return true;
      }),
    }),
    defineField({
      name: 'slug', title: 'Slug', type: 'slug', options: {
        source: 'title',
        isUnique: async (slug, context) => {
          const { document, getClient } = context;
          const client = getClient({ apiVersion: '2024-01-01' });
          const id = document?._id?.replace(/^drafts\./, '');
          const count = await client.fetch(
            `count(*[_type == "category" && slug.current == $slug && !(_id in [$id, "drafts." + $id])])`,
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
          `count(*[_type == "category" && slug.current == $slugValue && !(_id in [$id, "drafts." + $id])])`,
          { slugValue: slug.current, id }
        );
        return count === 0 ? true : 'This slug is already used by another category — choose a different one.';
      }),
    }),
    defineField({ name: 'visible', title: 'Visible on Website', type: 'boolean', initialValue: true, description: 'Turn off to hide this category (and its products) from the public Menu without deleting anything.' }),
    defineField({ name: 'sortOrder', title: 'Display Order (legacy — use the orderable Categories list in the sidebar instead)', type: 'number', initialValue: 0, hidden: true }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { title: 'title', visible: 'visible' },
    prepare({ title, visible }) {
      return { title, subtitle: visible === false ? 'Hidden' : 'Visible' };
    },
  },
});
