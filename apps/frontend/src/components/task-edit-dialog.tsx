import { useState, type FormEvent } from "react";
import type { Task } from "@/models/task.model";
import { ValidationError } from "@/services/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResponsiveDialog } from "@/components/responsive-dialog";

type Props = {
  task: Task | null;
  onClose: () => void;
  onSubmit: (id: string, changes: { title: string; description: string }) => Promise<unknown>;
};

export function TaskEditDialog({ task, onClose, onSubmit }: Props) {
  return (
    <ResponsiveDialog open={!!task} onOpenChange={(open) => !open && onClose()} title="Editar tarea" description="Título y descripción de la tarea.">
      {task && <Form key={task.id} task={task} onSubmit={onSubmit} onClose={onClose} />}
    </ResponsiveDialog>
  );
}

function Form({ task, onSubmit, onClose }: { task: Task } & Pick<Props, "onSubmit" | "onClose">) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await onSubmit(task.id, { title, description });
      onClose();
    } catch (cause) {
      setError(cause instanceof ValidationError ? "La tarea necesita un título." : "No se pudo guardar. Tus cambios siguen acá, probá de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <Input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} aria-label="Título" className="h-11 text-base" />
      <Textarea value={description} onChange={(event) => setDescription(event.target.value)} aria-label="Descripción" placeholder="Descripción (opcional)" rows={4} className="max-h-[30svh] resize-none" />
      <p role="alert" className="text-sm text-destructive empty:hidden">{error}</p>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>
          Cancelar
        </Button>
        <Button type="submit" disabled={busy}>Guardar</Button>
      </div>
    </form>
  );
}
