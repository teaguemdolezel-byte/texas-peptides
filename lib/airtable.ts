/**
 * Airtable backend.
 *
 * Reads live products + stock + price from Airtable when env vars are
 * configured; falls back to data/products.ts otherwise.
 *
 * Inventory model:
 *   On Hand   = T Fridge + R Fridge + M Fridge (physical inventory)
 *   Committed = paid orders not yet shipped (reserved)
 *   Available = On Hand - Committed
 *
 * Pricing: single Price field in Airtable. No dynamic interpolation.
 *
 * Required env vars:
 *   AIRTABLE_API_KEY      personal access token
 *   AIRTABLE_BASE_ID      e.g. "appm3SLm7J5WuNr9Y"
 *   AIRTABLE_PRODUCTS_TBL defaults to "Products"
 *   AIRTABLE_ORDERS_TBL   defaults to "Orders"
 */

import { PRODUCTS as FALLBACK, Product } from "@/data/products";

const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const PRODUCTS_TBL = process.env.AIRTABLE_PRODUCTS_TBL ?? "Products";
const ORDERS_TBL = process.env.AIRTABLE_ORDERS_TBL ?? "Orders";

const ENDPOINT = (table: string) =>
  `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(table)}`;

function isConfigured() {
  return Boolean(API_KEY && BASE_ID);
}

type AirtableProductRecord = {
  id: string;
  fields: {
    Slug?: string;
    Name?: string;
    "Short Name"?: string;
    Family?: string;
    Tagline?: string;
    "Short Description"?: string;
    "Long Description"?: string;
    Bullets?: string;
    Sequence?: string;
    "Molecular Weight"?: string;
    Purity?: string;
    Size?: string;
    Price?: number;
    Committed?: number;
    "T Fridge"?: number;
    "R Fridge"?: number;
    "M Fridge"?: number;
    Image?: Array<{
      id: string;
      url: string;
      filename: string;
      thumbnails?: {
        small?: { url: string; width: number; height: number };
        large?: { url: string; width: number; height: number };
        full?: { url: string; width: number; height: number };
      };
    }>;
  };
};

export type Fridge = "T" | "R" | "M";

export type ProductWithFridges = Product & {
  airtableId?: string;
  fridges: { T: number; R: number; M: number };
};

function fromRecord(r: AirtableProductRecord): ProductWithFridges | null {
  const f = r.fields;
  if (!f.Slug || !f.Name) return null;
  const t = f["T Fridge"] ?? 0;
  const rr = f["R Fridge"] ?? 0;
  const m = f["M Fridge"] ?? 0;
  const onHand = t + rr + m;
  const committed = f.Committed ?? 0;
  const firstImg = f.Image?.[0];
  const imageUrl = firstImg
    ? firstImg.thumbnails?.large?.url ?? firstImg.url
    : undefined;
  return {
    airtableId: r.id,
    slug: f.Slug,
    name: f.Name,
    shortName: f["Short Name"] ?? f.Name,
    family: (f.Family as Product["family"]) ?? "GLP-1",
    tagline: f.Tagline ?? "",
    shortDescription: f["Short Description"] ?? "",
    longDescription: f["Long Description"] ?? "",
    bullets: (f.Bullets ?? "").split("\n").filter(Boolean),
    sequence: f.Sequence,
    molecularWeight: f["Molecular Weight"],
    purity: f.Purity ?? "",
    size: f.Size ?? "",
    priceCents: Math.round((f.Price ?? 0) * 100),
    onHand,
    committed,
    imageUrl,
    imageAlt: firstImg?.filename,
    fridges: { T: t, R: rr, M: m },
  };
}

/**
 * Pick which fridge to fulfill an order from. Strategy: highest stock first.
 */
