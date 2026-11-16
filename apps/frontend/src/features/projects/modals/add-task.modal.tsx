import { RiFolderLine } from "@remixicon/react"
import { BottomSheet } from "@/shared/components/molecules/bottom-sheet"
import { ComposeForm } from "@/shared/components/organisms/compose-form"

type AddTaskModalProps = {
  open: boolean
  sectionName?: string
  onClose: () => void
  onSave: (title: string, description: string) => Promise<string | undefined>
}

export function AddTaskModal({ open, sectionName, onClose, onSave }: AddTaskModalProps) {
  return (
    <BottomSheet open={open} onOpenChange={(next) => !next && onClose()} label="Nueva tarea">
      {open && (
        <ComposeForm
          placeholder={sectionName ? "¿Qué hay que hacer?" : "Nueva tarea"}
          chip={
            sectionName && (
              <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-selected px-3.5 text-sm font-semibold text-foreground [&_svg]:size-[18px]">
                <RiFolderLine aria-hidden />
                {sectionName}
              </span>
            )
          }
          onSave={onSave}
        />
      )}
    </BottomSheet>
  )
}
