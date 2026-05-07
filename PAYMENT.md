# Payment & Order Management

Two paths to a completed order. Path A is automated and preferred. Path B
is for customers who cannot pay in crypto and must be approved first.

---

## The Wallet — OneKey 3-of-3 Multisig

All funds land in a OneKey hardware-based multisig wallet shared between
the three co-founders. **No single founder can move money.** Any outbound
transaction requires 2-of-3 hardware signatures.

```
Founders:  Founder A · Founder B · Founder C
Network:   Solana
Token:     USDT (SPL token — native Solana USDT, not bridged)
Threshold: 2-of-3 signatures required to sweep funds
Device:    OneKey hardware wallet per founder
```

### OneKey Setup (one-time, do together)

1. Each founder installs the **OneKey app** and initializes their hardware device.
2. Designate one founder to create the multisig. In the OneKey app:
   - `Create Wallet → Multi-sig → Solana → 3 signers, 2 required`
3. Each other founder scans / pastes their **xPub** (extended public key) from
   their OneKey device into the multisig creation flow.
4. OneKey derives the shared `multisig_address`. Share this address with all
   three founders and paste it into `.env`:
   ```
   SOLANA_MULTISIG_ADDRESS=<your shared Sol USDT address>
   ```
5. **Never store private keys digitally.** Each founder's seed phrase lives
   on paper, in a safe, not in iCloud / Google Drive / Telegram.

### Sweeping Funds

When revenue needs to move (to pay costs, distribute profits, etc.):
1. The initiating founder opens OneKey, proposes the transaction.
2. A second founder approves on their hardware device.
3. Transaction broadcasts. Third founder does not need to sign unless one of
   the first two is unavailable.

---

## Path A — USDT on Solana (Preferred)

```
[customer] → cart → checkout form → /api/order
                                        │
                          Airtable order created (Pending payment)
                                        │
                          Customer shown QR code + Sol USDT address
                                        │
                          Customer sends USDT on Solana mainnet
                                        │
                          /api/payment-status webhook detects on-chain
                                        │
                          Airtable → Paid · fridge decremented
                                        │
                          EmailJS receipt sent to customer
                                        │
                          Zahlora bot notifies founders in Telegram
                                        │
                          Founder ships from correct fridge
```

### What the Customer Sees

1. Fills out the checkout form (name, email, shipping address).
2. Lands on the `/pay/[orderId]` page — shows:
   - Total in USD and equivalent USDT amount
   - Solana USDT address (text, copyable)
   - QR code encoding `solana:<multisig_address>?spl-token=...&amount=...`
   - "Waiting for payment…" status that auto-refreshes every 10 seconds
3. Once the on-chain transfer confirms (1 Solana confirmation ≈ 400 ms):
   - Page flips to "Payment confirmed. Your order is in."
   - Receipt email fires via EmailJS.

### EmailJS Receipt — USDT Orders

Template ID: `USDT_ORDER_RECEIPT` (configure in EmailJS dashboard)

Variables sent:
```
to_email       customer email
order_id       TX + 8 chars
customer_name  full name
items_summary  "1× Retatrutide 10mg — $199.00\n..."
total_usd      $199.00
payment_method USDT on Solana
tx_hash        on-chain transaction signature
ship_to        full shipping address
```

Trigger: fired from `/api/paygate-webhook` (or a new `/api/sol-webhook`)
immediately after Airtable is marked Paid.

### Env Vars Required

```
SOLANA_MULTISIG_ADDRESS=      # the shared OneKey Sol address
SOLANA_RPC_URL=               # Helius / QuickNode / mainnet-beta default
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_USDT=        # template ID for USDT receipt
EMAILJS_PUBLIC_KEY=
NEXT_PUBLIC_BASE_URL=         # https://texaspeptides.com
TELEGRAM_BOT_TOKEN=           # Zahlora bot token
TELEGRAM_CHAT_ID=             # founders group chat ID
```

---

## Path B — Consultation → Cash

When a customer cannot pay in USDT they must go through a consultation.
Cash orders are not self-serve — they are manually entered by a founder.

```
[customer] → /contact → "Request a consultation"
                                │
                  Zahlora bot pings founders in Telegram
                                │
                  Founder schedules call (Calendly or direct)
                                │
               ┌────────────────┴────────────────┐
               │ NOT approved                    │ Approved
               │ Order declined                  │ Founder quotes price, confirms cash
               └─────────────────────────────────┘
                                │
                  Customer delivers / mails cash to Austin address
                                │
                  Founder confirms receipt of cash (in person or mail)
                                │
                  Founder opens /admin/order/new  ← internal page (TODO)
                  Fills: customer info · items · "Cash" payment method
                                │
                  /api/order called server-side with paymentMethod: "cash"
                  Airtable → Paid (cash) · fridge decremented
                                │
                  EmailJS receipt sent to customer  (cash receipt template)
                                │
                  Founder ships from correct fridge
```

