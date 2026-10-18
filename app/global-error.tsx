'use client';

/** Last-resort page: shown only if the page frame itself breaks. Must supply its own <html>/<body>. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#FCF3E4', color: '#2B1B12', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ maxWidth: 560, margin: '0 auto', padding: '96px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#CC281C', fontWeight: 700 }}>Something went wrong</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 40, margin: '8px 0 12px' }}>We&apos;ll be right back</h1>
          <p style={{ color: '#7A6455' }}>This page couldn&apos;t load just now. Please try again in a moment.</p>
          <button type="button" onClick={reset} style={{ marginTop: 24, minHeight: 44, padding: '10px 24px', borderRadius: 999, border: 0, background: '#CC281C', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Try again</button>
        </main>
      </body>
    </html>
  );
}
