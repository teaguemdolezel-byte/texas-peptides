import { fetchOrderByOrderId } from "@/lib/airtable";
import { getChainAddress, Chain, SUPPORTED_CHAINS } from "@/lib/payment";
import PayClient from "@/components/PayClient";

export const dynamic = "force-dynamic";

type SearchParams = {
  amt?: string;
  chain?: string;
  addr?: string;
  total?: string;
};

/**
 * The pay page is reachable two ways:
 *  1. With Airtable configured: we look up the order in Airtable.
 *  2. Without Airtable (dev / setup): the order data comes via URL params
 *     written by the checkout page.
 *
 * In production you want #1 so reloads keep working — but #2 is critical
 * during development before AIRTABLE_API_KEY is set.
 */
export default async function PayPage({
  params,
  searchParams,
}: {
  params: { orderId: string };
  searchParams: SearchParams;
}) {
  // Try Airtable first
  const order = await fetchOrderByOrderId(params.orderId);

  if (order) {
    const chain = (order.paymentChain ?? "Solana") as Chain;
    return (
      <PayClient
        orderId={order.orderId}
        paymentChain={chain}
        walletAddress={getChainAddress(chain) ?? null}
        paymentAmountCents={order.paymentAmountCents}
        totalCents={order.totalCents}
      />
    );
  }

  // Fallback: read order data from URL params (no Airtable required)
  const amt = parseInt(searchParams.amt ?? "0", 10);
  const total = parseInt(searchParams.total ?? String(amt), 10);
  const chain = (
    SUPPORTED_CHAINS.includes(searchParams.chain as Chain)
      ? searchParams.chain
      : "Solana"
  ) as Chain;
  const addr = searchParams.addr ?? getChainAddress(chain) ?? null;

  if (!amt) {
    // No Airtable record AND no URL data — order genuinely doesn't exist
    return (
      <div className="mx-auto max-w-2xl px-5 py-32 text-center">
        <p className="kicker eyebrow-line">Order not found</p>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-bone md:text-5xl">
          Hmm — we can&apos;t find {params.orderId}.
        </h1>
        <p className="mt-4 text-bone-300">
          Either the order expired or Airtable isn&apos;t connected yet. Start a
          fresh order from the catalog.
        </p>
        <a href="/products" className="btn-primary magnet mt-10 inline-flex">
          Back to products
        </a>
      </div>
    );
  }

  return (
    <PayClient
      orderId={params.orderId}
      paymentChain={chain}
      walletAddress={addr}
      paymentAmountCents={amt}
      totalCents={total}
    />
  );
}
