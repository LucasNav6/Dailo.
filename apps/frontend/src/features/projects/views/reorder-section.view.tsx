import { SectionsPreview, SCOPE, type PreviewItem } from "../components/sections-preview";

const ITEMS: PreviewItem[] = [
    SCOPE.task("Definir el alcance del proyecto", { dim: true }),
    SCOPE.header("Diseño", 3, false, { dim: true }),
    { kind: "indicator" },
    SCOPE.header("Desarrollo", 4, false, { dragging: true }),
    SCOPE.header("Contenido", 2, false, { dim: true }),
  ];

export function ProjectsReorderSectionView() {
  return <SectionsPreview items={ITEMS} />;
}
