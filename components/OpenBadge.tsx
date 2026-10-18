'use client';
import { useEffect, useState } from 'react';

/**
 * Open/Closed badge from the free-text opening hours typed in Studio.
 * Reads a single daily range like "11:00 AM - 11:00 PM" (optionally "Mon-Sun, ..."). If the text
 * has anything it can't read confidently (split shifts, specific weekdays), it shows NOTHING
 * rather than guessing. Time is evaluated in India Standard Time.
 */
export function parseHours(text?: string | null): { open: number; close: number } | null {
  if (!text) return null;
  const days = text.match(/\b(mon|tue|wed|thu|fri|sat|sun)[a-z]*/gi) || [];
  const allWeek = /mon[a-z]*\s*(?:-|–|—|to)\s*sun/i.test(text) || /daily|every ?day/i.test(text);
  if (days.length && !allWeek) return null;
  const times = [...text.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/gi)];
  if (times.length !== 2) return null;
  const toMin = (m: RegExpMatchArray) => {
    let h = parseInt(m[1], 10) % 12; if (m[3].toLowerCase() === 'pm') h += 12;
    return h * 60 + (m[2] ? parseInt(m[2], 10) : 0);
  };
  return { open: toMin(times[0]), close: toMin(times[1]) };
}

export default function OpenBadge({ hours, className = '' }: { hours?: string | null; className?: string }) {
  const [state, setState] = useState<boolean | null>(null);
  useEffect(() => {
    const p = parseHours(hours);
    if (!p) return;
    const tick = () => {
      const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      const now = parseInt(parts.find(x => x.type === 'hour')!.value, 10) % 24 * 60 + parseInt(parts.find(x => x.type === 'minute')!.value, 10);
      setState(p.close > p.open ? now >= p.open && now < p.close : now >= p.open || now < p.close);
    };
    tick(); const id = setInterval(tick, 60000); return () => clearInterval(id);
  }, [hours]);
  if (state === null) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1 rounded-chip ${state ? 'bg-[#e4f6e8] text-[#1c7a36]' : 'bg-[#f6e4e2] text-[#a3281d]'} ${className}`}>
      <span aria-hidden className={`w-2 h-2 rounded-full ${state ? 'bg-[#25a244]' : 'bg-[#d5382b]'}`} />
      {state ? 'Open now' : 'Closed now'}
    </span>
  );
}
