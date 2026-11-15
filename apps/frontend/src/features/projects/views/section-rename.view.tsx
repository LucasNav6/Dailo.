import { SectionsPreview, SCOPE, type PreviewItem } from "../components/sections-preview";
import { SectionSheetPreview } from "../components/section-sheet-preview";

const ITEMS: PreviewItem[] = [
    SCOPE.task("Definir el alcance del proyecto"),
    SCOPE.header("Diseño", 3, true),
    SCOPE.task("Elegir tipografías y colores"),
    SCOPE.task("Maquetar el catálogo"),
    SCOPE.task("Diseñar la home"),
    { kind: "add" },
    SCOPE.header("Contenido", 2, true),
    SCOPE.task("Escribir los textos de la home"),
    SCOPE.task("Preparar fotos de producto"),
    { kind: "add" },
  ];

export function ProjectsSectionRenameView() {
  return (
    <>
      <SectionsPreview items={ITEMS} />
      <SectionSheetPreview value="Diseño visual" canSave />
    </>
  );
}
