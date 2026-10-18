import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="max-w-site mx-auto px-5 md:px-8 py-20 md:py-28 text-center">
      <span className="eyebrow-plain">Error 404</span>
      <h1 className="h-serif text-4xl md:text-6xl mt-2">This page <span className="text-red">isn&apos;t on the menu</span></h1>
      <p className="text-muted mt-4 max-w-md mx-auto">The page you were looking for has moved or doesn&apos;t exist. Let&apos;s get you back to the good stuff.</p>
      <div className="mt-8 flex gap-3 justify-center flex-wrap">
        <Link href="/" className="btn-primary min-h-[44px]">Back to Home</Link>
        <Link href="/menu" className="btn-outline text-ink min-h-[44px]">View Menu</Link>
      </div>
    </section>
  );
}
