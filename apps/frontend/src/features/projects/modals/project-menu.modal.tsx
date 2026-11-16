import { RiAddLine, RiDeleteBinLine, RiPencilLine } from "@remixicon/react"
import { ActionRow } from "@/shared/components/molecules/action-row"
import { BottomSheet } from "@/shared/components/molecules/bottom-sheet"
import { SheetHeading } from "@/shared/components/molecules/sheet-heading"

type ProjectMenuModalProps = {
  name?: string
  onClose: () => void
  onEdit: () => void
  onAddTask: () => void
  onNewSection?: () => void
  onDelete: () => void
}

export function ProjectMenuModal({ name, onClose, onEdit, onAddTask, onNewSection, onDelete }: ProjectMenuModalProps) {
  return (
    <BottomSheet open={name !== undefined} onOpenChange={(open) => !open && onClose()} label="Opciones del proyecto" className="gap-2 pb-7">
      <SheetHeading eyebrow="Proyecto" title={name ?? ""} />
      <ActionRow icon={<RiPencilLine aria-hidden />} onClick={onEdit}>Editar proyecto</ActionRow>
      <ActionRow icon={<RiAddLine aria-hidden />} onClick={onAddTask}>Añadir tarea</ActionRow>
      {onNewSection && <ActionRow icon={<RiAddLine aria-hidden />} onClick={onNewSection}>Nueva sección</ActionRow>}
      <div className="my-1 h-px bg-border" />
      <ActionRow icon={<RiDeleteBinLine aria-hidden />} tone="danger" onClick={onDelete}>Eliminar proyecto</ActionRow>
    </BottomSheet>
  )
}
