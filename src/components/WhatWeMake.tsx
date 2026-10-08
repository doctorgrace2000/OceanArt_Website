"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@/components/Icons";
import Button from "@/components/ui/Button";
import type { Category } from "@/data/products";
import { obra } from "@/lib/obras";

interface Item {
  key: Category;
  label: string;
  /** Palabra en letra manuscrita que acompaña la foto */
  hand: string;
  blurb: string;
  image: string;
  alt: string;
}

const ITEMS: Item[] = [
  {
    key: "tapiz",
    label: "Tapices",
    hand: "Tapiz",
    blurb: "Piezas murales de gran formato, con relieves que cambian con la luz.",
    image: obra("/obras/tapiz-pleopsidium-flavum/portada.jpg"),
    alt: "Tapiz circular de liquen amarillo",
  },
  {
    key: "alfombra",
    label: "Alfombras",
    hand: "Alfombra",
    blurb: "De bordes orgánicos, para el piso o para colgar.",
    image: obra("/obras/orquidea-lila/portada.jpg"),
    alt: "Alfombra con forma de orquídea lila",
  },
  {
    key: "instalacion",
    label: "Instalaciones",
    hand: "Instalación",
    blurb: "A medida del espacio: techos, muros y dobles alturas.",
    image: obra("/obras/amazonicas/portada.jpg"),
    alt: "Hoja de nenúfar gigante tejida",
  },
  {
    key: "objeto",
    label: "Objetos",
    hand: "Objeto",
    blurb: "Bancos con asiento de musgo, damajuanas y piezas recuperadas vestidas en textil.",
    image: obra("/obras/banco-musgo/portada.jpg"),
    alt: "Banco de madera con asiento de musgo",
  },
];

const AUTOPLAY_MS = 3200;

export default function WhatWeMake() {
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
        <p className="font-hand text-xl text-sea md:text-2xl">Qué hacemos</p>
        <h2 className="mt-1 text-3xl font-medium tracking-tight text-navy md:text-4xl">
          Creamos piezas textiles a medida
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
                    {item.label}
                  </span>
                </button>
                {/* Descripción de la activa (solo mobile, en desktop va sobre la foto) */}
                <p
                  className={`overflow-hidden pl-1 text-sm text-ink/70 transition-all duration-300 md:hidden ${
                    isActive ? "max-h-12 pb-2 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {item.blurb}
                </p>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/tienda" variant="outline">Ver obras</Button>
          <Button href="/disena-tu-obra">Pedir una a medida</Button>
        </div>
      </div>

      {/* Foto que cambia con la categoría activa */}
      <Link
        href={`/tienda?categoria=${current.key}`}
        aria-label={`Ver ${current.label.toLowerCase()} en la tienda`}
        className="group block overflow-hidden rounded-3xl border border-foam bg-white shadow-xl shadow-navy/5 transition hover:border-navy/30"
      >
        <div className="relative aspect-square">
          {ITEMS.map((item, i) => (
            <Image
              key={item.key}
              src={item.image}
              alt={i === active ? item.alt : ""}
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
              {current.hand}
            </p>
            <p className="mt-2 hidden max-w-sm text-[15px] text-ink/75 md:block">{current.blurb}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-pill border border-navy/15 px-4 py-2 text-sm font-medium text-navy transition group-hover:bg-navy group-hover:text-white">
            Ver {current.label.toLowerCase()} <ArrowRightIcon width={16} height={16} />
          </span>
        </div>
      </Link>
    </div>
  );
}
