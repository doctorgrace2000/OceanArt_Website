"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import QuantityStepper from "@/components/QuantityStepper";
import { CartIcon, WhatsAppIcon } from "@/components/Icons";
import { isPurchasable, maxQty, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { whatsappUrl } from "@/lib/site";

export default function AddToCart({ product }: { product: Product }) {
  const { add, lines } = useCart();
  const [qty, setQty] = useState(1);

  const inCart = lines.find((l) => l.slug === product.slug)?.qty ?? 0;
  const max = maxQty(product);
  const remaining = Math.max(0, max - inCart);

  if (product.availability === "vendido") {
    return (
      <div className="space-y-3">
        <Button disabled size="lg" className="w-full">
          Obra vendida
        </Button>
        <Button
          variant="outline"
          size="md"
          className="w-full"
          href={whatsappUrl(`Hola Ocean Art! Me interesa una obra similar a "${product.name}". ¿Podemos hablar?`)}
        >
          <WhatsAppIcon /> Pedir una pieza similar
        </Button>
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
          href={whatsappUrl(`Hola Ocean Art! Quiero cotizar "${product.name}" para mi espacio.`)}
        >
          <WhatsAppIcon /> Cotizar por WhatsApp
        </Button>
        <p className="text-center text-sm text-stone">
          Esta pieza se adapta al espacio: contanos medidas y te pasamos un presupuesto.
        </p>
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
          onClick={() => add(product, qty)}
        >
          <CartIcon /> {soldOutForYou ? "Ya está en tu carrito" : "Añadir al carrito"}
        </Button>
      </div>
      <p className="text-center text-sm text-stone">
        {product.availability === "unico"
          ? "Pieza única: una sola disponible."
          : "Se produce a pedido. Tiempo de realización: 3 a 6 semanas."}
      </p>
    </div>
  );
}
