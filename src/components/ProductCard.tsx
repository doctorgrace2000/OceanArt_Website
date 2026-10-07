import Image from "next/image";
import Link from "next/link";
import { categoryLabel, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";

export default function ProductCard({
  product,
  priority = false,
  className = "",
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const sold = product.availability === "vendido";
  return (
    <Link
      href={`/tienda/${product.slug}`}
      className={`group block ${className}`}
      aria-label={product.name}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-foam bg-white transition group-hover:border-navy/30">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className={`object-cover transition duration-500 group-hover:scale-[1.03] ${sold ? "opacity-70" : ""}`}
        />
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-medium text-ink group-hover:text-navy">
            {product.name}
          </h3>
          <p className="text-sm text-stone">
            {categoryLabel(product)}
            {product.year ? ` · ${product.year}` : ""}
          </p>
        </div>
        <p className="shrink-0 text-[15px] text-navy">
          {product.price === null ? "consultar" : formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
