import { pick, type Locale } from "@/i18n/config";
import { formatMoney, type Currency } from "@/lib/format";
import { site, whatsappUrl } from "@/lib/site";

export type DeliveryMethod = "retiro" | "envio";

export interface OrderItem {
  slug: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface OrderDelivery {
  method: DeliveryMethod;
  address?: string;
  city?: string;
  province?: string;
  zip?: string;
  /** Solo en pedidos en inglés (envío internacional) */
  country?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  /** Idioma en que se hizo el pedido (los pedidos viejos no lo tienen: español) */
  locale?: Locale;
  /** Moneda de los importes del pedido (los pedidos viejos no la tienen: pesos) */
  currency?: Currency;
  customer: OrderCustomer;
  delivery: OrderDelivery;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  /** En español se paga por transferencia; en inglés el pago se coordina con el cliente. */
  payment: "transferencia" | "a-coordinar";
  status: "pendiente-transferencia" | "pendiente-coordinacion";
}

/** Lo que el cliente manda al servidor. */
export interface OrderInput {
  locale?: Locale;
  customer: OrderCustomer;
  delivery: OrderDelivery;
  notes?: string;
  items: { slug: string; qty: number }[];
}

export const orderLocale = (o: Order): Locale => o.locale ?? "es";

/** Importe de un pedido formateado en su moneda. */
export const orderMoney = (o: Order, amount: number): string =>
  formatMoney(amount, o.currency ?? "ARS");

export function generateOrderId(now = new Date()): string {
  const stamp = now.getTime().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `OA-${stamp}-${rand}`;
}

export function deliveryLabel(d: OrderDelivery, locale: Locale = "es"): string {
  if (d.method === "retiro") {
    return pick(locale, `Retiro en el taller (${site.location})`, `Pickup at our studio (${site.locationEn})`);
  }
  const parts = [d.address, d.city, d.province, d.zip, d.country].filter(Boolean);
  return `${pick(locale, "Envío a", "Ship to")}: ${parts.join(", ")}`;
}

/** Mensaje que se abre en WhatsApp para avisar del pedido / enviar comprobante. */
export function buildOrderWhatsAppMessage(order: Order): string {
  const locale = orderLocale(order);
  const t = (es: string, en: string) => pick(locale, es, en);
  const lines = [
    t(`Hola Ocean Art! Hice el pedido *${order.id}* en la web.`, `Hi Ocean Art! I placed order *${order.id}* on your website.`),
    "",
    ...order.items.map((i) => `• ${i.name} × ${i.qty} — ${orderMoney(order, i.unitPrice * i.qty)}`),
    "",
    `*Total: ${orderMoney(order, order.subtotal)}*`,
    deliveryLabel(order.delivery, locale),
    "",
    `${t("Nombre", "Name")}: ${order.customer.name}`,
    `Email: ${order.customer.email}`,
    `${t("Tel", "Phone")}: ${order.customer.phone}`,
  ];
  if (order.notes) lines.push(`${t("Notas", "Notes")}: ${order.notes}`);
  lines.push(
    "",
    t(
      "Te envío el comprobante de la transferencia a continuación.",
      "I'd like to arrange payment and shipping.",
    ),
  );
  return lines.join("\n");
}

export function orderWhatsAppUrl(order: Order): string {
  return whatsappUrl(buildOrderWhatsAppMessage(order));
}

/** Texto plano para el email de aviso al taller (opcional, vía Resend). */
export function buildOrderEmailText(order: Order): string {
  const english = orderLocale(order) === "en";
  return [
    `Nuevo pedido ${order.id}${english ? " (cliente en inglés, precios en USD)" : ""}`,
    `Fecha: ${order.createdAt}`,
    "",
    "Items:",
    ...order.items.map(
      (i) =>
        `  - ${i.name} (${i.slug}) × ${i.qty} @ ${orderMoney(order, i.unitPrice)} = ${orderMoney(order, i.unitPrice * i.qty)}`,
    ),
    "",
    `Subtotal: ${orderMoney(order, order.subtotal)}`,
    english
      ? "Pago: a coordinar con el cliente (no se le mostraron los datos bancarios)"
      : "Pago: transferencia bancaria (pendiente)",
    deliveryLabel(order.delivery),
    "",
    `Cliente: ${order.customer.name}`,
    `Email: ${order.customer.email}`,
    `Teléfono: ${order.customer.phone}`,
    order.notes ? `Notas: ${order.notes}` : "",
  ]
    .filter((l) => l !== undefined)
    .join("\n");
}

// --- Persistencia local (navegador del cliente) ---------------------------

const ORDERS_KEY = "oceanart:orders:v1";

/** Caché en memoria para devolver siempre la misma referencia por id
 *  (necesario para useSyncExternalStore). */
const orderCache = new Map<string, Order | undefined>();

export function saveOrderLocally(order: Order): void {
  orderCache.set(order.id, order);
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    const all: Order[] = raw ? (JSON.parse(raw) as Order[]) : [];
    const next = [order, ...all.filter((o) => o.id !== order.id)].slice(0, 20);
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
  } catch {
    /* storage no disponible: el pedido igual se mostró en pantalla */
  }
}

export function getLocalOrder(id: string): Order | undefined {
  if (orderCache.has(id)) return orderCache.get(id);
  if (typeof window === "undefined") return undefined;
  let found: Order | undefined;
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    const all: Order[] = raw ? (JSON.parse(raw) as Order[]) : [];
    found = all.find((o) => o.id === id);
  } catch {
    found = undefined;
  }
  orderCache.set(id, found);
  return found;
}
