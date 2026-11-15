import { SectionsPreview, SCOPE, type PreviewItem } from "../components/sections-preview";

const ITEMS: PreviewItem[] = [
    SCOPE.task("Definir el alcance del proyecto", { dim: true }),
    SCOPE.header("Diseño", 3, true, { dim: true }),
    SCOPE.task("Elegir tipografías y colores", { dim: true }),
    SCOPE.task("Diseñar la home", { dim: true }),
    { kind: "indicator" },
    SCOPE.task("Maquetar el catálogo", { dragging: true }),
    SCOPE.header("Contenido", 2, true, { dim: true }),
    SCOPE.task("Escribir los textos de la home", { dim: true }),
    SCOPE.task("Preparar fotos de producto", { dim: true }),
  ];

export function ProjectsReorderTaskView() {
  return <SectionsPreview items={ITEMS} />;
}
