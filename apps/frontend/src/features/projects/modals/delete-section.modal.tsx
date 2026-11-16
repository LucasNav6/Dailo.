import { RiCheckboxBlankCircleLine, RiRadioButtonLine } from "@remixicon/react"
import { Button } from "@/shared/components/atoms/button"
import { ConfirmDialog } from "@/shared/components/molecules/confirm-dialog"
import { cn } from "@/shared/libs/utils"
import type { Section } from "@/shared/models/section.model"
import type { DeleteSectionMode } from "../hooks/delete-section.hook"

type DeleteSectionModalProps = {
  section: Section | null
  taskCount: number
  mode: DeleteSectionMode
  onModeChange: (mode: DeleteSectionMode) => void
  onClose: () => void
  onConfirm: () => void
}

export function DeleteSectionModal({ section, taskCount, mode, onModeChange, onClose, onConfirm }: DeleteSectionModalProps) {
  const options = [
    { mode: "keep", title: "Mover las tareas a “Sin sección”", note: "Se conservan en el proyecto" },
    { mode: "delete-tasks", title: `Eliminar también ${taskCount === 1 ? "la tarea" : `las ${taskCount} tareas`}`, note: "No se puede deshacer" },
  ] as const

  return (
    <ConfirmDialog
      open={section !== null}
      onOpenChange={(open) => !open && onClose()}
      title={`¿Eliminar la sección “${section?.name ?? ""}”?`}
      description={taskCount > 0 ? "La sección se elimina. Elegí qué pasa con sus tareas." : "La sección está vacía y se elimina."}
    >
      {taskCount > 0 && (
        <div role="radiogroup" aria-label="Qué pasa con las tareas" className="flex flex-col">
          {options.map((option) => {
            const selected = mode === option.mode
            const Icon = selected ? RiRadioButtonLine : RiCheckboxBlankCircleLine
            return (
              <button
                key={option.mode}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onModeChange(option.mode)}
                className="flex min-h-14 items-center gap-4 rounded-lg text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <span className={cn("inline-flex [&_svg]:size-[22px]", selected ? "text-foreground" : "text-muted-foreground")}>
                  <Icon aria-hidden />
                </span>
                <span className="flex flex-1 flex-col gap-px">
                  <span className="text-[17px] text-foreground">{option.title}</span>
                  <span className="text-sm text-muted-foreground">{option.note}</span>
                </span>
              </button>
            )
          })}
        </div>
      )}
      <Button variant="danger" onClick={onConfirm}>Eliminar sección</Button>
      <Button variant="ghost" className="h-11 px-2" onClick={onClose}>Cancelar</Button>
    </ConfirmDialog>
  )
}
