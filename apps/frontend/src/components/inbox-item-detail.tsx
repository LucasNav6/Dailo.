import { useState, type FormEvent } from "react";
import { RiCheckLine, RiCloseLine, RiDeleteBinLine, RiLightbulbLine } from "@remixicon/react";
import { useInbox } from "@/hooks/use-inbox";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useProjects } from "@/hooks/use-projects";
import type { Task, TimeOfDay } from "@/models/task.model";
import type { InboxDecision } from "@/services/task.service";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

const NONE = "none";
const TIMES: { value: TimeOfDay; label: string }[] = [
  { value: "morning", label: "Mañana" },
  { value: "midday", label: "Mediodía" },
  { value: "afternoon", label: "Tarde" },
  { value: "evening", label: "Noche" },
];

type Props = { task: Task | null; onClose: () => void };

/** Detalle para procesar un elemento de Inbox. Editar nunca lo saca de Inbox. */
export function InboxItemDetail({ task, onClose }: Props) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  // El contenido se remonta por elemento para reiniciar su estado local.
  const body = task ? <DetailForm key={task.id} task={task} onClose={onClose} /> : null;
  const onOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return isDesktop ? (
    <Dialog open={!!task} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg" onOpenAutoFocus={(event) => event.preventDefault()}>
        <DialogTitle className="sr-only">Procesar elemento</DialogTitle>
        <DialogDescription className="sr-only">Editá el elemento y decidí qué hacer con él.</DialogDescription>
        {body}
      </DialogContent>
    </Dialog>
  ) : (
    <Sheet open={!!task} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92svh] gap-0 overflow-y-auto rounded-t-2xl p-0">
        <SheetTitle className="sr-only">Procesar elemento</SheetTitle>
        <SheetDescription className="sr-only">Editá el elemento y decidí qué hacer con él.</SheetDescription>
        {body}
      </SheetContent>
    </Sheet>
  );
}

function DetailForm({ task, onClose }: Props & { task: Task }) {
  const { updateTask, decide } = useInbox();
  const { projects } = useProjects();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [projectId, setProjectId] = useState<string>(NONE);
  const [plannedDate, setPlannedDate] = useState("");
  const [timeOfDay, setTimeOfDay] = useState<string>(NONE);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const edits = { title, description: description.trim() ? description.trim() : undefined };
  const dirty = title !== task.title || (edits.description ?? "") !== (task.description ?? "");
  const canDecide = title.trim().length > 0 && !busy;

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError(false);
    try {
      await action();
      return true;
    } catch {
      setError(true);
      return false;
    } finally {
      setBusy(false);
    }
  };

  // Guarda los cambios de texto y permanece en Inbox.
  const save = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!dirty || !canDecide) return;
    await run(() => updateTask(task.id, edits));
  };

  const resolve = async (decision: InboxDecision) => {
    if (await run(() => decide(task.id, decision, edits))) onClose();
  };

  const activate = () =>
    resolve({
      type: "activate",
      projectId: projectId === NONE ? undefined : projectId,
      plannedDate: plannedDate || undefined,
      timeOfDay: timeOfDay === NONE ? undefined : (timeOfDay as TimeOfDay),
    });

  return (
    <form onSubmit={save} className="flex flex-col gap-4 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onBlur={() => void save()}
        aria-label="Título"
        aria-invalid={title.trim().length === 0}
        className="h-auto border-0 bg-transparent px-0 text-lg font-medium shadow-none focus-visible:ring-0 dark:bg-transparent md:text-lg"
      />
      <Textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        onBlur={() => void save()}
        aria-label="Descripción"
        placeholder="Agregá una descripción…"
        rows={4}
        className="max-h-[30svh] resize-none"
      />

      <fieldset className="grid grid-cols-2 gap-3">
        <legend className="mb-2 text-sm font-medium">Organizar (opcional)</legend>
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger className="col-span-2 w-full" aria-label="Proyecto">
            <SelectValue placeholder="Proyecto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>Sin proyecto</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={plannedDate}
          onChange={(event) => setPlannedDate(event.target.value)}
          aria-label="Fecha planificada"
        />
        <Select value={timeOfDay} onValueChange={setTimeOfDay} disabled={!plannedDate}>
          <SelectTrigger className="w-full" aria-label="Franja horaria">
            <SelectValue placeholder="Franja" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>Sin franja</SelectItem>
            {TIMES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </fieldset>

      <p role="alert" className="text-sm text-destructive empty:hidden">
        {error ? "No se pudo guardar. Tus cambios siguen acá, probá de nuevo." : null}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={activate} disabled={!canDecide}>
          <RiCheckLine aria-hidden />
          {plannedDate ? "Planificar" : "Activar"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => resolve({ type: "someday" })} disabled={!canDecide}>
          <RiLightbulbLine aria-hidden />
          Tal vez
        </Button>
        <Button type="button" variant="secondary" onClick={() => resolve({ type: "complete" })} disabled={!canDecide}>
          Completar
        </Button>
        <Button type="button" variant="ghost" className="text-destructive" onClick={() => resolve({ type: "discard" })} disabled={!canDecide}>
          <RiDeleteBinLine aria-hidden />
          Descartar
        </Button>
        <Button type="button" variant="ghost" size="icon" className="ml-auto" onClick={onClose} aria-label="Cerrar">
          <RiCloseLine aria-hidden />
        </Button>
      </div>
    </form>
  );
}
