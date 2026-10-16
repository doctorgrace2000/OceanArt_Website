"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@/components/Icons";
import Button from "@/components/ui/Button";
import type { Category } from "@/data/products";
import { Link, useI18n } from "@/i18n/client";
import { obra } from "@/lib/obras";

/** Texto en español e inglés */
type Text = { es: string; en: string };

interface Item {
  key: Category;
  label: Text;
  /** Palabra en letra manuscrita que acompaña la foto */
  hand: Text;
  blurb: Text;
  image: string;
  alt: Text;
}

const ITEMS: Item[] = [
  {
    key: "tapiz",
    label: { es: "Tapices", en: "Tapestries" },
    hand: { es: "Tapiz", en: "Tapestry" },
    blurb: {
      es: "Piezas murales de gran formato, con relieves que cambian con la luz.",
      en: "Large-format wall pieces, with reliefs that change with the light.",
    },
    image: obra("/obras/tapiz-pleopsidium-flavum/portada.jpg"),
    alt: { es: "Tapiz circular de liquen amarillo", en: "Round yellow lichen tapestry" },
  },
  {
    key: "alfombra",
    label: { es: "Alfombras", en: "Rugs" },
    hand: { es: "Alfombra", en: "Rug" },
    blurb: {
      es: "De bordes orgánicos, para el piso o para colgar.",
      en: "With organic edges, for the floor or the wall.",
    },
    image: obra("/obras/orquidea-lila/portada.jpg"),
    alt: { es: "Alfombra con forma de orquídea lila", en: "Lilac orchid-shaped rug" },
  },
  {
    key: "instalacion",
    label: { es: "Instalaciones", en: "Installations" },
    hand: { es: "Instalación", en: "Installation" },
    blurb: {
      es: "A medida del espacio: techos, muros y dobles alturas.",
      en: "Made for the space: ceilings, walls and double heights.",
    },
    image: obra("/obras/amazonicas/portada.jpg"),
    alt: { es: "Hoja de nenúfar gigante tejida", en: "Woven giant water lily leaf" },
  },
  {
    key: "objeto",
    label: { es: "Objetos", en: "Objects" },
    hand: { es: "Objeto", en: "Object" },
    blurb: {
      es: "Bancos con asiento de musgo, damajuanas y piezas recuperadas vestidas en textil.",
      en: "Stools with moss seats, demijohns and reclaimed pieces dressed in textile.",
    },
    image: obra("/obras/banco-musgo/portada.jpg"),
    alt: { es: "Banco de madera con asiento de musgo", en: "Wooden stool with a moss seat" },
  },
];

const AUTOPLAY_MS = 3200;

export default function WhatWeMake() {
  const { locale, t } = useI18n();
  const tx = (v: Text) => v[locale];
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  // Rota sola hasta que la persona interactúa.
  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % ITEMS.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [auto]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  const current = ITEMS[active];

  return (
    <div className="grid items-center gap-10 md:grid-cols-[1fr_1.05fr] lg:gap-16">
      {/* Lista interactiva */}
      <div>
        <p className="font-hand text-xl text-sea md:text-2xl">{t("Qué hacemos", "What we make")}</p>
        <h2 className="mt-1 text-3xl font-medium tracking-tight text-navy md:text-4xl">
          {t("Creamos piezas textiles a medida", "We create custom textile pieces")}
        </h2>

        <ul className="mt-8 space-y-1" onMouseLeave={() => setAuto(true)}>
          {ITEMS.map((item, i) => {
            const isActive = i === active;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onMouseEnter={() => pick(i)}
                  onFocus={() => pick(i)}
                  onClick={() => pick(i)}
                  aria-pressed={isActive}
                  className="group flex w-full items-baseline gap-3 py-1.5 text-left"
                >
                  <span
                    className={`font-hand text-2xl transition-all duration-300 ${
                      isActive ? "w-7 text-sea opacity-100" : "w-0 overflow-hidden opacity-0"
                    }`}
                    aria-hidden
                  >
                    →
                  </span>
                  <span
                    className={`text-2xl leading-tight transition-colors duration-300 md:text-[2.1rem] ${
                      isActive ? "font-medium text-navy" : "text-navy/30 group-hover:text-navy/60"
                    }`}
                  >
                    {tx(item.label)}
                  </span>
                </button>
                {/* Descripción de la activa (solo mobile, en desktop va sobre la foto) */}
                <p
                  className={`overflow-hidden pl-1 text-sm text-ink/70 transition-all duration-300 md:hidden ${
                    isActive ? "max-h-12 pb-2 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {tx(item.blurb)}
                </p>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/tienda" variant="outline">{t("Ver obras", "See pieces")}</Button>
          <Button href="/disena-tu-obra">{t("Pedir una a medida", "Order a custom piece")}</Button>
        </div>
      </div>

      {/* Foto que cambia con la categoría activa */}
      <Link
        href={`/tienda?categoria=${current.key}`}
        aria-label={t(
          `Ver ${tx(current.label).toLowerCase()} en la tienda`,
          `See ${tx(current.label).toLowerCase()} in the shop`,
        )}
        className="group block overflow-hidden rounded-3xl border border-foam bg-white shadow-xl shadow-navy/5 transition hover:border-navy/30"
      >
        <div className="relative aspect-square">
          {ITEMS.map((item, i) => (
            <Image
              key={item.key}
              src={item.image}
              alt={i === active ? tx(item.alt) : ""}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              priority={i === 0}
              className={`object-contain p-4 transition-all duration-700 ease-out ${
                i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"
              }`}
            />
          ))}
          {/* Puntos de progreso */}
          <div className="absolute right-5 top-5 flex gap-1.5">
            {ITEMS.map((item, i) => (
              <span
                key={item.key}
                className={`h-1.5 rounded-pill transition-all duration-300 ${
                  i === active ? "w-5 bg-navy" : "w-1.5 bg-navy/25"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-foam px-6 py-5 md:px-8">
          <div>
            <p key={current.key} className="font-hand text-2xl leading-none text-sea md:text-3xl">
              {tx(current.hand)}
            </p>
            <p className="mt-2 hidden max-w-sm text-[15px] text-ink/75 md:block">{tx(current.blurb)}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-pill border border-navy/15 px-4 py-2 text-sm font-medium text-navy transition group-hover:bg-navy group-hover:text-white">
            {t("Ver", "See")} {tx(current.label).toLowerCase()} <ArrowRightIcon width={16} height={16} />
          </span>
        </div>
      </Link>
    </div>
  );
}
