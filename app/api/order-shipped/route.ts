import { NextRequest, NextResponse } from "next/server";
import { fetchOrderByOrderId, markOrderShipped, Fridge } from "@/lib/airtable";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Called by an Airtable Automation when the admin flips an order to
 * "Shipped" with a Fulfilled From fridge tag. Decrements the right fridge
 * and the product's Committed counter, sets Tracking Number on the order.
 *
 * See FULFILLMENT_RUNBOOK.md → "Airtable Automation 3" for setup.
 *
 * Auth: a shared secret in the Authorization header. Keep it in env
 * (ADMIN_WEBHOOK_SECRET) and reference it from your Airtable script.
 */

const SECRET = process.env.ADMIN_WEBHOOK_SECRET;

async function handle(req: NextRequest) {
  // Auth — header `Authorization: Bearer <secret>` OR query `?token=...`
  if (SECRET) {
    const auth = req.headers.get("authorization") ?? "";
    const tokenInQuery = req.nextUrl.searchParams.get("token") ?? "";
    const provided = auth.replace(/^Bearer\s+/i, "") || tokenInQuery;
    if (provided !== SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: { orderId?: string; fridge?: Fridge; trackingNumber?: string } = {};
  try {
    if (req.method === "POST") {
      body = await req.json();
    } else {
      body = {
        orderId: req.nextUrl.searchParams.get("orderId") ?? undefined,
        fridge: (req.nextUrl.searchParams.get("fridge") as Fridge) ?? undefined,
        trackingNumber:
          req.nextUrl.searchParams.get("trackingNumber") ?? undefined,
      };
    }
  } catch {}

  const { orderId, fridge, trackingNumber } = body;
  if (!orderId || !fridge || !["T", "R", "M"].includes(fridge)) {
    return NextResponse.json(
      { error: "orderId and fridge (T|R|M) required" },
      { status: 400 }
    );
  }

  const order = await fetchOrderByOrderId(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const ok = await markOrderShipped(order.airtableId, fridge, trackingNumber);
  return NextResponse.json({ ok, orderId });
}

export async function POST(req: NextRequest) {
  return handle(req);
}
export async function GET(req: NextRequest) {
  return handle(req);
}
