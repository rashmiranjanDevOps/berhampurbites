'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { imgSrc, imgPos } from '@/sanity/lib/image';
import EmptyState from './EmptyState';
import { safeHref } from '@/sanity/lib/safeLink';

type Story = {
  heading?: string;
  subheading?: string;
  bodyText?: string;
  image?: any;
  ctaLabel?: string;
  ctaLink?: string;
};

/**
 * Our Story. The big word-by-word heading is built from the Story heading typed in Studio (one line per word).
 * All text stays real HTML; animation is applied by script only to parts still below the fold, so nothing flashes
 * and nothing is hidden if scripts or animation are off.
 */
export default function StoryScroll({ story }: { story: Story }) {
  const rootRef = useRef<HTMLElement>(null);
  const wordsWrapRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const heading = story?.heading || '';
  const words = heading.trim().split(/\s+/).filter(Boolean);
  const hasImage = Boolean(story?.image);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const belowFold = (el: Element) => el.getBoundingClientRect().top >= window.innerHeight;
      const wordEls = wordsWrapRef.current?.querySelectorAll<HTMLElement>('[data-story-word]');
      wordEls?.forEach((el, i) => {
        if (!belowFold(el)) return;
        gsap.from(el, {
          autoAlpha: 0, y: 36, duration: 0.65, ease: 'power2.out', delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        });
      });
      if (bodyRef.current && belowFold(bodyRef.current)) {
        gsap.from(bodyRef.current, {
          autoAlpha: 0, y: 24, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: bodyRef.current, start: 'top 82%', toggleActions: 'play none none none' },
        });
      }
      if (imageRef.current && belowFold(imageRef.current)) {
        gsap.from(imageRef.current, {
          autoAlpha: 0, y: 24, scale: 0.96, duration: 0.75, ease: 'power2.out',
          scrollTrigger: { trigger: imageRef.current, start: 'top 82%', toggleActions: 'play none none none' },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [heading, hasImage]);

  if (!story || (!heading && !story.bodyText)) {
    return <section className="section text-center"><h1 className="font-display text-4xl font-extrabold">Our <span className="text-red">Story</span></h1><div className="mt-8"><EmptyState message="Our story is coming soon." /></div></section>;
  }

  return (
    <section ref={rootRef} className="bg-cream overflow-hidden">
      {/* Word-stack scene: one real <h1> (full text intact for screen
          readers/no-JS), each word a large display line that reveals as it
          scrolls into view. */}
      <div className="section-lg pb-0">
        <span className="eyebrow mb-4">Our Story</span>
        <h1 ref={wordsWrapRef} className="font-display font-extrabold text-ink leading-[0.95]">
          {words.map((word, i) => (
            <span key={i} data-story-word
                  className={`block text-5xl sm:text-6xl md:text-display-xl ${i === words.length - 1 ? 'text-red' : ''}`}>
              {word}
            </span>
          ))}
        </h1>
        {story?.subheading && (
          <p className="mt-6 font-display font-bold text-xl md:text-2xl text-muted max-w-xl">{story.subheading}</p>
        )}
      </div>

      {/* Content scene: actual CMS body copy + image + CTA. */}
      <div className={`section-lg pt-14 md:pt-16 grid gap-12 items-center ${hasImage ? 'md:grid-cols-2' : 'max-w-[700px]'}`}>
        <div ref={bodyRef} className={hasImage ? 'md:order-1' : ''}>
          {story?.bodyText && (
            <p className="text-body-lg text-muted leading-loose whitespace-pre-line">{story.bodyText}</p>
          )}
          {story?.ctaLabel && safeHref(story?.ctaLink) && (
            /^https?:\/\//i.test(safeHref(story?.ctaLink) as string)
              ? <a href={safeHref(story?.ctaLink) as string} target="_blank" rel="noopener noreferrer" className="btn-primary mt-7">{story.ctaLabel}</a>
              : <Link href={safeHref(story?.ctaLink) as string} className="btn-primary mt-7">{story.ctaLabel}</Link>
          )}
        </div>

        {hasImage && (
          <div ref={imageRef} className="md:order-2 relative isolate">
            {/* A 4:3 frame; the photo follows the crop/hotspot chosen in Studio. */}
            <div className="absolute inset-3 md:inset-5 bg-gradient-to-br from-brown to-brown-darker rounded-panel -z-10" aria-hidden />
            <div className="group relative aspect-[4/3] m-6 md:m-8 rounded-panel overflow-hidden">
              <Image src={imgSrc(story.image, 800)}
                     alt={story.image.alt || heading} fill sizes="(max-width: 768px) 90vw, 45vw"
                     style={{ objectPosition: imgPos(story.image) }} className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
