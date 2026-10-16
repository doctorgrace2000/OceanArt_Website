"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { BankIcon, WhatsAppIcon } from "@/components/Icons";
import Button from "@/components/ui/Button";
import { Link, useI18n } from "@/i18n/client";
import { useCart } from "@/lib/cart";
import { isValidEmail } from "@/lib/email";
import { currencyFor, toCurrency } from "@/lib/format";
import { trackPixel } from "@/lib/metaPixel";
import { normalizePhone, phoneError } from "@/lib/phone";
import { saveOrderLocally, type DeliveryMethod, type Order, type OrderInput } from "@/lib/orders";

type FieldErrors = Partial<Record<string, string>>;

export default function CheckoutForm() {
  const router = useRouter();
  const { lines, subtotal, hydrated, clear } = useCart();
  const { locale, t, href, price, product: localize } = useI18n();
  const english = locale === "en";
  const [method, setMethod] = useState<DeliveryMethod>("retiro");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // InitiateCheckout del píxel de Meta, una vez por visita al checkout con carrito.
  const checkoutTracked = useRef(false);
  useEffect(() => {
    if (!hydrated || lines.length === 0 || checkoutTracked.current) return;
    checkoutTracked.current = true;
    trackPixel("InitiateCheckout", {
      content_ids: lines.map((l) => l.slug),
      contents: lines.map((l) => ({ id: l.slug, quantity: l.qty })),
      content_type: "product",
      num_items: lines.reduce((n, l) => n + l.qty, 0),
      value: toCurrency(subtotal, locale),
      currency: currencyFor(locale),
    });
  }, [hydrated, lines, subtotal, locale]);

  if (!hydrated) return <p className="text-stone">{t("Cargando…", "Loading…")}</p>;

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-foam p-12 text-center">
        <p className="text-lg">{t("Tu carrito está vacío.", "Your cart is empty.")}</p>
        <div className="mt-6">
          <Button href="/tienda">{t("Ver obras", "See pieces")}</Button>
        </div>
      </div>
    );
  }

  function validate(data: FormData): { input: OrderInput | null; errors: FieldErrors } {
    const e: FieldErrors = {};
    const get = (k: string) => String(data.get(k) ?? "").trim();

    const name = get("name");
    const email = get("email");
    const phone = normalizePhone(get("phone"), locale) ?? "";
    const notes = get("notes");

    if (name.length < 2) e.name = t("Ingresá tu nombre completo.", "Please enter your full name.");
    if (!isValidEmail(email)) e.email = t("Ingresá un email válido.", "Please enter a valid email.");
    if (!phone) e.phone = phoneError(locale);

    const delivery: OrderInput["delivery"] = { method };
    if (method === "envio") {
      delivery.address = get("address");
      delivery.city = get("city");
      delivery.province = get("province");
      delivery.zip = get("zip");
      if (!delivery.address) e.address = t("Ingresá calle y número.", "Please enter your street address.");
      if (!delivery.city) e.city = t("Ingresá la localidad.", "Please enter your city.");
      if (english) {
        delivery.country = get("country");
        if (!delivery.country) e.country = "Please enter your country.";
      } else if (!delivery.province) {
        e.province = "Ingresá la provincia.";
      }
    }

    if (Object.keys(e).length) return { input: null, errors: e };
    return {
      input: {
        locale,
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
        throw new Error(body.error ?? t("No pudimos registrar el pedido.", "We couldn't place your order."));
      }
      saveOrderLocally(body.order);
      // Purchase del píxel de Meta: el pedido quedó registrado (el pago es por transferencia).
      trackPixel(
        "Purchase",
        {
          content_ids: body.order.items.map((i) => i.slug),
          contents: body.order.items.map((i) => ({ id: i.slug, quantity: i.qty })),
          content_type: "product",
          num_items: body.order.items.reduce((n, i) => n + i.qty, 0),
          value: body.order.subtotal,
          currency: body.order.currency ?? "ARS",
        },
        body.order.id,
      );
      clear();
      router.push(href(`/pedido/${body.order.id}`));
    } catch (err) {
      setServerError(err instanceof Error ? err.message : t("Ocurrió un error. Probá de nuevo.", "Something went wrong. Please try again."));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-10">
        {/* Contacto */}
        <fieldset>
          <legend className="text-lg font-medium text-navy">{t("1. Tus datos", "1. Your details")}</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label={t("Nombre y apellido", "Full name")} name="name" error={errors.name} autoComplete="name" className="sm:col-span-2" />
            <Field label="Email" name="email" type="email" error={errors.email} autoComplete="email" />
            <Field
              label={t("Teléfono / WhatsApp", "Phone / WhatsApp")}
              name="phone"
              type="tel"
              error={errors.phone}
              autoComplete="tel"
              placeholder={t("+54 9 11 5555-5555", "+1 555 123 4567")}
            />
          </div>
        </fieldset>

        {/* Entrega */}
        <fieldset>
          <legend className="text-lg font-medium text-navy">{t("2. Entrega", "2. Delivery")}</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <RadioCard
              checked={method === "retiro"}
              onChange={() => setMethod("retiro")}
              title={t("Retiro en el taller", "Pickup at our studio")}
              subtitle={t("General Rodríguez, Buenos Aires · Sin cargo", "General Rodríguez, Buenos Aires, Argentina · Free")}
            />
            <RadioCard
              checked={method === "envio"}
              onChange={() => setMethod("envio")}
              title={t("Envío a domicilio", "Shipping")}
              subtitle={t("Costo a cotizar por WhatsApp según zona", "International shipping, quoted by size and destination")}
            />
          </div>
          {method === "envio" && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label={t("Calle y número (piso / depto)", "Street address (apt / suite)")}
                name="address"
                error={errors.address}
                autoComplete="street-address"
                className="sm:col-span-2"
              />
              <Field label={t("Localidad", "City")} name="city" error={errors.city} autoComplete="address-level2" />
              <Field
                label={t("Provincia", "State / Province (optional)")}
                name="province"
                error={errors.province}
                autoComplete="address-level1"
              />
              <Field label={t("Código postal", "Postal code")} name="zip" autoComplete="postal-code" />
              {english && (
                <Field label="Country" name="country" error={errors.country} autoComplete="country-name" />
              )}
            </div>
          )}
          <div className="mt-4">
            <label className="field-label" htmlFor="notes">{t("Notas para el taller (opcional)", "Notes for the studio (optional)")}</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="field"
              placeholder={t("Horarios para coordinar, referencias, etc.", "Best times to reach you, references, etc.")}
            />
          </div>
        </fieldset>

        {/* Pago */}
        <fieldset>
          <legend className="text-lg font-medium text-navy">{t("3. Pago", "3. Payment")}</legend>
          <div className="mt-4 rounded-2xl border border-navy bg-mist p-5">
            <div className="flex items-start gap-3">
              <BankIcon className="mt-0.5 shrink-0 text-navy" />
              <div>
                <p className="font-medium text-navy">{t("Transferencia bancaria", "Payment arranged with you")}</p>
                <p className="mt-1 text-sm text-ink/80">
                  {t(
                    "Al confirmar te mostramos CBU y alias. Hacés la transferencia y nos enviás el comprobante por WhatsApp. La obra se reserva 48 h hasta recibir el pago.",
                    "Nothing is charged now. After you confirm, we'll contact you by email or WhatsApp within 48 hours to arrange payment and shipping. We hold the piece for you in the meantime.",
                  )}
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
            {submitting ? t("Registrando pedido…", "Placing order…") : t("Confirmar pedido", "Place order")}
          </Button>
          <Link href="/carrito" className="text-center text-sm text-navy hover:underline">
            {t("Volver al carrito", "Back to cart")}
          </Link>
        </div>
      </div>

      {/* Resumen */}
      <aside className="h-fit rounded-2xl bg-mist p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-medium text-navy">{t("Tu pedido", "Your order")}</h2>
        <ul className="mt-4 divide-y divide-foam">
          {lines.map(({ product, qty, lineTotal }) => (
            <li key={product.slug} className="flex items-center gap-3 py-3">
              <Image src={product.images[0]} alt="" width={48} height={60} className="h-15 w-12 rounded-lg object-cover" />
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate font-medium">{localize(product).name}</p>
                <p className="text-stone">× {qty}</p>
              </div>
              <p className="text-sm">{price(lineTotal)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-foam pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone">Subtotal</dt>
            <dd>{price(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">{t("Envío", "Shipping")}</dt>
            <dd className="text-stone">
              {method === "retiro" ? t("Sin cargo", "Free") : t("A coordinar", "To be arranged")}
            </dd>
          </div>
          <div className="flex justify-between pt-2 text-base">
            <dt className="font-medium">{t("Total a transferir", "Total")}</dt>
            <dd className="font-medium text-navy">{price(subtotal)}</dd>
          </div>
        </dl>
        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-stone">
          <WhatsAppIcon width={14} height={14} className="mt-0.5 shrink-0" />
          {t(
            "Después de confirmar vas a poder avisarnos por WhatsApp con un solo toque.",
            "After you confirm, you can also message us on WhatsApp with one tap.",
          )}
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
