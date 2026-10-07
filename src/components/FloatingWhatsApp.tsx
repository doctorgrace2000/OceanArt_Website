import { WhatsAppIcon } from "@/components/Icons";
import { whatsappUrl } from "@/lib/site";

export default function FloatingWhatsApp() {
  return (
    <a
      href={whatsappUrl("Hola Ocean Art! Quería hacerles una consulta.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-13 w-13 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-whatsapp/40 transition hover:scale-105"
    >
      <WhatsAppIcon width={26} height={26} />
    </a>
  );
}
