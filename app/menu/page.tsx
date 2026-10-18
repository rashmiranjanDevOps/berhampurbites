import type { Metadata } from 'next';
import { Suspense } from 'react';
import { client } from '@/sanity/lib/client';
import { allProductsQuery, allCategoriesQuery } from '@/sanity/lib/queries';
import MenuBrowser, { ProductGrid } from '@/components/MenuBrowser';
import EmptyState from '@/components/EmptyState';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Menu',
  description: 'The full Berhampur Bites menu — fresh, flavourful food with prices.',
  alternates: { canonical: '/menu' },
};

export default async function MenuPage() {
  const [products, categories] = await Promise.all([client.fetch(allProductsQuery), client.fetch(allCategoriesQuery)]);
  return (
    <section className="section">
      <h1 className="font-display text-4xl md:text-display-lg font-extrabold">Our <span className="text-red">Menu</span></h1>
      <p className="text-body-lg text-muted mb-8 mt-1">Delicious food made for big cravings.</p>
      {/* The fallback is the complete menu, so search engines and slow phones see everything immediately. */}
      <Suspense fallback={products.length ? <ProductGrid products={products} /> : <EmptyState message="Menu coming soon." />}>
        <MenuBrowser products={products} categories={categories} />
      </Suspense>
    </section>
  );
}
