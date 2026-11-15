export type ProjectSummary = { name: string; description: string; pending: number; progress: number };

/** Proyectos de ejemplo del diseño. */
export const PROJECTS: ProjectSummary[] = [
  { name: "Balance 2025", description: "Juntar lo del monotributo", pending: 3, progress: 25 },
  { name: "Rediseño del sitio", description: "Landing y blog", pending: 5, progress: 40 },
  { name: "Casa", description: "Arreglos y compras", pending: 0, progress: 100 },
];

export const PROJECT_NAMES = PROJECTS.map((project) => project.name);
