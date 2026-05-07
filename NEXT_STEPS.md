# Next Steps — Execution Plan

Single source of truth for getting Texas Peptides operational this week.
Pulls from `PAYMENT.md`, `consult_checkout.md`, `zahlora.md`, and `week_session.md`
into one ordered, actionable checklist.

Every step is sequenced. Don't jump ahead — later steps depend on earlier ones.

---

## Milestones

| # | Milestone | Done when… |
|---|-----------|------------|
| **M1** | Founder notifications live | Submitting an order pings the founders Telegram group |
| **M2** | Consult page live | `/consult` form writes to Airtable + pings Telegram |
| **M3** | USDT payments live | Customer can pay USDT on Sol → Airtable goes Paid → fridge decrements |
| **M4** | Cash orders live | Founder can submit a paid cash order via protected endpoint |
| **M5** | Receipts live | Both USDT and cash orders email a receipt via EmailJS |
| **M6** | Zahlora ops commands live | Founders can DM Zahlora for stock/pending/restock/ship commands |
| **M7** | Production live | All flows working on `texaspeptides.com` with real money |

---

## STEP 1 — OneKey Multisig Wallet (do this first, with all 3 founders together)

**Why first:** the wallet address is needed in `.env` before anything else.

1. All 3 founders install OneKey app + initialize hardware devices.
2. One founder creates: `Create Wallet → Multi-sig → Solana → 3 signers, 2 required`.
3. Other two founders paste their xPub keys into the multisig setup.
4. Copy the resulting Solana multisig address.
5. Each founder writes their seed phrase on paper, stores in their own safe.
   **No digital copies anywhere.**
6. Send 1 USDT (Sol) to the address as a test. Verify all 3 see it in OneKey.

**Output:** `SOLANA_MULTISIG_ADDRESS=<addr>` ready to paste into `.env`.

---

## STEP 2 — Telegram Founders Group + Bot Token

**Why:** notifications + Zahlora both need this.

1. Create a private Telegram group with the 3 founders.
2. In Telegram, message `@BotFather` → use the existing Zahlora bot or create
   `@texas_peptides_bot`. Copy the bot token.
3. Add the bot to the founders group as admin.
4. In the group, send any message. Then visit:
   ```
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```
   Find `chat.id` — it'll be a negative number for groups (e.g. `-1001234567890`).
5. Get each founder's personal Telegram user ID (DM `@userinfobot` to grab it).

**Output:** ready for `.env`:
```
TELEGRAM_BOT_TOKEN=<token>
TELEGRAM_CHAT_ID=<group id>
FOUNDER_TELEGRAM_IDS=<id1>,<id2>,<id3>
```

---

## STEP 3 — Wire Telegram Into `/api/order`  → **MILESTONE M1**

**File:** `app/api/order/route.ts`

1. Import:
   ```ts
   import { sendOrderToTelegram, formatOrderMessage } from "@/lib/telegram";
   ```
2. After `recordOrder()` succeeds, fire the notification:
   ```ts
   await sendOrderToTelegram(
     formatOrderMessage({
       customerName: body.customerName,
       email: body.email,
       phone: body.phone,
       shippingAddress: body.shippingAddress,
       city: body.city,
       state: body.state,
       zip: body.zip,
       shippingMethod: "standard",
       items: resolved,
       totalCents,
       airtableId: recorded?.id ?? null,
       notes: body.notes,
     })
   );
   ```
3. Add to `.env`:
   ```
   TELEGRAM_BOT_TOKEN=...
   TELEGRAM_CHAT_ID=...
   ```
4. Test: submit a test order locally, confirm the founders group gets the message.

✅ **M1 hit when the group ping fires on every new order.**

---

## STEP 4 — Build `/consult` Page  → **MILESTONE M2**

### 4a. Add Airtable `Consultations` table
Per `consult_checkout.md` — fields: Name, Email, Phone, Message, Referral,
Status (New/Scheduled/Approved/Declined/Completed), Source, Assigned To,
Outcome Notes, Created.

### 4b. Add `recordConsultation` helper to `lib/airtable.ts`
Mirror the structure of `recordOrder()`. POST to the `Consultations` endpoint.

### 4c. Add `formatConsultMessage()` to `lib/telegram.ts`
Returns the formatted "📋 Consult request" string from `consult_checkout.md`.

### 4d. Build `app/api/contact/route.ts`
- Validates body (name, email, message required)
- Calls `recordConsultation(...)`
- Calls `sendOrderToTelegram(formatConsultMessage(...))`
- Returns `{ ok: true }`

### 4e. Build `app/consult/page.tsx`
- "use client" form (mirror `app/checkout/page.tsx` structure)
- Fields per `consult_checkout.md`
- POSTs to `/api/contact`
- Shows success state on response

