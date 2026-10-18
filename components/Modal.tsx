'use client';
import { useEffect, useRef } from 'react';
import { FaXmark } from 'react-icons/fa6';

/**
 * Accessible popup: locks page scroll, moves focus inside, keeps Tab inside, closes on Escape / backdrop /
 * ✕ button, and puts focus back where it was. Used by the map popup and the product-photo zoom.
 */
export default function Modal({ open, onClose, label, children, className = 'max-w-3xl' }:
  { open: boolean; onClose: () => void; label: string; children: React.ReactNode; className?: string }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const items = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])');
      if (!items || !items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; previous?.focus(); };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={label} onClick={onClose}
         className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div ref={panelRef} onClick={(e) => e.stopPropagation()} className={`relative w-full ${className}`}>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close"
                className="absolute -top-3 -right-3 z-10 w-11 h-11 rounded-full bg-white text-ink shadow-floating flex items-center justify-center focus-ring">
          <FaXmark aria-hidden />
        </button>
        {children}
      </div>
    </div>
  );
}
