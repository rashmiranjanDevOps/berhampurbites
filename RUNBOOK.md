# RUNBOOK — deploying and running Berhampur Bites

> Your content already lives in the Sanity project **`n6n5dyot`** (dataset `production`). **Do not** run `sanity init` or
> create a new Sanity project — that would make a second, empty one.

## 1. Deploy on Netlify (what you did for the audit, done properly)
1. Put the project on GitHub (private repo). `.env.local`, `node_modules` and `.next` are intentionally not in the ZIP/repo.
2. Netlify → **Add new site → Import an existing project** → pick the repo. Netlify detects Next.js automatically
   (build command `npm run build`; leave the publish directory empty/default).
3. **Site configuration → Environment variables** — add (scopes: tick **Builds, Functions and Runtime**):
   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | `n6n5dyot` |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` |
   | `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-01-01` |
   | `NEXT_PUBLIC_SITE_URL` | your real address, e.g. `https://yourdomain.com` (optional: if empty, Netlify's own URL is used; a `localhost` value is ignored on the live site) |
   | `NODE_VERSION` | `20` |
   Do **not** set `MOCK_SANITY` or `SANITY_API_HOST` (testing switches). No email/API keys are needed any more.
4. Deploy. Open the Netlify address and check every page on a phone.
5. **Allow Studio on the live address:** sanity.io/manage → your project → **API → CORS origins** → add the Netlify
   address and later your own domain, each with **Allow credentials** ticked. Without this `/studio` will not load live.
6. **Own domain:** Netlify → Domain management → add it, follow the DNS steps, then add it to Sanity CORS and set
   `NEXT_PUBLIC_SITE_URL` to it (redeploy).
7. The "Powered by Netlify" pill appears on test/unclaimed deploys and is added by Netlify, not by this code.

Updating the site later: push to GitHub → Netlify rebuilds automatically. Content edits in Studio need no redeploy
(they appear within about a minute).

## 2. First-time Studio setup (once)
1. Open `/studio` → **Home** screen → work down the **Setup checklist**.
2. **Business Settings:** phone, WhatsApp, social links (icons show only when filled), Google Maps link, the
   **Google Maps embed** (Google Maps → Share → Embed a map → Copy HTML → paste), and **Contact Form — number that
   receives customer messages**.
3. **Homepage Circles:** add your round pictures (600×600), set labels/links, drag into order. (No circles = it shows your categories.)
4. **Products, Categories, Gallery Photos:** open each list and drag one item once, so every item gets a sort order.
5. **Homepage** has four tabs: **Hero** (text, photo, where the headline sits, how dark the photo is), **Signature Bite**, **Highlights**, **Promo banner**.
6. Run `npm run smoke` locally to check your data for problems.

## 3. Image sizes (also shown inside each Studio field)
| Where | Size | Ratio |
|---|---|---|
| Hero | 1920 × 1080 | 16:9 |
| Product photos, Story, Outlet exterior, Gallery, Promo, Signature image | 1200 × 900 | 4:3 |
| Outlet interior photos | 800 × 600 | 4:3 |
| Homepage circles | 600 × 600 | 1:1 |
| Logo (transparent PNG) | 600 × 200 | 3:1 |

## 4. How customer messages reach you
Contact form → customer's phone opens WhatsApp (or SMS) with your number and the typed message → they tap send.
No server or keys involved. It reaches you only if the customer taps send in their own app.

## 5. Security notes
- `npm audit --omit=dev` lists known advisories in the installed packages (37 on 6 Oct 2026, 2 "critical"; **the number
  grows by itself as new advisories are published**). The two critical ones are Next.js 14 (image-optimiser denial of
  service; Netlify serves images through its own CDN) and a Sanity command-line dependency (runs on developer machines,
  not for visitors). The real fix is a planned **major upgrade** to Next.js 16 + newer `next-sanity`/`sanity`. Do it on
  a separate branch and test Studio, the build and every page before switching. Do **not** run `npm audit fix --force`,
  and plain `npm audit fix` made things worse when tried (it added packages and more advisories).
- The site sends standard security headers and stores no customer data. Links typed in Studio are only shown if they are
  a page on the site, `http(s)`, `tel:` or `mailto:`.
- Never commit `.env.local` or tokens (`.gitignore` already excludes every `.env*` file except `.env.example`).

## 6. Troubleshooting
| Problem | Check |
|---|---|
| `/studio` won't load live | Sanity CORS origins + "Allow credentials" |
| Map button missing | Business Settings → address or Maps embed code |
| WhatsApp/SMS buttons missing on Contact | A receiving number is set (or WhatsApp/Phone filled) |
| Social icon missing | That URL is empty in Business Settings |
| Change not showing | Publish in Studio, wait ~1 minute, hard refresh |
| Product shows no photo | The image field has alt text but no picture uploaded |
