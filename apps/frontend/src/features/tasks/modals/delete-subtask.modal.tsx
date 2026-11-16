import { Button } from "@/shared/components/atoms/button"
import { ConfirmDialog } from "@/shared/components/molecules/confirm-dialog"

type DeleteSubtaskModalProps = {
  title?: string
  onClose: () => void
  onConfirm: () => void
}

export function DeleteSubtaskModal({ title, onClose, onConfirm }: DeleteSubtaskModalProps) {
  return (
    <ConfirmDialog
      open={title !== undefined}
      onOpenChange={(open) => !open && onClose()}
      title={`¿Eliminar “${title ?? ""}”?`}
      description="Se elimina la subtarea. No se puede deshacer."
    >
      <Button variant="danger" onClick={onConfirm}>Eliminar subtarea</Button>
      <Button variant="ghost" onClick={onClose}>Cancelar</Button>
    </ConfirmDialog>
  )
}
