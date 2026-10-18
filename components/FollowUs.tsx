import SocialIcons, { buildSocials } from './SocialIcons';

type Business = { businessName?: string; instagramUrl?: string; facebookUrl?: string; youtubeUrl?: string } | null;

/** "Stay Connected" banner. Hidden entirely if no social link or WhatsApp number is configured. */
export default function FollowUs({ business, whatsappUrl }: { business: Business; whatsappUrl: string | null }) {
  const businessName = business?.businessName || 'Berhampur Bites';
  if (!buildSocials(business, whatsappUrl).length) return null;
  return (
    <div className="relative overflow-hidden bg-[#f7ecda]">
      {/* decorative spices/leaves (aria-hidden) */}
      <svg aria-hidden viewBox="0 0 160 120" className="hidden md:block absolute left-0 bottom-0 w-40 opacity-80">
        <ellipse cx="40" cy="96" rx="34" ry="14" fill="#e8dcc4" /><ellipse cx="40" cy="90" rx="26" ry="10" fill="#f4ead2" />
        <path d="M78 104c10-30 32-44 60-46-4 26-26 44-60 46z" fill="#6f8f3e" /><path d="M84 100c14-16 30-28 48-36" stroke="#4d6b28" strokeWidth="2" fill="none" />
      </svg>
      <svg aria-hidden viewBox="0 0 160 120" className="hidden md:block absolute right-0 bottom-0 w-40 opacity-90">
        <circle cx="112" cy="84" r="34" fill="#e0902b" /><circle cx="104" cy="76" r="22" fill="#eeaa44" />
        <path d="M30 100c8-24 26-36 52-38-2 22-22 38-52 38z" fill="#6f8f3e" />
      </svg>
      <div className="relative max-w-site mx-auto px-5 md:px-8 py-9 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="md:ml-24">
          <span className="font-script text-2xl text-red block leading-none">Follow us</span>
          <h2 className="h-serif text-3xl md:text-4xl mt-1">Stay Connected</h2>
          <p className="text-[13px] text-muted mt-2 max-w-sm">Follow {businessName} on social media for updates, new dishes and behind-the-scenes moments.</p>
        </div>
        <SocialIcons business={business} whatsappUrl={whatsappUrl} size="lg" className="md:mr-24" />
      </div>
    </div>
  );
}
