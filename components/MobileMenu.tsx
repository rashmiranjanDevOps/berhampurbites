'use client';
import { useEffect, useState } from 'react';
import NavLinks from './NavLinks';
import { FaBars, FaXmark } from 'react-icons/fa6';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="flex items-center justify-center w-11 h-11 -mr-1 text-2xl text-red focus-ring rounded-sm">
        {open ? <FaXmark aria-hidden /> : <FaBars aria-hidden />}
      </button>
      {open && (
        <nav aria-label="Primary" className="absolute top-full left-0 right-0 bg-cream shadow-floating border-t border-line px-5 py-2 z-40">
          <NavLinks mobile onNavigate={() => setOpen(false)} />
        </nav>
      )}
    </div>
  );
}
