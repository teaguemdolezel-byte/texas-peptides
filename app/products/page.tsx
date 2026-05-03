import { fetchProducts } from "@/lib/airtable";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Catalog · Texas Peptides",
  description: "Research-grade peptides shipped from Austin.",
};

// Short revalidate so adding/changing a product in Airtable shows up fast.
export const revalidate = 10;

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-16">
      {/* Header band */}
      <Reveal>
        <div className="flex items-end justify-between border-b border-ash-200 pb-6">
          <div>
            <p className="kicker">Catalog</p>
            <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tightest text-bone md:text-5xl">
              Products
            </h1>
          </div>
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-bone-400 md:block">
            {products.length} compound{products.length === 1 ? "" : "s"} · Austin · in stock
          </p>
        </div>
      </Reveal>

      {/* Grid */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <Reveal key={p.slug} delay={i * 60}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
