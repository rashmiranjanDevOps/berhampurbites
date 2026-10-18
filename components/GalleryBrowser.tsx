'use client';
import { useSearchParams } from 'next/navigation';
import FilterChips from './FilterChips';
import GalleryGrid from './GalleryGrid';
import EmptyState from './EmptyState';

// Must match the category list in the Gallery Item schema.
export const GALLERY_CATEGORIES = ['Food', 'Outlet', 'Behind the Scenes'];

export default function GalleryBrowser({ items }: { items: any[] }) {
  const active = useSearchParams().get('category') || '';
  const filtered = active ? items.filter((i) => i.category === active) : items;
  return (
    <>
      <FilterChips basePath="/gallery" active={active} options={GALLERY_CATEGORIES.map((c) => ({ label: c, value: c }))} />
      {filtered.length > 0
        ? <GalleryGrid items={filtered} />
        : <EmptyState message={items.length === 0 ? 'More moments coming soon.' : 'No photos in this category yet.'} />}
    </>
  );
}
