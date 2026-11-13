import { useState } from "react";
import { Link } from "react-router";
import { RiAddLine, RiDeleteBinLine, RiMore2Line, RiPencilLine } from "@remixicon/react";
import { useProjects } from "@/hooks/use-projects";
import type { ProjectWithProgress } from "@/services/project.service";
import { Button } from "@/components/ui/button";
import { DeleteProjectDialog } from "@/components/delete-project-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/page-header";
import { ProjectFormDialog } from "@/components/project-form-dialog";
import { ProgressLine, pendingLabel } from "@/components/project-progress";
import { EmptyState } from "@/components/wrappers/empty-state";
import { LoadingView } from "@/components/wrappers/loading-view";

export function ProjectsPage() {
  const { projects, isLoading, createProject, updateProject, removeProject } = useProjects();
  // "new" = creando; un proyecto = editándolo.
  const [form, setForm] = useState<"new" | ProjectWithProgress | null>(null);
  const [deleting, setDeleting] = useState<ProjectWithProgress | null>(null);

  if (isLoading) return <LoadingView label="Cargando proyectos…" />;

  return (
    <>
      <PageHeader eyebrow={`Proyectos · ${projects.length}`} title="Tus" em="proyectos." />
      <div>
        {projects.length > 0 && (
          <Button type="button" variant="ghost" className="-ml-3 mb-2 text-muted-foreground" onClick={() => setForm("new")}>
            <RiAddLine aria-hidden />
            Nuevo proyecto
          </Button>
        )}

        {projects.length === 0 ? (
          <EmptyState
            title="Todavía no tenés"
            em="proyectos."
            description="Creá el primero para agrupar tus tareas."
            action={
              <Button type="button" onClick={() => setForm("new")}>
                <RiAddLine aria-hidden />
                Crear proyecto
              </Button>
            }
          />
        ) : (
          <ul className="flex flex-col divide-y divide-sidebar-border">
            {projects.map((project) => (
              <li key={project.id} className="flex items-center gap-1">
                <Link
                  to={`/projects/${project.id}`}
                  className="-mx-2 min-h-14 flex-1 rounded-sm px-2 py-3 outline-none hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span className="block text-base font-medium">{project.name}</span>
                  {project.description && <span className="mt-0.5 line-clamp-1 block text-sm text-muted-foreground">{project.description}</span>}
                  <span className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{pendingLabel(project.progress.pending)}</span>
                    <ProgressLine ratio={project.progress.ratio} className="max-w-24 flex-1" />
                    {project.progress.completed + project.progress.pending > 0 && <span>{Math.round(project.progress.ratio * 100)} %</span>}
                  </span>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="text-muted-foreground" aria-label={`Más opciones de ${project.name}`}>
                      <RiMore2Line aria-hidden />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setForm(project)}>
                      <RiPencilLine aria-hidden />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(project)}>
                      <RiDeleteBinLine aria-hidden />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ProjectFormDialog
        open={form !== null}
        project={form === "new" || form === null ? undefined : form}
        onOpenChange={(open) => !open && setForm(null)}
        onSubmit={(values) => (form === "new" || form === null ? createProject(values) : updateProject(form.id, values))}
      />
      <DeleteProjectDialog project={deleting} onClose={() => setDeleting(null)} onConfirm={(project) => removeProject(project.id)} />
    </>
  );
}
