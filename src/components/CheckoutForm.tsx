"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { BankIcon, WhatsAppIcon } from "@/components/Icons";
import Button from "@/components/ui/Button";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { saveOrderLocally, type DeliveryMethod, type Order, type OrderInput } from "@/lib/orders";

type FieldErrors = Partial<Record<string, string>>;

export default function CheckoutForm() {
  const router = useRouter();
  const { lines, subtotal, hydrated, clear } = useCart();
  const [method, setMethod] = useState<DeliveryMethod>("retiro");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (!hydrated) return <p className="text-stone">Cargando…</p>;

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-foam p-12 text-center">
        <p className="text-lg">Tu carrito está vacío.</p>
        <div className="mt-6">
          <Button href="/tienda">Ver obras</Button>
        </div>
      </div>
    );
  }

  function validate(data: FormData): { input: OrderInput | null; errors: FieldErrors } {
    const e: FieldErrors = {};
    const get = (k: string) => String(data.get(k) ?? "").trim();

    const name = get("name");
    const email = get("email");
    const phone = get("phone");
    const notes = get("notes");

    if (name.length < 2) e.name = "Ingresá tu nombre completo.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Ingresá un email válido.";
    if (phone.replace(/\D/g, "").length < 8) e.phone = "Ingresá un teléfono con código de área.";

    const delivery: OrderInput["delivery"] = { method };
    if (method === "envio") {
      delivery.address = get("address");
      delivery.city = get("city");
      delivery.province = get("province");
      delivery.zip = get("zip");
      if (!delivery.address) e.address = "Ingresá calle y número.";
      if (!delivery.city) e.city = "Ingresá la localidad.";
      if (!delivery.province) e.province = "Ingresá la provincia.";
    }

    if (Object.keys(e).length) return { input: null, errors: e };
    return {
      input: {
        customer: { name, email, phone },
        delivery,
        notes: notes || undefined,
        items: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
      },
      errors: {},
    };
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setServerError(null);
    const { input, errors: e } = validate(new FormData(ev.currentTarget));
    setErrors(e);
    if (!input) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const body = (await res.json()) as { order?: Order; error?: string };
      if (!res.ok || !body.order) {
        throw new Error(body.error ?? "No pudimos registrar el pedido.");
      }
      saveOrderLocally(body.order);
      clear();
      router.push(`/pedido/${body.order.id}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Ocurrió un error. Probá de nuevo.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-10">
        {/* Contacto */}
        <fieldset>
          <legend className="text-lg font-medium text-navy">1. Tus datos</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Nombre y apellido" name="name" error={errors.name} autoComplete="name" className="sm:col-span-2" />
            <Field label="Email" name="email" type="email" error={errors.email} autoComplete="email" />
            <Field label="Teléfono / WhatsApp" name="phone" type="tel" error={errors.phone} autoComplete="tel" placeholder="11 5555 5555" />
          </div>
        </fieldset>

        {/* Entrega */}
        <fieldset>
          <legend className="text-lg font-medium text-navy">2. Entrega</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <RadioCard
              checked={method === "retiro"}
              onChange={() => setMethod("retiro")}
              title="Retiro en el taller"
              subtitle="General Rodríguez, Buenos Aires · Sin cargo"
            />
            <RadioCard
              checked={method === "envio"}
              onChange={() => setMethod("envio")}
              title="Envío a domicilio"
              subtitle="Costo a cotizar por WhatsApp según zona"
            />
          </div>
          {method === "envio" && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Calle y número (piso / depto)" name="address" error={errors.address} autoComplete="street-address" className="sm:col-span-2" />
              <Field label="Localidad" name="city" error={errors.city} autoComplete="address-level2" />
              <Field label="Provincia" name="province" error={errors.province} autoComplete="address-level1" />
              <Field label="Código postal" name="zip" autoComplete="postal-code" />
            </div>
          )}
          <div className="mt-4">
            <label className="field-label" htmlFor="notes">Notas para el taller (opcional)</label>
            <textarea id="notes" name="notes" rows={3} className="field" placeholder="Horarios para coordinar, referencias, etc." />
          </div>
        </fieldset>

        {/* Pago */}
        <fieldset>
          <legend className="text-lg font-medium text-navy">3. Pago</legend>
          <div className="mt-4 rounded-2xl border border-navy bg-mist p-5">
            <div className="flex items-start gap-3">
              <BankIcon className="mt-0.5 shrink-0 text-navy" />
              <div>
                <p className="font-medium text-navy">Transferencia bancaria</p>
                <p className="mt-1 text-sm text-ink/80">
                  Al confirmar te mostramos CBU y alias. Hacés la transferencia y nos enviás el
                  comprobante por WhatsApp. La obra se reserva 48 h hasta recibir el pago.
                </p>
              </div>
            </div>
          </div>
        </fieldset>

        {serverError && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" size="lg" disabled={submitting} className="sm:min-w-64">
            {submitting ? "Registrando pedido…" : "Confirmar pedido"}
          </Button>
          <Link href="/carrito" className="text-center text-sm text-navy hover:underline">
            Volver al carrito
          </Link>
        </div>
      </div>

      {/* Resumen */}
      <aside className="h-fit rounded-2xl bg-mist p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-medium text-navy">Tu pedido</h2>
        <ul className="mt-4 divide-y divide-foam">
          {lines.map(({ product, qty, lineTotal }) => (
            <li key={product.slug} className="flex items-center gap-3 py-3">
              <Image src={product.images[0]} alt="" width={48} height={60} className="h-15 w-12 rounded-lg object-cover" />
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate font-medium">{product.name}</p>
                <p className="text-stone">× {qty}</p>
              </div>
              <p className="text-sm">{formatPrice(lineTotal)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-foam pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone">Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">Envío</dt>
            <dd className="text-stone">{method === "retiro" ? "Sin cargo" : "A coordinar"}</dd>
          </div>
          <div className="flex justify-between pt-2 text-base">
            <dt className="font-medium">Total a transferir</dt>
            <dd className="font-medium text-navy">{formatPrice(subtotal)}</dd>
          </div>
        </dl>
        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-stone">
          <WhatsAppIcon width={14} height={14} className="mt-0.5 shrink-0" />
          Después de confirmar vas a poder avisarnos por WhatsApp con un solo toque.
        </p>
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  className = "",
  ...rest
}: {
  label: string;
  name: string;
  error?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label className="field-label" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        className={`field ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-700">{error}</p>
      )}
    </div>
  );
}

function RadioCard({
  checked,
  onChange,
  title,
  subtitle,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
        checked ? "border-navy bg-mist" : "border-foam hover:border-navy/50"
      }`}
    >
      <input type="radio" name="delivery" checked={checked} onChange={onChange} className="mt-1 accent-navy" />
      <span>
        <span className="block font-medium text-ink">{title}</span>
        <span className="block text-sm text-stone">{subtitle}</span>
      </span>
    </label>
  );
}
