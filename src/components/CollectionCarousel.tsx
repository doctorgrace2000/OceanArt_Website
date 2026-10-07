"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/Icons";
import type { CollectionItem } from "@/data/collection";

const AUTOPLAY_MS = 4500;

export default function CollectionCarousel({ items }: { items: CollectionItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Índice activo según la posición de scroll (el slide más cercano al borde izquierdo).
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const left = track.scrollLeft;
    let best = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    slides.forEach((el, i) => {
      const d = Math.abs(el.offsetLeft - track.offsetLeft - left);
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
    const el = slides[i];
    track.scrollTo({ left: el.offsetLeft - track.offsetLeft, behavior: "smooth" });
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
        aria-label="Fotos de la colección"
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {items.map((item, i) => {
          const landscape = item.orientation === "landscape";
          const body = (
            <>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes={landscape ? "(min-width: 1024px) 560px, 86vw" : "(min-width: 1024px) 380px, 72vw"}
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
                priority={i < 2}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent p-5 pt-16 text-white">
                <p className="text-xs uppercase tracking-[0.18em] text-white/75">{item.kind}</p>
                <p className="mt-0.5 flex items-center gap-2 text-lg font-medium">
                  {item.title}
                  {item.href && (
                    <ArrowRightIcon
                      width={18}
                      height={18}
                      className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  )}
                </p>
              </figcaption>
            </>
          );
          const cls = `group relative block shrink-0 snap-start overflow-hidden rounded-3xl bg-sand ${
            landscape
              ? "aspect-[4/3] w-[86vw] sm:w-[60vw] lg:w-[560px]"
              : "aspect-[3/4] w-[72vw] sm:w-[42vw] lg:w-[380px]"
          }`;
          return item.href ? (
            <Link key={item.src} href={item.href} className={cls} aria-label={`Ver ${item.title}`}>
              <figure className="absolute inset-0">{body}</figure>
            </Link>
          ) : (
            <figure key={item.src} className={cls}>
              {body}
            </figure>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between">
        {/* Puntos */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Ir a la foto">
          {items.map((item, i) => (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Foto ${i + 1}: ${item.title}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-pill transition-all ${
                i === active ? "w-6 bg-navy" : "w-1.5 bg-navy/25 hover:bg-navy/50"
              }`}
            />
          ))}
        </div>
        {/* Flechas */}
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
