'use client';
import { useState } from 'react';
import Image from 'next/image';
import { imgSrc } from '@/sanity/lib/image';
import { FaMagnifyingGlassPlus } from 'react-icons/fa6';
import Modal from './Modal';

/** Product photos: shown whole (never cropped) in a 4:3 frame; click the photo to zoom; thumbnails switch photos. */
export default function ProductGallery({ images, productName }: { images: any[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const active = images[activeIndex] || images[0];

  return (
    <div>
      <button type="button" onClick={() => setZoom(true)} aria-label={`Zoom photo of ${productName}`}
              className="image-frame rounded-panel aspect-[4/3] relative w-full cursor-zoom-in focus-ring">
        {active && <Image src={imgSrc(active, 1200)} alt={active.alt || productName} fill priority sizes="(max-width: 768px) 92vw, 45vw" className="object-contain p-3" />}
        <span aria-hidden className="absolute right-3 bottom-3 w-9 h-9 rounded-full bg-white/90 text-ink flex items-center justify-center shadow-card"><FaMagnifyingGlassPlus /></span>
      </button>
      {images.length > 1 && (
        <div className="flex flex-wrap gap-3 mt-3.5" role="group" aria-label={`${productName} photos`}>
          {images.map((img, i) => (
            <button key={i} type="button" aria-pressed={i === activeIndex} aria-label={`Show photo ${i + 1} of ${images.length}`}
                    onClick={() => setActiveIndex(i)}
                    className={`image-frame rounded-lg relative w-20 h-[60px] flex-shrink-0 focus-ring transition-shadow ${i === activeIndex ? 'ring-2 ring-red ring-offset-1' : ''}`}>
              <Image src={imgSrc(img, 240)} alt="" fill sizes="80px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
      <Modal open={zoom} onClose={() => setZoom(false)} label={`${productName} zoomed`} className="max-w-5xl">
        {active && (
          <div className="relative w-full h-[80vh]">
            <Image src={imgSrc(active, 2000)} alt={active.alt || productName} fill sizes="100vw" className="object-contain" />
          </div>
        )}
      </Modal>
    </div>
  );
}
