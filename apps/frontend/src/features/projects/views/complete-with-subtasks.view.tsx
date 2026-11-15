import { Button } from "@/components/atoms/button";
import { DialogOverlay } from "@/components/layouts/overlay-layout";
import { DetailBar } from "@/components/molecules/detail-bar";
import { SubtaskRow } from "@/components/molecules/subtask-row";
import { TaskRow } from "@/components/molecules/task-row";
import { AddTask } from "../components/add-task";
import { ProjectHeading } from "../components/project-heading";

export function ProjectsCompleteWithSubtasksView() {
  return (
    <>
      <DetailBar />
      <ProjectHeading done={3} total={8} />
      <ul className="mt-3 flex flex-col">
        <TaskRow title="Escribir los textos de la home" className="py-2.5" meta={<span className="text-[13px] text-muted-foreground">2/4</span>} />
        <SubtaskRow title="Título y subtítulo del hero" checked large />
        <SubtaskRow title="Sección “Sobre nosotros”" checked large />
        <SubtaskRow title="Llamado a la acción" large />
        <SubtaskRow title="Preguntas frecuentes" large />
        <TaskRow title="Maquetar el catálogo" className="py-2.5" />
      </ul>
      <AddTask />
      <DialogOverlay>
        <h2 className="font-display text-2xl leading-[1.15] font-semibold text-foreground">Quedan 2 subtareas sin hacer</h2>
        <p className="text-[15px] leading-normal text-muted-foreground">¿Querés completarlas junto con “Escribir los textos de la home”?</p>
        <Button>Completar todo</Button>
        <Button variant="ghost" className="h-11 px-2">Solo la tarea</Button>
        <Button variant="ghost" className="h-11 px-2 text-muted-foreground">Cancelar</Button>
      </DialogOverlay>
    </>
  );
}
