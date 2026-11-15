import { DetailBar } from "@/components/molecules/detail-bar";
import { CollapseHeader } from "@/components/molecules/collapse-header";
import { TaskRow } from "@/components/molecules/task-row";
import { AddTask } from "../components/add-task";
import { ProjectHeading } from "../components/project-heading";

const TASKS = ["Definir la estructura de páginas", "Escribir los textos de la home", "Elegir tipografías y colores", "Maquetar el catálogo", "Publicar el blog"];

export function ProjectsDetailView() {
  return (
    <>
      <DetailBar />
      <ProjectHeading done={3} total={8} />
      <ul className="mt-5 flex flex-col">
        {TASKS.map((title) => (
          <TaskRow key={title} title={title} className="py-2.5" />
        ))}
      </ul>
      <AddTask />
      <CollapseHeader label="Completadas · 3" open={false} />
    </>
  );
}
