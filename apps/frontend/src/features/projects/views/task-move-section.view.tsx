import { SectionsPreview, SCOPE, type PreviewItem } from "../components/sections-preview";
import { RiAddLine, RiCheckboxBlankCircleLine, RiRadioButtonLine } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { SheetOverlay } from "@/components/layouts/overlay-layout";
import { SheetHeading } from "@/components/molecules/sheet-heading";

const ITEMS: PreviewItem[] = [
    SCOPE.task("Definir el alcance del proyecto"),
    SCOPE.header("Diseño", 3, true),
    SCOPE.task("Elegir tipografías y colores"),
    SCOPE.task("Maquetar el catálogo"),
    SCOPE.task("Diseñar la home"),
    { kind: "add" },
  ];

function Choice({ name, selected }: { name: string; selected?: boolean }) {
  const Icon = selected ? RiRadioButtonLine : RiCheckboxBlankCircleLine;
  return (
    <div className="flex min-h-14 items-center gap-4">
      <span className={`inline-flex [&_svg]:size-[22px] ${selected ? "text-foreground" : "text-muted-foreground"}`}>
        <Icon aria-hidden />
      </span>
      <span className="text-[17px] text-foreground">{name}</span>
    </div>
  );
}

export function ProjectsTaskMoveSectionView() {
  return (
    <>
      <SectionsPreview items={ITEMS} />
      <SheetOverlay className="gap-1 pb-6">
        <SheetHeading title="Mover a una sección" subtitle="Maquetar el catálogo" />
        <Choice name="Sin sección" />
        <Choice name="Diseño" selected />
        <Choice name="Contenido" />
        <Choice name="Desarrollo" />
        <span className="mt-1 inline-flex h-11 items-center gap-[15px] self-start pl-[5px] text-[15px] font-semibold text-foreground">
          <RiAddLine className="size-[22px]" aria-hidden />
          Nueva sección
        </span>
        <div className="mt-2 flex justify-end">
          <Button>Mover</Button>
        </div>
      </SheetOverlay>
    </>
  );
}
