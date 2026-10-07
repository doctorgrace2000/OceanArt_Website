import Image from "next/image";
import type { Metadata } from "next";
import CustomOrderForm from "@/components/CustomOrderForm";
import { Container, SectionTitle } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Diseña tu obra",
  description:
    "Pedí una pieza textil a medida: tapices, alfombras, objetos intervenidos e instalaciones diseñadas para tu espacio.",
};

const STEPS = [
  ["Contanos tu idea", "Qué pieza querés, dónde va a ir, medidas aproximadas y colores o referencias que te gusten."],
  ["Propuesta y presupuesto", "Te enviamos un boceto, materiales y precio. Ajustamos juntos hasta que cierre."],
  ["Seña por transferencia", "Con el 50 % de seña reservamos tu lugar en el taller y compramos los materiales."],
  ["Producción y entrega", "Entre 3 y 8 semanas según el tamaño. Te mandamos fotos del proceso y coordinamos la entrega."],
];

export default function DisenaTuObraPage() {
  return (
    <>
      <div className="relative h-56 w-full md:h-72">
        <Image src="/img/agua-3.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 flex items-end">
          <Container className="pb-8">
            <h1 className="text-3xl font-medium tracking-tight text-white drop-shadow md:text-4xl">
              diseña tu obra
            </h1>
            <p className="mt-1 max-w-xl text-white/90 drop-shadow">
              piezas únicas pensadas para tu espacio, hechas a mano en nuestro taller
            </p>
          </Container>
        </div>
      </div>

      <Container className="py-14">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionTitle align="left" hand="cómo trabajamos">Del boceto a tu pared</SectionTitle>
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
            <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/img/taller-2.jpg"
                alt="Interior del taller de Ocean Art"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
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
