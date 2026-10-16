"use client";

import { useState, type FormEvent } from "react";
import { WhatsAppIcon } from "@/components/Icons";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/client";
import { whatsappUrl } from "@/lib/site";

const TYPES = {
  es: ["Tapiz", "Alfombra", "Instalación", "Objeto", "No sé todavía"],
  en: ["Tapestry", "Rug", "Installation", "Object", "Not sure yet"],
};

export default function CustomOrderForm() {
  const { locale, t } = useI18n();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    const name = get("name");
    const idea = get("idea");
    if (name.length < 2 || idea.length < 10) {
      setError(
        t(
          "Completá al menos tu nombre y una descripción de la idea.",
          "Please enter at least your name and a description of your idea.",
        ),
      );
      return;
    }
    setError(null);

    const lines = [
      t("Hola Ocean Art! Quiero diseñar una obra a medida.", "Hi Ocean Art! I'd like to commission a custom piece."),
      "",
      `${t("Tipo de pieza", "Type of piece")}: ${get("type")}`,
      get("size") && `${t("Medidas aproximadas", "Approximate size")}: ${get("size")}`,
      get("space") && `${t("Dónde va a ir", "Where it will go")}: ${get("space")}`,
      get("colors") && `${t("Colores / inspiración", "Colors / inspiration")}: ${get("colors")}`,
      get("budget") && `${t("Presupuesto estimado", "Estimated budget")}: ${get("budget")}`,
      "",
      `${t("Idea", "Idea")}: ${idea}`,
      "",
      t(`Me llamo ${name}.`, `My name is ${name}.`),
      get("email") && `Email: ${get("email")}`,
    ].filter((l): l is string => typeof l === "string");

    window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="field-label" htmlFor="type">{t("Tipo de pieza", "Type of piece")}</label>
        <select id="type" name="type" className="field" defaultValue={TYPES[locale][0]}>
          {TYPES[locale].map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="size">{t("Medidas aproximadas", "Approximate size")}</label>
        <input id="size" name="size" className="field" placeholder={t("Ej. 150 × 100 cm", "E.g. 150 × 100 cm")} />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="space">{t("¿Dónde va a ir?", "Where will it go?")}</label>
        <input
          id="space"
          name="space"
          className="field"
          placeholder={t("Living, dormitorio, local, hall de entrada…", "Living room, bedroom, shop, entrance hall…")}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="colors">{t("Colores o inspiración", "Colors or inspiration")}</label>
        <input
          id="colors"
          name="colors"
          className="field"
          placeholder={t("Líquenes, verdes y ocres, mar, corteza…", "Lichens, greens and ochres, the sea, bark…")}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="idea">{t("Contanos tu idea *", "Tell us your idea *")}</label>
        <textarea
          id="idea"
          name="idea"
          rows={4}
          className="field"
          required
          placeholder={t("Todo lo que nos ayude a imaginarla.", "Anything that helps us picture it.")}
        />
      </div>
      <div>
        <label className="field-label" htmlFor="budget">{t("Presupuesto estimado (opcional)", "Estimated budget (optional)")}</label>
        <input id="budget" name="budget" className="field" placeholder={t("Ej. hasta $500.000", "E.g. up to USD 500")} />
      </div>
      <div>
        <label className="field-label" htmlFor="name">{t("Tu nombre *", "Your name *")}</label>
        <input id="name" name="name" className="field" required autoComplete="name" />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="email">{t("Email (opcional)", "Email (optional)")}</label>
        <input id="email" name="email" type="email" className="field" autoComplete="email" />
      </div>

      {error && (
        <p role="alert" className="sm:col-span-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" variant="whatsapp" size="lg" className="w-full">
          <WhatsAppIcon /> {t("Enviar por WhatsApp", "Send on WhatsApp")}
        </Button>
      </div>
    </form>
  );
}
