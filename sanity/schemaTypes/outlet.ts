import { defineField, defineType } from 'sanity';
import { IMAGE_SPECS, specText, ratioWarning } from '../lib/imageRules';

export default defineType({
  name: 'outlet',
  title: 'Outlet',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Outlet Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } }),
    defineField({
      name: 'status', title: 'Status', type: 'string', initialValue: 'open',
      options: { list: [{ title: 'Open', value: 'open' }, { title: 'Coming Soon', value: 'coming_soon' }] },
      description: 'While "Coming Soon", the public Outlet page shows a coming-soon message instead of hours/address/map — set real details before switching to Open.',
    }),
    defineField({ name: 'address', title: 'Address', type: 'text', rows: 2 }),
    defineField({ name: 'mapEmbedUrl', title: 'Google Maps embed for this outlet (optional)', type: 'text', rows: 3, description: 'Google Maps → Share → Embed a map → Copy HTML, paste here. Used by the Find Us / View Map popup. Leave empty to use Business Settings.', validation: (r) => r.custom((v: string | undefined) => !v || /google\.com\/maps\/embed/i.test(v) || 'Paste the code from Google Maps → Share → Embed a map.') }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp Number', type: 'string', description: 'Digits only, with country code, e.g. 919876543210. Leave empty to use the main Business Settings WhatsApp number instead.' }),
    defineField({ name: 'openingHours', title: 'Opening Hours', type: 'string', description: 'Type it like  11:00 AM - 11:00 PM  (or  Mon–Sun, 11:00 AM - 11:00 PM). That exact style also switches on the green “Open now / Closed now” badge. Other styles (24-hour, two shifts, “Open 24 hours”) still show as typed, but without the badge.' }),
    defineField({ name: 'mapsUrl', title: 'Google Maps URL', type: 'url' }),
    defineField({ name: 'exteriorImage', title: 'Exterior Image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'string' }], description: specText(IMAGE_SPECS.standard), validation: ratioWarning(IMAGE_SPECS.standard) }),
    defineField({ name: 'interiorImages', title: 'Interior Images', type: 'array', description: 'Up to 2 are shown on the homepage. ' + specText(IMAGE_SPECS.interior), of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'string' }], validation: ratioWarning(IMAGE_SPECS.interior) }] }),
    defineField({ name: 'isPrimary', title: 'Primary Outlet', type: 'boolean', initialValue: false, description: 'The outlet shown on the homepage and Our Outlet page. Turn this on for just ONE outlet. If none is marked, the oldest outlet is shown.' }),
  ],
  preview: {
    select: { title: 'name', status: 'status', primary: 'isPrimary' },
    prepare({ title, status, primary }) {
      return { title, subtitle: `${status === 'coming_soon' ? 'Coming Soon' : 'Open'}${primary ? ' — Primary' : ''}` };
    },
  },
});
