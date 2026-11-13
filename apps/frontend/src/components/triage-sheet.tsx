import { useState } from "react";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiFolderLine,
  RiLightbulbLine,
  RiLoader4Line,
  RiArrowRightLine,
} from "@remixicon/react";
import { useInbox } from "@/hooks/use-inbox";
import { useProjects } from "@/hooks/use-projects";
import { useSomeday } from "@/hooks/use-someday";
import type { Task } from "@/models/task.model";
import { Button } from "@/components/ui/button";
import { ChoiceRow } from "@/components/choice-row";
import { DateField } from "@/components/date-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/toast";
import { ErrorView } from "@/components/wrappers/error-view";

export type TriageSource = "inbox" | "someday";
type Step = "choose" | "plan" | "someday";

type Props = { task: Task | null; source: TriageSource; onClose: () => void };

/** Bottom sheet de triage: ¿qué hacemos con esto? Cada camino saca el elemento de su lista. */
export function TriageSheet({ task, source, onClose }: Props) {
  return (
    <Sheet open={!!task} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" showCloseButton={false} className="max-h-[92svh] gap-0 overflow-y-auto p-0">
        <SheetTitle className="sr-only">Procesar elemento</SheetTitle>
        <SheetDescription className="sr-only">Elegí qué hacer con este elemento.</SheetDescription>
        {task && <Flow key={task.id} task={task} source={source} onClose={onClose} />}
      </SheetContent>
    </Sheet>
  );
}

function Flow({ task, source, onClose }: Props & { task: Task }) {
  const [step, setStep] = useState<Step>("choose");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const notify = useToast();
  const inbox = useInbox();
  const someday = useSomeday();
  const label = source === "inbox" ? "Del inbox" : "De tal vez";
  const back = source === "inbox" ? "inbox" : "someday";

  // Ejecuta una acción; si sale bien, avisa con "Deshacer" y cierra.
  const run = async (action: () => Promise<unknown>, message: string, undo?: () => Promise<unknown>) => {
    setBusy(true);
    setError(false);
    try {
      await action();
      notify({ message, actionLabel: undo ? "Deshacer" : undefined, onAction: () => void undo?.() });
      onClose();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  if (step === "plan")
    return <PlanForm task={task} busy={busy} error={error} onBack={() => setStep("choose")} onSubmit={(input, project) => void run(() => inbox.plan(task.id, input), `Movida a ${project}`)} />;
  if (step === "someday")
    return (
      <SomedayForm
        task={task}
        busy={busy}
        error={error}
        onBack={() => setStep("choose")}
        onSubmit={(edits) => void run(() => inbox.decide(task.id, { type: "someday" }, edits), "Guardada en Tal vez", () => inbox.restore(task.id, "inbox"))}
      />
    );

  return (
    <div className="flex flex-col gap-4 px-6 pt-3 pb-[max(1.75rem,env(safe-area-inset-bottom))]">
      <span aria-hidden className="h-1 w-10 self-center rounded-full bg-border" />
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold tracking-[0.06em] text-[var(--forest-700)] uppercase dark:text-muted-foreground">{label}</span>
        <p className="text-[17px] leading-snug font-medium whitespace-pre-line">{task.title}</p>
        {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
      </div>
      <h2 className="font-serif text-2xl leading-tight font-semibold tracking-tight">
        {source === "inbox" ? "¿Qué hacemos con" : "¿Y ahora,"} <em className="font-medium">{source === "inbox" ? "esto?" : "qué?"}</em>
      </h2>
      <div className="flex flex-col gap-2.5">
        {source === "inbox" && (
          <ChoiceRow
            Icon={RiCheckLine}
            title="Hacerla ahora"
            hint="Menos de 2 minutos: hacela y tachala."
            disabled={busy}
            onClick={() => void run(() => inbox.decide(task.id, { type: "complete" }), `Tachada: ${task.title}`, () => inbox.restore(task.id, "inbox"))}
          />
        )}
        <ChoiceRow Icon={RiFolderLine} title="Planificarla" hint="Pasa a un proyecto con una acción clara." disabled={busy} onClick={() => setStep("plan")} />
        {source === "inbox" && <ChoiceRow Icon={RiLightbulbLine} title="Tal vez" hint="Tiene sentido, pero no aporta ahora." disabled={busy} onClick={() => setStep("someday")} />}
        <ChoiceRow
          Icon={RiDeleteBinLine}
          title="Descartar"
          hint={source === "inbox" ? "No tiene sentido y no la voy a hacer." : "Ya no tiene sentido para mí."}
          destructive
          disabled={busy}
          onClick={() => void run(() => someday.discard(task.id), `Descartada: ${task.title}`, () => inbox.restore(task.id, back))}
        />
      </div>
      <ErrorView message={error ? "No se pudo guardar. Probá de nuevo." : null} />
    </div>
  );
}

function StepHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <Button type="button" variant="outline" size="icon" onClick={onBack} aria-label="Volver">
        <RiArrowLeftLine aria-hidden />
      </Button>
      <span className="text-base font-semibold">{title}</span>
    </div>
  );
}

function Field({ id, label, optional, children }: { id: string; label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label} {optional && <span className="font-normal text-muted-foreground">· opcional</span>}
      </Label>
      {children}
    </div>
  );
}

