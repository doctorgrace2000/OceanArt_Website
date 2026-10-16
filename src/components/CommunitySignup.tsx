"use client";

import { useId, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { trackPixel } from "@/lib/metaPixel";
import { AR_PHONE_ERROR, normalizeArPhone } from "@/lib/phone";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Marca en el navegador de que ya se sumó, para no volver a mostrarle el pop-up. */
export const JOINED_KEY = "oa-community-joined";

export default function CommunitySignup({
  stacked = false,
  source = "landing",
}: {
  /** Campos uno debajo del otro (para el pop-up) */
  stacked?: boolean;
  source?: "landing" | "popup";
}) {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    const name = get("name");
    const email = get("email");
    const rawPhone = get("phone");
    const phone = rawPhone ? normalizeArPhone(rawPhone) : "";
    if (name.length < 2) return setError("Ingresá tu nombre.");
    if (!EMAIL_RE.test(email)) return setError("Revisá el email.");
    if (phone === null) return setError(AR_PHONE_ERROR);
    setError(null);
    setStatus("sending");

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, website: get("website") }),
      });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "No pudimos guardar tus datos.");
      trackPixel("Lead", { content_name: "Comunidad Ocean Art", content_category: source });
      try {
        localStorage.setItem(JOINED_KEY, "1");
      } catch {}
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error. Probá de nuevo.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-2xl bg-white px-6 py-10 text-center shadow-sm">
        <p className="text-2xl font-medium tracking-tight text-navy">¡Ya sos parte de la comunidad!</p>
        <p className="mt-2 text-ink/80">Gracias por unirte.</p>
      </div>
    );
  }

  // En dos columnas, nombre, error y botón ocupan todo el ancho
  const full = stacked ? "" : "sm:col-span-2";

  return (
    <form onSubmit={onSubmit} noValidate className={`grid gap-4 ${stacked ? "" : "sm:grid-cols-2"}`}>
      <div className={full}>
        <label className="field-label" htmlFor={`${id}-name`}>Nombre *</label>
        <input id={`${id}-name`} name="name" className="field" required autoComplete="name" />
      </div>
      <div>
        <label className="field-label" htmlFor={`${id}-email`}>Email *</label>
        <input id={`${id}-email`} name="email" type="email" className="field" required autoComplete="email" />
      </div>
      <div>
        <label className="field-label" htmlFor={`${id}-phone`}>WhatsApp (opcional)</label>
        <input id={`${id}-phone`} name="phone" type="tel" className="field" autoComplete="tel" placeholder="+54 9 11 5555-5555" />
      </div>

      {/* Campo trampa para bots: oculto para personas */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p role="alert" className={`${full} rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700`}>
          {error}
        </p>
      )}

      <div className={full}>
        <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
          {status === "sending" ? "Sumándote…" : "Quiero ser parte"}
        </Button>
      </div>
    </form>
  );
}
