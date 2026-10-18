import Image from 'next/image';
import Link from 'next/link';
import { safeFetch } from '@/sanity/lib/client';
import { brandSettingsQuery, businessSettingsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { buildWhatsAppUrl } from '@/sanity/lib/whatsapp';
import { FaWhatsapp } from 'react-icons/fa6';
import NavLinks from './NavLinks';
import MobileMenu from './MobileMenu';
import HeaderFrame from './HeaderFrame';

export default async function Header() {
  const [brand, business] = await Promise.all([safeFetch(brandSettingsQuery), safeFetch(businessSettingsQuery)]);
  const businessName = business?.businessName || 'Berhampur Bites';
  const wa = buildWhatsAppUrl(business?.whatsapp, business?.whatsappMessage);
  return (
    <HeaderFrame>
      <div className="max-w-site mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 md:px-8 h-[64px] md:h-[76px]">
        <Link href="/" className="flex items-center min-h-[44px] focus-ring rounded-sm" aria-label={businessName}>
          {brand?.logo ? (
            <>
              <Image src={urlFor(brand.logo).width(200).url()} alt={brand.logo.alt || businessName} width={200} height={56}
                     className={`h-10 md:h-12 w-auto object-contain ${brand?.logoAlt ? 'hidden sm:block' : ''}`} priority />
              {brand?.logoAlt && (
                <Image src={urlFor(brand.logoAlt).width(120).url()} alt={brand.logoAlt.alt || businessName} width={120} height={44}
                       className="h-9 w-auto object-contain sm:hidden" />
              )}
            </>
          ) : (
            <span className="font-display text-xl font-extrabold text-red">{businessName}</span>
          )}
        </Link>
        <nav aria-label="Primary" className="hidden lg:flex justify-center">
          <div className="flex gap-8 text-[13px] whitespace-nowrap"><NavLinks /></div>
        </nav>
        <div className="flex items-center justify-end gap-1.5 md:gap-3 col-start-3">
          {wa && (
            <>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="hidden lg:inline-flex btn-primary min-h-[44px] px-5 py-2.5 text-[13px] gap-2 whitespace-nowrap">
                <FaWhatsapp aria-hidden className="text-base" /> Order on WhatsApp
              </a>
              <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Order on WhatsApp"
                 className="lg:hidden w-11 h-11 rounded-full flex items-center justify-center text-[#25D366] text-[28px] focus-ring">
                <FaWhatsapp aria-hidden />
              </a>
            </>
          )}
          <MobileMenu />
        </div>
      </div>
    </HeaderFrame>
  );
}
