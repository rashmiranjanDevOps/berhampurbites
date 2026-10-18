import Image from 'next/image';
import type { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { primaryOutletQuery, businessSettingsQuery } from '@/sanity/lib/queries';
import { imgSrc, imgPos } from '@/sanity/lib/image';
import { buildWhatsAppUrl } from '@/sanity/lib/whatsapp';
import { resolveMapSrc } from '@/sanity/lib/map';
import EmptyState from '@/components/EmptyState';
import OutletExperience from '@/components/OutletExperience';
import { safeHref } from '@/sanity/lib/safeLink';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Our Outlet',
  description: 'Find Berhampur Bites in Berhampur, Odisha — address, hours, and directions.',
  alternates: { canonical: '/outlet' },
};

export default async function OutletPage() {
  const [outlet, business] = await Promise.all([
    client.fetch(primaryOutletQuery),
    client.fetch(businessSettingsQuery),
  ]);

  if (!outlet) {
    return (
      <section className="section text-center">
        <h1 className="font-display text-4xl font-extrabold">Our <span className="text-red">Outlet</span></h1>
        <div className="mt-8"><EmptyState message="Outlet details coming soon." /></div>
      </section>
    );
  }

  const comingSoon = outlet.status === 'coming_soon';

  if (comingSoon) {
    // While Coming Soon, address/hours/phone/map/WhatsApp must NOT appear as though the outlet is open.
    // A real exterior photo (if uploaded) still shows — it is the actual building.
    return (
      <section className="section text-center">
        {outlet.exteriorImage && (
          <div className="relative rounded-panel overflow-hidden aspect-[4/3] max-w-xl mx-auto mb-8">
            <Image src={imgSrc(outlet.exteriorImage, 900)}
                   alt={outlet.exteriorImage.alt || outlet.name} fill sizes="(max-width: 768px) 100vw, 700px"
                   style={{ objectPosition: imgPos(outlet.exteriorImage) }} className="object-cover" />
          </div>
        )}
        <span className="eyebrow mb-4">Our Outlet</span>
        <h1 className="font-display text-4xl md:text-display-lg font-extrabold">{outlet.name}</h1>
        <p className="text-body-lg text-muted mt-3 max-w-md mx-auto">
          We&apos;re getting {outlet.name || 'our outlet'} ready — details coming soon.
        </p>
      </section>
    );
  }

  // Same rule as the homepage: anything missing on the outlet falls back to Business Settings.
  const merged = {
    ...outlet,
    address: outlet.address || business?.address,
    phone: outlet.phone || business?.phone,
    mapsUrl: safeHref(outlet.mapsUrl) || safeHref(business?.googleMapsUrl) || undefined,
  };
  const whatsappUrl = buildWhatsAppUrl(outlet.whatsapp || business?.whatsapp, business?.whatsappMessage);

  return <OutletExperience outlet={merged} whatsappUrl={whatsappUrl} mapSrc={resolveMapSrc(business, outlet)} />;
}