### Consultation Flow Detail

1. Customer fills the contact form and selects **"Request a consultation"**.
2. The form POST hits `/api/contact` (to be built) which:
   - Records the lead in Airtable (`Consultations` table, `Pending` status).
   - Fires Zahlora bot message to the founders Telegram group:
     ```
     📋 Consultation request — Texas Peptides
     Name: John Smith
     Email: john@example.com
     Message: "Interested in Retatrutide, can't do crypto"
     → Airtable: [link]
     ```
3. A founder replies to the customer within 1 business hour to schedule.
4. After the call the founder updates Airtable `Consultations` → `Approved`
   or `Declined` and notes why.

### Founder Order Entry (Cash)

Until a dedicated `/admin` UI is built, founders submit cash orders through
a protected API call. A simple internal HTML form (not customer-facing,
behind a founder-only secret header) posts to `/api/order` with:

```json
{
  "customerName": "...",
  "email": "...",
  "shippingAddress": "...",
  "city": "...",
  "state": "...",
  "zip": "...",
  "items": [{ "slug": "retatrutide-10mg", "quantity": 1 }],
  "paymentMethod": "cash",
  "founderKey": "<FOUNDER_SUBMIT_SECRET>"
}
```

`FOUNDER_SUBMIT_SECRET` is a shared secret in `.env` — only the three
founders know it. The API validates it before accepting a cash order.

### EmailJS Receipt — Cash Orders

Template ID: `CASH_ORDER_RECEIPT`

Variables sent:
```
to_email       customer email
order_id       TX + 8 chars
customer_name  full name
items_summary  line items
total_usd      total
payment_method Cash (in-person/mail)
received_by    founder name who confirmed cash
ship_to        full shipping address
```

Founder manually triggers the receipt from the order entry form after
confirming cash is in hand. Receipt is not sent until cash is confirmed.

---

## Inventory — Who Can Update It

Only the three founders can change stock levels. Two methods:

| Method | When | How |
|--------|------|-----|
| Airtable direct | Restock arrives | Open Airtable → Products table → increment `T Fridge`, `R Fridge`, or `M Fridge` for the product that was restocked. |
| Order entry (auto) | Cash order submitted | `/api/order` with `paymentMethod: cash` auto-decrements the correct fridge via the same webhook logic as USDT orders. |

**No customer action ever touches inventory directly.** Inventory only
decrements when an order moves to `Paid` status — either via on-chain
webhook (USDT) or founder submission (cash).

---

## Receipt System Summary

| Order type | Trigger | Template | Sent by |
|------------|---------|----------|---------|
| USDT on Solana | On-chain confirmation → webhook | `USDT_ORDER_RECEIPT` | Server (auto) |
| Cash | Founder marks cash received & submits order | `CASH_ORDER_RECEIPT` | Founder (manual confirm) |

Both receipts include: order ID, items, total, shipping address, and a
note that the order is now `Paid` and will ship within 1 business day.

### EmailJS Setup

1. Create a free account at https://emailjs.com
2. Connect your email service (Gmail / SendGrid / etc.)
3. Create two templates: `USDT_ORDER_RECEIPT` and `CASH_ORDER_RECEIPT`
   using the variable names listed above.
4. Copy the **Service ID**, **Public Key**, and both **Template IDs** into `.env`.

Install the SDK:
```bash
npm install @emailjs/nodejs
```

Call from server routes:
```ts
import emailjs from "@emailjs/nodejs";

await emailjs.send(
  process.env.EMAILJS_SERVICE_ID!,
  process.env.EMAILJS_TEMPLATE_USDT!,
  templateParams,
  { publicKey: process.env.EMAILJS_PUBLIC_KEY! }
);
```

---

## What Still Needs to Be Built

| Item | Priority | Notes |
|------|----------|-------|
| Sol USDT on-chain payment detection | High | Replace/augment Paygate with Solana RPC polling or Helius webhook |
| `/api/contact` → Airtable + Telegram | High | Wire up the contact/consultation form |
| EmailJS integration in webhooks | High | Both receipt templates |
| Founder cash order entry UI | Medium | Simple protected form or Retool page |
| `/admin` dashboard | Low | Nice to have — Airtable view covers this for now |
