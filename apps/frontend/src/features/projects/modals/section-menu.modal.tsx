import { RiAddLine, RiArrowDownSLine, RiArrowUpSLine, RiDeleteBinLine, RiPencilLine } from "@remixicon/react"
import { ActionRow } from "@/shared/components/molecules/action-row"
import { BottomSheet } from "@/shared/components/molecules/bottom-sheet"
import { SheetHeading } from "@/shared/components/molecules/sheet-heading"
import type { Section } from "@/shared/models/section.model"

type SectionMenuModalProps = {
  section: Section | null
  pendingCount: number
  collapsed: boolean
  onClose: () => void
  onRename: () => void
  onAddTask: () => void
  onToggle: () => void
  onDelete: () => void
}

export function SectionMenuModal({ section, pendingCount, collapsed, onClose, onRename, onAddTask, onToggle, onDelete }: SectionMenuModalProps) {
  return (
    <BottomSheet open={section !== null} onOpenChange={(open) => !open && onClose()} label="Opciones de la sección" className="gap-1 pb-6">
      {section && (
        <>
          <SheetHeading
            title={section.name}
            subtitle={`Sección · ${pendingCount === 1 ? "1 tarea pendiente" : `${pendingCount} tareas pendientes`}`}
          />
          <ActionRow icon={<RiPencilLine aria-hidden />} onClick={onRename}>Renombrar</ActionRow>
          <ActionRow icon={<RiAddLine aria-hidden />} onClick={onAddTask}>Añadir tarea</ActionRow>
          <ActionRow icon={collapsed ? <RiArrowDownSLine aria-hidden /> : <RiArrowUpSLine aria-hidden />} onClick={onToggle}>
            {collapsed ? "Desplegar" : "Plegar"}
          </ActionRow>
          <div className="my-1 h-px bg-border" />
          <ActionRow icon={<RiDeleteBinLine aria-hidden />} tone="danger-soft" onClick={onDelete}>Eliminar sección</ActionRow>
        </>
      )}
    </BottomSheet>
  )
}
