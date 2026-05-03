import { NextRequest, NextResponse } from "next/server";
import {
  fetchOrderByOrderId,
  markOrderPaid,
} from "@/lib/airtable";
import {
  findSolanaUsdcPayment,
  findEvmUsdcPayment,
} from "@/lib/payment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Polled by the /pay/[orderId] page every few seconds.
 *
 * Returns { status: "Pending payment" | "Paid" | ... }. If the order is still
 * pending, we look at the relevant chain for an incoming USDC transfer
 * matching the unique amount; if found, we update Airtable to Paid and
 * return the new status.
 */
export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const order = await fetchOrderByOrderId(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Already moved past pending — just report the current state
  if (order.status !== "Pending payment") {
    return NextResponse.json({
      status: order.status,
      txHash: order.txHash ?? null,
      trackingNumber: order.trackingNumber ?? null,
    });
  }

  // Search for an on-chain payment matching this order's unique amount.
  // Look back 2 hours.
  const sinceMs = Date.now() - 2 * 60 * 60 * 1000;

  let match: { txHash: string; amountCents: number } | null = null;

  if (order.paymentChain === "Solana") {
    match = await findSolanaUsdcPayment(order.paymentAmountCents, sinceMs);
  } else if (
    order.paymentChain === "Ethereum" ||
    order.paymentChain === "Base" ||
    order.paymentChain === "Polygon"
  ) {
    match = await findEvmUsdcPayment(
      order.paymentChain,
      order.paymentAmountCents,
      sinceMs
    );
  }

  if (match) {
    await markOrderPaid(order.airtableId, match.txHash);
    return NextResponse.json({
      status: "Paid",
      txHash: match.txHash,
    });
  }

  return NextResponse.json({
    status: "Pending payment",
    txHash: null,
  });
}
