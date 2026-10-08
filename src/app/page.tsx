import Image from "next/image";
import Link from "next/link";
import CollectionCarousel from "@/components/CollectionCarousel";
import ContactFaq from "@/components/ContactFaq";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import WhatWeMake from "@/components/WhatWeMake";
import { ArrowRightIcon, ChevronDownIcon } from "@/components/Icons";
import Button from "@/components/ui/Button";
import { Container, SectionTitle } from "@/components/ui/Section";
import { collection } from "@/data/collection";
import { featuredProducts } from "@/data/products";
import { site } from "@/lib/site";

export default function HomePage() {
  const featured = featuredProducts();

  return (
    <>
      {/* HERO */}
      <section className="relative flex h-[calc(100svh-var(--header-h))] min-h-[520px] items-center justify-center overflow-hidden">
        <Image
          src="/img/agua-2.jpg"
          alt="Superficie del mar"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="relative z-10 px-4 text-center">
          <h1 className="text-balance text-3xl font-medium tracking-tight text-navy drop-shadow-[0_1px_8px_rgba(255,255,255,0.5)] sm:text-4xl md:text-5xl">
            {site.tagline}
          </h1>
          <p className="mt-4 text-lg text-white drop-shadow md:text-xl">Explorá nuestra colección</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/tienda" variant="light" className="w-48">Obras disponibles</Button>
            <Button href="/disena-tu-obra" variant="lightOutline" className="w-48">Diseña tu obra</Button>
          </div>
        </div>
        <a
          href="#sobre"
          aria-label="Bajar"
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/90"
        >
          <ChevronDownIcon width={32} height={32} strokeWidth={1.25} />
        </a>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="scroll-mt-20 py-20 md:py-28">
        <Container className="max-w-4xl">
          <p className="text-center font-hand text-xl text-sea md:text-2xl">Qué es Ocean Art</p>
          {/* Frase principal: funciona como título de la sección */}
          <h2 className="mx-auto mt-3 max-w-3xl text-balance text-center text-3xl font-medium leading-snug tracking-tight text-navy sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
            Un estudio de arte textil donde cada obra nace del encuentro entre la naturaleza, la
            materia y el diseño.
          </h2>
          <div className="mx-auto mt-10 max-w-3xl space-y-4 text-center text-lg leading-relaxed text-ink/85 md:text-[19px]">
            <p>
              A través del tufting y otras técnicas textiles contemporáneas, desarrollamos tapices,
              alfombras e instalaciones que exploran formas orgánicas, texturas y relieves inspirados
              en paisajes, raíces, organismos y procesos vivos. Cada pieza es artesanal y exclusiva,
              pensada para dialogar con el espacio.
            </p>
          </div>
          <p className="mt-8 text-center font-hand text-2xl text-navy md:text-3xl">
            Lo vivo como inspiración, lo textil como lenguaje.
          </p>
        </Container>
        <Container className="mt-14 max-w-3xl">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src="/img/agua-3.jpg" alt="Reflejos de sol sobre el agua" fill sizes="(min-width: 768px) 384px, 50vw" className="object-cover" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src="/img/agua-1.jpg" alt="Ondas sobre el mar" fill sizes="(min-width: 768px) 384px, 50vw" className="object-cover" />
            </div>
          </div>
        </Container>
      </section>

      {/* NUEVA COLECCIÓN */}
      <section id="coleccion" className="scroll-mt-24 border-y border-foam/70 bg-white py-20 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className="font-hand text-xl text-sea md:text-2xl">{collection.eyebrow}</p>
            <h2 className="mt-1 text-3xl font-medium tracking-tight text-navy md:text-4xl">
              {collection.name}
            </h2>
          </div>
          <div className="mt-10">
            <CollectionCarousel products={collection.products} />
          </div>
        </Container>
      </section>

      {/* QUÉ HACEMOS */}
      <section className="py-20 md:py-28">
        <Container>
          <WhatWeMake />
        </Container>
      </section>

      {/* DESTACADAS */}
      <section className="pt-20 pb-8 md:pt-24 md:pb-10">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <SectionTitle align="left">Obras destacadas</SectionTitle>
            <Link href="/tienda" className="hidden items-center gap-1 text-sm text-navy hover:underline sm:inline-flex">
              Ver todas <ArrowRightIcon width={16} height={16} />
            </Link>
          </div>
          <div className="mt-8">
            <FeaturedCarousel products={featured} />
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Button href="/tienda" variant="outline">Ver todas las obras</Button>
          </div>
        </Container>
      </section>

      {/* CONTACTO Y PREGUNTAS FRECUENTES */}
      <section className="mt-8 border-t border-foam/70 md:mt-10">
        <ContactFaq />
      </section>
    </>
  );
}
