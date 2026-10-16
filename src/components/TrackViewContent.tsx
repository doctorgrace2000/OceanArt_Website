"use client";

import { useEffect } from "react";
import { getProduct } from "@/data/products";
import { useLocale } from "@/i18n/client";
import { productParams, trackPixel } from "@/lib/metaPixel";

// Evento ViewContent del píxel de Meta al abrir la ficha de una obra.
export default function TrackViewContent({ slug }: { slug: string }) {
  const locale = useLocale();
  useEffect(() => {
    const product = getProduct(slug);
    if (product) trackPixel("ViewContent", productParams(product, 1, locale));
  }, [slug, locale]);

  return null;
}
