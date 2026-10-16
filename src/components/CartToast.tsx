"use client";

import Image from "next/image";
import { CloseIcon } from "@/components/Icons";
import { Link, useI18n } from "@/i18n/client";
import { useCart } from "@/lib/cart";

export default function CartToast() {
  const { lastAdded, dismissToast, count } = useCart();
  const { t, product: localize } = useI18n();
  if (!lastAdded) return null;
  const product = localize(lastAdded);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-22 left-1/2 z-40 sm:bottom-5 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border border-foam bg-white p-3 shadow-xl shadow-navy/10"
    >
      <Image
        src={product.images[0]}
        alt=""
        width={56}
        height={70}
        className="h-14 w-11 rounded-lg object-cover"
      />
      <div className="min-w-0 flex-1 text-sm">
        <p className="truncate font-medium text-navy">{product.name}</p>
        <p className="text-stone">
          {t(
            `Agregada al carrito · ${count} ${count === 1 ? "obra" : "obras"}`,
            `Added to cart · ${count} ${count === 1 ? "piece" : "pieces"}`,
          )}
        </p>
      </div>
      <Link
        href="/carrito"
        onClick={dismissToast}
        className="rounded-pill bg-navy px-3.5 py-2 text-xs font-medium text-white hover:bg-navy-dark"
      >
        {t("Ver carrito", "View cart")}
      </Link>
      <button type="button" onClick={dismissToast} aria-label={t("Cerrar", "Close")} className="text-stone hover:text-navy">
        <CloseIcon width={18} height={18} />
      </button>
    </div>
  );
}
