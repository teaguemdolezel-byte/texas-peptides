import Link from "next/link";

const stack = [
  {
    name: "BPC-157",
    tag: "Recovery",
    purity: "99.2 %",
    desc: "The one everyone asks about first. Studied for gut and tissue repair. Your new favorite compound.",
  },
  {
    name: "TB-500",
    tag: "Mobility",
    purity: "99.5 %",
    desc: "Thymosin Beta-4 fragment. Researched for cell migration and healing. Pairs beautifully with BPC.",
  },
  {
    name: "GHK-Cu",
    tag: "Remodeling",
    purity: "99.1 %",
    desc: "Copper peptide complex. Anti-inflammatory, remodeling, and the skin research nerds love it.",
  },
  {
    name: "CJC-1295",
    tag: "Growth",
    purity: "99.6 %",
    desc: "Sustained GH release without the spike-and-crash. The clean approach to growth research.",
  },
  {
    name: "Selank",
    tag: "Nootropic",
    purity: "99.4 %",
    desc: "Tuftsin analog studied for anxiolytic and nootropic activity. The thinking person\u2019s peptide.",
  },
  {
    name: "Epithalon",
    tag: "Longevity",
    purity: "99.3 %",
    desc: "Telomerase activation research in a tetrapeptide. If you\u2019re tracking your biological age, you know.",
  },
];

const pillars = [
  {
    num: "01",
    title: "We actually read the papers",
    text: "Every compound we carry has real research behind it. No hype molecules, no TikTok trends without substance.",
  },
  {
    num: "02",
    title: "99 %+ purity, every batch",
    text: "HPLC-tested, mass spec-verified, COA in your inbox before the package hits your door.",
  },
  {
    num: "03",
    title: "Austin-based, Texas-fast",
    text: "Same-day dispatch from our Austin facility. Cold-chain packaging because Texas heat doesn\u2019t play.",
  },
  {
    num: "04",
    title: "No upsells, no fake urgency",
    text: "We\u2019ll tell you what works, what\u2019s overhyped, and what to skip. Even if it means you buy less.",
  },
];

const quotes = [
  {
    text: "Finally a peptide source that doesn\u2019t feel like a sketchy forum post from 2014.",
    cite: "Austin researcher",
  },
  {
    text: "Asked about stacking BPC + TB and got a real answer in 5 minutes. Not a sales pitch.",
    cite: "Dallas biohacker",
  },
  {
    text: "The COAs are legit, the shipping is fast, and they actually know their stuff.",
    cite: "Houston lab tech",
  },
];

