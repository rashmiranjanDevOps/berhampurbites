import Image from 'next/image';
import Link from 'next/link';
import { imgSrc, imgPos } from '@/sanity/lib/image';
import { safeHref } from '@/sanity/lib/safeLink';

export default function StoryTeaser({ story }: { story: any }) {
  if (!story || (!story.heading && !story.bodyText)) return null;
  return (
    <section aria-labelledby="story-h" className={`mt-6 md:mt-10 grid ${story.image ? 'md:grid-cols-2' : ''} bg-[#f7ecda] overflow-hidden`}>
      {story.image && <div className="relative aspect-[4/3] bg-brown-darker self-start w-full">
        <Image src={imgSrc(story.image, 1100)} alt={story.image.alt || story.heading || ''} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectPosition: imgPos(story.image) }} className="object-cover" />
      </div>}
      <div className="relative px-5 md:px-14 py-9 md:py-14 flex flex-col justify-center">
        <svg aria-hidden viewBox="0 0 420 90" className="absolute right-0 bottom-0 w-[70%] max-w-[420px] text-[#c8a878] opacity-60" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 88h420M40 88V62l14-14 14 14v26M90 88V54h30v34M96 54V40l9-9 9 9v14M150 88V40l20-26 20 26v48M160 88V52h20v36M225 88V58h50v30M235 58V44l15-14 15 14v14M300 88V50l14-18 14 18v38M350 88V64h40v24M358 64V54l12-10 12 10v10"/></svg>
        <span className="eyebrow-plain">Our Story</span>
        <h2 id="story-h" className="h-serif text-3xl md:text-[44px] mt-2">
          {story.heading}
          {story.subheading && <span className="block text-red">{story.subheading}</span>}
        </h2>
        {story.bodyText && <p className="mt-4 text-[14px] md:text-[15px] text-muted max-w-[440px] line-clamp-4">{story.bodyText}</p>}
        <div className="mt-6 relative"><Link href={safeHref(story.ctaLink) || '/story'} className="btn-primary min-h-[44px] px-5 py-2.5 text-[13px]">{story.ctaLabel || 'Our Story'} <span aria-hidden>→</span></Link></div>
      </div>
    </section>
  );
}
