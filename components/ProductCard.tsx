import Link from "next/link";
import Image from "next/image";
import { Product, currentPriceCents, stockState } from "@/data/products";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const price = currentPriceCents(product);
  const state = stockState(product);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative block overflow-hidden border border-ash-400 bg-bg-2 transition hover:border-bone hover:bg-bg-3"
    >
      {/* Image plate */}
      <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-bg-1">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.imageAlt ?? product.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <>
            <div className="metal" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-2/80" />
            <svg
              width="80"
              height="120"
              viewBox="0 0 80 120"
              fill="none"
              className="relative z-10 text-bone transition duration-700 group-hover:scale-[1.04]"
            >
              <rect x="22" y="6" width="36" height="10" rx="1" fill="currentColor" opacity="0.85" />
              <rect x="18" y="14" width="44" height="8" rx="1" fill="currentColor" opacity="0.45" />
              <path
                d="M20 22 L20 102 Q20 112 30 112 L50 112 Q60 112 60 102 L60 22 Z"
                fill="currentColor"
                opacity="0.06"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <rect x="26" y="62" width="28" height="40" rx="1" fill="currentColor" opacity="0.78" />
            </svg>
          </>
        )}

        <span className="absolute left-3 top-3 z-10 border border-ash-600 bg-bg/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-bone-300 backdrop-blur">
          {product.family}
        </span>

        {state === "preorder" && (
          <span className="absolute right-3 top-3 z-10 border border-bone-300 bg-bg/80 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-bone backdrop-blur">
            Pre-order
          </span>
        )}
        {state === "low" && (
          <span className="absolute right-3 top-3 z-10 bg-ox-500 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-bone">
            Low stock
          </span>
        )}
        {state === "limited" && (
          <span className="absolute right-3 top-3 z-10 border border-ash-600 bg-bg/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-bone-300 backdrop-blur">
            Limited
          </span>
        )}
      </div>

      <div className="border-t border-ash-400 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-bold uppercase tracking-tight text-bone">
            {product.shortName}
          </h3>
          <span className="font-display text-base font-bold text-bone">
            {formatPrice(price)}
          </span>
        </div>
        <p className="mt-1 text-xs leading-snug text-bone-300 line-clamp-1">
          {product.tagline}
        </p>
        <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-bone-400">
          <span>{product.size}</span>
          <span className="inline-flex items-center gap-1 text-bone transition group-hover:gap-2">
            {state === "preorder" ? "Pre-order" : "View"}{" "}
            <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
