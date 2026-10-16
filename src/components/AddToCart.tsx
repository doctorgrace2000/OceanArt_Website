"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import QuantityStepper from "@/components/QuantityStepper";
import { CartIcon, WhatsAppIcon } from "@/components/Icons";
import { isPurchasable, maxQty, type Product } from "@/data/products";
import { useI18n } from "@/i18n/client";
import { useCart } from "@/lib/cart";
import { productParams, trackPixel } from "@/lib/metaPixel";
import { whatsappUrl } from "@/lib/site";

export default function AddToCart({ product: source }: { product: Product }) {
  const { add, lines } = useCart();
  const { locale, t, product: localize } = useI18n();
  const product = localize(source);
  const leadTime = t(
    "Dependiendo del tamaño, suele ser 10 días hábiles de producción.",
    "Depending on size, production usually takes 10 business days.",
  );
  const [qty, setQty] = useState(1);

  const inCart = lines.find((l) => l.slug === product.slug)?.qty ?? 0;
  const max = maxQty(product);
  const remaining = Math.max(0, max - inCart);

  if (product.availability === "vendido") {
    return (
      <div className="space-y-3">
        <Button disabled size="lg" className="w-full">
          {t("Obra vendida", "Sold")}
        </Button>
        <Button
          variant="outline"
          size="md"
          className="w-full"
          href={whatsappUrl(
            t(
              `Hola Ocean Art! Me interesa una obra similar a "${product.name}". ¿Podemos hablar?`,
              `Hi Ocean Art! I'm interested in a piece similar to "${product.name}". Can we talk?`,
            ),
          )}
        >
          <WhatsAppIcon /> {t("Pedir una pieza similar", "Ask for a similar piece")}
        </Button>
      </div>
    );
  }

  if (product.availability === "en-proceso") {
    return (
      <div className="space-y-3">
        <Button
          variant="whatsapp"
          size="lg"
          className="w-full"
          href={whatsappUrl(
            t(
              `Hola Ocean Art! Me interesa "${product.name}", que está en proceso. ¿Podemos hablar?`,
              `Hi Ocean Art! I'm interested in "${product.name}", which is in progress. Can we talk?`,
            ),
          )}
        >
          <WhatsAppIcon /> {t("Consultar por WhatsApp", "Ask on WhatsApp")}
        </Button>
        <p className="text-center text-sm text-stone">
          {t(
            "Obra en proceso: escribinos para reservarla o saber cuándo estará terminada.",
            "Work in progress: message us to reserve it or to find out when it will be ready.",
          )}
        </p>
      </div>
    );
  }

  if (!isPurchasable(product)) {
    return (
      <div className="space-y-3">
        <Button
          variant="whatsapp"
          size="lg"
          className="w-full"
          href={whatsappUrl(
            t(
              `Hola Ocean Art! Quiero cotizar "${product.name}" para mi espacio.`,
              `Hi Ocean Art! I'd like a quote for "${product.name}" for my space.`,
            ),
          )}
        >
          <WhatsAppIcon /> {t("Cotizar por WhatsApp", "Request a quote on WhatsApp")}
        </Button>
        {product.inStock === false && <p className="text-center text-sm text-stone">{leadTime}</p>}
      </div>
    );
  }

  const soldOutForYou = remaining === 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {max > 1 && (
          <QuantityStepper value={qty} min={1} max={Math.max(1, remaining)} onChange={setQty} />
        )}
        <Button
          size="lg"
          className="flex-1"
          disabled={soldOutForYou}
          onClick={() => {
            add(product, qty);
            trackPixel("AddToCart", productParams(product, qty, locale));
          }}
        >
          <CartIcon />{" "}
          {soldOutForYou ? t("Ya está en tu carrito", "Already in your cart") : t("Añadir al carrito", "Add to cart")}
        </Button>
      </div>
      {product.availability === "a-pedido" && product.inStock === false && (
        <p className="text-center text-sm text-stone">{leadTime}</p>
      )}
    </div>
  );
}
