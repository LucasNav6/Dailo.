import { RiDeleteBinLine } from "@remixicon/react"
import { ActionRow } from "@/shared/components/molecules/action-row"
import { BottomSheet } from "@/shared/components/molecules/bottom-sheet"
import { SheetHeading } from "@/shared/components/molecules/sheet-heading"

type TaskMenuModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onDelete: () => void
}

export function TaskMenuModal({ open, onOpenChange, title, onDelete }: TaskMenuModalProps) {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} label="Opciones de la tarea" className="gap-2 pb-7">
      <SheetHeading eyebrow="Tarea" title={title} />
      <ActionRow icon={<RiDeleteBinLine aria-hidden />} tone="danger" onClick={onDelete}>Eliminar tarea</ActionRow>
    </BottomSheet>
  )
}
