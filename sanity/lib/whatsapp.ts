/**
 * Phone helpers. Admins type numbers however they like ("98765 43210", "+91 98765-43210", "09876543210").
 * Indian 10-digit numbers get the 91 country code automatically — WhatsApp links need it.
 */
export function toInternationalDigits(raw: string | undefined | null): string | null {
  let d = (raw || '').replace(/\D/g, '');
  if (!d) return null;
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1); // 09876543210 → 9876543210
  if (d.length === 10) d = `91${d}`;                        // 9876543210 → 919876543210
  return d.length >= 11 && d.length <= 15 ? d : null;       // too short / too long = not a usable number
}

/** `tel:` link without spaces, or null. */
export function telHref(raw: string | undefined | null): string | null {
  const d = toInternationalDigits(raw);
  return d ? `tel:+${d}` : null;
}

/** `https://wa.me/<number>?text=…`, or null (never a broken link) when no usable number is set. */
export function buildWhatsAppUrl(rawNumber: string | undefined | null, message?: string): string | null {
  const d = toInternationalDigits(rawNumber);
  if (!d) return null;
  return `https://wa.me/${d}?text=${encodeURIComponent(message || 'Hi!')}`;
}

/** `sms:` link with the message pre-typed (works on Android and iPhone), or null. */
export function buildSmsUrl(rawNumber: string | undefined | null, message: string): string | null {
  const d = toInternationalDigits(rawNumber);
  return d ? `sms:+${d}?&body=${encodeURIComponent(message)}` : null;
}

/**
 * Contact form → pre-typed message. Placeholders in the Studio template: {business} {name} {phone} {message}
 *
 * All placeholders are filled in ONE pass with a function, so text typed by a customer is never interpreted:
 * "$&", "$$" and even "{message}" typed inside a name stay exactly as typed. If the template has no {message}
 * the customer's message is appended — it can never be dropped.
 */
export const DEFAULT_CONTACT_TEMPLATE = 'Hi {business}, my name is {name}. My mobile number is {phone}.\n\n{message}';
export function fillContactTemplate(template: string | undefined | null, v: { business: string; name: string; phone: string; message: string }) {
  let t = template?.trim() || DEFAULT_CONTACT_TEMPLATE;
  if (!t.includes('{message}')) t += '\n\n{message}';
  const values: Record<string, string> = v;
  return t.replace(/\{(business|name|phone|message)\}/g, (_m, key: string) => values[key]);
}
