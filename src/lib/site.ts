const digits = (v: string) => v.replace(/\D/g, "");

/**
 * Configuración pública del sitio. Todo lo que empieza con NEXT_PUBLIC_
 * se puede cambiar desde las variables de entorno de Vercel sin tocar código.
 */
export const site = {
  name: "Ocean Art",
  legalName: "Ocean Art · Verónica Orlando",
  tagline: "Creaciones inspiradas en la naturaleza",
  description:
    "Estudio de arte textil en Buenos Aires. Tapices, alfombras, instalaciones y objetos hechos a mano con tufting, inspiradas en líquenes, hongos, raíces y agua.",
  // En Vercel, si no se cargó NEXT_PUBLIC_SITE_URL, se usa el dominio de producción del proyecto.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  whatsapp: digits(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5491152401299"),
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
    "https://www.instagram.com/oceanart.veronicaorlando",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "oceanartufting@gmail.com",
  location: "General Rodríguez, Provincia de Buenos Aires",
  bank: {
    holder: process.env.NEXT_PUBLIC_BANK_HOLDER ?? "Verónica Orlando",
    bank: process.env.NEXT_PUBLIC_BANK_NAME ?? "Banco Supervielle",
    account: process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? "CA ARS 180-5134554-3",
    cbu: process.env.NEXT_PUBLIC_BANK_CBU ?? "0270180220051345540036",
    alias: process.env.NEXT_PUBLIC_BANK_ALIAS ?? "OCEAN.ART",
    cuit: process.env.NEXT_PUBLIC_BANK_CUIT ?? "27-21923372-3",
  },
} as const;

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function whatsappDisplay(): string {
  const n = site.whatsapp;
  // 54 9 11 5240 1299 -> +54 9 11 5240-1299
  if (n.startsWith("549") && n.length === 13) {
    return `+54 9 ${n.slice(3, 5)} ${n.slice(5, 9)}-${n.slice(9)}`;
  }
  return `+${n}`;
}
