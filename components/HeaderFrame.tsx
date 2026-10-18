'use client';
import { useEffect, useState } from 'react';

/**
 * Isolates ONLY the header's scroll-elevation state so the rest of Header
 * (logo/nav/WhatsApp — all the CMS data fetching) stays a Server Component.
 *
 * Deliberately does NOT change header height/padding on scroll — only
 * background/shadow — so this can never cause layout shift, regardless of
 * how `position: sticky` reserves flow space. Scroll handling is passive
 * and throttled to one update per animation frame to avoid layout
 * thrashing. Uses a `data-scrolled` attribute (not inline styles) so the
 * actual transition is plain CSS.
 */
export default function HeaderFrame({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 8);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update(); // set correct initial state (e.g. mid-scroll page reload)
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-50 bg-cream border-b border-transparent transition-[box-shadow,border-color] duration-300 motion-reduce:transition-none data-[scrolled=true]:shadow-header data-[scrolled=true]:border-line"
    >
      {children}
    </header>
  );
}
