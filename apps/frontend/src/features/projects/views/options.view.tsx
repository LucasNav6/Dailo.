import { RiAddLine, RiArchiveLine, RiDeleteBinLine, RiFolderLine, RiPencilLine } from "@remixicon/react";
import { SheetOverlay } from "@/components/layouts/overlay-layout";
import { ActionRow } from "@/components/molecules/action-row";
import { SheetHeading } from "@/components/molecules/sheet-heading";
import { ProjectList } from "../components/project-list";
import { ProjectsHeader } from "../components/projects-header";
import { PROJECTS } from "../data";

/** Menú de opciones de un proyecto de la lista. */
export function ProjectsOptionsView() {
  return (
    <>
      <ProjectsHeader count={PROJECTS.length} />
      <ProjectList highlighted={1} />
      <SheetOverlay className="gap-2 pb-7">
        <SheetHeading eyebrow="Proyecto" title="Rediseño del sitio" />
        <ActionRow icon={<RiPencilLine aria-hidden />}>Editar proyecto</ActionRow>
        <ActionRow icon={<RiAddLine aria-hidden />}>Añadir tarea</ActionRow>
        <ActionRow icon={<RiFolderLine aria-hidden />}>Cambiar de área</ActionRow>
        <ActionRow icon={<RiArchiveLine aria-hidden />}>Archivar</ActionRow>
        <div className="my-1 h-px bg-border" />
        <ActionRow icon={<RiDeleteBinLine aria-hidden />} tone="danger">Eliminar proyecto</ActionRow>
      </SheetOverlay>
    </>
  );
}
