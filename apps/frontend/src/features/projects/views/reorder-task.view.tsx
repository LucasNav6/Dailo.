import { DATES, SectionsPreview, SCOPE, type PreviewItem } from "../components/sections-preview";

const ITEMS: PreviewItem[] = [
    SCOPE.task("Definir el alcance del proyecto", { dim: true, dates: DATES.today }),
    SCOPE.header("Diseño", 3, true, { dim: true }),
    SCOPE.task("Elegir tipografías y colores", { dim: true, dates: DATES.tomorrow }),
    SCOPE.task("Diseñar la home", { dim: true, dates: DATES.wed }),
    { kind: "indicator" },
    SCOPE.task("Maquetar el catálogo", { dragging: true, dates: DATES.overdue }),
    SCOPE.header("Contenido", 2, true, { dim: true }),
    SCOPE.task("Escribir los textos de la home", { dim: true, dates: DATES.far }),
    SCOPE.task("Preparar fotos de producto", { dim: true }),
  ];

export function ProjectsReorderTaskView() {
  return <SectionsPreview items={ITEMS} />;
}
