'use client';
import { useState } from 'react';
import { FaWhatsapp, FaCommentSms } from 'react-icons/fa6';
import { buildSmsUrl, buildWhatsAppUrl, fillContactTemplate, toInternationalDigits } from '@/sanity/lib/whatsapp';

type Props = {
  businessName: string;
  whatsappNumber?: string | null; // number that receives the WhatsApp message
  smsNumber?: string | null;      // number that receives the SMS
  template?: string | null;       // Studio → Business Settings → pre-typed message
};

/**
 * No server, no email, no API keys. Tapping a button opens the customer's own WhatsApp (or SMS app) with
 * your number chosen and the message already typed — they only have to press send. It then arrives in your
 * chat from their number.
 */
export default function ContactForm({ businessName, whatsappNumber, smsNumber, template }: Props) {
  const [errors, setErrors] = useState<{ name?: string; mobile?: string; message?: string }>({});
  const [opened, setOpened] = useState<'whatsapp' | 'sms' | null>(null);

  const hasWhatsapp = !!toInternationalDigits(whatsappNumber);
  const hasSms = !!toInternationalDigits(smsNumber);

  function read(form: HTMLFormElement) {
    const get = (n: string) => (form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement).value.trim();
    return { name: get('name'), mobile: get('mobile'), message: get('message') };
  }

  function validate(v: { name: string; mobile: string; message: string }) {
    const e: typeof errors = {};
    if (v.name.length < 2) e.name = 'Please enter your name.';
    if (!toInternationalDigits(v.mobile)) e.mobile = 'Please enter a valid mobile number.';
    if (v.message.length < 5) e.message = 'Please type your message (at least 5 characters).';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function send(channel: 'whatsapp' | 'sms', form: HTMLFormElement | null) {
    if (!form) return;
    const v = read(form);
    if (!validate(v)) return;
    const text = fillContactTemplate(template, { business: businessName, name: v.name, phone: v.mobile, message: v.message });
    const url = channel === 'whatsapp' ? buildWhatsAppUrl(whatsappNumber, text) : buildSmsUrl(smsNumber, text);
    if (!url) return;
    setOpened(channel);
    if (channel === 'whatsapp') {
      // A real link click inside the tap: opens WhatsApp in a new tab/app and leaves THIS page exactly where it is.
      // (window.open with "noopener" always returns null, so using its result to decide a fallback navigated this page away too.)
      const a = document.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      document.body.appendChild(a); a.click(); a.remove();
    } else {
      window.location.href = url; // sms: opens the messages app and does not leave the page
    }
  }

  if (!hasWhatsapp && !hasSms) {
    return <p className="text-muted" role="status">Messaging from this page isn&apos;t set up yet — please call us instead.</p>;
  }

  const field = 'w-full px-4 py-3 rounded-xl border-2 border-line bg-surface focus:outline-none focus:border-red';
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); send(hasWhatsapp ? 'whatsapp' : 'sms', e.currentTarget); }}
      className="space-y-3.5" noValidate
    >
      <div>
        <label htmlFor="name" className="sr-only">Your Name</label>
        <input id="name" name="name" autoComplete="name" maxLength={100} placeholder="Your Name" className={field}
               aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} />
        {errors.name && <p id="err-name" className="text-red text-sm mt-1" role="alert">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="mobile" className="sr-only">Mobile Number</label>
        <input id="mobile" name="mobile" type="tel" autoComplete="tel" inputMode="tel" placeholder="Mobile Number" className={field}
               aria-invalid={!!errors.mobile} aria-describedby={errors.mobile ? 'err-mobile' : undefined} />
        {errors.mobile && <p id="err-mobile" className="text-red text-sm mt-1" role="alert">{errors.mobile}</p>}
      </div>
      <div>
        <label htmlFor="message" className="sr-only">Your Message</label>
        <textarea id="message" name="message" maxLength={1000} rows={4} placeholder="Your Message" className={field}
                  aria-invalid={!!errors.message} aria-describedby={errors.message ? 'err-message' : undefined} />
        {errors.message && <p id="err-message" className="text-red text-sm mt-1" role="alert">{errors.message}</p>}
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        {hasWhatsapp && (
          <button type="button" onClick={(e) => send('whatsapp', e.currentTarget.form)} className="btn-primary min-h-[48px] px-6 py-3 text-sm">
            <FaWhatsapp aria-hidden className="text-lg" /> Send on WhatsApp
          </button>
        )}
        {hasSms && (
          <button type="button" onClick={(e) => send('sms', e.currentTarget.form)} className="btn-outline text-ink min-h-[48px] px-6 py-3 text-sm">
            <FaCommentSms aria-hidden className="text-lg" /> {hasWhatsapp ? 'Send by SMS instead' : 'Send by SMS'}
          </button>
        )}
      </div>

      {opened && (
        <p className="text-sm text-muted" role="status">
          {opened === 'whatsapp'
            ? 'WhatsApp should now open with your message ready — just tap send. If it didn’t open, press “Send on WhatsApp” again' + (hasSms ? ' or use SMS.' : '.')
            : 'Your messages app should now open with the text ready — just tap send.'}
        </p>
      )}
      <p className="text-xs text-muted">Your message opens in WhatsApp or SMS on your own phone. Nothing is stored on this website.</p>
    </form>
  );
}
