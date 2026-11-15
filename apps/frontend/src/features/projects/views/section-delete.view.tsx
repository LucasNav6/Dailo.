import { SectionsPreview, SCOPE, type PreviewItem } from "../components/sections-preview";
import { RiCheckboxBlankCircleLine, RiRadioButtonLine } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { DialogOverlay } from "@/components/layouts/overlay-layout";

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

function Option({ selected, title, note }: { selected?: boolean; title: string; note: string }) {
  const Icon = selected ? RiRadioButtonLine : RiCheckboxBlankCircleLine;
  return (
    <div className="flex min-h-14 items-center gap-4">
      <span className={`inline-flex [&_svg]:size-[22px] ${selected ? "text-foreground" : "text-muted-foreground"}`}>
        <Icon aria-hidden />
      </span>
      <span className="flex flex-1 flex-col gap-px">
        <span className="text-[17px] text-foreground">{title}</span>
        <span className="text-sm text-muted-foreground">{note}</span>
      </span>
    </div>
  );
}

export function ProjectsSectionDeleteView() {
  return (
    <>
      <SectionsPreview items={ITEMS} />
      <DialogOverlay>
        <h2 className="font-display text-2xl leading-[1.15] font-semibold text-foreground">¿Eliminar la sección “Diseño”?</h2>
        <p className="text-[15px] leading-normal text-muted-foreground">La sección se elimina. Elegí qué pasa con sus tareas.</p>
        <Option selected title="Mover las tareas a “Sin sección”" note="Se conservan en el proyecto" />
        <Option title="Eliminar también las 3 tareas" note="No se puede deshacer" />
        <Button variant="danger">Eliminar sección</Button>
        <Button variant="ghost" className="h-11 px-2">Cancelar</Button>
      </DialogOverlay>
    </>
  );
}
