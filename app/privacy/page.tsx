import Reveal from "@/components/Reveal";

export const metadata = { title: "Privacy · Texas Peptides" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-ink-700">
      <Reveal>
        <p className="kicker eyebrow-line">Legal</p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-tightest text-ink-900 md:text-6xl">
          Privacy policy.
        </h1>
      </Reveal>

      <div className="mt-12 space-y-6 text-base leading-relaxed">
        <p>
          Texas Peptides respects your privacy. This page describes what
          information we collect and how it&apos;s used.
        </p>

        <h2 className="mt-10 font-display text-2xl font-medium text-ink-900">
          What we collect
        </h2>
        <p>
          Contact and shipping information you submit via order or contact
          forms, plus minimal usage data (page views) for analytics purposes.
        </p>

        <h2 className="mt-10 font-display text-2xl font-medium text-ink-900">
          How we use it
        </h2>
        <p>
          To fulfill orders, respond to inquiries, and improve the site. We do
          not sell your personal information.
        </p>

        <h2 className="mt-10 font-display text-2xl font-medium text-ink-900">
          Contact
        </h2>
        <p>
          Questions? Email{" "}
          <a href="mailto:hello@texaspeptides.com" className="underline hover:text-ink-900">
            hello@texaspeptides.com
          </a>
          .
        </p>

        <p className="mt-12 text-sm text-ink-400">
          Placeholder. Have a licensed attorney review before production.
        </p>
      </div>
    </div>
  );
}
