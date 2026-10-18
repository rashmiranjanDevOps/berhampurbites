import type { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { homepageQuery, allProductsQuery, categoryStripQuery, homeCirclesQuery, storyQuery, primaryOutletQuery, galleryQuery, businessSettingsQuery } from '@/sanity/lib/queries';
import { buildWhatsAppUrl } from '@/sanity/lib/whatsapp';
import { resolveMapSrc } from '@/sanity/lib/map';
import Hero from '@/components/Hero';
import CategoryStrip from '@/components/CategoryStrip';
import SignatureBite from '@/components/SignatureBite';
import MenuPreview from '@/components/MenuPreview';
import StoryTeaser from '@/components/StoryTeaser';
import OutletSection from '@/components/OutletSection';
import GalleryStrip from '@/components/GalleryStrip';
import PromoBanner from '@/components/PromoBanner';
import FeatureRow from '@/components/FeatureRow';
import FollowUs from '@/components/FollowUs';
import { safeHref } from '@/sanity/lib/safeLink';

export const metadata: Metadata = { alternates: { canonical: '/' } };
export const revalidate = 60; // published Studio changes appear within about a minute

export default async function HomePage() {
  const [home, products, categories, circles, story, outlet, gallery, business] = await Promise.all([
    client.fetch(homepageQuery), client.fetch(allProductsQuery), client.fetch(categoryStripQuery), client.fetch(homeCirclesQuery),
    client.fetch(storyQuery), client.fetch(primaryOutletQuery), client.fetch(galleryQuery), client.fetch(businessSettingsQuery),
  ]);
  const whatsappUrl = buildWhatsAppUrl(business?.whatsapp, business?.whatsappMessage);
  // A WhatsApp number typed on the outlet wins over the business-wide one (same rule as the /outlet page).
  const outletWhatsappUrl = buildWhatsAppUrl(outlet?.whatsapp || business?.whatsapp, business?.whatsappMessage);
  const mapSrc = resolveMapSrc(business, outlet);
  const directionsUrl = safeHref(outlet?.mapsUrl) || safeHref(business?.googleMapsUrl) || null;

  // The hero is a client component: send it only the fields it uses, not the whole homepage document.
  const heroData = home && Object.fromEntries(['heroImage', 'heroBadge', 'heroHeadingLine1', 'heroHeadingLine2', 'heroSubheading', 'heroCta1Label', 'heroCta1Link', 'heroCta2Enabled', 'heroCta2Label', 'heroCta2Link', 'heroTextPosition', 'heroOverlay'].map((k) => [k, home[k]]));

  const live = (products || []).filter((p: any) => p.available !== false && p.mainImage);
  const feats = (home?.featuredProducts || []).filter((p: any) => p.mainImage);
  // Studio → Homepage → "Signature Bite — Product" wins; otherwise the first "Show on Homepage" product (preferring one with a cut-out).
  const signature = home?.signatureProduct || feats.find((p: any) => p.cutoutImage) || feats[0] || live[0];
  const others = live.filter((p: any) => p._id !== signature?._id);
  const menuPicks = (others.length >= 4 ? others : live).slice(0, 4);

  return (
    <div>
      <Hero home={heroData} mapSrc={mapSrc} directionsUrl={directionsUrl} />
      <CategoryStrip circles={circles} categories={categories} />
      <SignatureBite home={home} product={signature} brandWord={business?.businessName?.split(' ')[0]} />
      <MenuPreview products={menuPicks} />
      <FeatureRow features={home?.features} />
      <PromoBanner home={home} />
      <StoryTeaser story={story} />
      <OutletSection outlet={outlet} business={business} whatsappUrl={outletWhatsappUrl} mapSrc={mapSrc} />
      <GalleryStrip items={gallery} />
      <FollowUs business={business} whatsappUrl={whatsappUrl} />
    </div>
  );
}
