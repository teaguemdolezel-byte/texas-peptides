import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Peptides | Texas Peptides",
  description:
    "Browse research peptides. 99%+ purity, HPLC-verified, COA included. Shipped cold from Austin, TX.",
};

const categories = [
  { id: "all", label: "All" },
  { id: "recovery", label: "Recovery" },
  { id: "growth", label: "Growth" },
  { id: "cognitive", label: "Focus & Mood" },
  { id: "metabolic", label: "Metabolic" },
  { id: "longevity", label: "Longevity" },
  { id: "antimicrobial", label: "Immune" },
];

const products = [
  {
    name: "BPC-157",
    tag: "The Recovery Staple",
    category: "recovery",
    purity: "99.2%",
    sizes: ["5mg", "10mg"],
    price: "$34.99",
    description: "The one everyone asks about first. Studied for gut lining and tissue repair in animal models. If you're building a recovery stack, this is your starting point.",
    popular: true,
  },
  {
    name: "TB-500",
    tag: "The Mobility Play",
    category: "recovery",
    purity: "99.5%",
    sizes: ["5mg", "10mg"],
    price: "$39.99",
    description: "Thymosin Beta-4 fragment. Researched for cell migration and wound healing. Stacks well with BPC — most people run them together.",
    popular: true,
  },
  {
    name: "GHK-Cu",
    tag: "The Glow Protocol",
    category: "recovery",
    purity: "99.1%",
    sizes: ["50mg", "200mg"],
    price: "$24.99",
    description: "Copper peptide complex. The skin research community loves this one. Anti-inflammatory, tissue remodeling, and surprisingly affordable.",
    popular: false,
  },
  {
    name: "CJC-1295",
    tag: "The Growth Signal",
    category: "growth",
    purity: "99.6%",
    sizes: ["2mg", "5mg"],
    price: "$32.99",
    description: "Sustained GH release without the spike-and-crash. Extended half-life GHRH analog. The clean approach to growth factor research.",
    popular: true,
  },
  {
    name: "Ipamorelin",
    tag: "The Clean Pulse",
    category: "growth",
    purity: "99.5%",
    sizes: ["2mg", "5mg"],
    price: "$27.99",
    description: "Selective GH secretagogue — stimulates growth hormone without jacking cortisol or prolactin. Frequently paired with CJC.",
    popular: false,
  },
  {
    name: "Hexarelin",
    tag: "The Strong Signal",
    category: "growth",
    purity: "99.4%",
    sizes: ["2mg", "5mg"],
    price: "$29.99",
    description: "Potent GH secretagogue studied for strong pulse induction. More aggressive than Ipamorelin — for researchers who want the bigger response.",
    popular: false,
  },
  {
    name: "PT-141",
    tag: "The Melanocortin Key",
    category: "metabolic",
    purity: "99.3%",
    sizes: ["10mg"],
    price: "$44.99",
    description: "Bremelanotide analog. Melanocortin receptor activation research. One of the more interesting mechanisms in the catalog.",
    popular: true,
  },
  {
    name: "Selank",
    tag: "The Calm Focus",
    category: "cognitive",
    purity: "99.4%",
    sizes: ["5mg", "10mg"],
    price: "$29.99",
    description: "Synthetic tuftsin analog. Anxiolytic and nootropic activity in preclinical models. The thinking person's peptide.",
    popular: false,
  },
  {
    name: "DSIP",
    tag: "The Sleep Architecture",
    category: "cognitive",
    purity: "99.2%",
    sizes: ["5mg"],
    price: "$34.99",
    description: "Delta-sleep inducing peptide. Researched for circadian regulation and stress modulation. For the sleep-trackers.",
    popular: false,
  },
  {
    name: "Epithalon",
    tag: "The Longevity Bet",
    category: "longevity",
    purity: "99.3%",
    sizes: ["10mg", "50mg"],
    price: "$49.99",
    description: "Telomerase activation research in a tiny tetrapeptide. If you're tracking biological age and reading Sinclair, you already know this one.",
    popular: true,
  },
  {
    name: "LL-37",
    tag: "The Defense Line",
    category: "antimicrobial",
    purity: "98.9%",
    sizes: ["5mg"],
    price: "$54.99",
    description: "Human cathelicidin-derived antimicrobial peptide. Broad-spectrum activity. The immune research community's darling.",
    popular: false,
  },
  {
    name: "Thymalin",
    tag: "The Immune Reset",
    category: "antimicrobial",
    purity: "99.1%",
    sizes: ["10mg"],
    price: "$39.99",
    description: "Thymic peptide for immune regulation research. Studied for thymus function restoration. Old-school compound, solid data.",
    popular: false,
  },
];

export default function ProductsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 editorial-gradient" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 animate-fade-in">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.15em]">
              The catalog
            </span>
            <h1 className="mt-3 text-4xl md:text-6xl font-bold text-ocean-900 tracking-tight">
              Every compound we <span className="font-display italic">trust</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-ocean-500 leading-relaxed">
              HPLC-verified, COA-included, shipped cold from Austin.
              If it&apos;s in our catalog, we&apos;d run it ourselves.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-40 glass border-b border-sand-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  cat.id === "all"
                    ? "bg-ocean-900 text-white"
                    : "text-ocean-600 hover:bg-white border border-sand-200 hover:border-ocean-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section id="popular" className="py-16 bg-sand-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <div
                key={product.name}
                className="group relative bg-white rounded-2xl border border-sand-200 p-7 hover:shadow-xl hover:shadow-ocean-500/5 hover:border-ocean-200 hover:-translate-y-1 transition-all"
              >
                {product.popular && (
                  <div className="absolute -top-2.5 right-6 px-3 py-1 bg-ocean-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Best seller
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-medium text-emerald-600 mb-1">
                      {product.tag}
                    </p>
                    <h3 className="text-xl font-bold text-ocean-900 font-display">
                      {product.name}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100">
                    {product.purity}
                  </span>
                </div>

                <p className="text-sm text-ocean-500 leading-relaxed mb-5">
                  {product.description}
                </p>

                <div className="flex gap-1.5 mb-5">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="px-3 py-1 text-xs font-medium text-ocean-500 bg-sand-50 rounded-full border border-sand-200"
                    >
                      {size}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-sand-100">
                  <span className="text-lg font-bold text-ocean-900">
                    From {product.price}
                  </span>
                  <Link
                    href="/contact"
                    className="px-5 py-2 text-xs font-semibold text-white rounded-full bg-ocean-900 hover:bg-ocean-800 transition-colors"
                  >
                    Inquire
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom synthesis */}
      <section id="custom" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden bg-ocean-900 p-10 md:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-[0.15em]">
                  Custom orders
                </span>
                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Don&apos;t see your compound?
                </h2>
                <p className="mt-4 text-ocean-300 leading-relaxed">
                  We do custom synthesis from milligram to gram scale.
                  Tell us what you need and we&apos;ll get you a quote — usually
                  within a few hours, not days.
                </p>
              </div>
              <div className="flex md:justify-end">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-ocean-900 bg-white rounded-full hover:bg-ocean-50 transition-all hover:-translate-y-0.5"
                >
                  Request custom quote
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6 border-t border-sand-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-[11px] text-ocean-400 tracking-wide">
            All products are sold strictly for in-vitro research and laboratory
            use. Not for human consumption. Must be 18+.
          </p>
        </div>
      </section>
    </>
  );
}
