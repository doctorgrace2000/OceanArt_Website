import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import { ArrowLeftIcon, BankIcon, PinIcon } from "@/components/Icons";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import TrackViewContent from "@/components/TrackViewContent";
import { Container } from "@/components/ui/Section";
import {
  bundlesWith,
  categoryLabel,
  categoryName,
  getProduct,
  products,
  relatedProducts,
  type Product,
} from "@/data/products";
import { localizeProduct } from "@/data/products.en";
import { Link } from "@/i18n/client";
import { alternates, asLocale, localizePath, pick, type Locale } from "@/i18n/config";
import { currencyFor, formatPrice, toCurrency } from "@/lib/format";
import { site } from "@/lib/site";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

/** "Orquídea II, alfombra de tufting" / "Orchid II, tufted rug" */
const pieceAlt = (p: Product, locale: Locale) =>
  pick(
    locale,
    `${p.name}, ${categoryName(p.category).toLowerCase()} de tufting`,
    `${p.name}, tufted ${categoryName(p.category, "en").toLowerCase()}`,
  );

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = asLocale(lang);
  const found = getProduct(slug);
  if (!found) return {};
  const product = localizeProduct(found, locale);
  const title = pick(
    locale,
    `${product.name} · ${categoryName(product.category)} de tufting`,
    `${product.name} · Tufted ${categoryName(product.category, "en").toLowerCase()}`,
  );
  return {
    title,
    description: pick(
      locale,
      `${product.short} Obra de arte textil hecha a mano con tufting en Buenos Aires, inspirada en la naturaleza.`,
      `${product.short} Handmade tufted textile art from Buenos Aires, inspired by nature.`,
    ),
    alternates: alternates(`/tienda/${product.slug}`, locale),
    openGraph: {
      title,
      description: product.short,
      images: [{ url: product.images[0], alt: pieceAlt(product, locale) }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { lang, slug } = await params;
  const locale = asLocale(lang);
  const t = <T,>(es: T, en: T) => pick(locale, es, en);
  const found = getProduct(slug);
  if (!found) notFound();
  const product = localizeProduct(found, locale);
  const url = `${site.url}${localizePath(`/tienda/${product.slug}`, locale)}`;

  const related = relatedProducts(product, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((src) => `${site.url}${src}`),
    url,
    sku: product.slug,
    category: categoryLabel(product, locale),
    material: product.materials,
    brand: { "@type": "Brand", name: "Ocean Art" },
    ...(product.price !== null && {
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: currencyFor(locale),
        price: toCurrency(product.price, locale),
        availability:
          product.availability === "vendido"
            ? "https://schema.org/SoldOut"
            : product.availability === "en-proceso"
              ? "https://schema.org/PreOrder"
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
      <TrackViewContent slug={product.slug} />
      <Link href="/tienda" className="inline-flex items-center gap-1 text-sm text-stone hover:text-navy">
        <ArrowLeftIcon width={16} height={16} /> {t("Volver a la tienda", "Back to the shop")}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <ProductGallery
          images={product.images}
          name={pieceAlt(product, locale)}
        />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm text-stone">
            {categoryLabel(product, locale)}
            {product.year ? ` · ${product.year}` : ""}
          </p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight text-navy md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl text-ink">
            {product.price === null ? (
              <span className="text-stone">{t("Precio a cotizar", "Price on request")}</span>
            ) : (
              formatPrice(product.price, locale)
            )}
          </p>

          {bundlesWith(product.slug).map((b) => {
            const bundle = localizeProduct(b, locale);
            const bundlePrice = bundle.price !== null && formatPrice(bundle.price, locale);
            return (
              <Link
                key={bundle.slug}
                href={`/tienda/${bundle.slug}`}
                className="mt-4 block rounded-2xl border border-sea/30 bg-mist px-4 py-3 text-[15px] font-medium text-navy transition hover:border-navy/40"
              >
                {bundle.name}: {bundlePrice} {t("llevando las dos", "when you take both")}
              </Link>
            );
          })}

          <p className="mt-6 text-[17px] leading-relaxed text-ink/90">{product.description}</p>

          {product.availability === "en-proceso" ? (
            <p className="mt-4 text-[15px] font-medium text-sea">{t("Obra en proceso", "Work in progress")}</p>
          ) : (
            product.price !== null && product.inStock !== false && (
              <p className="mt-4 text-[15px] font-medium text-sea">
                {t("Disponible para entrega inmediata", "Ready to ship")}
              </p>
            )
          )}

          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            {product.dimensions && (
              <>
                <dt className="text-stone">{t("Medidas", "Dimensions")}</dt>
                <dd className="whitespace-pre-line">{product.dimensions}</dd>
              </>
            )}
            <dt className="text-stone">{t("Materiales", "Materials")}</dt>
            <dd>{product.materials}</dd>
          </dl>

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          <ul className="mt-8 space-y-3 border-t border-foam pt-6 text-sm text-ink/80">
            <li className="flex gap-3">
              <BankIcon className="mt-0.5 shrink-0 text-navy" />
              <span>
                {t(
                  "Pago por transferencia bancaria. Al finalizar la compra te mostramos los datos y nos avisás por WhatsApp con el comprobante.",
                  "Prices in US dollars. After you place your order, we contact you to arrange payment.",
                )}
              </span>
            </li>
            <li className="flex gap-3">
              <PinIcon className="mt-0.5 shrink-0 text-navy" />
              <span>
                {t(
                  "Retiro sin cargo en el taller o envío a todo el país, coordinado por WhatsApp según tamaño y destino.",
                  "Free pickup at our studio in Buenos Aires, or international shipping quoted by size and destination.",
                )}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="text-2xl font-medium tracking-tight text-navy">
            {t("También te puede gustar", "You may also like")}
          </h2>
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
