import { getProduct, type Product } from "@/data/products";

/**
 * Nueva colección "Jardín imaginario", presentada en Puro Diseño.
 * El carrusel de la landing muestra la foto de producto (fondo blanco) de
 * cada pieza, tomada directamente del catálogo. Para sumar o quitar una,
 * editá la lista de slugs.
 */
const SLUGS = [
  "orquidea-moteada",
  "orquidea-lila",
  "orquidea-blanca",
  "orquidea-bordo",
  "orquidea-purpura",
  "verde-musgo",
  "verde-musgo-2",
  "set-verde-musgo",
  "tapiz-verde",
  "banco-musgo",
  "banco-musgo-2",
  "banco-musgo-3",
  "trio-bancos",
  "escultura-flor-1",
  "escultura-flor-2",
  "escultura-flor-3",
] as const;

export const collection = {
  name: "Jardín imaginario",
  eyebrow: "nueva colección",
  products: SLUGS.map((slug) => getProduct(slug)).filter((p): p is Product => Boolean(p)),
};
