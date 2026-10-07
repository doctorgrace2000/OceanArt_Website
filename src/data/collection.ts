/**
 * Nueva colección "Orquídeas y bancos", presentada en Puro Diseño.
 * Las fotos viven en public/coleccion/. Para sumar una, copiá el JPG ahí y
 * agregá una entrada acá. `href` enlaza a la ficha del producto en la tienda.
 */
export interface CollectionItem {
  src: string;
  title: string;
  kind: "Alfombra" | "Banco" | "Objeto" | "Conjunto";
  alt: string;
  href?: string;
  /** Orientación de la foto, para el tamaño de la tarjeta en el carrusel */
  orientation?: "portrait" | "landscape";
}

export const collection = {
  name: "Orquídeas y bancos",
  eyebrow: "nueva colección",
  intro:
    "Alfombras con forma de orquídea en lilas, blancos y bordó, y bancos de madera con asiento de musgo tufteado. Piezas pensadas para traer el jardín adentro.",
  items: [
    {
      src: "/coleccion/orquidea-moteada.jpg",
      title: "Orquídea moteada",
      kind: "Alfombra",
      alt: "Alfombra con forma de orquídea lila con manchas violetas sobre el pasto",
      href: "/tienda/orquidea-moteada",
    },
    {
      src: "/coleccion/banco-musgo.jpg",
      title: "Banco Musgo",
      kind: "Banco",
      alt: "Banco de madera clara con asiento redondo de musgo tufteado en verdes",
      href: "/tienda/banco-musgo",
    },
    {
      src: "/coleccion/orquidea-blanca.jpg",
      title: "Orquídea blanca",
      kind: "Alfombra",
      alt: "Alfombra orquídea blanca con nervaduras violetas",
      href: "/tienda/orquidea-blanca",
    },
    {
      src: "/coleccion/trio-bancos.jpg",
      title: "Trío de bancos Musgo",
      kind: "Conjunto",
      alt: "Tres bancos de madera con asientos de musgo en distintos verdes",
      href: "/tienda/trio-bancos",
      orientation: "landscape",
    },
    {
      src: "/coleccion/orquidea-bordo.jpg",
      title: "Orquídea bordó",
      kind: "Alfombra",
      alt: "Alfombra orquídea blanca con centro bordó y manchas",
      href: "/tienda/orquidea-bordo",
    },
    {
      src: "/coleccion/orquidea-lila.jpg",
      title: "Orquídea lila",
      kind: "Alfombra",
      alt: "Alfombra orquídea lila con centro bordó en relieve",
      href: "/tienda/orquidea-lila",
    },
    {
      src: "/coleccion/banco-musgo-cenital.jpg",
      title: "Banco Musgo, vista cenital",
      kind: "Banco",
      alt: "Asiento de musgo visto desde arriba con su sombra sobre el pasto",
      href: "/tienda/banco-musgo",
    },
    {
      src: "/coleccion/orquidea-purpura.jpg",
      title: "Orquídea púrpura",
      kind: "Alfombra",
      alt: "Alfombra orquídea púrpura con pétalos alargados",
      href: "/tienda/orquidea-purpura",
    },
    {
      src: "/coleccion/flor-escultorica.jpg",
      title: "Flor escultórica",
      kind: "Objeto",
      alt: "Flor de alambre forrado con centro tufteado violeta y hojas verdes",
    },
    {
      src: "/coleccion/conjunto-orquideas.jpg",
      title: "Conjunto de orquídeas",
      kind: "Conjunto",
      alt: "Cinco alfombras orquídea de distintos colores dispuestas sobre el pasto",
      href: "/tienda?categoria=alfombra",
    },
    {
      src: "/coleccion/composicion-coleccion.jpg",
      title: "La colección completa",
      kind: "Conjunto",
      alt: "Composición con alfombras de musgo, flores escultóricas y orquídeas",
    },
  ] satisfies CollectionItem[],
};
