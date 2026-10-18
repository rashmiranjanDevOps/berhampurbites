import Image from 'next/image';
import Link from 'next/link';
import { imgSrc, imgPos } from '@/sanity/lib/image';

/** Menu card (Home, /menu, related items). Advertisement site: no cart/+ button — every card leads to the product page. */
export default function ProductCard({ product, titleAs = 'h3' }: { product: any; titleAs?: 'h2' | 'h3' }) {
  const Title = titleAs;
  const hasOffer = product.offerPrice != null && product.offerPrice < product.regularPrice;
  const unavailable = product.available === false;
  const href = `/menu/${product.slug.current}`;
  return (
    <article className={`group relative flex flex-col bg-surface rounded-[14px] overflow-hidden shadow-card`}>
      {(unavailable || (product.badge && product.badge !== 'None')) && (
        <span className={`absolute top-2.5 left-2.5 z-10 text-white text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-chip ${unavailable ? 'bg-ink' : 'bg-red'}`}>
          {unavailable ? 'Currently Unavailable' : product.badge}
        </span>
      )}
      <Link href={href} className="block focus-ring" tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-[4/3] bg-brown-dark overflow-hidden">
          {product.mainImage && (
            <Image src={imgSrc(product.mainImage, 800)} alt={product.mainImage.alt || product.name} fill
                   sizes="(max-width: 768px) 50vw, 25vw" style={{ objectPosition: imgPos(product.mainImage) }}
                   className={`object-cover ${unavailable ? 'grayscale opacity-70' : ''} transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100`} />
          )}
        </div>
      </Link>
      <div className="flex flex-col flex-1 p-3 md:p-3.5">
        <Title className="text-[13px] md:text-sm font-semibold text-ink leading-snug">
          <Link href={href} className="hover:text-red focus-ring rounded-sm">{product.name}</Link>
        </Title>
        <p className="mt-1 text-[13px] font-semibold text-red">
          {unavailable ? <span className="text-muted">Currently unavailable</span> : (<>
            {hasOffer && <span className="text-muted line-through font-medium mr-1.5">₹{product.regularPrice}</span>}
            ₹{hasOffer ? product.offerPrice : product.regularPrice}</>)}
        </p>
        <Link href={href} className="mt-3 inline-flex items-center justify-center min-h-[44px] rounded-chip border-2 border-red text-red text-[13px] font-bold px-4 hover:bg-red hover:text-white focus-ring transition-colors">
          View Product
        </Link>
      </div>
    </article>
  );
}
