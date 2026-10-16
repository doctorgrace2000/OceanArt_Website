import type { Locale } from "@/i18n/config";

/** Mensaje de error para un celular argentino mal cargado. */
export const AR_PHONE_ERROR =
  "Revisá el número: tiene que tener código de área + número (10 dígitos), ej. 11 5555 5555.";

/**
 * Valida un celular argentino y lo devuelve normalizado (ej. "+54 9 11 5555-5555"), o null si
 * le faltan o sobran dígitos. Acepta cómo lo escribe la gente: con o sin +54, 9, 0 o 15.
 */
export function normalizeArPhone(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("54")) d = d.slice(2);
  if (d.startsWith("9")) d = d.slice(1);
  if (d.startsWith("0")) d = d.slice(1);
  // "15" después del código de área (2 a 4 dígitos): 11 15 5555 5555 → 11 5555 5555
  if (d.length === 12) {
    for (const area of [2, 3, 4]) {
      if (d.slice(area, area + 2) === "15") {
        d = d.slice(0, area) + d.slice(area + 2);
        break;
      }
    }
  }
  // 10 dígitos; ningún código de área empieza en 0 ni en 9, y el único que empieza en 1 es 11.
  if (!/^[1-8]\d{9}$/.test(d) || (d.startsWith("1") && !d.startsWith("11"))) return null;

  return d.startsWith("11")
    ? `+54 9 11 ${d.slice(2, 6)}-${d.slice(6)}`
    : `+54 9 ${d.slice(0, -4)}-${d.slice(-4)}`;
}

export const INTL_PHONE_ERROR =
  "Please check the number: include your country code, e.g. +1 555 123 4567.";

/**
 * En inglés también se aceptan números del exterior, siempre con código de país
 * (+1 555 123 4567 o 001 555…): entre 8 y 15 dígitos. Los +54 se validan como argentinos.
 */
export function normalizePhone(raw: string, locale: Locale): string | null {
  if (locale !== "en") return normalizeArPhone(raw);
  const trimmed = raw.trim();
  const d = trimmed.replace(/\D/g, "");
  const international = trimmed.startsWith("+") ? d : trimmed.startsWith("00") ? d.slice(2) : null;
  if (international === null) return null;
  if (international.startsWith("54")) return normalizeArPhone(international);
  return /^[1-9]\d{7,14}$/.test(international) ? `+${international}` : null;
}

export const phoneError = (locale: Locale): string =>
  locale === "en" ? INTL_PHONE_ERROR : AR_PHONE_ERROR;