### 4f. Add link to checkout page
Below the crypto note in `app/checkout/page.tsx`:
```tsx
<Link href="/consult">Can't do crypto? Request a consultation →</Link>
```

### 4g. Test
Submit form → verify Airtable row + Telegram ping.

✅ **M2 hit.**

---

## STEP 5 — Solana USDT Payment Detection  → **MILESTONE M3**

### 5a. Sign up at Helius (https://helius.dev)
Free tier covers initial volume. Copy your RPC URL.

### 5b. Configure Helius webhook
Dashboard → Webhooks → Create:
- Type: `Enhanced Transaction`
- Account: `<SOLANA_MULTISIG_ADDRESS>`
- Token type: USDT (SPL: `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`)
- Webhook URL: `https://texaspeptides.com/api/sol-webhook`
  (use ngrok URL for local dev)

### 5c. Build `app/api/sol-webhook/route.ts`
- Receives Helius enhanced transaction events
- Parses USDT transfer amount and recipient
- Looks up the Airtable order by amount + recency window (or use an
  on-chain memo containing the order ID — preferred, see 5d)
- On match: marks Airtable Status → Paid, stores Tx signature, decrements
  the correct fridge (use existing `pickFridge` + decrement logic from
  `paygate-webhook`)
- Sends Telegram "PAID" notification

### 5d. Update `/pay/[orderId]` page
- Display the Solana multisig address
- Show QR code: `solana:<addr>?spl-token=<usdt-mint>&amount=<usd>&memo=<orderId>`
- Auto-poll `/api/payment-status?orderId=...` every 10s
- Flip to "Paid" view when Airtable returns `Status = Paid`

### 5e. Update `/api/order/route.ts`
- Replace Paygate redirect with redirect to `/pay/[orderId]`
- Or: keep Paygate fallback for non-Sol coins (decision: drop Paygate for now,
  Sol-only matches the OneKey multisig setup)

### 5f. Test on Solana mainnet with $1 USDT
- Place an order
- Send 1 USDT from a personal wallet to the multisig
- Confirm: webhook fires → Airtable Paid → Telegram pings → page flips

✅ **M3 hit.**

---

## STEP 6 — Founder Cash Order Endpoint  → **MILESTONE M4**

### 6a. Generate `FOUNDER_SUBMIT_SECRET`
Run in PowerShell:
```powershell
[guid]::NewGuid().ToString("N")
```
Add to `.env`. Share with the 3 founders only (1Password / signal / paper).

### 6b. Update `app/api/order/route.ts`
- Accept optional `paymentMethod: "cash"` and `founderKey` in body
- If `paymentMethod === "cash"`:
  - Verify `founderKey === process.env.FOUNDER_SUBMIT_SECRET`
  - Skip Paygate / Solana payment flow
  - Write Airtable order with `Status = Paid` directly
  - Decrement fridge immediately (same logic as USDT webhook)
  - Set `Payment Chain = "Cash"`, leave `Tx Hash` empty

### 6c. Build minimal founder UI: `app/founder/order/page.tsx`
- Behind a "founder secret" gate (prompt for the secret on page load,
  store in `sessionStorage`, include with API call)
- Same fields as customer checkout + a `received_by` (which founder confirmed cash)
- Submits to `/api/order` with `paymentMethod: "cash"`

### 6d. Test
Submit a fake cash order → verify Airtable Paid + fridge decremented.

✅ **M4 hit.**

---

## STEP 7 — EmailJS Receipts (Friday)  → **MILESTONE M5**

### 7a. Setup
1. Create EmailJS account at https://emailjs.com
2. Connect Gmail (or SendGrid for higher volume)
3. Create two email templates with the variables documented in `PAYMENT.md`:
   - `USDT_ORDER_RECEIPT`
   - `CASH_ORDER_RECEIPT`
4. Copy Service ID, Public Key, both Template IDs into `.env`.

### 7b. Install SDK
```powershell
npm install @emailjs/nodejs
```

### 7c. Build `lib/email.ts`
```ts
import emailjs from "@emailjs/nodejs";

export async function sendReceipt(
  template: "usdt" | "cash",
  params: Record<string, string>
) {
  const templateId = template === "usdt"
    ? process.env.EMAILJS_TEMPLATE_USDT!
    : process.env.EMAILJS_TEMPLATE_CASH!;
  await emailjs.send(
    process.env.EMAILJS_SERVICE_ID!,
    templateId,
    params,
    { publicKey: process.env.EMAILJS_PUBLIC_KEY! }
  );
}
```

