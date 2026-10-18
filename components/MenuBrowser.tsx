'use client';
import { useSearchParams } from 'next/navigation';
import FilterChips from './FilterChips';
import ProductCard from './ProductCard';
import EmptyState from './EmptyState';

export function ProductGrid({ products }: { products: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((p) => <ProductCard key={p._id} product={p} titleAs="h2" />)}
    </div>
  );
}

/** Menu with instant category filtering. The page itself is pre-built and cached; only the filter runs in the browser. */
export default function MenuBrowser({ products, categories }: { products: any[]; categories: any[] }) {
  const active = useSearchParams().get('category') || '';
  const filtered = active ? products.filter((p) => p.category?.slug === active) : products;
  return (
    <>
      <FilterChips basePath="/menu" active={active} options={categories.map((c) => ({ label: c.title, value: c.slug.current }))} />
      {filtered.length > 0
        ? <ProductGrid products={filtered} />
        : <EmptyState message={products.length === 0 ? 'Menu coming soon.' : 'No products in this category yet.'} />}
    </>
  );
}
