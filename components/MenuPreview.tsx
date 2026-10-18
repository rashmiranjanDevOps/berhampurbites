import Link from 'next/link';
import ProductCard from './ProductCard';

export default function MenuPreview({ products }: { products: any[] }) {
  if (!products?.length) return null;
  return (
    <section aria-labelledby="menu-h" className="max-w-site mx-auto px-5 md:px-8 py-8 md:py-12">
      <div className="flex items-end justify-between gap-4 mb-5 flex-wrap">
        <div className="md:flex md:items-end md:gap-5">
          <div>
            <span className="eyebrow-plain">Explore Our</span>
            <h2 id="menu-h" className="h-serif text-4xl md:text-5xl text-red">Menu</h2>
          </div>
          <p className="hidden md:block text-[13px] text-muted pb-1.5">A wide range of delicious dishes, from flavourful biryanis to tasty rolls, snacks and more.</p>
        </div>
        <Link href="/menu" className="inline-flex items-center min-h-[44px] text-[13px] font-semibold text-red hover:text-red-dark focus-ring rounded-sm">View Full Menu <span aria-hidden className="ml-1.5">→</span></Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </section>
  );
}
