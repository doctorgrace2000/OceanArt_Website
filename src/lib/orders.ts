import { formatPrice } from "@/lib/format";
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
}

export interface Order {
  id: string;
  createdAt: string;
  customer: OrderCustomer;
  delivery: OrderDelivery;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  payment: "transferencia";
  status: "pendiente-transferencia";
}

/** Lo que el cliente manda al servidor. */
export interface OrderInput {
  customer: OrderCustomer;
  delivery: OrderDelivery;
  notes?: string;
  items: { slug: string; qty: number }[];
}

export function generateOrderId(now = new Date()): string {
  const stamp = now.getTime().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `OA-${stamp}-${rand}`;
}

export function deliveryLabel(d: OrderDelivery): string {
  if (d.method === "retiro") return `Retiro en el taller (${site.location})`;
  const parts = [d.address, d.city, d.province, d.zip].filter(Boolean);
  return `Envío a: ${parts.join(", ")}`;
}

/** Mensaje que se abre en WhatsApp para avisar del pedido / enviar comprobante. */
export function buildOrderWhatsAppMessage(order: Order): string {
  const lines = [
    `Hola Ocean Art! Hice el pedido *${order.id}* en la web.`,
    "",
    ...order.items.map(
      (i) => `• ${i.name} × ${i.qty} — ${formatPrice(i.unitPrice * i.qty)}`,
    ),
    "",
    `*Total: ${formatPrice(order.subtotal)}*`,
    deliveryLabel(order.delivery),
    "",
    `Nombre: ${order.customer.name}`,
    `Email: ${order.customer.email}`,
    `Tel: ${order.customer.phone}`,
  ];
  if (order.notes) lines.push(`Notas: ${order.notes}`);
  lines.push("", "Te envío el comprobante de la transferencia a continuación.");
  return lines.join("\n");
}

export function orderWhatsAppUrl(order: Order): string {
  return whatsappUrl(buildOrderWhatsAppMessage(order));
}

/** Texto plano para el email de aviso al taller (opcional, vía Resend). */
export function buildOrderEmailText(order: Order): string {
  return [
    `Nuevo pedido ${order.id}`,
    `Fecha: ${order.createdAt}`,
    "",
    "Items:",
    ...order.items.map(
      (i) =>
        `  - ${i.name} (${i.slug}) × ${i.qty} @ ${formatPrice(i.unitPrice)} = ${formatPrice(i.unitPrice * i.qty)}`,
    ),
    "",
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Pago: transferencia bancaria (pendiente)`,
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
