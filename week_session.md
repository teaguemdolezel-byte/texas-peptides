# Week Session — May 6–12, 2026

Sprint goal: get the store fully operational end-to-end.
Every order type (USDT + Cash) confirmed, receipts firing, consult page live.

---

## Day-by-Day Plan

### Wednesday May 6 (today)
- [x] Document payment architecture in `PAYMENT.md`
- [x] Document Zahlora's role in `zahlora.md`
- [x] Document consult flow in `consult_checkout.md`
- [ ] Build `/consult` page (form + Airtable write + Telegram ping)
- [ ] Wire `sendOrderToTelegram` into `/api/order/route.ts`
- [ ] Add `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` to `.env`

### Thursday May 7
- [ ] Swap Paygate → Solana USDT payment detection
  - Set up Helius webhook (or RPC polling fallback) on `SOLANA_MULTISIG_ADDRESS`
  - Update `/api/paygate-webhook` (or new `/api/sol-webhook`) to verify on-chain tx
  - On confirmation: Airtable → Paid, fridge decrement, Tx Hash recorded
- [ ] Build protected founder cash-order entry endpoint
  - `POST /api/order` with `paymentMethod: "cash"` + `founderKey` validation
  - Auto-decrements inventory same as USDT path
- [ ] Add `FOUNDER_SUBMIT_SECRET` to `.env`
- [ ] Add `SOLANA_MULTISIG_ADDRESS` + `SOLANA_RPC_URL` to `.env`
- [ ] Test full USDT order flow on devnet

### Friday May 9 — EmailJS Day
- [ ] Create EmailJS account at https://emailjs.com
- [ ] Connect email service (Gmail or SendGrid)
- [ ] Build `USDT_ORDER_RECEIPT` template (variables from `PAYMENT.md`)
- [ ] Build `CASH_ORDER_RECEIPT` template (variables from `PAYMENT.md`)
- [ ] Install `@emailjs/nodejs` — `npm install @emailjs/nodejs`
- [ ] Add EmailJS env vars to `.env`:
  ```
  EMAILJS_SERVICE_ID=
  EMAILJS_TEMPLATE_USDT=
  EMAILJS_TEMPLATE_CASH=
  EMAILJS_PUBLIC_KEY=
  ```
- [ ] Wire receipt send into `/api/sol-webhook` (USDT path)
- [ ] Wire receipt send into cash order endpoint
- [ ] Test both receipt paths end-to-end
- [ ] Send test order to real email — verify formatting

### Saturday May 10
- [ ] Deploy to Vercel / production
- [ ] Set all env vars in Vercel dashboard (not just local `.env`)
- [ ] Register Helius webhook against production URL
- [ ] Place a live $1 USDT test order on Solana mainnet
- [ ] Confirm: Airtable updates, Telegram pings, receipt arrives
- [ ] Smoke-test consult form → Telegram → Airtable

### Sunday May 11 (buffer / fix day)
- [ ] Fix any production bugs from Saturday testing
- [ ] Check Airtable inventory counts are correct
- [ ] Verify OneKey multisig received the test USDT
- [ ] Review Zahlora Telegram bot responds to `/stock` and order commands

### Monday May 12
- [ ] Team review — all three founders walk the full flows
- [ ] Assign ongoing operational responsibilities:
  - Who checks Airtable for paid orders daily
  - Who handles consult approvals
  - Who manages cash order entry
- [ ] Mark sprint complete

---

## .env Additions This Week

These all need to be added before the corresponding feature is tested:

```bash
# Telegram (needed: Wednesday)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Solana (needed: Thursday)
SOLANA_MULTISIG_ADDRESS=
SOLANA_RPC_URL=

# Founder cash orders (needed: Thursday)
FOUNDER_SUBMIT_SECRET=

# EmailJS (needed: Friday)
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_USDT=
EMAILJS_TEMPLATE_CASH=
EMAILJS_PUBLIC_KEY=

# Production
NEXT_PUBLIC_BASE_URL=https://texaspeptides.com
```

---

## Feature Checklist (end-of-week definition of done)

| Feature | Status |
|---------|--------|
| USDT checkout → on-chain detection → Airtable Paid | ⬜ |
| Fridge auto-decrement on payment | ⬜ |
| Telegram order notification to founders | ⬜ |
| USDT receipt email via EmailJS | ⬜ |
| `/consult` page → Airtable + Telegram | ⬜ |
| Founder cash order entry (protected API) | ⬜ |
| Cash receipt email via EmailJS | ⬜ |
| Zahlora responds to stock/order commands in Telegram | ⬜ |
| All env vars set in Vercel production | ⬜ |
| End-to-end live test (real USDT, real email) | ⬜ |
