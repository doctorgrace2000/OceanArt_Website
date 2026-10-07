import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, MailIcon, WhatsAppIcon } from "@/components/Icons";
import { site, whatsappDisplay, whatsappUrl } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-foam/70 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <Image
            src="/img/logo-azul.png"
            alt="Ocean Art"
            width={405}
            height={212}
            className="h-9 w-auto opacity-80"
          />
          <div className="flex items-center gap-6 text-stone">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-foam p-3 transition hover:border-navy hover:text-navy"
            >
              <InstagramIcon />
            </a>
            <a
              href={`mailto:${site.email}`}
              aria-label="Email"
              className="rounded-full border border-foam p-3 transition hover:border-navy hover:text-navy"
            >
              <MailIcon />
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-full border border-foam p-3 transition hover:border-navy hover:text-navy"
            >
              <WhatsAppIcon />
            </a>
          </div>
          <nav aria-label="Pie" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink">
            <Link href="/tienda" className="hover:text-navy">tienda</Link>
            <Link href="/disena-tu-obra" className="hover:text-navy">diseña tu obra</Link>
            <Link href="/info" className="hover:text-navy">info</Link>
            <Link href="/info#como-comprar" className="hover:text-navy">cómo comprar</Link>
          </nav>
          <p className="max-w-md text-sm text-stone">
            {site.location} · {whatsappDisplay()} · {site.email}
          </p>
          <p className="text-xs text-stone/70">
            © {new Date().getFullYear()} {site.legalName}. Todas las obras son hechas a mano.
          </p>
        </div>
      </div>
    </footer>
  );
}
