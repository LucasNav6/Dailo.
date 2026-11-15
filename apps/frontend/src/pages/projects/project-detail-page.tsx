import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { RiAddLine, RiArrowLeftLine, RiDeleteBinLine, RiFolderLine, RiPencilLine } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { Emphasis } from "@/components/atoms/emphasis";
import { IconButton } from "@/components/atoms/icon-button";
import { Switch } from "@/components/atoms/switch";
import { PageColumn } from "@/components/layouts/page-column";
import { ActionRow } from "@/components/molecules/action-row";
import { BottomSheet } from "@/components/molecules/bottom-sheet";
import { CollapseHeader } from "@/components/molecules/collapse-header";
import { ConfirmDialog } from "@/components/molecules/confirm-dialog";
import { DetailBar } from "@/components/molecules/detail-bar";
import { EmptyState } from "@/components/molecules/empty-state";
import { SheetHeading } from "@/components/molecules/sheet-heading";
import { SubtaskRow } from "@/components/molecules/subtask-row";
import { TaskRow } from "@/components/molecules/task-row";
import { ComposeForm } from "@/components/organisms/compose-form";
import { AddTask } from "@/features/projects/components/add-task";
import { ProjectHeading } from "@/features/projects/components/project-heading";
import { SubtaskToggle } from "@/features/projects/components/subtask-toggle";
import { useTasks } from "@/features/projects/hooks/list-tasks.hook";
import { shortDay } from "@/lib/dates";
import { useProject } from "@/features/projects/hooks/get-project.hook";
import { useAddTask } from "@/features/projects/hooks/add-task.hook";
import { useCompleteTaskWithSubtasks } from "@/features/projects/hooks/complete-task-with-subtasks.hook";
import { useDeleteProject } from "@/features/projects/hooks/delete-project.hook";
import { useSetTaskDone } from "@/features/projects/hooks/set-task-done.hook";
import { useUpdateProject } from "@/features/projects/hooks/update-project.hook";
import type { Task } from "@/models/task.model";

