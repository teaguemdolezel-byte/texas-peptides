"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const totalCents = useCart((s) => s.totalCents());

  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          shippingAddress: form.get("street"),
          city: form.get("city"),
          state: form.get("state"),
          zip: form.get("zip"),
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          notes: form.get("notes"),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      // /api/order always returns a redirectTo — either paygate.to's hosted
      // checkout or a local /order/[orderId] confirmation.
      if (data.redirectTo?.startsWith("http")) {
        window.location.href = data.redirectTo;
      } else {
        router.push(data.redirectTo);
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  if (!mounted) return <div className="mx-auto max-w-3xl px-5 py-20 text-bone-400">Loading…</div>;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-32 text-center">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-bone md:text-5xl">
          Nothing to check out.
        </h1>
        <Link href="/products" className="btn-primary magnet mt-10 inline-flex">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="kicker eyebrow-line">Checkout</p>
      <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tightest text-bone md:text-6xl">
        Ship & Pay.
      </h1>
      <p className="mt-4 max-w-xl text-base text-bone-300">
        Fill in shipping, then continue to crypto checkout. Pay with BTC, ETH,
        USDT or USDC — funds settle directly to our wallet, no middleman.
      </p>

      <div className="mt-14 grid gap-12 md:grid-cols-[1fr_400px]">
        <form onSubmit={onSubmit} className="space-y-10">
          <Section legend="Contact">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full name" name="name" required />
              <Field label="Email" type="email" name="email" required />
              <Field label="Phone (for delivery)" name="phone" />
              <Field label="Telegram (optional)" name="telegram" placeholder="@yourname" />
            </div>
          </Section>

          <Section legend="Shipping address">
            <div className="grid gap-5 md:grid-cols-2">
              <Field className="md:col-span-2" label="Street address" name="street" required />
              <Field label="City" name="city" required />
              <Field label="State" name="state" required />
              <Field label="ZIP" name="zip" required />
              <Field label="Country" name="country" defaultValue="USA" required />
            </div>
          </Section>

          <Section legend="Notes (optional)">
            <textarea
              name="notes"
              rows={3}
              placeholder="Gate code, leave at door, etc."
              className="w-full border border-ash-600 bg-bg-2 px-4 py-3 text-sm text-bone placeholder:text-bone-400 focus:border-bone focus:outline-none"
            />
          </Section>

          <Section legend="Research-use acknowledgement">
            <label className="flex items-start gap-3 text-sm text-bone-200">
              <input type="checkbox" required className="mt-1 h-4 w-4 accent-ox-500" />
              <span>
                I confirm I am purchasing for laboratory research only and not for
                human or veterinary consumption. I&apos;ve read the{" "}
                <Link href="/disclaimer" className="underline hover:text-bone">
                  research-use disclaimer
                </Link>
                .
              </span>
            </label>
          </Section>

          {errorMsg && (
            <p className="border border-ox-500 bg-ox-500/10 px-4 py-3 text-sm text-ox-400">
              {errorMsg}
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn-ox magnet w-full disabled:opacity-50">
            {submitting ? "Creating order…" : "Continue to crypto checkout →"}
          </button>

          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-400">
            Secure crypto checkout · BTC / ETH / USDT / USDC accepted · funds settle directly to our wallet
          </p>
        </form>

        <aside className="h-fit border border-ash-400 bg-bg-2 p-7">
          <p className="kicker">Order summary</p>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li
                key={item.slug}
                className="flex justify-between border-b border-ash-200 pb-3 text-sm"
              >
                <span className="text-bone-200">
                  {item.name}
                  <span className="ml-1 text-bone-400">× {item.quantity}</span>
                </span>
                <span className="font-mono text-bone">
                  {formatPrice(item.priceCents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-2 text-sm">
            <Row k="Subtotal" v={formatPrice(totalCents)} />
            <Row k="Shipping" v="Same-day USPS · standard rate" />
            <div className="mt-3 flex justify-between border-t border-ash-200 pt-3 text-base">
              <span className="font-display font-bold uppercase text-bone">Total</span>
              <span className="font-display font-bold text-bone">
                {formatPrice(totalCents)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="kicker">{legend}</legend>
      <div className="mt-4">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-bone-400">
        {label}
      </span>
      <input
        {...props}
        className="mt-2 w-full border border-ash-600 bg-bg-2 px-4 py-3 text-sm text-bone placeholder:text-bone-400 focus:border-bone focus:outline-none"
      />
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-bone-300">
      <span>{k}</span>
      <span>{v}</span>
    </div>
  );
}
