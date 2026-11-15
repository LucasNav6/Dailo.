import { SectionsPreview, SCOPE, type PreviewItem } from "../components/sections-preview";

const ITEMS: PreviewItem[] = [
    SCOPE.task("Definir el alcance del proyecto"),
    SCOPE.header("Diseño", 3, false),
    SCOPE.header("Contenido", 2, false),
    SCOPE.header("Desarrollo", 4, false),
    { kind: "new" },
  ];

export function ProjectsSectionsCollapsedView() {
  return <SectionsPreview items={ITEMS} />;
}
