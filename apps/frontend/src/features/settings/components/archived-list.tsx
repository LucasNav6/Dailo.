import { Button } from "@/components/atoms/button";
import type { ArchivedProject } from "../data";

export function ArchivedList({ projects }: { projects: ArchivedProject[] }) {
  return (
    <ul className="mt-3 flex flex-col">
      {projects.map((project) => (
        <li key={project.name} className="flex list-none flex-col gap-0.5 border-b border-border py-3">
          <span className="text-[17px] font-medium">{project.name}</span>
          <span className="text-sm text-muted-foreground">{project.meta}</span>
          <span className="mt-0.5 flex gap-5">
            <Button variant="ghost" className="h-10 px-2">Restaurar</Button>
            <Button variant="ghost" className="h-10 px-2 text-danger-foreground">Eliminar</Button>
          </span>
        </li>
      ))}
    </ul>
  );
}
