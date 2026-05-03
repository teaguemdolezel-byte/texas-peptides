"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-neutral-800"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-md bg-accent-500 flex items-center justify-center group-hover:bg-accent-400 transition-colors">
              <span className="text-neutral-950 text-[10px] font-bold tracking-tight font-display">
                TX
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-white">
                Texas Peptides
              </span>
              <span className="text-[8px] uppercase tracking-[0.3em] text-neutral-600 font-medium leading-none">
                Research grade
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/products"
              className="px-5 py-2 text-[13px] font-semibold text-neutral-950 rounded-full bg-accent-500 hover:bg-accent-400 transition-colors"
            >
              Browse
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 -mr-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5 text-neutral-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-neutral-800">
          <div className="px-6 py-5 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3">
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-5 py-2.5 text-sm font-semibold text-neutral-950 rounded-full bg-accent-500"
              >
                Browse
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
