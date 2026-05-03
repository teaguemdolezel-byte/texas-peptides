import Link from "next/link";
import { fetchProducts } from "@/lib/airtable";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";

export const revalidate = 30;

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="glow-ox" />
        <div className="metal" />
        <div className="grain absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-5 pb-32 pt-20 md:pt-28">
          {/* Top kicker line */}
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-bone-300">
            <span className="h-1.5 w-1.5 bg-ox-500 pulse-dot" />
            Austin, TX · Shipping today
          </div>

          {/* Hero headline — sized to feel commanding without overflowing */}
          <Reveal as="h1" className="mt-8 font-display text-6xl font-bold uppercase leading-[0.92] tracking-tightest text-bone sm:text-7xl md:text-8xl lg:text-[112px]">
            Research-grade
            <span className="block text-ox-500">peptides.</span>
          </Reveal>

          <Reveal delay={120} className="mt-8 grid gap-6 border-l-2 border-ox-500 pl-6 md:max-w-xl">
            <p className="text-base leading-relaxed text-bone-200">
              Two compounds. HPLC-verified. Stocked in our Austin facility and
              out the door same-day, anywhere in the country.
            </p>
          </Reveal>

          <Reveal delay={240} className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/products" className="btn-primary magnet">
              Browse the catalog →
            </Link>
            <Link href="#how-it-works" className="btn-secondary magnet">
              How it works
            </Link>
          </Reveal>

          {/* Stat row */}
          <Reveal delay={360} className="mt-20 grid grid-cols-2 gap-y-8 border-t border-ash-200 pt-8 md:grid-cols-4">
            <Stat value="≥99%" label="HPLC purity" />
            <Stat value="Same-day" label="USPS Priority" />
            <Stat value="Austin" label="Texas-based" />
            <Stat value="Crypto" label="Direct-to-wallet" />
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────── MARQUEE STRIP ─────────────────────── */}
      <Marquee
        items={[
          "Austin-based · Texas operated",
          "≥99% HPLC purity",
          "Per-batch certificate of analysis",
          "Same-day USPS Priority shipping",
          "Crypto payment · direct-to-wallet",
          "Discreet, secure packaging",
        ]}
      />

      {/* ─────────────────────────── PRODUCTS ─────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-28">
        <div className="flex items-end justify-between">
          <Reveal>
            <p className="kicker eyebrow-line">The catalog</p>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tightest text-bone md:text-6xl">
              Two compounds.
              <span className="block text-bone-300">No filler.</span>
            </h2>
          </Reveal>
          <Link href="/products" className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-bone-300 hover:text-bone md:inline">
            View all →
          </Link>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─────────────────────── HOW IT WORKS ─────────────────────── */}
      <section id="how-it-works" className="border-t border-ash-200 bg-bg-2">
        <div className="mx-auto max-w-7xl px-5 py-28">
          <Reveal>
            <p className="kicker eyebrow-line">Ordering</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tightest text-bone md:text-6xl">
              Order, pay,
              <span className="block text-ox-500">ship.</span>
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Pick your peptide",
                body: "Add Retatrutide or GHK-Cu to cart. Prices reflect live stock — when supply runs low, prices step up.",
              },
              {
                n: "02",
                title: "Pay in USDC",
                body: "Scan a QR, send USDC from any wallet. Self-custody — funds go straight to our wallet, no processor in the middle. Confirms in seconds.",
              },
              {
                n: "03",
                title: "Out the door same day",
                body: "Pay before 2 PM CT and your order ships from Austin today via USPS Priority. Discreet, plain packaging. Tracking sent to your email.",
              },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <div className="border-t-2 border-ox-500 pt-6">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-bone-400">
                    {step.n}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-bone">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone-300">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── QUALITY ─────────────────────── */}
      <section className="border-t border-ash-200">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-28 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="kicker eyebrow-line">Quality you can verify</p>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tightest text-bone md:text-6xl">
              Every batch.
              <span className="block text-bone-300">Measured.</span>
            </h2>
          </Reveal>

          <div className="md:col-span-7">
            {[
              {
                k: "HPLC purity",
                body: "Reverse-phase HPLC verifies ≥99% purity for Retatrutide and ≥98% for GHK-Cu before release.",
              },
              {
                k: "Mass-spec verification",
                body: "Each batch is mass-spectrometry verified to confirm molecular weight before lyophilization.",
              },
              {
                k: "Per-batch COA",
                body: "Certificate of analysis ships with every order, stamped with lot number and date.",
              },
              {
                k: "Discreet packaging",
                body: "Sealed, tamper-evident vials in plain shipping boxes. No external markings.",
              },
            ].map((row, i) => (
              <Reveal key={row.k} delay={i * 80}>
                <div className="grid grid-cols-[180px_1fr] items-start gap-6 border-b border-ash-200 py-6">
                  <p className="kicker">{row.k}</p>
                  <p className="text-base text-bone-200">{row.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── CTA ─────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pb-28">
        <Reveal>
          <div className="relative overflow-hidden border border-ash-400 bg-bg-2 px-10 py-20 md:px-20">
            <div className="glow-ox opacity-60" />
            <div className="metal" />
            <div className="relative grid items-end gap-8 md:grid-cols-2">
              <h3 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tightest text-bone md:text-6xl">
                Ready when
                <span className="block text-ox-500">you are.</span>
              </h3>
              <div>
                <p className="max-w-md text-base text-bone-200">
                  Two compounds, in stock, leaving Austin today. USDC checkout —
                  one QR scan, sub-second confirmation, no processor.
                </p>
                <Link href="/products" className="btn-primary magnet mt-8">
                  Shop products →
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl font-bold uppercase tracking-tight text-bone md:text-4xl">
        {value}
      </p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bone-400">
        {label}
      </p>
    </div>
  );
}
