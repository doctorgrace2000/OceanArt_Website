import Image from "next/image";
import type { Metadata } from "next";
import { InstagramIcon, MailIcon, PinIcon, WhatsAppIcon } from "@/components/Icons";
import Button from "@/components/ui/Button";
import PageBanner from "@/components/ui/PageBanner";
import { Container, SectionTitle } from "@/components/ui/Section";
import { awardCount, exhibitions, exhibitionsByYear } from "@/data/exhibitions";
import { site, whatsappDisplay, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Info",
  description:
    "Quiénes somos, dónde está el taller de Ocean Art y cómo comprar o encargar una obra textil.",
};

const FAQ = [
  [
    "¿Cómo pago?",
    "Por transferencia bancaria. Al finalizar la compra te mostramos CBU y alias; nos mandás el comprobante por WhatsApp y la obra queda confirmada. Reservamos la pieza 48 horas.",
  ],
  [
    "¿Hacen envíos?",
    "Sí, a todo el país. El costo depende del tamaño y el destino, por eso lo cotizamos por WhatsApp después del pedido. También podés retirar en el taller sin cargo.",
  ],
  [
    "¿Cuánto tarda una obra a pedido?",
    "Dependiendo del tamaño, suele ser 10 días hábiles de producción. Te vamos mandando fotos del proceso.",
  ],
  [
    "¿Cómo cuido mi pieza?",
    "Aspirar suavemente sin cepillo giratorio, evitar sol directo prolongado y, ante una mancha, limpiar con paño húmedo y jabón neutro. Para alfombras recomendamos rotarlas cada tanto.",
  ],
  [
    "¿Puedo visitar el taller?",
    "Claro. Estamos en General Rodríguez, provincia de Buenos Aires. Escribinos para coordinar un día.",
  ],
];

