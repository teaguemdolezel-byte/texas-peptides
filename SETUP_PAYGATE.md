# paygate.to — crypto checkout setup

paygate.to is a non-custodial crypto payment gateway. They orchestrate the
multi-coin checkout UX (the green "AMOUNT" page customers see), monitor
the chain, and forward funds straight to your wallet. They never touch
your money. No account, no API key, no merchant approval — just plug in
your USDC-Polygon receive address and you're live.

This is what Arctic Labs uses. ~1% fee.

## 1. Get a USDC-on-Polygon wallet

The easiest path:

1. Install **Trust Wallet** on your phone (iOS or Android).
2. Open the app → **Create new wallet** → write the 12-word seed phrase
   somewhere offline (paper, not screenshot, not iCloud — if you lose
   this, you lose every dollar that has ever passed through it).
3. In the wallet, tap **Receive** → search **USDC** → choose the **Polygon**
   network → copy the `0x…` address shown.

That `0x…` address is what you paste into the env var below. paygate.to
will forward all customer payments to it.

> **Operational note:** the wallet *is* the bank. Once weekly volume
> justifies it (probably ≥ $5k/wk), get a hardware wallet (Ledger or Trezor)
> and treat the Trust Wallet as a hot wallet you sweep regularly. Never
> hold more than a week of revenue in a hot wallet.

## 2. Set the env vars

Copy `.env.example` → `.env.local` and fill in:

```
PAYGATE_MERCHANT_ADDRESS=0xYourPolygonAddressHere
NEXT_PUBLIC_BASE_URL=http://localhost:3000     # dev
# NEXT_PUBLIC_BASE_URL=https://texaspeptides.com  # prod
```

`NEXT_PUBLIC_BASE_URL` matters because paygate.to needs to reach your IPN
endpoint from the public internet. **localhost won't work for live
payments** — you need a real public URL (Vercel preview, ngrok tunnel for
local testing, or your production domain).

## 3. How the flow works end-to-end

```
[customer]                           [your site]                      [paygate.to]                      [your wallet]
   │                                    │                                  │                                  │
   │ submits checkout form ────────────►│                                  │                                  │
   │                                    │  POST /api/order                 │                                  │
   │                                    │  ─ writes order to Airtable      │                                  │
   │                                    │  ─ calls api.paygate.to ────────►│ generates one-time deposit addr │
   │                                    │◄──── deposit address + URL       │                                  │
   │  redirect ─────────────────────────│                                  │                                  │
   │                                    │                                  │                                  │
   │  ◄─── checkout.paygate.to ─────────────────────────────────────────────│                                  │
   │  picks BTC/ETH/USDT/USDC, sends ──────────────────────────────────────►│ deposit landed                   │
   │                                    │                                  │  forwards to merchant ──────────►│
   │                                    │  POST /api/paygate-webhook?id=X ◄│ IPN                              │
   │                                    │  ─ marks Airtable Paid           │                                  │
   │                                    │  ─ decrements right fridge       │                                  │
   │                                    │  ─ tags order Fulfilled From     │                                  │
   │  redirect to /order/[id]?paid=1    │                                  │                                  │
   │  ◄─────────────────────────────────│                                  │                                  │
```

Three things happen for every payment:
1. **Funds land in your wallet** (paygate.to forwards them, ~1% fee taken)
2. **Airtable order goes Pending payment → Paid + Tx Hash + Fulfilled From**
3. **The right fridge gets decremented**

## 4. Test it

For local dev, you can run end-to-end with a free **ngrok** tunnel so
paygate.to can reach your IPN:

```bash
npx ngrok http 3000
```

Copy the `https://xxxx.ngrok-free.app` URL into `NEXT_PUBLIC_BASE_URL`,
restart `npm run dev`, and place a small test order ($1 USDC).

Without a public URL, the customer-facing flow still works (cart →
checkout → paygate.to hosted page → pay), but the IPN won't reach your
local site, so Airtable won't auto-update to Paid. You'd need to flip
**Status → Paid** manually in Airtable.

## 5. Production

Deploy to Vercel:

```bash
npx vercel
```

In Vercel **Project → Settings → Environment Variables** add:

- `PAYGATE_MERCHANT_ADDRESS` (your USDC-Polygon address)
- `NEXT_PUBLIC_BASE_URL` (your production URL, e.g. `https://texaspeptides.com`)
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID` (already `appm3SLm7J5WuNr9Y`)

Promote to production. Run a $1 test order. Confirm Airtable updates +
funds land in Trust Wallet.

## 6. Reconciliation

Every order in Airtable's **Orders** table has a `Tx Hash` once paid.
Click the hash → cross-reference on **polygonscan.com** to confirm
funds landed. Sum of paid orders should equal incoming USDC to your
wallet (minus paygate.to's fee).

## 7. Refunds

paygate.to doesn't do refunds — it's a one-way settlement gateway.
Refunds happen by you sending USDC manually back to the customer's
sending address. Most customers never request refunds for crypto-paid
orders (no chargeback mechanism), but if you need to:

1. Look up the original tx on polygonscan.
2. Find the sending address.
3. Send USDC back from your Trust Wallet.
4. Mark the Airtable order `Cancelled` and add a Note.

## 8. If paygate.to disappears

Worst case: paygate.to's domain or service stops working. Your site keeps
working except customers can't check out anymore. Funds you've already
received are 100% safe — they're in your wallet, not paygate's.

To recover: swap to **Plisio** or **BTCPay Server** by changing
`lib/paygate.ts`. The rest of the system (Airtable, fridges, order pages)
stays identical.
