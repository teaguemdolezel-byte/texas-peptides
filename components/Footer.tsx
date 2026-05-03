import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-ash-200 bg-bg-2">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.svg" alt="" className="h-8 w-8" aria-hidden="true" />
            <span className="font-display text-base font-bold uppercase tracking-[0.08em] text-bone">
              Texas Peptides
            </span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-bone-300">
            Research-grade peptides shipped from Austin, Texas. HPLC-verified, COA on every order. For laboratory research only.
          </p>
        </div>

        <div className="md:col-span-2">
          <h4 className="kicker">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-bone-300">
            <li><Link href="/products" className="hover:text-bone">All products</Link></li>
            <li><Link href="/products/retatrutide-10mg" className="hover:text-bone">Retatrutide</Link></li>
            <li><Link href="/products/ghk-cu-50mg" className="hover:text-bone">GHK-Cu</Link></li>
            <li><Link href="/cart" className="hover:text-bone">Cart</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="kicker">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-bone-300">
            <li><Link href="/about" className="hover:text-bone">About</Link></li>
            <li><Link href="/contact" className="hover:text-bone">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="kicker">Legal</h4>
          <ul className="mt-4 space-y-2 text-sm text-bone-300">
            <li><Link href="/disclaimer" className="hover:text-bone">Research-use disclaimer</Link></li>
            <li><Link href="/terms" className="hover:text-bone">Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-bone">Privacy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ash-200">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-5 py-5 font-mono text-[11px] uppercase tracking-[0.18em] text-bone-400 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Texas Peptides LLC · Austin, TX</p>
          <p>Research use only · Not for human consumption</p>
        </div>
      </div>
    </footer>
  );
}
