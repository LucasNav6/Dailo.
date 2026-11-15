import { useState } from "react";
import { useNavigate } from "react-router";
import { RiAddLine, RiDeleteBinLine, RiFlowerFill, RiPencilLine } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { Emphasis } from "@/components/atoms/emphasis";
import { Switch } from "@/components/atoms/switch";
import { PageColumn } from "@/components/layouts/page-column";
import { ActionRow } from "@/components/molecules/action-row";
import { BottomSheet } from "@/components/molecules/bottom-sheet";
import { ConfirmDialog } from "@/components/molecules/confirm-dialog";
import { EmptyState } from "@/components/molecules/empty-state";
import { SheetHeading } from "@/components/molecules/sheet-heading";
import { ComposeForm } from "@/components/organisms/compose-form";
import { ProjectList } from "@/features/projects/components/project-list";
import { ProjectsHeader } from "@/features/projects/components/projects-header";
import { useCreateProject } from "@/features/projects/hooks/create-project.hook";
import { useDeleteProject } from "@/features/projects/hooks/delete-project.hook";
import { useUpdateProject } from "@/features/projects/hooks/update-project.hook";
import { ProjectsLoadingView } from "@/features/projects/views/loading.view";
import { useProjects } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import type { Project } from "@/models/project.model";

/** Proyectos real: lista con progreso, crear/editar en hoja, opciones y eliminación con confirmación. */
export function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, isLoading } = useProjects();
  const { tasks, isLoading: loadingTasks } = useTasks();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const [composing, setComposing] = useState<Project | "new" | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [moveToInbox, setMoveToInbox] = useState(true);

  if (isLoading || loadingTasks) return <PageColumn><ProjectsLoadingView /></PageColumn>;

  const summaries = projects.map((project) => {
    const own = tasks.filter((task) => task.projectId === project.id && !task.parentId && (task.status === "active" || task.status === "completed"));
    const done = own.filter((task) => task.status === "completed").length;
    const pending = own.length - done;
    return { id: project.id, name: project.name, description: project.description ?? "", pending, progress: own.length === 0 ? 0 : Math.round((done / own.length) * 100) };
  });
  const menu = projects.find((project) => project.id === menuId) ?? null;
  const pendingOf = (id: string) => summaries.find((summary) => summary.id === id)?.pending ?? 0;

  const save = async (title: string, description: string) => {
    const editing = composing !== "new" ? composing : null;
    const error = editing ? await updateProject(editing.id, title, description) : await createProject(title, description);
    if (error) return error;
    setComposing(null);
  };

  return (
    <PageColumn>
      <ProjectsHeader count={projects.length} />
      {projects.length === 0 ? (
        <EmptyState
          className="py-8"
          icon={<RiFlowerFill aria-hidden />}
          title={<>Todavía no tenés <Emphasis>proyectos.</Emphasis></>}
          description="Creá el primero para agrupar tus tareas."
          action={<Button className="[&_svg]:size-5" onClick={() => setComposing("new")}><RiAddLine aria-hidden />Crear proyecto</Button>}
        />
      ) : (
        <ProjectList
          projects={summaries}
          highlighted={menu ? projects.indexOf(menu) : undefined}
          onCreate={() => setComposing("new")}
          onOpen={(index) => navigate(`/projects/${projects[index].id}`)}
          onMore={(index) => setMenuId(projects[index].id)}
        />
      )}

      <BottomSheet open={composing !== null} onOpenChange={(open) => !open && setComposing(null)} label={composing === "new" ? "Nuevo proyecto" : "Editar proyecto"}>
        {composing !== null && (
          <ComposeForm
            key={composing === "new" ? "new" : composing.id}
            placeholder="Nombre del proyecto"
            initialTitle={composing === "new" ? "" : composing.name}
            initialDescription={composing === "new" ? "" : (composing.description ?? "")}
            onSave={save}
          />
        )}
      </BottomSheet>

      <BottomSheet open={menu !== null} onOpenChange={(open) => !open && setMenuId(null)} label="Opciones del proyecto" className="gap-2 pb-7">
        {menu && (
          <>
            <SheetHeading eyebrow="Proyecto" title={menu.name} />
            <ActionRow icon={<RiPencilLine aria-hidden />} onClick={() => { setComposing(menu); setMenuId(null); }}>Editar proyecto</ActionRow>
            <ActionRow icon={<RiAddLine aria-hidden />} onClick={() => navigate(`/projects/${menu.id}`, { state: { addTask: true } })}>Añadir tarea</ActionRow>
            <div className="my-1 h-px bg-border" />
            <ActionRow icon={<RiDeleteBinLine aria-hidden />} tone="danger" onClick={() => { setDeleting(menu); setMenuId(null); }}>Eliminar proyecto</ActionRow>
          </>
        )}
      </BottomSheet>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`¿Eliminar “${deleting?.name ?? ""}”?`}
        description={`Se eliminan el proyecto${deleting && pendingOf(deleting.id) > 0 ? ` y sus ${pendingOf(deleting.id)} tareas pendientes` : " y sus tareas"}. No se puede deshacer.`}
      >
        <div className="flex items-center gap-3 py-2">
          <span className="flex-1 text-[15px] text-foreground">Mover las tareas pendientes al Inbox</span>
          <Switch checked={moveToInbox} onCheckedChange={setMoveToInbox} aria-label="Mover las tareas pendientes al Inbox" />
        </div>
        <Button variant="danger" onClick={async () => { if (deleting) await deleteProject(deleting.id, moveToInbox); setDeleting(null); }}>Eliminar proyecto</Button>
        <Button variant="ghost" onClick={() => setDeleting(null)}>Cancelar</Button>
      </ConfirmDialog>
    </PageColumn>
  );
}
