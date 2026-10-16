"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CommunitySignup, { JOINED_KEY } from "@/components/CommunitySignup";
import { CloseIcon } from "@/components/Icons";

const DELAY_MS = 40_000;
const START_KEY = "oa-visit-start";
const DISMISSED_KEY = "oa-community-dismissed";
/** Si lo cierra, no se lo volvemos a mostrar por 14 días. */
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
/** Páginas donde no interrumpimos (comprando). */
const QUIET_PATHS = ["/carrito", "/checkout", "/pedido"];

function read(storage: () => Storage, key: string): string | null {
  try {
    return storage().getItem(key);
  } catch {
    return null;
  }
}

function write(storage: () => Storage, key: string, value: string) {
  try {
    storage().setItem(key, value);
  } catch {}
}

/**
 * Invitación a la comunidad que aparece a los 40 s de visita (contando entre páginas).
 * No aparece si ya se sumó, si la cerró hace poco ni durante la compra.
 * Para verla al instante: agregá ?comunidad a cualquier URL.
 */
export default function CommunityPopup() {
  const pathname = usePathname();
  const [due, setDue] = useState(false);
  const [closed, setClosed] = useState(false);
  const [shown, setShown] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const open = due && !closed && !QUIET_PATHS.some((p) => pathname.startsWith(p));

  // Cuenta los 40 s desde el comienzo de la visita
  useEffect(() => {
    let delay = 0;
    if (!new URLSearchParams(window.location.search).has("comunidad")) {
      if (read(() => localStorage, JOINED_KEY)) return;
      const dismissed = Number(read(() => localStorage, DISMISSED_KEY) ?? 0);
      if (Date.now() - dismissed < SNOOZE_MS) return;

      let start = Number(read(() => sessionStorage, START_KEY));
      if (!start) {
        start = Date.now();
        write(() => sessionStorage, START_KEY, String(start));
      }
      delay = Math.max(0, start + DELAY_MS - Date.now());
    }
    const t = window.setTimeout(() => setDue(true), delay);
    return () => window.clearTimeout(t);
  }, []);

  // Entrada suave, Escape para cerrar y sin scroll de fondo
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setShown(true));
    dialogRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    if (!read(() => localStorage, JOINED_KEY)) write(() => localStorage, DISMISSED_KEY, String(Date.now()));
    setShown(false);
    window.setTimeout(() => setClosed(true), 250);
  }

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-0"}`}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="community-popup-title"
        tabIndex={-1}
        className={`relative max-h-[calc(100svh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl p-5 shadow-2xl shadow-navy/30 outline-none transition duration-300 sm:p-10 ${shown ? "translate-y-0 scale-100" : "translate-y-3 scale-[0.98]"}`}
      >
        <Image src="/img/agua-3.jpg" alt="" fill sizes="512px" className="-z-10 object-cover" />

        <button
          type="button"
          onClick={close}
          aria-label="Cerrar"
          className="absolute right-7 top-7 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-navy shadow transition hover:bg-white sm:right-12 sm:top-12"
        >
          <CloseIcon width={18} height={18} />
        </button>

        <div className="rounded-2xl bg-mist/95 px-6 pb-7 pt-9 backdrop-blur-sm sm:px-8">
          <div className="text-center">
            <p className="font-hand text-xl text-sea">Sumate</p>
            <h2 id="community-popup-title" className="mt-1 text-2xl font-medium tracking-tight text-navy sm:text-3xl">
              Comunidad Ocean Art
            </h2>
            <p className="mx-auto mt-3 max-w-xs leading-relaxed text-ink/85">
              Enterate antes que nadie de muestras, eventos, talleres y descuentos.
            </p>
          </div>
          <div className="mt-6">
            <CommunitySignup stacked source="popup" />
          </div>
        </div>
      </div>
    </div>
  );
}
