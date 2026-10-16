"use client";

import { useSyncExternalStore } from "react";
import { CheckIcon, WhatsAppIcon } from "@/components/Icons";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import { Link, useI18n } from "@/i18n/client";
import { formatDate } from "@/lib/format";
import { deliveryLabel, getLocalOrder, orderMoney, orderWhatsAppUrl, type Order } from "@/lib/orders";
import { site, whatsappDisplay, whatsappUrl } from "@/lib/site";

const noopSubscribe = () => () => {};

export default function OrderConfirmation({ id }: { id: string }) {
  const { locale, t } = useI18n();
  // En el servidor no hay localStorage: se renderiza "cargando" y el cliente
  // lee el pedido guardado al hidratar, sin desajustes de hidratación.
  const order = useSyncExternalStore<Order | null | undefined>(
    noopSubscribe,
    () => getLocalOrder(id) ?? null,
    () => undefined,
  );

  if (order === undefined) return <p className="text-stone">{t("Cargando tu pedido…", "Loading your order…")}</p>;

  if (order === null) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-medium tracking-tight text-navy">{t("Pedido", "Order")} {id}</h1>
        <p className="mt-4 text-ink/80">
          {t(
            "No encontramos el detalle de este pedido en este dispositivo. Si ya lo hiciste, escribinos por WhatsApp con el número de pedido y lo seguimos desde ahí.",
            "We couldn't find this order on this device. If you already placed it, message us on WhatsApp with your order number and we'll take it from there.",
          )}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            variant="whatsapp"
            href={whatsappUrl(t(`Hola Ocean Art! Consulto por mi pedido ${id}.`, `Hi Ocean Art! I have a question about my order ${id}.`))}
          >
            <WhatsAppIcon /> {t("Escribir por WhatsApp", "Message us on WhatsApp")}
          </Button>
          <Button variant="outline" href="/tienda">{t("Volver a la tienda", "Back to the shop")}</Button>
        </div>
      </div>
    );
  }

  // Pedidos en inglés: sin datos bancarios, el pago se coordina con el cliente
  const byTransfer = order.payment === "transferencia";
  const money = (amount: number) => orderMoney(order, amount);
  const waUrl = byTransfer
    ? whatsappUrl("Hola Ocean Art! Te envío el comprobante de pago.")
    : orderWhatsAppUrl(order);
  const steps = byTransfer
    ? [
        ["1", "Transferí", `${money(order.subtotal)} a la cuenta de abajo.`],
        ["2", "Avisanos", "Mandanos el comprobante por WhatsApp."],
        ["3", "Coordinamos", "Retiro por el taller o envío a domicilio a coordinar."],
      ]
    : [
        ["1", t("Te contactamos", "We contact you"), t("En 48 horas, por email o WhatsApp.", "Within 48 hours, by email or WhatsApp.")],
        ["2", t("Pago", "Payment"), t("Acordamos el medio de pago que te quede más cómodo.", "We agree on the payment method that works best for you.")],
        ["3", t("Envío", "Shipping"), t("Retiro por el taller o envío a coordinar.", "Studio pickup or international shipping.")],
      ];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mist text-navy">
          <CheckIcon width={28} height={28} />
        </span>
        <h1 className="mt-4 text-3xl font-medium tracking-tight text-navy">
          {t("¡Gracias", "Thank you")}, {order.customer.name.split(" ")[0]}!
        </h1>
        <p className="mt-2 text-ink/80">
          {t("Registramos tu pedido", "We received your order")}{" "}
          <strong className="text-navy">{order.id}</strong> {t("el", "on")}{" "}
          {formatDate(order.createdAt, locale)}.{" "}
          {byTransfer
            ? t(
                "Reservamos la obra 48 horas mientras recibimos tu transferencia.",
                "We're holding the piece for 48 hours while we wait for your transfer.",
              )
            : t(
                "Te vamos a contactar para coordinar el pago y el envío. Mientras tanto, la obra queda reservada.",
                "We'll contact you to arrange payment and shipping. In the meantime, the piece is reserved for you.",
              )}
        </p>
      </div>

      {/* Pasos */}
      <ol className="mt-10 grid gap-4 sm:grid-cols-3">
        {steps.map(([n, title, d]) => (
          <li key={n} className="rounded-2xl border border-foam p-4">
            <span className="font-hand text-2xl text-sea">{n}.</span>
            <p className="font-medium text-navy">{title}</p>
            <p className="text-sm text-ink/80">{d}</p>
          </li>
        ))}
      </ol>

      {/* Datos bancarios */}
      {byTransfer && (
        <section className="mt-8 rounded-2xl bg-navy p-6 text-white md:p-8">
          <h2 className="text-lg font-medium">Datos para la transferencia</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <BankRow label="Titular" value={site.bank.holder} />
            <BankRow label="Banco" value={site.bank.bank} />
            <BankRow label="Cuenta" value={site.bank.account} />
            <BankRow label="CBU / CVU" value={site.bank.cbu} copy />
            <BankRow label="Alias" value={site.bank.alias} copy />
            <BankRow label="CUIT / CUIL" value={site.bank.cuit} copy />
            <BankRow label="Importe" value={money(order.subtotal)} copy copyValue={String(order.subtotal)} />
          </dl>
          <p className="mt-5 text-sm text-white/70">
            Poné el número de pedido <strong className="text-white">{order.id}</strong> en el concepto
            si tu banco lo permite.
          </p>
        </section>
      )}

      {/* Avisar */}
      <section className="mt-6 rounded-2xl border border-foam p-6 md:p-8">
        <h2 className="text-lg font-medium text-navy">
          {byTransfer ? "Avisanos que transferiste" : t("¿Querés adelantar?", "Want to speed things up?")}
        </h2>
        <p className="mt-1 text-sm text-ink/80">
          {byTransfer
            ? "Se abre WhatsApp con el mensaje listo. Adjuntá el comprobante y envialo."
            : t(
                "Escribinos por WhatsApp: el mensaje con tu pedido ya está listo.",
                "Message us on WhatsApp: the message with your order is ready to send.",
              )}
        </p>
        <div className="mt-5">
          <Button variant="whatsapp" size="lg" href={waUrl} className="w-full">
            <WhatsAppIcon /> {byTransfer ? "Avisar por WhatsApp" : t("Escribir por WhatsApp", "Message us on WhatsApp")}
          </Button>
        </div>
        <p className="mt-3 text-center text-xs text-stone">WhatsApp {whatsappDisplay()}</p>
      </section>

      {/* Detalle */}
      <section className="mt-6 rounded-2xl bg-mist p-6 md:p-8">
        <h2 className="text-lg font-medium text-navy">{t("Detalle del pedido", "Order details")}</h2>
        <ul className="mt-4 divide-y divide-foam text-sm">
          {order.items.map((i) => (
            <li key={i.slug} className="flex justify-between py-2.5">
              <span>
                <Link href={`/tienda/${i.slug}`} className="hover:text-navy">{i.name}</Link>
                <span className="text-stone"> × {i.qty}</span>
              </span>
              <span>{money(i.unitPrice * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1.5 border-t border-foam pt-3 text-sm">
          <div className="flex justify-between font-medium">
            <dt>Total</dt>
            <dd className="text-navy">{money(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">{t("Entrega", "Delivery")}</dt>
            <dd className="max-w-[60%] text-right">{deliveryLabel(order.delivery, locale)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">{t("Contacto", "Contact")}</dt>
            <dd className="text-right">{order.customer.email} · {order.customer.phone}</dd>
          </div>
          {order.notes && (
            <div className="flex justify-between">
              <dt className="text-stone">{t("Notas", "Notes")}</dt>
              <dd className="max-w-[60%] text-right">{order.notes}</dd>
            </div>
          )}
        </dl>
      </section>

      <p className="mt-8 text-center text-sm">
        <Link href="/tienda" className="text-navy hover:underline">{t("Seguir viendo obras", "Keep browsing")}</Link>
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
