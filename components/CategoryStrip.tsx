import Image from 'next/image';
import Link from 'next/link';
import { imgSrc, imgPos } from '@/sanity/lib/image';
import { safeHref } from '@/sanity/lib/safeLink';

type Item = { key: string; title: string; image?: any; href: string };

/**
 * The round pictures under the hero. Preferred source: Studio → Homepage Circles (you choose picture, label,
 * link, order — drag to reorder, hide or delete). If none exist yet, it falls back to your menu categories.
 */
export default function CategoryStrip({ circles, categories }: { circles?: any[]; categories?: any[] }) {
  const items: Item[] = circles?.length
    ? circles.map((c) => ({
        key: c._id, title: c.title, image: c.image,
        href: safeHref(c.customLink) || (c.categorySlug ? `/menu?category=${c.categorySlug}` : '/menu'),
      }))
    : (categories || []).map((c) => ({ key: c._id, title: c.title, image: c.image, href: `/menu?category=${c.slug}` }));
  if (!items.length) return null;

  return (
    <nav aria-label="Menu categories" className="relative max-w-site mx-auto px-5 md:px-8 pt-2 pb-8 md:pb-10">
      {/* py-3 gives the gold ring + shadow room (a scrolling box clips anything that sticks out). Phones: swipe sideways. Desktop: wraps onto more rows, so no circle is ever hidden. */}
      <ul className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 py-3 md:mx-auto md:px-0 md:overflow-visible md:flex-wrap md:justify-center md:gap-x-8 md:gap-y-5 md:max-w-[1000px]">
        {items.map((c) => {
          const external = /^https?:\/\//i.test(c.href);
          const inner = (
            <>
              <span className="relative block w-[60px] h-[60px] md:w-[92px] md:h-[92px] rounded-full overflow-hidden bg-brown-dark ring-[3px] ring-[#c8862f]/70 shadow-card">
                {c.image && <Image src={imgSrc(c.image, 240)} alt="" fill sizes="92px" style={{ objectPosition: imgPos(c.image) }}
                       className="object-cover transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none" />}
              </span>
              <span className="text-[11px] md:text-sm font-medium text-ink text-center whitespace-nowrap">{c.title}</span>
            </>
          );
          const cls = 'group flex flex-col items-center gap-2.5 min-w-[64px] md:min-w-[110px] focus-ring rounded-md';
          return (
            <li key={c.key} className="flex-shrink-0">
              {external
                ? <a href={c.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                : <Link href={c.href} className={cls}>{inner}</Link>}
            </li>
          );
        })}
      </ul>
      {/* soft fade on the right edge on phones = "there is more, swipe" */}
      <span aria-hidden className="md:hidden pointer-events-none absolute right-0 top-2 bottom-8 w-8 bg-gradient-to-l from-cream to-transparent" />
    </nav>
  );
}
