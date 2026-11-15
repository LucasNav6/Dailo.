import { ProjectList } from "../components/project-list";
import { ProjectsHeader } from "../components/projects-header";
import { PROJECTS } from "../data";

/** Lista de proyectos con descripción y progreso. */
export function ProjectsListView() {
  return (
    <>
      <ProjectsHeader count={PROJECTS.length} />
      <ProjectList />
    </>
  );
}
