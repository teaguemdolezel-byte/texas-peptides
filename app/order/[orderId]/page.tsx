import Link from "next/link";
import { fetchOrderByOrderId, OrderStatus } from "@/lib/airtable";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUSES: OrderStatus[] = [
  "Pending payment",
  "Paid",
  "Shipped",
  "Delivered",
];

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: { orderId: string };
  searchParams: { status?: string; paid?: string };
}) {
  const order = await fetchOrderByOrderId(params.orderId);

  // Order not found in Airtable — usually means env vars aren't set up yet.
  // Render a friendly placeholder instead of 404.
  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-32 text-center">
        <p className="kicker eyebrow-line">Order received</p>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-bone md:text-5xl">
          {params.orderId}
        </h1>
        <p className="mt-6 text-base text-bone-300">
          We&apos;ve got your order. Once Airtable + crypto checkout are
          configured (see <code className="font-mono text-bone">SETUP_PAYGATE.md</code>),
          this page will show your live payment status, tracking, and
          delivery progress.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Link href="/" className="btn-secondary magnet">Back to home</Link>
          <Link href="/contact" className="btn-secondary magnet">Need help?</Link>
        </div>
      </div>
    );
  }

  const idx = STATUSES.indexOf(order.status as OrderStatus);
  const stageIdx = idx >= 0 ? idx : 0;
  const isPending = order.status === "Pending payment";

  const explorer = order.txHash
    ? explorerUrl(order.paymentChain ?? "Polygon", order.txHash)
    : null;

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <p className="kicker eyebrow-line">Order</p>
      <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tightest text-bone md:text-6xl">
        {order.orderId}
      </h1>
      <p className="mt-4 text-base text-bone-300">
        Thanks, {order.customerName.split(" ")[0] || "friend"}. Here&apos;s the live status.
      </p>

      {/* Progress strip */}
      <div className="mt-12 grid grid-cols-4 gap-2">
        {STATUSES.map((s, i) => (
          <div key={s}>
            <div
              className={`h-1.5 w-full ${
                i <= stageIdx ? "bg-ox-500" : "bg-ash-400"
              }`}
            />
            <p
              className={`mt-3 font-mono text-[10px] uppercase tracking-[0.18em] ${
                i <= stageIdx ? "text-bone" : "text-bone-400"
              }`}
            >
              {s}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="border border-ash-400 bg-bg-2 p-6">
          <p className="kicker">Status</p>
          <p className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-bone">
            {order.status}
          </p>

          {isPending && (
            <p className="mt-3 text-sm leading-relaxed text-bone-300">
              Payment hasn&apos;t reached our wallet yet. If you&apos;ve already
              paid, this page updates automatically within a minute. If you
              haven&apos;t, please reach out below — we&apos;ll send you a
              fresh payment link.
            </p>
          )}

          {order.trackingNumber && (
            <div className="mt-4">
              <p className="kicker">Tracking</p>
              <p className="mt-1 font-mono text-sm text-bone">{order.trackingNumber}</p>
            </div>
          )}
          {explorer && (
            <a
              href={explorer}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex font-mono text-[11px] uppercase tracking-[0.2em] text-bone-300 underline-offset-4 hover:text-bone hover:underline"
            >
              View payment on chain →
            </a>
          )}
        </div>

        <div className="border border-ash-400 bg-bg-2 p-6">
          <p className="kicker">Order details</p>
          <dl className="mt-4 space-y-2 text-sm">
            <Row k="Items" v={<span className="whitespace-pre-line">{order.items}</span>} />
            <Row k="Total" v={formatPrice(order.totalCents)} />
            <Row k="Shipping" v="Same-day USPS Priority" />
            <Row k="Ship to" v={<span className="whitespace-pre-line">{order.shipTo}</span>} />
            <Row k="Email" v={order.email} />
            {order.phone && <Row k="Phone" v={order.phone} />}
          </dl>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/" className="btn-secondary magnet">
          Back to home
        </Link>
        <Link href="/contact" className="btn-secondary magnet">
          Need help?
        </Link>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-start gap-3 border-b border-ash-200 pb-2">
      <dt className="kicker">{k}</dt>
      <dd className="text-bone-200">{v}</dd>
    </div>
  );
}

function explorerUrl(chain: string, hash: string): string {
  const c = chain.toLowerCase();
  if (c.includes("solana")) return `https://solscan.io/tx/${hash}`;
  if (c.includes("base")) return `https://basescan.org/tx/${hash}`;
  if (c.includes("polygon")) return `https://polygonscan.com/tx/${hash}`;
  return `https://etherscan.io/tx/${hash}`;
}
