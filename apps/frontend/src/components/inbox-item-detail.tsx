import { useState } from "react";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarLine,
  RiCheckLine,
  RiCheckboxCircleLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiFolderLine,
  RiLightbulbLine,
  RiLoader4Line,
  RiPencilLine,
  RiTimeLine,
  type RemixiconComponentType,
} from "@remixicon/react";
import { useInbox } from "@/hooks/use-inbox";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useProjects } from "@/hooks/use-projects";
import type { Task } from "@/models/task.model";
import { cn } from "@/lib/utils";
import type { InboxDecision } from "@/services/task.service";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

const NONE = "none";
type Props = {
  task: Task | null;
  onClose: () => void;
  /** Se llama tras una decisión exitosa, con un mensaje breve de confirmación. */
  onProcessed: (message: string) => void;
};

/** Procesar un elemento de Inbox: primero decidir, después (opcional) organizar. */
export function InboxItemDetail({ task, onClose, onProcessed }: Props) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  // Se remonta por elemento para reiniciar paso y ediciones.
  const body = task ? <Processor key={task.id} task={task} onClose={onClose} onProcessed={onProcessed} /> : null;
  const onOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return isDesktop ? (
    <Dialog open={!!task} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="gap-0 rounded-md border-0 bg-card p-0 shadow-none sm:max-w-md" onOpenAutoFocus={(event) => event.preventDefault()}>
        <DialogTitle className="sr-only">Procesar Inbox</DialogTitle>
        <DialogDescription className="sr-only">Decidí qué hacer con lo que capturaste.</DialogDescription>
        {body}
      </DialogContent>
    </Dialog>
  ) : (
    <Sheet open={!!task} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" showCloseButton={false} className="max-h-[92svh] gap-0 overflow-y-auto rounded-t-md border-0 bg-card p-0 shadow-none">
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-muted-foreground/30" aria-hidden />
        <SheetTitle className="sr-only">Procesar Inbox</SheetTitle>
        <SheetDescription className="sr-only">Decidí qué hacer con lo que capturaste.</SheetDescription>
        {body}
      </SheetContent>
    </Sheet>
  );
}

function capturedLabel(createdAt: string) {
  const date = new Date(createdAt);
  const time = date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
  const today = new Date();
  const yesterday = new Date(today.getTime() - 86_400_000);
  const day =
    date.toDateString() === today.toDateString()
      ? "hoy"
      : date.toDateString() === yesterday.toDateString()
        ? "ayer"
        : date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
  return `Capturado ${day} · ${time} hs`;
}

