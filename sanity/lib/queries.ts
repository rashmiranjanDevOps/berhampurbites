import { groq } from 'next-sanity';

export const businessSettingsQuery = groq`*[_type == "businessSettings"][0]`;
export const brandSettingsQuery = groq`*[_type == "brandSettings"][0]`;

// Homepage + its Signature Bite product (ignored if that product was archived later) + the products
// marked "Show on Homepage". Featured products only show if genuinely available.
export const homepageQuery = groq`*[_type == "homepage"][0]{
  ...,
  "signatureProduct": select(signatureProduct->archived != true => signatureProduct->{..., category->{title, "slug": slug.current, visible}}),
  "featuredProducts": *[_type == "product" && defined(slug.current) && featured == true && available == true && archived != true && category->visible != false] | order(orderRank asc, _createdAt asc){
    ..., category->{title, "slug": slug.current, visible}
  }
}`;

// Menu shows everything in a visible category, available or not — unavailable items render with a
// "Currently Unavailable" state rather than being hidden. Archived items never show.
export const allProductsQuery = groq`*[_type == "product" && defined(slug.current) && archived != true && category->visible != false] | order(orderRank asc, _createdAt asc){
  ..., category->{title, "slug": slug.current, visible}
}`;

// A product in a hidden category is hidden everywhere — including by direct link.
export const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug && archived != true && category->visible != false][0]{
  ..., category->{title, "slug": slug.current, visible}
}`;

export const allCategoriesQuery = groq`*[_type == "category" && visible != false] | order(orderRank asc, _createdAt asc)`;

export const galleryQuery = groq`*[_type == "galleryItem" && enabled == true && defined(image.asset)] | order(orderRank asc, _createdAt asc)`;

export const storyQuery = groq`*[_type == "story"][0]`;

// The outlet shown on the site: the one marked Primary, otherwise simply the oldest outlet — so an outlet
// is never hidden just because the "Primary" switch was forgotten (or turned on twice).
export const primaryOutletQuery = groq`*[_type == "outlet"] | order(coalesce(isPrimary, false) desc, _createdAt asc)[0]`;

// Homepage circles you manage in Studio → Homepage Circles (drag to reorder, hide, delete).
export const homeCirclesQuery = groq`*[_type == "homeCircle" && visible != false && defined(image.asset)] | order(orderRank asc, _createdAt asc){
  _id, title, image, customLink, "categorySlug": category->slug.current
}`;

// Fallback when no Homepage Circles exist: each visible category with an image from its own first live
// product (only products whose image really has a picture).
export const categoryStripQuery = groq`*[_type == "category" && visible != false] | order(orderRank asc, _createdAt asc){
  _id, title, "slug": slug.current,
  "image": *[_type == "product" && references(^._id) && archived != true && defined(mainImage.asset)] | order(orderRank asc, _createdAt asc)[0].mainImage
}`;
