/** Ragged "torn paper" seam between a dark photo area and the cream page. Purely decorative; spans the full width. */
export default function TornEdge({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1440 40" preserveAspectRatio="none" className={`block w-full h-[16px] md:h-[30px] text-cream ${className}`}>
      <path fill="currentColor" d="M0 40V22L48 18L101 15L133 17L184 15L244 20L274 16L329 27L361 21L394 27L425 17L467 15L520 15L562 15L598 23L652 18L687 23L726 17L766 25L800 16L831 20L890 27L938 28L995 25L1042 21L1081 21L1114 23L1173 24L1229 23L1261 17L1321 27L1359 24L1396 29L1440 15V40z" />
    </svg>
  );
}
