import { SectionsPreview, SCOPE, type PreviewItem } from "../components/sections-preview";

const ITEMS: PreviewItem[] = [
    SCOPE.task("Definir el alcance del proyecto"),
    SCOPE.header("Diseño", 3, true),
    SCOPE.task("Elegir tipografías y colores"),
    SCOPE.task("Maquetar el catálogo"),
    SCOPE.task("Diseñar la home"),
    { kind: "add" },
    SCOPE.header("Contenido", 0, true),
    { kind: "note" },
    { kind: "add" },
    { kind: "new" },
  ];

export function ProjectsSectionEmptyView() {
  return <SectionsPreview items={ITEMS} />;
}
