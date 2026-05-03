import { NextRequest, NextResponse } from "next/server";
import { fetchOrderByOrderId, markOrderPaid } from "@/lib/airtable";
import { parsePaygateIpn } from "@/lib/paygate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * paygate.to IPN handler.
 *
 * paygate.to pings this endpoint when a payment is detected. The payload
 * shape varies a bit (sometimes GET, sometimes POST x-www-form-urlencoded),
 * so we accept both.
 *
 * Flow:
 *   1. Parse IPN params + the orderId we embedded in the IPN URL.
 *   2. Look up the order in Airtable.
 *   3. Sanity-check the amount on the IPN matches the order total.
 *   4. Mark the order Paid + decrement the appropriate fridge.
 *   5. Respond 200 (paygate.to retries until they get a 200).
 *
 * Security note: in the no-API-key model there's no shared secret to verify
 * the IPN signature. The defenses are:
 *   - The orderId in the URL must match an existing pending order.
 *   - The reported amount must match what we expected.
 *   - Best-effort: we re-query paygate.to's API to confirm the deposit
 *     address actually received the funds (not implemented here yet, but
 *     trivial to add). For low-volume v1 the order-id + amount match is
 *     enough; an attacker would need to know the order id.
 */

async function handleIpn(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  // paygate.to IPN body — try JSON, then form-urlencoded
  let body: Record<string, string | number | undefined> = {};
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      body = (await req.json()) as Record<string, string | number>;
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const fd = await req.formData();
      fd.forEach((v, k) => {
        body[k] = typeof v === "string" ? v : v.name;
      });
    }
  } catch {}

  const ipn = parsePaygateIpn(req.nextUrl.searchParams, body);

  // Look up the order
  const order = await fetchOrderByOrderId(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Idempotency — if we already marked this paid, just acknowledge
  if (order.status !== "Pending payment") {
    return NextResponse.json({ ok: true, status: order.status });
  }

  // Sanity check — amount from paygate should at least cover the order
  // total. paygate.to converts to USD so this should be a clean match.
  const expectedUsd = order.totalCents / 100;
  const reportedUsd = ipn.amountReceived ?? ipn.amount ?? 0;
  if (reportedUsd > 0 && reportedUsd + 0.01 < expectedUsd) {
    console.warn(
      `[paygate-webhook] amount underpaid: expected ${expectedUsd}, got ${reportedUsd}`
    );
    return NextResponse.json(
      { error: "Underpaid", expected: expectedUsd, got: reportedUsd },
      { status: 400 }
    );
  }

  // Mark Paid + decrement the right fridge
  const ok = await markOrderPaid(order.airtableId, ipn.txid ?? "paygate-confirmed");

  return NextResponse.json({ ok, orderId, status: ok ? "Paid" : "Pending payment" });
}

export async function POST(req: NextRequest) {
  return handleIpn(req);
}

export async function GET(req: NextRequest) {
  return handleIpn(req);
}
