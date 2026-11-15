import { SectionsPreview, SCOPE, type PreviewItem } from "../components/sections-preview";
import { RiAddLine, RiArrowUpSLine, RiDeleteBinLine, RiPencilLine } from "@remixicon/react";
import { SheetOverlay } from "@/components/layouts/overlay-layout";
import { ActionRow } from "@/components/molecules/action-row";
import { SheetHeading } from "@/components/molecules/sheet-heading";

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

export function ProjectsSectionOptionsView() {
  return (
    <>
      <SectionsPreview items={ITEMS} />
      <SheetOverlay className="gap-1 pb-6">
        <SheetHeading title="Diseño" subtitle="Sección · 3 tareas pendientes" />
        <ActionRow icon={<RiPencilLine aria-hidden />}>Renombrar</ActionRow>
        <ActionRow icon={<RiAddLine aria-hidden />}>Añadir tarea</ActionRow>
        <ActionRow icon={<RiArrowUpSLine aria-hidden />}>Plegar</ActionRow>
        <div className="my-1 h-px bg-border" />
        <ActionRow icon={<RiDeleteBinLine aria-hidden />} tone="danger-soft">Eliminar sección</ActionRow>
      </SheetOverlay>
    </>
  );
}
