import type { Locale } from "@/i18n/config";
import type { Availability, Category, Product } from "@/data/products";

/**
 * Textos en inglés de cada obra. Si una obra nueva no está acá, en inglés se
 * muestra con los textos en español. `name` es opcional: si falta, queda el nombre original.
 */
type ProductText = Pick<Product, "short" | "description" | "materials"> &
  Partial<Pick<Product, "name" | "dimensions">>;

export const CATEGORY_LABEL_EN: Record<Category, string> = {
  tapiz: "Tapestry",
  alfombra: "Rug",
  instalacion: "Installation",
  objeto: "Object",
};

export const CATEGORY_PLURAL_EN: Record<Category, string> = {
  tapiz: "Tapestries",
  alfombra: "Rugs",
  instalacion: "Installations",
  objeto: "Objects",
};

export const AVAILABILITY_LABEL_EN: Record<Availability, string> = {
  unico: "One of a kind",
  "a-pedido": "Made to order",
  "en-proceso": "In progress",
  vendido: "Sold",
};

const TUFTING = "Wool and acrylic fibers hand-tufted on a backing cloth.";
const ORCHID_MATERIALS =
  "Wool and acrylic fibers hand-tufted on a backing cloth, with relief in different pile heights. Non-slip backing.";
const ORCHID_USE = " It can be used on the floor or hung on the wall.";
const BENCH_MATERIALS = "Eucalyptus wood; hand-tufted wool cover.";
const MODULAR_MATERIALS = "Wool and textile techniques over an internal structure.";
const EURYALE_MATERIALS = "Tufting, rope wrapping, rope, wool, metal support.";

