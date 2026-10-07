"use client";

import Image from "next/image";
import Link from "next/link";
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
import { useCart } from "@/lib/cart";
import { site, whatsappUrl } from "@/lib/site";

const NAV = [
  { href: "/", label: "inicio" },
  { href: "/tienda", label: "tienda" },
  { href: "/disena-tu-obra", label: "diseña tu obra" },
  { href: "/info", label: "info" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
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
  return (
    <Link
      href="/carrito"
      onClick={onClick}
      aria-label={`Carrito, ${count} ${count === 1 ? "obra" : "obras"}`}
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
  const pathname = usePathname();
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
        <nav aria-label="Principal" className="hidden md:block">
          {/* 2 × 2 como el sitio original: "inicio tienda" / "diseña tu obra info" */}
          <ul className="grid w-fit grid-cols-[auto_auto] gap-x-7 gap-y-1.5 text-[17px] leading-tight tracking-wide">
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
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <button
          type="button"
          className="md:hidden justify-self-start text-navy"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon width={28} height={28} /> : <MenuIcon width={28} height={28} />}
        </button>

        {/* Centro: logo */}
        <Link href="/" aria-label="Ocean Art, inicio" className="justify-self-center">
          <Image
            src="/img/logo-azul.png"
            alt="Ocean Art"
            width={405}
            height={212}
            priority
            className="h-12 w-auto md:h-[60px]"
          />
        </Link>

        {/* Derecha: redes + carrito */}
        <div className="flex items-center justify-end gap-6">
          <SocialLinks className="hidden md:flex" />
          <CartLink />
        </div>
      </div>

      {/* Menú mobile */}
      {open && (
        <div className="fixed inset-x-0 top-[var(--header-h)] bottom-0 z-30 bg-white md:hidden">
          <nav aria-label="Principal móvil" className="flex h-full flex-col px-6 py-8">
            <ul className="space-y-5 text-2xl">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={isActive(pathname, item.href) ? "font-semibold text-navy" : "text-ink"}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/carrito" onClick={() => setOpen(false)} className="text-ink">
                  carrito
                </Link>
              </li>
            </ul>
            <div className="mt-auto">
              <SocialLinks />
              <p className="mt-4 text-sm text-stone">{site.location}</p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
