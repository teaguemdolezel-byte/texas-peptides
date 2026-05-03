import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata = { title: "About · Texas Peptides" };

export default function AboutPage() {
  return (
    <article>
      <section className="relative overflow-hidden">
        <div className="glow-ox opacity-60" />
        <div className="relative mx-auto max-w-4xl px-5 py-24 md:py-32">
          <Reveal>
            <p className="kicker eyebrow-line">About</p>
            <h1 className="mt-6 font-display text-6xl font-bold uppercase leading-[0.9] tracking-tightest text-bone md:text-9xl">
              Austin
              <span className="block text-ox-500">based.</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-bone-200">
              Texas Peptides is a small operation in Austin, Texas. We supply two
              compounds — Retatrutide and GHK-Cu — to laboratories and independent
              researchers, packed and shipped from our Austin facility the same
              day you order.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ash-200">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="kicker eyebrow-line">What we believe</p>
          </Reveal>
          <div className="md:col-span-7">
            {[
              {
                k: "Two compounds, done right",
                body: "We don't carry fifty SKUs. We stock what we know cold, ship it the same day.",
              },
              {
                k: "Verifiable quality",
                body: "Per-batch HPLC purity and mass-spec verification. COA ships with every order.",
              },
              {
                k: "Speed",
                body: "Pay before 2 PM CT and your order ships from Austin the same business day via USPS Priority. Tracking emailed once it&apos;s out the door.",
              },
              {
                k: "Self-custody payment",
                body: "USDC direct to our wallet. No processor in the middle, no chargebacks, no shutdowns.",
              },
              {
                k: "Research only",
                body: "We supply for laboratory study and never market for human or veterinary use.",
              },
            ].map((row, i) => (
              <Reveal key={row.k} delay={i * 80}>
                <div className="grid grid-cols-[200px_1fr] items-start gap-6 border-b border-ash-200 py-6">
                  <p className="kicker">{row.k}</p>
                  <p className="text-base text-bone-200">{row.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ash-200 bg-bg-2">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center">
          <Reveal>
            <p className="kicker eyebrow-line">Get in touch</p>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.9] tracking-tightest text-bone md:text-6xl">
              Questions? COA requests?
              <span className="block text-bone-300">Quick reply.</span>
            </h2>
            <Link href="/contact" className="btn-ox magnet mt-10 inline-flex">
              Contact us
            </Link>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