export const productsEn: Record<string, ProductText> = {
  // --- Orchids ---------------------------------------------------------------
  "orquidea-moteada": {
    name: "Orchid I",
    short: "Lilac orchid rug with speckled petals and a violet center.",
    description:
      "The silhouette of a Phalaenopsis orchid: lilac petals speckled in cream and purple, with a deep violet lip in relief, worked at different heights. Tufting technique." +
      ORCHID_USE,
    materials: ORCHID_MATERIALS,
  },
  "orquidea-lila": {
    name: "Orchid II",
    short: "Lilac orchid rug with dark spots and a raised burgundy center.",
    description:
      "The silhouette of an orchid with rounded, pale lilac petals, dark spots and a burgundy lip that rises from the surface, worked at different heights. Tufting technique." +
      ORCHID_USE,
    materials: ORCHID_MATERIALS,
  },
  "orquidea-blanca": {
    name: "Orchid III",
    short: "White orchid rug with violet veins.",
    description:
      "The silhouette of an orchid with white petals crossed by fine violet veins, and a raised center worked at different heights. Tufting technique." +
      ORCHID_USE,
    materials: ORCHID_MATERIALS,
  },
  "orquidea-bordo": {
    name: "Orchid IV",
    short: "White orchid rug with burgundy speckles and center.",
    description:
      "The silhouette of an orchid with white petals densely speckled in burgundy and a dark raised center, worked at different heights. Tufting technique." +
      ORCHID_USE,
    materials: ORCHID_MATERIALS,
  },
  "orquidea-purpura": {
    name: "Orchid V",
    short: "Purple orchid rug with long petals.",
    description:
      "The silhouette of an orchid with long, pointed petals in purple and lilac, with burgundy spots and cream edges, worked at different heights. Tufting technique." +
      ORCHID_USE,
    materials: ORCHID_MATERIALS,
  },

  // --- Greens: moss, stools and lichens ---------------------------------------
  "verde-musgo": {
    name: "Moss Green",
    short: "Moss rug in greens, yellows and earth tones.",
    description:
      "A rug worked in different wool heights, evoking moss and the many shades of natural greens. Tufting technique.",
    materials: TUFTING,
  },
  "verde-musgo-2": {
    name: "Moss Green II",
    short: "Moss rug, the companion piece to Moss Green.",
    description:
      "A rug worked in different wool heights, evoking moss and the many shades of natural greens. Tufting technique.",
    materials: TUFTING,
  },
  "duo-verde-musgo": {
    name: "Moss Green Duo",
    short: "Moss Green and Moss Green II together, at a special price.",
    description:
      "The two Moss Green pieces, designed to go together: they meet in the middle and form a single blanket of moss in greens, yellows and earth tones.",
    dimensions: "Moss Green 1.22 × 0.67 m · Moss Green II 1.35 × 0.60 m",
    materials: TUFTING + " Wool dyed with yerba mate and natural dyes.",
  },
  "set-verde-musgo": {
    name: "Moss Green Set",
    short: "Moss pieces to arrange on the floor or wall.",
    description:
      "A set of free-form tufted moss pieces in greens and yellows that can be grouped or spread out to create your own composition.",
    dimensions: "Pieces of 0.55 × 0.26 m and 0.46 × 0.30 m",
    materials: TUFTING,
  },
  "duo-alfombras-verdes": {
    name: "Duo",
    short: "Pair of free-form moss rugs, for the wall or floor.",
    description:
      "Two pieces designed to live together: a dense moss rug and an openwork piece that lets the floor or wall show through. Made to order; sizes and tones can be adapted.",
    dimensions: "Each piece approx. 120 × 90 cm",
    materials: TUFTING + " Non-slip backing.",
  },
  "tapiz-verde": {
    name: "Lichen Cartography Tapestry",
    short: "A textile territory that works as a sensitive map of nature.",
    description:
      "This project grows out of the observation of tiny ecosystems and their ability to spread across different surfaces. It is a surface of record where the textile weave moves between the organic and the cartographic, proposing a textile territory that works as a sensitive map of nature.",
    materials: "Tufting, wool.",
  },
  "banco-musgo": {
    name: "Moss Stool I",
    short: "Eucalyptus wood stool with a tufted wool cover.",
    description:
      "Eucalyptus wood stool with a tufted wool cover that evokes a cushion of moss in different greens and heights. Each cover is unique.",
    materials: BENCH_MATERIALS,
  },
  "banco-musgo-2": {
    name: "Moss Stool II",
    short: "Eucalyptus stool with a round tufted cover in greens and yellow.",
    description:
      "Eucalyptus wood stool with a round tufted wool cover that evokes a cushion of moss, with a trail of bright yellow over greens. Each cover is unique.",
    materials: BENCH_MATERIALS,
  },
  "banco-musgo-3": {
    name: "Moss Stool III",
    short: "Eucalyptus stool with a square tufted cover in yellows and greens.",
    description:
      "Eucalyptus wood stool with a square tufted wool cover that evokes a cushion of moss in yellows and greens. Each cover is unique.",
    materials: BENCH_MATERIALS,
  },
  "trio-bancos": {
    name: "Moss Stool Trio",
    short: "Set of three Moss stools with seats in different greens.",
    description:
      "Three eucalyptus wood stools with tufted wool covers, each with a different moss composition. Ideal for a living room, gallery or workspace.",
    dimensions: "Each stool 0.44 × 0.30 m",
    materials: "Eucalyptus wood; hand-tufted wool covers.",
  },
  "lampara-tejida-verde": {
    name: "Green Woven Lamp",
    short: "Pendant lamp crocheted in green jute.",
    description:
      "Lamp hand-crocheted in jute. A collaboration with Vermel Estudio (@vermel_estudio).",
    dimensions: "60 cm tall · Ø 25 cm",
    materials: "Hand-crocheted jute.",
  },
  nido: {
    name: "Nest",
    short: "Hanging coiled object made with hand-dyed rope.",
    description:
      "A piece made with the coiling technique using hand-dyed rope. It hangs from the ceiling and casts its own shadow; it works alone or in groups at different heights.",
    dimensions: "Approx. 160 cm tall",
    materials: "Hand-dyed rope, coiling technique.",
  },

  // --- Modular bases ----------------------------------------------------------
  "base-modular-1": {
    name: "Modular Base I",
    short: "Two flowers with lilac petals on a base of twisting stems.",
    description:
      "Textile sculpture from the Imaginary Garden collection: two flowers with lilac petals and violet centers growing from a base of twisting green stems. The flowers were made by Vermel Estudio (@vermel_estudio).",
    materials: MODULAR_MATERIALS,
  },
  "base-modular-2": {
    name: "Modular Base II",
    short: "Flower with circular petals and a violet center, on a green stem and base.",
    description:
      "Textile sculpture from the Imaginary Garden collection: a flower with circular petals and a raised violet center, held up by a stem that coils into a green base. The flower was made by Vermel Estudio (@vermel_estudio).",
    materials: MODULAR_MATERIALS,
  },
  "base-modular-3": {
    name: "Modular Base III",
    short: "Flower with thin lilac petals and a raised violet center.",
    description:
      "Textile sculpture from the Imaginary Garden collection: a flower with long, thin lilac petals around a raised violet center, on a base of green stems. The flower was made by Vermel Estudio (@vermel_estudio).",
    materials: MODULAR_MATERIALS,
  },

  // --- Trametes versicolor and bark ------------------------------------------
  "hongos-trametes": {
    name: "Trametes Versicolor Tapestry 1",
    short: "A colony of turkey tail fungi in concentric rings.",
    description:
      "A series of overlapping Trametes versicolor fungi, with growth rings in ochre, earth and grey. A striking wall piece that works on both light and dark walls.",
    dimensions: "Approx. 180 × 80 cm",
    materials: TUFTING,
  },
  "trametes-versicolor-2": {
    name: "Trametes Versicolor Tapestry 2",
    short: "Turkey tail fungi tufted in wool, on a metal structure.",
    description: "A tufted wall piece that reproduces Trametes versicolor fungi and their growth rings.",
    dimensions: "1.90 × 0.43 m",
    materials: "Tufted wool on a metal structure.",
  },
  "instalacion-trametes-versicolor": {
    name: "Trametes Versicolor Installation",
    short: "A log with textile fungi in yellows and browns.",
    description:
      "A reclaimed log colonized by tufted fungi in yellow, brown and white rings. A sculptural floor piece.",
    dimensions: "Approx. 95 cm tall",
    materials: "Reclaimed wood, tufted wool and acrylic fibers.",
  },
  "tapiz-corteza": {
    name: "Bark Tapestry",
    short: "A tapestry that evokes tree bark, with copper wire details.",
    description:
      "A tufted tapestry in browns, ochre and cream that evokes tree bark. Hand-woven details in copper wire.",
    dimensions: "Approx. 110 × 95 cm",
    materials: TUFTING + " Hand-woven details in copper wire.",
  },

  // --- Na' alehu and Xanthoparmelia -------------------------------------------
  "na-alehu": {
    short: "Tufted rug in hand-dyed wool.",
    description:
      "A tufted rug made with hand-dyed wool. It was featured at Casa FOA Córdoba 2026, in the Flexible Apartment (Space 17) by Estudio Moraschi, winner of the Gold Medal.",
    dimensions: "2 × 1.80 m",
    materials: "Hand-dyed tufted wool.",
  },
  "lampara-tejida-cruda": {
    name: "Natural Woven Lamp",
    short: "Pendant lamp crocheted in natural jute.",
    description:
      "Lamp hand-crocheted in jute. A collaboration with Vermel Estudio (@vermel_estudio).",
    dimensions: "1.40 m tall · Ø 25 cm",
    materials: "Hand-crocheted jute.",
  },
  "liquen-xanthoparmelia": {
    name: "Xanthoparmelia Lichen Series",
    short: "Black and white lichen discs for exterior walls.",
    description:
      "A set of circular black and white pieces that reproduce Xanthoparmelia lichen on brick. They are installed directly on the wall, indoors or in covered outdoor areas. Priced according to quantity and sizes.",
    dimensions: "Pieces from 40 to 90 cm in diameter",
    materials: TUFTING + " Treated for covered outdoor use.",
  },

  // --- Euryale amazonica ------------------------------------------------------
  amazonicas: {
    name: "Euryale Amazonica",
    short: "Giant water lily leaf tapestry with raised veins.",
    description:
      "A tufted tapestry with veins made using a rope-wrapping technique, imitating the veins of the leaf.",
    materials: EURYALE_MATERIALS,
  },
  "euryale-amazonica-3": {
    name: "Euryale Amazonica 3",
    short: "Triptych of giant water lily leaves hanging from the ceiling.",
    description:
      "Three Victoria amazonica leaves seen from below: lime green veins over violet backgrounds with red edges, and braided stems that fall to the floor.",
    materials: EURYALE_MATERIALS,
  },

  // --- Yellow lichens ---------------------------------------------------------
  "tapiz-pleopsidium-flavum": {
    name: "Pleopsidium Flavum Tapestry",
    short: "Large-format yellow lichen with varying relief and density.",
    description:
      "A textile interpretation of Pleopsidium flavum, a lichen that grows on high mountain rocks. The tapestry uses different pile heights to create a relief that changes with the light. It hangs directly on the wall with a hidden system included.",
    materials: TUFTING,
  },
  "cuadro-pleopsidium-flavum": {
    name: "Pleopsidium Flavum Frame",
    short: "Lichen detail framed in light wood.",
    description:
      "A fragment of the Pleopsidium flavum series presented as a framed piece: the textile is mounted on a natural wood frame with the backing visible.",
    dimensions: "70 × 50 cm with frame",
    materials: "Tufted textile on a stretcher with a natural wood frame.",
  },
  "tapiz-xanthoria-parietina": {
    name: "Xanthoria Parietina Tapestry",
    short: "Golden lichen with reddish apothecia.",
    description:
      "Inspired by Xanthoria parietina, a lichen common on bark and rocks near the sea. Golden lobes with small reddish discs, in an irregular silhouette that stands out against the wall.",
    dimensions: "Approx. 95 × 90 cm",
    materials: TUFTING,
  },

  // --- Primordium and root installations --------------------------------------
  primordio: {
    name: "Primordium",
    short: "A curtain of woven cords in yellows and ochres.",
    description:
      "Dozens of hand-woven cords hang from an upper structure, forming a curtain that moves with the air. It can be installed as a room divider or as a wall piece.",
    materials: "Hand-woven wool and acrylic fiber cords.",
  },
  "instalacion-ficus": {
    name: "Ficus Macrophylla Installation",
    short: "Woven aerial roots falling from the ceiling.",
    description:
      "The roots of the Ficus macrophylla recreated with woven cords of different thicknesses, which descend from an upper structure and tangle on the floor. Designed for lobbies, shops and double-height spaces.",
    dimensions: "2.50 × 2.50 × 2.40 m",
    materials: "Wrapped wool, jute, silk straw, fleece and copper wire.",
  },
  "archivo-biologico": {
    name: "Biological Archive",
    short: "Biomaterials, grown roots and textile assembled with copper.",
    description:
      "A piece made with biomaterials, grown roots and textile assembled with copper. It was part of the exhibition “La materia del mundo”, curated by Leila Tschopp, at Fundación Cazadores (Buenos Aires, 2026). It was also featured in Estudio Moraschi's “Flexible Apartment · Space 17” at Casa FOA Córdoba, Pocito Social Life Edition (2026), which won the Gold Medal.",
    dimensions: "Variable dimensions: 1.10 × 0.60 m",
    materials: "Biomaterials, grown roots and textile assembled with copper.",
  },

  // --- Blues and pastels ------------------------------------------------------
  "tapiz-ocean": {
    name: "Ocean Tapestry",
    short: "Currents of blue, green and earth in a horizontal format.",
    description:
      "The piece that gives the studio its name: layers of deep blues crossed by greens and browns, like the sea seen from above. Made to order in the size you need.",
    dimensions: "Approx. 150 × 90 cm",
    materials: TUFTING,
  },
  "botellas-ocean": {
    name: "Ocean Bottles",
    short: "Glass demijohns dressed in tufting.",
    description:
      "Upcycled objects: reclaimed demijohns dressed in tufted fibers in the Ocean palette. Each one is different.",
    dimensions: "35 to 45 cm tall",
    materials: "Reclaimed glass, hand-tufted wool and acrylic fibers.",
  },
  alba: {
    short: "Rug with organic edges in sunrise tones.",
    description:
      "An everyday rug with irregular edges and stripes that recall the first colors of the day over the water. It combines cut pile with loop details and pompoms. Suitable for a living room or bedroom.",
    dimensions: "Approx. 140 × 100 cm",
    materials: TUFTING + " Non-slip backing.",
  },
};

/** "60 × 70 cm aprox." → números con punto decimal y "aprox." en inglés, para las medidas sin traducción propia. */
const dimensionsEn = (d: string): string =>
  d
    .replace(/(\d),(\d)/g, "$1.$2")
    .replace(/\s*aprox\.?/g, "")
    .replace(/\.$/, "");

/** La obra con sus textos en el idioma pedido (en español queda igual). */
export function localizeProduct(p: Product, locale: Locale): Product {
  if (locale !== "en") return p;
  const en = productsEn[p.slug];
  return {
    ...p,
    name: en?.name ?? p.name,
    short: en?.short ?? p.short,
    description: en?.description ?? p.description,
    materials: en?.materials ?? p.materials,
    dimensions: en?.dimensions ?? (p.dimensions && dimensionsEn(p.dimensions)),
  };
}
