/** Safe for <script type="application/ld+json">: escapes "<" so text typed in Studio can never close the script tag. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
