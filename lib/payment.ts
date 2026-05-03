/**
 * Self-custody USDC payment.
 *
 * The customer gets a unique amount (e.g. $89.34 instead of $89.00) and a QR
 * code with our wallet address. They send USDC. Our backend polls a public
 * RPC endpoint for incoming USDC transfers to that wallet and matches by
 * (amount, time window) to mark the order Paid.
 *
 * No processor in the middle. Funds go directly to your wallet. Cannot be
 * frozen or shut down by a third party.
 *
 * Required env vars (see SETUP_CRYPTO.md):
 *   SOLANA_USDC_ADDRESS   your Solana wallet's USDC token account or main address
 *   SOLANA_RPC_URL        defaults to public mainnet-beta endpoint
 *   ETHEREUM_USDC_ADDRESS optional, EVM-compatible address (works for Base/Polygon too)
 *   ETHERSCAN_API_KEY     optional, used to scan EVM chains
 */

export type Chain = "Solana" | "Ethereum" | "Base" | "Polygon";

export const SUPPORTED_CHAINS: Chain[] = ["Solana", "Ethereum", "Base", "Polygon"];

export const CHAIN_CONFIG: Record<
  Chain,
  {
    label: string;
    addressEnv: string;
    explorerTx: (h: string) => string;
    note: string;
  }
> = {
  Solana: {
    label: "Solana",
    addressEnv: "SOLANA_USDC_ADDRESS",
    explorerTx: (h) => `https://solscan.io/tx/${h}`,
    note: "Fastest. ~1 sec confirmation. $0.00025 fee.",
  },
  Ethereum: {
    label: "Ethereum",
    addressEnv: "ETHEREUM_USDC_ADDRESS",
    explorerTx: (h) => `https://etherscan.io/tx/${h}`,
    note: "Most widely supported. Higher gas.",
  },
  Base: {
    label: "Base",
    addressEnv: "ETHEREUM_USDC_ADDRESS",
    explorerTx: (h) => `https://basescan.org/tx/${h}`,
    note: "Coinbase's L2. Cheap. Same address as Ethereum.",
  },
  Polygon: {
    label: "Polygon",
    addressEnv: "ETHEREUM_USDC_ADDRESS",
    explorerTx: (h) => `https://polygonscan.com/tx/${h}`,
    note: "Cheap and fast. Same address as Ethereum.",
  },
};

export function getChainAddress(chain: Chain): string | undefined {
  return process.env[CHAIN_CONFIG[chain].addressEnv];
}

/**
 * Returns the order's payment amount unchanged.
 *
 * Earlier versions added a 1–99¢ unique suffix per order so an amount-only
 * watcher could disambiguate concurrent payments to a single static address.
 * That's no longer needed: paygate.to (and its unique-address-per-order
 * model) handles disambiguation on the gateway side.
 */
export function uniquePaymentAmountCents(
  _orderId: string,
  totalCents: number
): number {
  return totalCents;
}

/**
 * USDC mint addresses.
 */
export const USDC_MINTS = {
  Solana: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  Ethereum: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  Base: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  Polygon: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
} as const;

/**
 * Polls Solana RPC for recent SPL token transfers to our USDC token account
 * and matches incoming amount to the expected payment.
 *
 * Returns the tx signature if a match is found within the time window.
 */
export async function findSolanaUsdcPayment(
  expectedAmountCents: number,
  sinceMs: number
): Promise<{ txHash: string; amountCents: number } | null> {
  const recipient = process.env.SOLANA_USDC_ADDRESS;
  if (!recipient) return null;

  const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

  // Get recent signatures for the recipient address (limit 20 — last few minutes)
  const sigsRes = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getSignaturesForAddress",
      params: [recipient, { limit: 25 }],
    }),
    cache: "no-store",
  });

  if (!sigsRes.ok) return null;
  const sigs = (await sigsRes.json()) as {
    result?: { signature: string; blockTime?: number }[];
  };
  if (!sigs.result) return null;

  const expected = expectedAmountCents / 100; // dollars

  for (const s of sigs.result) {
    if (s.blockTime && s.blockTime * 1000 < sinceMs) continue;

    // Pull the parsed transaction
    const txRes = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTransaction",
        params: [
          s.signature,
          { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 },
        ],
      }),
      cache: "no-store",
    });
    if (!txRes.ok) continue;
    const tx = (await txRes.json()) as any;
    const inner = tx?.result?.meta?.innerInstructions ?? [];
    const main = tx?.result?.transaction?.message?.instructions ?? [];

    const allInstr = [...main, ...inner.flatMap((g: any) => g.instructions ?? [])];
    for (const ix of allInstr) {
      if (
        ix?.program === "spl-token" &&
        (ix?.parsed?.type === "transfer" ||
          ix?.parsed?.type === "transferChecked")
      ) {
        const info = ix.parsed.info;
        const tokenAmount =
          info?.tokenAmount?.uiAmount ?? Number(info?.amount ?? 0) / 1_000_000;
        // USDC has 6 decimals. tokenAmount is human-readable USD.
        if (Math.abs(tokenAmount - expected) < 0.005) {
          return {
            txHash: s.signature,
            amountCents: Math.round(tokenAmount * 100),
          };
        }
      }
    }
  }

  return null;
}

/**
 * EVM payment watcher (Ethereum / Base / Polygon) — uses Etherscan-family
 * APIs. Stub for now — wire up by setting ETHERSCAN_API_KEY and uncommenting
 * the implementation. For v1 we ship Solana-only auto-confirm.
 */
export async function findEvmUsdcPayment(
  _chain: "Ethereum" | "Base" | "Polygon",
  _expectedAmountCents: number,
  _sinceMs: number
): Promise<{ txHash: string; amountCents: number } | null> {
  // TODO v2: implement via Etherscan / Basescan / Polygonscan API.
  return null;
}
