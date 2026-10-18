'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { imgSrc, imgPos, imgRatio } from '@/sanity/lib/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type GalleryItem = { _id: string; image: any; caption?: string; category: string };

/**
 * Masonry that keeps YOUR order: photos are dealt out left-to-right, each into the currently shortest column,
 * so the order you drag in Studio is the order people read. Every tile keeps its photo's own shape (after the
 * Studio crop). Three column counts are rendered and CSS shows the right one (2 / 3 / 4 columns).
 */
function deal(items: GalleryItem[], n: number) {
  const cols: GalleryItem[][] = Array.from({ length: n }, () => []);
  const heights = Array(n).fill(0);
  items.forEach((it) => {
    const k = heights.indexOf(Math.min(...heights));
    cols[k].push(it);
    heights[k] += 1 / imgRatio(it.image);
  });
  return cols;
}

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Only tiles that are visible AND still below the fold get the reveal — nothing on screen ever flashes.
      rootRef.current!.querySelectorAll<HTMLElement>('[data-tile]').forEach((el, i) => {
        if (el.offsetParent === null || el.getBoundingClientRect().top < window.innerHeight) return;
        gsap.from(el, {
          autoAlpha: 0, y: 22, scale: 0.97, duration: 0.55, ease: 'power2.out', delay: (i % 4) * 0.05,
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [items]);

  const tile = (item: GalleryItem) => (
    <div key={item._id} data-tile style={{ aspectRatio: imgRatio(item.image) }}
         className="group relative rounded-[12px] overflow-hidden bg-brown-darker">
      <Image src={imgSrc(item.image, 800)} alt={item.image.alt || item.caption || ''} fill loading="lazy"
             sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" style={{ objectPosition: imgPos(item.image) }}
             className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
      {item.caption && (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent text-white text-xs font-medium px-3 py-2.5">{item.caption}</span>
      )}
    </div>
  );
  const layout = (n: number, cls: string) => (
    <div className={`${cls} gap-3 md:gap-4 items-start`}>
      {deal(items, n).map((col, i) => <div key={i} className="flex-1 min-w-0 flex flex-col gap-3 md:gap-4">{col.map(tile)}</div>)}
    </div>
  );

  return (
    <div ref={rootRef}>
      {layout(2, 'flex md:hidden')}
      {layout(3, 'hidden md:flex lg:hidden')}
      {layout(4, 'hidden lg:flex')}
    </div>
  );
}
