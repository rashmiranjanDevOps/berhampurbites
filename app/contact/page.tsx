import type { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { businessSettingsQuery, primaryOutletQuery } from '@/sanity/lib/queries';
import { buildWhatsAppUrl, telHref } from '@/sanity/lib/whatsapp';
import { resolveMapSrc } from '@/sanity/lib/map';
import ContactForm from '@/components/ContactForm';
import { FaWhatsapp, FaPhone, FaEnvelope, FaLocationDot, FaMapLocationDot } from 'react-icons/fa6';
import SocialIcons from '@/components/SocialIcons';
import MapButton from '@/components/MapButton';
import { safeHref } from '@/sanity/lib/safeLink';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Berhampur Bites by phone, WhatsApp, or the contact form.',
  alternates: { canonical: '/contact' },
};

export default async function ContactPage() {
  const [b, outlet] = await Promise.all([client.fetch(businessSettingsQuery), client.fetch(primaryOutletQuery)]);
  const whatsappUrl = buildWhatsAppUrl(b?.whatsapp, b?.whatsappMessage);
  const mapSrc = resolveMapSrc(b, outlet);
  // Messages go to the number set in Studio (Contact Form — Number that receives customer messages); falls back to WhatsApp / phone.
  const whatsappNumber = b?.contactReceiverNumber || b?.whatsapp || b?.phone;
  const smsNumber = b?.contactReceiverNumber || b?.phone || b?.whatsapp;
  const row = 'flex items-center gap-3 min-h-[44px] hover:text-red focus-ring rounded-sm';
  return (
    <section className="py-12 md:py-16 max-w-site mx-auto px-5 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <span className="eyebrow-plain">Get in touch</span>
        <h1 className="h-serif text-4xl md:text-5xl mt-1">Contact <span className="text-red">Us</span></h1>
        <p className="text-muted mb-6 mt-2">We&apos;d love to hear from you.</p>
        <ul className="space-y-1 text-sm">
          {b?.phone && <li><a href={telHref(b.phone) || undefined} className={row}><FaPhone aria-hidden className="text-red" />{b.phone}</a></li>}
          {whatsappUrl && <li><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={row}><FaWhatsapp aria-hidden className="text-red" />Chat on WhatsApp</a></li>}
          {b?.email && <li><a href={`mailto:${b.email}`} className={`${row} break-all`}><FaEnvelope aria-hidden className="text-red" />{b.email}</a></li>}
          {b?.address && <li className="flex items-start gap-3 py-2 whitespace-pre-line"><FaLocationDot aria-hidden className="text-red mt-1" />{b.address}</li>}
          {safeHref(b?.googleMapsUrl) && <li><a href={safeHref(b?.googleMapsUrl) as string} target="_blank" rel="noopener noreferrer" className={row}><FaMapLocationDot aria-hidden className="text-red" />Open in Google Maps</a></li>}
        </ul>
        <SocialIcons business={b} whatsappUrl={whatsappUrl} size="lg" className="mt-6" />
        <div className="mt-6"><MapButton src={mapSrc} directionsUrl={safeHref(b?.googleMapsUrl)} label="View Map" /></div>
      </div>
      <ContactForm businessName={b?.businessName || 'Berhampur Bites'} whatsappNumber={whatsappNumber} smsNumber={smsNumber} template={b?.contactMessageTemplate} />
    </section>
  );
}
