import { Button } from "@/components/atoms/button";
import { Switch } from "@/components/atoms/switch";
import { DialogOverlay } from "@/components/layouts/overlay-layout";
import { ProjectNames } from "../components/project-names";
import { ProjectsHeader } from "../components/projects-header";
import { PROJECTS } from "../data";

export function ProjectsDeleteView() {
  return (
    <>
      <ProjectsHeader count={PROJECTS.length} />
      <ProjectNames />
      <DialogOverlay>
        <h2 className="font-display text-2xl leading-[1.15] font-semibold text-foreground">¿Eliminar “Rediseño del sitio”?</h2>
        <p className="text-[15px] leading-normal text-muted-foreground">
          Se eliminan el proyecto, sus 5 tareas pendientes, adjuntos y comentarios. No se puede deshacer.
        </p>
        <div className="flex items-center gap-3 py-2">
          <span className="flex-1 text-[15px] text-foreground">Mover las tareas pendientes al Inbox</span>
          <Switch checked aria-label="Mover las tareas pendientes al Inbox" />
        </div>
        <Button variant="danger">Eliminar proyecto</Button>
        <Button variant="ghost">Cancelar</Button>
      </DialogOverlay>
    </>
  );
}