### 7d. Wire into both payment paths
- In `/api/sol-webhook` after Airtable marked Paid → `sendReceipt("usdt", {...})`
- In `/api/order` cash path after Airtable Paid → `sendReceipt("cash", {...})`

### 7e. Test
- Place a USDT test order → verify customer email receipt arrives
- Submit a cash order → verify cash receipt arrives

✅ **M5 hit.**

---

## STEP 8 — Zahlora Founder Commands  → **MILESTONE M6**

In `zahlora_bot/` repo:

### 8a. Add founder whitelist
In `bot.py`, gate certain commands:
```python
FOUNDER_IDS = set(int(x) for x in os.getenv("FOUNDER_TELEGRAM_IDS", "").split(",") if x)

def is_founder(update):
    return update.effective_user.id in FOUNDER_IDS
```

### 8b. Add system prompt updates
Append to `assistant.py` SYSTEM_PROMPT the additions listed in `zahlora.md`
(Consultations table, consult URL, founder commands).

### 8c. Test commands in founder DMs
- `stock` → list of products with available qty
- `pending orders` → list Status=Paid orders
- `mark shipped TXABCD1234 tracking 940011...` → updates Airtable
- `restock retatrutide-10mg T 10` → increments T Fridge

### 8d. Test customer flow in a separate Telegram account
- Confirm "I can't pay crypto" → bot replies with `/consult` URL
- Confirm normal stock/pricing/order flow still works

### 8e. Deploy Zahlora to Railway
Push the changes — Railway auto-deploys.

✅ **M6 hit.**

---

## STEP 9 — Production Deploy  → **MILESTONE M7**

### 9a. Push texas-peptides to GitHub `main`
```powershell
git add .
git commit -m "Payments, consult, receipts, Telegram notifications"
git push origin main
```

### 9b. Vercel
- Connect repo (if not already)
- Add ALL env vars from local `.env` to Vercel project settings
  (Airtable, Telegram, Solana, Founder secret, EmailJS, NEXT_PUBLIC_BASE_URL)
- Set `NEXT_PUBLIC_BASE_URL=https://texaspeptides.com`
- Deploy

### 9c. Update Helius webhook URL
Change the webhook from ngrok / localhost to:
```
https://texaspeptides.com/api/sol-webhook
```

### 9d. Live $1 USDT test on production
- Place a real order on the live site
- Pay $1 USDT from personal wallet
- Verify: Airtable Paid → Telegram pings → receipt email arrives → fridge count decreased
- Verify multisig wallet shows the USDT in OneKey

### 9e. Live consult test
- Submit `/consult` form with real data
- Verify Airtable Consultations row + Telegram ping

### 9f. Live cash test
- Submit a cash order via `/founder/order`
- Verify Airtable Paid + receipt email + Telegram ping

✅ **M7 hit. The store is operational.**

---

## STEP 10 — Operations Handoff (Monday)

1. All 3 founders walk through every flow together once.
2. Decide ongoing duties:
   - **Daily Airtable check** — who watches `Status = Paid` orders to ship
   - **Consult lead** — who responds to consult requests within 1 hour
   - **Cash entries** — any founder, must use `/founder/order`
   - **Inventory restocks** — who updates Airtable when shipments arrive
3. Print this doc and `FULFILLMENT_RUNBOOK.md` for reference.
4. Mark week_session.md complete.

---

## Quick `.env` Final State

By end of week, your `.env` should contain:

```bash
# Airtable
AIRTABLE_API_KEY=patzNSiDLH9yl1YwH...
AIRTABLE_BASE_ID=appm3SLm7J5WuNr9Y

# Telegram (Step 2)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
FOUNDER_TELEGRAM_IDS=

# Solana / OneKey (Step 1, 5)
SOLANA_MULTISIG_ADDRESS=
SOLANA_RPC_URL=

# Founder cash secret (Step 6)
FOUNDER_SUBMIT_SECRET=

# EmailJS (Step 7)
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_USDT=
EMAILJS_TEMPLATE_CASH=
EMAILJS_PUBLIC_KEY=

# Public URL (Step 9)
NEXT_PUBLIC_BASE_URL=https://texaspeptides.com
```

---

## Daily Checklist During Build

Each day, before stopping work:
- [ ] All env vars added so far are committed to a shared password manager
- [ ] Code changes pushed to GitHub
- [ ] Latest milestone tested end-to-end
- [ ] `week_session.md` updated with what's actually done

---

## If You Get Stuck

| Stuck on | Reference |
|----------|-----------|
| Payment flow architecture | `PAYMENT.md` |
| Consult form spec | `consult_checkout.md` |
| Zahlora behavior | `zahlora.md` |
| Daily ops after launch | `FULFILLMENT_RUNBOOK.md` |
| This week's schedule | `week_session.md` |
