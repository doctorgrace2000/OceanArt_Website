import { NextResponse } from "next/server";
import { getProduct, isPurchasable, maxQty } from "@/data/products";
import { localizeProduct } from "@/data/products.en";
import { asLocale, pick } from "@/i18n/config";
import { currencyFor, toCurrency } from "@/lib/format";
import {
  buildOrderEmailText,
  generateOrderId,
  orderWhatsAppUrl,
  type DeliveryMethod,
  type Order,
  type OrderInput,
  type OrderItem,
} from "@/lib/orders";
import { isValidEmail } from "@/lib/email";
import { normalizePhone, phoneError } from "@/lib/phone";

export const runtime = "nodejs";

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

  // En inglés: precios en USD y pago a coordinar (sin datos bancarios)
  const locale = asLocale(str(body.locale, 5));
  const t = (es: string, en: string) => pick(locale, es, en);
  const english = locale === "en";

  // --- cliente
  const name = str(body.customer?.name, 120);
  const email = str(body.customer?.email, 160);
  const phone = normalizePhone(str(body.customer?.phone, 40), locale);
  if (name.length < 2) return bad(t("Falta el nombre.", "Please enter your name."));
  if (!isValidEmail(email)) return bad(t("Email inválido.", "Please check your email."));
  if (!phone) return bad(phoneError(locale));

  // --- entrega
  const method = body.delivery?.method;
  if (!method || !METHODS.includes(method)) return bad(t("Método de entrega inválido.", "Invalid delivery method."));
  const delivery: Order["delivery"] = { method };
  if (method === "envio") {
    delivery.address = str(body.delivery?.address, 200);
    delivery.city = str(body.delivery?.city, 100);
    delivery.province = str(body.delivery?.province, 100);
    delivery.zip = str(body.delivery?.zip, 20) || undefined;
    if (english) delivery.country = str(body.delivery?.country, 100);
    if (!delivery.address || !delivery.city || (english ? !delivery.country : !delivery.province)) {
      return bad(t("Faltan datos de la dirección de envío.", "Some shipping address details are missing."));
    }
    if (english && !delivery.province) delivery.province = undefined;
  }

  // --- items (precios desde el catálogo)
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return bad(t("El carrito está vacío.", "Your cart is empty."));
  }
  if (body.items.length > 20) return bad(t("Demasiados items.", "Too many items."));

  const items: OrderItem[] = [];
  for (const raw of body.items) {
    const slug = str(raw?.slug, 80);
    const qty = Number(raw?.qty);
    const product = getProduct(slug);
    if (!product) return bad(t(`La obra "${slug}" no existe.`, `The piece "${slug}" does not exist.`));
    const pieceName = localizeProduct(product, locale).name;
    if (!isPurchasable(product) || product.price === null) {
      return bad(
        t(
          `"${pieceName}" no se puede comprar online; cotizala por WhatsApp.`,
          `"${pieceName}" can't be bought online; ask us for a quote on WhatsApp.`,
        ),
      );
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > maxQty(product)) {
      return bad(t(`Cantidad inválida para "${pieceName}".`, `Invalid quantity for "${pieceName}".`));
    }
    if (items.some((i) => i.slug === slug)) return bad(t("Items repetidos.", "Duplicate items."));
    items.push({ slug, name: pieceName, qty, unitPrice: toCurrency(product.price, locale) });
  }

  const subtotal = items.reduce((n, i) => n + i.unitPrice * i.qty, 0);

  const order: Order = {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    locale,
    currency: currencyFor(locale),
    customer: { name, email, phone },
    delivery,
    notes: str(body.notes, 1000) || undefined,
    items,
    subtotal,
    payment: english ? "a-coordinar" : "transferencia",
    status: english ? "pendiente-coordinacion" : "pendiente-transferencia",
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
