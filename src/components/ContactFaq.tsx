import Link from "next/link";
import type { ReactNode } from "react";
import { InstagramIcon, MailIcon, PinIcon, WhatsAppIcon } from "@/components/Icons";
import Button from "@/components/ui/Button";
import { Container, SectionTitle } from "@/components/ui/Section";
import { site, whatsappDisplay, whatsappUrl } from "@/lib/site";

const FAQ: [string, ReactNode][] = [
  [
    "Tengo una idea, ¿qué hago?",
    <>
      Contanos qué imaginás y lo diseñamos juntos. Preparamos una propuesta pensada para tu
      espacio: medidas, formas, colores y texturas, con un boceto y el presupuesto. Ajustamos cada
      detalle hasta que la obra sea exactamente lo que buscás. Podés escribirnos por WhatsApp o
      completar el formulario de{" "}
      <Link href="/disena-tu-obra" className="text-navy underline underline-offset-2">
        diseña tu obra
      </Link>
      .
    </>,
  ],
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

/** Contacto a la izquierda y preguntas frecuentes a la derecha (inicio e info). */
export default function ContactFaq() {
  return (
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
  );
}
