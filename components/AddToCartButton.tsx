"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";

export default function AddToCartButton({
  product,
  isPreorder = false,
}: {
  product: { slug: string; name: string; priceCents: number };
  isPreorder?: boolean;
}) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add(
      {
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center border border-ash-600 bg-bg-2">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-2.5 text-bone-300 hover:text-bone"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-6 text-center text-sm">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-4 py-2.5 text-bone-300 hover:text-bone"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button onClick={onAdd} className={isPreorder ? "btn-secondary magnet" : "btn-ox magnet"}>
          {added
            ? "Added ✓"
            : isPreorder
            ? "Pre-order →"
            : "Add to cart →"}
        </button>
      </div>
      {isPreorder && (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-400">
          Out of stock · Pre-orders ship in 7–10 days
        </p>
      )}
    </div>
  );
}
