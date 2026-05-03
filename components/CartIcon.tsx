"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";

export default function CartIcon() {
  const total = useCart((s) => s.totalItems());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 border border-ash-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-bone-300 transition hover:border-bone hover:text-bone"
      aria-label="Cart"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
      </svg>
      <span className="hidden sm:inline">Cart</span>
      {mounted && total > 0 && (
        <span className="ml-0.5 grid h-4 min-w-[1rem] place-items-center bg-ox-500 px-1 font-mono text-[10px] font-bold text-bone">
          {total}
        </span>
      )}
    </Link>
  );
}
