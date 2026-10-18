import type { Metadata } from 'next';
import './globals.css';
// Self-hosted fonts (bundled with the site, so they load on every phone — no Google request, no @import).
import '@fontsource-variable/playfair-display/wght.css';
import '@fontsource-variable/caveat/wght.css';
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import '@fontsource/poppins/latin-700.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileActionBar from '@/components/MobileActionBar';
import SiteChrome from '@/components/SiteChrome';
import { safeFetch } from '@/sanity/lib/client';
import { brandSettingsQuery, businessSettingsQuery, homepageQuery } from '@/sanity/lib/queries';
import { urlFor, imgSrc } from '@/sanity/lib/image';
import { buildThemeCss } from '@/sanity/lib/theme';
import { buildRestaurantJsonLd } from '@/sanity/lib/structuredData';
import { getSiteUrl } from '@/sanity/lib/siteUrl';
import { jsonLdString } from '@/sanity/lib/jsonLd';

const siteUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  const [brand, business, home] = await Promise.all([
    safeFetch(brandSettingsQuery),
    safeFetch(businessSettingsQuery),
    safeFetch(homepageQuery),
  ]);
  const ogImage = home?.heroImage ? urlFor(home.heroImage).width(1200).height(630).fit('crop').url() : undefined;
  const name = business?.businessName || 'Berhampur Bites';
  const tagline = business?.tagline || 'Good Food. Good Mood.';
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${name} — ${tagline}`, template: `%s | ${name}` },
    description: `Crispy chicken, juicy burgers and bold flavours, freshly made in Berhampur, Odisha.`,
    icons: brand?.favicon ? [{ url: imgSrc(brand.favicon, 64) }] : undefined,
    openGraph: { title: name, description: tagline, type: 'website', url: siteUrl, siteName: name, locale: 'en_IN', images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined },
    twitter: { card: 'summary_large_image', title: name, description: tagline, images: ogImage ? [ogImage] : undefined },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [brand, business] = await Promise.all([
    safeFetch(brandSettingsQuery),
    safeFetch(businessSettingsQuery),
  ]);
  const themeCss = buildThemeCss(brand);
  const logoUrl = brand?.logo ? urlFor(brand.logo).width(256).url() : undefined;
  const jsonLd = buildRestaurantJsonLd({ business, logoUrl, siteUrl });
  return (
    <html lang="en">
      <body>
        {/* Brand Settings colours (hex values only) override the default palette — see tailwind.config.js. */}
        {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
        {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:z-[100]">
          Skip to content
        </a>
        <SiteChrome header={<Header />} footer={<Footer />} actionBar={<MobileActionBar />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
