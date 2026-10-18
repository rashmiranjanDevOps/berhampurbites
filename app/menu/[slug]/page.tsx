import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { productBySlugQuery, allProductsQuery, businessSettingsQuery } from '@/sanity/lib/queries';
import { buildWhatsAppUrl, telHref } from '@/sanity/lib/whatsapp';
import { getSiteUrl } from '@/sanity/lib/siteUrl';
import { jsonLdString } from '@/sanity/lib/jsonLd';
import { FaWhatsapp, FaPhone, FaShareNodes } from 'react-icons/fa6';
import { imgSrc } from '@/sanity/lib/image';
import { buildProductJsonLd } from '@/sanity/lib/structuredData';
import ProductCard from '@/components/ProductCard';
import ProductGallery from '@/components/ProductGallery';

export const revalidate = 60;
const siteUrl = getSiteUrl();

async function getProduct(slug: string) {
  return client.fetch(productBySlugQuery, { slug });
}

// Pre-build every product page; a product added later is built on its first visit.
export async function generateStaticParams() {
  const all = (await client.fetch(allProductsQuery)) || [];
  return all.filter((p: any) => p.slug?.current).map((p: any) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};
  const description = product.shortDescription || product.fullDescription || '';
  return {
    title: product.name,
    description,
    alternates: { canonical: `/menu/${params.slug}` },
    openGraph: {
      title: product.name, description,
      images: product.mainImage ? [imgSrc(product.mainImage, 1200)] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) return notFound();

  const business = await client.fetch(businessSettingsQuery);
  const askUrl = buildWhatsAppUrl(business?.whatsapp, `Hi! I'd like to know more about ${product.name}.`);
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${product.name} at ${business?.businessName || 'Berhampur Bites'}: ${siteUrl}/menu/${params.slug}`)}`;
  const hasOffer = product.offerPrice != null && product.offerPrice < product.regularPrice;
  const unavailable = product.available === false;
  const allImages = [product.mainImage, ...(product.gallery || [])].filter(Boolean);

  const related = product.category?.slug
    ? (await client.fetch(allProductsQuery)).filter((p: any) => p.category?.slug === product.category.slug && p._id !== product._id).slice(0, 4)
    : [];

  const jsonLd = buildProductJsonLd({
    product, slug: params.slug, siteUrl,
    imageUrl: product.mainImage ? imgSrc(product.mainImage, 800) : undefined,
  });

  return (
    <section className="section-sm">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />}
      <p className="text-sm text-muted mb-6">
        <Link href="/menu" className="inline-block py-3 px-1 -mx-1 hover:text-red">Menu</Link> <span className="mx-1.5">›</span>
        {product.category?.title} <span className="mx-1.5">›</span> {product.name}
      </p>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <ProductGallery images={allImages} productName={product.name} />
        </div>
        <div>
          {!unavailable && product.badge && product.badge !== 'None' && (
            <span className="eyebrow mb-3">{product.badge}</span>
          )}
          {unavailable && (
            // Solid, not translucent — bg-ink/80 would apply opacity to a
            // CSS-variable-backed color, which Tailwind can't alpha-blend
            // correctly and could render as a solid near-black badge instead.
            <span className="inline-block bg-ink text-white font-bold text-xs px-3.5 py-1.5 rounded-chip mb-3">Currently Unavailable</span>
          )}
          <h1 className="font-display text-4xl font-extrabold">{product.name}</h1>
          <p className="text-muted mt-2.5 leading-relaxed whitespace-pre-line">{product.fullDescription || product.shortDescription}</p>
          {!unavailable && (
            <div className="flex items-baseline gap-3 my-4 flex-wrap">
              {hasOffer && <span className="text-muted line-through text-xl">₹{product.regularPrice}</span>}
              <span className="text-red text-3xl font-extrabold">₹{hasOffer ? product.offerPrice : product.regularPrice}</span>
              {hasOffer && <span className="bg-yellow px-3 py-1 rounded-chip text-xs font-bold">Save ₹{product.regularPrice - product.offerPrice}</span>}
            </div>
          )}
          {unavailable && <p className="text-muted mt-4">This item isn&apos;t available right now — check back soon, or ask us on WhatsApp.</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            {askUrl && <a href={askUrl} target="_blank" rel="noopener noreferrer" className="btn-primary min-h-[44px] gap-2"><FaWhatsapp aria-hidden /> Ask about this item</a>}
            {telHref(business?.phone) && <a href={telHref(business.phone) || undefined} className="btn-outline text-ink min-h-[44px] gap-2"><FaPhone aria-hidden /> Call us</a>}
            <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-ink min-h-[44px] gap-2"><FaShareNodes aria-hidden /> Share</a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-extrabold mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p: any) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </section>
  );
}
