import { useState } from "react";
import type { Project } from "@/models/project.model";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ErrorView } from "@/components/wrappers/error-view";

type Props = {
  project: Project | null;
  onClose: () => void;
  onConfirm: (project: Project) => Promise<unknown>;
};

export function DeleteProjectDialog({ project, onClose, onConfirm }: Props) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const confirm = async () => {
    if (!project) return;
    setBusy(true);
    setFailed(false);
    try {
      await onConfirm(project);
      onClose();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AlertDialog open={!!project} onOpenChange={(open) => !open && !busy && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar “{project?.name}”?</AlertDialogTitle>
          <AlertDialogDescription>
            Sus secciones se eliminan. Las tareas se conservan, sin proyecto ni sección.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ErrorView message={failed ? "No se pudo eliminar. Probá de nuevo." : null} />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancelar</AlertDialogCancel>
          <Button type="button" variant="destructive" onClick={() => void confirm()} disabled={busy}>
            Eliminar proyecto
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