export default function Home() {
  return (
    <>
      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-bg" />

        {/* Faint accent wash — just enough to feel alive */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-accent-500/[0.04] blur-[180px]" />

        {/* Fine crosshair grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(var(--neutral-600) 1px, transparent 1px), linear-gradient(90deg, var(--neutral-600) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center pt-36 pb-28">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-neutral-700 bg-neutral-900/60 backdrop-blur-sm mb-14">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse-dot" />
              <span className="text-[11px] font-medium tracking-widest uppercase text-neutral-400">
                Austin, TX &mdash; Shipping statewide
              </span>
            </div>
          </div>

          <h1 className="text-[clamp(2.8rem,7vw,6rem)] font-bold leading-[1.02] tracking-tight animate-fade-in">
            <span className="text-white">Research-grade peptides.</span>
            <br />
            <span className="font-display italic gradient-text-shimmer">Zero compromise.</span>
          </h1>

          <p className="mt-8 text-base md:text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto animate-fade-in-delay">
            HPLC-verified, COA-backed compounds shipped cold from Austin.
            We read the studies so you don&apos;t have to open 20 tabs.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4 animate-fade-in-delay-2">
            <Link
              href="/products"
              className="px-9 py-3.5 text-sm font-semibold text-neutral-950 rounded-full bg-accent-500 hover:bg-accent-400 transition-colors"
            >
              Browse catalog
            </Link>
            <Link
              href="/about"
              className="px-9 py-3.5 text-sm font-semibold text-neutral-300 rounded-full border border-neutral-700 hover:border-neutral-500 hover:text-white transition-colors"
            >
              Our process
            </Link>
          </div>

          <p className="mt-12 text-[10px] text-neutral-600 tracking-[0.25em] uppercase animate-fade-in-delay-3">
            For research use only &middot; Not for human consumption
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ─── METRICS BAR ──────────────────────────────── */}
      <section className="border-y border-neutral-800 bg-neutral-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-800">
            {[
              { val: "99 %+", label: "Purity" },
              { val: "500+", label: "Compounds" },
              { val: "Same day", label: "Dispatch" },
              { val: "COA", label: "Every order" },
            ].map((s) => (
              <div key={s.label} className="py-8 text-center">
                <div className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {s.val}
                </div>
                <div className="mt-1 text-[10px] text-neutral-500 font-medium uppercase tracking-widest">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────── */}
      <section className="py-16 border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {quotes.map((q) => (
              <div key={q.cite} className="text-center">
                <p className="text-sm text-neutral-300 leading-relaxed italic">
                  &ldquo;{q.text}&rdquo;
                </p>
                <p className="mt-3 text-[10px] text-neutral-600 uppercase tracking-widest">
                  &mdash; {q.cite}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE LINEUP ───────────────────────────────── */}
      <section id="popular" className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[10px] font-semibold text-accent-500 uppercase tracking-[0.25em]">
              Catalog
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
              Most requested compounds
            </h2>
            <p className="mt-4 text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
              Every batch HPLC-verified. COA included. Shipped cold from Austin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stack.map((item) => (
              <Link
                href="/products"
                key={item.name}
                className="group relative bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-600 hover:bg-neutral-850 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="inline-block text-[9px] font-semibold uppercase tracking-[0.2em] text-accent-500 mb-1.5">
                      {item.tag}
                    </span>
                    <h3 className="text-lg font-bold text-white font-display tracking-wide">
                      {item.name}
                    </h3>
                  </div>
                  <span className="mt-1 px-2 py-0.5 text-[10px] font-mono font-bold text-accent-500 bg-accent-500/10 rounded border border-accent-500/20">
                    {item.purity}
                  </span>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-neutral-600 group-hover:text-accent-500 transition-colors">
                  View compound
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-9 py-3.5 text-sm font-semibold text-neutral-950 rounded-full bg-accent-500 hover:bg-accent-400 transition-colors"
            >
              Full catalog
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHY US ────────────────────────────────────── */}
      <section className="py-28 border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <span className="text-[10px] font-semibold text-accent-500 uppercase tracking-[0.25em]">
                Why us
              </span>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
                Not another <br className="hidden lg:block" />
                <span className="font-display italic text-neutral-400">peptide bro</span> site
              </h2>
              <p className="mt-6 text-sm text-neutral-400 leading-relaxed max-w-md">
                We&apos;re a 28-year-old former D1 athlete who runs on collagen
                coffee and 6 am mobility. We won&apos;t sell you something we
                wouldn&apos;t run ourselves.
              </p>
            </div>

            <div className="space-y-4">
              {pillars.map((r) => (
                <div
                  key={r.num}
                  className="flex gap-5 bg-neutral-900 border border-neutral-800 rounded-xl p-5"
                >
                  <span className="flex-shrink-0 text-xl font-bold font-mono text-neutral-700 tabular-nums">
                    {r.num}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{r.title}</h3>
                    <p className="mt-1 text-sm text-neutral-500 leading-relaxed">
                      {r.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────── */}
      <section className="py-28 border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[10px] font-semibold text-accent-500 uppercase tracking-[0.25em]">
              Process
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
              Three steps, no friction
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-800 rounded-xl overflow-hidden max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Select compounds",
                text: "Browse the catalog or tell us your protocol. We\u2019ll point you to the right shelf.",
              },
              {
                step: "02",
                title: "We verify & ship",
                text: "Pulled from fresh inventory, HPLC-checked, cold-packed, and dispatched same day.",
              },
              {
                step: "03",
                title: "COA delivered",
                text: "Full Certificate of Analysis in your inbox. HPLC data, mass spec, the works.",
              },
            ].map((item) => (
              <div key={item.step} className="bg-neutral-900 p-8 text-center">
                <span className="inline-block text-xs font-mono font-bold text-accent-500 mb-4">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────── */}
      <section className="relative py-28 border-t border-neutral-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-500/[0.04] blur-[180px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Ready to <span className="font-display italic gradient-text">dial&nbsp;it&nbsp;in</span>?
          </h2>
          <p className="mt-6 text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
            Skip the Reddit deep-dive. Clean compounds and real answers
            from someone who&apos;s actually done the work.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="px-9 py-3.5 text-sm font-semibold text-neutral-950 rounded-full bg-accent-500 hover:bg-accent-400 transition-colors"
            >
              Browse catalog
            </Link>
            <Link
              href="/contact"
              className="px-9 py-3.5 text-sm font-semibold text-neutral-300 rounded-full border border-neutral-700 hover:border-neutral-500 hover:text-white transition-colors"
            >
              Ask us anything
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
