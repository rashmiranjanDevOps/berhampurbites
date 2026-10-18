# Berhampur Bites — website

A fast, mobile-first marketing website for Berhampur Bites (Next.js 14 + Tailwind + GSAP), with all content
managed in **Sanity Studio** (built in at `/studio`). It is an *advertisement* site: no cart, no online ordering.
Customers browse the menu, then call, message on WhatsApp, or get directions.

## What you can manage in Studio (`/studio`)
| Area | What it controls |
|---|---|
| **Home** (landing screen) | Big buttons, a checklist of anything still missing, short how-to guides |
| **Homepage** (4 tabs) | Hero (text, photo, headline position, photo darkening), Signature Bite (product, image, text, handwritten note, button), Highlights, Promo banner |
| **Homepage Circles** | The round pictures under the hero — add, hide, delete, **drag to reorder** |
| **Our Story / Our Outlets / Gallery Photos** | Story page, outlet details, gallery (drag to reorder) |
| **Products / Categories** | Menu items and categories (drag to reorder) |
| **Business Settings** | Phone, WhatsApp, social links, map, and the Contact-form receiving number + message |
| **Brand Settings** | Logo, favicon, colours |

Images: upload at the sizes shown in each field (hero 1920×1080; most photos 1200×900; circles 600×600; logo 600×200).
The website uses the crop/hotspot you set in Studio. Where a picture sits in a fixed frame (product cards, outlet and gallery thumbnails use 4:3), a photo of a different shape is trimmed at the edges around your hotspot — upload 4:3 to see it whole.

## How the Contact form works
There is no server, email or API key. When a customer presses **Send on WhatsApp**, their phone opens WhatsApp with your
number chosen and the message already typed (**Send by SMS instead** does the same with SMS). They press send and it
arrives in your chat from their number. Change the number and wording in Studio → Business Settings.

## Run it on your computer
```bash
cp .env.example .env.local     # Windows PowerShell:  copy .env.example .env.local
npm install
npm run dev                    # → http://localhost:3000   (Studio: /studio)
```
Needs Node 18.18+ (Node 20+ recommended). Other commands: `npm run build`, `npm start`, `npm run typecheck`,
`npm run lint`, `npm run smoke` (checks your Sanity data; Node 20.6+).

## Deploying
See **RUNBOOK.md** (Netlify steps, environment variables, Sanity CORS, launch checklist).

## Project map
- `app/` — pages (Home, Menu, Product, Story, Outlet, Gallery, Contact), `/studio`, 404 and error pages
- `components/` — all visual sections
- `sanity/schemaTypes/` — what is editable; `sanity/lib/` — queries, image/phone/map/theme helpers; `sanity/studio/` — the Studio Home screen
- `scripts/` — `smoke-test.mjs` (data check), `seed.mjs` (only for an empty dataset)

## Good to know
- Published changes appear on the website within about a minute.
- Social icons, WhatsApp/Call/Directions buttons, and the map button show **only** when their detail is filled in.
- `MOCK_SANITY` and `SANITY_API_HOST` are testing switches used by the automated tests — leave them unset.
