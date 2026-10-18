'use client';
import { useEffect } from 'react';
import Link from 'next/link';

/** Shown if something fails while loading a page (for example, the content service is briefly unreachable). */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <section className="max-w-site mx-auto px-5 md:px-8 py-20 md:py-28 text-center">
      <span className="eyebrow-plain">Something went wrong</span>
      <h1 className="h-serif text-4xl md:text-5xl mt-2">We&apos;ll be right <span className="text-red">back</span></h1>
      <p className="text-muted mt-4 max-w-md mx-auto">This page couldn&apos;t load just now. Please try again in a moment.</p>
      <div className="mt-8 flex gap-3 justify-center flex-wrap">
        <button type="button" onClick={reset} className="btn-primary min-h-[44px]">Try again</button>
        <Link href="/" className="btn-outline text-ink min-h-[44px]">Back to Home</Link>
      </div>
    </section>
  );
}
