import { Button } from "@/shared/components/atoms/button"
import { ConfirmDialog } from "@/shared/components/molecules/confirm-dialog"

type CompleteWithSubtasksModalProps = {
  title?: string
  pendingCount: number
  onClose: () => void
  onComplete: (withSubtasks: boolean) => void
}

export function CompleteWithSubtasksModal({ title, pendingCount, onClose, onComplete }: CompleteWithSubtasksModalProps) {
  return (
    <ConfirmDialog
      open={title !== undefined}
      onOpenChange={(open) => !open && onClose()}
      title={`Quedan ${pendingCount} subtareas sin hacer`}
      description={`¿Querés completarlas junto con “${title ?? ""}”?`}
    >
      <Button onClick={() => onComplete(true)}>Completar todo</Button>
      <Button variant="ghost" className="h-11 px-2" onClick={() => onComplete(false)}>Solo la tarea</Button>
      <Button variant="ghost" className="h-11 px-2 text-muted-foreground" onClick={onClose}>Cancelar</Button>
    </ConfirmDialog>
  )
}
