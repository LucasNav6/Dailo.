import { ComposeSheet } from "@/components/layouts/compose-sheet";
import { ProjectNames } from "../components/project-names";
import { ProjectsHeader } from "../components/projects-header";
import { PROJECTS } from "../data";

export function ProjectsDuplicateNameView() {
  return (
    <>
      <ProjectsHeader count={PROJECTS.length} />
      <ProjectNames />
      <ComposeSheet
        placeholder="Nombre del proyecto"
        value="Balance 2025"
        caretAfterValue
        error="Ya tenés un proyecto con ese nombre."
        scope="Trabajo"
        canSave={false}
      />
    </>
  );
}
