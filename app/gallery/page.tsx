import type { Metadata } from 'next';
import { Suspense } from 'react';
import { client } from '@/sanity/lib/client';
import { galleryQuery, businessSettingsQuery } from '@/sanity/lib/queries';
import { buildWhatsAppUrl } from '@/sanity/lib/whatsapp';
import EmptyState from '@/components/EmptyState';
import GalleryGrid from '@/components/GalleryGrid';
import GalleryBrowser from '@/components/GalleryBrowser';
import FollowUs from '@/components/FollowUs';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'A glimpse of our food, our outlet, and the moments we love at Berhampur Bites.',
  alternates: { canonical: '/gallery' },
};

export default async function GalleryPage() {
  const [items, business] = await Promise.all([client.fetch(galleryQuery), client.fetch(businessSettingsQuery)]);
  const whatsappUrl = buildWhatsAppUrl(business?.whatsapp, business?.whatsappMessage);
  return (
    <div>
      <section className="section">
        <h1 className="font-display text-4xl md:text-display-lg font-extrabold"><span className="text-red">Gallery</span></h1>
        <p className="text-body-lg text-muted mb-8 mt-1">A glimpse of our food, our outlet and the moments we love.</p>
        <Suspense fallback={items.length ? <GalleryGrid items={items} /> : <EmptyState message="More moments coming soon." />}>
          <GalleryBrowser items={items} />
        </Suspense>
      </section>
      <FollowUs business={business} whatsappUrl={whatsappUrl} />
    </div>
  );
}
