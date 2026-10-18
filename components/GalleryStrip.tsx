import Image from 'next/image';
import Link from 'next/link';
import { imgSrc, imgPos } from '@/sanity/lib/image';

export default function GalleryStrip({ items }: { items: any[] }) {
  if (!items?.length) return null;
  return (
    <section aria-labelledby="gal-h" className="max-w-site mx-auto px-5 md:px-8 py-8 md:py-12">
      <div className="flex items-end justify-between mb-4 gap-4">
        <div><span className="eyebrow-plain">Our Gallery</span><h2 id="gal-h" className="h-serif text-3xl md:text-[40px] mt-1">Moments of <span className="text-red">Great Food</span></h2></div>
        <Link href="/gallery" className="inline-flex items-center min-h-[44px] text-[13px] font-semibold text-red hover:text-red-dark focus-ring rounded-sm whitespace-nowrap">View Gallery <span aria-hidden className="ml-1.5">→</span></Link>
      </div>
      <ul tabIndex={0} aria-label="Gallery photos (scroll sideways)" className="focus-ring flex md:grid md:grid-cols-5 gap-2 md:gap-3 overflow-x-auto md:overflow-visible no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 snap-x">
        {items.slice(0, 5).map((g) => (
          <li key={g._id} className="relative flex-shrink-0 w-[46%] md:w-auto aspect-[4/3] snap-start overflow-hidden rounded-[10px] bg-brown-darker">
            <Image src={imgSrc(g.image, 700)} alt={g.image?.alt || g.caption || 'Berhampur Bites'} fill sizes="(max-width: 768px) 46vw, 20vw"
                   style={{ objectPosition: imgPos(g.image) }}
                   className="object-cover transition-transform duration-500 hover:scale-105 motion-reduce:transition-none" />
          </li>
        ))}
      </ul>
    </section>
  );
}
