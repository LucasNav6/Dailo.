import { Button } from "@/shared/components/atoms/button"
import { ConfirmDialog } from "@/shared/components/molecules/confirm-dialog"

type DeleteTaskModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onConfirm: () => void
}

export function DeleteTaskModal({ open, onOpenChange, title, onConfirm }: DeleteTaskModalProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`¿Eliminar “${title}”?`}
      description="Se eliminan también sus subtareas y adjuntos. No se puede deshacer."
    >
      <Button variant="danger" onClick={onConfirm}>Eliminar tarea</Button>
      <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
    </ConfirmDialog>
  )
}
