'use client';
import { useCallback, useState } from 'react';
import { FaLocationDot, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import Modal from './Modal';

/**
 * "Find Us" / "View Map" button. The map is NOT on the page — it is only created (and only downloaded)
 * when a visitor taps the button, inside a popup. Renders nothing if there is no map to show.
 */
export default function MapButton({ src, directionsUrl, label = 'View Map', className = 'btn-outline text-red min-h-[44px] px-5 py-2.5 text-[13px] gap-2', icon = true }:
  { src: string | null; directionsUrl?: string | null; label?: string; className?: string; icon?: boolean }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  if (!src) return null;
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} aria-haspopup="dialog">
        {icon && <FaLocationDot aria-hidden />} {label}
      </button>
      <Modal open={open} onClose={close} label="Map showing where to find us" className="max-w-3xl">
        <div className="bg-white rounded-[14px] overflow-hidden shadow-floating">
          <iframe title="Map showing where to find us" src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen className="block w-full h-[62vh] max-h-[520px] border-0" />
          {directionsUrl && (
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-center gap-2 min-h-[48px] text-sm font-semibold text-red hover:text-red-dark focus-ring">
              Open in Google Maps <FaArrowUpRightFromSquare aria-hidden className="text-xs" />
            </a>
          )}
        </div>
      </Modal>
    </>
  );
}
