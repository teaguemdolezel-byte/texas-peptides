# Consult Checkout — `/consult` Page

For customers who cannot pay in USDT on Solana. This page replaces the old
contact form for the peptide ordering use-case. It is **not** a self-serve
purchase — it is a gated request that requires founder approval.

---

## Page Purpose

> "I can't do crypto. Can I still buy?"

Yes — but through a consultation. The consult page:
1. Captures customer info and what they want
2. Pings the founders group via Zahlora bot
3. Writes a `Consultations` record to Airtable
4. A founder reaches out, schedules a call, decides yes/no
5. If approved → customer pays cash → founder manually submits the order

---

## Route: `/consult`

### UI Design (match site style)

```
[kicker]  Consultations
[h1]      Not doing crypto? Talk to us.
[subhead] We'll walk you through what we have, answer your questions,
          and if it's a good fit — we'll work out a way to make it happen.
```

**Form fields:**

| Field | Type | Required |
|-------|------|----------|
| Full name | text | yes |
| Email | email | yes |
| Phone | tel | no |
| What are you looking for? | textarea | yes |
| How did you hear about us? | text | no |

**Submit button:** `Request a consultation →`

**Post-submit state:**
```
We'll reach out within a few hours.
Austin business hours: Mon–Fri 9 AM–5 PM CT.
```

---

## API: `POST /api/contact`

### Request body

```ts
{
  name: string;
  email: string;
  phone?: string;
  message: string;        // "what are you looking for?"
  referral?: string;      // "how did you hear about us?"
}
```

### What the endpoint does

1. **Validates** — name, email, and message required.
2. **Writes to Airtable** — creates a record in the `Consultations` table:
   ```
   Name        → customer name
   Email       → customer email
   Phone       → customer phone (optional)
   Message     → what they're looking for
   Referral    → how they heard about us
   Status      → "New"
   Source      → "Web consult form"
   ```
3. **Fires Zahlora notification** — calls `sendOrderToTelegram()` with a
   formatted message to the founders group:
   ```
   📋 Consult request — Texas Peptides

   Name: Jane Doe
   Email: jane@example.com
   Phone: (512) 555-0100
   Message: "Looking for Retatrutide, can't do crypto"
   Referral: "Instagram"

   → Airtable: [link to record]
   ```
4. **Returns** `{ ok: true }` on success.

### Airtable — `Consultations` Table

Create this table in your Airtable base if it doesn't exist.

| Field | Type | Notes |
|-------|------|-------|
| Name | Single line text | Primary field |
| Email | Email | |
| Phone | Phone number | |
| Message | Long text | What they're looking for |
| Referral | Single line text | How they heard about us |
| Status | Single select | New · Scheduled · Approved · Declined · Completed |
| Source | Single line text | "Web consult form" |
| Assigned To | Single line text | Which founder is handling this |
| Outcome Notes | Long text | Filled after the call |
| Created | Created time | Auto |

---

## Founder Workflow After Form Submission

```
1. Zahlora bot pings founders group with customer details
2. Founder replies "I'll take this one" in the group
3. Founder emails/texts customer to schedule a 15-min call
4. On the call: answer questions, gauge seriousness, decide yes/no
5. In Airtable → Consultations:
     - Set Status → Approved or Declined
     - Fill Outcome Notes
     - Fill Assigned To
6. If Approved:
     - Agree on products and quantities
     - Provide Austin address for cash payment or arrange in-person
     - Once cash received, submit order via the founder cash endpoint:
         POST /api/order  { paymentMethod: "cash", founderKey: "...", ... }
     - Airtable order created → Paid (cash)
     - EmailJS cash receipt fires to customer
     - Founder ships from correct fridge
7. If Declined:
     - Politely email customer with reason (not a fit, legal, etc.)
     - Update Airtable Status → Declined
```

---

## Page File: `app/consult/page.tsx`

The component follows the same pattern as `app/checkout/page.tsx`:
- `"use client"` — handles form state locally
- On submit: POSTs to `/api/contact`
- Shows success state after response
- No redirect needed — stays on page with confirmation message

### API File: `app/api/contact/route.ts`

Mirrors the structure of `/api/order/route.ts`:
- `export const runtime = "nodejs"`
- Validates body fields
- Calls `recordConsultation()` from `lib/airtable.ts` (to be added)
- Calls `sendOrderToTelegram(formatConsultMessage(...))` from `lib/telegram.ts`
- Returns `{ ok: true }` or `{ error: "..." }`

---

## Link Placement

Add a "Can't do crypto?" link on the checkout and product pages:

```tsx
// In checkout/page.tsx — below the crypto note
<p className="mt-4 text-sm text-bone-400">
  Can&apos;t pay with crypto?{" "}
  <Link href="/consult" className="underline text-bone-200 hover:text-bone">
    Request a consultation →
  </Link>
</p>
```

Also add to Nav as a secondary link (or in footer).

---

## Testing

1. Submit the form with test data
2. Verify Airtable `Consultations` table has the new record with `Status = New`
3. Verify Zahlora sends the formatted message to the founders Telegram group
4. Confirm the form shows the success state
