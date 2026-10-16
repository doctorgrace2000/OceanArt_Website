import type { Locale } from "@/i18n/config";

export type Currency = "ARS" | "USD";

/** En inglés los precios se muestran en dólares: el precio en pesos dividido 1000 (500.000 → USD 500). */
export const ARS_PER_USD = 1000;

export const currencyFor = (locale: Locale): Currency => (locale === "en" ? "USD" : "ARS");

/** Convierte un precio del catálogo (en pesos) a la moneda del idioma. */
export const toCurrency = (ars: number, locale: Locale): number =>
  locale === "en" ? Math.round(ars / ARS_PER_USD) : ars;

const formatters: Record<Currency, Intl.NumberFormat> = {
  ARS: new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }),
  USD: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }),
};

/** Importe ya expresado en su moneda: 500000 ARS → "$ 500.000", 500 USD → "USD 500". */
export const formatMoney = (amount: number, currency: Currency): string =>
  formatters[currency].format(amount).replace(/ /g, " ");

/** Precio del catálogo (en pesos) formateado en la moneda del idioma. */
export const formatPrice = (ars: number, locale: Locale = "es"): string =>
  formatMoney(toCurrency(ars, locale), currencyFor(locale));

export const formatDate = (iso: string, locale: Locale = "es"): string =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-AR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(iso));
