import { ComposeSheet } from "@/components/layouts/compose-sheet";
import { ProjectsHeader } from "../components/projects-header";

export function ProjectsCreateView() {
  return (
    <>
      <ProjectsHeader count={0} />
      <ComposeSheet placeholder="Nombre del proyecto" scope="Trabajo" canSave={false} />
    </>
  );
}
