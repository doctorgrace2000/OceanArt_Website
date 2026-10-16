"use client";

import NextLink from "next/link";
import { createContext, useContext, useMemo, type ComponentProps, type ReactNode } from "react";
import { localizeProduct } from "@/data/products.en";
import type { Product } from "@/data/products";
import { localizePath, type Locale } from "@/i18n/config";
import { formatPrice } from "@/lib/format";

const LocaleContext = createContext<Locale>("es");

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Todo lo que un componente necesita para mostrarse en el idioma actual. */
export function useI18n() {
  const locale = useLocale();
  return useMemo(
    () => ({
      locale,
      /** t("Tienda", "Shop") */
      t: <T,>(es: T, en: T): T => (locale === "en" ? en : es),
      href: (path: string) => localizePath(path, locale),
      price: (ars: number) => formatPrice(ars, locale),
      product: (p: Product) => localizeProduct(p, locale),
    }),
    [locale],
  );
}

/** Igual que next/link, pero agrega /en a los enlaces internos cuando el sitio está en inglés. */
export function Link({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  const to = typeof href === "string" ? localizePath(href, locale) : href;
  return <NextLink href={to} {...rest} />;
}
