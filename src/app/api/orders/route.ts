import { NextResponse } from "next/server";
import { getProduct, isPurchasable, maxQty } from "@/data/products";
import {
  buildOrderEmailText,
  generateOrderId,
  orderWhatsAppUrl,
  type DeliveryMethod,
  type Order,
  type OrderInput,
  type OrderItem,
} from "@/lib/orders";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const METHODS: DeliveryMethod[] = ["retiro", "envio"];

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

function str(v: unknown, max = 300): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * POST /api/orders
 * Valida el pedido, recalcula los precios desde el catálogo (nunca confía en el
 * cliente), genera un número de pedido y, si hay credenciales, avisa por email.
 */
export async function POST(req: Request) {
  let body: Partial<OrderInput>;
  try {
    body = (await req.json()) as Partial<OrderInput>;
  } catch {
    return bad("Cuerpo inválido.");
  }

  // --- cliente
  const name = str(body.customer?.name, 120);
  const email = str(body.customer?.email, 160);
  const phone = str(body.customer?.phone, 40);
  if (name.length < 2) return bad("Falta el nombre.");
  if (!EMAIL_RE.test(email)) return bad("Email inválido.");
  if (phone.replace(/\D/g, "").length < 8) return bad("Teléfono inválido.");

  // --- entrega
  const method = body.delivery?.method;
  if (!method || !METHODS.includes(method)) return bad("Método de entrega inválido.");
  const delivery: Order["delivery"] = { method };
  if (method === "envio") {
    delivery.address = str(body.delivery?.address, 200);
    delivery.city = str(body.delivery?.city, 100);
    delivery.province = str(body.delivery?.province, 100);
    delivery.zip = str(body.delivery?.zip, 20) || undefined;
    if (!delivery.address || !delivery.city || !delivery.province) {
      return bad("Faltan datos de la dirección de envío.");
    }
  }

  // --- items (precios desde el catálogo)
  if (!Array.isArray(body.items) || body.items.length === 0) return bad("El carrito está vacío.");
  if (body.items.length > 20) return bad("Demasiados items.");

  const items: OrderItem[] = [];
  for (const raw of body.items) {
    const slug = str(raw?.slug, 80);
    const qty = Number(raw?.qty);
    const product = getProduct(slug);
    if (!product) return bad(`La obra "${slug}" no existe.`);
    if (!isPurchasable(product) || product.price === null) {
      return bad(`"${product.name}" no se puede comprar online; cotizala por WhatsApp.`);
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > maxQty(product)) {
      return bad(`Cantidad inválida para "${product.name}".`);
    }
    if (items.some((i) => i.slug === slug)) return bad("Items repetidos.");
    items.push({ slug, name: product.name, qty, unitPrice: product.price });
  }

  const subtotal = items.reduce((n, i) => n + i.unitPrice * i.qty, 0);

  const order: Order = {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    customer: { name, email, phone },
    delivery,
    notes: str(body.notes, 1000) || undefined,
    items,
    subtotal,
    payment: "transferencia",
    status: "pendiente-transferencia",
  };

  // Aviso por email al taller (opcional): se activa con RESEND_API_KEY + ORDER_NOTIFY_EMAIL.
  await notifyByEmail(order);

  // Registro en los logs de Vercel (visible en el dashboard, sin base de datos).
  console.log("[order]", JSON.stringify(order));

  return NextResponse.json({ order, whatsappUrl: orderWhatsAppUrl(order) }, { status: 201 });
}

async function notifyByEmail(order: Order): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFY_EMAIL;
  if (!key || !to) {
    // Queda en los logs de Vercel para saber que el aviso está apagado.
    console.warn(
      `[order] ${order.id} email omitido: falta ${!key ? "RESEND_API_KEY" : ""}${!key && !to ? " y " : ""}${!to ? "ORDER_NOTIFY_EMAIL" : ""}`,
    );
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.ORDER_FROM_EMAIL ?? "Ocean Art <onboarding@resend.dev>",
        to: [to],
        reply_to: order.customer.email,
        subject: `Nuevo pedido ${order.id} · ${order.customer.name}`,
        text: buildOrderEmailText(order),
      }),
    });
    const body = await res.text();
    if (!res.ok) {
      // Resend devuelve el motivo en el cuerpo (clave inválida, destinatario no permitido, etc.)
      console.error(`[order] ${order.id} email rechazado por Resend (HTTP ${res.status}): ${body}`);
      return;
    }
    console.log(`[order] ${order.id} email enviado a ${to}: ${body}`);
  } catch (err) {
    console.error(`[order] ${order.id} email falló`, err);
  }
}
