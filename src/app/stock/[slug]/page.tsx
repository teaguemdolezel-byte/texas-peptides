import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { peptides, getPeptideBySlug, getAllSlugs } from "@/data/peptides";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = getPeptideBySlug(slug);
  if (!p) return { title: "Not Found | Texas Peptides" };
  return {
    title: `${p.name} — ${p.tag} | Texas Peptides`,
    description: p.shortDescription,
  };
}

export default async function PeptideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const p = getPeptideBySlug(slug);
  if (!p) notFound();

  const anyInStock = p.sizes.some((s) => s.inStock);
  const lowestPrice = Math.min(...p.sizes.map((s) => s.price));

  const relatedPeptides = peptides
    .filter((r) => r.slug !== p.slug && r.category === p.category)
    .slice(0, 3);

  return (
    <>
      {/* Breadcrumb + Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 editorial-gradient" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-ocean-400 mb-8 animate-fade-in">
            <Link href="/stock" className="hover:text-ocean-600 transition-colors">
              Stock
            </Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-ocean-600 font-medium">{p.name}</span>
          </nav>

          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Left: info */}
            <div className="lg:col-span-3 animate-fade-in">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.15em]">
                  {p.category}
                </span>
                {p.popular && (
                  <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-ocean-900 text-white rounded-full">
                    Best seller
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-ocean-900 tracking-tight font-display">
                {p.name}
              </h1>
              <p className="mt-2 text-lg text-ocean-400 font-medium italic font-display">
                {p.tag}
              </p>

              <p className="mt-6 text-base text-ocean-600 leading-relaxed">
                {p.description}
              </p>
            </div>

            {/* Right: purchase card */}
            <div className="lg:col-span-2 animate-fade-in-delay">
              <div className="sticky top-28 bg-white rounded-2xl border border-sand-200 shadow-lg shadow-ocean-500/5 overflow-hidden">
                {/* Status bar */}
                <div className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${anyInStock ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"}`}>
                  <span className={`w-2 h-2 rounded-full ${anyInStock ? "bg-emerald-500 animate-pulse" : "bg-orange-400"}`} />
                  {anyInStock ? "In stock — ships today from Austin" : "Limited availability"}
                </div>

                <div className="p-6 space-y-5">
                  {/* Pricing */}
                  <div>
                    <span className="text-xs text-ocean-400 uppercase tracking-wider">
                      Starting from
                    </span>
                    <div className="text-3xl font-bold text-ocean-900 mt-1">
                      ${lowestPrice.toFixed(2)}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="space-y-2">
                    {p.sizes.map((s) => (
                      <div
                        key={s.amount}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                          s.inStock
                            ? "border-sand-200 bg-sand-50"
                            : "border-sand-200 bg-sand-50 opacity-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-ocean-900">
                            {s.amount}
                          </span>
                          {!s.inStock && (
                            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                              Out of stock
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-bold text-ocean-900">
                          ${s.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href="/contact"
                    className="block w-full text-center px-6 py-4 text-sm font-semibold text-white rounded-full bg-ocean-900 hover:bg-ocean-800 transition-all hover:-translate-y-0.5"
                  >
                    Inquire about {p.name}
                  </Link>

                  {/* Quick specs */}
                  <div className="pt-4 border-t border-sand-100 space-y-3">
                    {[
                      { label: "Purity", value: p.purity },
                      { label: "CAS", value: p.cas },
                      { label: "Form", value: p.form },
                    ].map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-center justify-between"
                      >
                        <span className="text-xs text-ocean-400 uppercase tracking-wider">
                          {spec.label}
                        </span>
                        <span className="text-xs font-medium text-ocean-700">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanism of action */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.15em]">
              How it works
            </span>
            <h2 className="mt-3 text-3xl font-bold text-ocean-900 tracking-tight">
              Mechanism of Action
            </h2>
            <p className="mt-6 text-base text-ocean-600 leading-relaxed">
              {p.mechanism}
            </p>
          </div>
        </div>
      </section>

      {/* Research highlights */}
      <section className="py-20 bg-sand-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.15em]">
              The research
            </span>
            <h2 className="mt-3 text-3xl font-bold text-ocean-900 tracking-tight">
              What the studies say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            {p.researchHighlights.map((highlight, i) => (
              <div
                key={i}
                className="flex gap-4 p-5 bg-white rounded-xl border border-sand-200"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-ocean-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-ocean-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm text-ocean-600 leading-relaxed">
                  {highlight}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical specs */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.15em]">
              Specs
            </span>
            <h2 className="mt-3 text-3xl font-bold text-ocean-900 tracking-tight">
              Technical Details
            </h2>
          </div>

          <div className="max-w-2xl rounded-2xl border border-sand-200 overflow-hidden">
            {[
              { label: "Full Name", value: p.name },
              { label: "CAS Number", value: p.cas },
              { label: "Molecular Weight", value: p.molecularWeight },
              { label: "Sequence", value: p.sequence },
              { label: "Purity (HPLC)", value: p.purity },
              { label: "Form", value: p.form },
              { label: "Storage", value: p.storage },
            ].map((row, i) => (
              <div
                key={row.label}
                className={`flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0 px-6 py-4 ${
                  i % 2 === 0 ? "bg-sand-50" : "bg-white"
                }`}
              >
                <span className="sm:w-48 flex-shrink-0 text-xs font-semibold text-ocean-400 uppercase tracking-wider">
                  {row.label}
                </span>
                <span className="text-sm text-ocean-700 font-mono break-all leading-relaxed">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citations */}
      <section className="py-20 bg-sand-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.15em]">
              References
            </span>
            <h2 className="mt-3 text-3xl font-bold text-ocean-900 tracking-tight">
              Selected Citations
            </h2>
            <p className="mt-3 text-sm text-ocean-400">
              We believe in transparency. Here&apos;s the published research backing
              this compound.
            </p>
          </div>

          <ol className="max-w-3xl space-y-4 list-decimal list-inside">
            {p.citations.map((cite, i) => (
              <li
                key={i}
                className="text-sm text-ocean-600 leading-relaxed bg-white p-4 rounded-xl border border-sand-200"
              >
                {cite}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Related compounds */}
      {relatedPeptides.length > 0 && (
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.15em]">
                  Related
                </span>
                <h2 className="mt-2 text-2xl font-bold text-ocean-900 tracking-tight">
                  Other {p.category} compounds
                </h2>
              </div>
              <Link
                href="/stock"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-500 hover:text-ocean-700 transition-colors"
              >
                View all
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedPeptides.map((r) => (
                <Link
                  key={r.slug}
                  href={`/stock/${r.slug}`}
                  className="group bg-sand-50 rounded-2xl border border-sand-200 p-6 hover:border-ocean-200 hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <p className="text-xs font-medium text-emerald-600 mb-1">
                    {r.tag}
                  </p>
                  <h3 className="text-lg font-bold text-ocean-900 font-display mb-2">
                    {r.name}
                  </h3>
                  <p className="text-sm text-ocean-500 leading-relaxed mb-4">
                    {r.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-ocean-900">
                      From ${Math.min(...r.sizes.map((s) => s.price)).toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-ocean-400 group-hover:text-ocean-600 transition-colors">
                      View →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-ocean-900">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Questions about {p.name}?
          </h2>
          <p className="mt-4 text-base text-ocean-300">
            We know this compound inside and out. Ask us anything — handling,
            storage, what it pairs with, what the research actually says.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 text-sm font-semibold text-ocean-900 bg-white rounded-full hover:bg-ocean-50 transition-all hover:-translate-y-0.5"
            >
              Talk to us
            </Link>
            <Link
              href="/stock"
              className="px-8 py-4 text-sm font-semibold text-white rounded-full border border-ocean-600 hover:border-ocean-400 hover:bg-ocean-800 transition-all"
            >
              Back to inventory
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6 border-t border-sand-200 bg-sand-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-[11px] text-ocean-400 tracking-wide">
            For in-vitro research and laboratory use only. Not for human
            consumption. All data sourced from published preclinical and
            clinical literature.
          </p>
        </div>
      </section>
    </>
  );
}
