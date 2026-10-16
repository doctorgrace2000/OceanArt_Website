import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import PageBanner from "@/components/ui/PageBanner";
import { Container } from "@/components/ui/Section";
import { CATEGORIES, products, type Category } from "@/data/products";
import { alternates, asLocale, pick } from "@/i18n/config";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ categoria?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const locale = asLocale((await params).lang);
  return {
    title: pick(locale, "Tienda de arte textil: tapices y alfombras tufting", "Textile art shop: tufted tapestries and rugs"),
    description: pick(
      locale,
      "Comprá obras de arte textil hechas a mano con tufting: tapices, alfombras tufting, instalaciones y objetos inspirados en la naturaleza. Envíos a todo el país.",
      "Shop handmade tufted textile art: tapestries, rugs, installations and objects inspired by nature. Made in Buenos Aires, shipped worldwide.",
    ),
    alternates: alternates("/tienda", locale),
  };
}

export default async function TiendaPage({ params, searchParams }: Props) {
  const locale = asLocale((await params).lang);
  const { categoria } = await searchParams;
  const initial = CATEGORIES.includes(categoria as Category) ? (categoria as Category) : "todas";

  return (
    <>
      <PageBanner title={pick(locale, "Tienda", "Shop")} image="/img/agua-1.jpg" />
      <Container className="py-10">
        <ProductGrid products={products} initialFilter={initial} />
      </Container>
    </>
  );
}
