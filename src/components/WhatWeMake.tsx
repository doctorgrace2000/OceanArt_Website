"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@/components/Icons";
import Button from "@/components/ui/Button";
import type { Category } from "@/data/products";

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
    label: "tapices",
    hand: "tapiz",
    blurb: "Piezas murales de gran formato, con relieves que cambian con la luz.",
    image: "/obras/tapiz-verde/1.jpg",
    alt: "Tapiz verde con líquenes sobre corteza",
  },
  {
    key: "alfombra",
    label: "alfombras",
    hand: "alfombra",
    blurb: "De bordes orgánicos, para el piso o para colgar.",
    image: "/obras/orquidea-lila/2.jpg",
    alt: "Alfombra con forma de orquídea lila sobre el pasto",
  },
  {
    key: "banco",
    label: "bancos",
    hand: "banco",
    blurb: "Madera maciza con asiento de musgo tufteado.",
    image: "/obras/banco-musgo/2.jpg",
    alt: "Banco de madera con asiento de musgo",
  },
  {
    key: "objeto",
    label: "objetos intervenidos",
    hand: "objeto",
    blurb: "Botellas, damajuanas y piezas recuperadas vestidas en textil.",
    image: "/obras/ocean/4.jpg",
    alt: "Damajuana de vidrio intervenida con tufting azul",
  },
  {
    key: "instalacion",
    label: "instalaciones",
    hand: "instalación",
    blurb: "A medida del espacio: techos, muros y dobles alturas.",
    image: "/obras/amazonicas/4.jpg",
    alt: "Hojas de nenúfar gigante suspendidas del techo",
  },
  {
    key: "cuadro",
    label: "cuadros",
    hand: "cuadro",
    blurb: "Fragmentos textiles montados en marcos de madera natural.",
    image: "/obras/cuadro-pleopsidium-flavum/2.jpg",
    alt: "Cuadro textil enmarcado en madera clara",
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
        <p className="font-hand text-3xl text-sea">qué hacemos</p>
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
          <Button href="/tienda" variant="outline">ver obras</Button>
          <Button href="/disena-tu-obra">pedir una a medida</Button>
        </div>
      </div>

      {/* Foto que cambia con la categoría activa */}
      <Link
        href={`/tienda?categoria=${current.key}`}
        aria-label={`Ver ${current.label} en la tienda`}
        className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-sand shadow-xl shadow-navy/10 sm:aspect-[5/6] md:aspect-[4/5]"
      >
        {ITEMS.map((item, i) => (
          <Image
            key={item.key}
            src={item.image}
            alt={i === active ? item.alt : ""}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            priority={i === 0}
            className={`object-cover transition-all duration-700 ease-out ${
              i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/75 via-navy/25 to-transparent p-6 pt-24 text-white md:p-8">
          <p key={current.key} className="font-hand text-4xl leading-none text-white md:text-5xl">
            {current.hand}
          </p>
          <p className="mt-2 hidden max-w-sm text-[15px] text-white/85 md:block">{current.blurb}</p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-pill bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur transition group-hover:bg-white group-hover:text-navy">
            ver {current.label} <ArrowRightIcon width={16} height={16} />
          </span>
        </div>
        {/* Puntos de progreso */}
        <div className="absolute right-5 top-5 flex gap-1.5">
          {ITEMS.map((item, i) => (
            <span
              key={item.key}
              className={`h-1.5 rounded-pill transition-all duration-300 ${
                i === active ? "w-5 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </Link>
    </div>
  );
}
