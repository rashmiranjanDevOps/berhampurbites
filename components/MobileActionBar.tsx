import { FaPhone, FaWhatsapp, FaLocationDot } from 'react-icons/fa6';
import { safeFetch } from '@/sanity/lib/client';
import { businessSettingsQuery } from '@/sanity/lib/queries';
import { buildWhatsAppUrl, telHref } from '@/sanity/lib/whatsapp';
import { safeHref } from '@/sanity/lib/safeLink';

/** Phones only: Call / WhatsApp / Directions pinned to the bottom. Each button appears only if Studio has that detail. */
export default async function MobileActionBar() {
  const b = await safeFetch(businessSettingsQuery);
  const wa = buildWhatsAppUrl(b?.whatsapp, b?.whatsappMessage);
  const items = [
    telHref(b?.phone) && { href: telHref(b.phone) as string, label: 'Call', Icon: FaPhone, ext: false },
    wa && { href: wa, label: 'WhatsApp', Icon: FaWhatsapp, ext: true },
    safeHref(b?.googleMapsUrl) && { href: safeHref(b?.googleMapsUrl) as string, label: 'Directions', Icon: FaLocationDot, ext: true },
  ].filter(Boolean) as { href: string; label: string; Icon: any; ext: boolean }[];
  if (!items.length) return null;
  return (
    <>
      <div aria-hidden className="md:hidden" style={{ height: 'calc(56px + env(safe-area-inset-bottom, 0px))' }} />
      <nav aria-label="Quick contact" className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-line shadow-floating"
           style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <ul className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {items.map(({ href, label, Icon, ext }) => (
            <li key={label}>
              <a href={href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                 className="flex flex-col items-center justify-center gap-1 min-h-[56px] text-[11px] font-semibold text-ink active:bg-cream focus-ring">
                <Icon aria-hidden className="text-red text-lg" />{label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