export default function InfoPage() {
  return (
    <>
      <PageBanner title="info" image="/img/agua-2.jpg" />
      <Container className="py-14 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/img/veronica.jpg"
              alt="Verónica Orlando frente a las raíces de un ficus"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionTitle align="left" hand="la persona detrás">Verónica Orlando</SectionTitle>
            <p className="mt-2 text-lg font-medium text-sea">
              Artista textil y fundadora de Ocean Art.
            </p>
            <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink/90">
              <p>
                Ocean Art es su proyecto personal. Nació como una búsqueda de disfrute, de juego con
                la materia y el color, y con el tiempo se convirtió en su manera de interpretar
                artísticamente la naturaleza: cada obra es una exploración libre de formas, texturas
                y relieves, hecha a mano en su taller.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={site.instagram}><InstagramIcon /> seguir en Instagram</Button>
              <Button href="/tienda" variant="outline">ver obras</Button>
            </div>
          </div>
        </div>
      </Container>

      {/* BIOGRAFÍA */}
      <section id="biografia" className="scroll-mt-24 border-t border-foam/70 py-16 md:py-20">
        <Container narrow>
          <SectionTitle align="left">Biografía</SectionTitle>
          <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              Verónica Orlando nació en Buenos Aires, Argentina, en 1970, donde vive y trabaja
              actualmente. Estudió la carrera de Diseño Gráfico en la Universidad de Buenos Aires en
              1991.
            </p>
            <p>
              Clínica de obra, programa “Proyecto Trayecto”, en Fundación Cazadores a cargo de Leila
              Tschopp (2025). Clínica de “Arte y Ambientalismo” en Muntref a cargo de Pablo Lapadula
              (2024). Desafíos de producción y exhibiciones site specific, en Eseade con Cecilia
              Jaime (2024).
            </p>
            <p>
              Se capacitó en diferentes talleres en el área de ilustración con Victoria Morete (2019)
              y con Azul Decorso (2023), ilustración botánica con Laura Blanco (2023), en raíces
              textiles con Tsonolabstudio (2024) y técnicas textiles con Andrea Cavagnaro (2025).
            </p>
          </div>
        </Container>
      </section>

      {/* EXPOSICIONES */}
      <section id="exposiciones" className="scroll-mt-24 border-t border-foam/70 py-16 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionTitle align="left" hand="recorrido">Exposiciones y premios</SectionTitle>
              <p className="mt-4 text-[17px] leading-relaxed text-ink/85">
                Las obras de Ocean Art participaron en muestras colectivas, ferias y espacios de
                diseño en Argentina, Italia y Austria.
              </p>
              <dl className="mt-6 flex gap-8">
                <div>
                  <dt className="text-sm text-stone">Muestras</dt>
                  <dd className="text-3xl font-medium text-navy">{exhibitions.length}</dd>
                </div>
                <div>
                  <dt className="text-sm text-stone">Premios</dt>
                  <dd className="text-3xl font-medium text-navy">{awardCount}</dd>
                </div>
              </dl>
            </div>

            <ol className="divide-y divide-foam">
              {exhibitionsByYear().map(({ year, items }) => (
                <li key={year ?? "s/f"} className="grid gap-4 py-7 first:pt-0 sm:grid-cols-[88px_1fr]">
                  <p className="font-hand text-3xl leading-none text-sea">{year ?? "otras"}</p>
                  <ul className="space-y-5">
                    {items.map((e, i) => (
                      <li key={`${e.venue}-${e.title ?? i}`}>
                        <p className="text-[17px] font-medium text-navy">
                          {e.title ? (
                            <>
                              <span className="italic">“{e.title}”</span>
                              <span className="text-stone"> · </span>
                            </>
                          ) : null}
                          {e.venue}
                        </p>
                        <p className="text-sm text-ink/75">
                          {e.kind} · {e.place}
                          {e.detail ? ` · ${e.detail}` : ""}
                        </p>
                        {e.awards && (
                          <ul className="mt-2 flex flex-wrap gap-2">
                            {e.awards.map((a) => (
                              <li
                                key={a}
                                className="inline-flex items-center gap-1.5 rounded-pill border border-navy/15 bg-mist px-3 py-1 text-xs font-medium text-navy"
                              >
                                <span aria-hidden className="text-sea">★</span> {a}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="bg-mist py-16 md:py-20">
        <Container>
          <SectionTitle hand="General Rodríguez">El taller</SectionTitle>
          <p className="mx-auto mt-6 max-w-2xl text-center text-[17px] leading-relaxed text-ink/90">
            Un galpón de ladrillo con puertas azules, donde conviven los bastidores, las pistolas de
            tufting, cientos de conos de lana y las piezas en proceso. Diseñamos, experimentamos y
            realizamos artesanalmente cada obra, cuidando cada detalle.
          </p>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-[1.6fr_1fr] gap-3 md:gap-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src="/img/taller-2.jpg" alt="Interior del taller" fill sizes="(min-width: 896px) 520px, 60vw" className="object-cover" />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image src="/img/taller-1.jpg" alt="Entrada del taller" fill sizes="(min-width: 896px) 320px, 40vw" className="object-cover" />
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionTitle align="left" hand="escribinos">Contacto</SectionTitle>
            <ul className="mt-6 space-y-4 text-[16px]">
              <li className="flex items-center gap-3">
                <WhatsAppIcon className="text-navy" />
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-navy">
                  {whatsappDisplay()}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon className="text-navy" />
                <a href={`mailto:${site.email}`} className="hover:text-navy">{site.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <InstagramIcon className="text-navy" />
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-navy">
                  @oceanart.veronicaorlando
                </a>
              </li>
              <li className="flex items-center gap-3">
                <PinIcon className="text-navy" />
                <span>{site.location}</span>
              </li>
            </ul>
            <div className="mt-8">
              <Button variant="whatsapp" href={whatsappUrl("Hola Ocean Art! Quería hacerles una consulta.")}>
                <WhatsAppIcon /> escribir por WhatsApp
              </Button>
            </div>
          </div>

          <div id="como-comprar" className="scroll-mt-24">
            <SectionTitle align="left" hand="preguntas frecuentes">Cómo comprar</SectionTitle>
            <div className="mt-6 divide-y divide-foam">
              {FAQ.map(([q, a]) => (
                <details key={q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-navy">
                    {q}
                    <span className="text-xl leading-none text-sea transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
