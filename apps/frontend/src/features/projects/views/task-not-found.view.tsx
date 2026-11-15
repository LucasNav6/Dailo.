import { RiArrowLeftLine, RiFileLine } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { Emphasis } from "@/components/atoms/emphasis";
import { IconButton } from "@/components/atoms/icon-button";
import { EmptyState } from "@/components/molecules/empty-state";

/** La tarea abierta ya no existe (borrada desde otra pestaña o dispositivo). */
export function ProjectsTaskNotFoundView() {
  return (
    <>
      <div className="-mx-3 -mt-2 mb-2 flex items-center justify-between">
        <IconButton aria-label="Volver" className="text-foreground">
          <RiArrowLeftLine aria-hidden />
        </IconButton>
        <span className="w-11" />
      </div>
      <EmptyState
        icon={<RiFileLine aria-hidden />}
        title={<>Esta tarea <Emphasis>ya no existe.</Emphasis></>}
        description="Pudo eliminarse desde otra pestaña o dispositivo. El resto de tus tareas sigue acá."
        descriptionClassName="max-w-[310px]"
        action={
          <>
            <Button>Ir a Hoy</Button>
            <Button variant="ghost" className="h-11 px-2">Volver al proyecto</Button>
          </>
        }
      />
    </>
  );
}
