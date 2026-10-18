import Link from 'next/link';

/** Round filter buttons (All / categories). Soft navigation: no page reload, scroll position kept. */
export default function FilterChips({ basePath, options, active }: { basePath: string; options: { label: string; value: string }[]; active: string }) {
  const chip = (isActive: boolean) =>
    `flex-shrink-0 inline-flex items-center min-h-[44px] px-5 py-2.5 rounded-chip font-semibold text-sm shadow-header focus-ring ${isActive ? 'bg-red text-white' : 'bg-surface text-ink hover:text-red'}`;
  return (
    <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 mb-8" role="group" aria-label="Filter">
      <Link href={basePath} replace scroll={false} aria-current={!active ? 'true' : undefined} className={chip(!active)}>All</Link>
      {options.map((o) => (
        <Link key={o.value} href={`${basePath}?category=${encodeURIComponent(o.value)}`} replace scroll={false}
              aria-current={active === o.value ? 'true' : undefined} className={chip(active === o.value)}>{o.label}</Link>
      ))}
    </div>
  );
}
