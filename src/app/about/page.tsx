import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story | Texas Peptides",
  description:
    "Meet the peptide concierge behind Texas Peptides. Former D1 athlete, current biohacker, based in Austin, TX.",
};

const values = [
  {
    title: "We'd run it ourselves",
    text: "If we wouldn't put it in our own research stack, it doesn't make the catalog. Period. No filler compounds, no hype molecules, no questionable sourcing.",
  },
  {
    title: "Honesty over revenue",
    text: "We'll tell you when something is overhyped — even if it means you buy less. Trust is the whole game. One honest answer is worth more than ten upsells.",
  },
  {
    title: "Speed over friction",
    text: "You shouldn't need 20 tabs and a subreddit to figure out what to order. Ask a question, get a real answer. Place an order, get it fast.",
  },
  {
    title: "Science, not vibes",
    text: "We actually read the papers. We know which studies are solid, which are preliminary, and which are just noise. We'll share what we know — no gatekeeping.",
  },
];

const timeline = [
  {
    year: "The before",
    event: "D1 athlete dealing with the usual — recovery, sleep, trying to optimize without the BS. Spent years sorting signal from noise in the peptide space.",
  },
  {
    year: "The gap",
    event: "Realized every peptide source was either sketchy-forum-energy, overpriced-clinical, or hype-bro vibes. Nobody was just... helpful and honest.",
  },
  {
    year: "Texas Peptides",
    event: "Built the thing we wished existed. Premium compounds, straight answers, Austin-based, shipped cold. Your peptide concierge.",
  },
];

const qualityPoints = [
  {
    label: "Synthesis",
    detail: "Solid-phase peptide synthesis following GMP-adjacent protocols. Every sequence verified before cleavage.",
  },
  {
    label: "Purification",
    detail: "Reverse-phase HPLC purification to 99%+ purity. We don't ship anything below our threshold.",
  },
  {
    label: "Verification",
    detail: "Mass spectrometry confirms molecular weight. HPLC confirms purity. Every. Single. Batch.",
  },
  {
    label: "Documentation",
    detail: "Full Certificate of Analysis with your order. HPLC chromatogram, mass spec data, sequence verification. No guessing.",
  },
  {
    label: "Storage",
    detail: "Climate-controlled facility in Austin. Lyophilized compounds stored at proper temperature until the moment they ship.",
  },
  {
    label: "Shipping",
    detail: "Cold-chain packaging with insulated containers and cold packs. Because Texas heat at 105°F is a real thing.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 editorial-gradient" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl animate-fade-in">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.15em]">
              Our story
            </span>
            <h1 className="mt-4 text-4xl md:text-6xl font-bold text-ocean-900 tracking-tight leading-[1.1]">
              The friend who <span className="font-display italic">actually</span>{" "}
              read the studies
            </h1>
            <p className="mt-6 text-lg text-ocean-500 leading-relaxed">
              Texas Peptides started because we were tired of the same
              two options: sketchy underground sources or sterile
              clinical sites that treat you like you don&apos;t know what
              a peptide bond is. There had to be something better.
            </p>
          </div>
        </div>
      </section>

      {/* Origin story */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-ocean-900 tracking-tight">
                How we got here
              </h2>
              <p className="mt-4 text-sm text-ocean-500 leading-relaxed">
                It&apos;s not a complicated story. We just built the thing
                we wished existed.
              </p>
            </div>

            <div className="lg:col-span-3 space-y-10">
              {timeline.map((item) => (
                <div key={item.year} className="flex gap-6">
                  <div className="flex-shrink-0 w-24">
                    <span className="text-sm font-bold text-ocean-900">
                      {item.year}
                    </span>
                  </div>
                  <div className="pb-10 border-l border-sand-200 pl-6">
                    <p className="text-base text-ocean-600 leading-relaxed">
                      {item.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The persona */}
      <section className="py-24 bg-sand-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-ocean-100 to-emerald-100 mb-8">
              <span className="text-2xl font-bold text-ocean-700 font-display">TX</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ocean-900 tracking-tight">
              Meet your peptide concierge
            </h2>
            <p className="mt-6 text-base text-ocean-600 leading-relaxed">
              28, former D1 athlete, current biohacker, based in Austin.
              Runs on collagen coffee and 6am mobility. Has a stack that
              works and won&apos;t sell you something she wouldn&apos;t run
              herself.
            </p>
            <p className="mt-4 text-base text-ocean-600 leading-relaxed">
              Not a clinical chatbot. Not a hype-bro. Not a wellness oracle.
              Just knowledgeable, warm, fast, and ruthlessly honest about what
              does and doesn&apos;t matter.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {["Evidence-leaning", "Zero fake urgency", "Erewhon energy", "Not CVS"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 text-xs font-medium text-ocean-600 bg-white border border-sand-200 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.15em]">
              What we believe
            </span>
            <h2 className="mt-3 text-4xl font-bold text-ocean-900 tracking-tight">
              Non-negotiables
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-7 rounded-2xl bg-sand-50 border border-sand-200"
              >
                <h3 className="text-base font-bold text-ocean-900 mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-ocean-500 leading-relaxed">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality */}
      <section id="quality" className="py-24 bg-ocean-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-[0.15em]">
              Quality
            </span>
            <h2 className="mt-3 text-4xl font-bold text-white tracking-tight">
              How we make sure it&apos;s <span className="font-display italic text-emerald-400">right</span>
            </h2>
            <p className="mt-4 text-base text-ocean-300 leading-relaxed">
              We&apos;re obsessive about this part. Here&apos;s exactly what happens
              before a compound gets the TX stamp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {qualityPoints.map((q, i) => (
              <div
                key={q.label}
                className="p-6 rounded-2xl bg-ocean-800/50 border border-ocean-700"
              >
                <div className="text-xs font-bold text-ocean-500 mb-3 uppercase tracking-wider">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {q.label}
                </h3>
                <p className="text-sm text-ocean-300 leading-relaxed">
                  {q.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-sand-50">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-ocean-900 tracking-tight">
            Questions? Just ask.
          </h2>
          <p className="mt-4 text-base text-ocean-500 leading-relaxed">
            We&apos;re not hiding behind a contact form. Real answers,
            usually within a few hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 text-sm font-semibold text-white rounded-full bg-ocean-900 hover:bg-ocean-800 transition-all hover:-translate-y-0.5"
            >
              Get in touch
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 text-sm font-semibold text-ocean-700 rounded-full border border-sand-300 hover:border-ocean-300 hover:bg-white transition-all"
            >
              Browse catalog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
