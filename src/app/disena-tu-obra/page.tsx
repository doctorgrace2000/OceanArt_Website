import Image from "next/image";
import type { Metadata } from "next";
import CustomOrderForm from "@/components/CustomOrderForm";
import PageBanner from "@/components/ui/PageBanner";
import { Container, SectionTitle } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Diseña tu obra",
  description:
    "Pedí una pieza textil a medida: tapices, alfombras, instalaciones y objetos diseñados para tu espacio.",
};

const STEPS = [
  ["Contanos tu idea", "Qué pieza querés, dónde va a ir, medidas aproximadas y colores o referencias que te gusten."],
  ["Propuesta y presupuesto", "Te enviamos un boceto, materiales y precio. Ajustamos juntos hasta que cierre."],
  ["Forma de pago", "50 % para reservar y comenzar a producir tu obra; el 50 % restante al entregarla."],
  ["Producción y entrega", "Dependiendo del tamaño, suele ser 10 días hábiles de producción. Te mandamos fotos del proceso y coordinamos la entrega."],
];

export default function DisenaTuObraPage() {
  return (
    <>
      <PageBanner title="Diseña tu obra" image="/img/agua-3.jpg" />

      <Container className="py-14">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionTitle align="left" hand="Cómo trabajamos">Del boceto a tu pared</SectionTitle>
            <ol className="mt-8 space-y-6">
              {STEPS.map(([title, text], i) => (
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
                alt="Bocetos a mano en línea azul de un tapiz, una alfombra y un objeto intervenido"
                fill
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="object-contain"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-foam p-6 md:p-8">
            <h2 className="text-xl font-medium text-navy">Contanos qué tenés en mente</h2>
            <p className="mt-1 text-sm text-stone">
              Al enviar se abre WhatsApp con tu pedido ya escrito. Ahí podés adjuntar fotos del
              espacio o referencias.
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
