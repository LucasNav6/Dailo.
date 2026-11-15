import { CollapseHeader } from "@/components/molecules/collapse-header";
import { DetailBar } from "@/components/molecules/detail-bar";
import { TaskRow } from "@/components/molecules/task-row";
import { AddTask } from "../components/add-task";
import { ProjectHeading } from "../components/project-heading";

const DONE = [
  { title: "Definir estructura de páginas", when: "ayer" },
  { title: "Elegir tipografías y colores", when: "ayer" },
  { title: "Armar el brief", when: "lun 9" },
];

export function ProjectsCompletedView() {
  return (
    <>
      <DetailBar />
      <ProjectHeading done={3} total={8} />
      <ul className="mt-3 flex flex-col">
        <TaskRow title="Maquetar el catálogo" className="py-2.5" />
        <TaskRow title="Publicar el blog" className="py-2.5" />
      </ul>
      <AddTask />
      <CollapseHeader label="Completadas · 3" open />
      <ul className="flex flex-col">
        {DONE.map((task) => (
          <TaskRow key={task.title} title={task.title} checked className="py-2.5" time={task.when} />
        ))}
      </ul>
    </>
  );
}
