import Image from 'next/image';
import { FaLocationDot, FaPhone, FaClock, FaWhatsapp } from 'react-icons/fa6';
import { telHref } from '@/sanity/lib/whatsapp';
import { imgSrc, imgPos } from '@/sanity/lib/image';
import OpenBadge from './OpenBadge';
import MapButton from './MapButton';
import { safeHref } from '@/sanity/lib/safeLink';

export default function OutletSection({ outlet, business, whatsappUrl, mapSrc }: { outlet: any; business: any; whatsappUrl: string | null; mapSrc: string | null }) {
  if (!outlet) return null;
  const soon = outlet.status === 'coming_soon'; // schema rule: no address/hours/map while Coming Soon
  const address = soon ? null : outlet.address || business?.address;
  const phone = soon ? null : outlet.phone || business?.phone;
  const maps = soon ? null : safeHref(outlet.mapsUrl) || safeHref(business?.googleMapsUrl);
  const hours = soon ? null : outlet.openingHours;
  const interiors = (outlet.interiorImages || []).slice(0, 2);
  const rows = [
    address && { Icon: FaLocationDot, text: address },
    phone && { Icon: FaPhone, text: phone, href: telHref(phone) || undefined },
    hours && { Icon: FaClock, text: hours },
  ].filter(Boolean) as { Icon: any; text: string; href?: string }[];
  return (
    <section aria-labelledby="outlet-h" className="max-w-site mx-auto px-5 md:px-8 py-10 md:py-14">
      <div className="grid md:grid-cols-[0.7fr_1.3fr] gap-6 md:gap-8 items-start">
        <div>
          <span className="eyebrow-plain">Our Outlet</span>
          <h2 id="outlet-h" className="h-serif text-3xl md:text-[40px] mt-1">Visit Our Outlet</h2>
          {soon && <p className="mt-2 text-sm font-semibold text-red">Coming soon — details will appear here once we open.</p>}
          {hours && <OpenBadge hours={hours} className="mt-3" />}
          <ul className="mt-5 space-y-3">
            {rows.map(({ Icon, text, href }, i) => (
              <li key={i} className="flex gap-3 text-[14px] text-ink"><Icon aria-hidden className="text-red mt-1 flex-shrink-0" />
                {href ? <a href={href} className="hover:text-red">{text}</a> : <span className="whitespace-pre-line">{text}</span>}</li>
            ))}
          </ul>
          <div className="mt-6 flex gap-3 flex-wrap">
            {maps && <a href={maps} target="_blank" rel="noopener noreferrer" className="btn-primary min-h-[44px] px-5 py-2.5 text-[13px]">Get Directions <span aria-hidden>→</span></a>}
            {!soon && <MapButton src={mapSrc} directionsUrl={maps} label="View Map" />}
            {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-red min-h-[44px] px-5 py-2.5 text-[13px] gap-2"><FaWhatsapp aria-hidden /> Chat on WhatsApp</a>}
          </div>
        </div>
        {outlet.exteriorImage && (
          <div className={`grid gap-3 items-start ${interiors.length ? 'grid-cols-[2fr_1fr]' : 'grid-cols-1'}`}>
            <div className="relative aspect-[4/3] rounded-[10px] overflow-hidden bg-brown-darker">
              <Image src={imgSrc(outlet.exteriorImage, 1200)} alt={outlet.exteriorImage.alt || outlet.name || 'Outlet'} fill sizes="(max-width: 768px) 66vw, 45vw"
                     style={{ objectPosition: imgPos(outlet.exteriorImage) }} className="object-cover" />
            </div>
            {interiors.length > 0 && (
              <div className="grid gap-3">
                {interiors.map((img: any, i: number) => (
                  <div key={i} className="relative aspect-[4/3] rounded-[10px] overflow-hidden bg-brown-darker">
                    <Image src={imgSrc(img, 600)} alt={img.alt || 'Outlet interior'} fill sizes="(max-width: 768px) 33vw, 20vw"
                           style={{ objectPosition: imgPos(img) }} className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
