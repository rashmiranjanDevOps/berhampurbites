import Image from 'next/image';
import Link from 'next/link';
import { imgSrc, imgPos } from '@/sanity/lib/image';
import ScriptNote from './ScriptNote';
import { safeHref } from '@/sanity/lib/safeLink';

/**
 * Signature Bite — every part is editable in Studio → Homepage → "Signature Bite — …" fields:
 * product, image (+ style), headings, description, price, handwritten note, button.
 * Fallbacks when a field is empty: product's cut-out → product's main photo; product's description; product page link.
 */
export default function SignatureBite({ home, product, brandWord }: { home: any; product: any; brandWord?: string }) {
  if (home?.signatureEnabled === false) return null;
  const own = home?.signatureImage;                         // image uploaded on the Homepage
  const cutStyle = own ? home?.signatureImageStyle !== 'photo' : !!product?.cutoutImage;
  const pic = own || product?.cutoutImage || product?.mainImage;
  if (!product && !pic) return null;

  const hasOffer = product && product.offerPrice != null && product.offerPrice < product.regularPrice;
  const text = home?.signatureDescription || product?.shortDescription || product?.fullDescription;
  const line1 = home?.signatureHeadingLine1 ?? 'Our';
  const line2 = home?.signatureHeadingLine2 ?? 'Signature Bite';
  const note = home?.signatureShowNote === false ? null : (home?.signatureNote || (brandWord ? `The Taste of ${brandWord}` : null));
  const href = safeHref(home?.signatureButtonLink) || (product?.slug?.current ? `/menu/${product.slug.current}` : null);
  const label = home?.signatureButtonLabel || 'View Product';
  const showPrice = product && home?.signatureShowPrice !== false && product.available !== false;
  const isExternal = href && /^https?:\/\//.test(href);
  // Handwritten note: its own strip above or below the picture (set in Studio), so it never covers the dish.
  const [vert, horiz] = (home?.signatureNotePosition || 'top-right').split('-') as ['top' | 'bottom', 'left' | 'center' | 'right'];
  const noteBlock = note && (
    <div className={`flex ${horiz === 'left' ? 'justify-start' : horiz === 'center' ? 'justify-center' : 'justify-end'} ${vert === 'top' ? 'mb-1' : 'mt-1'}`}>
      <ScriptNote direction={vert === 'top' ? 'down' : 'up'} align={horiz} bold={home?.signatureNoteStyle === 'bold'} size={home?.signatureNoteSize || 'medium'}>{note}</ScriptNote>
    </div>
  );

  return (
    <section aria-labelledby="signature-h" className="max-w-site mx-auto px-5 md:px-8 py-8 md:py-14 grid md:grid-cols-[0.8fr_1.2fr] gap-6 md:gap-4 items-center">
      <div className="relative z-10">
        <h2 id="signature-h" className="h-serif text-[34px] md:text-6xl">
          {line1}{line1 && <br />}<span className="text-red">{line2}</span>
        </h2>
        {text && <p className="mt-4 text-[14px] md:text-base text-muted max-w-[340px]">{text}</p>}
        {showPrice && (
          <p className="mt-4 font-display text-2xl font-bold text-ink">
            {hasOffer && <span className="text-muted line-through text-base font-medium mr-2">₹{product.regularPrice}</span>}
            ₹{hasOffer ? product.offerPrice : product.regularPrice}
            <span className="text-sm font-body font-medium text-muted ml-3">{product.name}</span>
          </p>
        )}
        <div className="mt-5 flex items-center gap-6 flex-wrap">
          {href && (isExternal
            ? <a href={href} target="_blank" rel="noopener noreferrer" className="btn-primary min-h-[44px] px-5 py-2.5 text-[13px]">{label} <span aria-hidden>→</span></a>
            : <Link href={href} className="btn-primary min-h-[44px] px-5 py-2.5 text-[13px]">{label} <span aria-hidden>→</span></Link>)}
          <Link href="/menu" className="inline-flex items-center min-h-[44px] font-semibold text-ink hover:text-red focus-ring rounded-sm">View all <span aria-hidden className="ml-2">→</span></Link>
        </div>
      </div>
      <div>
        {vert === 'top' && noteBlock}
        <div className="relative">
        <svg aria-hidden viewBox="0 0 640 440" className="absolute inset-0 w-full h-full text-yellow" preserveAspectRatio="none">
          <path fill="currentColor" d="M52 120C86 44 190 22 290 44c84 18 132-24 226 4 82 24 126 94 112 178-12 76-72 130-158 148-86 18-140-22-218-14-92 10-170 44-214-22C-6 300 8 190 52 120z" />
        </svg>
        <div className={`relative aspect-[4/3] mx-auto ${cutStyle ? 'w-[92%] md:w-[88%]' : 'w-[80%] md:w-[76%] my-[4%]'}`}>
          {pic && (
            <Image src={imgSrc(pic, 1600)} alt={pic.alt || product?.name || 'Signature dish'} fill sizes="(max-width: 768px) 92vw, 55vw"
                   style={{ objectPosition: imgPos(pic) }}
                   className={cutStyle ? 'object-contain drop-shadow-[0_18px_24px_rgba(43,27,18,0.4)]' : 'object-cover rounded-[14px] shadow-floating'} />
          )}
        </div>
        </div>
        {vert === 'bottom' && noteBlock}
      </div>
    </section>
  );
}
