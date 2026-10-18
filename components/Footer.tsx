import Image from 'next/image';
import Link from 'next/link';
import { safeFetch } from '@/sanity/lib/client';
import { businessSettingsQuery, brandSettingsQuery } from '@/sanity/lib/queries';
import { buildWhatsAppUrl, telHref } from '@/sanity/lib/whatsapp';
import { urlFor } from '@/sanity/lib/image';
import { FaPhone, FaEnvelope, FaLocationDot } from 'react-icons/fa6';
import SocialIcons, { buildSocials } from './SocialIcons';
import { safeHref } from '@/sanity/lib/safeLink';

const EXPLORE_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/story', label: 'Our Story' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/outlet', label: 'Our Outlet' },
  { href: '/contact', label: 'Contact Us' },
];

export default async function Footer() {
  const [business, brand] = await Promise.all([
    safeFetch(businessSettingsQuery),
    safeFetch(brandSettingsQuery),
  ]);
  const businessName = business?.businessName || 'Berhampur Bites';
  const whatsappUrl = buildWhatsAppUrl(business?.whatsapp, business?.whatsappMessage);

  return (
    <footer className="bg-cream border-t border-line">
      <div className="max-w-site mx-auto grid grid-cols-2 md:grid-cols-[1.2fr_1fr_1.4fr_1fr] gap-x-6 gap-y-8 px-5 md:px-8 py-10 md:py-12">
        <div className="col-span-2 md:col-span-1">
          {brand?.logo ? (
            <Image src={urlFor(brand.logo).width(220).url()} alt={brand.logo.alt || businessName} width={220} height={72} className="h-14 w-auto object-contain" />
          ) : (<span className="font-display text-2xl font-extrabold text-red">{businessName}</span>)}
          <p className="text-[12px] text-red mt-2">{business?.tagline || 'Good Food. Good Mood.'}</p>
        </div>
        <div>
          <h2 className="text-[13px] font-bold text-ink mb-2">Explore</h2>
          <nav aria-label="Footer">
            {EXPLORE_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="block text-[12px] text-muted py-2.5 md:py-1 hover:text-red focus-ring rounded-sm">{l.label}</Link>
            ))}
          </nav>
        </div>
        <div>
          <h2 className="text-[13px] font-bold text-ink mb-2">Contact</h2>
          {business?.phone && <a href={telHref(business.phone) || undefined} className="flex items-center gap-2 text-[12px] text-muted py-2.5 md:py-1 hover:text-red focus-ring rounded-sm"><FaPhone aria-hidden className="text-red" />{business.phone}</a>}
          {business?.email && <a href={`mailto:${business.email}`} className="flex items-center gap-2 break-all text-[12px] text-muted py-2.5 md:py-1 hover:text-red focus-ring rounded-sm"><FaEnvelope aria-hidden className="text-red flex-shrink-0" />{business.email}</a>}
          {business?.address && <p className="flex items-start gap-2 text-[12px] text-muted py-1 whitespace-pre-line"><FaLocationDot aria-hidden className="text-red mt-0.5 flex-shrink-0" />{business.address}</p>}
          {safeHref(business?.googleMapsUrl) && (
            <a href={safeHref(business?.googleMapsUrl) as string} target="_blank" rel="noopener noreferrer" className="inline-block text-[12px] font-semibold text-red py-2.5 md:py-1 hover:text-red-dark focus-ring rounded-sm">Get Directions →</a>
          )}
        </div>
        {buildSocials(business, whatsappUrl).length > 0 && (
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-[13px] font-bold text-ink mb-3">Follow Us</h2>
            <SocialIcons business={business} whatsappUrl={whatsappUrl} />
          </div>
        )}
      </div>
      <div className="border-t border-line py-4 text-center text-[11px] text-muted">
        © {new Date().getFullYear()} {businessName}. All rights reserved.
      </div>
    </footer>
  );
}
