'use client';
import { usePathname } from 'next/navigation';

// The embedded Sanity Studio at /studio needs the full viewport and manages
// its own chrome entirely — wrapping it in our marketing Header/Footer would
// visually break it. Header and Footer are Server Components fetched by the
// root layout and passed in as already-rendered elements, so this wrapper
// only decides whether to include them — it doesn't refetch anything.
export default function SiteChrome({ header, footer, actionBar, children }: { header: React.ReactNode; footer: React.ReactNode; actionBar?: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio');
  if (isStudio) return <>{children}</>;
  return (
    <>
      {header}
      <main id="main-content">{children}</main>
      {footer}
      {actionBar}
    </>
  );
}
