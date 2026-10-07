export type Category = "tapiz" | "alfombra" | "instalacion" | "objeto";

export type Availability = "unico" | "a-pedido" | "vendido";

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
  return [`/obras/${folder}/portada.jpg`, ...rest];
}

const TUFTING =
  "Lana y fibras acrílicas tufteadas a mano sobre tela base; terminación con respaldo de algodón.";

/**
 * Catálogo. Los precios son valores de ejemplo para que el flujo de compra
 * funcione: reemplazalos por los reales antes de publicar.
 */
const ORCHID_MATERIALS =
  "Lana y fibras acrílicas tufteadas a mano sobre tela base, con relieves en distintos largos de pelo. Base antideslizante.";

const ORCHID_CARE =
  " Se puede usar en piso o colgar en pared. Aspirar sin cepillo giratorio; limpiar manchas con paño húmedo y jabón neutro.";

export const products: Product[] = [
  // --- Nueva colección: Jardín imaginario ----------------------------------
  // La imagen 1 de cada una es la foto de producto sobre fondo blanco; el resto son fotos en crudo.
  {
    slug: "orquidea-moteada",
    name: "Orquídea moteada",
    year: 2026,
    category: "alfombra",
    alsoIn: ["tapiz"],
    price: 260000,
    availability: "a-pedido",
    short: "Alfombra orquídea lila con pétalos moteados y centro violeta.",
    description:
      "Alfombra con la silueta de una orquídea Phalaenopsis: pétalos lilas con moteado blanco y negro y un labelo violeta profundo en relieve." +
      ORCHID_CARE,
    dimensions: "95 × 85 cm aprox.",
    materials: ORCHID_MATERIALS,
    images: imgs("orquidea-moteada", 5, 1),
  },
  {
    slug: "orquidea-blanca",
    name: "Orquídea blanca",
    year: 2026,
    category: "alfombra",
    alsoIn: ["tapiz"],
    price: 260000,
    availability: "a-pedido",
    short: "Alfombra orquídea blanca con nervaduras violetas.",
    description:
      "La versión más serena de la serie: pétalos blancos recorridos por nervaduras violetas finas, con el centro bordado en relieve." +
      ORCHID_CARE,
    dimensions: "95 × 85 cm aprox.",
    materials: ORCHID_MATERIALS,
    images: imgs("orquidea-blanca", 5, 1),
  },
  {
    slug: "orquidea-purpura",
    name: "Orquídea púrpura",
    year: 2026,
    category: "alfombra",
    alsoIn: ["tapiz"],
    price: 260000,
    availability: "a-pedido",
    short: "Alfombra orquídea púrpura de pétalos alargados.",
    description:
      "Orquídea de pétalos largos y puntiagudos en púrpura y lila, con manchas bordó y bordes crudos. La más gráfica de la colección." +
      ORCHID_CARE,
    dimensions: "100 × 80 cm aprox.",
    materials: ORCHID_MATERIALS,
    images: imgs("orquidea-purpura", 5, 1),
  },
  {
    slug: "orquidea-bordo",
    name: "Orquídea bordó",
    year: 2026,
    category: "alfombra",
    alsoIn: ["tapiz"],
    price: 260000,
    availability: "a-pedido",
    short: "Alfombra orquídea blanca con moteado y centro bordó.",
    description:
      "Pétalos blancos con moteado bordó denso y un centro oscuro en relieve. Combina muy bien con maderas y pisos claros." +
      ORCHID_CARE,
    dimensions: "95 × 85 cm aprox.",
    materials: ORCHID_MATERIALS,
    images: imgs("orquidea-bordo", 3, 1),
  },
  {
    slug: "orquidea-lila",
    name: "Orquídea lila",
    year: 2026,
    category: "alfombra",
    alsoIn: ["tapiz"],
    price: 260000,
    availability: "a-pedido",
    short: "Alfombra orquídea lila con manchas y centro bordó en relieve.",
    description:
      "Orquídea de pétalos redondeados en lila claro, con manchas oscuras y un labelo bordó que sobresale del plano." +
      ORCHID_CARE,
    dimensions: "95 × 85 cm aprox.",
    materials: ORCHID_MATERIALS,
    images: imgs("orquidea-lila", 5, 1),
  },
  {
    slug: "banco-musgo",
    name: "Banco Musgo",
    year: 2026,
    category: "objeto",
    price: 180000,
    availability: "a-pedido",
    short: "Banco de madera maciza con asiento de musgo tufteado.",
    description:
      "Banco de madera clara con asiento redondo tapizado en tufting que imita un cojín de musgo, con parches en distintos verdes y alturas de pelo. Cada asiento es único. Apto para interior y exterior cubierto.",
    dimensions: "Ø 35 cm · 45 cm de alto aprox.",
    materials: "Estructura de madera maciza; asiento de lana y fibras acrílicas tufteadas a mano.",
    images: imgs("banco-musgo", 5, 1),
  },
  {
    slug: "trio-bancos",
    name: "Trío de bancos Musgo",
    year: 2026,
    category: "objeto",
    price: 480000,
    availability: "a-pedido",
    short: "Juego de tres bancos Musgo con asientos en verdes distintos.",
    description:
      "Tres bancos Musgo pensados para convivir: mismos pies de madera, asientos con composiciones de musgo distintas. Ideal para living, galería o espacio de trabajo.",
    dimensions: "Cada banco Ø 35 cm · 45 cm de alto aprox.",
    materials: "Estructura de madera maciza; asientos de lana y fibras acrílicas tufteadas a mano.",
    images: imgs("trio-bancos", 5, 1),
  },

  // --- Catálogo anterior ---------------------------------------------------
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
    dimensions: "Ø 120 cm aprox.",
    materials: TUFTING,
    images: imgs("tapiz-pleopsidium-flavum", 4, 1),
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
  {
    slug: "hongos-trametes",
    name: "Tapiz Trametes Versicolor 1",
    year: 2025,
    category: "tapiz",
    price: 720000,
    availability: "unico",
    featured: true,
    short: "Colonia de hongos cola de pavo en anillos concéntricos.",
    description:
      "Serie de hongos Trametes versicolor superpuestos, con los anillos de crecimiento en gamas de ocre, tierra y gris. Una pieza mural de gran presencia que funciona tanto en pared clara como oscura.",
    dimensions: "180 × 80 cm aprox.",
    materials: TUFTING,
    images: imgs("hongos-trametes", 4, 4),
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
    images: imgs("trametes-versicolor-2", 4, 4),
    inStock: false,
  },
  {
    slug: "tapiz-verde",
    name: "Tapiz Verde",
    year: 2026,
    category: "tapiz",
    price: 890000,
    availability: "unico",
    short: "Cartografía de líquenes sobre corteza, gran formato.",
    description:
      "Mapa textil de líquenes y musgos sobre una corteza imaginaria. Más de veinte tonos de verde, texturas de bucle y pelo cortado y detalles bordados a mano. Se entrega montado sobre bastidor de madera.",
    dimensions: "200 × 160 cm aprox.",
    materials: TUFTING + " Montado sobre bastidor de madera.",
    images: imgs("tapiz-verde", 8, 1),
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
    slug: "tapiz-ocean",
    name: "Tapiz Ocean",
    year: 2026,
    category: "tapiz",
    price: 390000,
    availability: "a-pedido",
    featured: true,
    short: "Corrientes de azul, verde y tierra en formato horizontal.",
    description:
      "La pieza que da nombre al estudio: capas de azules profundos atravesadas por verdes y marrones, como la vista del mar desde arriba. Se produce a pedido en la medida que necesites.",
    dimensions: "150 × 90 cm aprox.",
    materials: TUFTING,
    images: ["/obras/ocean/portada-tapiz.jpg", "/obras/ocean/6.jpg"],
    inStock: false,
  },
  {
    slug: "botellas-ocean",
    name: "Botellas Ocean",
    year: 2026,
    category: "objeto",
    price: 95000,
    availability: "a-pedido",
    short: "Damajuanas de vidrio intervenidas con tufting.",
    description:
      "Objetos intervenidos: damajuanas recuperadas vestidas con fibras tufteadas en la paleta Ocean. Cada una es distinta. Precio por unidad.",
    dimensions: "35 a 45 cm de alto.",
    materials: "Vidrio recuperado, lana y fibras acrílicas tufteadas a mano.",
    images: [
      "/obras/ocean/portada-botella.jpg",
      "/obras/ocean/4.jpg",
      "/obras/ocean/2.jpg",
      "/obras/ocean/1.jpg",
      "/obras/ocean/3.jpg",
      "/obras/ocean/6.jpg",
    ],
  },
  {
    slug: "tapiz-corteza",
    name: "Tapiz Corteza",
    year: 2025,
    category: "tapiz",
    price: 410000,
    availability: "unico",
    featured: true,
    short: "Corteza de árbol con líquenes naranjas y musgo.",
    description:
      "Surcos verticales de corteza en tierras y grises, con brotes de liquen naranja y pequeños musgos bordados que sobresalen del plano.",
    dimensions: "110 × 95 cm aprox.",
    materials: TUFTING,
    images: imgs("tapiz-corteza", 4, 4, true),
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
  {
    slug: "cuadro-pleopsidium-flavum",
    name: "Cuadro Pleopsidium Flavum",
    year: 2023,
    category: "tapiz",
    price: 290000,
    availability: "unico",
    short: "Detalle de liquen enmarcado en madera clara.",
    description:
      "Fragmento de la serie Pleopsidium flavum trabajado como cuadro: el textil se monta sobre un marco de madera natural con la urdimbre a la vista.",
    dimensions: "70 × 50 cm con marco.",
    materials: "Textil tufteado sobre bastidor con marco de madera natural.",
    images: imgs("cuadro-pleopsidium-flavum", 2, 2),
  },
  {
    slug: "na-alehu",
    name: "Na' alehu",
    year: 2026,
    category: "alfombra",
    price: 320000,
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
    slug: "nido",
    name: "Nido",
    year: 2026,
    category: "objeto",
    price: 180000,
    availability: "unico",
    featured: true,
    short: "Objeto colgante tejido en verdes, para interior o exterior cubierto.",
    description:
      "Columna de formas orgánicas tejidas que se cuelga del techo y proyecta su propia sombra. Funciona sola o en grupos de distintas alturas.",
    dimensions: "160 cm de alto aprox.",
    materials: "Fibras acrílicas y sintéticas tejidas sobre estructura interna.",
    images: imgs("nido", 4, 1, true),
  },
  {
    slug: "primordio",
    name: "Primordio",
    year: 2025,
    category: "instalacion",
    price: 540000,
    availability: "unico",
    featured: true,
    short: "Cortina de cordones tejidos en amarillos y ocres.",
    description:
      "Decenas de cordones tejidos a mano cuelgan de una estructura superior formando una cortina que se mueve con el aire. Se puede instalar como separador de ambientes o pieza mural.",
    dimensions: "90 × 140 cm aprox.",
    materials: "Cordones de lana y fibras acrílicas tejidos a mano.",
    images: imgs("primordio", 5, 1, true),
  },
  {
    slug: "amazonicas",
    name: "Euryale Amazónica",
    year: 2024,
    category: "instalacion",
    price: null,
    availability: "a-pedido",
    featured: true,
    short: "Hojas de nenúfar gigante suspendidas del techo.",
    description:
      "Instalación de hojas de Victoria amazónica vistas desde abajo: nervaduras en verde lima sobre fondos violeta y borde rojo, con tallos trenzados que caen hasta el piso. Se adapta al espacio: cantidad de hojas, diámetros y alturas.",
    dimensions: "Hojas de 60 a 120 cm de diámetro.",
    materials: TUFTING + " Tallos de cordón trenzado y estructura liviana.",
    images: imgs("amazonicas", 8, 1, true),
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
    dimensions: "A medida del espacio.",
    materials: "Cordones de yute, lana y fibras tejidas a mano.",
    images: imgs("instalacion-ficus", 4, 1, true),
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
];

export const getProduct = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const featuredProducts = (): Product[] => products.filter((p) => p.featured);

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
  product.price !== null && product.availability !== "vendido";
