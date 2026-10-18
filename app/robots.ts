import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/sanity/lib/siteUrl';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/studio' },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
