"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-20">
      <Reveal>
        <p className="kicker eyebrow-line">Contact</p>
        <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[0.9] tracking-tightest text-bone md:text-7xl">
          Talk to the lab.
        </h1>
        <p className="mt-6 max-w-xl text-base text-bone-300">
          COA requests, custom orders, or questions about a compound. Usually
          replying within an hour during Austin business hours.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-12 md:grid-cols-[1fr_300px]">
        <form onSubmit={onSubmit} className="space-y-5">
          {sent ? (
            <div className="border border-ash-400 bg-bg-2 p-12 text-center">
              <p className="font-display text-3xl font-bold uppercase tracking-tight text-bone">
                Message sent. Talk soon.
              </p>
            </div>
          ) : (
            <>
              <Field label="Full name" name="name" required />
              <Field label="Email" type="email" name="email" required />
              <Field label="Lab / institution" name="lab" />
              <label className="block">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-bone-400">
                  Message
                </span>
                <textarea
                  required
                  name="message"
                  rows={5}
                  className="mt-2 w-full border border-ash-600 bg-bg-2 px-4 py-3 text-sm text-bone placeholder:text-bone-400 focus:border-bone focus:outline-none"
                />
              </label>
              <button type="submit" className="btn-ox magnet">
                Send message
              </button>
            </>
          )}
        </form>

        <aside className="space-y-6 text-sm text-bone-200">
          <div>
            <h3 className="kicker">Email</h3>
            <a
              href="mailto:hello@texaspeptides.com"
              className="mt-2 block text-bone underline-offset-4 hover:underline"
            >
              hello@texaspeptides.com
            </a>
          </div>
          <div>
            <h3 className="kicker">Hours</h3>
            <p className="mt-2">Mon – Fri · 9 AM – 5 PM CT</p>
          </div>
          <div>
            <h3 className="kicker">Location</h3>
            <p className="mt-2">Austin, Texas</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-bone-400">
        {label}
      </span>
      <input
        {...props}
        className="mt-2 w-full border border-ash-600 bg-bg-2 px-4 py-3 text-sm text-bone placeholder:text-bone-400 focus:border-bone focus:outline-none"
      />
    </label>
  );
}
