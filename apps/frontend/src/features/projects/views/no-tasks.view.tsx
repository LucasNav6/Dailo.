import { RiAddLine } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { DetailBar } from "@/components/molecules/detail-bar";
import { ProjectHeading } from "../components/project-heading";

/** Proyecto recién creado, sin tareas. */
export function ProjectsNoTasksView() {
  return (
    <>
      <DetailBar />
      <ProjectHeading done={0} total={0} />
      <div className="mt-10 flex flex-col items-start gap-3">
        <p className="text-base leading-normal text-muted-foreground">Este proyecto todavía no tiene tareas. Añadí la primera para empezar.</p>
        <Button className="[&_svg]:size-5">
          <RiAddLine aria-hidden />
          Añadir tarea
        </Button>
      </div>
    </>
  );
}
