// Automated data-integrity check against your REAL Sanity dataset.
// Catches the kind of problems that are tedious to find by clicking through
// every page manually — missing required fields, orphaned references,
// duplicate slugs, malformed WhatsApp numbers, broken image refs.
//
// This does NOT replace clicking through the site — it only checks the data
// is internally consistent. Run it right after seeding, and again anytime
// before a big content push (e.g. adding 20 products at once).
//
// Usage (Node 20.6+):
//   npm run smoke          (loads .env.local automatically)
//
// Exits with code 1 if any FAIL is found (useful in CI later, if you add one).

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

let failCount = 0;
let warnCount = 0;

function pass(msg) { console.log(`  ✓ ${msg}`); }
function fail(msg) { console.log(`  ✗ FAIL: ${msg}`); failCount++; }
function warn(msg) { console.log(`  ! WARN: ${msg}`); warnCount++; }
function section(title) { console.log(`\n${title}`); }

async function run() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Run it with:  npm run smoke   (needs Node 20.6+ and a .env.local file)');
    process.exit(1);
  }

  // --- Singletons exist ---
  section('Singleton documents');
  for (const type of ['homepage', 'story', 'businessSettings', 'brandSettings']) {
    const doc = await client.fetch(`*[_type == $type][0]`, { type });
    doc ? pass(`${type} exists`) : fail(`${type} is missing — the corresponding page will use hard-coded fallback text only`);
  }

  // --- Categories ---
  section('Categories');
  const categories = await client.fetch(`*[_type == "category"]{_id, title, "slug": slug.current, visible}`);
  if (categories.length === 0) fail('No categories exist — Menu page will be empty');
  const catSlugs = new Map();
  for (const c of categories) {
    if (!c.slug) fail(`Category "${c.title}" has no slug`);
    if (catSlugs.has(c.slug)) fail(`Duplicate category slug "${c.slug}" (should have been blocked by Studio validation — if this happened, it was likely created via API/seed, not Studio)`);
    catSlugs.set(c.slug, c.title);
  }
  const visibleCount = categories.filter((c) => c.visible !== false).length;
  visibleCount > 0 ? pass(`${visibleCount}/${categories.length} categories visible`) : warn('Every category is hidden — Menu page will show no filter chips');

  // --- Products ---
  section('Products');
  const products = await client.fetch(`*[_type == "product"]{
    _id, name, "slug": slug.current, regularPrice, offerPrice, "hasImage": defined(mainImage.asset), category, archived, available, featured
  }`);
  if (products.length === 0) warn('No products exist yet');
  const prodSlugs = new Map();
  let missingImage = 0, badOffer = 0, orphanCategory = 0, negativePrice = 0;
  for (const p of products) {
    if (!p.slug) fail(`Product "${p.name}" has no slug`);
    else {
      if (prodSlugs.has(p.slug)) fail(`Duplicate product slug "${p.slug}"`);
      prodSlugs.set(p.slug, p.name);
    }
    if (!p.hasImage) { fail(`Product "${p.name}" has no real main image (its image field may contain only alt text — upload the picture)`); missingImage++; }
    if (p.regularPrice == null || p.regularPrice < 0) { fail(`Product "${p.name}" has an invalid regular price`); negativePrice++; }
    if (p.offerPrice != null && p.regularPrice != null && p.offerPrice > p.regularPrice) { fail(`Product "${p.name}" has offer price higher than regular price`); badOffer++; }
    if (!p.category) { fail(`Product "${p.name}" has no category reference`); orphanCategory++; }
    else {
      const catExists = categories.some((c) => c._id === p.category._ref);
      if (!catExists) { fail(`Product "${p.name}" references a category that no longer exists`); orphanCategory++; }
    }
  }
  if (missingImage === 0 && negativePrice === 0 && badOffer === 0 && orphanCategory === 0) {
    pass(`All ${products.length} products have valid images, prices, and category references`);
  }
  const featuredCount = products.filter((p) => p.featured && p.available !== false && !p.archived).length;
  featuredCount > 0 ? pass(`${featuredCount} product(s) will show in the homepage`) : warn('No products are Featured + Available — homepage the homepage section will be hidden');
  if (featuredCount > 8) warn(`${featuredCount} products are Featured — the homepage may feel cluttered (Studio already warns about this above 8)`);

  // --- Business Settings ---
  section('Business Settings');
  const business = await client.fetch(`*[_type == "businessSettings"][0]`);
  if (business) {
    if (!business.whatsapp) warn('No WhatsApp number set — every "Order on WhatsApp" / "Chat on WhatsApp" button sitewide will be hidden');
    else (() => { let d = business.whatsapp.replace(/\D/g, ''); if (d.length === 11 && d.startsWith('0')) d = d.slice(1); if (d.length === 10) d = '91' + d; return d.length >= 11 && d.length <= 15; })() ? pass('WhatsApp number format looks valid') : fail(`WhatsApp number "${business.whatsapp}" doesn't look like a valid phone number — links may fail`);
    if (!business.contactReceiverNumber && !business.whatsapp && !business.phone) warn('No number to receive Contact-form messages — the form will show "not set up yet". Fill WhatsApp, Phone or "Contact Form — Number that receives customer messages"');
    if (!business.mapEmbedUrl) warn('No Google Maps embed code — the "View Map" popup will use the less precise address search');
    if (!business.phone) warn('No phone number set — footer/contact "tel:" links will be hidden');
  }

  // --- Brand Settings ---
  section('Brand Settings');
  const brand = await client.fetch(`*[_type == "brandSettings"][0]`);
  if (brand) {
    brand.logo ? pass('Logo is set') : warn('No logo uploaded — header/footer will fall back to plain text "Berhampur Bites"');
    brand.favicon ? pass('Favicon is set') : warn('No favicon uploaded — browser tab will use the platform default icon');
  }

  // --- Outlet ---
  section('Outlets');
  const outlets = await client.fetch(`*[_type == "outlet"]{_id, name, isPrimary, status}`);
  const primaryOutlets = outlets.filter((o) => o.isPrimary);
  if (outlets.length === 0) warn('No outlet exists — the Our Outlet page will show a "coming soon" placeholder');
  else if (primaryOutlets.length === 0) warn('No outlet is marked Primary — the oldest outlet is shown (mark one Primary to choose)');
  if (primaryOutlets.length > 1) warn(`${primaryOutlets.length} outlets are marked Primary — only one should be (the query only ever returns the first match, so the others are silently ignored)`);

  // --- Gallery ---
  section('Gallery');
  const galleryCount = await client.fetch(`count(*[_type == "galleryItem" && enabled == true && defined(image.asset)])`);
  const galleryNoPic = await client.fetch(`count(*[_type == "galleryItem" && enabled == true && !defined(image.asset)])`);
  if (galleryNoPic > 0) warn(`${galleryNoPic} enabled gallery item(s) have no uploaded picture and are hidden`);
  galleryCount > 0 ? pass(`${galleryCount} gallery item(s) visible`) : warn('No enabled gallery items — Gallery page will show its empty state');

  // --- Homepage: Signature Bite + circles ---
  section('Homepage');
  const home = await client.fetch(`*[_type == "homepage"][0]{ "sig": signatureProduct->{name, archived, available}, signatureImage }`);
  if (home?.sig?.archived) warn(`The Signature Bite product "${home.sig.name}" is archived — the homepage falls back to another product`);
  else if (home?.sig && home.sig.available === false) warn(`The Signature Bite product "${home.sig.name}" is marked unavailable`);
  const circles = await client.fetch(`count(*[_type == "homeCircle" && visible != false && defined(image.asset)])`);
  circles > 0 ? pass(`${circles} Homepage Circle(s) will show`) : warn('No Homepage Circles — the strip falls back to your menu categories');

  // --- Summary ---
  console.log('\n' + '─'.repeat(50));
  console.log(`${failCount} failure(s), ${warnCount} warning(s)`);
  console.log(failCount > 0
    ? 'Fix the FAILs above before considering the site launch-ready.'
    : 'No structural failures. Warnings are things to review, not necessarily bugs.');
  process.exit(failCount > 0 ? 1 : 0);
}

run().catch((err) => { console.error('Smoke test crashed:', err); process.exit(1); });
