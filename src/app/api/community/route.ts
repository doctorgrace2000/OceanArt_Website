import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/email";
import { asLocale, pick } from "@/i18n/config";
import { normalizePhone, phoneError } from "@/lib/phone";

export const runtime = "nodejs";


function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

function str(v: unknown, max = 300): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * POST /api/community
 * Suma a alguien a la comunidad: valida los datos y los guarda como una fila nueva en la
 * Google Sheet conectada (COMMUNITY_SHEET_URL, un Apps Script publicado como app web).
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return bad("Cuerpo inválido.");
  }

  // Campo trampa: los humanos no lo ven; si viene lleno es un bot. Respondemos OK sin guardar.
  if (str(body.website)) return NextResponse.json({ ok: true });

  const name = str(body.name, 120);
  const email = str(body.email, 160).toLowerCase();
  const locale = asLocale(str(body.locale, 5));
  const t = (es: string, en: string) => pick(locale, es, en);
  const rawPhone = str(body.phone, 40);
  const phone = rawPhone ? normalizePhone(rawPhone, locale) : "";

  if (name.length < 2) return bad(t("Ingresá tu nombre.", "Please enter your name."));
  if (!isValidEmail(email)) return bad(t("Revisá el email.", "Please check your email."));
  if (phone === null) return bad(phoneError(locale));

  const subscriber = {
    createdAt: new Date().toISOString(),
    name,
    email,
    phone,
  };

  // Registro en los logs de Vercel, por si la planilla no está conectada o falla.
  console.log("[community]", JSON.stringify(subscriber));

  const url = process.env.COMMUNITY_SHEET_URL;
  if (!url) {
    console.warn("[community] planilla omitida: falta COMMUNITY_SHEET_URL");
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...subscriber, secret: process.env.COMMUNITY_SHEET_SECRET ?? "" }),
    });
    const text = await res.text();
    if (!res.ok || !text.includes('"ok":true')) {
      console.error(`[community] la planilla rechazó el alta (HTTP ${res.status}): ${text}`);
      return bad(t("No pudimos guardar tus datos. Probá de nuevo en un rato.", "We couldn't save your details. Please try again shortly."), 502);
    }
  } catch (err) {
    console.error("[community] la planilla falló", err);
    return bad(t("No pudimos guardar tus datos. Probá de nuevo en un rato.", "We couldn't save your details. Please try again shortly."), 502);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
