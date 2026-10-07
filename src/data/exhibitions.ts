export interface Exhibition {
  /** Año; `null` cuando no se conoce */
  year: number | null;
  venue: string;
  place: string;
  /** Título de la muestra o del espacio */
  title?: string;
  /** Tipo de participación */
  kind: string;
  /** Detalles adicionales (curaduría, estudio, etc.) */
  detail?: string;
  awards?: string[];
}

/** Ordenadas de la más reciente a la más antigua dentro de cada año. */
export const exhibitions: Exhibition[] = [
  {
    year: 2026,
    venue: "Feria Puro Diseño · La Rural",
    place: "Buenos Aires",
    kind: "Feria de diseño",
    detail: "Presentación de la colección Orquídeas y bancos",
  },
  {
    year: 2026,
    venue: "Fundación Cazadores",
    place: "Buenos Aires",
    title: "La materia del mundo",
    kind: "Muestra colectiva",
    detail: "Curada por Leila Tschopp",
  },
  {
    year: 2026,
    venue: "Casa FOA Córdoba · Edición Pocito Social Life",
    place: "Córdoba",
    title: "Departamento Flexible · Espacio 17",
    kind: "Obra en espacio de diseño",
    detail: "Estudio Moraschi",
    awards: ["Medalla de Oro"],
  },
  {
    year: 2026,
    venue: "Casa FOA Córdoba · Edición Pocito Social Life",
    place: "Córdoba",
    title: "Oasis Brutalista · Espacio 24",
    kind: "Obra en espacio de diseño",
    detail: "Estudio Zarzamora y Cler Studio",
    awards: [
      "Premio Atrim al mejor uso en tendencia del color",
      "Premio a la mejor incorporación de nuevos productos",
    ],
  },
  {
    year: 2026,
    venue: "Casa FOA Córdoba · Edición Pocito Social Life",
    place: "Córdoba",
    title: "Atelier Benito Fernández · Espacio 28",
    kind: "Obra en espacio de diseño",
    detail: "Estudio Ferrero",
    awards: ["Premio al mejor arte aplicado"],
  },
  {
    year: 2025,
    venue: "Museo de Bellas Artes",
    place: "Tandil",
    title: "Entramados",
    kind: "Muestra colectiva",
  },
  {
    year: 2025,
    venue: "Affordable Art Fair",
    place: "Viena, Austria",
    kind: "Muestra colectiva",
  },
  {
    year: 2025,
    venue: "Amar Arte Gallery",
    place: "Buenos Aires",
    title: "Relevancia",
    kind: "Muestra colectiva",
  },
  {
    year: 2025,
    venue: "Natural Bio Art Gallery",
    place: "Buenos Aires",
    title: "Memorias del Bosque",
    kind: "Muestra colectiva",
  },
  {
    year: 2024,
    venue: "Salón Nacional de Arte Textil · Bolsa de Comercio",
    place: "Buenos Aires",
    kind: "Muestra colectiva",
  },
  {
    year: 2024,
    venue: "Langhe",
    place: "Piamonte, Italia",
    title: "Della Patagonia alle Langhe",
    kind: "Muestra colectiva",
  },
  {
    year: 2024,
    venue: "Festival Amanita",
    place: "Buenos Aires",
    kind: "Intervención artística",
  },
  {
    year: 2024,
    venue: "Palacio Barolo",
    place: "Buenos Aires",
    kind: "Muestra colectiva",
  },
  {
    year: 2024,
    venue: "Natural Bio Art Gallery",
    place: "Buenos Aires",
    title: "Sol de mayo",
    kind: "Muestra colectiva",
  },
  {
    year: 2023,
    venue: "Asociación Estímulo de Bellas Artes",
    place: "Buenos Aires",
    title: "Bio inspiración",
    kind: "Muestra colectiva",
  },
  {
    year: null,
    venue: "Casa Sierra",
    place: "Córdoba",
    title: "Latidos de la tierra",
    kind: "Muestra colectiva",
  },
];

/** Agrupa por año, de más reciente a más antiguo; las sin año van al final. */
export function exhibitionsByYear(): { year: number | null; items: Exhibition[] }[] {
  const map = new Map<number | null, Exhibition[]>();
  for (const e of exhibitions) {
    map.set(e.year, [...(map.get(e.year) ?? []), e]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => {
      if (a === null) return 1;
      if (b === null) return -1;
      return b - a;
    })
    .map(([year, items]) => ({ year, items }));
}

export const awardCount = exhibitions.reduce((n, e) => n + (e.awards?.length ?? 0), 0);
