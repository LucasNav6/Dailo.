export type Scope = { letter: string; name: string; projects: string };

export const SCOPES: Scope[] = [
  { letter: "T", name: "Trabajo", projects: "4 proyectos" },
  { letter: "P", name: "Personal", projects: "2 proyectos" },
  { letter: "S", name: "Salud", projects: "1 proyecto" },
  { letter: "E", name: "Estudios", projects: "Sin proyectos" },
];

export type ArchivedProject = { name: string; meta: string };

export const ARCHIVED: ArchivedProject[] = [
  { name: "Landing de verano", meta: "Trabajo · archivado hace 2 semanas · 8 tareas" },
  { name: "Mudanza", meta: "Personal · archivado el 3 de octubre · 12 tareas" },
];
