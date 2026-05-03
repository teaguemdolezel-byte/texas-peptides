import { NextRequest, NextResponse } from "next/server";
import { recordOrder, fetchProducts } from "@/lib/airtable";
import { currentPriceCents } from "@/data/products";
import { createPaygateSession, isPaygateConfigured } from "@/lib/paygate";

export const runtime = "nodejs";

type IncomingItem = { slug: string; quantity: number };
type IncomingOrder = {
  customerName: string;
  email: string;
  phone?: string;
  shippingAddress: string;
  city: string;
  state: string;
  zip: string;
  items: IncomingItem[];
  notes?: string;
};

function newOrderId() {
  // 10-char ID: TX + 8 chars [A-Z0-9] (avoiding ambiguous chars like 0/O/I/1)
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let id = "TX";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export async function POST(req: NextRequest) {
  let body: IncomingOrder;
  try {
    body = (await req.json()) as IncomingOrder;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    !body.customerName ||
    !body.email ||
    !body.shippingAddress ||
    !body.city ||
    !body.state ||
    !body.zip ||
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Resolve products + dynamic prices server-side. Never trust the client.
  const catalog = await fetchProducts();
  const resolved = body.items
    .map((it) => {
      const p = catalog.find((c) => c.slug === it.slug);
      if (!p) return null;
      return {
        slug: p.slug,
        name: p.name,
        quantity: Math.max(1, Math.floor(it.quantity)),
        unitPriceCents: currentPriceCents(p),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (resolved.length === 0) {
    return NextResponse.json({ error: "No valid items" }, { status: 400 });
  }

  const totalCents = resolved.reduce(
    (sum, i) => sum + i.unitPriceCents * i.quantity,
    0
  );

  const orderId = newOrderId();

  // Mint a paygate.to checkout session (best-effort; if not configured we
  // fall back to the local /pay screen so dev still works).
  const paygate = await createPaygateSession({
    orderId,
    totalCents,
    customerEmail: body.email,
  });

  // Record in Airtable as Pending payment
  const recorded = await recordOrder({
    orderId,
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
    paymentAmountCents: totalCents, // no per-order suffix anymore
    paymentChain: "Polygon",
    notes: body.notes,
  });

  // Always return a redirectTo. If paygate is wired we send them to the
  // hosted crypto checkout; otherwise we send them straight to the order
  // confirmation page with a "payment not yet configured" notice.
  const redirectTo =
    paygate?.checkoutUrl ?? `/order/${encodeURIComponent(orderId)}?status=pending`;

  return NextResponse.json({
    ok: true,
    orderId,
    airtableId: recorded?.id ?? null,
    totalCents,
    redirectTo,
    paygateConfigured: isPaygateConfigured(),
  });
}
