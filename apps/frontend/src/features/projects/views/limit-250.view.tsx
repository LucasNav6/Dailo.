import { ComposeSheet } from "@/components/layouts/compose-sheet";
import { ProjectNames } from "../components/project-names";
import { ProjectsHeader } from "../components/projects-header";
import { PROJECTS } from "../data";

export function ProjectsLimit250View() {
  return (
    <>
      <ProjectsHeader count={PROJECTS.length} />
      <ProjectNames />
      <ComposeSheet
        placeholder="Nombre del proyecto"
        value="Rediseño del sitio"
        description="Lanzar la nueva web con el blog y el catálogo de productos, definir la estructura de páginas, escribir los textos de cada sección, elegir tipografías y colores, maquetar todo el catálogo y publicar el blog antes de fin de año para empezar la campaña "
        counter="250/250"
        scope="Trabajo"
        canSave
      />
    </>
  );
}
