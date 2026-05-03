# Texas Peptides

Premium e-commerce site for Texas Peptides — a small Austin-based supplier
of research-grade peptides. Two products: Retatrutide 10 mg and GHK-Cu 50 mg.

Built with Next.js 14 App Router, TypeScript, Tailwind CSS, zustand. Backed
by Airtable for inventory/pricing and Telegram for order notifications.

---

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Open http://localhost:3000.

The site works without env vars — products fall back to `data/products.ts`
and orders silently no-op the Airtable + Telegram calls. Once you fill in
`.env.local`, live stock + pricing kicks in and orders are routed to your
Telegram and Airtable.

## Configuration

See:
- **[`SETUP_TELEGRAM.md`](./SETUP_TELEGRAM.md)** — bot token, chat id,
  testing.
- **[`SETUP_AIRTABLE.md`](./SETUP_AIRTABLE.md)** — base schema, dynamic
  pricing tuning, order workflow.

## Project structure

```
app/
  page.tsx                 Editorial homepage
  products/                Catalog + dynamic detail pages
  cart/                    Cart (zustand + localStorage)
  checkout/                Telegram-routed order form
  about/  contact/         Static
  disclaimer/  terms/  privacy/
  api/order/route.ts       POST → Airtable + Telegram

components/
  Nav.tsx  Footer.tsx
  ResearchBanner.tsx
  ProductCard.tsx          Live price + stock badges
  AddToCartButton.tsx
  CartIcon.tsx
  Reveal.tsx               IntersectionObserver scroll-reveal wrapper
  Marquee.tsx              CSS-only infinite scroll

data/
  products.ts              Type definitions + offline fallback + price math

lib/
  airtable.ts              Read products / write orders
  telegram.ts              sendMessage to chat
  cart-store.ts            zustand persisted cart
  format.ts                $X.XX formatter (server-safe, no "use client")

.env.example               Template — copy to .env.local
SETUP_TELEGRAM.md
SETUP_AIRTABLE.md
```

## Dynamic pricing

`data/products.ts` exports `currentPriceCents(product)`. Linear interpolation
between `basePriceCents` (when stock is at `fullStock`) and `maxPriceCents`
(when stock is at `lowStockAt`). Same calculation runs server-side in
`/api/order` so the price the customer sees and the price they're charged
always match.

To tune aggressiveness, change Base Price / Max Price / Full Stock / Low
Stock At per product (in Airtable, or in `data/products.ts` for local dev).

## Order flow

1. Customer adds items, hits **Send order to Telegram** on `/checkout`.
2. `POST /api/order`:
   - Resolves products + dynamic prices server-side.
   - Writes a row to Airtable `Orders` table.
   - Sends a formatted Markdown message to your Telegram chat.
3. You reply to customer with a payment link (USDC, ACH, or card).
4. Mark order `Paid` then `Shipped` in Airtable. Decrement `Stock`.

No payment is collected on-site by design — Stripe / Square / PayPal
restrict peptide sales, so we route through Telegram for manual payment
links (crypto, ACH, or specialty merchant).

## Effects

- Animated gradient mesh blobs (CSS keyframes)
- Scroll-reveal fade/slide via `Reveal` component
- Marquee trust strip (CSS)
- Magnetic-feel hover buttons
- Subtle film-grain overlay
- Sticky nav with scroll-state backdrop blur
- Live "Low stock" badge on product cards when stock dips

All CSS-only / native — no Framer Motion, GSAP, or other heavy dep.

## Deploy

Vercel is easiest:

```bash
npx vercel
```

Add `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `AIRTABLE_API_KEY`,
`AIRTABLE_BASE_ID` in **Project → Settings → Environment Variables**.

## To do before launch

- Real product photography (replace placeholder vial SVGs).
- Hook up `/contact` form to a backend (mirror the Telegram pattern).
- Legal review of `/terms`, `/privacy`, `/disclaimer`.
- Optional: Plausible / GA4 for analytics; sitemap.ts; robots.ts.
- Optional: 21+ age gate modal on first visit.
- Optional: Airtable automation that decrements `Stock` when order Status
  flips to `Shipped`.