export function pickFridge(fridges: { T: number; R: number; M: number }): Fridge | null {
  const entries: [Fridge, number][] = [
    ["T", fridges.T],
    ["R", fridges.R],
    ["M", fridges.M],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  if (entries[0][1] <= 0) return null;
  return entries[0][0];
}

export async function fetchProducts(): Promise<ProductWithFridges[]> {
  if (!isConfigured()) {
    return FALLBACK.map((p) => ({ ...p, fridges: { T: 0, R: 0, M: 0 } }));
  }
  try {
    const res = await fetch(ENDPOINT(PRODUCTS_TBL), {
      headers: { Authorization: `Bearer ${API_KEY}` },
      next: { revalidate: 10 },
    });
    if (!res.ok) {
      console.warn("[airtable] products fetch failed", res.status);
      return FALLBACK.map((p) => ({ ...p, fridges: { T: 0, R: 0, M: 0 } }));
    }
    const data = (await res.json()) as { records: AirtableProductRecord[] };
    const parsed = data.records
      .map(fromRecord)
      .filter(Boolean) as ProductWithFridges[];
    return parsed.length
      ? parsed
      : FALLBACK.map((p) => ({ ...p, fridges: { T: 0, R: 0, M: 0 } }));
  } catch (e) {
    console.warn("[airtable] products fetch error", e);
    return FALLBACK.map((p) => ({ ...p, fridges: { T: 0, R: 0, M: 0 } }));
  }
}

export async function fetchProduct(slug: string): Promise<ProductWithFridges | null> {
  const all = await fetchProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

async function fetchProductRaw(slug: string): Promise<ProductWithFridges | null> {
  if (!isConfigured()) return null;
  try {
    const formula = `{Slug}='${slug.replace(/'/g, "\\'")}'`;
    const url = `${ENDPOINT(PRODUCTS_TBL)}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { records: AirtableProductRecord[] };
    const r = data.records[0];
    return r ? fromRecord(r) : null;
  } catch {
    return null;
  }
}

// ─────────────────────── Orders ───────────────────────

export type OrderStatus =
  | "Pending payment"
  | "Paid"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type Order = {
  airtableId: string;
  orderId: string;
  customerName: string;
  email: string;
  phone?: string;
  shipTo: string;
  shippingMethod: "standard" | "austin-same-day";
  items: string;
  totalCents: number;
  paymentAmountCents: number;
  paymentChain?: string;
  txHash?: string;
  status: OrderStatus;
  fulfilledFrom?: Fridge;
  trackingNumber?: string;
  notes?: string;
  createdAt?: string;
};

export type CreateOrderInput = {
  orderId: string;
  customerName: string;
  email: string;
  phone?: string;
  shippingAddress: string;
  city: string;
  state: string;
  zip: string;
  shippingMethod: "standard" | "austin-same-day";
  items: { slug: string; name: string; quantity: number; unitPriceCents: number }[];
  totalCents: number;
  paymentAmountCents: number;
  paymentChain: string;
  notes?: string;
};

export async function recordOrder(o: CreateOrderInput): Promise<{ id: string } | null> {
  if (!isConfigured()) return null;
  try {
    const res = await fetch(ENDPOINT(ORDERS_TBL), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          "Order ID": o.orderId,
          Customer: o.customerName,
          Email: o.email,
          Phone: o.phone ?? "",
          "Ship To": `${o.shippingAddress}\n${o.city}, ${o.state} ${o.zip}`,
          "Shipping Method": o.shippingMethod,
          Items: o.items
            .map(
              (i) =>
                `${i.quantity}× ${i.name} ($${(i.unitPriceCents / 100).toFixed(2)})`
            )
            .join("\n"),
          "Total USD": o.totalCents / 100,
          "Payment Amount": o.paymentAmountCents / 100,
          "Payment Chain": o.paymentChain,
          Status: "Pending payment",
          Notes: o.notes ?? "",
        },
      }),
    });
    if (!res.ok) {
      console.warn("[airtable] order record failed", res.status, await res.text());
      return null;
    }
    const data = (await res.json()) as { id: string };
    return { id: data.id };
  } catch (e) {
    console.warn("[airtable] order record error", e);
    return null;
  }
}

export async function fetchOrderByOrderId(orderId: string): Promise<Order | null> {
  if (!isConfigured()) return null;
  try {
    const formula = `{Order ID}='${orderId.replace(/'/g, "\\'")}'`;
    const url = `${ENDPOINT(ORDERS_TBL)}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { records: any[] };
    const r = data.records[0];
    if (!r) return null;
    const f = r.fields;
    return {
      airtableId: r.id,
      orderId: f["Order ID"],
      customerName: f.Customer ?? "",
      email: f.Email ?? "",
      phone: f.Phone,
      shipTo: f["Ship To"] ?? "",
      shippingMethod: f["Shipping Method"] ?? "standard",
      items: f.Items ?? "",
      totalCents: Math.round((f["Total USD"] ?? 0) * 100),
      paymentAmountCents: Math.round((f["Payment Amount"] ?? 0) * 100),
      paymentChain: f["Payment Chain"],
      txHash: f["Tx Hash"],
      status: f.Status ?? "Pending payment",
      fulfilledFrom: f["Fulfilled From"],
      trackingNumber: f["Tracking Number"],
      notes: f.Notes,
      createdAt: r.createdTime,
    };
  } catch {
    return null;
  }
}

/**
 * Parse the Items field (e.g. "1× Retatrutide 10mg ($199.00)\n2× GHK-Cu 50mg ($89.00)")
 * back into structured lots {slug, quantity}.
 */
async function parseLots(itemsRaw: string): Promise<{ slug: string; quantity: number }[]> {
  const lines = (itemsRaw ?? "").split("\n").filter(Boolean);
  const products = await fetchProducts();
  const lots: { slug: string; quantity: number }[] = [];
  for (const line of lines) {
    const m = line.match(/^(\d+)×\s+(.+?)\s*\(\$/);
    if (!m) continue;
    const qty = parseInt(m[1], 10);
    const name = m[2].trim();
    const product = products.find((p) => p.name === name);
    if (product) lots.push({ slug: product.slug, quantity: qty });
  }
  return lots;
}

/**
 * Mark an order as Paid. INCREMENTS each product's Committed count by the
 * order quantity. Does NOT touch the physical fridge counts — those move
 * when the admin marks the order Shipped.
 */
export async function markOrderPaid(
  airtableId: string,
  txHash: string
): Promise<boolean> {
  if (!isConfigured()) return false;

  const oRes = await fetch(`${ENDPOINT(ORDERS_TBL)}/${airtableId}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
    cache: "no-store",
  });
  if (!oRes.ok) return false;
  const oData = (await oRes.json()) as { fields: any };
  const itemsRaw: string = oData.fields["Items"] ?? "";
  const lots = await parseLots(itemsRaw);

  // Increment Committed on each product by the order quantity. This
  // reserves the inventory but doesn't pull from any fridge yet.
  for (const lot of lots) {
    const fresh = await fetchProductRaw(lot.slug);
    if (!fresh?.airtableId) continue;
    const next = (fresh.committed ?? 0) + lot.quantity;
    await fetch(`${ENDPOINT(PRODUCTS_TBL)}/${fresh.airtableId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields: { Committed: next } }),
    });
  }

  // Update the order itself
  try {
    const res = await fetch(`${ENDPOINT(ORDERS_TBL)}/${airtableId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: { Status: "Paid", "Tx Hash": txHash },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Called when the admin flips an order to Shipped (typically via an
 * Airtable Automation hitting /api/order-shipped).
 *
 * Decrements the chosen fridge by the order quantity AND decrements the
 * Committed counter by the same amount. This is when On Hand actually
 * decreases.
 *
 * Idempotent — if the order is already Shipped, no-op.
 */
export async function markOrderShipped(
  airtableId: string,
  fridge: Fridge,
  trackingNumber?: string
): Promise<boolean> {
  if (!isConfigured()) return false;

  const oRes = await fetch(`${ENDPOINT(ORDERS_TBL)}/${airtableId}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
    cache: "no-store",
  });
  if (!oRes.ok) return false;
  const oData = (await oRes.json()) as { fields: any };

  // Idempotency check
  if (oData.fields.Status === "Shipped" || oData.fields.Status === "Delivered") {
    return true;
  }

  const itemsRaw: string = oData.fields["Items"] ?? "";
  const lots = await parseLots(itemsRaw);
  const fieldName = `${fridge} Fridge`;

  for (const lot of lots) {
    const fresh = await fetchProductRaw(lot.slug);
    if (!fresh?.airtableId) continue;
    const fridgeCount = fresh.fridges[fridge] ?? 0;
    const newFridge = Math.max(0, fridgeCount - lot.quantity);
    const newCommitted = Math.max(0, (fresh.committed ?? 0) - lot.quantity);
    await fetch(`${ENDPOINT(PRODUCTS_TBL)}/${fresh.airtableId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: { [fieldName]: newFridge, Committed: newCommitted },
      }),
    });
  }

  try {
    const res = await fetch(`${ENDPOINT(ORDERS_TBL)}/${airtableId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Status: "Shipped",
          "Fulfilled From": fridge,
          ...(trackingNumber ? { "Tracking Number": trackingNumber } : {}),
        },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
