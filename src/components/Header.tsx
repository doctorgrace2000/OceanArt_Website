"use client";

import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CartIcon,
  CloseIcon,
  InstagramIcon,
  MailIcon,
  MenuIcon,
  WhatsAppIcon,
} from "@/components/Icons";
import { Link, useI18n } from "@/i18n/client";
import { localizePath, stripLocale, type Locale } from "@/i18n/config";
import { useCart } from "@/lib/cart";
import { site, whatsappUrl } from "@/lib/site";

const NAV = [
  { href: "/", es: "Inicio", en: "Home" },
  { href: "/tienda", es: "Tienda", en: "Shop" },
  { href: "/disena-tu-obra", es: "Diseña tu obra", en: "Custom pieces" },
  { href: "/info", es: "Info", en: "About" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** ES / EN: lleva a la misma página en el otro idioma. */
function LanguageSwitch({ path, className = "" }: { path: string; className?: string }) {
  const { locale, t } = useI18n();
  const options: { code: Locale; label: string; name: string }[] = [
    { code: "es", label: "ES", name: "Español" },
    { code: "en", label: "EN", name: "English" },
  ];
  return (
    <div
      role="group"
      aria-label={t("Idioma", "Language")}
      className={`flex items-center text-[13px] font-medium tracking-[0.12em] ${className}`}
    >
      {options.map((o, i) => (
        <span key={o.code} className="flex items-center">
          {i > 0 && <span aria-hidden className="mx-1.5 h-3 w-px bg-navy/25" />}
          {o.code === locale ? (
            <span aria-current="true" className="text-navy">{o.label}</span>
          ) : (
            <NextLink
              href={localizePath(path, o.code)}
              hrefLang={o.code}
              lang={o.code}
              aria-label={o.name}
              className="text-navy/40 transition hover:text-navy"
            >
              {o.label}
            </NextLink>
          )}
        </span>
      ))}
    </div>
  );
}

function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-5 text-navy ${className}`}>
      <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition hover:text-sea">
        <InstagramIcon width={23} height={23} />
      </a>
      <a href={`mailto:${site.email}`} aria-label="Email" className="transition hover:text-sea">
        <MailIcon width={23} height={23} />
      </a>
      <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="transition hover:text-sea">
        <WhatsAppIcon width={23} height={23} />
      </a>
    </div>
  );
}

function CartLink({ onClick }: { onClick?: () => void }) {
  const { count } = useCart();
  const { t } = useI18n();
  return (
    <Link
      href="/carrito"
      onClick={onClick}
      aria-label={t(
        `Carrito, ${count} ${count === 1 ? "obra" : "obras"}`,
        `Cart, ${count} ${count === 1 ? "piece" : "pieces"}`,
      )}
      className="relative text-navy transition hover:text-sea"
    >
      <CartIcon width={26} height={26} />
      {count > 0 && (
        <span className="absolute -right-2.5 -top-2 flex h-5 min-w-5 items-center justify-center rounded-pill bg-sea px-1 text-[11px] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

export default function Header() {
  const pathname = stripLocale(usePathname());
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  // Bloquear el scroll del fondo mientras el menú mobile está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-white shadow-[0_2px_16px_rgba(1,43,85,0.08)]">
      <div className="mx-auto grid h-[var(--header-h)] max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8">
        {/* Izquierda: menú en dos líneas (desktop) / hamburguesa (mobile) */}
        <nav aria-label={t("Principal", "Main")} className="hidden md:block">
          <ul className="flex items-center gap-x-6 whitespace-nowrap text-[17px] leading-tight tracking-wide lg:gap-x-8">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-block border-b-2 pb-0.5 transition ${
                      active
                        ? "border-sea font-semibold text-navy"
                        : "border-transparent text-ink hover:border-foam hover:text-navy"
                    }`}
                  >
                    {t(item.es, item.en)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <button
          type="button"
          className="md:hidden justify-self-start text-navy"
          aria-label={open ? t("Cerrar menú", "Close menu") : t("Abrir menú", "Open menu")}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon width={28} height={28} /> : <MenuIcon width={28} height={28} />}
        </button>

        {/* Centro: logo */}
        <Link href="/" aria-label={t("Ocean Art, inicio", "Ocean Art, home")} className="justify-self-center">
          <Image
            src="/img/logo-azul.png"
            alt="Ocean Art"
            width={405}
            height={212}
            priority
            className="h-9 w-auto md:h-11"
          />
        </Link>

        {/* Derecha: idioma + redes + carrito */}
        <div className="flex items-center justify-end gap-5 md:gap-6">
          <LanguageSwitch path={pathname} />
          <SocialLinks className="hidden md:flex" />
          <CartLink />
        </div>
      </div>

      {/* Menú mobile */}
      {open && (
        <div className="fixed inset-x-0 top-[var(--header-h)] bottom-0 z-30 bg-white md:hidden">
          <nav aria-label={t("Principal móvil", "Mobile main")} className="flex h-full flex-col px-6 py-8">
            <ul className="space-y-5 text-2xl">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={isActive(pathname, item.href) ? "font-semibold text-navy" : "text-ink"}
                  >
                    {t(item.es, item.en)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/carrito" onClick={() => setOpen(false)} className="text-ink">
                  {t("Carrito", "Cart")}
                </Link>
              </li>
            </ul>
            <div className="mt-auto">
              <SocialLinks />
              <p className="mt-4 text-sm text-stone">{t(site.location, site.locationEn)}</p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
