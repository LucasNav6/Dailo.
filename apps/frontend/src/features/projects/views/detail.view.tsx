import { DetailBar } from "@/components/molecules/detail-bar";
import { CollapseHeader } from "@/components/molecules/collapse-header";
import { TaskRow } from "@/components/molecules/task-row";
import { AddTask } from "../components/add-task";
import { DATES } from "../components/sections-preview";
import { ProjectHeading } from "../components/project-heading";
import { TaskDates, type TaskDatesProps } from "../components/task-dates";

const TASKS: { title: string; dates?: TaskDatesProps }[] = [
  { title: "Definir la estructura de páginas", dates: DATES.today },
  { title: "Escribir los textos de la home", dates: DATES.tomorrow },
  { title: "Elegir tipografías y colores" },
  { title: "Maquetar el catálogo", dates: DATES.overdue },
  { title: "Publicar el blog", dates: DATES.far },
];

export function ProjectsDetailView() {
  return (
    <>
      <DetailBar />
      <ProjectHeading done={3} total={8} />
      <ul className="mt-5 flex flex-col">
        {TASKS.map(({ title, dates }) => (
          <TaskRow key={title} title={title} className="py-2.5" subtitle={dates ? <TaskDates {...dates} /> : undefined} />
        ))}
      </ul>
      <AddTask />
      <CollapseHeader label="Completadas · 3" open={false} />
    </>
  );
}
