import { RiAddLine, RiMore2Line } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { IconButton } from "@/components/atoms/icon-button";
import { Progress } from "@/components/atoms/progress";
import { cn } from "@/lib/utils";
import { PROJECTS, type ProjectSummary } from "../data";

type ProjectListProps = {
  projects?: ProjectSummary[];
  highlighted?: number;
  onCreate?: () => void;
  onOpen?: (index: number) => void;
  onMore?: (index: number) => void;
};

export function ProjectList({ projects = PROJECTS, highlighted, onCreate, onOpen, onMore }: ProjectListProps) {
  return (
    <>
      <Button variant="ghost" onClick={onCreate} className="-mt-2 mb-2 -ml-3 h-10 gap-1.5 self-start px-3 text-sm hover:bg-transparent [&_svg]:size-[18px]">
        <RiAddLine aria-hidden />
        Nuevo proyecto
      </Button>
      <ul className="flex flex-col">
        {projects.map((project, index) => {
          const active = highlighted === index;
          return (
            <li
              key={project.id ?? project.name}
              className={cn("flex list-none items-center gap-1 py-3", active ? "-mx-3 rounded-2xl bg-selected px-3" : "border-b border-border")}
            >
              <Row onOpen={onOpen ? () => onOpen(index) : undefined}>
                <span className="text-[17px] font-medium">{project.name}</span>
                {project.description ? <span className="line-clamp-2 text-sm text-muted-foreground">{project.description}</span> : null}
                <span className="flex items-center gap-3 text-[13px] text-muted-foreground">
                  {project.pending === 0 ? "Sin pendientes" : `${project.pending} pendientes`}
                  <Progress value={project.progress} className={cn("h-1 w-24", active && "bg-card")} aria-label={`Progreso de ${project.name}`} />
                  <span>{project.progress} %</span>
                </span>
              </Row>
              <IconButton aria-label={`Más opciones de ${project.name}`} onClick={onMore ? () => onMore(index) : undefined}>
                <RiMore2Line aria-hidden />
              </IconButton>
            </li>
          );
        })}
      </ul>
    </>
  );
}

const rowClass = "flex min-w-0 flex-1 flex-col gap-1 text-left";

function Row({ onOpen, children }: { onOpen?: () => void; children: React.ReactNode }) {
  return onOpen ? (
    <button type="button" onClick={onOpen} className={cn(rowClass, "rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50")}>
      {children}
    </button>
  ) : (
    <div className={rowClass}>{children}</div>
  );
}
