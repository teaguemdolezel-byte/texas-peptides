# Texas Peptides — API Endpoints

Complete catalog of every API route the site needs (existing + to-build),
including request/response shape, auth, side effects, and which Telegram
notification (if any) it fires.

---

## Notification Catalog (referenced throughout)

| Tag | When fired | Message format |
|-----|------------|----------------|
| `N1` | New USDT order submitted | 🧾 New order #TXABCD1234 · $199 · Retatrutide 10mg · Jane Doe · Austin TX |
| `N2` | Payment confirmed on-chain | ✅ PAID #TXABCD1234 · $199 USDT received · Tx: `abc123...` · Ship from: T Fridge |
| `N3` | New consult request | 📋 Consult request · Jane Doe · jane@example.com · "Looking for Retatrutide" |
| `N4` | Order shipped | 📦 Shipped #TXABCD1234 · Tracking: 9400111899223... |
| `N5` | Cash order submitted by founder | 💵 CASH PAID #TXABCD1234 · $199 · Retatrutide 10mg · Received by: Founder A |

All notifications are sent via `sendOrderToTelegram()` in `lib/telegram.ts`
to the founders group (`TELEGRAM_CHAT_ID`).

---

## Endpoint Status Legend

- ✅ **Live** — exists and works
- 🟡 **Exists, needs update** — file exists but missing functionality
- 🔴 **To build** — does not exist yet
- 🟤 **Deprecate** — exists but should be removed

---

## ORDERS

### `POST /api/order` 🟡 Exists, needs update

**Path:** `app/api/order/route.ts`

**Purpose:** Customer-facing checkout submission. Also handles founder cash entries.

**Request body:**
```ts
{
  customerName: string;
  email: string;
  phone?: string;
  shippingAddress: string;
  city: string;
  state: string;
  zip: string;
  items: { slug: string; quantity: number }[];
  notes?: string;

  // Optional founder-only fields (cash path):
  paymentMethod?: "usdt" | "cash";   // defaults to "usdt"
  founderKey?: string;               // required if paymentMethod === "cash"
  receivedBy?: string;               // founder name who confirmed cash
}
```

**Auth:** None for `paymentMethod=usdt`. For `paymentMethod=cash`, requires
`founderKey === process.env.FOUNDER_SUBMIT_SECRET`.

**Side effects:**
1. Validates payload + resolves catalog prices server-side (never trusts client)
2. Generates `TX + 8 char` order ID
3. Writes Airtable order:
   - USDT path → `Status = Pending payment`
   - Cash path → `Status = Paid` (skip step 4, decrement fridge immediately)
4. (USDT only) Returns `redirectTo: /pay/[orderId]` for the Sol checkout page
5. Fires **N1** (USDT) or **N5** (cash) Telegram notification
6. (Cash only) Triggers EmailJS `CASH_ORDER_RECEIPT`

**Response:**
```ts
{ ok: true, orderId, totalCents, redirectTo, paymentMethod }
```

**Updates needed:**
- Add `sendOrderToTelegram` import + call (N1 / N5)
- Add `paymentMethod` + `founderKey` + `receivedBy` handling (cash branch)
- Replace Paygate redirect with `/pay/[orderId]`
- Add EmailJS cash receipt call on cash path

---

### `GET /api/payment-status?orderId=TXABCD1234` ✅ Live (verify)

**Path:** `app/api/payment-status/route.ts`

**Purpose:** Polled by `/pay/[orderId]` page every 10s to check if payment landed.

**Request:** query string `orderId`

**Auth:** None (public — read-only by order ID)

**Response:**
```ts
{
  orderId: string;
  status: "Pending payment" | "Paid" | "Shipped" | "Delivered" | "Cancelled";
  paid: boolean;
  txHash?: string;
  fulfilledFrom?: "T" | "R" | "M";
}
```

**Updates needed:** verify it returns the shape above. Probably already does.

---

### `POST /api/sol-webhook` 🔴 To build

**Path:** `app/api/sol-webhook/route.ts`

