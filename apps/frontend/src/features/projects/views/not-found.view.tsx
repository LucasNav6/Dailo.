import { RiArrowLeftLine, RiFolderLine } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { Emphasis } from "@/components/atoms/emphasis";
import { IconButton } from "@/components/atoms/icon-button";
import { EmptyState } from "@/components/molecules/empty-state";

/** El proyecto abierto ya no existe (borrado desde otra pestaña o dispositivo). */
export function ProjectsNotFoundView() {
  return (
    <>
      <div className="-mx-3 -mt-2 flex">
        <IconButton aria-label="Volver" className="text-foreground">
          <RiArrowLeftLine aria-hidden />
        </IconButton>
      </div>
      <EmptyState
        icon={<RiFolderLine aria-hidden />}
        title={<>Este proyecto <Emphasis>ya no existe.</Emphasis></>}
        description="Pudo eliminarse desde otra pestaña o dispositivo. Tus otros proyectos siguen acá."
        action={<Button>Ir a proyectos</Button>}
      />
    </>
  );
}
