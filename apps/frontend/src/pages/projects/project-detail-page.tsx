import { Fragment, useEffect, useState, type KeyboardEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { RiAddLine, RiArrowDownSLine, RiArrowLeftLine, RiArrowUpSLine, RiCheckboxBlankCircleLine, RiDeleteBinLine, RiFolderLine, RiPencilLine, RiRadioButtonLine } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { DragHandle } from "@/components/atoms/drag-handle";
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
import { SubtaskToggle } from "@/components/molecules/subtask-toggle";
import { TaskRow } from "@/components/molecules/task-row";
import { ComposeForm } from "@/components/organisms/compose-form";
import { AddTask } from "@/features/projects/components/add-task";
import { DropIndicator } from "@/features/projects/components/drop-indicator";
import { ProjectHeading } from "@/features/projects/components/project-heading";
import { ProjectSectionHeader } from "@/features/projects/components/project-section-header";
import { EmptySectionNote, NewSection, SectionAddTask } from "@/features/projects/components/section-actions";
import { DRAGGED_ROW, PROJECT_ROW } from "@/features/projects/lib/drag-styles";
import { useAddTask } from "@/features/projects/hooks/add-task.hook";
import { useCompleteTaskWithSubtasks } from "@/features/projects/hooks/complete-task-with-subtasks.hook";
import { useCreateSection } from "@/features/projects/hooks/create-section.hook";
import { useDeleteProject } from "@/features/projects/hooks/delete-project.hook";
import { useDeleteSection, type DeleteSectionMode } from "@/features/projects/hooks/delete-section.hook";
import { useProject } from "@/features/projects/hooks/get-project.hook";
import { useSections } from "@/features/projects/hooks/list-sections.hook";
import { useTasks } from "@/features/projects/hooks/list-tasks.hook";
import { useRenameSection } from "@/features/projects/hooks/rename-section.hook";
import { useReorderSections } from "@/features/projects/hooks/reorder-section.hook";
import { useReorderTasks } from "@/features/projects/hooks/reorder-task.hook";
import { useSetTaskDone } from "@/features/projects/hooks/set-task-done.hook";
import { useUpdateProject } from "@/features/projects/hooks/update-project.hook";
import { useDragSort } from "@/lib/use-drag-sort";
import { useRecentlyCompleted } from "@/lib/use-recently-completed";
import { shortDay } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { Section } from "@/models/section.model";
import type { Task } from "@/models/task.model";

const NONE = "none";

type Adding = false | { sectionId?: string };

const moveItem = <T,>(list: T[], from: number, to: number) => {
  const next = [...list];
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
};

export function ProjectDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const project = useProject(id);
  const { tasks, isLoading } = useTasks();
  const { sections } = useSections(id);
  const addTaskToProject = useAddTask(id);
  const setTaskDone = useSetTaskDone();
  const completeWithSubtasks = useCompleteTaskWithSubtasks();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const createSection = useCreateSection(id);
  const renameSection = useRenameSection();
  const deleteSection = useDeleteSection();
  const reorderTasks = useReorderTasks();
  const reorderSections = useReorderSections();
  const { isRecent, markCompleted } = useRecentlyCompleted();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [showDone, setShowDone] = useState(false);
  const [adding, setAdding] = useState<Adding>((location.state as { addTask?: boolean } | null)?.addTask ? {} : false);
  const [editing, setEditing] = useState(false);
  const [menu, setMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [moveToInbox, setMoveToInbox] = useState(true);
  const [pendingParent, setPendingParent] = useState<Task | null>(null);
  const [sectionSheet, setSectionSheet] = useState<"new" | Section | null>(null);
  const [sectionMenu, setSectionMenu] = useState<Section | null>(null);
  const [sectionDelete, setSectionDelete] = useState<Section | null>(null);
  const [deleteMode, setDeleteMode] = useState<DeleteSectionMode>("keep");

  useEffect(() => {
    if (adding) window.history.replaceState({}, "");
  }, [adding]);

  const own = tasks.filter((task) => task.projectId === id && (task.status === "active" || task.status === "completed"));
  const roots = own.filter((task) => !task.parentId).sort((a, b) => a.position - b.position);
  const pending = roots.filter((task) => task.status === "active" || isRecent(task.id));
  const completed = roots.filter((task) => task.status === "completed" && !isRecent(task.id)).sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
  const subtasksOf = (task: Task) => own.filter((sub) => sub.parentId === task.id).sort((a, b) => a.position - b.position);
  const sectionIds = new Set(sections.map((section) => section.id));
  const groupOf = (task: Task) => (task.sectionId && sectionIds.has(task.sectionId) ? task.sectionId : NONE);
  const inGroup = (group: string) => pending.filter((task) => groupOf(task) === group);
  const realSection = (group: string) => (group === NONE ? undefined : group);

  const taskDrag = useDragSort({
    onDrop: (taskId, _from, target) => {
      const ordered = inGroup(target.group).filter((task) => task.id !== taskId).map((task) => task.id);
      ordered.splice(target.index, 0, taskId);
      void reorderTasks(ordered, realSection(target.group), taskId);
    },
  });
  const sectionDrag = useDragSort({
    onDrop: (sectionId, _from, target) => {
      const ordered = sections.filter((section) => section.id !== sectionId).map((section) => section.id);
      ordered.splice(target.index, 0, sectionId);
      void reorderSections(ordered);
    },
  });

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

  const toggle = (task: Task, done: boolean) => {
    if (done && subtasksOf(task).some((sub) => sub.status === "active")) return setPendingParent(task);
    if (done) markCompleted(task.id);
    void setTaskDone(task.id, done);
  };

  const completeAll = async (task: Task, withSubtasks: boolean) => {
    markCompleted(task.id);
    await completeWithSubtasks(task, subtasksOf(task), withSubtasks);
    setPendingParent(null);
  };

  const nudgeTask = (task: Task, group: string, event: KeyboardEvent) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const list = inGroup(group);
    const from = list.findIndex((item) => item.id === task.id);
    const to = from + (event.key === "ArrowUp" ? -1 : 1);
    if (to < 0 || to >= list.length) return;
    void reorderTasks(moveItem(list, from, to).map((item) => item.id), realSection(group), task.id);
  };

  const nudgeSection = (section: Section, event: KeyboardEvent) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const from = sections.findIndex((item) => item.id === section.id);
    const to = from + (event.key === "ArrowUp" ? -1 : 1);
    if (to < 0 || to >= sections.length) return;
    void reorderSections(moveItem(sections, from, to).map((item) => item.id));
  };

  const taskDragging = taskDrag.drag !== null;
  const sectionDragging = sectionDrag.drag !== null;

  const taskRow = (task: Task, group: string) => {
    const subs = subtasksOf(task);
    const open = expanded.includes(task.id) && !taskDragging;
    const dragged = taskDrag.drag?.id === task.id;
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
        <TaskRow
          ref={taskDrag.rowRef(task.id, group)}
          style={dragged ? { transform: `translateY(${taskDrag.drag?.offset ?? 0}px)` } : undefined}
          onOpen={() => navigate(`/projects/${project.id}/tasks/${task.id}`)}
          id={`task-${task.id}`}
          title={task.title}
          checked={task.status === "completed"}
          onCheckedChange={(done) => toggle(task, done)}
          className={cn(PROJECT_ROW, dragged && DRAGGED_ROW, (sectionDragging || (taskDragging && !dragged)) && "opacity-55")}
          meta={meta || undefined}
          handle={
            <DragHandle
              aria-label={`Reordenar ${task.title}`}
              active={dragged}
              onPointerDown={(event) => taskDrag.start(task.id, group, event)}
              onKeyDown={(event) => nudgeTask(task, group, event)}
            />
          }
        />
        {open && subs.map((sub) => (
          <SubtaskRow key={sub.id} title={sub.title} checked={sub.status === "completed"} onCheckedChange={(done) => void setTaskDone(sub.id, done)} />
        ))}
      </Fragment>
    );
  };

  const groupRows = (group: string) => {
    const list = inGroup(group);
    const others = list.filter((task) => task.id !== taskDrag.drag?.id);
    const indicatorHere = taskDrag.target?.group === group;
    const out: React.ReactNode[] = [];
    let seen = 0;
    for (const task of list) {
      if (task.id !== taskDrag.drag?.id) {
        if (indicatorHere && taskDrag.target?.index === seen) out.push(<DropIndicator key="indicator" />);
        seen++;
      }
      out.push(taskRow(task, group));
    }
    if (indicatorHere && (taskDrag.target?.index ?? 0) >= others.length) out.push(<DropIndicator key="indicator" />);
    return out;
  };

  const addTask = async (title: string, description: string) => {
    if (adding) await addTaskToProject(title, description, adding.sectionId);
    setAdding(false);
  };

  const sectionNodes = () => {
    const others = sections.filter((section) => section.id !== sectionDrag.drag?.id);
    const indicatorAt = sectionDrag.target?.index;
    const out: React.ReactNode[] = [];
    let seen = 0;
    for (const section of sections) {
      const dragged = sectionDrag.drag?.id === section.id;
      if (!dragged) {
        if (sectionDragging && indicatorAt === seen) out.push(<ul key={`i-${section.id}`} className="m-0 p-0"><DropIndicator /></ul>);
        seen++;
      }
      const list = inGroup(section.id);
      const open = !collapsed.includes(section.id) && !sectionDragging;
      const bindRef = (element: HTMLElement | null) => {
        sectionDrag.rowRef(section.id, "sections")(element);
        taskDrag.groupRef(section.id)(element);
      };
      out.push(
        <div key={section.id} ref={bindRef} style={dragged ? { transform: `translateY(${sectionDrag.drag?.offset ?? 0}px)`, position: "relative", zIndex: 20 } : undefined}>
          <ProjectSectionHeader
            name={section.name}
            count={list.length}
            open={!collapsed.includes(section.id)}
            dragging={dragged}
            dimmed={(sectionDragging && !dragged) || taskDragging}
            onToggle={() => setCollapsed((current) => (current.includes(section.id) ? current.filter((value) => value !== section.id) : [...current, section.id]))}
            onMore={() => setSectionMenu(section)}
            handle={
              <DragHandle
                aria-label={`Reordenar sección ${section.name}`}
                active={dragged}
                onPointerDown={(event) => sectionDrag.start(section.id, "sections", event)}
                onKeyDown={(event) => nudgeSection(section, event)}
              />
            }
          />
          {open && (
            <>
              {list.length === 0 && taskDrag.target?.group !== section.id ? <EmptySectionNote /> : <ul className="m-0 flex flex-col p-0">{groupRows(section.id)}</ul>}
              <SectionAddTask onClick={() => setAdding({ sectionId: section.id })} />
            </>
          )}
        </div>
      );
    }
    if (sectionDragging && (indicatorAt ?? 0) >= others.length) out.push(<ul key="i-end" className="m-0 p-0"><DropIndicator /></ul>);
    return out;
  };

  const addingSection = adding ? sections.find((section) => section.id === adding.sectionId) : undefined;
  const sectionTasks = (section: Section) => roots.filter((task) => task.sectionId === section.id);
  const deleteCount = sectionDelete ? sectionTasks(sectionDelete).length : 0;
  const menuCount = sectionMenu ? inGroup(sectionMenu.id).length : 0;

  return (
    <PageColumn>
      <DetailBar onBack={() => navigate("/projects")} onMore={() => setMenu(true)} />
      <ProjectHeading done={completed.length} total={roots.length} name={project.name} description={project.description} />

      {roots.length === 0 && sections.length === 0 ? (
        <div className="mt-10 flex flex-col items-start gap-3">
          <p className="text-base leading-normal text-muted-foreground">Este proyecto todavía no tiene tareas. Añadí la primera para empezar.</p>
          <Button className="[&_svg]:size-5" onClick={() => setAdding({})}>
            <RiAddLine aria-hidden />
            Añadir tarea
          </Button>
          <NewSection onClick={() => setSectionSheet("new")} />
        </div>
      ) : (
        <>
          <ul ref={taskDrag.groupRef(NONE)} className={cn("m-0 flex flex-col p-0", taskDragging && "min-h-3")}>{groupRows(NONE)}</ul>
          {sections.length === 0 && <AddTask onClick={() => setAdding({})} />}
          <div>{sectionNodes()}</div>
          {!sectionDragging && <NewSection onClick={() => setSectionSheet("new")} />}
          {completed.length > 0 && (
            <>
              <CollapseHeader label={`Completadas · ${completed.length}`} open={showDone} onToggle={() => setShowDone((value) => !value)} />
              {showDone && (
                <ul className="flex flex-col">
                  {completed.map((task) => (
                    <TaskRow
                      key={task.id}
                      onOpen={() => navigate(`/projects/${project.id}/tasks/${task.id}`)}
                      id={`task-${task.id}`}
                      title={task.title}
                      checked
                      onCheckedChange={(done) => toggle(task, done)}
                      className="py-2.5"
                      time={task.completedAt ? shortDay(task.completedAt.slice(0, 10)) : undefined}
                    />
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}

      <BottomSheet open={adding !== false} onOpenChange={(open) => !open && setAdding(false)} label="Nueva tarea">
        {adding && (
          <ComposeForm
            placeholder={addingSection ? "¿Qué hay que hacer?" : "Nueva tarea"}
            chip={
              addingSection && (
                <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-selected px-3.5 text-sm font-semibold text-foreground [&_svg]:size-[18px]">
                  <RiFolderLine aria-hidden />
                  {addingSection.name}
                </span>
              )
            }
            onSave={addTask}
          />
        )}
      </BottomSheet>

      <BottomSheet open={sectionSheet !== null} onOpenChange={(open) => !open && setSectionSheet(null)} label={sectionSheet === "new" ? "Nueva sección" : "Renombrar sección"}>
        {sectionSheet !== null && (
          <ComposeForm
            key={sectionSheet === "new" ? "new" : sectionSheet.id}
            placeholder="Nombre de la sección"
            initialTitle={sectionSheet === "new" ? "" : sectionSheet.name}
            withDescription={false}
            note={`En ${project.name}`}
            onSave={async (name) => {
              const error = sectionSheet === "new" ? await createSection(name).then((result) => (typeof result === "string" ? result : undefined)) : await renameSection(sectionSheet, name);
              if (error) return error;
              setSectionSheet(null);
            }}
          />
        )}
      </BottomSheet>

      <BottomSheet open={sectionMenu !== null} onOpenChange={(open) => !open && setSectionMenu(null)} label="Opciones de la sección" className="gap-1 pb-6">
        {sectionMenu && (
          <>
            <SheetHeading title={sectionMenu.name} subtitle={`Sección · ${menuCount === 1 ? "1 tarea pendiente" : `${menuCount} tareas pendientes`}`} />
            <ActionRow icon={<RiPencilLine aria-hidden />} onClick={() => { setSectionSheet(sectionMenu); setSectionMenu(null); }}>Renombrar</ActionRow>
            <ActionRow icon={<RiAddLine aria-hidden />} onClick={() => { setAdding({ sectionId: sectionMenu.id }); setSectionMenu(null); }}>Añadir tarea</ActionRow>
            <ActionRow
              icon={collapsed.includes(sectionMenu.id) ? <RiArrowDownSLine aria-hidden /> : <RiArrowUpSLine aria-hidden />}
              onClick={() => {
                const target = sectionMenu.id;
                setCollapsed((current) => (current.includes(target) ? current.filter((value) => value !== target) : [...current, target]));
                setSectionMenu(null);
              }}
            >
              {collapsed.includes(sectionMenu.id) ? "Desplegar" : "Plegar"}
            </ActionRow>
            <div className="my-1 h-px bg-border" />
            <ActionRow icon={<RiDeleteBinLine aria-hidden />} tone="danger-soft" onClick={() => { setDeleteMode("keep"); setSectionDelete(sectionMenu); setSectionMenu(null); }}>Eliminar sección</ActionRow>
          </>
        )}
      </BottomSheet>

      <ConfirmDialog
        open={sectionDelete !== null}
        onOpenChange={(open) => !open && setSectionDelete(null)}
        title={`¿Eliminar la sección “${sectionDelete?.name ?? ""}”?`}
        description={deleteCount > 0 ? "La sección se elimina. Elegí qué pasa con sus tareas." : "La sección está vacía y se elimina."}
      >
        {deleteCount > 0 && (
          <div role="radiogroup" aria-label="Qué pasa con las tareas" className="flex flex-col">
            {([
              { mode: "keep", title: "Mover las tareas a “Sin sección”", note: "Se conservan en el proyecto" },
              { mode: "delete-tasks", title: `Eliminar también ${deleteCount === 1 ? "la tarea" : `las ${deleteCount} tareas`}`, note: "No se puede deshacer" },
            ] as const).map((option) => {
              const selected = deleteMode === option.mode;
              const Icon = selected ? RiRadioButtonLine : RiCheckboxBlankCircleLine;
              return (
                <button
                  key={option.mode}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setDeleteMode(option.mode)}
                  className="flex min-h-14 items-center gap-4 rounded-lg text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span className={cn("inline-flex [&_svg]:size-[22px]", selected ? "text-foreground" : "text-muted-foreground")}>
                    <Icon aria-hidden />
                  </span>
                  <span className="flex flex-1 flex-col gap-px">
                    <span className="text-[17px] text-foreground">{option.title}</span>
                    <span className="text-sm text-muted-foreground">{option.note}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
        <Button
          variant="danger"
          onClick={async () => {
            if (sectionDelete) await deleteSection(sectionDelete.id, sectionTasks(sectionDelete), deleteMode);
            setSectionDelete(null);
          }}
        >
          Eliminar sección
        </Button>
        <Button variant="ghost" className="h-11 px-2" onClick={() => setSectionDelete(null)}>Cancelar</Button>
      </ConfirmDialog>

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
        <ActionRow icon={<RiAddLine aria-hidden />} onClick={() => { setMenu(false); setAdding({}); }}>Añadir tarea</ActionRow>
        <ActionRow icon={<RiAddLine aria-hidden />} onClick={() => { setMenu(false); setSectionSheet("new"); }}>Nueva sección</ActionRow>
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
