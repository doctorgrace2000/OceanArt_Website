import Image from "next/image";
import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import { Container } from "@/components/ui/Section";
import { CATEGORIES, products, type Category } from "@/data/products";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Obras textiles disponibles: tapices, alfombras, cuadros, objetos intervenidos, bancos e instalaciones hechas a mano.",
};

type Props = { searchParams: Promise<{ categoria?: string }> };

export default async function TiendaPage({ searchParams }: Props) {
  const { categoria } = await searchParams;
  const initial = CATEGORIES.includes(categoria as Category) ? (categoria as Category) : "todas";

  return (
    <>
      <div className="relative h-44 w-full md:h-60">
        <Image src="/img/agua-1.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 flex items-end">
          <Container className="pb-6">
            <h1 className="text-3xl font-medium tracking-tight text-white drop-shadow md:text-4xl">
              tienda
            </h1>
            <p className="mt-1 text-white/90 drop-shadow">
              piezas únicas y obras a pedido · envíos a todo el país
            </p>
          </Container>
        </div>
      </div>
      <Container className="py-10">
        <ProductGrid products={products} initialFilter={initial} />
      </Container>
    </>
  );
}
