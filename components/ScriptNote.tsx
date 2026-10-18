type Align = 'left' | 'center' | 'right';

/**
 * Handwritten note with a curved arrow. It is an ordinary block (never absolutely positioned), so it can
 * never cover a picture. `direction` = which way the arrow points ('down' when the note sits above the image).
 * Size and boldness come from Studio.
 */
export default function ScriptNote({ children, direction = 'down', align = 'right', bold = false, size = 'medium', className = '' }:
  { children: React.ReactNode; direction?: 'up' | 'down'; align?: Align; bold?: boolean; size?: 'small' | 'medium' | 'large'; className?: string }) {
  const sizes = { small: 'text-lg md:text-xl', medium: 'text-2xl md:text-3xl', large: 'text-3xl md:text-5xl' }[size];
  const items = { left: 'items-start text-left', center: 'items-center text-center', right: 'items-end text-right' }[align];
  const arrowFlip = `${direction === 'up' ? '-scale-y-100' : ''} ${align === 'right' ? '-scale-x-100' : ''}`;
  const order = direction === 'up' ? 'flex-col-reverse' : 'flex-col';
  return (
    <div aria-hidden className={`flex ${order} ${items} font-script ${bold ? 'font-bold' : 'font-medium'} ${sizes} leading-tight select-none ${className}`}>
      <span>{children}</span>
      <svg viewBox="0 0 60 50" className={`w-9 h-7 my-1 ${arrowFlip}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M8 6c22-2 38 12 36 32" /><path d="M36 30l8 9 8-11" />
      </svg>
    </div>
  );
}
