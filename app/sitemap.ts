import type { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { allProductsQuery } from '@/sanity/lib/queries';
import { getSiteUrl } from '@/sanity/lib/siteUrl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const products = (await client.fetch(allProductsQuery)) || [];
  const now = new Date();
  const staticRoutes = ['', '/menu', '/story', '/gallery', '/outlet', '/contact'].map((p) => ({ url: `${base}${p}`, lastModified: now }));
  // Products carry their real last-edited time from Sanity.
  const productRoutes = products.filter((p: any) => p.slug?.current).map((p: any) => ({
    url: `${base}/menu/${p.slug.current}`,
    lastModified: p._updatedAt ? new Date(p._updatedAt) : now,
  }));
  return [...staticRoutes, ...productRoutes];
}