function Footer({ children }: { children: React.ReactNode }) {
  return <div className="sticky bottom-0 border-t bg-card px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">{children}</div>;
}

type FormProps = { task: Task; busy: boolean; error: boolean; onBack: () => void };

function SomedayForm({ task, busy, error, onBack, onSubmit }: FormProps & { onSubmit: (edits: { title: string; description: string }) => void }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  return (
    <form onSubmit={(event) => { event.preventDefault(); onSubmit({ title, description }); }}>
      <div className="flex flex-col gap-5 px-6 pt-5 pb-6">
        <StepHeader title="Mover a Tal vez" onBack={onBack} />
        <Field id="sd-title" label="Título">
          <Input id="sd-title" value={title} onChange={(event) => setTitle(event.target.value)} aria-invalid={error && !title.trim()} />
        </Field>
        <Field id="sd-note" label="Nota" optional>
          <Textarea id="sd-note" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="¿Qué querías recordar?" className="resize-none" />
        </Field>
        <ErrorView message={error ? "No se pudo guardar. Probá de nuevo." : null} />
      </div>
      <Footer>
        <Button type="submit" size="lg" className="w-full" disabled={busy || !title.trim()}>
          Guardar en Tal vez
          <RiArrowRightLine aria-hidden />
        </Button>
      </Footer>
    </form>
  );
}

type Draft = { key: number; title: string; deadline?: string };

function PlanForm({ task, busy, error, onBack, onSubmit }: FormProps & { onSubmit: (input: { title: string; description: string; projectId: string; deadline?: string; subtasks: { title: string; deadline?: string }[] }, projectName: string) => void }) {
  const { projects } = useProjects();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [projectId, setProjectId] = useState("");
  const [deadline, setDeadline] = useState<string | undefined>();
  const [subtasks, setSubtasks] = useState<Draft[]>([]);
  const project = projects.find((item) => item.id === projectId);

  const updateSubtask = (key: number, changes: Partial<Draft>) => setSubtasks((list) => list.map((item) => (item.key === key ? { ...item, ...changes } : item)));

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (project) onSubmit({ title, description, projectId, deadline, subtasks: subtasks.map(({ title: t, deadline: d }) => ({ title: t, deadline: d })) }, project.name);
      }}
    >
      <div className="flex flex-col gap-5 px-6 pt-5 pb-6">
        <StepHeader title="Mover a proyecto" onBack={onBack} />
        <Field id="pl-title" label="Título">
          <Input id="pl-title" value={title} onChange={(event) => setTitle(event.target.value)} />
        </Field>
        <Field id="pl-desc" label="Descripción" optional>
          <Textarea id="pl-desc" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="resize-none" />
        </Field>
        <Field id="pl-project" label="Proyecto">
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger id="pl-project" className="w-full">
              <SelectValue placeholder={projects.length ? "Elegí un proyecto" : "Todavía no hay proyectos"} />
            </SelectTrigger>
            <SelectContent>
              {projects.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field id="pl-deadline" label="Deadline" optional>
          <DateField value={deadline} onChange={setDeadline} label="Deadline" />
        </Field>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">
            Subtareas <span className="font-normal text-muted-foreground">· opcional</span>
          </span>
          <ul className="flex flex-col gap-2">
            {subtasks.map((item) => (
              <li key={item.key} className="flex items-center gap-2">
                <Input value={item.title} onChange={(event) => updateSubtask(item.key, { title: event.target.value })} placeholder="Subtarea" aria-label="Título de la subtarea" className="h-10 flex-1" />
                <DateField compact value={item.deadline} onChange={(value) => updateSubtask(item.key, { deadline: value })} label="Deadline de la subtarea" placeholder="Sin fecha" />
              </li>
            ))}
          </ul>
          <Button type="button" variant="link" className="h-9 self-start" onClick={() => setSubtasks((list) => [...list, { key: Date.now() + list.length, title: "" }])}>
            <RiAddLine aria-hidden />
            Agregar subtarea
          </Button>
        </div>
        <ErrorView message={error ? "No se pudo guardar. Probá de nuevo." : null} />
      </div>
      <Footer>
        <Button type="submit" size="lg" className="w-full" disabled={busy || !project || !title.trim()} aria-busy={busy}>
          {busy && <RiLoader4Line className="animate-spin" aria-hidden />}
          {project ? `Mover a ${project.name}` : "Elegí un proyecto"}
          <RiArrowRightLine aria-hidden />
        </Button>
      </Footer>
    </form>
  );
}
