import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Hits paygate.to from server-side and dumps everything we get back.
 * Visit /api/paygate-debug in browser. NOT for production — purely a
 * troubleshooting endpoint.
 */
export async function GET() {
  const merchant = process.env.PAYGATE_MERCHANT_ADDRESS;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  if (!merchant) {
    return NextResponse.json({
      ok: false,
      reason: "PAYGATE_MERCHANT_ADDRESS not set in .env.local",
    });
  }

  const callback = `${baseUrl}/api/paygate-webhook?orderId=DEBUG`;
  const url =
    "https://api.paygate.to/control/wallet.php" +
    `?address=${encodeURIComponent(merchant)}` +
    `&callback=${encodeURIComponent(callback)}`;

  const result: any = {
    requestedUrl: url,
    merchantAddress: merchant,
    callbackUrl: callback,
  };

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TexasPeptides/1.0)",
        Accept: "application/json",
      },
    });
    result.httpStatus = res.status;
    result.contentType = res.headers.get("content-type");
    const text = await res.text();
    result.responseBody = text.slice(0, 4000);
    try {
      result.parsedJson = JSON.parse(text);
    } catch {
      result.parsedJson = null;
    }
  } catch (e: any) {
    result.fetchError = String(e?.message ?? e);
  }

  return NextResponse.json(result, { status: 200 });
}
