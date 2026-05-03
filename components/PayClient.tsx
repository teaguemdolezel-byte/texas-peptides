"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

type Props = {
  orderId: string;
  paymentChain: string;
  walletAddress: string | null;
  paymentAmountCents: number;
  totalCents: number;
};

export default function PayClient({
  orderId,
  paymentChain,
  walletAddress,
  paymentAmountCents,
  totalCents,
}: Props) {
  const router = useRouter();
  const clearCart = useCart((s) => s.clear);
  const [status, setStatus] = useState<string>("Pending payment");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [copied, setCopied] = useState<"address" | "amount" | null>(null);
  const cartCleared = useRef(false);

  // Poll payment status every 5 seconds
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch(`/api/payment-status?orderId=${orderId}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (cancelled) return;
        setStatus(data.status);
        if (data.txHash) setTxHash(data.txHash);
        if (data.status !== "Pending payment") {
          if (!cartCleared.current) {
            clearCart();
            cartCleared.current = true;
          }
          // Redirect to confirmation page
          setTimeout(() => router.push(`/order/${orderId}`), 1200);
        }
      } catch {}
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [orderId, router, clearCart]);

  const amountUsd = (paymentAmountCents / 100).toFixed(2);

  // Build a payment URI (different per chain) — mainstream wallets recognize these
  // for "click to pay" / QR scan.
  const uri = walletAddress ? buildUri(paymentChain, walletAddress, paymentAmountCents) : "";
  const qrSrc = uri
    ? `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=4&data=${encodeURIComponent(uri)}`
    : "";

  const copy = async (text: string, what: "address" | "amount") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const isPaid = status === "Paid" || status === "Shipped" || status === "Delivered";

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <p className="kicker eyebrow-line">Checkout · 2 of 2</p>
      <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[0.9] tracking-tightest text-bone md:text-7xl">
        {isPaid ? "Payment received." : "Send USDC."}
      </h1>
      <p className="mt-4 max-w-xl text-base text-bone-300">
        {isPaid ? (
          <>Confirmed on-chain. Redirecting to your order…</>
        ) : (
          <>
            Send <span className="font-mono text-bone">${amountUsd}</span> in USDC
            on <span className="font-mono text-bone">{paymentChain}</span>. We
            confirm automatically when the transfer lands.
          </>
        )}
      </p>

      <div className="mt-12 grid gap-12 md:grid-cols-[400px_1fr]">
        {/* QR + address */}
        <div className="space-y-5">
          <div className="border border-ash-400 bg-bg-2 p-5">
            <p className="kicker">Scan with your wallet</p>
            <div className="mt-4 grid aspect-square place-items-center bg-bone p-4">
              {qrSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrSrc} alt="Payment QR" className="h-full w-full object-contain" />
              ) : (
                <div className="text-center font-mono text-xs text-bg">
                  Wallet not configured.
                  <br />
                  See SETUP_CRYPTO.md
                </div>
              )}
            </div>
          </div>

          <Field
            label={`${paymentChain} address`}
            value={walletAddress ?? "(not configured)"}
            onCopy={() => walletAddress && copy(walletAddress, "address")}
            copied={copied === "address"}
            mono
          />
          <Field
            label="Amount (exact)"
            value={`${amountUsd} USDC`}
            onCopy={() => copy(amountUsd, "amount")}
            copied={copied === "amount"}
            mono
            highlight
          />

          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-400">
            Send the exact amount above.
          </p>
        </div>

        {/* Status + summary */}
        <div className="space-y-6">
          <div
            className={`border p-6 ${
              isPaid
                ? "border-green-700 bg-green-950/20"
                : "border-ox-500 bg-ox-500/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-2 w-2 ${
                  isPaid ? "bg-green-500" : "bg-ox-500 pulse-dot"
                }`}
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone-200">
                {isPaid ? "Confirmed" : "Awaiting payment"}
              </span>
            </div>
            <p className="mt-3 text-sm text-bone-300">
              {isPaid ? (
                <>
                  We saw your transfer.{" "}
                  {txHash && (
                    <a
                      href={explorerUrl(paymentChain, txHash)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-bone"
                    >
                      View tx
                    </a>
                  )}
                </>
              ) : (
                <>Watching the {paymentChain} chain. We poll every 5 seconds.</>
              )}
            </p>
          </div>

          <div className="border border-ash-400 bg-bg-2 p-6">
            <p className="kicker">Order</p>
            <div className="mt-4 space-y-2 text-sm">
              <Row k="Order ID" v={<span className="font-mono">{orderId}</span>} />
              <Row k="Chain" v={paymentChain} />
              <Row k="Total" v={`$${amountUsd}`} highlight />
            </div>
          </div>

          <div className="border border-ash-200 bg-bg-2 p-6">
            <p className="kicker">Don&apos;t have USDC yet?</p>
            <ul className="mt-4 space-y-2 text-xs leading-relaxed text-bone-300">
              <li>
                <span className="text-bone">Solana:</span> Phantom, Solflare,
                Backpack — any can buy USDC with debit/Apple Pay.
              </li>
              <li>
                <span className="text-bone">Ethereum / Base / Polygon:</span>{" "}
                MetaMask, Rabby, Coinbase Wallet — buy USDC, pick the right
                network, send.
              </li>
              <li>
                <span className="text-bone">From Coinbase / Kraken:</span>{" "}
                withdraw USDC, pick {paymentChain} network, send to address
                above.
              </li>
            </ul>
          </div>

          <p className="text-xs text-bone-400">
            Stuck?{" "}
            <Link href="/contact" className="underline hover:text-bone">
              Contact us
            </Link>{" "}
            and reference order {orderId}.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onCopy,
  copied,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="kicker">{label}</p>
      <div
        className={`mt-2 flex items-center justify-between gap-3 border p-3 ${
          highlight ? "border-ox-500 bg-ox-500/5" : "border-ash-600 bg-bg-2"
        }`}
      >
        <span
          className={`min-w-0 truncate text-sm ${
            mono ? "font-mono" : ""
          } ${highlight ? "text-bone" : "text-bone-200"}`}
        >
          {value}
        </span>
        <button
          onClick={onCopy}
          className="shrink-0 border border-ash-600 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-300 hover:border-bone hover:text-bone"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function Row({
  k,
  v,
  highlight,
}: {
  k: string;
  v: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between border-b border-ash-200 pb-2 ${
        highlight ? "text-bone" : "text-bone-300"
      }`}
    >
      <span>{k}</span>
      <span className={highlight ? "font-display font-bold" : ""}>{v}</span>
    </div>
  );
}

function buildUri(chain: string, address: string, amountCents: number): string {
  const amount = (amountCents / 100).toFixed(2);
  // Most wallets accept a generic URI with the address — prefilling amount
  // depends on the wallet, so we just give the address. Some wallets accept
  // chain-specific URIs:
  if (chain === "Solana") {
    return `solana:${address}?amount=${amount}&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&label=Texas%20Peptides`;
  }
  // EVM (Ethereum / Base / Polygon)
  return `ethereum:${address}@1/transfer?address=0xA0b86991c6218b36c1D19D4a2e9Eb0cE3606eB48&uint256=${Math.round(amountCents * 10000)}`;
}

function explorerUrl(chain: string, hash: string): string {
  if (chain === "Solana") return `https://solscan.io/tx/${hash}`;
  if (chain === "Base") return `https://basescan.org/tx/${hash}`;
  if (chain === "Polygon") return `https://polygonscan.com/tx/${hash}`;
  return `https://etherscan.io/tx/${hash}`;
}
