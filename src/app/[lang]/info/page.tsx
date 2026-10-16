import Image from "next/image";
import type { Metadata } from "next";
import ContactFaq from "@/components/ContactFaq";
import { InstagramIcon } from "@/components/Icons";
import Button from "@/components/ui/Button";
import PageBanner from "@/components/ui/PageBanner";
import { Container, SectionTitle } from "@/components/ui/Section";
import { awardCount, exhibitions, exhibitionsByYear, localizeExhibition } from "@/data/exhibitions";
import { alternates, asLocale, pick } from "@/i18n/config";
import { site } from "@/lib/site";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = asLocale((await params).lang);
  return {
    title: pick(locale, "Verónica Orlando, artista textil", "Verónica Orlando, textile artist"),
    description: pick(
      locale,
      "Conocé a Verónica Orlando, artista textil y fundadora de Ocean Art: biografía, exposiciones, premios y el taller de tufting en General Rodríguez, Buenos Aires.",
      "Meet Verónica Orlando, textile artist and founder of Ocean Art: biography, exhibitions, awards and her tufting studio in General Rodríguez, Buenos Aires.",
    ),
    alternates: alternates("/info", locale),
  };
}

export default async function InfoPage({ params }: Props) {
  const locale = asLocale((await params).lang);
  const t = <T,>(es: T, en: T) => pick(locale, es, en);
  return (
    <>
      <PageBanner title={t("Info", "About")} image="/img/agua-2.jpg" />
      <Container className="py-14 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/img/veronica.jpg"
              alt={t("Verónica Orlando frente a las raíces de un ficus", "Verónica Orlando in front of the roots of a ficus tree")}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionTitle align="left" hand={t("La persona detrás", "The person behind it")}>Verónica Orlando</SectionTitle>
            <p className="mt-2 text-[17px] text-ink/70">
              {t("Artista textil y fundadora de Ocean Art.", "Textile artist and founder of Ocean Art.")}
            </p>
            <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink/90">
              <p>
                {t(
                  "Ocean Art es un proyecto personal que nace desde la búsqueda del disfrute, y con el tiempo se fue transformando en la interpretación artística. Cada obra fue pensada, sentida y trabajada de manera artesanal en el taller.",
                  "Ocean Art is a personal project that began as a search for joy and, over time, became a form of artistic interpretation. Every piece is conceived, felt and handcrafted in the studio.",
                )}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={site.instagram}><InstagramIcon /> {t("Seguir en Instagram", "Follow on Instagram")}</Button>
              <Button href="/tienda" variant="outline">{t("Ver obras", "See pieces")}</Button>
            </div>
          </div>
        </div>
      </Container>

      {/* BIOGRAFÍA */}
      <section id="biografia" className="scroll-mt-24 border-t border-foam/70 py-16 md:py-20">
        <Container narrow>
          <SectionTitle align="left">{t("Biografía", "Biography")}</SectionTitle>
          <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-ink/90">
            {t(
              <>
                <p>
                  Verónica Orlando nació en Buenos Aires, Argentina, en 1970, donde vive y trabaja
                  actualmente. Estudió la carrera de Diseño Gráfico en la Universidad de Buenos Aires
                  en 1991.
                </p>
                <p>
                  Clínica de obra, programa “Proyecto Trayecto”, en Fundación Cazadores a cargo de
                  Leila Tschopp (2025). Clínica de “Arte y Ambientalismo” en Muntref a cargo de Pablo
                  Lapadula (2024). Desafíos de producción y exhibiciones site specific, en Eseade con
                  Cecilia Jaime (2024).
                </p>
                <p>
                  Se capacitó en diferentes talleres en el área de ilustración con Victoria Morete
                  (2019) y con Azul Decorso (2023), ilustración botánica con Laura Blanco (2023), en
                  raíces textiles con Tsonolabstudio (2024) y técnicas textiles con Andrea Cavagnaro
                  (2025).
                </p>
              </>,
              <>
                <p>
                  Verónica Orlando was born in Buenos Aires, Argentina, in 1970, where she currently
                  lives and works. She studied Graphic Design at the University of Buenos Aires in
                  1991.
                </p>
                <p>
                  Artwork critique program “Proyecto Trayecto” at Fundación Cazadores, led by Leila
                  Tschopp (2025). “Art and Environmentalism” critique program at Muntref, led by Pablo
                  Lapadula (2024). Production challenges and site-specific exhibitions at Eseade with
                  Cecilia Jaime (2024).
                </p>
                <p>
                  She has trained in illustration workshops with Victoria Morete (2019) and Azul
                  Decorso (2023), botanical illustration with Laura Blanco (2023), textile roots with
                  Tsonolabstudio (2024) and textile techniques with Andrea Cavagnaro (2025).
                </p>
              </>,
            )}
          </div>
        </Container>
      </section>

      {/* EXPOSICIONES */}
      <section id="exposiciones" className="scroll-mt-24 border-t border-foam/70 py-16 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionTitle align="left" hand={t("Recorrido", "Track record")}>
                {t("Exposiciones y premios", "Exhibitions and awards")}
              </SectionTitle>
              <p className="mt-4 text-[17px] leading-relaxed text-ink/85">
                {t(
                  "Las obras de Ocean Art participaron en muestras colectivas, ferias y espacios de diseño en Argentina, Italia y Austria.",
                  "Ocean Art's pieces have been shown in group exhibitions, fairs and design spaces in Argentina, Italy and Austria.",
                )}
              </p>
              <dl className="mt-6 flex gap-8">
                <div>
                  <dt className="text-sm text-stone">{t("Muestras", "Exhibitions")}</dt>
                  <dd className="text-3xl font-medium text-navy">{exhibitions.length}</dd>
                </div>
                <div>
                  <dt className="text-sm text-stone">{t("Premios", "Awards")}</dt>
                  <dd className="text-3xl font-medium text-navy">{awardCount}</dd>
                </div>
              </dl>
            </div>

            <ol className="divide-y divide-foam">
              {exhibitionsByYear().map(({ year, items }) => (
                <li key={year ?? "s/f"} className="grid gap-4 py-7 first:pt-0 sm:grid-cols-[88px_1fr]">
                  <p className="font-hand text-3xl leading-none text-sea">{year ?? t("Otras", "Other")}</p>
                  <ul className="space-y-5">
                    {items.map((x) => localizeExhibition(x, locale)).map((e, i) => (
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
          <SectionTitle hand="General Rodríguez">{t("El taller", "The studio")}</SectionTitle>
          <p className="mx-auto mt-6 max-w-2xl text-center text-[17px] leading-relaxed text-ink/90">
            {t(
              "Ubicado en General Rodríguez, provincia de Buenos Aires, nuestro taller es el espacio donde las ideas toman forma. Diseñamos, experimentamos y realizamos artesanalmente cada una de nuestras obras, cuidando cada detalle del proceso creativo.",
              "Located in General Rodríguez, in the province of Buenos Aires, our studio is where ideas take shape. We design, experiment and handcraft each of our pieces, caring for every detail of the creative process.",
            )}
            <br />
            {t("Te invitamos a conocerlo.", "You're welcome to visit.")}
          </p>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-[1.6fr_1fr] gap-3 md:gap-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src="/img/taller-2.jpg" alt={t("Interior del taller", "Inside the studio")} fill sizes="(min-width: 896px) 520px, 60vw" className="object-cover" />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image src="/img/taller-1.jpg" alt={t("Entrada del taller", "Studio entrance")} fill sizes="(min-width: 896px) 320px, 40vw" className="object-cover" />
            </div>
          </div>
        </Container>
      </section>

      <ContactFaq />
    </>
  );
}
