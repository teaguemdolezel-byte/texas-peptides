"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Are these for human use?",
    a: "No. All products are sold strictly for in-vitro research and laboratory use only. Not for human consumption.",
  },
  {
    q: "How fast do you ship?",
    a: "Same-day dispatch from Austin for orders placed before 2pm CT. Cold-chain packaging included. Most Texas addresses receive within 1-2 business days.",
  },
  {
    q: "Do you include Certificates of Analysis?",
    a: "Every single order. You'll get HPLC chromatogram data, mass spectrometry verification, and amino acid sequence confirmation. No exceptions.",
  },
  {
    q: "What purity level are your peptides?",
    a: "99%+ purity across the board, verified by third-party HPLC testing. We don't ship anything below our threshold. The COA proves it.",
  },
  {
    q: "Can you do custom synthesis?",
    a: "Yes — milligram to gram scale. Tell us what you need and we'll usually have a quote back within a few hours. Hit us up through the form.",
  },
  {
    q: "Do you ship outside Texas?",
    a: "We're focused on serving Texas researchers right now. Austin dispatch means you get it fast. We may expand in the future.",
  },
];

export function ContactContent() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 editorial-gradient" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 animate-fade-in">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.15em]">
              Talk to us
            </span>
            <h1 className="mt-4 text-4xl md:text-6xl font-bold text-ocean-900 tracking-tight leading-[1.1]">
              Two messages,
              <br />
              <span className="font-display italic">not twenty tabs</span>
            </h1>
            <p className="mt-6 text-lg text-ocean-500 leading-relaxed">
              Got a question about a compound? Need help building a research
              stack? Want a custom quote? Just ask. Real answers, usually within
              a few hours.
            </p>
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-10 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-5">
                    <svg
                      className="w-7 h-7 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-ocean-900 mb-2">
                    Got it. We&apos;ll be in touch.
                  </h3>
                  <p className="text-sm text-ocean-500">
                    Usually within a few hours during business days. Check your
                    inbox.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-ocean-700 uppercase tracking-wider mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        className="w-full px-5 py-3.5 text-sm bg-sand-50 border border-sand-200 rounded-xl placeholder:text-ocean-300 text-ocean-900 focus:outline-none focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ocean-700 uppercase tracking-wider mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@email.com"
                        className="w-full px-5 py-3.5 text-sm bg-sand-50 border border-sand-200 rounded-xl placeholder:text-ocean-300 text-ocean-900 focus:outline-none focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ocean-700 uppercase tracking-wider mb-2">
                      What can we help with?
                    </label>
                    <select className="w-full px-5 py-3.5 text-sm bg-sand-50 border border-sand-200 rounded-xl text-ocean-900 focus:outline-none focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400 transition-colors">
                      <option>Product question</option>
                      <option>Custom synthesis quote</option>
                      <option>Bulk / wholesale inquiry</option>
                      <option>Shipping question</option>
                      <option>Something else</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ocean-700 uppercase tracking-wider mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us what you're working on or what you need. The more context, the better answer we can give you."
                      className="w-full px-5 py-3.5 text-sm bg-sand-50 border border-sand-200 rounded-xl placeholder:text-ocean-300 text-ocean-900 focus:outline-none focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-4 text-sm font-semibold text-white rounded-full bg-ocean-900 hover:bg-ocean-800 transition-all hover:-translate-y-0.5"
                  >
                    Send it
                  </button>

                  <p className="text-[11px] text-ocean-400">
                    We don&apos;t share your info. We don&apos;t spam. We just
                    reply.
                  </p>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-8">
              <div className="p-7 rounded-2xl bg-sand-50 border border-sand-200">
                <h3 className="text-base font-bold text-ocean-900 mb-4">
                  Quick info
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Location", value: "Austin, Texas" },
                    { label: "Response time", value: "Usually within hours" },
                    { label: "Shipping", value: "Same-day from Austin" },
                    {
                      label: "Email",
                      value: "hello@texaspeptides.com",
                      href: "mailto:hello@texaspeptides.com",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-start"
                    >
                      <span className="text-xs text-ocean-400 uppercase tracking-wider">
                        {item.label}
                      </span>
                      {"href" in item ? (
                        <a
                          href={item.href}
                          className="text-sm font-medium text-ocean-700 hover:text-ocean-900 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-ocean-700">
                          {item.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-7 rounded-2xl bg-ocean-900 text-white">
                <h3 className="text-base font-bold mb-2">
                  Need a custom synthesis?
                </h3>
                <p className="text-sm text-ocean-300 leading-relaxed mb-4">
                  Milligram to gram scale. Tell us the sequence and quantity
                  &mdash; we&apos;ll quote it fast.
                </p>
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  Typical turnaround: 1-3 weeks
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-sand-50">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.15em]">
              FAQ
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-ocean-900 tracking-tight">
              The stuff everyone asks
            </h2>
          </div>

          <div className="space-y-5">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="p-6 rounded-2xl bg-white border border-sand-200"
              >
                <h3 className="text-base font-bold text-ocean-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-ocean-500 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
