import { Button } from "@/shared/components/atoms/button"
import { ConfirmDialog } from "@/shared/components/molecules/confirm-dialog"

type DeleteAllModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteAllModal({ open, onOpenChange, onConfirm }: DeleteAllModalProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="¿Eliminar todos los datos?"
      description="Esta acción es irreversible. Se borrarán todos los datos locales de Dailo y los ajustes volverán a sus valores predeterminados."
    >
      <Button variant="destructive" onClick={onConfirm}>Eliminar</Button>
      <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
    </ConfirmDialog>
  )
}
