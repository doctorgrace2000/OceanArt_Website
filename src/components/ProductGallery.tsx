"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-foam bg-white">
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${name}, imagen ${active + 1} de ${images.length}`}
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-contain"
        />
      </div>
      {images.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === active}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === active ? "border-navy" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
