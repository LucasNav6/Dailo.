import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowLeftSLine,
  RiArrowUpLine,
  RiDeleteBinLine,
  RiMore2Line,
  RiPencilLine,
} from "@remixicon/react";
import { useProject } from "@/hooks/use-project";
import type { Section } from "@/models/section.model";
import type { Task } from "@/models/task.model";
import type { TaskNode } from "@/services/project.service";
import { Button } from "@/components/ui/button";
import { DeleteProjectDialog } from "@/components/delete-project-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InlineAdd } from "@/components/inline-add";
import { NameDialog } from "@/components/name-dialog";
import { pendingLabel, ProgressLine } from "@/components/project-progress";
import { ProjectFormDialog } from "@/components/project-form-dialog";
import { TaskEditDialog } from "@/components/task-edit-dialog";
import { TaskRow, type TaskActions } from "@/components/task-row";

export function ProjectDetailPage() {
  const { projectId = "" } = useParams();
  const navigate = useNavigate();
  const p = useProject(projectId);
  const [editingProject, setEditingProject] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  // "new" = sección nueva; una sección = renombrándola.
  const [sectionDialog, setSectionDialog] = useState<"new" | Section | null>(null);
  const [failed, setFailed] = useState(false);

  const { overview } = p;
  if (overview === undefined) return <p className="sr-only" role="status">Cargando proyecto…</p>;
  if (overview === null)
    return (
      <div className="flex max-w-2xl flex-col items-start gap-3 py-8">
        <h2 className="text-lg font-semibold">Este proyecto no existe</h2>
        <p className="text-sm text-muted-foreground">Puede que haya sido eliminado.</p>
        <Button asChild variant="secondary">
          <Link to="/projects">Volver a Proyectos</Link>
        </Button>
      </div>
    );

  const { project, sections, unsectioned, bySection } = overview;
  const total = project.progress.completed + project.progress.pending;

  // Las acciones que no pasan por un formulario muestran un aviso si fallan.
  const run = (action: () => Promise<unknown>) => async () => {
    try {
      await action();
      setFailed(false);
    } catch {
      setFailed(true);
    }
  };
  const actions: TaskActions = {
    toggle: (task) => void run(() => p.setCompleted(task.id, task.status !== "completed"))(),
    edit: setEditingTask,
    discard: (task) => void run(() => p.discardTask(task.id))(),
    moveToSection: (task, sectionId) => void run(() => p.moveTask(task.id, sectionId))(),
    addSubtask: p.createSubtask,
  };

  const taskList = (nodes: TaskNode[]) => (
    <ul className="flex flex-col">
      {nodes.map((node) => (
        <TaskRow key={node.task.id} node={node} sections={sections} actions={actions} />
      ))}
    </ul>
  );

  return (
    <div className="max-w-2xl">
      <Link to="/projects" className="-ml-2 mb-2 inline-flex min-h-11 items-center gap-1 rounded-sm px-2 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50">
        <RiArrowLeftSLine className="size-5" aria-hidden />
        Proyectos
      </Link>

      <header className="mb-6 flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-semibold">{project.name}</h2>
          {project.description && <p className="mt-1 text-sm whitespace-pre-line text-muted-foreground">{project.description}</p>}
          <p className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{total === 0 ? "Sin tareas todavía" : `${project.progress.completed} de ${total} completadas · ${pendingLabel(project.progress.pending).toLowerCase()}`}</span>
            <ProgressLine ratio={project.progress.ratio} className="max-w-24 flex-1" />
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="text-muted-foreground" aria-label="Opciones del proyecto">
              <RiMore2Line aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setEditingProject(true)}>
              <RiPencilLine aria-hidden />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={() => setDeletingProject(true)}>
              <RiDeleteBinLine aria-hidden />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <p role="alert" className="mb-3 text-sm text-destructive empty:hidden">{failed ? "No se pudo guardar el cambio. Probá de nuevo." : null}</p>

      <section aria-label="Tareas sin sección">
        {unsectioned.length === 0 && sections.length === 0 && total === 0 && (
          <p className="px-2 pb-2 text-sm text-muted-foreground">Este proyecto está vacío. Agregá una tarea para empezar.</p>
        )}
        {taskList(unsectioned)}
        <InlineAdd placeholder="Agregar tarea" onAdd={(title) => p.createTask(title)} />
      </section>

      {sections.map((section, index) => {
        const nodes = bySection[section.id] ?? [];
        return (
          <section key={section.id} aria-labelledby={`section-${section.id}`} className="mt-8">
            <div className="flex items-center gap-1 border-b border-sidebar-border pb-1">
              <h3 id={`section-${section.id}`} className="flex-1 px-2 text-sm font-semibold">{section.name}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="text-muted-foreground" aria-label={`Opciones de la sección ${section.name}`}>
                    <RiMore2Line aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setSectionDialog(section)}>
                    <RiPencilLine aria-hidden />
                    Renombrar
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={index === 0} onSelect={() => void run(() => p.moveSection(section.id, "up"))()}>
                    <RiArrowUpLine aria-hidden />
                    Subir
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={index === sections.length - 1} onSelect={() => void run(() => p.moveSection(section.id, "down"))()}>
                    <RiArrowDownLine aria-hidden />
                    Bajar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={() => void run(() => p.removeSection(section.id))()}>
                    <RiDeleteBinLine aria-hidden />
                    Eliminar sección
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {nodes.length === 0 && <p className="px-2 py-2 text-sm text-muted-foreground">Sin tareas en esta sección.</p>}
            {taskList(nodes)}
            <InlineAdd placeholder={`Agregar tarea a ${section.name}`} onAdd={(title) => p.createTask(title, section.id)} />
          </section>
        );
      })}

      <Button type="button" variant="ghost" className="-ml-3 mt-6 text-muted-foreground" onClick={() => setSectionDialog("new")}>
        <RiAddLine aria-hidden />
        Nueva sección
      </Button>

      <ProjectFormDialog
        open={editingProject}
        project={project}
        onOpenChange={setEditingProject}
        onSubmit={(values) => p.updateProject(values)}
      />
      <DeleteProjectDialog
        project={deletingProject ? project : null}
        onClose={() => setDeletingProject(false)}
        onConfirm={async () => {
          await p.removeProject();
          navigate("/projects", { replace: true });
        }}
      />
      <TaskEditDialog task={editingTask} onClose={() => setEditingTask(null)} onSubmit={(id, changes) => p.updateTask(id, changes)} />
      <NameDialog
        open={sectionDialog !== null}
        title={sectionDialog === "new" || sectionDialog === null ? "Nueva sección" : "Renombrar sección"}
        label="Nombre de la sección"
        initial={sectionDialog === "new" || sectionDialog === null ? "" : sectionDialog.name}
        submitLabel={sectionDialog === "new" || sectionDialog === null ? "Crear sección" : "Guardar"}
        onOpenChange={(open) => !open && setSectionDialog(null)}
        onSubmit={(name) => (sectionDialog === "new" || sectionDialog === null ? p.createSection(name) : p.renameSection(sectionDialog.id, name))}
      />
    </div>
  );
}
