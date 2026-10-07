import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import { ArrowLeftIcon, BankIcon, PinIcon } from "@/components/Icons";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { Container } from "@/components/ui/Section";
import {
  AVAILABILITY_LABEL,
  CATEGORY_LABEL,
  getProduct,
  products,
  relatedProducts,
} from "@/data/products";
import { formatPrice } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.short,
    openGraph: { images: [{ url: product.images[0], alt: product.name }] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = relatedProducts(product, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: "Ocean Art" },
    ...(product.price !== null && {
      offers: {
        "@type": "Offer",
        priceCurrency: "ARS",
        price: product.price,
        availability:
          product.availability === "vendido"
            ? "https://schema.org/SoldOut"
            : "https://schema.org/InStock",
      },
    }),
  };

  return (
    <Container className="py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/tienda" className="inline-flex items-center gap-1 text-sm text-stone hover:text-navy">
        <ArrowLeftIcon width={16} height={16} /> volver a la tienda
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <ProductGallery images={product.images} name={product.name} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm text-stone">
            {CATEGORY_LABEL[product.category]}
            {product.year ? ` · ${product.year}` : ""} ·{" "}
            <span className="text-navy">{AVAILABILITY_LABEL[product.availability]}</span>
          </p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight text-navy md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl text-ink">
            {product.price === null ? (
              <span className="text-stone">precio a cotizar</span>
            ) : (
              formatPrice(product.price)
            )}
          </p>

          <p className="mt-6 text-[17px] leading-relaxed text-ink/90">{product.description}</p>

          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            {product.dimensions && (
              <>
                <dt className="text-stone">Medidas</dt>
                <dd className="whitespace-pre-line">{product.dimensions}</dd>
              </>
            )}
            <dt className="text-stone">Materiales</dt>
            <dd>{product.materials}</dd>
            <dt className="text-stone">Origen</dt>
            <dd>Hecha a mano en nuestro taller de General Rodríguez, Buenos Aires.</dd>
          </dl>

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          <ul className="mt-8 space-y-3 border-t border-foam pt-6 text-sm text-ink/80">
            <li className="flex gap-3">
              <BankIcon className="mt-0.5 shrink-0 text-navy" />
              <span>
                Pago por transferencia bancaria. Al finalizar la compra te mostramos los datos y nos
                avisás por WhatsApp con el comprobante.
              </span>
            </li>
            <li className="flex gap-3">
              <PinIcon className="mt-0.5 shrink-0 text-navy" />
              <span>
                Retiro sin cargo en el taller o envío a todo el país, coordinado por WhatsApp según
                tamaño y destino.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="text-2xl font-medium tracking-tight text-navy">También te puede gustar</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
