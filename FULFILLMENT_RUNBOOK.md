# Fulfillment runbook — payment to delivery

The killer end-to-end process. Read this once, set up the two Airtable
Automations at the bottom, and the day-to-day operation becomes:
**check Airtable a few times a day, pull from the right fridge, ship,
paste tracking number.**

That's the whole job.

---

## The happy path (auto)

Every paid order moves itself through the first three steps with no human
intervention. You only step in to ship.

| # | Stage | What triggers it | What happens automatically |
|---|---|---|---|
| 1 | Cart → Checkout | Customer hits "Continue to crypto checkout" | Order written to Airtable as `Pending payment`. Customer redirected to paygate.to hosted page. |
| 2 | Customer pays | Customer sends BTC / ETH / USDT / USDC on paygate.to | paygate.to forwards funds to your Trust Wallet, IPNs your site. |
| 3 | Site marks paid | `/api/paygate-webhook` receives IPN | Airtable `Status → Paid`, `Tx Hash` filled, `Fulfilled From` tag set (T / R / M based on highest stock), the matching fridge **decremented automatically**. |
| 4 | **You ship** | You see a `Paid` order in Airtable (or get the email alert below) | Pull from the fridge tagged on the order, pack discreet, drop off at USPS. |
| 5 | You log tracking | After dropping at USPS | In Airtable: paste **Tracking Number**, change **Status → Shipped**. |
| 6 | Customer notified | Status changed to Shipped | Customer's `/order/[orderId]` page shows tracking. (Optional: automation below emails them.) |
| 7 | Delivered | USPS marks delivered | Manual: change Airtable **Status → Delivered**. |

You're only doing 4, 5, and 7. Everything else is automatic.

---

## Daily routine (your operational POV)

Check Airtable's **Orders** table once in the morning, once before the 2 PM
CT shipping cutoff, once before close. The view to look at:

> Filter: `Status = Paid`. Sort by `Created Time` ascending.

Anything in that view needs to ship today. For each row:

1. Look at **Fulfilled From** — tells you which fridge to open (T, R, or M).
2. Pull the items in the **Items** column.
3. Pack discreetly (no external markings).
4. Print USPS Priority label (use the address in **Ship To**).
5. Drop at any USPS box or hand off to your mail carrier.
6. Back in Airtable: paste **Tracking Number** + change **Status → Shipped**.

Done. Move to next row.

---

## Pre-orders

When all three fridges (T + R + M) for a product equal 0, the website
auto-flips that product to "Pre-order — ships in 7–10 days." Customer can
still buy it. The order writes to Airtable like any other order, but you
don't ship it day-of — you wait for restock.

To handle pre-orders:

1. When new inventory arrives, go to **Products**, bump the appropriate
   fridge field by the count you received.
2. Open **Orders** view filtered by `Status = Paid` AND `Items` contains
   the product slug — these are the people waiting.
3. Ship them in FIFO order.

Pre-order revenue is in your wallet from day one. You're not capital-
constrained while waiting on stock.

---

## Restocking

When raw inventory arrives at one of your team members' fridges:

1. Open Airtable → **Products**.
2. Click the matching row (Reta or GHK-Cu).
3. Add to the right `T Fridge` / `R Fridge` / `M Fridge` field.
4. **Total Stock** formula auto-recalculates.
5. The website reflects the new stock within ~10 seconds.
6. The price auto-resets toward `Base Price USD` since stock just went up.

That's it. No deploys, no code changes, no website downtime.

---

## Pricing

Live price is interpolated between `Base Price USD` (when stock is at
`Full Stock`) and `Max Price USD` (when stock is at `Low Stock At`).
Higher stock = lower price. Lower stock = higher price.

To run a sale, drop `Max Price USD` to match `Base Price USD` for a few
days — the dynamic pricing flatlines at the floor. Or drop both to a
sale price.

To raise prices broadly, bump `Base Price USD` and `Max Price USD`
together by the same %.

---

## Two Airtable Automations to set up (5 min, no code)

These are no-code "if-this-then-that" rules inside Airtable. They make the
operation feel real-time without any extra service like Resend or
Twilio.

### Automation 1 — "Email me when a new order is paid"

Goes off the moment paygate.to webhooks Paid → you know to ship.