/** Detalle de proyecto real: tareas pendientes con subtareas, completadas plegadas y alta de tareas. */
export function ProjectDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const project = useProject(id);
  const { tasks, isLoading } = useTasks();
  const addTaskToProject = useAddTask(id);
  const setTaskDone = useSetTaskDone();
  const completeWithSubtasks = useCompleteTaskWithSubtasks();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [showDone, setShowDone] = useState(false);
  const [adding, setAdding] = useState(Boolean((location.state as { addTask?: boolean } | null)?.addTask));
  const [editing, setEditing] = useState(false);
  const [menu, setMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [moveToInbox, setMoveToInbox] = useState(true);
  const [pendingParent, setPendingParent] = useState<Task | null>(null);

  useEffect(() => {
    // El estado de navegación solo abre la hoja una vez.
    if (adding) window.history.replaceState({}, "");
  }, [adding]);

  if (project === undefined || isLoading) {
    return <PageColumn><div aria-busy="true" className="h-40" /></PageColumn>;
  }

  if (project === null) {
    return (
      <PageColumn>
        <div className="-mx-3 -mt-2 flex">
          <IconButton aria-label="Volver" className="text-foreground" onClick={() => navigate("/projects")}>
            <RiArrowLeftLine aria-hidden />
          </IconButton>
        </div>
        <EmptyState
          icon={<RiFolderLine aria-hidden />}
          title={<>Este proyecto <Emphasis>ya no existe.</Emphasis></>}
          description="Pudo eliminarse desde otra pestaña o dispositivo. Tus otros proyectos siguen acá."
          action={<Button onClick={() => navigate("/projects")}>Ir a proyectos</Button>}
        />
      </PageColumn>
    );
  }

  const own = tasks.filter((task) => task.projectId === project.id && (task.status === "active" || task.status === "completed"));
  const roots = own.filter((task) => !task.parentId).sort((a, b) => a.position - b.position);
  const pending = roots.filter((task) => task.status === "active");
  const completed = roots.filter((task) => task.status === "completed").sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
  const subtasksOf = (task: Task) => own.filter((sub) => sub.parentId === task.id).sort((a, b) => a.position - b.position);

  const toggle = (task: Task, done: boolean) => {
    if (done && subtasksOf(task).some((sub) => sub.status === "active")) return setPendingParent(task);
    void setTaskDone(task.id, done);
  };

  const completeAll = async (task: Task, withSubtasks: boolean) => {
    await completeWithSubtasks(task, subtasksOf(task), withSubtasks);
    setPendingParent(null);
  };

  const row = (task: Task) => {
    const subs = subtasksOf(task);
    const open = expanded.includes(task.id);
    const meta = subs.length > 0 && (
      <button
        type="button"
        aria-expanded={open}
        aria-label={`Subtareas de ${task.title}`}
        onClick={() => setExpanded((current) => (open ? current.filter((value) => value !== task.id) : [...current, task.id]))}
        className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <SubtaskToggle count={`${subs.filter((sub) => sub.status === "completed").length}/${subs.length}`} open={open} />
      </button>
    );
    return (
      <Fragment key={task.id}>
        <TaskRow onOpen={() => navigate(`/projects/${project.id}/tasks/${task.id}`)} id={`task-${task.id}`} title={task.title} checked={task.status === "completed"} onCheckedChange={(done) => toggle(task, done)} className="py-2.5" meta={meta || undefined} time={task.status === "completed" && task.completedAt ? shortDay(task.completedAt.slice(0, 10)) : undefined} />
        {open && subs.map((sub) => (
          <SubtaskRow key={sub.id} title={sub.title} checked={sub.status === "completed"} onCheckedChange={(done) => void setTaskDone(sub.id, done)} />
        ))}
      </Fragment>
    );
  };

  const addTask = async (title: string, description: string) => {
    await addTaskToProject(title, description);
    setAdding(false);
  };

  return (
    <PageColumn>
      <DetailBar onBack={() => navigate("/projects")} onMore={() => setMenu(true)} />
      <ProjectHeading done={completed.length} total={roots.length} name={project.name} description={project.description} />

      {roots.length === 0 ? (
        <div className="mt-10 flex flex-col items-start gap-3">
          <p className="text-base leading-normal text-muted-foreground">Este proyecto todavía no tiene tareas. Añadí la primera para empezar.</p>
          <Button className="[&_svg]:size-5" onClick={() => setAdding(true)}>
            <RiAddLine aria-hidden />
            Añadir tarea
          </Button>
        </div>
      ) : (
        <>
          <ul className="mt-5 flex flex-col">{pending.map(row)}</ul>
          <AddTask onClick={() => setAdding(true)} />
          {completed.length > 0 && (
            <>
              <CollapseHeader label={`Completadas · ${completed.length}`} open={showDone} onToggle={() => setShowDone((value) => !value)} />
              {showDone && <ul className="flex flex-col">{completed.map(row)}</ul>}
            </>
          )}
        </>
      )}

      <BottomSheet open={adding} onOpenChange={setAdding} label="Nueva tarea">
        {adding && <ComposeForm placeholder="Nueva tarea" onSave={addTask} />}
      </BottomSheet>

      <BottomSheet open={editing} onOpenChange={setEditing} label="Editar proyecto">
        {editing && (
          <ComposeForm
            placeholder="Nombre del proyecto"
            initialTitle={project.name}
            initialDescription={project.description ?? ""}
            onSave={async (title, description) => {
              const error = await updateProject(project.id, title, description);
              if (error) return error;
              setEditing(false);
            }}
          />
        )}
      </BottomSheet>

      <BottomSheet open={menu} onOpenChange={setMenu} label="Opciones del proyecto" className="gap-2 pb-7">
        <SheetHeading eyebrow="Proyecto" title={project.name} />
        <ActionRow icon={<RiPencilLine aria-hidden />} onClick={() => { setMenu(false); setEditing(true); }}>Editar proyecto</ActionRow>
        <ActionRow icon={<RiAddLine aria-hidden />} onClick={() => { setMenu(false); setAdding(true); }}>Añadir tarea</ActionRow>
        <div className="my-1 h-px bg-border" />
        <ActionRow icon={<RiDeleteBinLine aria-hidden />} tone="danger" onClick={() => { setMenu(false); setConfirmDelete(true); }}>Eliminar proyecto</ActionRow>
      </BottomSheet>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`¿Eliminar “${project.name}”?`}
        description={`Se eliminan el proyecto${pending.length > 0 ? ` y sus ${pending.length} tareas pendientes` : " y sus tareas"}. No se puede deshacer.`}
      >
        <div className="flex items-center gap-3 py-2">
          <span className="flex-1 text-[15px] text-foreground">Mover las tareas pendientes al Inbox</span>
          <Switch checked={moveToInbox} onCheckedChange={setMoveToInbox} aria-label="Mover las tareas pendientes al Inbox" />
        </div>
        <Button variant="danger" onClick={async () => { await deleteProject(project.id, moveToInbox); navigate("/projects", { replace: true }); }}>Eliminar proyecto</Button>
        <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
      </ConfirmDialog>

      <ConfirmDialog
        open={pendingParent !== null}
        onOpenChange={(open) => !open && setPendingParent(null)}
        title={`Quedan ${pendingParent ? subtasksOf(pendingParent).filter((sub) => sub.status === "active").length : 0} subtareas sin hacer`}
        description={`¿Querés completarlas junto con “${pendingParent?.title ?? ""}”?`}
      >
        <Button onClick={() => pendingParent && void completeAll(pendingParent, true)}>Completar todo</Button>
        <Button variant="ghost" className="h-11 px-2" onClick={() => pendingParent && void completeAll(pendingParent, false)}>Solo la tarea</Button>
        <Button variant="ghost" className="h-11 px-2 text-muted-foreground" onClick={() => setPendingParent(null)}>Cancelar</Button>
      </ConfirmDialog>
    </PageColumn>
  );
}
