# Zahlora — Texas Peptides Role

Zahlora is an AI Telegram bot (Gemini Flash + Airtable) that serves two
audiences at once inside the same bot:

1. **Customers** — product Q&A, stock checks, order building, payment guidance
2. **Founders** — order notifications, consult alerts, inventory updates, daily ops

Repo: `C:\Users\Allied Gaming\Documents\GitHub\2026\zahlora_bot\`
Deployed on: Railway

---

## What Zahlora Does Today (live)

| Capability | How |
|------------|-----|
| Answer product questions | Gemini reads Products table via Airtable function calls |
| Check live stock | `list_records("Products")` — Available = Full Stock − Committed |
| Quote prices | Reads `Price` field; applies 15% discount for Influencer tier automatically |
| Build orders | Creates Customer → Order → Order Items records in Airtable sequentially |
| Stack recommendations | Gemini prompt + product knowledge |
| Morning briefing | `/briefing` command — daily ops summary |
| Customer CRM | Looks up / creates customer record by Telegram ID |

---

## What Zahlora Needs to Do for Texas Peptides

### 1. Founder Notification Channel (highest priority)

Zahlora must be the push notification layer for all order events. No founder
should have to watch Airtable — Zahlora pings the group.

**Events to notify:**

| Event | Trigger | Message format |
|-------|---------|----------------|
| New USDT order submitted | `POST /api/order` fires | 🧾 New order #TXABCD1234 · $199 · Retatrutide 10mg · Jane Doe · Austin TX |
| Payment confirmed on-chain | `/api/sol-webhook` fires | ✅ PAID #TXABCD1234 · $199 USDT received · Tx: `abc123...` · Ship from: T Fridge |
| New consult request | `POST /api/contact` fires | 📋 Consult request · Jane Doe · jane@example.com · "Looking for Retatrutide" |
| Order shipped (manual) | Airtable automation or API call | 📦 Shipped #TXABCD1234 · Tracking: 9400111899223...  |

**How it works:**  
Texas Peptides site calls `sendOrderToTelegram(message)` from `lib/telegram.ts`.
This hits the Telegram Bot API directly using `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`.
Zahlora does not need to receive these — the bot just relays them to the group chat.
The chat ID should be the **founders private group** (not the public bot).

### 2. Customer-Facing Concierge (Zahlora bot public)

Customers DM Zahlora on Telegram for:
- What's in stock
- How much does X cost
- I want to order Y
- What's a good stack for [goal]
- I can't pay crypto, what do I do → redirect to `/consult`

**Order flow via Zahlora DM:**

```
Customer: "I want Retatrutide 10mg"
Zahlora:  Checks stock → confirms available → asks for shipping address
Customer: "123 Main St, Austin TX 78701"
Zahlora:  Creates Customer record + Order record + Order Item in Airtable
          "Your order is set. Send [X] USDT on Solana to:"
          [multisig address]
          "Once I see the tx I'll confirm and get you shipped out."
```

On payment detection (Helius webhook → `/api/sol-webhook`):
- Airtable order → Paid
- Zahlora pings founders group with "PAID" notification
- EmailJS receipt fires to customer email

### 3. Consult Fallback Response

When a customer says they can't pay crypto in the Zahlora DM:

```
Customer: "I don't have crypto / can I pay cash?"
Zahlora:  "Totally — for cash orders we do a quick consult first.
           Fill this out and we'll reach out same day:
           https://texaspeptides.com/consult"
```

Configure this as a pattern in the Gemini system prompt (already partially
there — add the `/consult` URL explicitly).

### 4. Inventory Commands for Founders

Founders can DM Zahlora (or use the group) to check and update stock:

| Command / message | Action |
|-------------------|--------|
| `stock` | Lists all products with available units |
| `restock retatrutide T 10` | Increments T Fridge by 10 for Retatrutide |
| `pending orders` | Lists all Airtable orders with Status = Paid (not yet shipped) |
| `mark shipped TXABCD1234 tracking 9400...` | Updates Airtable order Status → Shipped + Tracking Number |

These require founder authentication. Implement via a whitelist of Telegram
user IDs stored in `.env` as `FOUNDER_TELEGRAM_IDS=id1,id2,id3`.
Commands from non-whitelisted IDs are ignored silently or redirected to
the customer concierge flow.

### 5. Airtable Tables Zahlora Reads/Writes

| Table | Read | Write |
|-------|------|-------|
| Products | stock, price | Fridge decrements on restock command |
| Orders | list paid/pending | Status updates (Shipped), Tracking Number |
| Order Items | line items for display | Created during order build |
| Customers | look up by Telegram ID | Create new customers |
| Consultations | list pending | — (written by the website) |
| Payments | payment status | Created on USDT confirmation |

---

## Config Required in Zahlora `.env`

```bash
# Already in zahlora_bot/.env — verify these match Texas Peptides Airtable
AIRTABLE_API_KEY=           # must be the Texas Peptides base PAT
AIRTABLE_BASE_ID=appm3SLm7J5WuNr9Y

# Zahlora bot token (from @BotFather — same token used in texas-peptides .env)
TELEGRAM_BOT_TOKEN=

# Founder whitelist — Telegram user IDs (integers), comma-separated
FOUNDER_TELEGRAM_IDS=

# For payment confirmation DMs to customers
NEXT_PUBLIC_BASE_URL=https://texaspeptides.com
```

---

## System Prompt Additions Needed

Add to `assistant.py` SYSTEM_PROMPT:

```
Consultations table fields: Name, Email, Phone, Message, Referral, Status, Source, Assigned To, Outcome Notes
  - Status values: New · Scheduled · Approved · Declined · Completed
  - List pending: list_records("Consultations", formula='{Status}="New"')

When a customer cannot pay crypto:
  - Always direct them to: https://texaspeptides.com/consult
  - Message: "For cash orders we do a quick consult first — fill this out and we'll reach out same day: https://texaspeptides.com/consult"

Founder commands (only for users in the FOUNDER_TELEGRAM_IDS whitelist):
  - "stock" → list all products with available units (Full Stock − Committed)
  - "pending orders" → list Orders where Status = Paid
  - "mark shipped [order_id] tracking [number]" → update order Status → Shipped, set Tracking Number
  - "restock [product] [fridge] [qty]" → increment the named fridge field on that product
```

---

## Deployment Notes

- Zahlora runs on **Railway** (always-on Python process, not serverless)
- Texas Peptides runs on **Vercel** (serverless Next.js)
- They share the same Airtable base — both read/write `appm3SLm7J5WuNr9Y`
- They use the same Telegram bot token — the bot serves both the founders group
  (for notifications) and individual customer DMs (for the concierge)
- No direct API calls between the two repos — Airtable is the shared data layer

---

## Connection Between Repos (Data Flow)

```
[texas-peptides (Vercel)] ──── writes orders/consultations ──► [Airtable]
                          ──── sends Telegram notifications ──► [Founders group]

[zahlora_bot (Railway)]   ──── reads/writes Airtable ──────────► [Airtable]
                          ──── handles customer DMs ────────────► [Customers]
                          ──── receives founder commands ────────► [Founders group]
```

The two repos are loosely coupled. Neither calls the other directly.
All state lives in Airtable. Telegram is the notification and command interface.
