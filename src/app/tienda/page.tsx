import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import PageBanner from "@/components/ui/PageBanner";
import { Container } from "@/components/ui/Section";
import { CATEGORIES, products, type Category } from "@/data/products";

export const metadata: Metadata = {
  title: "Tienda de arte textil: tapices y alfombras tufting",
  description:
    "Comprá obras de arte textil hechas a mano con tufting: tapices, alfombras tufting, instalaciones y objetos inspirados en la naturaleza. Envíos a todo el país.",
  alternates: { canonical: "/tienda" },
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
