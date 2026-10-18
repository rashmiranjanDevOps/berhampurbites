import { FaInstagram, FaFacebookF, FaYoutube, FaWhatsapp } from 'react-icons/fa6';
import { safeHref } from '@/sanity/lib/safeLink';

type Business = { businessName?: string; instagramUrl?: string; facebookUrl?: string; youtubeUrl?: string } | null;

// Official brand colours. An icon renders ONLY if its URL is filled in Studio → Business Settings
// (WhatsApp comes from the WhatsApp number). Never a "#" placeholder link.
export function buildSocials(business: Business, whatsappUrl: string | null) {
  const name = business?.businessName || 'Berhampur Bites';
  return [
    safeHref(business?.instagramUrl) && { key: 'instagram', href: safeHref(business?.instagramUrl) as string, label: `Follow ${name} on Instagram`, Icon: FaInstagram,
      bg: 'linear-gradient(45deg,#F9A02F 0%,#EE4B3B 35%,#D52D88 65%,#7A3FC4 100%)' },
    safeHref(business?.facebookUrl) && { key: 'facebook', href: safeHref(business?.facebookUrl) as string, label: `Follow ${name} on Facebook`, Icon: FaFacebookF, bg: '#1877F2' },
    safeHref(business?.youtubeUrl) && { key: 'youtube', href: safeHref(business?.youtubeUrl) as string, label: `Subscribe to ${name} on YouTube`, Icon: FaYoutube, bg: '#FF0000' },
    whatsappUrl && { key: 'whatsapp', href: whatsappUrl, label: `Chat with ${name} on WhatsApp`, Icon: FaWhatsapp, bg: '#25D366' },
  ].filter(Boolean) as { key: string; href: string; label: string; Icon: any; bg: string }[];
}

export default function SocialIcons({ business, whatsappUrl, size = 'md', className = '' }:
  { business: Business; whatsappUrl: string | null; size?: 'md' | 'lg'; className?: string }) {
  const items = buildSocials(business, whatsappUrl);
  if (!items.length) return null;
  const dim = size === 'lg' ? 'w-12 h-12 md:w-14 md:h-14 text-2xl' : 'w-11 h-11 text-lg';
  return (
    <div className={`flex gap-3 flex-wrap ${className}`}>
      {items.map(({ key, href, label, Icon, bg }) => (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={{ background: bg }}
           className={`${dim} rounded-full text-white flex items-center justify-center shadow-header transition-transform duration-300 hover:scale-110 active:scale-95 focus-ring motion-reduce:transition-none motion-reduce:hover:scale-100`}>
          <Icon aria-hidden focusable="false" />
        </a>
      ))}
    </div>
  );
}
