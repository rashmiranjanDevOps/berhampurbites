import type { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { storyQuery } from '@/sanity/lib/queries';
import StoryScroll from '@/components/StoryScroll';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Born in Berhampur, built for big cravings — the story behind Berhampur Bites.',
  alternates: { canonical: '/story' },
};

export default async function StoryPage() {
  const story = await client.fetch(storyQuery);
  return <StoryScroll story={story} />;
}
