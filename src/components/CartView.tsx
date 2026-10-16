"use client";

import Image from "next/image";
import { TrashIcon } from "@/components/Icons";
import QuantityStepper from "@/components/QuantityStepper";
import Button from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { categoryLabel, maxQty } from "@/data/products";
import { Link, useI18n } from "@/i18n/client";
import { useCart } from "@/lib/cart";

export default function CartView() {
  const { lines, subtotal, count, hydrated, setQty, remove } = useCart();
  const { locale, t, price, product: localize } = useI18n();

  return (
    <Container className="py-10 md:py-14">
      <h1 className="text-3xl font-medium tracking-tight text-navy">{t("Tu carrito", "Your cart")}</h1>

      {!hydrated ? (
        <p className="mt-10 text-stone">{t("Cargando…", "Loading…")}</p>
      ) : lines.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-foam p-12 text-center">
          <p className="text-lg text-ink">{t("Todavía no agregaste ninguna obra.", "You haven't added any pieces yet.")}</p>
          <div className="mt-6">
            <Button href="/tienda">{t("Ver obras disponibles", "See available pieces")}</Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <ul className="divide-y divide-foam">
            {lines.map(({ product: source, qty, lineTotal }) => {
              const product = localize(source);
              return (
                <li key={product.slug} className="flex gap-4 py-5">
                  <Link href={`/tienda/${product.slug}`} className="relative h-28 w-22 shrink-0 overflow-hidden rounded-xl bg-sand">
                    <Image src={product.images[0]} alt={product.name} fill sizes="96px" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={`/tienda/${product.slug}`} className="font-medium text-ink hover:text-navy">
                          {product.name}
                        </Link>
                        <p className="text-sm text-stone">
                          {categoryLabel(product, locale)}
                          {product.dimensions ? ` · ${product.dimensions}` : ""}
                        </p>
                      </div>
                      <p className="shrink-0 text-navy">{price(lineTotal)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      {maxQty(product) > 1 ? (
                        <QuantityStepper
                          size="sm"
                          value={qty}
                          max={maxQty(product)}
                          onChange={(v) => setQty(product.slug, v)}
                        />
                      ) : (
                        <span />
                      )}
                      <button
                        type="button"
                        onClick={() => remove(product.slug)}
                        className="inline-flex items-center gap-1 text-sm text-stone hover:text-red-700"
                      >
                        <TrashIcon width={16} height={16} /> {t("Quitar", "Remove")}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit rounded-2xl bg-mist p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-medium text-navy">{t("Resumen", "Summary")}</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone">
                  {count} {count === 1 ? t("obra", "piece") : t("obras", "pieces")}
                </dt>
                <dd>{price(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone">{t("Envío", "Shipping")}</dt>
                <dd className="text-right text-stone">{t("A coordinar", "To be arranged")}</dd>
              </div>
              <div className="flex justify-between border-t border-foam pt-3 text-base">
                <dt className="font-medium">Total</dt>
                <dd className="font-medium text-navy">{price(subtotal)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-stone">
              {t(
                "Pago por transferencia bancaria. Retiro en el taller sin cargo; el envío se cotiza por WhatsApp según tamaño y destino.",
                "Payment is arranged with you after your order. Free pickup at our studio; international shipping is quoted by size and destination.",
              )}
            </p>
            <Button href="/checkout" size="lg" className="mt-6 w-full">
              {t("Finalizar compra", "Checkout")}
            </Button>
            <Link href="/tienda" className="mt-3 block text-center text-sm text-navy hover:underline">
              {t("Seguir viendo obras", "Keep browsing")}
            </Link>
          </aside>
        </div>
      )}
    </Container>
  );
}
