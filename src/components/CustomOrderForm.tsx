"use client";

import { useState, type FormEvent } from "react";
import { WhatsAppIcon } from "@/components/Icons";
import Button from "@/components/ui/Button";
import { whatsappUrl } from "@/lib/site";

const TYPES = ["Tapiz", "Alfombra", "Instalación", "Objeto", "No sé todavía"];

export default function CustomOrderForm() {
  const [error, setError] = useState<string | null>(null);

  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    const name = get("name");
    const idea = get("idea");
    if (name.length < 2 || idea.length < 10) {
      setError("Completá al menos tu nombre y una descripción de la idea.");
      return;
    }
    setError(null);

    const lines = [
      "Hola Ocean Art! Quiero diseñar una obra a medida.",
      "",
      `Tipo de pieza: ${get("type")}`,
      get("size") && `Medidas aproximadas: ${get("size")}`,
      get("space") && `Dónde va a ir: ${get("space")}`,
      get("colors") && `Colores / inspiración: ${get("colors")}`,
      get("budget") && `Presupuesto estimado: ${get("budget")}`,
      "",
      `Idea: ${idea}`,
      "",
      `Me llamo ${name}.`,
      get("email") && `Email: ${get("email")}`,
    ].filter((l): l is string => typeof l === "string");

    window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="field-label" htmlFor="type">Tipo de pieza</label>
        <select id="type" name="type" className="field" defaultValue={TYPES[0]}>
          {TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="size">Medidas aproximadas</label>
        <input id="size" name="size" className="field" placeholder="ej. 150 × 100 cm" />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="space">¿Dónde va a ir?</label>
        <input id="space" name="space" className="field" placeholder="living, dormitorio, local, hall de entrada…" />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="colors">Colores o inspiración</label>
        <input id="colors" name="colors" className="field" placeholder="líquenes, verdes y ocres, mar, corteza…" />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="idea">Contanos tu idea *</label>
        <textarea id="idea" name="idea" rows={4} className="field" required placeholder="Todo lo que nos ayude a imaginarla." />
      </div>
      <div>
        <label className="field-label" htmlFor="budget">Presupuesto estimado (opcional)</label>
        <input id="budget" name="budget" className="field" placeholder="ej. hasta $500.000" />
      </div>
      <div>
        <label className="field-label" htmlFor="name">Tu nombre *</label>
        <input id="name" name="name" className="field" required autoComplete="name" />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="email">Email (opcional)</label>
        <input id="email" name="email" type="email" className="field" autoComplete="email" />
      </div>

      {error && (
        <p role="alert" className="sm:col-span-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" variant="whatsapp" size="lg" className="w-full">
          <WhatsAppIcon /> enviar por WhatsApp
        </Button>
      </div>
    </form>
  );
}
