// Builds schema.org JSON-LD from Sanity content only — every field here is
// either directly Business/Brand Settings data or omitted. Nothing invented
// (no ratings, no "best in town" claims, no fabricated hours).
export function buildRestaurantJsonLd({ business, logoUrl, siteUrl }: { business: any; logoUrl?: string; siteUrl: string }) {
  if (!business) return null;
  const sameAs = [business.instagramUrl, business.facebookUrl, business.youtubeUrl].filter(Boolean);
  const data: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: business.businessName || 'Berhampur Bites',
    url: siteUrl,
  };
  if (logoUrl) data.image = logoUrl;
  if (business.phone) data.telephone = business.phone;
  if (business.address) data.address = { '@type': 'PostalAddress', streetAddress: business.address };
  if (sameAs.length) data.sameAs = sameAs;
  return data;
}

export function buildProductJsonLd({ product, imageUrl, siteUrl, slug }: { product: any; imageUrl?: string; siteUrl: string; slug: string }) {
  if (!product) return null;
  const price = product.offerPrice != null && product.offerPrice < product.regularPrice ? product.offerPrice : product.regularPrice;
  const data: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.fullDescription || undefined,
    url: `${siteUrl}/menu/${slug}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price,
      availability: product.available === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
    },
  };
  if (imageUrl) data.image = imageUrl;
  return data;
}
