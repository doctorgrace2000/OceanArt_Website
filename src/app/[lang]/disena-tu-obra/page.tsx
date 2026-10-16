import Image from "next/image";
import type { Metadata } from "next";
import CustomOrderForm from "@/components/CustomOrderForm";
import PageBanner from "@/components/ui/PageBanner";
import { Container, SectionTitle } from "@/components/ui/Section";
import { alternates, asLocale, pick } from "@/i18n/config";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = asLocale((await params).lang);
  return {
    title: pick(locale, "Alfombras y tapices de tufting a medida", "Custom tufted rugs and tapestries"),
    description: pick(
      locale,
      "Encargá una obra de arte textil a medida: alfombras tufting, tapices e instalaciones diseñadas para tu espacio, con la forma, los colores y las medidas que imagines.",
      "Commission a custom textile artwork: tufted rugs, tapestries and installations designed for your space, in the shape, colors and size you imagine.",
    ),
    alternates: alternates("/disena-tu-obra", locale),
  };
}

const STEPS = {
  es: [
    ["Contanos tu idea", "Qué pieza querés, dónde va a ir, medidas aproximadas y colores o referencias que te gusten."],
    ["Propuesta y presupuesto", "Te enviamos un boceto, materiales y precio. Ajustamos juntos hasta que cierre."],
    ["Forma de pago", "50 % para reservar y comenzar a producir tu obra; el 50 % restante al entregarla."],
    ["Producción y entrega", "Dependiendo del tamaño, suele ser 10 días hábiles de producción. Te mandamos fotos del proceso y coordinamos la entrega."],
  ],
  en: [
    ["Tell us your idea", "What piece you'd like, where it will go, approximate size, and colors or references you love."],
    ["Proposal and quote", "We send you a sketch, materials and price. We adjust it together until it's just right."],
    ["Payment", "50% to reserve and start producing your piece; the remaining 50% on delivery."],
    ["Production and delivery", "Depending on size, production usually takes 10 business days. We send you photos of the process and arrange delivery."],
  ],
};

export default async function DisenaTuObraPage({ params }: Props) {
  const locale = asLocale((await params).lang);
  const t = <T,>(es: T, en: T) => pick(locale, es, en);
  return (
    <>
      <PageBanner title={t("Diseña tu obra", "Design your piece")} image="/img/agua-3.jpg" />

      <Container className="py-14">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionTitle align="left" hand={t("Cómo trabajamos", "How we work")}>
              {t("Del boceto a tu pared", "From sketch to your wall")}
            </SectionTitle>
            <ol className="mt-8 space-y-6">
              {STEPS[locale].map(([title, text], i) => (
                <li key={title} className="flex gap-4">
                  <span className="font-hand text-3xl leading-none text-sea">{i + 1}.</span>
                  <div>
                    <p className="font-medium text-navy">{title}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-ink/80">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="relative mx-auto mt-10 aspect-square max-w-md">
              <Image
                src="/img/dibujo.jpg"
                alt={t(
                  "Bocetos a mano en línea azul de un tapiz, una alfombra y un objeto intervenido",
                  "Hand-drawn blue line sketches of a tapestry, a rug and an upcycled object",
                )}
                fill
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="object-contain"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-foam p-6 md:p-8">
            <h2 className="text-xl font-medium text-navy">{t("Contanos qué tenés en mente", "Tell us what you have in mind")}</h2>
            <p className="mt-1 text-sm text-stone">
              {t(
                "Al enviar se abre WhatsApp con tu pedido ya escrito. Ahí podés adjuntar fotos del espacio o referencias.",
                "When you send it, WhatsApp opens with your request already written. You can attach photos of the space or references there.",
              )}
            </p>
            <div className="mt-6">
              <CustomOrderForm />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
