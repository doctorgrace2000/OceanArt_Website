import { obra } from "@/lib/obras";

export type Category = "tapiz" | "alfombra" | "instalacion" | "objeto";

export type Availability = "unico" | "a-pedido" | "en-proceso" | "vendido";

export interface Product {
  slug: string;
  name: string;
  year?: number;
  category: Category;
  /** Otras categorías en las que también aparece (p. ej. alfombra que se usa como tapiz). */
  alsoIn?: Category[];
  /** Precio en ARS. `null` = se cotiza por WhatsApp (no se agrega al carrito). */
  price: number | null;
  availability: Availability;
  short: string;
  description: string;
  dimensions?: string;
  materials: string;
  images: string[];
  featured?: boolean;
  /** `false` = no está lista para entrega inmediata. Por defecto, sí. */
  inStock?: boolean;
  /** Obras que se venden juntas en este producto (p. ej. un dúo con precio especial). */
  bundleOf?: string[];
}

export const CATEGORY_LABEL: Record<Category, string> = {
  tapiz: "Tapiz",
  alfombra: "Alfombra",
  instalacion: "Instalación",
  objeto: "Objeto",
};

export const CATEGORY_PLURAL: Record<Category, string> = {
  tapiz: "Tapices",
  alfombra: "Alfombras",
  instalacion: "Instalaciones",
  objeto: "Objetos",
};

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  unico: "Pieza única",
  "a-pedido": "A pedido",
  "en-proceso": "En proceso",
  vendido: "Vendida",
};

export const CATEGORIES = Object.keys(CATEGORY_LABEL) as Category[];

export const categoriesOf = (p: Product): Category[] => [p.category, ...(p.alsoIn ?? [])];

export const inCategory = (p: Product, c: Category): boolean => categoriesOf(p).includes(c);

/** "Alfombra / Tapiz" cuando la obra está en más de una categoría. */
export const categoryLabel = (p: Product): string =>
  categoriesOf(p).map((c) => CATEGORY_LABEL[c]).join(" / ");

/**
 * Genera las rutas de una obra: primero `portada.jpg` (foto de frente, fondo
 * blanco, mismo encuadre 4:5 en todas) y después 1.jpg … n.jpg.
 * `source` es la foto de la que salió la portada: se omite si era una foto de
 * estudio (sería repetida) y se conserva con `keepSource` si es una foto en
 * contexto que suma.
 */
function imgs(folder: string, count: number, source = 1, keepSource = false): string[] {
  const all = Array.from({ length: count }, (_, i) => `/obras/${folder}/${i + 1}.jpg`);
  const src = all[source - 1];
  const rest = keepSource ? [src, ...all.filter((p) => p !== src)] : all.filter((p) => p !== src);
  return [`/obras/${folder}/portada.jpg`, ...rest].map(obra);
}

const TUFTING =
  "Lana y fibras acrílicas tufteadas a mano sobre tela base.";

/**
 * Catálogo. Los precios son valores de ejemplo para que el flujo de compra
 * funcione: reemplazalos por los reales antes de publicar.
 */
const ORCHID_MATERIALS =
  "Lana y fibras acrílicas tufteadas a mano sobre tela base, con relieves en distintos largos de pelo. Base antideslizante.";

const ORCHID_USE =
  " Se puede usar en piso o colgar en pared.";

