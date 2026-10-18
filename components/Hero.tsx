'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { imgSrc, imgPos } from '@/sanity/lib/image';
import TornEdge from './TornEdge';
import MapButton from './MapButton';
import { safeHref } from '@/sanity/lib/safeLink';

/**
 * Hero: the uploaded photo is the whole scene (recommended 1920x1080, 16:9). The section is always full width and
 * exactly 16:9 high, so the photo is never cropped or squeezed (no min/max height on it).
 * Desktop: headline sits over the photo (left or right, with an adjustable soft fade) — or, in "above" mode, on its own
 * dark band with the whole photo underneath. All three are chosen in Studio → Homepage.
 * Mobile: headline on dark, then the full 16:9 photo underneath — nothing cropped.
 * Subtle scroll parallax only; skipped under prefers-reduced-motion.
 */
export default function Hero({ home, mapSrc, directionsUrl }: { home: any; mapSrc?: string | null; directionsUrl?: string | null }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !sectionRef.current || !imageRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, { scale: 1.04, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const img = home?.heroImage;
  // Studio → Homepage: where the headline sits, and how strongly the photo is darkened behind it.
  const position: 'left' | 'right' | 'above' = home?.heroTextPosition === 'right' ? 'right' : home?.heroTextPosition === 'above' ? 'above' : 'left';
  const above = position === 'above';
  const strengths: Record<string, [number, number]> = { none: [0, 0], light: [0.55, 0.2], medium: [0.75, 0.35], strong: [0.88, 0.45] };
  const [a1, a2] = strengths[home?.heroOverlay as string] || strengths.light;
  const fade = `linear-gradient(to ${position === 'right' ? 'left' : 'right'}, rgba(26,14,7,${a1}) 0%, rgba(26,14,7,${a2}) 55%, rgba(26,14,7,0) 100%)`;
  return (
    <section ref={sectionRef} className={`relative overflow-hidden bg-[#1a0e07] text-white flex flex-col ${above ? '' : 'md:block'} ${img ? '' : 'md:min-h-[520px]'}`}>
      {/* Photo — shown whole at its own 16:9 shape. "Above" mode and phones: text first, photo underneath. */}
      {img && (
        <div ref={imageRef} className={`relative aspect-[16/9] order-2 ${above ? '' : 'md:order-none'}`}>
          <Image src={imgSrc(img, 1920)} alt={img.alt || 'Berhampur Bites'} fill priority sizes="100vw"
                 style={{ objectPosition: imgPos(img) }} className="object-cover" />
          {!above && a1 > 0 && (
            <div aria-hidden className={`hidden md:block absolute inset-y-0 w-[62%] ${position === 'right' ? 'right-0' : 'left-0'}`} style={{ background: fade }} />
          )}
          <div aria-hidden className={`${above ? '' : 'md:hidden'} absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#1a0e07] to-transparent`} />
        </div>
      )}
      <div className={`relative z-10 order-1 ${above ? '' : 'md:absolute md:inset-0 md:flex md:items-center'}`}>
        <div className={`max-w-site mx-auto w-full px-5 md:px-8 pt-8 pb-5 ${above ? 'md:pt-12 md:pb-10' : 'md:py-0'} ${!above && a1 > 0 ? 'md:[text-shadow:0_2px_18px_rgba(0,0,0,0.55)]' : ''} ${position === 'right' ? 'md:flex md:justify-end' : ''}`}>
          <div className="max-w-[560px]">
            {home?.heroBadge && <span className="font-script text-2xl md:text-3xl text-yellow block mb-1">{home.heroBadge}</span>}
            <h1 className="font-display font-semibold text-[42px] leading-[1.02] sm:text-6xl lg:text-[80px] tracking-tight">
              <span className="block">{home?.heroHeadingLine1 || 'Good Food.'}</span>
              <span className="block text-yellow">{home?.heroHeadingLine2 || 'Good Mood.'}</span>
            </h1>
            {home?.heroSubheading && <p className="mt-4 md:mt-5 text-[15px] md:text-lg text-white/90 max-w-[420px]">{home.heroSubheading}</p>}
            <div className="flex gap-3 flex-wrap mt-6 md:mt-8">
              <Link href={safeHref(home?.heroCta1Link) || '/menu'} className="btn-primary min-h-[44px] px-6 py-3">{home?.heroCta1Label || 'View Full Menu'} <span aria-hidden>→</span></Link>
              {home?.heroCta2Enabled === true && (mapSrc
                // "Find Us" opens the map in a popup — the map is never on the page itself.
                ? <MapButton src={mapSrc} directionsUrl={directionsUrl} label={home?.heroCta2Label || 'Find Us'} icon={false} className="btn-outline text-white min-h-[44px]" />
                : <Link href={safeHref(home?.heroCta2Link) || '/outlet'} className="btn-outline text-white min-h-[44px]">{home?.heroCta2Label || 'Find Us'}</Link>)}
            </div>
          </div>
        </div>
      </div>
      <TornEdge className="absolute bottom-0 inset-x-0 z-20 -mb-px" />
    </section>
  );
}
