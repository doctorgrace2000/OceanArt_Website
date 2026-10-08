"use client";

import { useRef } from "react";
import ProductCard from "@/components/ProductCard";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/Icons";
import type { Product } from "@/data/products";

export default function FeaturedCarousel({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[10vw] pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8"
      >
        {products.map((p) => (
          <ProductCard
            key={p.slug}
            product={p}
            className="w-[80vw] shrink-0 snap-center sm:w-[44vw] sm:snap-start lg:w-[calc((100%-3rem)/4)]"
          />
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Anterior"
          className="rounded-full border border-foam p-2.5 text-navy transition hover:bg-mist"
        >
          <ArrowLeftIcon />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Siguiente"
          className="rounded-full border border-foam p-2.5 text-navy transition hover:bg-mist"
        >
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}
