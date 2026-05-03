"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-8 w-8 rounded-md bg-accent-500 flex items-center justify-center">
                <span className="text-neutral-950 text-[10px] font-bold font-display">TX</span>
              </div>
              <span className="text-base font-semibold tracking-tight text-white">
                Texas Peptides
              </span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm mb-6">
              Your peptide concierge in Austin. We read the studies so you
              don&apos;t have to open 20 tabs. Premium research compounds,
              zero fluff.
            </p>
            <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-700">
              For research use only &mdash; not for human consumption
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600 mb-5">
              Shop
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/products", label: "All Peptides" },
                { href: "/products#popular", label: "Best Sellers" },
                { href: "/products#custom", label: "Custom Synthesis" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-neutral-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600 mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "Our Story" },
                { href: "/about#quality", label: "Quality" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-neutral-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600 mb-5">
              Stay in the loop
            </h3>
            <p className="text-sm text-neutral-500 mb-4">
              Protocol tips &amp; new drops. No spam.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 px-4 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded-full placeholder:text-neutral-700 text-white focus:outline-none focus:border-neutral-600 transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold text-neutral-950 bg-accent-500 rounded-full hover:bg-accent-400 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-neutral-700">
            &copy; {new Date().getFullYear()} Texas Peptides LLC &middot; Austin, TX
          </p>
          <div className="flex items-center gap-6">
            {["Instagram", "TikTok", "X"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-[11px] text-neutral-700 hover:text-neutral-400 transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
