import { RiAddLine } from "@remixicon/react";
import { SheetOverlay } from "@/components/layouts/overlay-layout";
import { ChoiceRow } from "@/components/molecules/choice-row";
import { InlineAction } from "@/components/molecules/inline-action";
import { SheetHeading } from "@/components/molecules/sheet-heading";
import { ProjectNames } from "../components/project-names";
import { ProjectsHeader } from "../components/projects-header";
import { PROJECTS } from "../data";

export function ProjectsScopeSheetView() {
  return (
    <>
      <ProjectsHeader count={PROJECTS.length} />
      <ProjectNames />
      <SheetOverlay className="gap-1 pb-6">
        <SheetHeading title="Ámbito" subtitle="Se elige al crear el proyecto" />
        <ChoiceRow title="Trabajo" selected />
        <ChoiceRow title="Personal" />
        <ChoiceRow title="Salud" />
        <ChoiceRow title="Estudios" />
        <ChoiceRow title="Sin ámbito" />
        <InlineAction icon={<RiAddLine aria-hidden />}>Nuevo ámbito</InlineAction>
      </SheetOverlay>
    </>
  );
}