/** El orden del array es el de la tienda y los carruseles: agrupado por colorimetría. */
export const products: Product[] = [
  // --- Orquídeas ---------------------------------------------------------------
  {
    slug: "orquidea-moteada",
    name: "Orquídea I",
    year: 2026,
    category: "alfombra",
    alsoIn: ["tapiz"],
    price: 470000,
    availability: "a-pedido",
    featured: true,
    short: "Alfombra orquídea lila con pétalos moteados y centro violeta.",
    description:
      "Silueta de una orquídea Phalaenopsis: pétalos lilas con moteado crudo y morado, junto con un labelo violeta profundo en relieve, trabajado en distintas alturas. Técnica tufting." +
      ORCHID_USE,
    dimensions: "60 × 70 cm",
    materials: ORCHID_MATERIALS,
    images: imgs("orquidea-moteada", 6, 1, true),
  },
  {
    slug: "orquidea-lila",
    name: "Orquídea II",
    year: 2026,
    category: "alfombra",
    alsoIn: ["tapiz"],
    price: 470000,
    availability: "a-pedido",
    featured: true,
    short: "Alfombra orquídea lila con manchas y centro bordó en relieve.",
    description:
      "Silueta de una orquídea de pétalos redondeados en lila claro, con manchas oscuras y un labelo bordó que sobresale del plano, trabajado en distintas alturas. Técnica tufting." +
      ORCHID_USE,
    dimensions: "60 × 70 cm",
    materials: ORCHID_MATERIALS,
    images: imgs("orquidea-lila", 5, 1, true),
  },
  {
    slug: "orquidea-blanca",
    name: "Orquídea III",
    year: 2026,
    category: "alfombra",
    alsoIn: ["tapiz"],
    price: 450000,
    availability: "a-pedido",
    short: "Alfombra orquídea blanca con nervaduras violetas.",
    description:
      "Silueta de una orquídea de pétalos blancos recorridos por finas nervaduras violetas, con un centro en relieve trabajado en distintas alturas. Técnica tufting." +
      ORCHID_USE,
    dimensions: "60 × 70 cm",
    materials: ORCHID_MATERIALS,
    images: imgs("orquidea-blanca", 5, 1, true),
  },
  {
    slug: "orquidea-bordo",
    name: "Orquídea IV",
    year: 2026,
    category: "alfombra",
    alsoIn: ["tapiz"],
    price: 450000,
    availability: "a-pedido",
    short: "Alfombra orquídea blanca con moteado y centro bordó.",
    description:
      "Silueta de una orquídea de pétalos blancos con moteado bordó denso y un centro oscuro en relieve, trabajado en distintas alturas. Técnica tufting." +
      ORCHID_USE,
    dimensions: "60 × 70 cm",
    materials: ORCHID_MATERIALS,
    images: imgs("orquidea-bordo", 2, 1, true),
  },
  {
    slug: "orquidea-purpura",
    name: "Orquídea V",
    year: 2026,
    category: "alfombra",
    alsoIn: ["tapiz"],
    price: 400000,
    availability: "a-pedido",
    short: "Alfombra orquídea púrpura de pétalos alargados.",
    description:
      "Silueta de una orquídea de pétalos largos y puntiagudos en púrpura y lila, con manchas bordó y bordes crudos, trabajada en distintas alturas. Técnica tufting." +
      ORCHID_USE,
    dimensions: "60 × 50 cm",
    materials: ORCHID_MATERIALS,
    images: imgs("orquidea-purpura", 3, 1, true),
  },

  // --- Verdes: musgos, bancos y líquenes ---------------------------------------
  {
    slug: "verde-musgo",
    name: "Verde Musgo",
    year: 2026,
    category: "alfombra",
    alsoIn: ["tapiz"],
    price: 360000,
    availability: "unico",
    short: "Alfombra de musgos en verdes, amarillos y tierras.",
    description:
      "Alfombra trabajada en distintas alturas de lana, simulando el musgo y las distintas tonalidades de verdes naturales. Técnica tufting.",
    dimensions: "1.22 × 0.67 m",
    materials: TUFTING,
    images: imgs("verde-musgo", 6, 1, true),
  },
  {
    slug: "verde-musgo-2",
    name: "Verde Musgo II",
    year: 2026,
    category: "alfombra",
    alsoIn: ["tapiz"],
    price: 360000,
    availability: "unico",
    short: "Alfombra de musgos, pareja de Verde Musgo.",
    description:
      "Alfombra trabajada en distintas alturas de lana, simulando el musgo y las distintas tonalidades de verdes naturales. Técnica tufting.",
    dimensions: "1.35 × 0.60 m",
    materials: TUFTING,
    images: imgs("verde-musgo-2", 7, 1, true),
  },
  {
    slug: "duo-verde-musgo",
    name: "Dúo Verde Musgo",
    year: 2026,
    category: "alfombra",
    alsoIn: ["tapiz"],
    price: 590000,
    availability: "unico",
    short: "Verde Musgo y Verde Musgo II juntas, con precio especial.",
    description:
      "Las dos piezas Verde Musgo pensadas para estar juntas: se encuentran en el centro y componen un solo manto de musgos en verdes, amarillos y tierras.",
    dimensions: "Verde Musgo 1.22 × 0.67 m · Verde Musgo II 1.35 × 0.60 m",
    materials: TUFTING + " Lanas teñidas con yerba mate y tintes naturales.",
    images: [
      "/obras/duo-verde-musgo/portada.jpg",
      "/obras/duo-verde-musgo/1.jpg",
      "/obras/verde-musgo/portada.jpg",
      "/obras/verde-musgo-2/portada.jpg",
    ].map(obra),
    bundleOf: ["verde-musgo", "verde-musgo-2"],
  },
  {
    slug: "set-verde-musgo",
    name: "Set Verde Musgo",
    year: 2026,
    category: "alfombra",
    alsoIn: ["tapiz"],
    price: 480000,
    availability: "unico",
    short: "Piezas de musgo para componer en piso o pared.",
    description:
      "Un conjunto de piezas de musgo tufteado de formas libres, en verdes y amarillos, que se pueden agrupar o separar para armar tu propia composición.",
    dimensions: "Piezas de 0.55 × 0.26 m y 0.46 × 0.30 m",
    materials: TUFTING,
    images: [
      "/obras/set-verde-musgo/portada.jpg",
      ...[1, 3, 5, 6, 7, 8, 9, 10].map((n) => `/obras/set-verde-musgo/${n}.jpg`),
    ].map(obra),
  },
  {
    slug: "duo-alfombras-verdes",
    name: "Dúo",
    year: 2025,
    category: "alfombra",
    price: 650000,
    availability: "a-pedido",
    featured: true,
    short: "Par de alfombras musgo de formas libres, para pared o piso.",
    description:
      "Dos piezas pensadas para convivir: una alfombra de musgo denso y una pieza calada que deja ver el piso o la pared. Se producen a pedido y se pueden adaptar medidas y tonos.",
    dimensions: "Cada pieza 120 × 90 cm aprox.",
    materials: TUFTING + " Base antideslizante.",
    images: imgs("duo-alfombras-verdes", 5, 1),
  },
  {
    slug: "tapiz-verde",
    name: "Tapiz Cartografía de líquenes",
    year: 2026,
    category: "tapiz",
    price: null,
    availability: "unico",
    short: "Territorio textil que funciona como mapa sensible de la naturaleza.",
    description:
      "Este proyecto parte de la observación de ecosistemas mínimos, y su capacidad de expandirse en diferentes soportes, es una superficie de registro donde la trama textil oscila entre lo orgánico y lo cartográfico. Propone un territorio textil que funciona como mapa sensible de la naturaleza.",
    dimensions: "240 × 150 cm",
    materials: "Tufting, lana.",
    images: [
      "/obras/tapiz-verde/portada.jpg",
      "/obras/tapiz-verde/9.jpg",
      ...[2, 3, 4, 5, 6, 7, 8].map((n) => `/obras/tapiz-verde/${n}.jpg`),
    ].map(obra),
  },
  {
    slug: "banco-musgo",
    name: "Banco Musgo I",
    year: 2026,
    category: "objeto",
    price: 350000,
    availability: "a-pedido",
    short: "Banco de madera de eucaliptus con funda de tufting en lana.",
    description:
      "Banco de madera de eucaliptus con funda de tufting realizada en lana, que simula un cojín de musgo en distintos verdes y alturas. Cada funda es única.",
    dimensions: "0.44 × 0.30 m",
    materials: "Madera de eucaliptus; funda de tufting realizada en lana.",
    images: imgs("banco-musgo", 7, 1, true),
  },
  {
    slug: "banco-musgo-2",
    name: "Banco Musgo II",
    year: 2026,
    category: "objeto",
    price: 350000,
    availability: "unico",
    short: "Banco de eucaliptus con funda redonda de tufting en verdes y amarillo.",
    description:
      "Banco de madera de eucaliptus con funda redonda de tufting realizada en lana, que simula un cojín de musgo con un recorrido de amarillo intenso sobre verdes. Cada funda es única.",
    dimensions: "0.44 × 0.30 m",
    materials: "Madera de eucaliptus; funda de tufting realizada en lana.",
    images: imgs("banco-musgo-2", 4, 1, true),
  },
  {
    slug: "banco-musgo-3",
    name: "Banco Musgo III",
    year: 2026,
    category: "objeto",
    price: 350000,
    availability: "unico",
    short: "Banco de eucaliptus con funda cuadrada de tufting en amarillos y verdes.",
    description:
      "Banco de madera de eucaliptus con funda cuadrada de tufting realizada en lana, que simula un cojín de musgo en amarillos y verdes. Cada funda es única.",
    dimensions: "0.44 × 0.30 m",
    materials: "Madera de eucaliptus; funda de tufting realizada en lana.",
    images: imgs("banco-musgo-3", 3, 1, true),
  },
  {
    slug: "trio-bancos",
    name: "Trío de bancos Musgo",
    year: 2026,
    category: "objeto",
    price: 870000,
    availability: "a-pedido",
    short: "Juego de tres bancos Musgo con asientos en verdes distintos.",
    description:
      "Tres bancos de madera de eucaliptus con fundas de tufting realizadas en lana, cada una con una composición de musgo distinta. Ideal para living, galería o espacio de trabajo.",
    dimensions: "Cada banco 0.44 × 0.30 m",
    materials: "Madera de eucaliptus; fundas de tufting realizadas en lana.",
    images: imgs("trio-bancos", 5, 1),
  },
  {
    slug: "lampara-tejida-verde",
    name: "Lámpara Tejida Verde",
    year: 2026,
    category: "objeto",
    price: 180000,
    availability: "unico",
    short: "Lámpara colgante tejida a crochet en yute verde.",
    description:
      "Lámpara tejida a mano a crochet en yute. Trabajo realizado en conjunto con Vermel Estudio (@vermel_estudio).",
    dimensions: "60 cm de alto · Ø 25 cm",
    materials: "Yute tejido a mano a crochet.",
    images: ["/obras/lampara-tejida-verde/portada.jpg", "/obras/lampara-tejida-verde/1.jpg"].map(obra),
  },
  {
    slug: "nido",
    name: "Nido",
    year: 2026,
    category: "objeto",
    price: 220000,
    availability: "unico",
    featured: true,
    short: "Objeto colgante en técnica coiling, con soga teñida a mano.",
    description:
      "Pieza realizada en técnica coiling con soga teñida a mano de forma artesanal. Se cuelga del techo y proyecta su propia sombra; funciona sola o en grupos de distintas alturas.",
    dimensions: "160 cm de alto aprox.",
    materials: "Soga teñida a mano artesanalmente, técnica coiling.",
    images: imgs("nido", 4, 1, true),
  },

  // --- Bases modulares ---------------------------------------------------------
  {
    slug: "base-modular-1",
    name: "Base Modular I",
    year: 2026,
    category: "objeto",
    price: 150000,
    availability: "unico",
    short: "Dos flores de pétalos lilas sobre una base de tallos enroscados.",
    description:
      "Escultura textil de la colección Jardín imaginario: dos flores de pétalos lilas y centro violeta que nacen de una base de tallos verdes enroscados. Las flores fueron realizadas por Vermel Estudio (@vermel_estudio).",
    materials: "Lana y técnicas textiles sobre estructura interna.",
    images: imgs("escultura-flor-1", 4, 1, true),
  },
  {
    slug: "base-modular-2",
    name: "Base Modular II",
    year: 2026,
    category: "objeto",
    price: 120000,
    availability: "unico",
    short: "Flor de pétalos circulares y centro violeta, con tallo y base verdes.",
    description:
      "Escultura textil de la colección Jardín imaginario: una flor de pétalos circulares y centro violeta en relieve, sostenida por un tallo que se enrosca en una base verde. La flor fue realizada por Vermel Estudio (@vermel_estudio).",
    materials: "Lana y técnicas textiles sobre estructura interna.",
    images: imgs("escultura-flor-2", 3, 1, true),
  },
  {
    slug: "base-modular-3",
    name: "Base Modular III",
    year: 2026,
    category: "objeto",
    price: 120000,
    availability: "unico",
    short: "Flor de pétalos lilas filiformes y centro violeta en relieve.",
    description:
      "Escultura textil de la colección Jardín imaginario: una flor de pétalos lilas largos y finos alrededor de un centro violeta en relieve, sobre una base de tallos verdes. La flor fue realizada por Vermel Estudio (@vermel_estudio).",
    materials: "Lana y técnicas textiles sobre estructura interna.",
    images: imgs("escultura-flor-3", 7, 1, true),
  },

  // --- Trametes versicolor y corteza -------------------------------------------
  {
    slug: "hongos-trametes",
    name: "Tapiz Trametes Versicolor 1",
    year: 2025,
    category: "tapiz",
    price: null,
    availability: "unico",
    featured: true,
    short: "Colonia de hongos cola de pavo en anillos concéntricos.",
    description:
      "Serie de hongos Trametes versicolor superpuestos, con los anillos de crecimiento en gamas de ocre, tierra y gris. Una pieza mural de gran presencia que funciona tanto en pared clara como oscura.",
    dimensions: "180 × 80 cm aprox.",
    materials: TUFTING,
    images: imgs("hongos-trametes", 4, 1),
    inStock: false,
  },
  {
    slug: "trametes-versicolor-2",
    name: "Tapiz Trametes Versicolor 2",
    year: 2025,
    category: "tapiz",
    price: null,
    availability: "unico",
    short: "Hongos cola de pavo tufteados en lana, sobre estructura metálica.",
    description:
      "Pieza mural en tufting que reproduce hongos Trametes versicolor con sus anillos de crecimiento.",
    dimensions: "1,90 × 0,43 m.",
    materials: "Tufting en lana sobre estructura metálica.",
    images: imgs("trametes-versicolor-2", 4, 1, true),
    inStock: false,
  },
  {
    slug: "instalacion-trametes-versicolor",
    name: "Instalación Trametes Versicolor",
    year: 2024,
    category: "instalacion",
    price: null,
    availability: "unico",
    featured: true,
    short: "Tronco con hongos textiles en amarillos y marrones.",
    description:
      "Un tronco recuperado colonizado por hongos tufteados en anillos amarillos, marrones y blancos. Pieza escultórica de piso.",
    dimensions: "95 cm de alto aprox.",
    materials: "Madera recuperada, lana y fibras acrílicas tufteadas.",
    images: imgs("instalacion-trametes-versicolor", 1, 1),
  },
  {
    slug: "tapiz-corteza",
    name: "Tapiz Corteza",
    year: 2025,
    category: "tapiz",
    price: 750000,
    availability: "unico",
    featured: true,
    short: "Tapiz que simula una corteza, con detalles en hilo de cobre.",
    description:
      "Tapiz trabajado en tufting en tonos marrones, ocre y crudo, simulando una corteza. Detalles tejidos a mano en hilo de cobre.",
    dimensions: "110 × 95 cm aprox.",
    materials: TUFTING + " Detalles tejidos a mano en hilo de cobre.",
    images: imgs("tapiz-corteza", 4, 4, true),
  },

  // --- Na' alehu y Xanthoparmelia ----------------------------------------------
  {
    slug: "na-alehu",
    name: "Na' alehu",
    year: 2026,
    category: "alfombra",
    price: null,
    availability: "unico",
    featured: true,
    short: "Alfombra tufteada en lanas teñidas a mano.",
    description:
      "Alfombra realizada en tufting con lanas teñidas a mano. Participó en Casa FOA Córdoba 2026, en el Departamento Flexible (Espacio 17) de Estudio Moraschi, ganador de la Medalla de Oro.",
    dimensions: "2 × 1,80 m.",
    materials: "Lana teñida a mano, tufteada.",
    images: imgs("cruda", 5, 4),
  },
  {
    slug: "lampara-tejida-cruda",
    name: "Lámpara Tejida Cruda",
    year: 2026,
    category: "objeto",
    price: 420000,
    availability: "unico",
    short: "Lámpara colgante tejida a crochet en yute crudo.",
    description:
      "Lámpara tejida a mano a crochet en yute. Trabajo realizado en conjunto con Vermel Estudio (@vermel_estudio).",
    dimensions: "1,40 m de alto · Ø 25 cm",
    materials: "Yute tejido a mano a crochet.",
    images: ["/obras/lampara-tejida-cruda/portada.jpg", "/obras/lampara-tejida-cruda/1.jpg"].map(obra),
  },
  {
    slug: "liquen-xanthoparmelia",
    name: "Serie Liquen Xanthoparmelia",
    year: 2024,
    category: "instalacion",
    price: null,
    availability: "unico",
    featured: true,
    short: "Discos de liquen blanco y negro para muro exterior.",
    description:
      "Conjunto de piezas circulares en blanco y negro que reproducen el liquen Xanthoparmelia sobre ladrillo. Se instalan directamente sobre el muro, en interior o exterior cubierto. Se cotiza según cantidad y tamaños.",
    dimensions: "Piezas de 40 a 90 cm de diámetro.",
    materials: TUFTING + " Tratamiento para exterior cubierto.",
    images: imgs("liquen-xanthoparmelia", 6, 1, true),
  },

  // --- Euryale amazónica -------------------------------------------------------
  {
    slug: "amazonicas",
    name: "Euryale Amazónica",
    year: 2024,
    category: "tapiz",
    price: null,
    availability: "unico",
    featured: true,
    short: "Tapiz de hoja de nenúfar gigante con nervaduras en relieve.",
    description:
      "Tapiz trabajado en tufting, con nervaduras en técnica de embarrilado de sogas, imitando la nervadura de la hoja.",
    dimensions: "2.60 × 0.91 m",
    materials: "Tufting, embarrilado, soga, lana, soporte metálico.",
    images: imgs("amazonicas", 3, 1, true),
  },
  {
    slug: "euryale-amazonica-3",
    name: "Euryale Amazónica 3",
    year: 2024,
    category: "instalacion",
    price: null,
    availability: "unico",
    short: "Tríptico de hojas de nenúfar gigante suspendidas del techo.",
    description:
      "Tres hojas de Victoria amazónica vistas desde abajo: nervaduras en verde lima sobre fondos violeta y borde rojo, con tallos trenzados que caen hasta el piso.",
    dimensions: "I - 2.70 × 0.88 m\nII - 2.70 × 0.81 m\nIII - 2.60 × 0.80 m",
    materials: "Tufting, embarrilado, soga, lana, soporte metálico.",
    images: imgs("amazonicas-3", 4, 2, true),
  },

  // --- Líquenes amarillos ------------------------------------------------------
  {
    slug: "tapiz-pleopsidium-flavum",
    name: "Tapiz Pleopsidium Flavum",
    year: 2024,
    category: "tapiz",
    price: 580000,
    availability: "unico",
    featured: true,
    short: "Liquen amarillo de gran formato, con relieves y densidades variables.",
    description:
      "Interpretación textil del liquen Pleopsidium flavum, que crece en rocas de alta montaña. El tapiz trabaja distintos largos de pelo para generar un relieve que cambia con la luz. Se cuelga directamente sobre la pared con un sistema oculto incluido.",
    dimensions: "Ø 91 cm",
    materials: TUFTING,
    images: imgs("tapiz-pleopsidium-flavum", 4, 1),
  },
  {
    slug: "cuadro-pleopsidium-flavum",
    name: "Cuadro Pleopsidium Flavum",
    year: 2023,
    category: "tapiz",
    price: 230000,
    availability: "unico",
    short: "Detalle de liquen enmarcado en madera clara.",
    description:
      "Fragmento de la serie Pleopsidium flavum trabajado como cuadro: el textil se monta sobre un marco de madera natural con la urdimbre a la vista.",
    dimensions: "70 × 50 cm con marco.",
    materials: "Textil tufteado sobre bastidor con marco de madera natural.",
    images: imgs("cuadro-pleopsidium-flavum", 2, 2),
  },
  {
    slug: "tapiz-xanthoria-parietina",
    name: "Tapiz Xanthoria Parietina",
    year: 2026,
    category: "tapiz",
    price: 460000,
    availability: "unico",
    featured: true,
    short: "Liquen dorado con apotecios rojizos.",
    description:
      "Inspirado en el liquen Xanthoria parietina, común en cortezas y rocas cerca del mar. Lóbulos dorados con pequeños discos rojizos, en una silueta irregular que se recorta sobre la pared.",
    dimensions: "95 × 90 cm aprox.",
    materials: TUFTING,
    images: imgs("tapiz-xanthoria-parietina", 4, 1, true),
  },

  // --- Primordio e instalaciones de raíces -------------------------------------
  {
    slug: "primordio",
    name: "Primordio",
    year: 2025,
    category: "instalacion",
    price: null,
    availability: "unico",
    featured: true,
    short: "Cortina de cordones tejidos en amarillos y ocres.",
    description:
      "Decenas de cordones tejidos a mano cuelgan de una estructura superior formando una cortina que se mueve con el aire. Se puede instalar como separador de ambientes o pieza mural.",
    dimensions: "43 × 90 cm",
    materials: "Cordones de lana y fibras acrílicas tejidos a mano.",
    images: imgs("primordio", 5, 1, true),
    inStock: false,
  },
  {
    slug: "instalacion-ficus",
    name: "Instalación Ficus Macrophylla",
    year: 2025,
    category: "instalacion",
    price: null,
    availability: "a-pedido",
    short: "Raíces aéreas tejidas que caen desde el techo.",
    description:
      "Las raíces del ficus macrophylla recreadas en cordones tejidos de distintos grosores, que descienden desde una estructura superior y se enredan en el piso. Pensada para halls, locales y espacios de doble altura.",
    dimensions: "2,50 × 2,50 × 2,40 m",
    materials: "Embarrilado de lana, yute, paja de seda, vellón e hilo de cobre.",
    images: imgs("instalacion-ficus", 4, 1, true),
  },
  {
    slug: "archivo-biologico",
    name: "Archivo Biológico",
    year: 2026,
    category: "instalacion",
    price: null,
    availability: "unico",
    short: "Biomateriales, raíces cultivadas y tejido ensamblado con cobre.",
    description:
      "Pieza realizada con biomateriales, raíces cultivadas y tejido ensamblado con cobre. Participó de la muestra “La materia del mundo”, con curaduría de Leila Tschopp, en Fundación Cazadores (Buenos Aires, 2026). También formó parte del “Departamento Flexible · Espacio 17” de Estudio Moraschi en Casa FOA Córdoba, Edición Pocito Social Life (2026), espacio que obtuvo la Medalla de Oro.",
    dimensions: "Medidas variables: 1.10 × 0.60 m",
    materials: "Biomateriales, raíces cultivadas y tejido ensamblado con cobre.",
    images: imgs("archivo-biologico", 6, 1, true),
  },

  // --- Azules y pasteles -------------------------------------------------------
  {
    slug: "tapiz-ocean",
    name: "Tapiz Ocean",
    year: 2026,
    category: "tapiz",
    price: null,
    availability: "a-pedido",
    featured: true,
    short: "Corrientes de azul, verde y tierra en formato horizontal.",
    description:
      "La pieza que da nombre al estudio: capas de azules profundos atravesadas por verdes y marrones, como la vista del mar desde arriba. Se produce a pedido en la medida que necesites.",
    dimensions: "150 × 90 cm aprox.",
    materials: TUFTING,
    images: ["/obras/ocean/portada-tapiz.jpg", "/obras/ocean/6.jpg"].map(obra),
    inStock: false,
  },
  {
    slug: "botellas-ocean",
    name: "Botellas Ocean",
    year: 2026,
    category: "objeto",
    price: null,
    availability: "a-pedido",
    short: "Damajuanas de vidrio intervenidas con tufting.",
    description:
      "Objetos intervenidos: damajuanas recuperadas vestidas con fibras tufteadas en la paleta Ocean. Cada una es distinta.",
    dimensions: "35 a 45 cm de alto.",
    materials: "Vidrio recuperado, lana y fibras acrílicas tufteadas a mano.",
    images: [
      "/obras/ocean/portada-botella.jpg",
      "/obras/ocean/4.jpg",
      "/obras/ocean/2.jpg",
      "/obras/ocean/1.jpg",
      "/obras/ocean/3.jpg",
      "/obras/ocean/6.jpg",
    ].map(obra),
  },
  {
    slug: "alba",
    name: "Alba",
    year: 2024,
    category: "alfombra",
    price: 480000,
    availability: "unico",
    featured: true,
    short: "Alfombra de bordes orgánicos en tonos de amanecer.",
    description:
      "Alfombra de uso cotidiano con bordes irregulares y franjas que recuerdan los primeros colores del día sobre el agua. Combina zonas de pelo cortado con detalles de bucle y pompones. Apta para living o dormitorio.",
    dimensions: "140 × 100 cm aprox.",
    materials: TUFTING + " Base antideslizante.",
    images: imgs("alba", 4, 1),
    inStock: false,
  },
];

export const getProduct = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const featuredProducts = (): Product[] => products.filter((p) => p.featured);

/** Productos que venden esta obra junto con otras (p. ej. el dúo Verde Musgo). */
export const bundlesWith = (slug: string): Product[] =>
  products.filter((p) => p.bundleOf?.includes(slug));

export const relatedProducts = (product: Product, limit = 4): Product[] => {
  const same = products.filter(
    (p) => p.slug !== product.slug && inCategory(p, product.category),
  );
  const rest = products.filter(
    (p) => p.slug !== product.slug && !inCategory(p, product.category),
  );
  return [...same, ...rest].slice(0, limit);
};

/** Cantidad máxima que se puede llevar de una obra. */
export const maxQty = (product: Product): number =>
  product.availability === "unico" ? 1 : 10;

export const isPurchasable = (product: Product): boolean =>
  product.price !== null &&
  product.availability !== "vendido" &&
  product.availability !== "en-proceso";
