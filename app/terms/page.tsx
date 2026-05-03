import Reveal from "@/components/Reveal";

export const metadata = { title: "Terms · Texas Peptides" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-ink-700">
      <Reveal>
        <p className="kicker eyebrow-line">Legal</p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-tightest text-ink-900 md:text-6xl">
          Terms of service.
        </h1>
      </Reveal>

      <div className="mt-12 space-y-6 text-base leading-relaxed">
        <p>
          These terms govern your use of the Texas Peptides website and the
          purchase of products sold here. By using this site or placing an
          order, you agree to be bound by these terms.
        </p>

        <h2 className="mt-10 font-display text-2xl font-medium text-ink-900">
          Eligibility
        </h2>
        <p>
          You must be at least 21 years of age and a qualified researcher (or
          affiliated with a qualified research entity) to purchase from this
          site.
        </p>

        <h2 className="mt-10 font-display text-2xl font-medium text-ink-900">
          Use of products
        </h2>
        <p>
          Products are sold for laboratory research use only. See our{" "}
          <a href="/disclaimer" className="underline hover:text-ink-900">
            research-use disclaimer
          </a>
          .
        </p>

        <h2 className="mt-10 font-display text-2xl font-medium text-ink-900">
          Limitation of liability
        </h2>
        <p>
          Texas Peptides LLC&apos;s total liability for any claim arising out
          of the use of its products is limited to the purchase price of the
          product in question.
        </p>

        <p className="mt-12 text-sm text-ink-400">
          Placeholder. Have a licensed attorney review before production.
        </p>
      </div>
    </div>
  );
}
