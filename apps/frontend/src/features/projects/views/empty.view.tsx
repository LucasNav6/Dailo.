import { RiAddLine, RiFlowerFill } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { Emphasis } from "@/components/atoms/emphasis";
import { EmptyState } from "@/components/molecules/empty-state";
import { ProjectsHeader } from "../components/projects-header";

/** Sin proyectos todavía: invitación a crear el primero. */
export function ProjectsEmptyView() {
  return (
    <>
      <ProjectsHeader count={0} />
      <EmptyState
        className="py-8"
        icon={<RiFlowerFill aria-hidden />}
        title={<>Todavía no tenés <Emphasis>proyectos.</Emphasis></>}
        description="Creá el primero para agrupar tus tareas."
        action={
          <Button className="[&_svg]:size-5">
            <RiAddLine aria-hidden />
            Crear proyecto
          </Button>
        }
      />
    </>
  );
}
