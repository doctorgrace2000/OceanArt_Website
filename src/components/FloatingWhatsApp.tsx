"use client";

import { WhatsAppIcon } from "@/components/Icons";
import { useI18n } from "@/i18n/client";
import { whatsappUrl } from "@/lib/site";

export default function FloatingWhatsApp() {
  const { t } = useI18n();
  return (
    <a
      href={whatsappUrl(t("Hola Ocean Art! Quería hacerles una consulta.", "Hi Ocean Art! I have a question."))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("Escribinos por WhatsApp", "Message us on WhatsApp")}
      className="fixed bottom-5 right-5 z-30 flex h-13 w-13 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-whatsapp/40 transition hover:scale-105"
    >
      <WhatsAppIcon width={26} height={26} />
    </a>
  );
}
