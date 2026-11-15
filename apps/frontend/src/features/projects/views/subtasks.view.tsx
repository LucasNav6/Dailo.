import { CollapseHeader } from "@/components/molecules/collapse-header";
import { DetailBar } from "@/components/molecules/detail-bar";
import { SubtaskRow } from "@/components/molecules/subtask-row";
import { TaskRow } from "@/components/molecules/task-row";
import { AddTask } from "../components/add-task";
import { ProjectHeading } from "../components/project-heading";
import { SubtaskToggle } from "../components/subtask-toggle";

/** Detalle de proyecto con una tarea expandida que muestra sus subtareas. */
export function ProjectsSubtasksView() {
  return (
    <>
      <DetailBar />
      <ProjectHeading done={3} total={8} />
      <ul className="mt-5 flex flex-col">
        <TaskRow title="Definir la estructura de páginas" className="py-2.5" />
        <TaskRow title="Escribir los textos de la home" className="py-2.5" meta={<SubtaskToggle count="2/4" open />} />
        <SubtaskRow title="Título y subtítulo del hero" checked />
        <SubtaskRow title="Sección “Sobre nosotros”" checked />
        <SubtaskRow title="Llamado a la acción" />
        <SubtaskRow title="Preguntas frecuentes" />
        <TaskRow title="Elegir tipografías y colores" className="py-2.5" />
        <TaskRow title="Maquetar el catálogo" className="py-2.5" meta={<SubtaskToggle count="0/3" open={false} />} />
        <TaskRow title="Publicar el blog" className="py-2.5" />
      </ul>
      <AddTask />
      <CollapseHeader label="Completadas · 3" open={false} />
    </>
  );
}
