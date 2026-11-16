import { Button } from "@/shared/components/atoms/button"
import { Switch } from "@/shared/components/atoms/switch"
import { ConfirmDialog } from "@/shared/components/molecules/confirm-dialog"

type DeleteProjectModalProps = {
  name?: string
  pendingCount: number
  moveToInbox: boolean
  onMoveToInboxChange: (value: boolean) => void
  onClose: () => void
  onConfirm: () => void
}

export function DeleteProjectModal({ name, pendingCount, moveToInbox, onMoveToInboxChange, onClose, onConfirm }: DeleteProjectModalProps) {
  return (
    <ConfirmDialog
      open={name !== undefined}
      onOpenChange={(open) => !open && onClose()}
      title={`¿Eliminar “${name ?? ""}”?`}
      description={`Se eliminan el proyecto${pendingCount > 0 ? ` y sus ${pendingCount} tareas pendientes` : " y sus tareas"}. No se puede deshacer.`}
    >
      <div className="flex items-center gap-3 py-2">
        <span className="flex-1 text-[15px] text-foreground">Mover las tareas pendientes al Inbox</span>
        <Switch checked={moveToInbox} onCheckedChange={onMoveToInboxChange} aria-label="Mover las tareas pendientes al Inbox" />
      </div>
      <Button variant="danger" onClick={onConfirm}>Eliminar proyecto</Button>
      <Button variant="ghost" onClick={onClose}>Cancelar</Button>
    </ConfirmDialog>
  )
}