1. Airtable → **Automations** → **Create automation** → name it `New paid order`.
2. **Trigger:** *When record matches conditions*
   - Table: **Orders**
   - Conditions: `Status = Paid` (and optionally `Tracking Number` is empty,
     so it doesn't re-fire if you edit a Shipped row)
3. **Action:** *Send email*
   - To: your email
   - Subject: `New paid order — {{Order ID}} — pull from {{Fulfilled From}}`
   - Body: include `{{Customer}}`, `{{Items}}`, `{{Total USD}}`,
     `{{Ship To}}`, `{{Notes}}`. Airtable's interpolation syntax inserts
     the field values inline.

Now every Paid order pings your inbox in under a minute.

### Automation 2 — "Email customer when shipped"

Customer never has to wonder where their order is.

1. **Create automation** → name it `Shipping confirmation`.
2. **Trigger:** *When record matches conditions*
   - Table: **Orders**
   - Conditions: `Status = Shipped` AND `Tracking Number` is not empty
3. **Action:** *Send email*
   - To: `{{Email}}` (the order's email field)
   - Subject: `Your Texas Peptides order — shipped`
   - Body:

```
Hi {{Customer}},

Your order {{Order ID}} just left Austin via USPS Priority.

Tracking: {{Tracking Number}}

Items:
{{Items}}

Track at: https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1={{Tracking Number}}

Questions? Just reply to this email.

— Texas Peptides
```

The customer gets a real email, with their tracking, the moment you flip
the row to Shipped.

That's the whole notification stack. No Resend, no Twilio, no
Mailchimp account needed. Airtable runs both for free on any plan.

---

## Edge cases & how to handle them

### "I think this paid but Airtable still says Pending payment"

paygate.to's IPN didn't reach your site (network issue, server down, or
local dev without a public URL). Manual fix:

1. Confirm the payment landed in your Trust Wallet (look for the USDC tx
   on polygonscan).
2. Open the Airtable order row.
3. Set `Status → Paid`, paste the tx hash into `Tx Hash`.
4. The fridge inventory won't auto-decrement in this manual path —
   bump the right fridge down yourself (or run it through paid → unpaid
   → paid via the Orders table to retrigger the webhook decrement).

### "Customer paid the wrong amount"

paygate.to converts at market rates so this is rare, but if it happens:

- **Underpaid by < $1:** ignore, ship anyway. Cost of doing business.
- **Underpaid significantly:** email the customer, ask them to top up to
  the same address (paygate.to keeps the deposit address open for ~24
  hours). When the new tx lands, mark Paid manually.
- **Overpaid:** send the difference back from your Trust Wallet.

### "I want to refund someone"

1. Look up the order's `Tx Hash` on polygonscan, find the sender address.
2. Open Trust Wallet → **Send** → USDC → paste sender address → enter the
   amount → confirm.
3. Set Airtable `Status → Cancelled`, add a Note explaining.

No payment processor to call. You hold the keys. Refunds are a 30-second
operation.

### "The website price changed before the customer paid"

Doesn't matter — the customer's order locks the price they saw at
checkout (server-side, in `/api/order`). They pay what they saw. Stock
moving doesn't affect their order.

### "All three fridges are at 0 for a product"

The website auto-flips to Pre-order. Customer pays now, you ship when
restocked. Their order sits in `Status = Paid` until you fulfill — same
flow as a normal order, just delayed. Be transparent: when you confirm the
order, optionally email them with an ETA.

---

## Weekly hygiene (10 minutes, Friday afternoon)

1. **Sweep the wallet.** Withdraw your weekly USDC out of Trust Wallet to
   a hardware wallet (Ledger) or to Coinbase to off-ramp to USD. Don't
   leave more than the next week of expected revenue in the hot wallet.
2. **Reconcile Airtable.** Filter Orders by `Status = Paid` AND `Created
   Time` within last 7 days. Sum `Total USD`. Compare to USDC received
   in your wallet for the same window (minus paygate.to's ~1% fee).
   Differences > $5 are worth investigating.
3. **Restock check.** Filter Products where `Total Stock` < `Low Stock
   At`. These are the products about to flip to high price or pre-order.
   Order more from your supplier proactively.

That's it. The whole company in 10 min/wk + ~30 min/day of packing.

---

## What you, as a human, never have to do anymore

- Manually verify a payment landed (paygate.to + the IPN handle it)
- Manually decrement inventory (the IPN handle it)
- Manually pick which fridge to pull from (auto-tagged on the order)
- Manually re-render the website when a product changes (10s revalidate)
- Manually email customers about their order status (Airtable
  Automation handles it)
- Talk to a payment processor for any reason (you don't have one)
- Worry about chargebacks (crypto, no chargebacks exist)

What's left for you: **pack, ship, paste tracking.** That's the killer
process.
