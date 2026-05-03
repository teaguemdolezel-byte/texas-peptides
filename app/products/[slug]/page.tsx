import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, currentPriceCents, stockState } from "@/data/products";
import { fetchProduct } from "@/lib/airtable";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";
import Reveal from "@/components/Reveal";

export const revalidate = 30;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await fetchProduct(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} · Texas Peptides`,
    description: p.shortDescription,
  };
}

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  const product = await fetchProduct(params.slug);
  if (!product) notFound();

  const price = currentPriceCents(product);
  const state = stockState(product);

  return (
    <article>
      {/* Above the fold */}
      <section className="border-b border-ash-200">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-12 md:grid-cols-12 md:py-20">
          <Reveal className="md:col-span-7">
            <div className="relative aspect-[5/6] overflow-hidden border border-ash-400 bg-bg-2">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.imageAlt ?? product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <>
                  <div className="metal" />
                  <div className="absolute inset-0 grid place-items-center">
                    <svg
                      width="220"
                      height="320"
                      viewBox="0 0 80 120"
                      fill="none"
                      className="relative z-10 text-bone"
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
                  </div>
                </>
              )}
              <span className="absolute left-5 top-5 border border-ash-600 bg-bg/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-300 backdrop-blur">
                {product.family}
              </span>
              {state === "preorder" && (
                <span className="absolute right-5 top-5 border border-bone-300 bg-bg/80 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-bone backdrop-blur">
                  Pre-order · 7–10 day ship
                </span>
              )}
              {state === "low" && (
                <span className="absolute right-5 top-5 bg-ox-500 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-bone">
                  Low stock — price stepping up
                </span>
              )}
            </div>
          </Reveal>

          <div className="md:col-span-5">
            <Reveal>
              <Link
                href="/products"
                className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone-400 hover:text-bone"
              >
                ← All products
              </Link>
              <h1 className="mt-6 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tightest text-bone md:text-5xl">
                {product.shortName}
              </h1>
              <p className="mt-3 font-display text-xl font-medium uppercase tracking-tight text-bone-300">
                {product.tagline}
              </p>

              <div className="mt-8 flex items-baseline gap-3">
                <span className="font-display text-4xl font-bold text-bone">
                  {formatPrice(price)}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-400">
                  {product.size}
                </span>
              </div>

              <p className="mt-6 max-w-prose text-base leading-relaxed text-bone-200">
                {product.longDescription}
              </p>

              <ul className="mt-6 space-y-2 text-sm text-bone-200">
                {product.bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-2 inline-block h-1 w-1 bg-ox-500" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <AddToCartButton
                  product={{
                    slug: product.slug,
                    name: product.name,
                    priceCents: price,
                  }}
                  isPreorder={state === "preorder"}
                />
              </div>

              <p className="mt-8 font-mono text-[11px] leading-relaxed uppercase tracking-[0.18em] text-bone-400">
                For laboratory research only · Not for human or veterinary use ·{" "}
                <Link href="/disclaimer" className="underline hover:text-bone">
                  full disclaimer
                </Link>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Spec sheet */}
      <section className="border-b border-ash-200 bg-bg-2">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <Reveal>
            <p className="kicker eyebrow-line">Specifications</p>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight text-bone md:text-6xl">
              The numbers.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-x-12 gap-y-3 md:grid-cols-2">
            {[
              { label: "Compound", value: product.name },
              { label: "Family", value: product.family },
              product.sequence ? { label: "Sequence", value: product.sequence } : null,
              product.molecularWeight
                ? { label: "Molecular weight", value: product.molecularWeight }
                : null,
              { label: "Purity", value: product.purity },
              { label: "Format", value: product.size },
              { label: "Storage", value: "Lyophilized · −20°C" },
              { label: "Shipping", value: "Same-day from Austin" },
            ]
              .filter((x): x is { label: string; value: string } => x !== null)
              .map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between gap-6 border-b border-ash-400 py-4 text-sm"
                >
                  <dt className="kicker">{row.label}</dt>
                  <dd className="text-right font-mono text-bone-200">{row.value}</dd>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section>
        <div className="mx-auto max-w-7xl px-5 py-20">
          <Reveal>
            <p className="kicker eyebrow-line">Shipping</p>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight text-bone md:text-6xl">
              How it gets to you.
            </h2>
          </Reveal>

          <div className="mt-12 max-w-2xl">
            <Reveal>
              <div className="border border-ash-400 bg-bg-2 p-8">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-bone-400">USPS Priority · Same-day from Austin</p>
                <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-bone">
                  Pay before 2 PM CT.
                  <span className="block">Out the door today.</span>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-bone-300">
                  Orders paid before 2 PM CT leave Austin the same business
                  day. Discreet, plain packaging — no external markings.
                  Tracking sent to your email when we ship.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </article>
  );
}
