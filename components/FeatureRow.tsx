/** Optional highlights from Studio → Homepage → Features (only the enabled ones). */
export default function FeatureRow({ features }: { features?: any[] }) {
  const items = (features || []).filter((f) => f.enabled !== false && f.title);
  if (!items.length) return null;
  return (
    <section aria-label="Highlights" className="max-w-site mx-auto px-5 md:px-8 py-6 md:py-8">
      <ul className={`grid grid-cols-2 ${items.length >= 4 ? 'md:grid-cols-4' : items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 text-center`}>
        {items.map((f, i) => (
          <li key={i}>
            <span aria-hidden className="block w-3 h-3 rounded-full bg-yellow mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-ink">{f.title}</h3>
            {f.description && <p className="text-[13px] text-muted mt-1">{f.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
