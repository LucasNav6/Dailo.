import { useState, type FormEvent } from "react";
import { ValidationError } from "@/services/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/responsive-dialog";

type Props = {
  open: boolean;
  title: string;
  label: string;
  initial?: string;
  submitLabel: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => Promise<unknown>;
};

/** Diálogo de un único campo de nombre (por ejemplo, para secciones). */
export function NameDialog({ open, title, label, initial = "", submitLabel, onOpenChange, onSubmit }: Props) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange} title={title} description={label}>
      {open && <Form key={initial} label={label} initial={initial} submitLabel={submitLabel} onSubmit={onSubmit} onDone={() => onOpenChange(false)} />}
    </ResponsiveDialog>
  );
}

function Form({ label, initial, submitLabel, onSubmit, onDone }: Pick<Props, "label" | "submitLabel" | "onSubmit"> & { initial: string; onDone: () => void }) {
  const [name, setName] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await onSubmit(name);
      onDone();
    } catch (cause) {
      setError(cause instanceof ValidationError ? "Poné un nombre." : "No se pudo guardar. Probá de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <Input autoFocus value={name} onChange={(event) => setName(event.target.value)} aria-label={label} placeholder={label} className="h-11 text-base" />
      <p role="alert" className="text-sm text-destructive empty:hidden">{error}</p>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDone} disabled={busy}>
          Cancelar
        </Button>
        <Button type="submit" disabled={busy}>{submitLabel}</Button>
      </div>
    </form>
  );
}
