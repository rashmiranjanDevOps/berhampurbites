import { defineField, defineType } from 'sanity';
import { toInternationalDigits, DEFAULT_CONTACT_TEMPLATE } from '../lib/whatsapp';

// Number fields: accept normal Indian formats ("98765 43210", "+91 98765 43210"); reject things that cannot work.
const phoneRule = (Rule: any) =>
  Rule.custom((v: string | undefined) => !v || toInternationalDigits(v) !== null || 'Enter a full number, e.g. 98765 43210 or +91 98765 43210.');
const webLink = (Rule: any) => Rule.uri({ scheme: ['http', 'https'] });

export default defineType({
  name: 'businessSettings',
  title: 'Business Settings',
  type: 'document',
  fields: [
    defineField({ name: 'businessName', title: 'Business Name', type: 'string', initialValue: 'Berhampur Bites' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', initialValue: 'Good Food. Good Mood.' }),
    defineField({ name: 'phone', title: 'Business Phone', type: 'string', description: 'Shown on Call buttons. 10-digit Indian numbers work as they are.', validation: phoneRule }),
    defineField({ name: 'whatsapp', title: 'Business WhatsApp Number', type: 'string', description: 'e.g. 98765 43210 or +91 98765 43210. Leave empty to hide WhatsApp buttons sitewide.', validation: phoneRule }),
    defineField({ name: 'whatsappMessage', title: 'Default WhatsApp Message', type: 'string', initialValue: 'Hi! I would like to order from Berhampur Bites.' }),
    defineField({ name: 'email', title: 'Business Email', type: 'string', description: 'Shown on the website footer and Contact page (optional).', validation: (r) => r.email().warning('This does not look like a valid email address.') }),

    // ── Contact form: the customer's phone opens WhatsApp (or SMS) with a ready-typed message to this number ──
    defineField({
      name: 'contactReceiverNumber', title: 'Contact Form — Number that receives customer messages', type: 'string',
      description: 'When a customer sends the Contact form, their phone opens WhatsApp (or SMS) with the message ready to send to THIS number. Leave empty to use the WhatsApp number above (SMS uses the Business Phone, then the WhatsApp number).',
      validation: phoneRule,
    }),
    defineField({
      name: 'contactMessageTemplate', title: 'Contact Form — Pre-typed message', type: 'text', rows: 4,
      initialValue: DEFAULT_CONTACT_TEMPLATE,
      description: 'The text that appears ready-typed in WhatsApp/SMS. Placeholders (kept exactly as written): {business} {name} {phone} {message}. It must contain {message}, or the customer’s own words would be missing.',
      validation: (r) => r.custom((v: string | undefined) => !v || v.includes('{message}') || 'The template must contain {message} so the customer’s own message is included.'),
    }),

    defineField({ name: 'address', title: 'Address', type: 'text', rows: 2 }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url', description: 'Full link starting with https://. The Instagram icon shows only when this is filled.', validation: webLink }),
    defineField({ name: 'facebookUrl', title: 'Facebook URL', type: 'url', description: 'Full link starting with https://. The Facebook icon shows only when this is filled.', validation: webLink }),
    defineField({ name: 'youtubeUrl', title: 'YouTube URL', type: 'url', description: 'Full link starting with https://. The YouTube icon shows only when this is filled.', validation: webLink }),
    defineField({ name: 'googleMapsUrl', title: 'Google Maps URL (Get Directions button)', type: 'url', description: 'The normal Google Maps share link. Opens Google Maps for directions.', validation: webLink }),
    defineField({
      name: 'mapEmbedUrl', title: 'Google Maps embed (for the "Find Us / View Map" popup)', type: 'text', rows: 3,
      description: 'In Google Maps: Share → Embed a map → Copy HTML, then paste it here (the whole <iframe …> is fine). The map opens in a popup only when a visitor taps Find Us / View Map. If empty, the address above is used (less precise).',
      validation: (r) => r.custom((v: string | undefined) => !v || /google\.com\/maps\/embed/i.test(v) || 'Paste the code from Google Maps → Share → Embed a map.'),
    }),
  ],
  preview: { prepare: () => ({ title: 'Business Settings' }) },
});
