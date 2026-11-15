import { Emphasis } from "@/components/atoms/emphasis";
import { Progress } from "@/components/atoms/progress";

type ProjectHeadingProps = { done: number; total: number; name?: string; description?: string };

/** Pone en cursiva las últimas palabras del nombre y cierra con punto: "Rediseño *del sitio.*". */
function NameTitle({ name }: { name: string }) {
  const words = name.trim().split(/\s+/);
  const split = words.length > 2 ? words.length - 2 : words.length > 1 ? words.length - 1 : 0;
  const head = words.slice(0, split).join(" ");
  const tail = words.slice(split).join(" ").replace(/[.!?]+$/, "");
  return <>{head && `${head} `}<Emphasis>{tail}.</Emphasis></>;
}

/** Encabezado del detalle de proyecto: eyebrow, título, descripción y progreso (`done` de `total`). */
export function ProjectHeading({ done, total, name = "Rediseño del sitio", description = "Lanzar la nueva web con el blog y el catálogo." }: ProjectHeadingProps) {
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold tracking-[0.06em] text-subtle uppercase">Proyecto</span>
      <h1 className="font-display text-[32px] leading-[1.08] font-semibold tracking-[-0.02em] break-words text-foreground">
        <NameTitle name={name} />
      </h1>
      {description && <span className="text-[15px] leading-normal text-muted-foreground">{description}</span>}
      <span className="mt-1.5 flex items-center gap-3 text-[13px] text-muted-foreground">
        {total === 0 ? "Sin tareas" : `${done} de ${total} hechas`}
        <Progress value={progress} className="h-1 w-24" aria-label="Progreso del proyecto" />
      </span>
    </div>
  );
}
