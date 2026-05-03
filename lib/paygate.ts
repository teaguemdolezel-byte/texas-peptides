/**
 * paygate.to integration — non-custodial USDC checkout.
 *
 * No API key. No account. The merchant just provides a USDC-on-Polygon
 * receive address, and paygate.to handles all the customer-facing UX
 * (multi-coin selector, QR code, chain monitoring, USD conversion).
 *
 * Funds settle directly to the merchant wallet — paygate.to never
 * custodies them.
 *
 * API verified against the open-source plugin source:
 *
 *   GET https://api.paygate.to/control/wallet.php
 *       ?address=<merchant-usdc-polygon-address>
 *       &callback=<url-encoded-callback-with-our-order-id>
 *
 *   Response:
 *     {
 *       "address_in": "0x...",            // one-time deposit address
 *       "polygon_address_in": "0x...",
 *       "callback_url": "...",
 *       "status": "success"
 *     }
 *
 * Hosted checkout (where we redirect the customer):
 *
 *   https://checkout.paygate.to/pay.php
 *     ?address=<address_in>
 *     &amount=<usd-amount>
 *     &currency=USD
 *     &email=<customer-email-optional>
 *     &item_desc=<order-description>
 *
 * paygate.to then redirects the customer back to our `callback` URL once
 * the payment lands, with the following GET params appended:
 *
 *     order_id, nonce, txid_out, value_coin, coin
 *
 * We use that to mark the order Paid.
 */

const MERCHANT_ADDRESS = process.env.PAYGATE_MERCHANT_ADDRESS;
const PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

const PAYGATE_API = "https://api.paygate.to/control/wallet.php";
const PAYGATE_HOSTED_CHECKOUT = "https://checkout.paygate.to/pay.php";

export function isPaygateConfigured(): boolean {
  return Boolean(MERCHANT_ADDRESS);
}

export async function createPaygateSession(input: {
  orderId: string;
  totalCents: number;
  customerEmail?: string;
}): Promise<{
  checkoutUrl: string;
  depositAddress: string;
  callbackUrl: string;
} | null> {
  if (!MERCHANT_ADDRESS) return null;

  // The callback is a single URL — paygate.to hits it both as IPN (when
  // payment confirms) and as the customer return URL. We embed our
  // orderId in it so the webhook can map the IPN back to our order.
  const callbackUrl = `${PUBLIC_BASE_URL}/api/paygate-webhook?orderId=${encodeURIComponent(
    input.orderId
  )}`;

  const url = new URL(PAYGATE_API);
  url.searchParams.set("address", MERCHANT_ADDRESS);
  url.searchParams.set("callback", callbackUrl);

  let depositAddress: string;
  try {
    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TexasPeptides/1.0)",
        Accept: "application/json",
      },
    });
    const text = await res.text();
    if (!res.ok) {
      console.warn("[paygate] wallet API failed", res.status, text.slice(0, 500));
      return null;
    }
    let data: { address_in?: string; polygon_address_in?: string; callback_url?: string };
    try {
      data = JSON.parse(text);
    } catch {
      console.warn("[paygate] wallet API non-JSON response", text.slice(0, 500));
      return null;
    }
    const addr = data.address_in ?? data.polygon_address_in;
    if (!addr) {
      console.warn("[paygate] wallet API missing address_in", data);
      return null;
    }
    depositAddress = addr;
  } catch (e) {
    console.warn("[paygate] wallet API error", e);
    return null;
  }

  // Build the hosted checkout URL. paygate.to displays its multi-coin
  // chooser + QR there.
  const checkout = new URL(PAYGATE_HOSTED_CHECKOUT);
  checkout.searchParams.set("address", depositAddress);
  checkout.searchParams.set("amount", (input.totalCents / 100).toFixed(2));
  checkout.searchParams.set("currency", "USD");
  checkout.searchParams.set(
    "item_desc",
    `Texas Peptides · Order ${input.orderId}`
  );
  if (input.customerEmail) {
    checkout.searchParams.set("email", input.customerEmail);
  }

  return {
    checkoutUrl: checkout.toString(),
    depositAddress,
    callbackUrl,
  };
}

/**
 * paygate.to IPN payload — based on the documented callback parameters
 * appended to the callback URL when payment confirms.
 */
export type PaygateIpn = {
  orderId: string;
  txid?: string;            // transaction id on chain
  amountReceived?: number;  // value in coin
  coin?: string;            // e.g. "polygon_pol"
  nonce?: string;           // verification token
};

export function parsePaygateIpn(
  searchParams: URLSearchParams,
  body: Record<string, string | number | undefined>
): PaygateIpn {
  const get = (key: string): string | undefined => {
    const fromBody = body[key];
    if (fromBody !== undefined && fromBody !== null) return String(fromBody);
    return searchParams.get(key) ?? undefined;
  };
  return {
    // We pass orderId in the callback URL's query string ourselves
    orderId: get("orderId") ?? get("order_id") ?? "",
    txid: get("txid_out") ?? get("txid") ?? get("transaction_id"),
    amountReceived: numOrUndef(
      get("value_coin") ?? get("value_forwarded_coin") ?? get("amount_received") ?? get("amount")
    ),
    coin: get("coin"),
    nonce: get("nonce"),
  };
}

function numOrUndef(s: string | undefined): number | undefined {
  if (s === undefined || s === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}