function Processor({ task, onClose, onProcessed }: Omit<Props, "task"> & { task: Task }) {
  const { updateTask, decide } = useInbox();
  const [step, setStep] = useState<"decide" | "organize">("decide");
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const edits = { title, description: description.trim() || undefined };
  const titleEmpty = title.trim().length === 0;

  const run = async (action: () => Promise<unknown>) => {
    if (titleEmpty) {
      setEditing(true);
      setError("El título no puede quedar vacío.");
      return false;
    }
    setBusy(true);
    setError(null);
    try {
      await action();
      return true;
    } catch {
      setError("No se pudo guardar. Tus cambios siguen acá, probá de nuevo.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  // Guardar ediciones de texto: el elemento permanece en Inbox.
  const finishEditing = async () => {
    const dirty = title !== task.title || (edits.description ?? "") !== (task.description ?? "");
    if (!dirty || (await run(() => updateTask(task.id, edits)))) setEditing(false);
  };

  const resolve = async (decision: InboxDecision, message: string) => {
    if (await run(() => decide(task.id, decision, edits))) {
      onProcessed(message);
      onClose();
    }
  };

  return (
    <div className="flex flex-col pb-[max(1rem,env(safe-area-inset-bottom))]">
      {step === "decide" ? (
        <>
          <header className="flex items-center justify-between px-5 pt-4 pb-2">
            <span className="text-xs font-semibold tracking-widest text-muted-foreground">PROCESAR INBOX</span>
            <CloseButton onClose={onClose} />
          </header>

          <section className="px-5 pb-5" aria-label="Contenido capturado">
            {editing ? (
              <div className="flex flex-col gap-2">
                <Input
                  autoFocus
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  aria-label="Título"
                  aria-invalid={titleEmpty}
                  className="h-auto px-3 py-2 text-lg font-semibold md:text-lg"
                />
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  aria-label="Descripción"
                  placeholder="Agregar descripción"
                  rows={3}
                  className="max-h-[30svh] resize-none"
                />
                <div className="flex justify-end">
                  <Button type="button" size="sm" onClick={() => void finishEditing()} disabled={busy}>
                    Listo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl leading-snug font-semibold whitespace-pre-line">{title}</h2>
                  {edits.description && (
                    <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">{edits.description}</p>
                  )}
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <RiTimeLine className="size-3.5" aria-hidden />
                    {capturedLabel(task.createdAt)}
                  </p>
                </div>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => setEditing(true)} aria-label="Editar título y descripción">
                  <RiPencilLine aria-hidden />
                </Button>
              </div>
            )}
          </section>

          <h3 className="px-5 pb-2 text-base font-medium">¿Qué querés hacer con esto?</h3>
          <ul className="flex flex-col px-3">
            <ActionRow
              Icon={RiCheckboxCircleLine}
              title="Convertir en tarea"
              hint="Organizar y sacar de Inbox"
              chevron
              primary
              disabled={busy}
              onClick={() => (titleEmpty ? void run(async () => {}) : setStep("organize"))}
            />
            <ActionRow
              Icon={RiLightbulbLine}
              title="Tal vez"
              hint="Guardar para más adelante"
              disabled={busy}
              onClick={() => void resolve({ type: "someday" }, "Guardado en Tal vez")}
            />
            <ActionRow
              Icon={RiCheckLine}
              title="Completar"
              hint="Marcar como realizado"
              disabled={busy}
              onClick={() => void resolve({ type: "complete" }, "Marcado como completado")}
            />
            <ActionRow
              Icon={RiDeleteBinLine}
              title="Descartar"
              hint="Enviar a descartados"
              destructive
              disabled={busy}
              onClick={() => void resolve({ type: "discard" }, "Enviado a descartados")}
            />
          </ul>
          <p role="alert" className="px-5 pt-2 text-sm text-destructive empty:hidden">{error}</p>
        </>
      ) : (
        <OrganizeStep
          title={title}
          busy={busy}
          error={error}
          onBack={() => {
            setError(null);
            setStep("decide");
          }}
          onClose={onClose}
          onSave={(organization) => resolve({ type: "activate", ...organization }, "Tarea guardada")}
        />
      )}
    </div>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <Button type="button" variant="ghost" size="icon-sm" onClick={onClose} aria-label="Cerrar">
      <RiCloseLine aria-hidden />
    </Button>
  );
}

function ActionRow({
  Icon,
  title,
  hint,
  chevron,
  primary,
  destructive,
  disabled,
  onClick,
}: {
  Icon: RemixiconComponentType;
  title: string;
  hint: string;
  chevron?: boolean;
  primary?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex min-h-14 w-full items-center gap-3 rounded-sm px-2 py-2 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
      >
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-sm bg-muted text-muted-foreground",
            primary && "text-primary",
            destructive && "text-destructive"
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn("block text-sm font-medium", destructive && "text-destructive")}>{title}</span>
          <span className="block text-xs text-muted-foreground">{hint}</span>
        </span>
        {chevron && <RiArrowRightSLine className="size-5 text-muted-foreground" aria-hidden />}
      </button>
    </li>
  );
}

type Organization = { projectId?: string; deadline?: string };

function OrganizeStep({
  title,
  busy,
  error,
  onBack,
  onClose,
  onSave,
}: {
  title: string;
  busy: boolean;
  error: string | null;
  onBack: () => void;
  onClose: () => void;
  onSave: (organization: Organization) => void;
}) {
  const { projects } = useProjects();
  const [projectId, setProjectId] = useState(NONE);
  const [deadline, setDeadline] = useState("");

  return (
    <>
      <header className="grid grid-cols-[1fr_auto_1fr] items-center px-3 pt-3 pb-2">
        <Button type="button" variant="ghost" size="sm" className="justify-self-start" onClick={onBack} disabled={busy}>
          <RiArrowLeftSLine aria-hidden />
          Volver
        </Button>
        <h2 className="text-base font-semibold">Convertir en tarea</h2>
        <span className="justify-self-end">
          <CloseButton onClose={onClose} />
        </span>
      </header>

      <p className="mx-5 mb-3 line-clamp-2 text-sm text-muted-foreground whitespace-pre-line">{title}</p>

      <div className="flex flex-col divide-y divide-sidebar-border px-5">
        <div className="flex min-h-14 items-center gap-3">
          <RiFolderLine className="size-5 text-muted-foreground" aria-hidden />
          <span className="flex-1 text-sm">Proyecto</span>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="w-auto max-w-48 border-0 bg-transparent text-muted-foreground shadow-none outline-none hover:bg-muted focus-visible:bg-muted focus-visible:ring-0 dark:bg-transparent dark:hover:bg-muted dark:focus-visible:bg-muted focus-visible:ring-0" aria-label="Proyecto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value={NONE}>Sin proyecto</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex min-h-14 items-center gap-3">
          <RiCalendarLine className="size-5 text-muted-foreground" aria-hidden />
          <label htmlFor="inbox-deadline" className="flex-1 text-sm">Deadline</label>
          <Input
            id="inbox-deadline"
            type="date"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
            className="w-auto border-0 bg-transparent text-muted-foreground shadow-none outline-none hover:bg-muted focus-visible:bg-muted focus-visible:ring-0 dark:bg-transparent dark:hover:bg-muted dark:focus-visible:bg-muted"
          />
          {deadline && (
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => setDeadline("")} aria-label="Quitar deadline">
              <RiCloseLine aria-hidden />
            </Button>
          )}
        </div>
      </div>

      <p role="alert" className="px-5 pt-1 text-sm text-destructive empty:hidden">{error}</p>

      <div className="px-5 pt-4">
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={busy}
          aria-busy={busy}
          onClick={() =>
            onSave({
              projectId: projectId === NONE ? undefined : projectId,
              deadline: deadline || undefined,
            })
          }
        >
          {busy ? <RiLoader4Line className="animate-spin" aria-hidden /> : <RiCheckLine aria-hidden />}
          Guardar tarea
        </Button>
        <p className="pt-3 text-center text-xs text-muted-foreground">Al guardar, la tarea sale de Inbox.</p>
      </div>
    </>
  );
}
