import { SectionsPreview, SCOPE, type PreviewItem } from "../components/sections-preview";
import { RiAlignLeft, RiFolderLine } from "@remixicon/react";
import { Caret } from "@/components/atoms/caret";
import { IconButton } from "@/components/atoms/icon-button";
import { SheetOverlay } from "@/components/layouts/overlay-layout";

const ITEMS: PreviewItem[] = [
    SCOPE.task("Definir el alcance del proyecto"),
    SCOPE.header("Diseño", 3, true),
    SCOPE.task("Elegir tipografías y colores"),
    SCOPE.task("Maquetar el catálogo"),
    SCOPE.task("Diseñar la home"),
    { kind: "add" },
  ];

export function ProjectsTaskAddSectionView() {
  return (
    <>
      <SectionsPreview items={ITEMS} />
      <SheetOverlay className="gap-4 pb-6" handleClassName="mb-0">
        <div className="flex flex-col gap-1">
          <div className="flex min-h-[52px] items-center">
            <Caret className="mr-[3px] h-7" />
            <span className="text-[22px] text-muted-foreground">¿Qué hay que hacer?</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconButton aria-label="Añadir descripción" className="text-subtle">
              <RiAlignLeft aria-hidden />
            </IconButton>
            <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-selected px-3.5 text-sm font-semibold text-foreground [&_svg]:size-[18px]">
              <RiFolderLine aria-hidden />
              Diseño
            </span>
            <span className="flex-1" />
            <span className="inline-flex h-11 items-center px-2 text-[15px] font-semibold text-faint">Guardar</span>
          </div>
        </div>
      </SheetOverlay>
    </>
  );
}
