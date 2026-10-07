import { getProduct, type Product } from "@/data/products";

/**
 * Nueva colección "Jardín imaginario", presentada en Puro Diseño.
 * El carrusel de la landing muestra la foto de producto (fondo blanco) de
 * cada pieza, tomada directamente del catálogo. Para sumar o quitar una,
 * editá la lista de slugs.
 */
const SLUGS = [
  "tapiz-verde",
  "orquidea-moteada",
  "banco-musgo",
  "orquidea-blanca",
  "orquidea-lila",
  "trio-bancos",
  "orquidea-bordo",
  "orquidea-purpura",
] as const;

export const collection = {
  name: "Jardín imaginario",
  eyebrow: "nueva colección",
  products: SLUGS.map((slug) => getProduct(slug)).filter((p): p is Product => Boolean(p)),
};
