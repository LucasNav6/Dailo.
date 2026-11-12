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
import { usePreferences } from "@/hooks/use-settings";
import type { Task, TimeOfDay } from "@/models/task.model";
import { cn } from "@/lib/utils";
import { defaultPreferences, getPeriods, PERIODS } from "@/services/setting.service";
import type { InboxDecision } from "@/services/task.service";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

const NONE = "none";
// Franjas del modelo de tarea ↔ franjas configuradas en Preferencias.
const PERIOD_TO_TIME: Record<(typeof PERIODS)[number]["id"], TimeOfDay> = {
  morning: "morning",
  noon: "midday",
  afternoon: "afternoon",
  night: "evening",
};

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
      <DialogContent showCloseButton={false} className="gap-0 rounded-2xl p-0 sm:max-w-md" onOpenAutoFocus={(event) => event.preventDefault()}>
        <DialogTitle className="sr-only">Procesar Inbox</DialogTitle>
        <DialogDescription className="sr-only">Decidí qué hacer con lo que capturaste.</DialogDescription>
        {body}
      </DialogContent>
    </Dialog>
  ) : (
    <Sheet open={!!task} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" showCloseButton={false} className="max-h-[92svh] gap-0 overflow-y-auto rounded-t-2xl p-0">
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
                  className="h-auto rounded-lg px-3 py-2 text-lg font-semibold md:text-lg"
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
    <Button type="button" variant="ghost" size="icon-sm" className="rounded-full" onClick={onClose} aria-label="Cerrar">
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
        className="flex min-h-14 w-full items-center gap-3 rounded-xl px-2 py-2 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
      >
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground",
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

type Organization = { projectId?: string; plannedDate?: string; timeOfDay?: TimeOfDay };

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
  const { preferences } = usePreferences();
  const ranges = getPeriods(preferences ?? defaultPreferences);
  const [projectId, setProjectId] = useState(NONE);
  const [plannedDate, setPlannedDate] = useState("");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(null);

  const changeDate = (value: string) => {
    setPlannedDate(value);
    if (!value) setTimeOfDay(null);
  };

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

      <div className="flex flex-col divide-y px-5">
        <div className="flex min-h-14 items-center gap-3">
          <RiFolderLine className="size-5 text-muted-foreground" aria-hidden />
          <span className="flex-1 text-sm">Proyecto</span>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="w-auto max-w-48 border-0 bg-transparent text-muted-foreground shadow-none dark:bg-transparent dark:hover:bg-transparent" aria-label="Proyecto">
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
          <label htmlFor="inbox-date" className="flex-1 text-sm">Fecha</label>
          <Input
            id="inbox-date"
            type="date"
            value={plannedDate}
            onChange={(event) => changeDate(event.target.value)}
            className="w-auto border-0 bg-transparent text-muted-foreground shadow-none dark:bg-transparent"
          />
          {plannedDate && (
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => changeDate("")} aria-label="Quitar fecha">
              <RiCloseLine aria-hidden />
            </Button>
          )}
        </div>

        <div className="py-3">
          <div className="flex items-center gap-3 pb-3">
            <RiTimeLine className="size-5 text-muted-foreground" aria-hidden />
            <span id="inbox-period" className="flex-1 text-sm">Franja horaria</span>
            {!plannedDate && <span className="text-xs text-muted-foreground">Elegí una fecha primero</span>}
          </div>
          <div role="radiogroup" aria-labelledby="inbox-period" className="grid grid-cols-2 gap-2">
            {PERIODS.map(({ id, label }) => {
              const value = PERIOD_TO_TIME[id];
              const selected = timeOfDay === value;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={!plannedDate}
                  onClick={() => setTimeOfDay(selected ? null : value)}
                  className={cn(
                    "flex flex-col rounded-xl bg-muted px-3 py-2 text-left outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50",
                    selected && "bg-primary text-primary-foreground"
                  )}
                >
                  <span className="text-sm font-medium">{label}</span>
                  <span className={cn("text-xs", selected ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    {ranges[id].start} – {ranges[id].end}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p role="alert" className="px-5 pt-1 text-sm text-destructive empty:hidden">{error}</p>

      <div className="px-5 pt-3">
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={busy}
          aria-busy={busy}
          onClick={() =>
            onSave({
              projectId: projectId === NONE ? undefined : projectId,
              plannedDate: plannedDate || undefined,
              timeOfDay: plannedDate ? (timeOfDay ?? undefined) : undefined,
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
