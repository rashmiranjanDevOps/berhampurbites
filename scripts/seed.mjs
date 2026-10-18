// One-time seed script for a brand-NEW, EMPTY Sanity dataset: creates starter categories, products, homepage, story,
// outlet and settings documents. You do NOT need it for the existing project (n6n5dyot) — it already has your content.
//
// Usage (Node 20.6+), with a token that has "Editor" access (sanity.io/manage → your project → API → Tokens):
//   SANITY_API_TOKEN=your_token npm run seed
//
// Safe to re-run: every document uses createIfNotExists, so it never overwrites anything that already exists.

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function run() {
  const categories = ['Burgers', 'Chicken', 'Fries', 'Beverages'];
  const catRefs = {};
  for (const [i, title] of categories.entries()) {
    const id = `category-${title.toLowerCase()}`;
    await client.createIfNotExists({ _id: id, _type: 'category', title, slug: { current: title.toLowerCase() }, visible: true, sortOrder: i });
    catRefs[title] = { _type: 'reference', _ref: id };
  }

  const products = [
    { id: 'product-chicken-burger', name: 'Chicken Burger', cat: 'Burgers', shortDescription: 'Crispy chicken burger with fresh vegetables and signature sauce.', regularPrice: 129, offerPrice: 99, badge: 'Bestseller', featured: true, sortOrder: 0 },
    { id: 'product-chicken-pakoda', name: 'Chicken Pakoda', cat: 'Chicken', shortDescription: '7 pieces of crispy chicken pakoda made fresh to order.', regularPrice: 119, featured: true, sortOrder: 1 },
    { id: 'product-french-fries', name: 'French Fries', cat: 'Fries', shortDescription: 'Golden and crispy french fries with our special seasoning.', regularPrice: 59, featured: true, sortOrder: 2 },
    { id: 'product-thums-up', name: 'Thums Up', cat: 'Beverages', shortDescription: 'Chilled and refreshing, 250ml.', regularPrice: 29, featured: true, sortOrder: 3 },
  ];
  for (const p of products) {
    await client.createIfNotExists({
      _id: p.id, _type: 'product', name: p.name, slug: { current: p.id.replace('product-', '') },
      category: catRefs[p.cat], shortDescription: p.shortDescription, regularPrice: p.regularPrice,
      offerPrice: p.offerPrice, badge: p.badge || 'None', featured: p.featured, available: true, archived: false, sortOrder: p.sortOrder,
    });
  }
  console.log('NOTE: products were created WITHOUT images (mainImage is required for real use).');
  console.log('Open /studio, edit each product, and upload the real product photo before publishing.');

  await client.createIfNotExists({
    _id: 'homepage', _type: 'homepage',
    heroHeadingLine1: 'Good Food', heroHeadingLine2: 'Good Mood',
    heroSubheading: 'Burgers • Chicken • Fries • Beverages',
    heroCta1Label: 'View Menu', heroCta1Link: '/menu', heroCta2Label: 'Find Us', heroCta2Link: '/outlet',
    features: [
      { title: 'Juicy Chicken', description: 'Freshly prepared', enabled: true },
      { title: 'Bold Flavours', description: 'Authentic taste', enabled: true },
      { title: 'Made for Sharing', description: 'Great food, better company', enabled: true },
      { title: 'Born in Berhampur', description: 'Our home, our pride', enabled: true },
    ],
    promoHeading: 'Something Crispy Is Coming to Berhampur',
    promoDescription: 'Follow us to be the first to know about our launch, offers and new menu items.',
    promoButtonLabel: 'Follow on Instagram', promoEnabled: true,
  });

  await client.createIfNotExists({
    _id: 'story', _type: 'story',
    heading: 'Born in Berhampur.', subheading: 'Built for Big Cravings.',
    bodyText: 'Berhampur Bites was born from a simple idea — great food brings people together. We started in Berhampur with a love for bold flavours, crispy chicken and unforgettable taste. Our mission is to serve high-quality, delicious food that makes every meal a little more special.',
    ctaLabel: 'Our Journey',
  });

  await client.createIfNotExists({
    _id: 'outlet-1', _type: 'outlet', name: 'Berhampur Bites — Main Outlet', status: 'open',
    address: 'Berhampur, Odisha', openingHours: 'Mon–Sun, 11:00 AM – 11:00 PM', isPrimary: true,
  });

  await client.createIfNotExists({
    _id: 'businessSettings', _type: 'businessSettings',
    businessName: 'Berhampur Bites', tagline: 'Good food, good mood.',
    whatsappMessage: 'Hi! I would like to order from Berhampur Bites.', address: 'Berhampur, Odisha',
  });

  await client.createIfNotExists({ _id: 'brandSettings', _type: 'brandSettings' });

  console.log('Seed complete.');
  console.log('NOTE: seeded documents don\'t have an orderRank yet (that\'s only assigned by dragging');
  console.log('items in the Products/Categories/Gallery lists in /studio). Open each list once and drag');
  console.log('to set your preferred order — the public site already sorts by it.');
  console.log('NOTE: Brand Settings theme colors were left empty, so the site uses the built-in');
  console.log('Berhampur Bites palette. Set colors in Brand Settings only if you want to change them.');
}

run().catch((err) => { console.error(err); process.exit(1); });