**Purpose:** Receives Helius enhanced transaction webhooks for the OneKey
multisig. Confirms USDT payment for an order.

**Auth:** Verify Helius signature header (`Authorization` or shared secret).
Add `HELIUS_WEBHOOK_SECRET` to `.env`.

**Request body (Helius enhanced format):**
```ts
[{
  signature: string;
  timestamp: number;
  tokenTransfers: [{
    fromUserAccount: string;
    toUserAccount: string;     // must equal SOLANA_MULTISIG_ADDRESS
    mint: string;              // must equal USDT SPL mint
    tokenAmount: number;       // amount in USDT (decimals already applied)
  }];
  // Memo (optional but preferred) contains the order ID
}]
```

**Side effects:**
1. Validate signer/secret
2. For each transfer to multisig:
   - Look up Airtable order by memo (preferred) or by `paymentAmountCents` + recency
   - If `Status = Pending payment`:
     - Update Airtable: `Status → Paid`, `Tx Hash → signature`, `Payment Chain → "Solana USDT"`
     - Pick fridge via `pickFridge()`, set `Fulfilled From`
     - Decrement that fridge by ordered qty for each line item
     - Fire **N2** Telegram notification
     - Trigger EmailJS `USDT_ORDER_RECEIPT`
3. Return `200 OK` (Helius retries on non-2xx)

**Response:** `{ ok: true, processed: number }`

---

### `POST /api/order-shipped` 🟡 Exists, needs update

**Path:** `app/api/order-shipped/route.ts`

**Purpose:** Triggered when a founder marks an order as shipped (either via
the `/founder` UI or an Airtable automation calling this endpoint).

**Auth:** Requires `founderKey` header matching `FOUNDER_SUBMIT_SECRET`.

**Request body:**
```ts
{
  orderId: string;
  trackingNumber: string;
  shippedBy?: string;   // founder name
}
```

**Side effects:**
1. Update Airtable: `Status → Shipped`, `Tracking Number → ...`
2. Fire **N4** Telegram notification
3. (Optional) Trigger EmailJS `ORDER_SHIPPED` template to customer with tracking

**Response:** `{ ok: true }`

**Updates needed:** add **N4** notification + (optional) shipped email.

---

## CONSULTATIONS

### `POST /api/contact` 🔴 To build

**Path:** `app/api/contact/route.ts`

**Purpose:** Receives consult requests from `/consult` form.

**Auth:** None (public form — add basic rate limit if abused).

**Request body:**
```ts
{
  name: string;
  email: string;
  phone?: string;
  message: string;
  referral?: string;
}
```

**Side effects:**
1. Validate (name, email, message required)
2. Write to Airtable `Consultations` table with `Status = New`, `Source = "Web consult form"`
3. Fire **N3** Telegram notification

**Response:** `{ ok: true, consultId }`

---

### `POST /api/consult/update` 🔴 To build (optional, Phase 2)

**Path:** `app/api/consult/update/route.ts`

**Purpose:** Allow founders to update consult status from Zahlora bot or
admin UI without opening Airtable.

**Auth:** `founderKey` header.

**Request body:**
```ts
{
  consultId: string;
  status: "Scheduled" | "Approved" | "Declined" | "Completed";
  outcomeNotes?: string;
  assignedTo?: string;
}
```

**Side effects:** Updates the Consultations row in Airtable.

**Response:** `{ ok: true }`

---

## PRODUCTS / INVENTORY

### `GET /api/products` 🔴 To build

**Path:** `app/api/products/route.ts`

**Purpose:** Public read-only catalog endpoint. Used by Zahlora and any
external integrations.

**Auth:** None.

**Response:**
```ts
{
  products: [{
    slug, name, family, priceCents,
    onHand, committed, available,
    fridges: { T, R, M },
    imageUrl
  }]
}
```

**Side effects:** None — just calls `fetchProducts()` from `lib/airtable.ts`.

---

### `POST /api/inventory/restock` 🔴 To build

**Path:** `app/api/inventory/restock/route.ts`

