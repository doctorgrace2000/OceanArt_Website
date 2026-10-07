"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, CATEGORY_PLURAL, type Category, type Product } from "@/data/products";

type Filter = Category | "todas";
type Sort = "destacadas" | "precio-asc" | "precio-desc" | "recientes";

export default function ProductGrid({
  products,
  initialFilter = "todas",
}: {
  products: Product[];
  initialFilter?: Filter;
}) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [sort, setSort] = useState<Sort>("destacadas");

  const counts = useMemo(() => {
    const c: Partial<Record<Category, number>> = {};
    for (const p of products) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [products]);

  const visible = useMemo(() => {
    const list = products.filter((p) => filter === "todas" || p.category === filter);
    const price = (p: Product) => p.price ?? Number.POSITIVE_INFINITY;
    switch (sort) {
      case "precio-asc":
        return [...list].sort((a, b) => price(a) - price(b));
      case "precio-desc":
        return [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
      case "recientes":
        return [...list].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
      default:
        return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
  }, [products, filter, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          <Chip active={filter === "todas"} onClick={() => setFilter("todas")}>
            Todas <span className="opacity-60">{products.length}</span>
          </Chip>
          {CATEGORIES.filter((c) => counts[c]).map((c) => (
            <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>
              {CATEGORY_PLURAL[c]} <span className="opacity-60">{counts[c]}</span>
            </Chip>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-stone">
          ordenar
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-pill border border-foam bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-navy"
          >
            <option value="destacadas">destacadas</option>
            <option value="recientes">más recientes</option>
            <option value="precio-asc">precio: menor a mayor</option>
            <option value="precio-desc">precio: mayor a menor</option>
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="py-20 text-center text-stone">No hay obras en esta categoría por ahora.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3">
          {visible.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-pill border px-4 py-1.5 text-sm transition ${
        active
          ? "border-navy bg-navy text-white"
          : "border-foam bg-white text-ink hover:border-navy hover:text-navy"
      }`}
    >
      {children}
    </button>
  );
}
