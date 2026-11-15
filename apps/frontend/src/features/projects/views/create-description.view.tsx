import { ComposeSheet } from "@/components/layouts/compose-sheet";
import { ProjectsHeader } from "../components/projects-header";

export function ProjectsCreateDescriptionView() {
  return (
    <>
      <ProjectsHeader count={0} />
      <ComposeSheet
        placeholder="Nombre del proyecto"
        value="Rediseño del sitio"
        description="Lanzar la nueva web con el blog y el catálogo."
        scope="Trabajo"
        canSave
      />
    </>
  );
}
