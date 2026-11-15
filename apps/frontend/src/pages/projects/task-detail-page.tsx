import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { es } from "date-fns/locale";
import { RiAddLine, RiAlbumLine, RiCalendarLine, RiCloseLine, RiDeleteBinLine, RiFolderLine, RiStarLine } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { Chip } from "@/components/atoms/chip";
import { hasLink, LinkifiedText } from "@/components/atoms/linkified-text";
import { IconButton } from "@/components/atoms/icon-button";
import { Switch } from "@/components/atoms/switch";
import { PageColumn } from "@/components/layouts/page-column";
import { ActionRow } from "@/components/molecules/action-row";
import { AttachmentRow } from "@/components/molecules/attachment-row";
import { BottomSheet } from "@/components/molecules/bottom-sheet";
import { Calendar } from "@/components/molecules/calendar";
import { ConfirmDialog } from "@/components/molecules/confirm-dialog";
import { CountHeading } from "@/components/molecules/count-heading";
import { DetailBar } from "@/components/molecules/detail-bar";
import { InlineAction } from "@/components/molecules/inline-action";
import { InlineError } from "@/components/molecules/inline-error";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/molecules/popover";
import { PropertyRow } from "@/components/molecules/property-row";
import { SheetHeading } from "@/components/molecules/sheet-heading";
import { SubtaskRow } from "@/components/molecules/subtask-row";
import { ComposeForm } from "@/components/organisms/compose-form";
import { MoveToSectionSheet } from "@/features/projects/components/move-to-section-sheet";
import { useCreateSection } from "@/features/projects/hooks/create-section.hook";
import { useSections } from "@/features/projects/hooks/list-sections.hook";
import { useMoveTaskToSection } from "@/features/projects/hooks/move-task-to-section.hook";
import { useAddSubtask } from "@/features/projects/hooks/add-subtask.hook";
import { useAttachFiles } from "@/features/projects/hooks/attach-file.hook";
import { useDeleteSubtask } from "@/features/projects/hooks/delete-subtask.hook";
import { useDeleteTask } from "@/features/projects/hooks/delete-task.hook";
import { useEditTask } from "@/features/projects/hooks/edit-task.hook";
import { useAttachments } from "@/features/projects/hooks/list-attachments.hook";
import { useTasks } from "@/features/projects/hooks/list-tasks.hook";
import { useProject } from "@/features/projects/hooks/get-project.hook";
import { useTask } from "@/features/projects/hooks/get-task.hook";
import { useRemoveAttachment } from "@/features/projects/hooks/remove-attachment.hook";
import { useSetTaskDeadline } from "@/features/projects/hooks/set-task-deadline.hook";
import { useSetTaskDone } from "@/features/projects/hooks/set-task-done.hook";
import { useSetTaskEssential } from "@/features/projects/hooks/set-task-essential.hook";
import { useSetTaskPlan } from "@/features/projects/hooks/set-task-plan.hook";
import { TaskNotFound } from "@/features/projects/views/task-not-found.view";
import { dateLabel, dayLabel, fromISODate, toISODate } from "@/lib/dates";
import type { Task, TimeOfDay } from "@/models/task.model";

const PERIODS: { key: TimeOfDay; label: string }[] = [
  { key: "morning", label: "Mañana" },
  { key: "midday", label: "Mediodía" },
  { key: "afternoon", label: "Tarde" },
  { key: "evening", label: "Noche" },
];

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;

function AutoField({ value, onCommit, label, className, placeholder }: { value: string; onCommit: (value: string) => void; label: string; className: string; placeholder?: string }) {
  const [draft, setDraft] = useState(value);
  const [editing, setEditing] = useState(false);

  if (!editing && hasLink(value)) {
    return (
      <div
        role="textbox"
        aria-label={label}
        tabIndex={0}
        onClick={() => setEditing(true)}
        onFocus={(event) => event.target === event.currentTarget && setEditing(true)}
        className={`w-full cursor-text whitespace-pre-wrap break-words outline-none ${className}`}
      >
        <LinkifiedText text={value} />
      </div>
    );
  }
  return (
    <textarea
      aria-label={label}
      placeholder={placeholder}
      rows={1}
      autoFocus={editing}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        setEditing(false);
        if (draft !== value) onCommit(draft);
      }}
      className={`field-sizing-content w-full resize-none bg-transparent outline-none placeholder:text-faint ${className}`}
    />
  );
}

