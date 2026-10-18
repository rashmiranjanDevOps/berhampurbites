import Image from 'next/image';
import Link from 'next/link';
import { imgSrc, imgPos } from '@/sanity/lib/image';
import { safeHref } from '@/sanity/lib/safeLink';

/** Homepage promotion — shown only when "Promo enabled" is on in Studio → Homepage. */
export default function PromoBanner({ home }: { home: any }) {
  if (!home?.promoEnabled || !(home.promoHeading || home.promoDescription)) return null;
  const link = safeHref(home.promoButtonLink);
  const external = /^(https?:|tel:|mailto:)/i.test(link || '');
  return (
    <section aria-labelledby="promo-h" className="max-w-site mx-auto px-5 md:px-8 py-6 md:py-10">
      <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-red to-red-dark text-white grid md:grid-cols-[1.2fr_0.8fr] gap-6 items-center p-7 md:p-12">
        <div className="relative z-10">
          <span className="font-script text-2xl text-yellow block leading-none">Special offer</span>
          <h2 id="promo-h" className="font-display font-bold text-3xl md:text-5xl leading-tight mt-1">{home.promoHeading}</h2>
          {home.promoDescription && <p className="mt-3 text-white/90 max-w-md text-[15px]">{home.promoDescription}</p>}
          {link && home.promoButtonLabel && (
            external ? (
              <a href={link} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center min-h-[44px] mt-6 bg-white text-red px-6 py-3 rounded-chip font-bold text-sm hover:bg-cream focus-ring">
                {home.promoButtonLabel} <span aria-hidden className="ml-2">→</span>
              </a>
            ) : (
              <Link href={link}
                    className="inline-flex items-center min-h-[44px] mt-6 bg-white text-red px-6 py-3 rounded-chip font-bold text-sm hover:bg-cream focus-ring">
                {home.promoButtonLabel} <span aria-hidden className="ml-2">→</span>
              </Link>
            )
          )}
        </div>
        {home.promoImage && (
          <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden bg-black/10">
            <Image src={imgSrc(home.promoImage, 700)} alt={home.promoImage.alt || home.promoHeading || ''} fill sizes="(max-width: 768px) 100vw, 35vw" style={{ objectPosition: imgPos(home.promoImage) }} className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