**Purpose:** Allow founders (and Zahlora) to bump stock when shipments arrive.

**Auth:** `founderKey` header.

**Request body:**
```ts
{
  slug: string;
  fridge: "T" | "R" | "M";
  quantity: number;     // positive = restock; allow negative for corrections
  notes?: string;
}
```

**Side effects:**
1. Update Airtable Products record — increment the named fridge field
2. (Optional) Append to a `Stock History` table for audit
3. Fire Telegram notification: `📥 Restock · Retatrutide 10mg · T Fridge +10 (was 5, now 15)`

**Response:** `{ ok: true, newOnHand, fridges }`

---

## PAYGATE (legacy — deprecate)

### `POST /api/paygate-webhook` 🟤 Deprecate

**Path:** `app/api/paygate-webhook/route.ts`

**Reason:** We're moving to OneKey multisig + Helius. Paygate forwards to
a Trust Wallet which doesn't fit the 2-of-3 multisig requirement.

**Action:** Keep file in place until `/api/sol-webhook` is tested and live.
Then delete.

### `GET /api/paygate-debug` 🟤 Deprecate

Same — remove after Sol webhook is live.

---

## EMAILJS HOOK (internal helper — no route)

Not an HTTP endpoint — used internally by `/api/sol-webhook` and
`/api/order` (cash path).

**File:** `lib/email.ts` (to build Friday)

```ts
sendReceipt("usdt", { to_email, order_id, ... })
sendReceipt("cash", { to_email, order_id, received_by, ... })
sendReceipt("shipped", { to_email, order_id, tracking_number, ... })
```

---

## OPTIONAL / FUTURE

### `POST /api/zahlora/order` 🔴 Future

**Purpose:** Allow Zahlora bot to create orders directly (instead of writing
to Airtable from Python). Lets the website own the order-creation logic.

**Auth:** Shared secret `ZAHLORA_API_KEY`.

Same body as `/api/order` plus `source: "telegram"`.

### `GET /api/orders?status=Paid` 🔴 Future

**Purpose:** Founder-only listing endpoint for the admin UI.

**Auth:** `founderKey` header.

Returns paginated list of orders filtered by status.

---

## Summary Table — What to Build This Week

| Priority | Endpoint | Status | Notification | Day |
|----------|----------|--------|--------------|-----|
| P0 | `POST /api/order` (add Telegram + cash branch) | 🟡 update | N1, N5 | Wed |
| P0 | `POST /api/contact` | 🔴 build | N3 | Wed |
| P0 | `POST /api/sol-webhook` | 🔴 build | N2 | Thu |
| P1 | `POST /api/order-shipped` (add Telegram) | 🟡 update | N4 | Thu |
| P1 | `POST /api/inventory/restock` | 🔴 build | restock | Sat |
| P1 | `GET /api/products` | 🔴 build | — | Sat |
| P2 | `POST /api/consult/update` | 🔴 build | — | next sprint |
| P2 | `GET /api/orders` | 🔴 build | — | next sprint |
| — | `POST /api/paygate-webhook` | 🟤 delete after M3 | — | Sat |

---

## Auth Recap

| Auth method | Used by | Stored as |
|-------------|---------|-----------|
| None (public) | `/api/order` (USDT), `/api/contact`, `/api/products`, `/api/payment-status` | — |
| `founderKey` body/header | `/api/order` (cash), `/api/order-shipped`, `/api/inventory/restock`, `/api/consult/update` | `FOUNDER_SUBMIT_SECRET` env |
| Helius signature | `/api/sol-webhook` | `HELIUS_WEBHOOK_SECRET` env |
| Zahlora API key | `/api/zahlora/*` (future) | `ZAHLORA_API_KEY` env |

---

## Endpoint → Notification Map

```
POST /api/order        (USDT)  →  N1
POST /api/order        (cash)  →  N5
POST /api/sol-webhook          →  N2
POST /api/contact              →  N3
POST /api/order-shipped        →  N4
POST /api/inventory/restock    →  restock alert
```
