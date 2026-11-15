import { Emphasis } from "@/components/atoms/emphasis";
import { Progress } from "@/components/atoms/progress";

/** Encabezado del detalle de proyecto: ámbito, título, descripción y progreso (`done` de `total`). */
export function ProjectHeading({ done, total }: { done: number; total: number }) {
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold tracking-[0.06em] text-subtle uppercase">Proyecto · Trabajo</span>
      <h1 className="font-display text-[32px] leading-[1.08] font-semibold tracking-[-0.02em] text-foreground">
        Rediseño <Emphasis>del sitio.</Emphasis>
      </h1>
      <span className="text-[15px] leading-normal text-muted-foreground">Lanzar la nueva web con el blog y el catálogo.</span>
      <span className="mt-1.5 flex items-center gap-3 text-[13px] text-muted-foreground">
        {total === 0 ? "Sin tareas" : `${done} de ${total} hechas`}
        <Progress value={progress} className="h-1 w-24" aria-label="Progreso del proyecto" />
      </span>
    </div>
  );
}
