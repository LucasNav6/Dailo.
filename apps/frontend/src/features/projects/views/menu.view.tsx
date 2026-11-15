import { RiArchiveLine, RiDeleteBinLine, RiFolderLine, RiPencilLine } from "@remixicon/react";
import { SheetOverlay } from "@/components/layouts/overlay-layout";
import { ActionRow } from "@/components/molecules/action-row";
import { DetailBar } from "@/components/molecules/detail-bar";
import { SheetHeading } from "@/components/molecules/sheet-heading";
import { TaskRow } from "@/components/molecules/task-row";
import { AddTask } from "../components/add-task";
import { ProjectHeading } from "../components/project-heading";

/** Menú "Más opciones" desde el detalle del proyecto. */
export function ProjectsMenuView() {
  return (
    <>
      <DetailBar />
      <ProjectHeading done={3} total={8} />
      <ul className="mt-3 flex flex-col">
        <TaskRow title="Maquetar el catálogo" className="py-2.5" />
        <TaskRow title="Publicar el blog" className="py-2.5" />
      </ul>
      <AddTask />
      <SheetOverlay className="gap-1 pb-6">
        <SheetHeading title="Rediseño del sitio" subtitle="Trabajo · 5 pendientes" />
        <ActionRow icon={<RiPencilLine aria-hidden />}>Editar proyecto</ActionRow>
        <ActionRow icon={<RiFolderLine aria-hidden />}>Cambiar de ámbito</ActionRow>
        <ActionRow icon={<RiArchiveLine aria-hidden />}>Archivar</ActionRow>
        <div className="my-1 h-px bg-border" />
        <ActionRow icon={<RiDeleteBinLine aria-hidden />} tone="danger-soft">Eliminar proyecto</ActionRow>
      </SheetOverlay>
    </>
  );
}
