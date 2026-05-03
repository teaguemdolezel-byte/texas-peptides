import Link from "next/link";
import type { Metadata } from "next";
import { peptides } from "@/data/peptides";

export const metadata: Metadata = {
  title: "Live Inventory & Pricing | Texas Peptides",
  description:
    "Check real-time stock availability and pricing for all Texas Peptides research compounds. Austin, TX.",
};

const categoryOrder = ["Recovery", "Growth", "Metabolic", "Cognitive", "Longevity", "Immune"];

function groupByCategory() {
  const groups: Record<string, typeof peptides> = {};
  for (const p of peptides) {
    if (!groups[p.category]) groups[p.category] = [];
    groups[p.category].push(p);
  }
  return categoryOrder
    .filter((c) => groups[c])
    .map((c) => ({ category: c, items: groups[c] }));
}

export default function StockPage() {
  const grouped = groupByCategory();
  const totalInStock = peptides.filter((p) =>
    p.sizes.some((s) => s.inStock)
  ).length;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 editorial-gradient" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.15em]">
                Live inventory
              </span>
              <h1 className="mt-3 text-4xl md:text-6xl font-bold text-ocean-900 tracking-tight">
                What&apos;s <span className="font-display italic">in stock</span>
              </h1>
              <p className="mt-5 text-base md:text-lg text-ocean-500 leading-relaxed">
                Real availability, real pricing. Everything ships same-day from
                Austin. Click any compound for the full breakdown.
              </p>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-sand-200 self-start">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-ocean-700">
                {totalInStock} of {peptides.length} compounds in stock
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Inventory table */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {grouped.map((group) => (
            <div key={group.category} className="mb-16 last:mb-0">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-ocean-900">
                  {group.category}
                </h2>
                <div className="flex-1 h-px bg-sand-200" />
                <span className="text-xs font-medium text-ocean-400 uppercase tracking-wider">
                  {group.items.length} compound{group.items.length !== 1 && "s"}
                </span>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-hidden rounded-2xl border border-sand-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-sand-50">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-ocean-400 uppercase tracking-wider">
                        Compound
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-ocean-400 uppercase tracking-wider">
                        Purity
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-ocean-400 uppercase tracking-wider">
                        Sizes &amp; Pricing
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-ocean-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {group.items.map((p) => {
                      const anyInStock = p.sizes.some((s) => s.inStock);
                      return (
                        <tr
                          key={p.slug}
                          className="group hover:bg-sand-50/50 transition-colors"
                        >
                          <td className="px-6 py-5">
                            <Link href={`/stock/${p.slug}`} className="block">
                              <div className="flex items-center gap-3">
                                <div>
                                  <span className="text-base font-bold text-ocean-900 group-hover:text-ocean-600 transition-colors font-display">
                                    {p.name}
                                  </span>
                                  {p.popular && (
                                    <span className="ml-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-ocean-900 text-white rounded-full">
                                      Popular
                                    </span>
                                  )}
                                  <p className="text-xs text-ocean-400 mt-0.5">
                                    {p.tag}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100">
                              {p.purity}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-2">
                              {p.sizes.map((s) => (
                                <div
                                  key={s.amount}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                                    s.inStock
                                      ? "bg-white border-sand-200 text-ocean-700"
                                      : "bg-sand-50 border-sand-200 text-ocean-300 line-through"
                                  }`}
                                >
                                  {s.amount} — ${s.price.toFixed(2)}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            {anyInStock ? (
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs font-semibold text-emerald-700">
                                  In Stock
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-400" />
                                <span className="text-xs font-semibold text-orange-600">
                                  Low Stock
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-5 text-right">
                            <Link
                              href={`/stock/${p.slug}`}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ocean-500 hover:text-ocean-700 transition-colors"
                            >
                              Details
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                              </svg>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-4">
                {group.items.map((p) => {
                  const anyInStock = p.sizes.some((s) => s.inStock);
                  return (
                    <Link
                      key={p.slug}
                      href={`/stock/${p.slug}`}
                      className="block bg-white rounded-2xl border border-sand-200 p-5 hover:shadow-lg hover:border-ocean-200 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-ocean-900 font-display">
                            {p.name}
                          </h3>
                          <p className="text-xs text-ocean-400">{p.tag}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${anyInStock ? "bg-emerald-500" : "bg-orange-400"}`} />
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${anyInStock ? "text-emerald-700" : "text-orange-600"}`}>
                            {anyInStock ? "In Stock" : "Low Stock"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {p.sizes.map((s) => (
                          <span
                            key={s.amount}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              s.inStock
                                ? "bg-sand-50 text-ocean-700 border border-sand-200"
                                : "bg-sand-50 text-ocean-300 border border-sand-200 line-through"
                            }`}
                          >
                            {s.amount} — ${s.price.toFixed(2)}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100">
                          {p.purity} purity
                        </span>
                        <span className="text-xs font-semibold text-ocean-400">
                          View details →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6 border-t border-sand-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-[11px] text-ocean-400 tracking-wide">
            All products are sold strictly for in-vitro research and laboratory
            use. Not for human consumption. Pricing subject to change. Must be 18+.
          </p>
        </div>
      </section>
    </>
  );
}