function DatePopover({ label, value, onChange, children }: { label: string; value?: string; onChange: (value: string | undefined) => void; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Chip aria-pressed={undefined} aria-label={`${label}: ${value ? dateLabel(value) : "sin fecha"}`}>
          {value ? (children ?? dateLabel(value)) : "Elegir"}
        </Chip>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto space-y-2 p-2">
        <Calendar
          mode="single"
          locale={es}
          weekStartsOn={1}
          selected={value ? fromISODate(value) : undefined}
          defaultMonth={value ? fromISODate(value) : undefined}
          onSelect={(day) => {
            if (day) onChange(toISODate(day));
            setOpen(false);
          }}
        />
        {value && (
          <Button variant="ghost" className="h-10 w-full" onClick={() => { onChange(undefined); setOpen(false); }}>
            Quitar fecha
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function TaskDetailPage() {
  const { id: projectId = "", taskId = "" } = useParams();
  const navigate = useNavigate();
  const task = useTask(taskId);
  const project = useProject(projectId);
  const { tasks } = useTasks();
  const attachments = useAttachments(taskId);
  const editTask = useEditTask();
  const setTaskDone = useSetTaskDone();
  const setPlan = useSetTaskPlan();
  const setDeadline = useSetTaskDeadline();
  const setEssential = useSetTaskEssential();
  const addSubtask = useAddSubtask();
  const deleteTask = useDeleteTask();
  const deleteSubtask = useDeleteSubtask();
  const attachFiles = useAttachFiles();
  const removeAttachment = useRemoveAttachment();
  const { sections } = useSections(projectId);
  const createSection = useCreateSection(projectId);
  const moveToSection = useMoveTaskToSection();
  const [moving, setMoving] = useState(false);
  const [subtaskToDelete, setSubtaskToDelete] = useState<Task | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [menu, setMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notice, setNotice] = useState<string>();

  if (task === undefined || project === undefined) return <PageColumn><div aria-busy="true" className="h-40" /></PageColumn>;

  const backToProject = () => navigate(`/projects/${projectId}`);
  if (task === null || task.projectId !== projectId) {
    return (
      <PageColumn>
        <TaskNotFound onBack={backToProject} onHome={() => navigate("/today")} onProject={backToProject} />
      </PageColumn>
    );
  }

  const subtasks = tasks.filter((sub) => sub.parentId === task.id).sort((a, b) => a.position - b.position);
  const doneSubtasks = subtasks.filter((sub) => sub.status === "completed").length;
  const planLabel = task.plannedDate ? `${dayLabel(task.plannedDate)}${task.timeOfDay ? ` · ${PERIODS.find((p) => p.key === task.timeOfDay)?.label}` : ""}` : undefined;

  const currentSection = sections.find((section) => section.id === task.sectionId);

  const toggleEssential = async (value: boolean) => setNotice(await setEssential(task.id, value));
  const onFiles = async (files: FileList | null) => {
    if (files?.length) setNotice(await attachFiles(task.id, [...files]));
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <PageColumn>
      <DetailBar onBack={backToProject} onMore={() => setMenu(true)} />
      {project && (
        <Chip className="h-8 gap-1.5 self-start px-3 text-[13px] [&_svg]:size-4" onClick={backToProject}>
          <RiFolderLine aria-hidden />
          {project.name}
        </Chip>
      )}
      <h1 className="mt-3.5 mb-2">
        <AutoField key={`t-${task.updatedAt}`} label="Título" value={task.title} onCommit={(title) => void editTask(task.id, { title })} className="font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.02em] text-foreground" />
      </h1>
      <AutoField key={`d-${task.updatedAt}`} label="Descripción" placeholder="Añadir descripción" value={task.description ?? ""} onCommit={(description) => void editTask(task.id, { description })} className="text-[15px] leading-normal text-muted-foreground" />

      <div className="mt-5 flex flex-col">
        <PropertyRow icon={<RiCalendarLine aria-hidden />} label="Planificada">
          <Popover>
            <PopoverTrigger asChild>
              <Chip aria-pressed={undefined} aria-label={`Planificada: ${planLabel ?? "sin planificar"}`}>{planLabel ?? "Elegir"}</Chip>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto space-y-2 p-2">
              <Calendar
                mode="single"
                locale={es}
                weekStartsOn={1}
                selected={task.plannedDate ? fromISODate(task.plannedDate) : undefined}
                defaultMonth={task.plannedDate ? fromISODate(task.plannedDate) : undefined}
                onSelect={(day) => day && void setPlan(task.id, toISODate(day), task.timeOfDay)}
              />
              {task.plannedDate && (
                <>
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {PERIODS.map(({ key, label }) => (
                      <Chip key={key} selected={task.timeOfDay === key} className="h-8 px-3 text-[13px]" onClick={() => void setPlan(task.id, task.plannedDate, task.timeOfDay === key ? undefined : key)}>
                        {label}
                      </Chip>
                    ))}
                  </div>
                  <Button variant="ghost" className="h-10 w-full" onClick={() => void setPlan(task.id, undefined)}>Quitar planificación</Button>
                </>
              )}
            </PopoverContent>
          </Popover>
        </PropertyRow>
        <PropertyRow icon={<RiStarLine aria-hidden />} label="Esencial ese día">
          <Switch aria-label="Esencial ese día" checked={task.essential} disabled={!task.plannedDate} onCheckedChange={(value) => void toggleEssential(value)} />
        </PropertyRow>
        <PropertyRow icon={<RiFolderLine aria-hidden />} label="Sección">
          <Chip aria-pressed={undefined} aria-label={`Sección: ${currentSection?.name ?? "sin sección"}`} onClick={() => setMoving(true)}>{currentSection?.name ?? "Sin sección"}</Chip>
        </PropertyRow>
        <PropertyRow icon={<RiAlbumLine aria-hidden />} label="Fecha límite">
          <DatePopover label="Fecha límite" value={task.deadline} onChange={(value) => void setDeadline(task.id, value)} />
        </PropertyRow>
      </div>
      {notice && <div className="mt-2"><InlineError>{notice}</InlineError></div>}

      <CountHeading label="Subtareas" count={subtasks.length === 0 ? 0 : `${doneSubtasks}/${subtasks.length}`} />
      <ul className="flex flex-col">
        {subtasks.map((sub) => (
          <SubtaskRow key={sub.id} title={sub.title} checked={sub.status === "completed"} onCheckedChange={(done) => void setTaskDone(sub.id, done)} onRemove={() => setSubtaskToDelete(sub)} className="pl-[5px]" />
        ))}
      </ul>
      <InlineAction icon={<RiAddLine aria-hidden />} className="mt-0 gap-[13px] [&_svg]:size-[18px]" onClick={() => setAddingSubtask(true)}>Añadir subtarea</InlineAction>

      <CountHeading label="Adjuntos" count={attachments.length} />
      {attachments.map((file) => (
        <div key={file.id} className="flex items-center">
          <div className="flex-1">
            <AttachmentRow name={file.name} status={{ kind: "size", text: formatSize(file.size) }} />
          </div>
          <IconButton aria-label={`Quitar ${file.name}`} onClick={() => void removeAttachment(file.id)}>
            <RiCloseLine aria-hidden />
          </IconButton>
        </div>
      ))}
      <input ref={fileInput} type="file" multiple hidden aria-label="Elegir archivos" onChange={(event) => void onFiles(event.target.files)} />
      <InlineAction icon={<RiAddLine aria-hidden />} className="mt-0 gap-[13px] [&_svg]:size-[18px]" onClick={() => fileInput.current?.click()}>Adjuntar archivo</InlineAction>

      <BottomSheet open={addingSubtask} onOpenChange={setAddingSubtask} label="Nueva subtarea">
        {addingSubtask && (
          <ComposeForm
            placeholder="Nueva subtarea"
            withDescription={false}
            onSave={async (title) => {
              await addSubtask(task as Task, title);
              setAddingSubtask(false);
            }}
          />
        )}
      </BottomSheet>

      <MoveToSectionSheet
        key={`${task.id}-${task.sectionId ?? "none"}-${moving}`}
        open={moving}
        onOpenChange={setMoving}
        taskTitle={task.title}
        sections={sections}
        current={currentSection?.id}
        projectName={project?.name ?? ""}
        onMove={async (sectionId) => {
          await moveToSection(task.id, sectionId);
          setMoving(false);
        }}
        onCreateSection={async (name) => {
          const result = await createSection(name);
          return typeof result === "string" ? result : undefined;
        }}
      />

      <BottomSheet open={menu} onOpenChange={setMenu} label="Opciones de la tarea" className="gap-2 pb-7">
        <SheetHeading eyebrow="Tarea" title={task.title} />
        <ActionRow icon={<RiDeleteBinLine aria-hidden />} tone="danger" onClick={() => { setMenu(false); setConfirmDelete(true); }}>Eliminar tarea</ActionRow>
      </BottomSheet>

      <ConfirmDialog
        open={subtaskToDelete !== null}
        onOpenChange={(open) => !open && setSubtaskToDelete(null)}
        title={`¿Eliminar “${subtaskToDelete?.title ?? ""}”?`}
        description="Se elimina la subtarea. No se puede deshacer."
      >
        <Button variant="danger" onClick={async () => { if (subtaskToDelete) await deleteSubtask(subtaskToDelete.id); setSubtaskToDelete(null); }}>Eliminar subtarea</Button>
        <Button variant="ghost" onClick={() => setSubtaskToDelete(null)}>Cancelar</Button>
      </ConfirmDialog>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`¿Eliminar “${task.title}”?`}
        description="Se eliminan también sus subtareas y adjuntos. No se puede deshacer."
      >
        <Button variant="danger" onClick={async () => { await deleteTask(task.id); navigate(`/projects/${projectId}`, { replace: true }); }}>Eliminar tarea</Button>
        <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
      </ConfirmDialog>
    </PageColumn>
  );
}
