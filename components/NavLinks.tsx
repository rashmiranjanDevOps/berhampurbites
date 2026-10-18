'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/story', label: 'Our Story' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/outlet', label: 'Our Outlet' },
  { href: '/contact', label: 'Contact Us' },
];

export default function NavLinks({ mobile, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {links.map((l) => {
        const active = l.href === '/' ? pathname === '/' : pathname?.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={
                  mobile
                    ? `block py-3.5 px-1 border-b border-line font-semibold focus-ring ${active ? 'text-red' : ''}`
                    : `nav-link ${active ? 'nav-link-active' : ''}`
                }>
            {l.label}
          </Link>
        );
      })}
    </>
  );
}
