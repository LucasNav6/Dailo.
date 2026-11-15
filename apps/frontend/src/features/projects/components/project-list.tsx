import { RiAddLine, RiMore2Line } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { IconButton } from "@/components/atoms/icon-button";
import { Progress } from "@/components/atoms/progress";
import { cn } from "@/lib/utils";
import { PROJECTS } from "../data";

/** Botón "Nuevo proyecto" y la lista con descripción y progreso; `highlighted` marca la fila con el menú abierto. */
export function ProjectList({ highlighted }: { highlighted?: number }) {
  return (
    <>
      <Button variant="ghost" className="-mt-2 mb-2 -ml-3 h-10 gap-1.5 self-start px-3 text-sm hover:bg-transparent [&_svg]:size-[18px]">
        <RiAddLine aria-hidden />
        Nuevo proyecto
      </Button>
      <ul className="flex flex-col">
        {PROJECTS.map((project, index) => {
          const active = highlighted === index;
          return (
            <li
              key={project.name}
              className={cn("flex list-none items-center gap-1 py-3", active ? "-mx-3 rounded-2xl bg-selected px-3" : "border-b border-border")}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-[17px] font-medium">{project.name}</span>
                <span className="text-sm text-muted-foreground">{project.description}</span>
                <span className="flex items-center gap-3 text-[13px] text-muted-foreground">
                  {project.pending === 0 ? "Sin pendientes" : `${project.pending} pendientes`}
                  <Progress value={project.progress} className={cn("h-1 w-24", active && "bg-card")} aria-label={`Progreso de ${project.name}`} />
                  <span>{project.progress} %</span>
                </span>
              </div>
              <IconButton aria-label={`Más opciones de ${project.name}`}>
                <RiMore2Line aria-hidden />
              </IconButton>
            </li>
          );
        })}
      </ul>
    </>
  );
}
