"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/Icons";
import { categoryLabel, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";

const AUTOPLAY_MS = 4500;

// Posición de scroll que deja el slide alineado como lo pide su snap: centrado en el
// teléfono, al inicio (respetando el scroll-padding) desde sm.
const targetLeft = (track: HTMLElement, slide: HTMLElement) => {
  const x = slide.offsetLeft - track.offsetLeft;
  if (getComputedStyle(slide).scrollSnapAlign.includes("center")) {
    return x - (track.clientWidth - slide.offsetWidth) / 2;
  }
  return x - (parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0);
};

export default function CollectionCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Índice activo: el slide cuya posición de snap está más cerca del scroll actual.
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const left = track.scrollLeft;
    let best = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    slides.forEach((el, i) => {
      const d = Math.abs(targetLeft(track, el) - left);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  }, []);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const i = ((index % slides.length) + slides.length) % slides.length;
    track.scrollTo({ left: targetLeft(track, slides[i]), behavior: "smooth" });
  }, []);

  // Autoplay: avanza solo mientras la pestaña está visible y nadie interactúa.
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      goTo(active + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [active, paused, goTo]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        role="region"
        aria-label="Piezas de la colección"
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[10vw] pb-2 sm:-mx-6 sm:gap-5 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8"
      >
        {products.map((product, i) => (
          <Link
            key={product.slug}
            href={`/tienda/${product.slug}`}
            aria-label={product.name}
            className="group w-[80vw] shrink-0 snap-center sm:w-[40vw] sm:snap-start lg:w-[calc((100%-3.75rem)/4)]"
          >
            {/* Foto de producto sobre blanco, con un borde suave para que la tarjeta se lea */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-foam bg-white transition duration-500 group-hover:border-navy/30 group-hover:shadow-xl group-hover:shadow-navy/10">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 80vw"
                priority={i < 3}
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-4 flex items-start justify-between gap-3 px-1">
              <div className="min-w-0">
                <p className="font-hand text-xl leading-none text-sea">
                  {categoryLabel(product)}
                </p>
                <h3 className="mt-1 truncate text-lg font-medium text-navy">{product.name}</h3>
              </div>
              <p className="shrink-0 pt-1 text-[15px] text-ink">
                {product.price === null ? "Consultar" : formatPrice(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Ir a la pieza">
          {products.map((product, i) => (
            <button
              key={product.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`${i + 1}: ${product.name}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-pill transition-all ${
                i === active ? "w-6 bg-navy" : "w-1.5 bg-navy/25 hover:bg-navy/50"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Anterior"
            className="rounded-full border border-navy/15 bg-white p-2.5 text-navy transition hover:bg-navy hover:text-white"
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Siguiente"
            className="rounded-full border border-navy/15 bg-white p-2.5 text-navy transition hover:bg-navy hover:text-white"
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
