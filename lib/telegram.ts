/**
 * Telegram bot order notifications.
 *
 * When a customer submits an order, we post a formatted message to a private
 * Telegram chat (your team's). From there, you reply to the customer with a
 * payment link/instructions and confirm shipment.
 *
 * Required env vars:
 *   TELEGRAM_BOT_TOKEN  from @BotFather
 *   TELEGRAM_CHAT_ID    your chat id (or group id) — see SETUP_TELEGRAM.md
 */

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function isConfigured() {
  return Boolean(TOKEN && CHAT_ID);
}

export async function sendOrderToTelegram(message: string): Promise<boolean> {
  if (!isConfigured()) {
    console.warn("[telegram] not configured — order not sent");
    return false;
  }
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      }
    );
    if (!res.ok) {
      console.warn("[telegram] send failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.warn("[telegram] send error", e);
    return false;
  }
}

export function formatOrderMessage(order: {
  customerName: string;
  email: string;
  phone?: string;
  shippingAddress: string;
  city: string;
  state: string;
  zip: string;
  shippingMethod: "standard" | "austin-same-day";
  items: { name: string; quantity: number; unitPriceCents: number }[];
  totalCents: number;
  airtableId?: string | null;
  notes?: string;
}): string {
  const lines: string[] = [];
  lines.push("*New order — Texas Peptides*");
  lines.push("");
  lines.push(`*Customer:* ${order.customerName}`);
  lines.push(`*Email:* ${order.email}`);
  if (order.phone) lines.push(`*Phone:* ${order.phone}`);
  lines.push("");
  lines.push("*Items:*");
  for (const i of order.items) {
    lines.push(
      `• ${i.quantity}× ${i.name} — $${((i.unitPriceCents * i.quantity) / 100).toFixed(2)}`
    );
  }
  lines.push("");
  lines.push(`*Subtotal:* $${(order.totalCents / 100).toFixed(2)}`);
  lines.push(
    `*Shipping:* ${
      order.shippingMethod === "austin-same-day"
        ? "Austin same-day delivery (+$25)"
        : "Standard same-day USPS"
    }`
  );
  lines.push("");
  lines.push("*Ship to:*");
  lines.push(order.shippingAddress);
  lines.push(`${order.city}, ${order.state} ${order.zip}`);
  if (order.notes) {
    lines.push("");
    lines.push(`*Notes:* ${order.notes}`);
  }
  if (order.airtableId) {
    lines.push("");
    lines.push(`Airtable: \`${order.airtableId}\``);
  }
  return lines.join("\n");
}
