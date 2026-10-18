'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { imgSrc, imgPos } from '@/sanity/lib/image';
import { telHref } from '@/sanity/lib/whatsapp';
import OpenBadge from './OpenBadge';
import MapButton from './MapButton';
import EmptyState from './EmptyState';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Outlet = {
  name: string;
  address?: string;
  phone?: string;
  openingHours?: string;
  mapsUrl?: string;
  exteriorImage?: any;
  interiorImages?: any[];
};

/**
 * Our Outlet page. The parent page (app/outlet/page.tsx) decides what to show for a "Coming Soon" outlet, so this
 * component is only used for an open outlet. The map is NOT on the page: it opens in a popup from "View Map".
 */
export default function OutletExperience({ outlet, whatsappUrl, mapSrc }: { outlet: Outlet; whatsappUrl: string | null; mapSrc: string | null }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Only elements still below the fold are animated, so nothing on screen ever flashes.
      const belowFold = (el: HTMLElement) => el.getBoundingClientRect().top >= window.innerHeight;
      rootRef.current!.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        if (!belowFold(el)) return;
        gsap.from(el, {
          autoAlpha: 0, y: 26, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        });
      });
      rootRef.current!.querySelectorAll<HTMLElement>('[data-reveal-tile]').forEach((el, i) => {
        if (!belowFold(el)) return;
        gsap.from(el, {
          autoAlpha: 0, y: 20, scale: 0.97, duration: 0.6, ease: 'power2.out', delay: (i % 4) * 0.06,
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [outlet]);

  const infoItems: { label: string; content: React.ReactNode }[] = [];
  if (outlet.address) infoItems.push({ label: 'Visit Us', content: <span className="whitespace-pre-line">{outlet.address}</span> });
  if (outlet.openingHours) infoItems.push({ label: 'Opening Hours', content: <><span className="whitespace-pre-line block">{outlet.openingHours}</span><OpenBadge hours={outlet.openingHours} className="mt-2" /></> });
  if (outlet.phone) infoItems.push({ label: 'Call Us', content: <a href={telHref(outlet.phone) || undefined} className="inline-block py-3 text-ink font-semibold focus-ring rounded-sm">{outlet.phone}</a> });

  return (
    <section ref={rootRef} className="bg-cream overflow-hidden">
      {/* Scene 1 — introduction */}
      <div className="section-lg pb-8 md:pb-10 text-center" data-reveal>
        <span className="eyebrow mb-4">Our Outlet</span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-display-xl text-ink">{outlet.name}</h1>
        <p className="text-body-lg text-muted mt-3 max-w-lg mx-auto">Come experience {outlet.name} in person.</p>
      </div>

      {/* Scene 2 — exterior */}
      {outlet.exteriorImage && (
        <div className="section-lg py-0 md:py-0">
          <div data-reveal className="group relative rounded-panel overflow-hidden aspect-[4/3] max-w-3xl mx-auto">
            <Image src={imgSrc(outlet.exteriorImage, 1200)}
                   alt={outlet.exteriorImage.alt || outlet.name} fill priority
                   sizes="(max-width: 768px) 100vw, 900px" style={{ objectPosition: imgPos(outlet.exteriorImage) }} className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100" />
          </div>
        </div>
      )}

      {/* Scene 3 — interior gallery */}
      <div className="section-lg">
        <h2 data-reveal className="font-display text-2xl md:text-display-md font-extrabold mb-6 text-center">A Look Inside</h2>
        {outlet.interiorImages && outlet.interiorImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {outlet.interiorImages.map((img, i) => {
              return (
                <div key={i} data-reveal-tile
                     className="group relative aspect-[4/3] rounded-[12px] overflow-hidden">
                  <Image src={imgSrc(img, 800)}
                         alt={img.alt || `${outlet.name} interior`} fill loading="lazy"
                         sizes="(max-width: 768px) 50vw, 33vw" style={{ objectPosition: imgPos(img) }} className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100" />
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState message="More photos coming soon." />
        )}
      </div>

      {/* Scene 4 — practical info + Scene 5 — CTA */}
      <div className="section-lg pt-8 md:pt-10">
        <div data-reveal className="max-w-2xl mx-auto text-center">
          {infoItems.length > 0 && (
            <dl className="grid sm:grid-cols-2 gap-6 mb-8 text-left">
              {infoItems.map((item) => (
                <div key={item.label} className="card p-5">
                  <dt className="font-display font-bold text-sm text-red mb-1">{item.label}</dt>
                  <dd className="text-muted">{item.content}</dd>
                </div>
              ))}
            </dl>
          )}

          {(outlet.mapsUrl || whatsappUrl || mapSrc) && (
            <div className="flex gap-4 flex-wrap justify-center">
              {outlet.mapsUrl && (
                <a href={outlet.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">Get Directions</a>
              )}
              <MapButton src={mapSrc} directionsUrl={outlet.mapsUrl} label="View Map" className="btn-outline text-ink min-h-[44px] gap-2" />
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-ink">Order on WhatsApp</a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
