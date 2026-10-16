/**
 * Idiomas del sitio. El español vive en las rutas de siempre (/tienda) y el inglés
 * con el prefijo /en (/en/tienda). El proxy (src/proxy.ts) reescribe las rutas sin
 * prefijo a /es internamente.
 */
export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

export const asLocale = (v: string): Locale => (isLocale(v) ? v : defaultLocale);

/** Elige el texto según el idioma. */
export const pick = <T,>(locale: Locale, es: T, en: T): T => (locale === "en" ? en : es);

/** "/tienda" → "/en/tienda" en inglés; igual en español. */
export function localizePath(path: string, locale: Locale): string {
  if (locale === defaultLocale || !path.startsWith("/") || path.startsWith("//")) return path;
  if (path === "/") return "/en";
  if (path.startsWith("/#") || path.startsWith("/?")) return `/en${path.slice(1)}`;
  return `/en${path}`;
}

/** Saca el prefijo de idioma: "/en/tienda" → "/tienda". */
export function stripLocale(pathname: string): string {
  if (pathname === "/en" || pathname === "/es") return "/";
  if (pathname.startsWith("/en/") || pathname.startsWith("/es/")) return pathname.slice(3);
  return pathname;
}

/** Ruta canónica + alternativas por idioma, para los metadatos. */
export function alternates(path: string, locale: Locale) {
  return {
    canonical: localizePath(path, locale),
    languages: {
      es: path,
      en: localizePath(path, "en"),
      "x-default": path,
    },
  };
}
