import { DATES, SectionsPreview, SCOPE, type PreviewItem } from "../components/sections-preview";

const ITEMS: PreviewItem[] = [
    SCOPE.task("Definir el alcance del proyecto", { dates: DATES.today }),
    SCOPE.header("Diseño", 3, true),
    SCOPE.task("Elegir tipografías y colores", { dates: DATES.tomorrow }),
    SCOPE.task("Maquetar el catálogo", { dates: DATES.overdue }),
    SCOPE.task("Diseñar la home", { dates: DATES.wed }),
    { kind: "add" },
    SCOPE.header("Contenido", 2, true),
    SCOPE.task("Escribir los textos de la home", { dates: DATES.far }),
    SCOPE.task("Preparar fotos de producto"),
    { kind: "add" },
    SCOPE.header("Desarrollo", 4, false),
    { kind: "new" },
  ];

export function ProjectsSectionsView() {
  return <SectionsPreview items={ITEMS} />;
}
