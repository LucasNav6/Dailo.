import { useState, type FormEvent } from "react";
import { RiLoader4Line } from "@remixicon/react";
import type { Project } from "@/models/project.model";
import { ValidationError } from "@/services/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { ErrorView } from "@/components/wrappers/error-view";

type Props = {
  open: boolean;
  /** Proyecto a editar; sin él, crea uno nuevo. */
  project?: Project;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: { name: string; description: string }) => Promise<unknown>;
};

export function ProjectFormDialog({ open, project, onOpenChange, onSubmit }: Props) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={project ? "Editar proyecto" : "Nuevo proyecto"}
      description="Nombre y descripción opcional del proyecto."
    >
      {/* Se remonta al abrir para partir de los datos actuales. */}
      {open && <Form key={project?.id ?? "new"} project={project} onSubmit={onSubmit} onDone={() => onOpenChange(false)} />}
    </ResponsiveDialog>
  );
}

function Form({ project, onSubmit, onDone }: Pick<Props, "project" | "onSubmit"> & { onDone: () => void }) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await onSubmit({ name, description });
      onDone();
    } catch (cause) {
      setError(cause instanceof ValidationError ? "Poné un nombre para el proyecto." : "No se pudo guardar. Tus datos siguen acá, probá de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <Input
        autoFocus
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Nombre del proyecto"
        aria-label="Nombre del proyecto"
        aria-invalid={error !== null && name.trim() === ""}
        className="h-11 text-base"
      />
      <Textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Descripción (opcional)"
        aria-label="Descripción"
        rows={3}
        className="max-h-[30svh] resize-none"
      />
      <ErrorView message={error} />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDone} disabled={busy}>
          Cancelar
        </Button>
        <Button type="submit" disabled={busy} aria-busy={busy}>
          {busy && <RiLoader4Line className="animate-spin" aria-hidden />}
          {project ? "Guardar" : "Crear proyecto"}
        </Button>
      </div>
    </form>
  );
}
