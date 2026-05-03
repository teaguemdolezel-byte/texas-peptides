"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const totalCents = useCart((s) => s.totalCents());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="mx-auto max-w-3xl px-5 py-20 text-bone-400">Loading cart…</div>;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-32 text-center">
        <h1 className="font-display text-5xl font-bold uppercase tracking-tight text-bone">
          Cart is empty.
        </h1>
        <p className="mt-4 text-bone-300">
          Add Retatrutide or GHK-Cu to get started.
        </p>
        <Link href="/products" className="btn-primary magnet mt-10 inline-flex">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-20">
      <p className="kicker eyebrow-line">Cart</p>
      <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.9] tracking-tightest text-bone md:text-7xl">
        Your order.
      </h1>

      <div className="mt-12 divide-y divide-ash-200 border border-ash-400 bg-bg-2">
        {items.map((item) => (
          <div key={item.slug} className="flex flex-wrap items-center gap-4 p-6">
            <div className="grid h-16 w-16 place-items-center border border-ash-400 bg-bg-1 text-bone">
              <svg width="20" height="30" viewBox="0 0 80 120" fill="currentColor">
                <rect x="22" y="6" width="36" height="10" rx="1" opacity="0.85" />
                <rect x="26" y="62" width="28" height="40" rx="1" opacity="0.78" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${item.slug}`}
                className="font-display text-lg font-bold uppercase tracking-tight text-bone hover:text-ox-500"
              >
                {item.name}
              </Link>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-400">
                {formatPrice(item.priceCents)} each
              </p>
            </div>
            <div className="inline-flex items-center border border-ash-600">
              <button
                onClick={() => setQty(item.slug, item.quantity - 1)}
                className="px-3 py-1.5 text-bone-300 hover:text-bone"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => setQty(item.slug, item.quantity + 1)}
                className="px-3 py-1.5 text-bone-300 hover:text-bone"
              >
                +
              </button>
            </div>
            <div className="w-24 text-right font-mono text-bone">
              {formatPrice(item.priceCents * item.quantity)}
            </div>
            <button
              onClick={() => remove(item.slug)}
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-400 hover:text-ox-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-end gap-4">
        <div className="text-right">
          <p className="kicker">Subtotal</p>
          <p className="mt-2 font-display text-4xl font-bold text-bone">
            {formatPrice(totalCents)}
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-400">
            Shipping & USDC chain selected at checkout
          </p>
        </div>
        <Link href="/checkout" className="btn-ox magnet">
          Continue to checkout →
        </Link>
      </div>
    </div>
  );
}
