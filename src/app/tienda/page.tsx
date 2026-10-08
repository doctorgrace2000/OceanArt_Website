import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import PageBanner from "@/components/ui/PageBanner";
import { Container } from "@/components/ui/Section";
import { CATEGORIES, products, type Category } from "@/data/products";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Obras textiles disponibles: tapices, alfombras, instalaciones y objetos hechos a mano.",
};

type Props = { searchParams: Promise<{ categoria?: string }> };

export default async function TiendaPage({ searchParams }: Props) {
  const { categoria } = await searchParams;
  const initial = CATEGORIES.includes(categoria as Category) ? (categoria as Category) : "todas";

  return (
    <>
      <PageBanner title="Tienda" image="/img/agua-1.jpg" />
      <Container className="py-10">
        <ProductGrid products={products} initialFilter={initial} />
      </Container>
    </>
  );
}
