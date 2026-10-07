import { getProduct, type Product } from "@/data/products";

/**
 * Nueva colección "Orquídeas y bancos", presentada en Puro Diseño.
 * El carrusel de la landing muestra la foto de producto (fondo blanco) de
 * cada pieza, tomada directamente del catálogo. Para sumar o quitar una,
 * editá la lista de slugs.
 */
const SLUGS = [
  "orquidea-moteada",
  "banco-musgo",
  "orquidea-blanca",
  "orquidea-lila",
  "trio-bancos",
  "orquidea-bordo",
  "orquidea-purpura",
] as const;

export const collection = {
  name: "Orquídeas y bancos",
  eyebrow: "nueva colección",
  intro:
    "Alfombras con forma de orquídea en lilas, blancos y bordó, y bancos de madera con asiento de musgo tufteado. Piezas pensadas para traer el jardín adentro.",
  products: SLUGS.map((slug) => getProduct(slug)).filter((p): p is Product => Boolean(p)),
};
