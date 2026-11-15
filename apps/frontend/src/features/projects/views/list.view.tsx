import { ProjectList } from "../components/project-list";
import { ProjectsHeader } from "../components/projects-header";
import { PROJECTS } from "../data";

export function ProjectsListView() {
  return (
    <>
      <ProjectsHeader count={PROJECTS.length} />
      <ProjectList />
    </>
  );
}
