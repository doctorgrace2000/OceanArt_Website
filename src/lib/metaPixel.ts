import type { Product } from "@/data/products";
import type { Locale } from "@/i18n/config";
import { currencyFor, toCurrency } from "@/lib/format";

type Fbq = (cmd: "track", event: string, params?: object, options?: { eventID?: string }) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

/**
 * Envía un evento estándar al píxel de Meta. El script del píxel carga después de
 * hidratar, así que si todavía no está listo se reintenta unos segundos.
 */
export function trackPixel(event: string, params?: object, eventID?: string, tries = 20) {
  if (typeof window === "undefined") return;
  if (window.fbq) {
    window.fbq("track", event, params, eventID ? { eventID } : undefined);
  } else if (tries > 0) {
    window.setTimeout(() => trackPixel(event, params, eventID, tries - 1), 250);
  }
}

/** Parámetros de un producto para ViewContent / AddToCart (en la moneda del idioma). */
export function productParams(product: Product, qty = 1, locale: Locale = "es") {
  return {
    content_ids: [product.slug],
    content_name: product.name,
    content_type: "product",
    contents: [{ id: product.slug, quantity: qty }],
    ...(product.price !== null && {
      value: toCurrency(product.price, locale) * qty,
      currency: currencyFor(locale),
    }),
  };
}
