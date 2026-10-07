"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { CheckIcon, MailIcon, WhatsAppIcon } from "@/components/Icons";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import { formatDate, formatPrice } from "@/lib/format";
import {
  buildOrderWhatsAppMessage,
  deliveryLabel,
  getLocalOrder,
  orderWhatsAppUrl,
  type Order,
} from "@/lib/orders";
import { site, whatsappDisplay } from "@/lib/site";

const noopSubscribe = () => () => {};

export default function OrderConfirmation({ id }: { id: string }) {
  // En el servidor no hay localStorage: se renderiza "cargando" y el cliente
  // lee el pedido guardado al hidratar, sin desajustes de hidratación.
  const order = useSyncExternalStore<Order | null | undefined>(
    noopSubscribe,
    () => getLocalOrder(id) ?? null,
    () => undefined,
  );

  if (order === undefined) return <p className="text-stone">Cargando tu pedido…</p>;

  if (order === null) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-medium tracking-tight text-navy">Pedido {id}</h1>
        <p className="mt-4 text-ink/80">
          No encontramos el detalle de este pedido en este dispositivo. Si ya lo hiciste,
          escribinos por WhatsApp con el número de pedido y lo seguimos desde ahí.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            variant="whatsapp"
            href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hola Ocean Art! Consulto por mi pedido ${id}.`)}`}
          >
            <WhatsAppIcon /> escribir por WhatsApp
          </Button>
          <Button variant="outline" href="/tienda">volver a la tienda</Button>
        </div>
      </div>
    );
  }

  const waUrl = orderWhatsAppUrl(order);
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`Pedido ${order.id}`)}&body=${encodeURIComponent(buildOrderWhatsAppMessage(order))}`;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mist text-navy">
          <CheckIcon width={28} height={28} />
        </span>
        <h1 className="mt-4 text-3xl font-medium tracking-tight text-navy">¡Gracias, {order.customer.name.split(" ")[0]}!</h1>
        <p className="mt-2 text-ink/80">
          Registramos tu pedido <strong className="text-navy">{order.id}</strong> el{" "}
          {formatDate(order.createdAt)}. Reservamos la obra 48 horas mientras recibimos tu
          transferencia.
        </p>
      </div>

      {/* Pasos */}
      <ol className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          ["1", "Transferí", `${formatPrice(order.subtotal)} a la cuenta de abajo.`],
          ["2", "Avisanos", "Mandanos el comprobante por WhatsApp con un toque."],
          ["3", "Coordinamos", order.delivery.method === "retiro" ? "El retiro en el taller." : "El envío a tu domicilio."],
        ].map(([n, t, d]) => (
          <li key={n} className="rounded-2xl border border-foam p-4">
            <span className="font-hand text-2xl text-sea">{n}.</span>
            <p className="font-medium text-navy">{t}</p>
            <p className="text-sm text-ink/80">{d}</p>
          </li>
        ))}
      </ol>

      {/* Datos bancarios */}
      <section className="mt-8 rounded-2xl bg-navy p-6 text-white md:p-8">
        <h2 className="text-lg font-medium">Datos para la transferencia</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <BankRow label="Titular" value={site.bank.holder} />
          <BankRow label="Banco" value={site.bank.bank} />
          <BankRow label="CBU / CVU" value={site.bank.cbu} copy />
          <BankRow label="Alias" value={site.bank.alias} copy />
          <BankRow label="CUIT / CUIL" value={site.bank.cuit} copy />
          <BankRow label="Importe" value={formatPrice(order.subtotal)} copy copyValue={String(order.subtotal)} />
        </dl>
        <p className="mt-5 text-sm text-white/70">
          Poné el número de pedido <strong className="text-white">{order.id}</strong> en el concepto
          si tu banco lo permite.
        </p>
      </section>

      {/* Avisar */}
      <section className="mt-6 rounded-2xl border border-foam p-6 md:p-8">
        <h2 className="text-lg font-medium text-navy">Avisanos que transferiste</h2>
        <p className="mt-1 text-sm text-ink/80">
          Se abre WhatsApp con el detalle del pedido ya escrito. Adjuntá el comprobante y listo.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button variant="whatsapp" size="lg" href={waUrl} className="flex-1">
            <WhatsAppIcon /> avisar por WhatsApp
          </Button>
          <Button variant="outline" size="lg" href={mailto} className="flex-1">
            <MailIcon /> enviar por email
          </Button>
        </div>
        <p className="mt-3 text-center text-xs text-stone">
          WhatsApp {whatsappDisplay()} · {site.email}
        </p>
      </section>

      {/* Detalle */}
      <section className="mt-6 rounded-2xl bg-mist p-6 md:p-8">
        <h2 className="text-lg font-medium text-navy">Detalle del pedido</h2>
        <ul className="mt-4 divide-y divide-foam text-sm">
          {order.items.map((i) => (
            <li key={i.slug} className="flex justify-between py-2.5">
              <span>
                <Link href={`/tienda/${i.slug}`} className="hover:text-navy">{i.name}</Link>
                <span className="text-stone"> × {i.qty}</span>
              </span>
              <span>{formatPrice(i.unitPrice * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1.5 border-t border-foam pt-3 text-sm">
          <div className="flex justify-between font-medium">
            <dt>Total</dt>
            <dd className="text-navy">{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">Entrega</dt>
            <dd className="max-w-[60%] text-right">{deliveryLabel(order.delivery)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">Contacto</dt>
            <dd className="text-right">{order.customer.email} · {order.customer.phone}</dd>
          </div>
          {order.notes && (
            <div className="flex justify-between">
              <dt className="text-stone">Notas</dt>
              <dd className="max-w-[60%] text-right">{order.notes}</dd>
            </div>
          )}
        </dl>
      </section>

      <p className="mt-8 text-center text-sm">
        <Link href="/tienda" className="text-navy hover:underline">seguir viendo obras</Link>
      </p>
    </div>
  );
}

function BankRow({
  label,
  value,
  copy = false,
  copyValue,
}: {
  label: string;
  value: string;
  copy?: boolean;
  copyValue?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/10 px-4 py-3">
      <div className="min-w-0">
        <dt className="text-xs uppercase tracking-wider text-white/60">{label}</dt>
        <dd className="truncate font-medium tabular-nums">{value}</dd>
      </div>
      {copy && (
        <span className="[&>button]:border-white/30 [&>button]:text-white [&>button:hover]:bg-white/10">
          <CopyButton value={copyValue ?? value} label={label} />
        </span>
      )}
    </div>
  );
}
